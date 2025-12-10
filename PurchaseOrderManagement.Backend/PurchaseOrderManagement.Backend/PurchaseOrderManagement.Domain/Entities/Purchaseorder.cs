using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PurchaseOrderManagement.Domain.Entities
{
    [Table("PurchaseOrders")]
    public class PurchaseOrder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PurchaseOrderId { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(50)")]
        [StringLength(50)]
        public string PoNumber { get; set; } = "";

        [Required]
        [Column(TypeName = "nvarchar(500)")]
        public string PoDescription { get; set; } = "";

        [Required]
        [Column(TypeName = "nvarchar(200)")]
        public string SupplierName { get; set; } = "";

        [Required]
        public DateTime OrderDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        [Range(0, double.MaxValue, ErrorMessage = "Total amount must be a positive value")]
        public decimal TotalAmount { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(20)")]
        public string Status { get; set; } = "";
    }
}