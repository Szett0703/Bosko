import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  GoogleLoginRequest,
  User,
  UserRole
} from '../models/user.model';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private loggedInSignal = signal<boolean>(false);
  public isLoggedIn = computed(() => this.loggedInSignal());

  private userRoleSignal = signal<UserRole | null>(null);
  public userRole = computed(() => this.userRoleSignal());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check if user is logged in on service initialization
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = this.getToken();
    if (token && this.isTokenValid(token)) {
      const user = this.getUserFromToken(token);
      if (user) {
        this.loggedInSignal.set(true);
        this.currentUserSubject.next(user);
        this.userRoleSignal.set(user.role);
      } else {
        this.clearAuthState();
      }
    } else {
      this.clearAuthState();
    }
  }

  private clearAuthState(): void {
    localStorage.removeItem('bosko-token');
    this.loggedInSignal.set(false);
    this.currentUserSubject.next(null);
    this.userRoleSignal.set(null);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`,
      credentials
    ).pipe(
      tap(response => {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user);
        this.loggedInSignal.set(true);
        this.userRoleSignal.set(response.user.role);
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.register}`,
      userData
    ).pipe(
      tap(response => {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user);
        this.loggedInSignal.set(true);
        this.userRoleSignal.set(response.user.role);
      })
    );
  }

  googleLogin(googleToken: string): Observable<AuthResponse> {
    const request: GoogleLoginRequest = { token: googleToken };
    return this.http.post<AuthResponse>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.googleLogin}`,
      request
    ).pipe(
      tap(response => {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user);
        this.loggedInSignal.set(true);
        this.userRoleSignal.set(response.user.role);
      })
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.forgotPassword}`,
      { email }
    );
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.resetPassword}`,
      { email, token, newPassword }
    );
  }

  logout(): void {
    this.clearAuthState();
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('bosko-token');
  }

  private setToken(token: string): void {
    localStorage.setItem('bosko-token', token);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? this.isTokenValid(token) : false;
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  private getUserFromToken(token: string): User | null {
    try {
      const payload = this.decodeToken(token);
      // Handle different JWT claim formats
      const userId = payload.sub || payload.userId || payload.nameid || payload.id;
      const userName = payload.name || payload.unique_name || payload.given_name || 'User';
      const userEmail = payload.email || payload.preferred_username || '';
      const userRole = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Customer';

      return {
        id: parseInt(userId) || 0,
        name: userName,
        email: userEmail,
        role: userRole as UserRole,
        provider: payload.provider || 'Local',
        isActive: true,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      const payload = parts[1];
      // Handle URL-safe base64
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(base64);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Token decode error:', error);
      throw new Error('Failed to decode token');
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  hasRole(roles: UserRole[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  isEmployee(): boolean {
    return this.getUserRole() === 'Employee';
  }

  isCustomer(): boolean {
    return this.getUserRole() === 'Customer';
  }
}
