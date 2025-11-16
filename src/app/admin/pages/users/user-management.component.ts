import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserAdminService } from '../../../services/user-admin.service';
import { User, UserUpdateDto, UserFilters, UserRole } from '../../../models/user.model';
import { PagedResponse } from '../../../models/paged-response.interface';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 0;

  // Filters
  searchTerm = '';
  roleFilter: UserRole | undefined;
  statusFilter: boolean | undefined;
  sortBy: 'Name' | 'Email' | 'CreatedAt' = 'CreatedAt';

  // Modal
  showModal = false;
  showRoleModal = false;
  selectedUser: User | null = null;
  newRole: UserRole = 'Customer';

  constructor(private userService: UserAdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = '';

    const filters: UserFilters = {
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      role: this.roleFilter,
      isActive: this.statusFilter,
      sortBy: this.sortBy,
      sortDescending: true
    };

    this.userService.getUsers(filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data.items;
          this.totalCount = response.data.totalCount;
          this.totalPages = response.data.totalPages;
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 0) {
          this.error = 'No se pudo conectar con el servidor.';
        } else if (err.status === 500) {
          console.error(`
=== MENSAJE PARA EL BACKEND ===
🔴 ERROR 500 - [Usuarios Admin]
Endpoint: GET ${this.userService['apiUrl']}
Parámetros: ${JSON.stringify(filters, null, 2)}
Error: ${err.error?.message || err.message}
===============================
          `);
          this.error = 'Error del servidor. Revisa la consola.';
        } else {
          this.error = err.error?.message || 'Error al cargar usuarios';
        }
      }
    });
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadUsers();
  }

  clearFilters() {
    this.searchTerm = '';
    this.roleFilter = undefined;
    this.statusFilter = undefined;
    this.currentPage = 1;
    this.loadUsers();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  openRoleModal(user: User) {
    this.selectedUser = user;
    this.newRole = user.role;
    this.showRoleModal = true;
  }

  closeRoleModal() {
    this.showRoleModal = false;
    this.selectedUser = null;
  }

  changeRole() {
    if (!this.selectedUser) return;

    this.loading = true;
    this.userService.changeUserRole(this.selectedUser.id, { role: this.newRole }).subscribe({
      next: (response) => {
        if (response.success) {
          this.closeRoleModal();
          this.loadUsers();
        } else {
          alert(response.message);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Error al cambiar rol');
      }
    });
  }

  toggleStatus(user: User) {
    if (!confirm(`¿${user.isActive ? 'Desactivar' : 'Activar'} usuario ${user.name}?`)) return;

    this.loading = true;
    this.userService.toggleUserStatus(user.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadUsers();
        } else {
          alert(response.message);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Error al cambiar estado');
      }
    });
  }

  deleteUser(user: User) {
    if (!confirm(`¿Eliminar usuario ${user.name}?`)) return;

    this.loading = true;
    this.userService.deleteUser(user.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadUsers();
        } else {
          alert(response.message);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Error al eliminar. No se puede eliminar el último admin.');
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Admin': return 'bg-red-500';
      case 'Employee': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'bg-green-500' : 'bg-gray-500';
  }
}
