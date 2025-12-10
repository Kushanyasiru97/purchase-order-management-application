using System;
using System.ComponentModel.DataAnnotations;

namespace PurchaseOrderManagement.Application.DTOs
{
    public class CreatePurchaseOrderDto
    {
        [Required(ErrorMessage = "PO Number is required")]
        [StringLength(50, ErrorMessage = "PO Number cannot exceed 50 characters")]
        public string PoNumber { get; set; } = "";

        [Required(ErrorMessage = "PO Description is required")]
        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string PoDescription { get; set; } = "";

        [Required(ErrorMessage = "Supplier Name is required")]
        [StringLength(200, ErrorMessage = "Supplier Name cannot exceed 200 characters")]
        public string SupplierName { get; set; } = "";

        [Required(ErrorMessage = "Order Date is required")]
        public DateTime OrderDate { get; set; }

        [Required(ErrorMessage = "Total Amount is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Total amount must be a positive value")]
        public decimal TotalAmount { get; set; }

        [Required(ErrorMessage = "Status is required")]
        [StringLength(20, ErrorMessage = "Status cannot exceed 20 characters")]
        public string Status { get; set; } = "";
    }
}