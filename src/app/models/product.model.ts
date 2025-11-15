export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  categoryId?: number;
  stock?: number;
  createdAt?: Date;
}
