namespace GeslocApi.Domain.Entities;

public enum TypeBien { Appartement, Maison, Studio, Autre }

public class Bien
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    // Nullable until Phase 4 adds the Bailleur selector in the frontend form
    public Guid? BailleurId { get; set; }
    public string Nom { get; set; } = "";
    public TypeBien Type { get; set; }
    public decimal Surface { get; set; }
    public decimal? Loyer { get; set; }
    public AdresseVo Adresse { get; set; } = new();
    public string? ImageBase64 { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Bailleur? Bailleur { get; set; };
    public ICollection<Bail> Baux { get; set; } = [];
}
