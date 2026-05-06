namespace GeslocApi.Domain.Entities;

public class Bail
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid BienId { get; set; }
    public Guid LocataireId { get; set; }
    public DateOnly DateDebut { get; set; }
    public DateOnly? DateFin { get; set; }
    public decimal LoyerMensuel { get; set; }
    public decimal Charges { get; set; }
    public decimal? DepotGarantie { get; set; }
    public bool IsActif { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Bien Bien { get; set; } = null!;
    public Locataire Locataire { get; set; } = null!;
    public ICollection<Paiement> Paiements { get; set; } = [];
}
