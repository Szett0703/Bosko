import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/dashboard/admin-dashboard.component';
import { ProductManagementComponent } from './pages/products/product-management.component';
import { CategoryManagementComponent } from './pages/categories/category-management.component';
import { OrderManagementComponent } from './pages/orders/order-management.component';
import { UserManagementComponent } from './pages/users/user-management.component';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';

/**
 * Admin Panel Routes Configuration
 *
 * Access Levels:
 * - Dashboard: Admin & Employee (view statistics)
 * - Orders: Admin & Employee (manage orders)
 * - Products: Admin only (full CRUD)
 * - Categories: Admin only (full CRUD)
 * - Users: Admin only (full CRUD)
 */
export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['Admin', 'Employee'],
      title: 'Panel de Administración'
    },
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
        data: {
          roles: ['Admin', 'Employee'],
          title: 'Dashboard'
        }
      },
      {
        path: 'dashboard',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: 'orders',
        component: OrderManagementComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['Admin', 'Employee'],
          title: 'Gestión de Pedidos'
        }
      },
      {
        path: 'products',
        component: ProductManagementComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['Admin'],
          title: 'Gestión de Productos'
        }
      },
      {
        path: 'categories',
        component: CategoryManagementComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['Admin'],
          title: 'Gestión de Categorías'
        }
      },
      {
        path: 'users',
        component: UserManagementComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['Admin'],
          title: 'Gestión de Usuarios'
        }
      }
    ]
  }
];
