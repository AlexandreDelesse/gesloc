namespace GeslocApi.Domain.Entities;

public class Locataire
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public string Nom { get; set; } = "";
    public string Prenom { get; set; } = "";
    public string? Email { get; set; }
    public string? Telephone { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Bail> Baux { get; set; } = [];
}
