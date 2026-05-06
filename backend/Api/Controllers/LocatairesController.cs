using GeslocApi.Domain.Entities;
using GeslocApi.Infrastructure.MultiTenancy;
using GeslocApi.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LocatairesController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenant;

    public LocatairesController(AppDbContext db, ITenantContext tenant)
    {
        _db = db;
        _tenant = tenant;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var locataires = await _db.Locataires.Include(l => l.Baux).ToListAsync();
        return Ok(locataires);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var locataire = await _db.Locataires
            .Include(l => l.Baux).ThenInclude(b => b.Bien)
            .FirstOrDefaultAsync(l => l.Id == id);
        return locataire is null ? NotFound() : Ok(locataire);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateLocataireRequest req)
    {
        var locataire = new Locataire
        {
            Id = Guid.NewGuid(),
            TenantId = _tenant.TenantId,
            Nom = req.Nom,
            Prenom = req.Prenom,
            Email = req.Email,
            Telephone = req.Telephone,
        };

        _db.Locataires.Add(locataire);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = locataire.Id }, locataire);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateLocataireRequest req)
    {
        var locataire = await _db.Locataires.FirstOrDefaultAsync(l => l.Id == id);
        if (locataire is null) return NotFound();

        locataire.Nom = req.Nom;
        locataire.Prenom = req.Prenom;
        locataire.Email = req.Email;
        locataire.Telephone = req.Telephone;

        await _db.SaveChangesAsync();
        return Ok(locataire);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var locataire = await _db.Locataires.FirstOrDefaultAsync(l => l.Id == id);
        if (locataire is null) return NotFound();

        _db.Locataires.Remove(locataire);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record CreateLocataireRequest(
    string Nom,
    string Prenom,
    string? Email,
    string? Telephone
);

public record UpdateLocataireRequest(
    string Nom,
    string Prenom,
    string? Email,
    string? Telephone
);
