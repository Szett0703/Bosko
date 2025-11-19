/**
 * Product interface matching backend API
 */
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  categoryId?: number;
  categoryName?: string;
  inStock?: boolean;
  createdAt: Date;
}

/**
 * DTO for creating/updating products
 */
export interface ProductCreateDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  categoryId?: number;
}

/**
 * Product filters for admin list
 */
export interface ProductFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'Name' | 'Price' | 'Stock' | 'CreatedAt';
  sortDescending?: boolean;
}
