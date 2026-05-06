using GeslocApi.Domain.Entities;
using GeslocApi.Infrastructure.MultiTenancy;
using GeslocApi.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BiensController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenant;

    public BiensController(AppDbContext db, ITenantContext tenant)
    {
        _db = db;
        _tenant = tenant;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var biens = await _db.Biens.Include(b => b.Bailleur).ToListAsync();
        return Ok(biens);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var bien = await _db.Biens.Include(b => b.Bailleur).FirstOrDefaultAsync(b => b.Id == id);
        return bien is null ? NotFound() : Ok(bien);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateBienRequest req)
    {
        var bien = new Bien
        {
            Id = Guid.NewGuid(),
            TenantId = _tenant.TenantId,
            BailleurId = req.BailleurId,
            Nom = req.Nom,
            Type = req.Type,
            Surface = req.Surface,
            Loyer = req.Loyer,
            Adresse = req.Adresse,
            ImageBase64 = req.ImageBase64,
        };

        _db.Biens.Add(bien);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = bien.Id }, bien);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateBienRequest req)
    {
        var bien = await _db.Biens.FirstOrDefaultAsync(b => b.Id == id);
        if (bien is null) return NotFound();

        bien.BailleurId = req.BailleurId;
        bien.Nom = req.Nom;
        bien.Type = req.Type;
        bien.Surface = req.Surface;
        bien.Loyer = req.Loyer;
        bien.Adresse = req.Adresse;
        bien.ImageBase64 = req.ImageBase64;
        bien.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(bien);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var bien = await _db.Biens.FirstOrDefaultAsync(b => b.Id == id);
        if (bien is null) return NotFound();

        _db.Biens.Remove(bien);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record CreateBienRequest(
    Guid? BailleurId,
    string Nom,
    TypeBien Type,
    decimal Surface,
    decimal? Loyer,
    AdresseVo Adresse,
    string? ImageBase64
);

public record UpdateBienRequest(
    Guid? BailleurId,
    string Nom,
    TypeBien Type,
    decimal Surface,
    decimal? Loyer,
    AdresseVo Adresse,
    string? ImageBase64
);
