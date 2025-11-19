import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated first
  if (!authService.isAuthenticated()) {
    const attemptedUrl = '/' + route.pathFromRoot
      .map(r => r.url.map(segment => segment.path).join('/'))
      .filter(Boolean)
      .join('/');

    router.navigate(['/login'], { queryParams: { returnUrl: attemptedUrl } });
    return false;
  }

  // Get allowed roles from route data
  const allowedRoles = route.data['roles'] as UserRole[];

  if (!allowedRoles || allowedRoles.length === 0) {
    // No role restriction, allow access
    return true;
  }

  // Check if user has one of the allowed roles
  if (authService.hasRole(allowedRoles)) {
    return true;
  }

  // User doesn't have required role, redirect to forbidden page or home
  router.navigate(['/forbidden']);
  return false;
};
