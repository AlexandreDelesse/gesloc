using GeslocApi.Domain.Entities;
using GeslocApi.Infrastructure.MultiTenancy;
using GeslocApi.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaiementsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenant;

    public PaiementsController(AppDbContext db, ITenantContext tenant)
    {
        _db = db;
        _tenant = tenant;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? bailId, [FromQuery] int? annee)
    {
        var query = _db.Paiements.AsQueryable();
        if (bailId.HasValue) query = query.Where(p => p.BailId == bailId);
        if (annee.HasValue) query = query.Where(p => p.Mois.Year == annee);
        return Ok(await query.OrderBy(p => p.Mois).ToListAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var paiement = await _db.Paiements.FirstOrDefaultAsync(p => p.Id == id);
        return paiement is null ? NotFound() : Ok(paiement);
    }

    // Upsert: creates or updates the payment for a given lease + month
    [HttpPost]
    public async Task<IActionResult> Upsert(UpsertPaiementRequest req)
    {
        var existing = await _db.Paiements
            .FirstOrDefaultAsync(p => p.BailId == req.BailId && p.Mois == req.Mois);

        if (existing is not null)
        {
            existing.Statut = req.Statut;
            existing.Montant = req.Montant;
            existing.DatePaiement = req.DatePaiement;
            await _db.SaveChangesAsync();
            return Ok(existing);
        }

        var paiement = new Paiement
        {
            Id = Guid.NewGuid(),
            TenantId = _tenant.TenantId,
            BailId = req.BailId,
            Mois = req.Mois,
            Montant = req.Montant,
            Statut = req.Statut,
            DatePaiement = req.DatePaiement,
        };

        _db.Paiements.Add(paiement);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = paiement.Id }, paiement);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var paiement = await _db.Paiements.FirstOrDefaultAsync(p => p.Id == id);
        if (paiement is null) return NotFound();

        _db.Paiements.Remove(paiement);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record UpsertPaiementRequest(
    Guid BailId,
    DateOnly Mois,
    decimal Montant,
    StatutPaiement Statut,
    DateOnly? DatePaiement
);
