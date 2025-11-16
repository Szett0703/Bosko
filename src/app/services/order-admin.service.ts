import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://localhost:5006';

interface OrderListResponse {
  orders: Array<{
    id: number;
    customerName: string;
    customerEmail: string;
    items: number;
    amount: number;
    status: 'pending' | 'processing' | 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt: string;
  }>;
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

interface OrderDetailResponse {
  id: number;
  customerName: string;
  customerEmail: string;
  items: number;
  amount: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderItems: Array<{
    productId: number;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    imageUrl: string;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note: string;
  }>;
}

interface UpdateStatusResponse {
  id: number;
  status: string;
  updatedAt: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderAdminService {
  private apiUrl = `${API_URL}/api/admin/orders`;

  constructor(private http: HttpClient) {}

  /**
   * Get paginated list of orders with optional filters
   * @param page Page number (1-indexed)
   * @param limit Items per page
   * @param status Optional status filter (pending, processing, delivered, cancelled)
   * @param search Optional search query (customer name, email, or order ID)
   */
  getOrders(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Observable<OrderListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (status && status !== 'all') {
      params = params.set('status', status);
    }
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<OrderListResponse>(this.apiUrl, { params });
  }

  /**
   * Get detailed information for a specific order
   * @param id Order ID
   */
  getOrderDetails(id: number): Observable<OrderDetailResponse> {
    return this.http.get<OrderDetailResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update the status of an order
   * @param id Order ID
   * @param status New status (pending, processing, delivered, cancelled)
   * @param note Optional note about the status change
   */
  updateOrderStatus(
    id: number,
    status: string,
    note?: string
  ): Observable<UpdateStatusResponse> {
    const body: any = { status };
    if (note && note.trim()) {
      body.note = note.trim();
    }
    return this.http.put<UpdateStatusResponse>(`${this.apiUrl}/${id}/status`, body);
  }
}
