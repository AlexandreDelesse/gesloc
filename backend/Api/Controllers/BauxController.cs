using GeslocApi.Domain.Entities;
using GeslocApi.Infrastructure.MultiTenancy;
using GeslocApi.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BauxController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenant;

    public BauxController(AppDbContext db, ITenantContext tenant)
    {
        _db = db;
        _tenant = tenant;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? bienId, [FromQuery] Guid? locataireId)
    {
        var query = _db.Baux
            .Include(b => b.Bien)
            .Include(b => b.Locataire)
            .AsQueryable();

        if (bienId.HasValue) query = query.Where(b => b.BienId == bienId);
        if (locataireId.HasValue) query = query.Where(b => b.LocataireId == locataireId);

        return Ok(await query.ToListAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var bail = await _db.Baux
            .Include(b => b.Bien)
            .Include(b => b.Locataire)
            .Include(b => b.Paiements)
            .FirstOrDefaultAsync(b => b.Id == id);
        return bail is null ? NotFound() : Ok(bail);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateBailRequest req)
    {
        var bail = new Bail
        {
            Id = Guid.NewGuid(),
            TenantId = _tenant.TenantId,
            BienId = req.BienId,
            LocataireId = req.LocataireId,
            DateDebut = req.DateDebut,
            DateFin = req.DateFin,
            LoyerMensuel = req.LoyerMensuel,
            Charges = req.Charges,
            DepotGarantie = req.DepotGarantie,
        };

        _db.Baux.Add(bail);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = bail.Id }, bail);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateBailRequest req)
    {
        var bail = await _db.Baux.FirstOrDefaultAsync(b => b.Id == id);
        if (bail is null) return NotFound();

        bail.DateFin = req.DateFin;
        bail.LoyerMensuel = req.LoyerMensuel;
        bail.Charges = req.Charges;
        bail.DepotGarantie = req.DepotGarantie;
        bail.IsActif = req.IsActif;

        await _db.SaveChangesAsync();
        return Ok(bail);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var bail = await _db.Baux.FirstOrDefaultAsync(b => b.Id == id);
        if (bail is null) return NotFound();

        _db.Baux.Remove(bail);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record CreateBailRequest(
    Guid BienId,
    Guid LocataireId,
    DateOnly DateDebut,
    DateOnly? DateFin,
    decimal LoyerMensuel,
    decimal Charges,
    decimal? DepotGarantie
);

public record UpdateBailRequest(
    DateOnly? DateFin,
    decimal LoyerMensuel,
    decimal Charges,
    decimal? DepotGarantie,
    bool IsActif
);
