import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('bosko-token');

  // Skip adding token for auth endpoints
  const isAuthEndpoint = req.url.includes('/auth/login') ||
                          req.url.includes('/auth/register') ||
                          req.url.includes('/auth/google-login') ||
                          req.url.includes('/auth/forgot-password') ||
                          req.url.includes('/auth/reset-password');

  if (token && !isAuthEndpoint) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.warn('🔴 AUTH INTERCEPTOR - Token inválido o expirado, redirigiendo a login');
          // Clear token and redirect to login
          localStorage.removeItem('bosko-token');
          localStorage.removeItem('bosko-cart');
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
