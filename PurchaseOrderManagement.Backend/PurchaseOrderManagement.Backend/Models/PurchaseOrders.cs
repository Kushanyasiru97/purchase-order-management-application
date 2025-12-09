using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net.NetworkInformation;

namespace PurchaseOrderManagement.Backend.Models
{

    [Table("PurchaseOrders")]
    public class PurchaseOrders
    {
        [Key]
        public int purchaseOrderId { get; set; }

        [Required]
        [Column(TypeName = "uniqueidentifier")]
        public Guid poNumber { get; set; }

        [Required]
        [StringLength(500)]
        public string poDescription { get; set; }

        [Required]
        [StringLength(200)]
        public string supplierName { get; set; }

        [Required]
        public DateTime orderDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal totalAmount { get; set; }

        [Required]
        [StringLength(20)]
        public string status { get; set; }
    }
}
