using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PurchaseOrderManagement.Backend.Models;

namespace PurchaseOrderManagement.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseOrderController : ControllerBase
    {
        private readonly PurchaseOrderDbContext _context;

        public PurchaseOrderController(PurchaseOrderDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetPurchaseOrders()
        {
            var purchaseOrders = _context.PurchaseOrders.ToList();
            return Ok(purchaseOrders);
        }

        [HttpPost]
        public IActionResult CreatePurchaseOrder(PurchaseOrder orders)
        {
            // Check if PO Number already exists
            var existingPo = _context.PurchaseOrders
                .FirstOrDefault(po => po.PoNumber == orders.PoNumber);

            if (existingPo != null)
            {
                var duplicateResponse = new
                {
                    Status = "Error",
                    Message = $"PO Number '{orders.PoNumber}' already exists. Please use a unique PO Number."
                };
                return BadRequest(duplicateResponse);
            }

            _context.PurchaseOrders.Add(orders);
            _context.SaveChanges();
            return Ok(orders);
        }

        [HttpPut]
        public IActionResult UpdatePurchaseOrder(PurchaseOrder orders)
        {
            var purchaseOrderRecord = _context.PurchaseOrders.Find(orders.PurchaseOrderId);
            if (purchaseOrderRecord == null)
            {
                var notFoundResponse = new
                {
                    Status = "Error",
                    Message = "Purchase Order Record Not Found!"
                };
                return NotFound(notFoundResponse);
            }

            // Check if the new PO Number conflicts with another record
            var existingPo = _context.PurchaseOrders
                .FirstOrDefault(po => po.PoNumber == orders.PoNumber
                                   && po.PurchaseOrderId != orders.PurchaseOrderId);

            if (existingPo != null)
            {
                var duplicateResponse = new
                {
                    Status = "Error",
                    Message = $"PO Number '{orders.PoNumber}' already exists. Please use a unique PO Number."
                };
                return BadRequest(duplicateResponse);
            }

            purchaseOrderRecord.PoNumber = orders.PoNumber;
            purchaseOrderRecord.SupplierName = orders.SupplierName;
            purchaseOrderRecord.PoDescription = orders.PoDescription;
            purchaseOrderRecord.OrderDate = orders.OrderDate;
            purchaseOrderRecord.TotalAmount = orders.TotalAmount;
            purchaseOrderRecord.Status = orders.Status;

            _context.SaveChanges();
            return Ok(purchaseOrderRecord);
        }

        [HttpDelete]
        public IActionResult DeleteOrderById(int id)
        {
            var purchaseOrder = _context.PurchaseOrders.Find(id);
            if (purchaseOrder != null)
            {
                _context.PurchaseOrders.Remove(purchaseOrder);
                _context.SaveChanges();
                return Ok(purchaseOrder);
            }
            else
            {
                var notFoundResponse = new
                {
                    Status = "Error",
                    Message = "Purchase Order Record Not Found!"
                };
                return NotFound(notFoundResponse);
            }
        }
    }
}