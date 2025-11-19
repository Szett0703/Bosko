import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.interface';
import { Category, CategoryCreateDto, SimpleCategoryDto } from '../models/category.model';

/**
 * Service for admin category management
 * Handles all CRUD operations for categories
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryAdminService {
  private apiUrl = `${API_CONFIG.backendUrl}/api/admin/categories`;

  constructor(private http: HttpClient) {}

  /**
   * Get all categories with product count
   * @returns Observable with array of categories
   */
  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(this.apiUrl);
  }

  /**
   * Get simplified list of categories (for dropdowns)
   * @returns Observable with array of simple categories
   */
  getSimpleCategories(): Observable<ApiResponse<SimpleCategoryDto[]>> {
    return this.http.get<ApiResponse<SimpleCategoryDto[]>>(`${this.apiUrl}/simple`);
  }

  /**
   * Get category by ID
   * @param id - Category ID
   * @returns Observable with category details
   */
  getCategoryById(id: number): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new category
   * @param category - Category data
   * @returns Observable with created category
   */
  createCategory(category: CategoryCreateDto): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.apiUrl, category);
  }

  /**
   * Update existing category
   * @param id - Category ID
   * @param category - Updated category data
   * @returns Observable with updated category
   */
  updateCategory(id: number, category: CategoryCreateDto): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/${id}`, category);
  }

  /**
   * Delete category
   * Will fail if category has associated products
   * @param id - Category ID
   * @returns Observable with deletion result
   */
  deleteCategory(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}
