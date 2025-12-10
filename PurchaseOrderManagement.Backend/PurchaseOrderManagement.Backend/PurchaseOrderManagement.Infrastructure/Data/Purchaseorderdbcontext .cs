using Microsoft.EntityFrameworkCore;
using PurchaseOrderManagement.Domain.Entities;

namespace PurchaseOrderManagement.Infrastructure.Data
{
    public class PurchaseOrderDbContext : DbContext
    {
        public PurchaseOrderDbContext(DbContextOptions<PurchaseOrderDbContext> options) : base(options)
        {
        }

        public DbSet<PurchaseOrder> PurchaseOrders { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<PurchaseOrder>(entity =>
            {
                entity.HasKey(e => e.PurchaseOrderId);
                entity.HasIndex(e => e.PoNumber).IsUnique();
            });
        }
    }
}