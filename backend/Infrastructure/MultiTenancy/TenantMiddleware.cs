using Microsoft.AspNetCore.Authorization;

namespace GeslocApi.Infrastructure.MultiTenancy;

// Runs after JWT authentication. Reads the tenant_id claim injected by Keycloak
// and populates ITenantContext so every DB query is automatically scoped.
// Skips [AllowAnonymous] endpoints (e.g. GET /api/dashboard/health).
public class TenantMiddleware
{
    private readonly RequestDelegate _next;

    public TenantMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, TenantContext tenantContext)
    {
        var endpoint = context.GetEndpoint();
        var isAnonymous = endpoint?.Metadata.GetMetadata<IAllowAnonymous>() is not null;

        if (isAnonymous)
        {
            await _next(context);
            return;
        }

        var claim = context.User.FindFirst("tenant_id");

        if (claim == null || !Guid.TryParse(claim.Value, out var tenantId))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Missing or invalid tenant_id claim.");
            return;
        }

        tenantContext.TenantId = tenantId;
        await _next(context);
    }
}
