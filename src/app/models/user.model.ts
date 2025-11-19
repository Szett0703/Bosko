export type UserRole = 'Admin' | 'Employee' | 'Customer';

/**
 * User interface matching backend API
 */
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  provider?: 'Local' | 'Google';
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  totalOrders?: number;
  totalSpent?: number;
}

/**
 * DTO for updating users (admin)
 */
export interface UserUpdateDto {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
}

/**
 * DTO for changing user role
 */
export interface UserRoleChangeDto {
  role: UserRole;
}

/**
 * User filters for admin list
 */
export interface UserFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy?: 'Name' | 'Email' | 'CreatedAt';
  sortDescending?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface GoogleLoginRequest {
  token: string;
}
