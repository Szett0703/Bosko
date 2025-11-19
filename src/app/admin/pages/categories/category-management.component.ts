import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryAdminService } from '../../../services/category-admin.service';
import { Category, CategoryCreateDto } from '../../../models/category.model';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  error = '';

  // Modal
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedCategory: Category | null = null;

  categoryForm: CategoryCreateDto = {
    name: '',
    description: '',
    image: ''
  };

  formTouched = false;

  constructor(private categoryService: CategoryAdminService) {}

  ngOnInit() {
    this.loadCategories();
  }

  // Helper methods
  getActiveCategories(): number {
    return this.categories.filter(c => c.productCount > 0).length;
  }

  getTotalProducts(): number {
    return this.categories.reduce((sum, c) => sum + c.productCount, 0);
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  onImageError(): void {
    this.error = 'La URL de la imagen no es válida';
    setTimeout(() => this.error = '', 3000);
  }

  loadCategories() {
    this.loading = true;
    this.error = '';

    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data;
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
🔴 ERROR 500 - [Categorías Admin]
Endpoint: GET ${this.categoryService['apiUrl']}
Error: ${err.error?.message || err.message}
${err.error?.stackTrace ? 'Stack: ' + err.error.stackTrace : ''}
===============================
          `);
          this.error = 'Error del servidor. Revisa la consola.';
        } else {
          this.error = err.error?.message || 'Error al cargar categorías';
        }
      }
    });
  }

  openCreateModal() {
    this.modalMode = 'create';
    this.selectedCategory = null;
    this.categoryForm = { name: '', description: '', image: '' };
    this.formTouched = false;
    this.error = '';
    this.showModal = true;
  }

  openEditModal(category: Category) {
    this.modalMode = 'edit';
    this.selectedCategory = category;
    this.categoryForm = {
      name: category.name,
      description: category.description || '',
      image: category.image || ''
    };
    this.showModal = true;
  }

  closeModal() {
    if (this.loading) return;
    this.showModal = false;
    this.selectedCategory = null;
    this.formTouched = false;
    this.error = '';
  }

  saveCategory() {
    this.formTouched = true;

    if (!this.categoryForm.name || !this.categoryForm.name.trim()) {
      this.error = 'El nombre de la categoría es requerido';
      setTimeout(() => this.error = '', 3000);
      return;
    }

    if (this.categoryForm.name.length < 3) {
      this.error = 'El nombre debe tener al menos 3 caracteres';
      setTimeout(() => this.error = '', 3000);
      return;
    }

    this.loading = true;
    this.error = '';

    const operation = this.modalMode === 'create'
      ? this.categoryService.createCategory(this.categoryForm)
      : this.categoryService.updateCategory(this.selectedCategory!.id, this.categoryForm);

    operation.subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.closeModal();
          this.loadCategories();
        } else {
          this.error = response.message || 'Error al guardar categoría';
          setTimeout(() => this.error = '', 5000);
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 500) {
          const backendMessage = `
=== MENSAJE PARA EL BACKEND ===
🔴 ERROR 500 - [Categorías Admin - ${this.modalMode}]
Endpoint: ${this.modalMode === 'create' ? 'POST' : 'PUT'} ${this.categoryService['apiUrl']}
Body: ${JSON.stringify(this.categoryForm, null, 2)}
Error: ${err.error?.message || err.message}
===============================
          `;
          console.error(backendMessage);
          this.error = 'Error del servidor. Revisa la consola para más detalles.';
        } else {
          this.error = err.error?.message || 'Error al guardar categoría';
        }
        setTimeout(() => this.error = '', 5000);
      }
    });
  }

  deleteCategory(category: Category) {
    const message = category.productCount > 0
      ? `⚠️ La categoría "${category.name}" tiene ${category.productCount} producto(s) asociado(s).\n\n¿Estás seguro de eliminarla? Esta acción no se puede deshacer.\n\n⚡ Los productos asociados quedarán sin categoría.`
      : `¿Eliminar la categoría "${category.name}"?\n\nEsta acción no se puede deshacer.`;

    if (!confirm(message)) {
      return;
    }

    this.loading = true;

    this.categoryService.deleteCategory(category.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadCategories();
        } else {
          this.error = response.message || 'Error al eliminar categoría';
          setTimeout(() => this.error = '', 3000);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 500) {
          const backendMessage = `
=== MENSAJE PARA EL BACKEND ===
🔴 ERROR 500 EN FRONTEND - [Categorías Admin - Eliminar]

Endpoint: DELETE ${this.categoryService['apiUrl']}/${category.id}

Error del servidor: ${err.error?.message || err.message || 'Error desconocido'}
${err.error?.stackTrace ? 'Stack trace: ' + err.error.stackTrace : ''}

Por favor revisa:
1. Restricciones de clave foránea (productos con categoryId)
2. Lógica de eliminación en cascada o actualización de productos
3. Los logs del servidor para más detalles
===============================
          `;
          console.error(backendMessage);
          this.error = 'Error del servidor. Revisa la consola para enviar el mensaje al backend.';
        } else {
          this.error = err.error?.message || 'Error al eliminar. Verifica que no tenga productos asociados.';
        }
        setTimeout(() => this.error = '', 5000);
      }
    });
  }
}
