using PurchaseOrderManagement.Application.Common;
using PurchaseOrderManagement.Application.DTOs;

namespace PurchaseOrderManagement.Application.Interfaces.Services
{
    public interface IPurchaseOrderService
    {
        Task<ServiceResponse<IEnumerable<PurchaseOrderDto>>> GetAllPurchaseOrdersAsync();
        Task<ServiceResponse<PurchaseOrderDto>> GetPurchaseOrderByIdAsync(int id);
        Task<ServiceResponse<PurchaseOrderDto>> CreatePurchaseOrderAsync(CreatePurchaseOrderDto createDto);
        Task<ServiceResponse<PurchaseOrderDto>> UpdatePurchaseOrderAsync(UpdatePurchaseOrderDto updateDto);
        Task<ServiceResponse<bool>> DeletePurchaseOrderAsync(int id);
    }
}