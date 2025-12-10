using Microsoft.EntityFrameworkCore;
using PurchaseOrderManagement.Application.Interfaces.Repositories;
using PurchaseOrderManagement.Domain.Entities;
using PurchaseOrderManagement.Infrastructure.Data;

namespace PurchaseOrderManagement.Infrastructure.Repositories
{
    public class PurchaseOrderRepository : IPurchaseOrderRepository
    {
        private readonly PurchaseOrderDbContext _context;

        public PurchaseOrderRepository(PurchaseOrderDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PurchaseOrder>> GetAllAsync()
        {
            return await _context.PurchaseOrders
                .OrderByDescending(po => po.OrderDate)
                .ToListAsync();
        }

        public async Task<PurchaseOrder?> GetByIdAsync(int id)
        {
            return await _context.PurchaseOrders
                .FirstOrDefaultAsync(po => po.PurchaseOrderId == id);
        }

        public async Task<PurchaseOrder?> GetByPoNumberAsync(string poNumber)
        {
            return await _context.PurchaseOrders
                .FirstOrDefaultAsync(po => po.PoNumber == poNumber);
        }

        public async Task<bool> PoNumberExistsAsync(string poNumber, int? excludeId = null)
        {
            if (excludeId.HasValue)
            {
                return await _context.PurchaseOrders
                    .AnyAsync(po => po.PoNumber == poNumber && po.PurchaseOrderId != excludeId.Value);
            }

            return await _context.PurchaseOrders
                .AnyAsync(po => po.PoNumber == poNumber);
        }

        public async Task<PurchaseOrder> AddAsync(PurchaseOrder purchaseOrder)
        {
            await _context.PurchaseOrders.AddAsync(purchaseOrder);
            await _context.SaveChangesAsync();
            return purchaseOrder;
        }

        public async Task<PurchaseOrder> UpdateAsync(PurchaseOrder purchaseOrder)
        {
            _context.PurchaseOrders.Update(purchaseOrder);
            await _context.SaveChangesAsync();
            return purchaseOrder;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var purchaseOrder = await GetByIdAsync(id);
            if (purchaseOrder == null)
            {
                return false;
            }

            _context.PurchaseOrders.Remove(purchaseOrder);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}