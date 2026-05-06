namespace GeslocApi.Infrastructure.MultiTenancy;

public interface ITenantContext
{
    Guid TenantId { get; }
}
