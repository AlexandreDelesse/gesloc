namespace GeslocApi.Domain.Entities;

public enum StatutPaiement { Paye, EnAttente, Retard }

public class Paiement
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid BailId { get; set; }
    // First day of the month this payment covers (e.g. 2025-01-01 = January 2025)
    public DateOnly Mois { get; set; }
    public decimal Montant { get; set; }
    public StatutPaiement Statut { get; set; }
    public DateOnly? DatePaiement { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Bail Bail { get; set; } = null!;
}
