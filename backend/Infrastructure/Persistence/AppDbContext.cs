using GeslocApi.Domain.Entities;
using GeslocApi.Infrastructure.MultiTenancy;
using Microsoft.EntityFrameworkCore;

namespace GeslocApi.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    private readonly ITenantContext _tenantContext;

    public AppDbContext(DbContextOptions<AppDbContext> options, ITenantContext tenantContext)
        : base(options)
    {
        _tenantContext = tenantContext;
    }

    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<Bailleur> Bailleurs => Set<Bailleur>();
    public DbSet<Bien> Biens => Set<Bien>();
    public DbSet<Locataire> Locataires => Set<Locataire>();
    public DbSet<Bail> Baux => Set<Bail>();
    public DbSet<Paiement> Paiements => Set<Paiement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Global Query Filters: every query on tenant-scoped tables is automatically
        // filtered by the current tenant_id. No controller ever needs to add a WHERE clause.
        modelBuilder.Entity<Bailleur>().HasQueryFilter(e => e.TenantId == _tenantContext.TenantId);
        modelBuilder.Entity<Bien>().HasQueryFilter(e => e.TenantId == _tenantContext.TenantId);
        modelBuilder.Entity<Locataire>().HasQueryFilter(e => e.TenantId == _tenantContext.TenantId);
        modelBuilder.Entity<Bail>().HasQueryFilter(e => e.TenantId == _tenantContext.TenantId);
        modelBuilder.Entity<Paiement>().HasQueryFilter(e => e.TenantId == _tenantContext.TenantId);

        modelBuilder.Entity<Bien>().OwnsOne(b => b.Adresse);
        modelBuilder.Entity<Bailleur>().OwnsOne(b => b.Adresse);

        // Unique constraint: one payment record per lease per month
        modelBuilder.Entity<Paiement>()
            .HasIndex(p => new { p.BailId, p.Mois })
            .IsUnique();
    }
}
