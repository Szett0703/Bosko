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

  // Modals
  showModal = false;
  showRoleModal = false;
  showEditModal = false;
  selectedUser: User | null = null;
  newRole: UserRole = 'Customer';

  // Edit form
  editForm = {
    name: '',
    email: '',
    phone: '',
    role: 'Customer' as UserRole,
    isActive: true
  };

  formTouched = false;

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

  // Edit User Modal
  openEditModal(user: User) {
    this.selectedUser = user;
    this.editForm = {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      isActive: user.isActive
    };
    this.formTouched = false;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = null;
    this.formTouched = false;
  }

  saveUser() {
    if (!this.selectedUser) return;

    this.formTouched = true;

    // Validations
    if (!this.editForm.name || this.editForm.name.trim().length < 3) {
      this.error = 'El nombre debe tener al menos 3 caracteres';
      return;
    }

    if (!this.editForm.email || !this.isValidEmail(this.editForm.email)) {
      this.error = 'Email inválido';
      return;
    }

    this.loading = true;
    this.error = '';

    const updateData: UserUpdateDto = {
      name: this.editForm.name.trim(),
      email: this.editForm.email.trim(),
      phone: this.editForm.phone?.trim() || undefined,
      role: this.editForm.role,
      isActive: this.editForm.isActive
    };

    this.userService.updateUser(this.selectedUser.id, updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.closeEditModal();
          this.loadUsers();
        } else {
          this.error = response.message || 'Error al actualizar usuario';
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 500) {
          console.error(`
=== MENSAJE PARA EL BACKEND ===
🔴 ERROR 500 - [Actualizar Usuario]
Endpoint: PUT ${this.userService['apiUrl']}/${this.selectedUser?.id}
Body: ${JSON.stringify(updateData, null, 2)}
Error: ${err.error?.message || err.message}
===============================
          `);
          this.error = 'Error del servidor al actualizar usuario. Revisa la consola.';
        } else {
          this.error = err.error?.message || 'Error al actualizar usuario';
        }
      }
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  changeRole() {
    if (!this.selectedUser) return;

    this.loading = true;
    this.error = '';
    this.userService.changeUserRole(this.selectedUser.id, { role: this.newRole }).subscribe({
      next: (response) => {
        if (response.success) {
          this.closeRoleModal();
          this.loadUsers();
        } else {
          this.error = response.message || 'Error al cambiar rol';
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 500) {
          console.error(`
=== MENSAJE PARA EL BACKEND ===
🔴 ERROR 500 - [Cambiar Rol Usuario]
Endpoint: PATCH ${this.userService['apiUrl']}/${this.selectedUser?.id}/role
Body: ${JSON.stringify({ role: this.newRole }, null, 2)}
Error: ${err.error?.message || err.message}
===============================
          `);
          this.error = 'Error del servidor al cambiar rol. Revisa la consola.';
        } else {
          this.error = err.error?.message || 'Error al cambiar rol';
        }
      }
    });
  }

  toggleStatus(user: User) {
    if (!confirm(`¿${user.isActive ? 'Desactivar' : 'Activar'} usuario ${user.name}?`)) return;

    this.loading = true;
    this.error = '';
    this.userService.toggleUserStatus(user.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadUsers();
        } else {
          this.error = response.message || 'Error al cambiar estado';
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 500) {
          console.error(`
=== MENSAJE PARA EL BACKEND ===
🔴 ERROR 500 - [Toggle Status Usuario]
Endpoint: PATCH ${this.userService['apiUrl']}/${user.id}/toggle-status
Error: ${err.error?.message || err.message}
===============================
          `);
          this.error = 'Error del servidor al cambiar estado. Revisa la consola.';
        } else {
          this.error = err.error?.message || 'Error al cambiar estado';
        }
      }
    });
  }

  deleteUser(user: User) {
    if (!confirm(`¿Eliminar usuario ${user.name}?\n\nEsta acción no se puede deshacer.`)) return;

    this.loading = true;
    this.error = '';
    this.userService.deleteUser(user.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadUsers();
        } else {
          this.error = response.message || 'Error al eliminar usuario';
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 500) {
          console.error(`
=== MENSAJE PARA EL BACKEND ===
🔴 ERROR 500 - [Eliminar Usuario]
Endpoint: DELETE ${this.userService['apiUrl']}/${user.id}
Error: ${err.error?.message || err.message}
===============================
          `);
          this.error = 'Error del servidor al eliminar usuario. Revisa la consola.';
        } else if (err.status === 400) {
          this.error = 'No se puede eliminar el último administrador del sistema.';
        } else {
          this.error = err.error?.message || 'Error al eliminar usuario';
        }
      }
    });
  }

  // Stats calculations
  getAdminCount(): number {
    return this.users.filter(u => u.role === 'Admin').length;
  }

  getEmployeeCount(): number {
    return this.users.filter(u => u.role === 'Employee').length;
  }

  getCustomerCount(): number {
    return this.users.filter(u => u.role === 'Customer').length;
  }

  // Date formatting
  formatDate(date: Date | string): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
