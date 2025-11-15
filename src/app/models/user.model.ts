export type UserRole = 'Admin' | 'Employee' | 'Customer';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  provider?: 'Local' | 'Google';
  createdAt?: Date;
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
