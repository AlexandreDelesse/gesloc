using GeslocApi.Infrastructure.MultiTenancy;
using GeslocApi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

// Required by EF Core design-time tools (dotnet ef migrations add).
// At design-time there is no HTTP request, so ITenantContext cannot be resolved
// from the DI container — we supply a stub with a zero GUID instead.
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql("Host=localhost;Database=gesloc;Username=gesloc;Password=changeme")
            .Options;

        var stubTenant = new TenantContext { TenantId = Guid.Empty };
        return new AppDbContext(options, stubTenant);
    }
}
