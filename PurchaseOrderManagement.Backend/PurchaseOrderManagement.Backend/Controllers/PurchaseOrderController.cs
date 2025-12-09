using Microsoft.AspNetCore.Mvc;
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
        public IActionResult CreatePurchaseOrder(PurchaseOrders orders)
        {
            _context.PurchaseOrders.Add(orders);
            _context.SaveChanges();
            return Ok(orders);
        }

        [HttpPut]
        public IActionResult UpdatePurchaseOrder(PurchaseOrders orders)
        {
            var purchaseOrderRecord = _context.PurchaseOrders.Find(orders.purchaseOrderId);
            if(purchaseOrderRecord == null)
            {
                var notFoundResponse = new
                {
                    Status = "Error",
                    Message = "Purchase Order Record Not Found!"
                };
                return NotFound(notFoundResponse);
            }
            else
            {
                purchaseOrderRecord.poNumber = orders.poNumber;
                purchaseOrderRecord.supplierName = orders.supplierName;
                purchaseOrderRecord.poDescription = orders.poDescription;
                purchaseOrderRecord.orderDate = orders.orderDate;
                purchaseOrderRecord.totalAmount = orders.totalAmount;
                purchaseOrderRecord.status = orders.status;
                return Ok(purchaseOrderRecord);
            }
        }

        [HttpDelete]
        public  IActionResult  DeleteOrderById(int id)
        {
            var purchaseOrder = _context.PurchaseOrders.Find(id);
            if(purchaseOrder != null)
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