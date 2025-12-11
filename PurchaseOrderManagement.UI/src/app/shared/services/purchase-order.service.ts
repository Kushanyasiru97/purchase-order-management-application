import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  private url: string = environment.apiBaseUrl + 'PurchaseOrder';

  constructor(private http: HttpClient) { }

  // Get all purchase orders
  getPurchaseOrders(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  // Create purchase order
  createPurchaseOrder(order: any): Observable<any> {
    return this.http.post<any>(this.url, order);
  }

  // Update purchase order
  updatePurchaseOrder(id: number, order: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${order.purchaseOrderId}`, order);
  }

  // Delete a purchase order by ID
  deletePurchaseOrder(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}