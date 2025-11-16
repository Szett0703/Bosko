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

  constructor(private categoryService: CategoryAdminService) {}

  ngOnInit() {
    this.loadCategories();
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
    this.showModal = false;
    this.selectedCategory = null;
  }

  saveCategory() {
    if (!this.categoryForm.name) {
      alert('El nombre es requerido');
      return;
    }

    this.loading = true;

    const operation = this.modalMode === 'create'
      ? this.categoryService.createCategory(this.categoryForm)
      : this.categoryService.updateCategory(this.selectedCategory!.id, this.categoryForm);

    operation.subscribe({
      next: (response) => {
        if (response.success) {
          this.closeModal();
          this.loadCategories();
        } else {
          alert(response.message);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 500) {
          console.error(`
=== MENSAJE PARA EL BACKEND ===
🔴 ERROR 500 - [Categorías Admin - ${this.modalMode}]
Endpoint: ${this.modalMode === 'create' ? 'POST' : 'PUT'} ${this.categoryService['apiUrl']}
Body: ${JSON.stringify(this.categoryForm, null, 2)}
Error: ${err.error?.message || err.message}
===============================
          `);
          alert('Error del servidor. Revisa la consola.');
        } else {
          alert(err.error?.message || 'Error al guardar');
        }
      }
    });
  }

  deleteCategory(category: Category) {
    if (!confirm(`¿Eliminar "${category.name}"? Tiene ${category.productCount} productos asociados.`)) {
      return;
    }

    this.loading = true;

    this.categoryService.deleteCategory(category.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadCategories();
        } else {
          alert(response.message);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Error al eliminar. Verifica que no tenga productos asociados.');
      }
    });
  }
}
