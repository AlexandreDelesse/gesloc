using GeslocApi.Infrastructure.MultiTenancy;
using GeslocApi.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- Controllers & API docs ---
// camelCase JSON by default — matches frontend expectations (nom → nom, not Nom)
builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- PostgreSQL via EF Core ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- Multi-tenancy ---
// TenantContext is scoped: one instance per HTTP request, populated by TenantMiddleware
builder.Services.AddScoped<TenantContext>();
builder.Services.AddScoped<ITenantContext>(sp => sp.GetRequiredService<TenantContext>());

// --- Auth: validate Keycloak JWTs ---
// Keycloak adds tenant_id as a custom claim on the access token via a user attribute mapper.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Keycloak:Authority"];
        options.Audience = builder.Configuration["Keycloak:Audience"];
        options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
    });

builder.Services.AddAuthorization();

// --- CORS ---
var frontendOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(frontendOrigins).AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

// Apply pending EF Core migrations automatically on startup.
// Idempotent: skips migrations that are already applied.
// To generate a new migration: dotnet ef migrations add <Name> (see infra/scripts/migrate.sh)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

// TenantMiddleware runs after auth so the JWT user is available.
// It reads tenant_id from the token and injects it into TenantContext (scoped).
app.UseMiddleware<TenantMiddleware>();

app.MapControllers();
app.Run();
