using PurchaseOrderManagement.Application.Common;
using PurchaseOrderManagement.Application.DTOs;
using PurchaseOrderManagement.Application.Interfaces.Repositories;
using PurchaseOrderManagement.Application.Interfaces.Services;
using PurchaseOrderManagement.Domain.Entities;

namespace PurchaseOrderManagement.Application.Services
{
    public class PurchaseOrderService : IPurchaseOrderService
    {
        private readonly IPurchaseOrderRepository _repo;

        public PurchaseOrderService(IPurchaseOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<ServiceResponse<IEnumerable<PurchaseOrderDto>>> GetAllPurchaseOrdersAsync()
        {
            try
            {
                var purchaseOrders = await _repo.GetAllAsync();
                var purchaseOrderDtos = purchaseOrders.Select(MapToDto);

                return ServiceResponse<IEnumerable<PurchaseOrderDto>>.SuccessResponse(
                    purchaseOrderDtos,
                    "Purchase orders retrieved successfully"
                );
            }
            catch (Exception ex)
            {
                return ServiceResponse<IEnumerable<PurchaseOrderDto>>.FailureResponse(
                    "Error retrieving purchase orders",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ServiceResponse<PurchaseOrderDto>> GetPurchaseOrderByIdAsync(int id)
        {
            try
            {
                var purchaseOrder = await _repo.GetByIdAsync(id);

                if (purchaseOrder == null)
                {
                    return ServiceResponse<PurchaseOrderDto>.FailureResponse(
                        "Purchase Order not found",
                        new List<string> { $"No purchase order found with ID: {id}" }
                    );
                }

                var dto = MapToDto(purchaseOrder);
                return ServiceResponse<PurchaseOrderDto>.SuccessResponse(
                    dto,
                    "Purchase order retrieved successfully"
                );
            }
            catch (Exception ex)
            {
                return ServiceResponse<PurchaseOrderDto>.FailureResponse(
                    "Error retrieving purchase order",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ServiceResponse<PurchaseOrderDto>> CreatePurchaseOrderAsync(CreatePurchaseOrderDto createDto)
        {
            try
            {
                // Check if PO Number already exists
                var exists = await _repo.PoNumberExistsAsync(createDto.PoNumber);
                if (exists)
                {
                    return ServiceResponse<PurchaseOrderDto>.FailureResponse(
                        $"PO Number '{createDto.PoNumber}' already exists. Please use a unique PO Number.",
                        new List<string> { "Duplicate PO Number" }
                    );
                }

                var purchaseOrder = MapToEntity(createDto);
                var createdOrder = await _repo.AddAsync(purchaseOrder);
                var dto = MapToDto(createdOrder);

                return ServiceResponse<PurchaseOrderDto>.SuccessResponse(
                    dto,
                    "Purchase order created successfully"
                );
            }
            catch (Exception ex)
            {
                return ServiceResponse<PurchaseOrderDto>.FailureResponse(
                    "Error creating purchase order",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ServiceResponse<PurchaseOrderDto>> UpdatePurchaseOrderAsync(UpdatePurchaseOrderDto updateDto)
        {
            try
            {
                // Check if purchase order exists
                var existingOrder = await _repo.GetByIdAsync(updateDto.PurchaseOrderId);
                if (existingOrder == null)
                {
                    return ServiceResponse<PurchaseOrderDto>.FailureResponse(
                        "Purchase Order not found",
                        new List<string> { $"No purchase order found with ID: {updateDto.PurchaseOrderId}" }
                    );
                }

                // Check if Po Number is duplicate
                var poNumberExists = await _repo.PoNumberExistsAsync(
                    updateDto.PoNumber,
                    updateDto.PurchaseOrderId
                );

                if (poNumberExists)
                {
                    return ServiceResponse<PurchaseOrderDto>.FailureResponse(
                        $"PO Number '{updateDto.PoNumber}' already exists. Please use a unique PO Number.",
                        new List<string> { "Duplicate PO Number" }
                    );
                }

                // Update 
                existingOrder.PoNumber = updateDto.PoNumber;
                existingOrder.PoDescription = updateDto.PoDescription;
                existingOrder.SupplierName = updateDto.SupplierName;
                existingOrder.OrderDate = updateDto.OrderDate;
                existingOrder.TotalAmount = updateDto.TotalAmount;
                existingOrder.Status = updateDto.Status;

                var updatedOrder = await _repo.UpdateAsync(existingOrder);
                var dto = MapToDto(updatedOrder);

                return ServiceResponse<PurchaseOrderDto>.SuccessResponse(
                    dto,
                    "Purchase order updated successfully"
                );
            }
            catch (Exception ex)
            {
                return ServiceResponse<PurchaseOrderDto>.FailureResponse(
                    "Error updating purchase order",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ServiceResponse<bool>> DeletePurchaseOrderAsync(int id)
        {
            try
            {
                var exists = await _repo.GetByIdAsync(id);
                if (exists == null)
                {
                    return ServiceResponse<bool>.FailureResponse(
                        "Purchase Order not found",
                        new List<string> { $"No purchase order found with ID: {id}" }
                    );
                }

                var deleted = await _repo.DeleteAsync(id);

                return ServiceResponse<bool>.SuccessResponse(
                    deleted,
                    "Purchase order deleted successfully"
                );
            }
            catch (Exception ex)
            {
                return ServiceResponse<bool>.FailureResponse(
                    "Error deleting purchase order",
                    new List<string> { ex.Message }
                );
            }
        }

        private PurchaseOrderDto MapToDto(PurchaseOrder entity)
        {
            return new PurchaseOrderDto
            {
                PurchaseOrderId = entity.PurchaseOrderId,
                PoNumber = entity.PoNumber,
                PoDescription = entity.PoDescription,
                SupplierName = entity.SupplierName,
                OrderDate = entity.OrderDate,
                TotalAmount = entity.TotalAmount,
                Status = entity.Status
            };
        }

        private PurchaseOrder MapToEntity(CreatePurchaseOrderDto dto)
        {
            return new PurchaseOrder
            {
                PoNumber = dto.PoNumber,
                PoDescription = dto.PoDescription,
                SupplierName = dto.SupplierName,
                OrderDate = dto.OrderDate,
                TotalAmount = dto.TotalAmount,
                Status = dto.Status
            };
        }
    }
}