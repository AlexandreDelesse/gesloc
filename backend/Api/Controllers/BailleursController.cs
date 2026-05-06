using GeslocApi.Domain.Entities;
using GeslocApi.Infrastructure.MultiTenancy;
using GeslocApi.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BailleursController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenant;

    public BailleursController(AppDbContext db, ITenantContext tenant)
    {
        _db = db;
        _tenant = tenant;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var bailleurs = await _db.Bailleurs.ToListAsync();
        return Ok(bailleurs);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var bailleur = await _db.Bailleurs.FirstOrDefaultAsync(b => b.Id == id);
        return bailleur is null ? NotFound() : Ok(bailleur);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateBailleurRequest req)
    {
        var bailleur = new Bailleur
        {
            Id = Guid.NewGuid(),
            TenantId = _tenant.TenantId,
            Type = req.Type,
            Nom = req.Nom,
            Prenom = req.Prenom,
            RaisonSociale = req.RaisonSociale,
            FormeJuridique = req.FormeJuridique,
            Siret = req.Siret,
            Adresse = req.Adresse,
        };

        _db.Bailleurs.Add(bailleur);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = bailleur.Id }, bailleur);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateBailleurRequest req)
    {
        var bailleur = await _db.Bailleurs.FirstOrDefaultAsync(b => b.Id == id);
        if (bailleur is null) return NotFound();

        bailleur.Nom = req.Nom;
        bailleur.Prenom = req.Prenom;
        bailleur.RaisonSociale = req.RaisonSociale;
        bailleur.FormeJuridique = req.FormeJuridique;
        bailleur.Siret = req.Siret;
        bailleur.Adresse = req.Adresse;

        await _db.SaveChangesAsync();
        return Ok(bailleur);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var bailleur = await _db.Bailleurs.FirstOrDefaultAsync(b => b.Id == id);
        if (bailleur is null) return NotFound();

        _db.Bailleurs.Remove(bailleur);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record CreateBailleurRequest(
    TypeBailleur Type,
    string Nom,
    string? Prenom,
    string? RaisonSociale,
    string? FormeJuridique,
    string? Siret,
    AdresseVo Adresse
);

public record UpdateBailleurRequest(
    string Nom,
    string? Prenom,
    string? RaisonSociale,
    string? FormeJuridique,
    string? Siret,
    AdresseVo Adresse
);
