export interface Order {
  id: number;
  date: Date;
  total: number;
  status: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface CreateOrderResponse {
  orderId: number;
  message: string;
}
