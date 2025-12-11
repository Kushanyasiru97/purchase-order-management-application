export interface PurchaseOrder {
  purchaseOrderId?: number;
  poNumber: string;
  poDescription: string;
  supplierName: string;
  orderDate: string | Date;
  totalAmount: number;
  status: string;
}