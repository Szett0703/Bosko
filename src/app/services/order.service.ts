import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  Order,
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderRequest,
  OrderStatus,
  OrderListItem,
  OrderStats
} from '../models/order.model';
import { API_CONFIG } from '../config/api.config';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.orders}`;

  constructor(private http: HttpClient) { }

  // Crear nuevo pedido
  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    return this.http.post<ApiResponse<Order>>(this.baseUrl, orderData).pipe(
      map(response => response.data)
    );
  }

  // Obtener pedidos del usuario actual (usando customerId del token)
  getMyOrders(customerId: number): Observable<Order[]> {
    return this.http.get<ApiResponse<OrderListItem[]>>(`${this.baseUrl}/customer/${customerId}`).pipe(
      map(response => {
        // Convertir OrderListItem a Order (simplificado)
        return response.data.map(item => ({
          ...item,
          customerId: customerId,
          customerName: item.customerName,
          customerEmail: '',
          subtotal: 0,
          tax: 0,
          shippingCost: 0,
          items: [],
          shippingAddress: {
            fullName: '',
            phone: '',
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'México'
          },
          createdAt: item.date,
          updatedAt: item.date,
          trackingNumber: undefined,
          notes: undefined
        } as Order))
      })
    );
  }

  // Obtener pedidos con filtros (para admin)
  getOrders(filters?: {
    page?: number;
    pageSize?: number;
    status?: OrderStatus;
    search?: string;
    customerId?: number;
  }): Observable<OrderListItem[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.pageSize) params = params.set('pageSize', filters.pageSize.toString());
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.customerId) params = params.set('customerId', filters.customerId.toString());

    return this.http.get<ApiResponse<{ items: OrderListItem[] }>>(this.baseUrl, { params }).pipe(
      map(response => response.data.items)
    );
  }

  // Obtener detalles de un pedido específico
  getOrderById(id: number): Observable<Order> {
    return this.http.get<ApiResponse<Order>>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  // Actualizar estado del pedido (Admin/Employee)
  updateOrderStatus(id: number, status: OrderStatus, note?: string, trackingNumber?: string): Observable<Order> {
    return this.http.put<ApiResponse<Order>>(`${this.baseUrl}/${id}/status`, {
      status,
      note,
      trackingNumber
    }).pipe(
      map(response => response.data)
    );
  }

  // Cancelar pedido
  cancelOrder(id: number, reason: string): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/${id}/cancel`, { reason }).pipe(
      map(response => response.data)
    );
  }

  // Obtener estadísticas (Admin/Employee)
  getOrderStats(): Observable<OrderStats> {
    return this.http.get<ApiResponse<OrderStats>>(`${this.baseUrl}/stats`).pipe(
      map(response => response.data)
    );
  }
}
