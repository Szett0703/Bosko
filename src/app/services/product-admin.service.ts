import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.interface';
import { PagedResponse } from '../models/paged-response.interface';
import { Product, ProductCreateDto, ProductFilters } from '../models/product.model';

/**
 * Service for admin product management
 * Handles all CRUD operations and filtering for products
 */
@Injectable({
  providedIn: 'root'
})
export class ProductAdminService {
  private apiUrl = `${API_CONFIG.backendUrl}/api/admin/products`;

  constructor(private http: HttpClient) {}

  /**
   * Get paginated list of products with filters
   * @param filters - Optional filters (search, categoryId, inStock, price range, sorting)
   * @returns Observable with paginated products
   */
  getProducts(filters?: ProductFilters): Observable<ApiResponse<PagedResponse<Product>>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
      if (filters.search) params = params.set('search', filters.search);
      if (filters.categoryId) params = params.set('categoryId', filters.categoryId.toString());
      if (filters.inStock !== undefined) params = params.set('inStock', filters.inStock.toString());
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortDescending !== undefined) params = params.set('sortDescending', filters.sortDescending.toString());
    }

    return this.http.get<ApiResponse<PagedResponse<Product>>>(this.apiUrl, { params });
  }

  /**
   * Get product by ID
   * @param id - Product ID
   * @returns Observable with product details
   */
  getProductById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get products by category
   * @param categoryId - Category ID
   * @returns Observable with array of products
   */
  getProductsByCategory(categoryId: number): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/by-category/${categoryId}`);
  }

  /**
   * Create new product
   * @param product - Product data
   * @returns Observable with created product
   */
  createProduct(product: ProductCreateDto): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, product);
  }

  /**
   * Update existing product
   * @param id - Product ID
   * @param product - Updated product data
   * @returns Observable with updated product
   */
  updateProduct(id: number, product: ProductCreateDto): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Delete product
   * @param id - Product ID
   * @returns Observable with deletion result
   */
  deleteProduct(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}
