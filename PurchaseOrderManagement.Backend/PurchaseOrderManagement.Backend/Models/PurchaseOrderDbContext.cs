using Microsoft.EntityFrameworkCore;

namespace PurchaseOrderManagement.Backend.Models
{
    public class PurchaseOrderDbContext : DbContext
    {
        public PurchaseOrderDbContext(DbContextOptions<PurchaseOrderDbContext> options) : base(options)
        {
        }

        public DbSet<PurchaseOrders> PurchaseOrders { get; set; } = null!;
    }
}