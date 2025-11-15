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

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check if user is logged in on service initialization
    const token = this.getToken();
    if (token) {
      this.loggedInSignal.set(true);
      // Optionally decode token to get user info
      const user = this.getUserFromToken(token);
      if (user) {
        this.currentUserSubject.next(user);
      }
    }
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
    localStorage.removeItem('bosko-token');
    this.currentUserSubject.next(null);
    this.loggedInSignal.set(false);
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
    if (!token) return false;

    // Check if token is expired
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
      return {
        id: payload.sub || payload.userId,
        name: payload.name || payload.unique_name,
        email: payload.email,
        role: payload.role || 'Customer',
        provider: payload.provider || 'Local'
      };
    } catch {
      return null;
    }
  }

  private decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
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
