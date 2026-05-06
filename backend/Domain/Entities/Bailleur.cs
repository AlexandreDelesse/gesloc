namespace GeslocApi.Domain.Entities;

public enum TypeBailleur { PersonnePhysique, PersonneMorale }

public class Bailleur
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public TypeBailleur Type { get; set; }

    // Personne physique
    public string Nom { get; set; } = "";
    public string? Prenom { get; set; }

    // Personne morale
    public string? RaisonSociale { get; set; }
    public string? FormeJuridique { get; set; }
    public string? Siret { get; set; }

    public AdresseVo Adresse { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Bien> Biens { get; set; } = [];
}
