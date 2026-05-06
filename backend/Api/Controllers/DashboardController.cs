using GeslocApi.Domain.Entities;
using GeslocApi.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;

    public DashboardController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var maintenant = DateOnly.FromDateTime(DateTime.UtcNow);
        var moisCourant = new DateOnly(maintenant.Year, maintenant.Month, 1);

        var biensTotal = await _db.Biens.CountAsync();

        var biensOccupes = await _db.Baux
            .Where(b => b.IsActif && b.DateDebut <= maintenant && (b.DateFin == null || b.DateFin >= maintenant))
            .Select(b => b.BienId)
            .Distinct()
            .CountAsync();

        var paiementsMois = await _db.Paiements
            .Where(p => p.Mois == moisCourant)
            .ToListAsync();

        var revenuMensuelBrut = paiementsMois
            .Where(p => p.Statut == StatutPaiement.Paye)
            .Sum(p => p.Montant);

        var paiementsEnAttente = paiementsMois.Count(p => p.Statut == StatutPaiement.EnAttente);
        var paiementsEnRetard = paiementsMois.Count(p => p.Statut == StatutPaiement.Retard);

        return Ok(new
        {
            biensTotal,
            biensOccupes,
            tauxOccupation = biensTotal == 0 ? 0 : Math.Round((double)biensOccupes / biensTotal, 2),
            revenuMensuelBrut,
            paiementsEnAttente,
            paiementsEnRetard,
        });
    }

    [HttpGet("health")]
    [AllowAnonymous]
    public IActionResult Health() => Ok(new { status = "ok", timestamp = DateTime.UtcNow });
}
