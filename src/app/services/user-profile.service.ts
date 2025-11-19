import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { User } from '../models/user.model';

/**
 * DTO for updating user profile information
 */
export interface UpdateProfileDto {
  name: string;
  email: string;
  phone?: string;
}

/**
 * DTO for changing user password
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

/**
 * DTO for updating user preferences
 */
export interface UserPreferencesDto {
  notifications: boolean;
  newsletter: boolean;
  language?: string;
}

/**
 * API Response wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = `${API_CONFIG.baseUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Get current user profile information
   * GET /api/users/me
   */
  getMyProfile(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update user profile information (name, email, phone)
   * PUT /api/users/me
   */
  updateProfile(data: UpdateProfileDto): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/me`, data).pipe(
      map(response => response.data)
    );
  }

  /**
   * Change user password
   * PUT /api/users/me/password
   */
  changePassword(data: ChangePasswordDto): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/me/password`, data).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update user preferences (notifications, newsletter)
   * PUT /api/users/me/preferences
   */
  updatePreferences(data: UserPreferencesDto): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/me/preferences`, data).pipe(
      map(response => response.data)
    );
  }

  /**
   * Upload user avatar/profile picture
   * POST /api/users/me/avatar
   */
  uploadAvatar(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/me/avatar`, formData).pipe(
      map(response => response.data)
    );
  }

  /**
   * Delete user account (soft delete)
   * DELETE /api/users/me
   */
  deleteAccount(): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/me`).pipe(
      map(response => response.data)
    );
  }
}
