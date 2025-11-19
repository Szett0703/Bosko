import { Product } from './product.model';

export interface WishlistItem {
  id: number;
  productId: number;
  product: Product;
  createdAt: Date;
}

export interface WishlistResponse {
  items: WishlistItem[];
}
