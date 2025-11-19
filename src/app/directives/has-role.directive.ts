import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';
import { Subscription } from 'rxjs';

/**
 * Structural directive that shows/hides elements based on user roles
 *
 * Usage:
 * *appHasRole="'Admin'" - Show only for Admin
 * *appHasRole="['Admin', 'Employee']" - Show for Admin or Employee
 *
 * Example:
 * <button *appHasRole="'Admin'">Delete User</button>
 * <div *appHasRole="['Admin', 'Employee']">Management Panel</div>
 */
@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private requiredRoles: UserRole[] = [];
  private subscription?: Subscription;
  private hasView = false;

  @Input()
  set appHasRole(roles: UserRole | UserRole[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to user changes to update view when login/logout occurs
    this.subscription = this.authService.currentUser$.subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateView(): void {
    const hasRequiredRole = this.checkRole();

    if (hasRequiredRole && !this.hasView) {
      // Show element
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRequiredRole && this.hasView) {
      // Hide element
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  private checkRole(): boolean {
    if (!this.authService.isAuthenticated()) {
      return false;
    }

    if (this.requiredRoles.length === 0) {
      return true;
    }

    return this.authService.hasRole(this.requiredRoles);
  }
}
