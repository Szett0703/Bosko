import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.interface';
import { PagedResponse } from '../models/paged-response.interface';
import { User, UserUpdateDto, UserRoleChangeDto, UserFilters } from '../models/user.model';

/**
 * Service for admin user management
 * Handles all user operations (CRUD, role changes, status toggle)
 */
@Injectable({
  providedIn: 'root'
})
export class UserAdminService {
  private apiUrl = `${API_CONFIG.backendUrl}${API_CONFIG.endpoints.admin.users}`;

  constructor(private http: HttpClient) {}

  /**
   * Get paginated list of users with filters
   * @param filters - Optional filters (search, role, isActive, sorting)
   * @returns Observable with paginated users
   */
  getUsers(filters?: UserFilters): Observable<ApiResponse<PagedResponse<User>>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
      if (filters.search) params = params.set('search', filters.search);
      if (filters.role) params = params.set('role', filters.role);
      if (filters.isActive !== undefined) params = params.set('isActive', filters.isActive.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortDescending !== undefined) params = params.set('sortDescending', filters.sortDescending.toString());
    }

    return this.http.get<ApiResponse<PagedResponse<User>>>(this.apiUrl, { params });
  }

  /**
   * Get user by ID with statistics (totalOrders, totalSpent)
   * @param id - User ID
   * @returns Observable with user details and stats
   */
  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update user information
   * @param id - User ID
   * @param user - Updated user data
   * @returns Observable with updated user
   */
  updateUser(id: number, user: UserUpdateDto): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, user);
  }

  /**
   * Change user role
   * @param id - User ID
   * @param roleData - New role
   * @returns Observable with result
   */
  changeUserRole(id: number, roleData: UserRoleChangeDto): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${this.apiUrl}/${id}/role`, roleData);
  }

  /**
   * Toggle user active status (activate/deactivate)
   * @param id - User ID
   * @returns Observable with result
   */
  toggleUserStatus(id: number): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${this.apiUrl}/${id}/toggle-status`, {});
  }

  /**
   * Delete user
   * Will fail if user is the last active admin
   * @param id - User ID
   * @returns Observable with deletion result
   */
  deleteUser(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}
