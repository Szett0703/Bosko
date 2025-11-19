// Estados del backend
export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';

// Métodos de pago del backend
export type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash';

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId?: number;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderRequest {
  customerId: number;
  items: {
    productId: number;
    productName: string;
    productImage?: string;
    quantity: number;
    unitPrice: number;
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface OrderListItem {
  id: number;
  orderNumber: string;
  customerName: string;
  date: string;
  status: OrderStatus;
  total: number;
  paymentMethod: PaymentMethod;
  itemsCount: number;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface UpdateOrderRequest {
  shippingAddress: ShippingAddress;
  notes?: string;
}

export interface CancelOrderRequest {
  reason: string;
}
