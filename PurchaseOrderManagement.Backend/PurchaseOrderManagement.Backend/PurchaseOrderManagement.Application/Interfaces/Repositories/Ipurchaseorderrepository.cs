using PurchaseOrderManagement.Domain.Entities;

namespace PurchaseOrderManagement.Application.Interfaces.Repositories
{
    public interface IPurchaseOrderRepository
    {
        Task<IEnumerable<PurchaseOrder>> GetAllAsync();
        Task<PurchaseOrder?> GetByIdAsync(int id);
        Task<PurchaseOrder?> GetByPoNumberAsync(string poNumber);
        Task<bool> PoNumberExistsAsync(string poNumber, int? excludeId = null);
        Task<PurchaseOrder> AddAsync(PurchaseOrder purchaseOrder);
        Task<PurchaseOrder> UpdateAsync(PurchaseOrder purchaseOrder);
        Task<bool> DeleteAsync(int id);
    }
}