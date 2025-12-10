import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PurchaseOrder {
  purchaseOrderId?: number;
  poNumber: string;
  poDescription: string;
  supplierName: string;
  orderDate: string | Date;
  totalAmount: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  private url: string = environment.apiBaseUrl + 'PurchaseOrder';

  constructor(private http: HttpClient) { }

  // Get all purchase orders
  getPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(this.url);
  }

  // Create a new purchase order
  createPurchaseOrder(order: PurchaseOrder): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(this.url, order);
  }

  // Update an existing purchase order
  updatePurchaseOrder(order: PurchaseOrder): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(this.url, order);
  }

  // Delete a purchase order by ID
  deletePurchaseOrder(id: number): Observable<PurchaseOrder> {
    return this.http.delete<PurchaseOrder>(`${this.url}?id=${id}`);
  }
}