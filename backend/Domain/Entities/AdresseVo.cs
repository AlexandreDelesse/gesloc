namespace GeslocApi.Domain.Entities;

// Owned value object — stored inline in the parent table (no separate table)
public class AdresseVo
{
    public int? Numero { get; set; }
    public string Rue { get; set; } = "";
    public string CodePostal { get; set; } = "";
    public string Ville { get; set; } = "";
    public string? Residence { get; set; }
}
