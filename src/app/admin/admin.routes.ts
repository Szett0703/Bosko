import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/dashboard/admin-dashboard.component';
import { ProductManagementComponent } from './pages/products/product-management.component';
import { CategoryManagementComponent } from './pages/categories/category-management.component';
import { OrderManagementComponent } from './pages/orders/order-management.component';
import { UserManagementComponent } from './pages/users/user-management.component';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Employee'] },
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
        title: 'Admin Dashboard'
      },
      {
        path: 'products',
        component: ProductManagementComponent,
        canActivate: [roleGuard],
        data: { roles: ['Admin'] }
      },
      {
        path: 'categories',
        component: CategoryManagementComponent,
        canActivate: [roleGuard],
        data: { roles: ['Admin'] }
      },
      {
        path: 'orders',
        component: OrderManagementComponent,
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Employee'] }
      },
      {
        path: 'users',
        component: UserManagementComponent,
        canActivate: [roleGuard],
        data: { roles: ['Admin'] }
      }
    ]
  }
];
