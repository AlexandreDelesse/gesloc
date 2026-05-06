namespace GeslocApi.Domain.Entities;

public class Tenant
{
    public Guid Id { get; set; }
    public string Email { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
