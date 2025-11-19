import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductAdminService } from '../../../services/product-admin.service';
import { CategoryAdminService } from '../../../services/category-admin.service';
import { Product, ProductCreateDto, ProductFilters } from '../../../models/product.model';
import { SimpleCategoryDto } from '../../../models/category.model';
import { PagedResponse } from '../../../models/paged-response.interface';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit {
  // Math for template
  Math = Math;

  // Data
  products: Product[] = [];
  categories: SimpleCategoryDto[] = [];

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;

  // Filters
  searchTerm = '';
  selectedCategory: number | undefined;
  stockFilter: boolean | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  sortBy: 'Name' | 'Price' | 'Stock' | 'CreatedAt' = 'CreatedAt';
  sortDescending = true;

  // UI State
  loading = false;
  error = '';

  // Modal State
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedProduct: Product | null = null;

  // Form Data
  productForm: ProductCreateDto = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    categoryId: undefined
  };

  formTouched = false;

  constructor(
    private productService: ProductAdminService,
    private categoryService: CategoryAdminService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  // Helper methods
  getInStockCount(): number {
    return this.products.filter(p => p.stock > 0).length;
  }

  getTotalValue(): string {
    const total = this.products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    return total.toFixed(2);
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

  /**
   * Load products with current filters
   */
  loadProducts() {
    this.loading = true;
    this.error = '';

    const filters: ProductFilters = {
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      categoryId: this.selectedCategory,
      inStock: this.stockFilter,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      sortBy: this.sortBy,
      sortDescending: this.sortDescending
    };

    this.productService.getProducts(filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.products = response.data.items;
          this.totalCount = response.data.totalCount;
          this.totalPages = response.data.totalPages;
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;

        if (err.status === 0) {
          this.error = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
        } else if (err.status === 401) {
          this.error = 'No autorizado. Por favor inicia sesión nuevamente.';
        } else if (err.status === 500) {
          const backendMessage = `
=== MENSAJE PARA EL BACKEND ===
🔴 ERROR 500 EN FRONTEND - [Productos Admin]

Endpoint: GET ${this.productService['apiUrl']}
Parámetros: ${JSON.stringify(filters, null, 2)}

Error del servidor: ${err.error?.message || err.message || 'Error desconocido'}
${err.error?.stackTrace ? 'Stack trace: ' + err.error.stackTrace : ''}

Por favor revisa:
1. La conexión a la base de datos
2. Las migraciones y el esquema de la tabla Products
3. Los logs del servidor para más detalles
4. Las relaciones con la tabla Categories
===============================
          `;
          console.error(backendMessage);
          this.error = 'Error del servidor al cargar productos. Revisa la consola para enviar el mensaje al backend.';
        } else {
          this.error = err.error?.message || 'Error al cargar productos';
        }
      }
    });
  }

  /**
   * Load categories for dropdown
   */
  loadCategories() {
    this.categoryService.getSimpleCategories().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data;
        }
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  /**
   * Apply filters and reload
   */
  applyFilters() {
    this.currentPage = 1;
    this.loadProducts();
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = undefined;
    this.stockFilter = undefined;
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.currentPage = 1;
    this.loadProducts();
  }

  /**
   * Change page
   */
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  /**
   * Open modal to create product
   */
  openCreateModal() {
    this.modalMode = 'create';
    this.selectedProduct = null;
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      image: '',
      categoryId: undefined
    };
    this.formTouched = false;
    this.error = '';
    this.showModal = true;
  }

  /**
   * Open modal to edit product
   */
  openEditModal(product: Product) {
    this.modalMode = 'edit';
    this.selectedProduct = product;
    this.productForm = {
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      image: product.image || '',
      categoryId: product.categoryId
    };
    this.showModal = true;
  }

  /**
   * Close modal
   */
  closeModal() {
    if (this.loading) return;
    this.showModal = false;
    this.selectedProduct = null;
    this.formTouched = false;
    this.error = '';
  }

  /**
   * Save product (create or update)
   */
  saveProduct() {
    this.formTouched = true;

    // Validaciones del formulario
    if (!this.productForm.name || !this.productForm.name.trim()) {
      this.error = 'El nombre del producto es requerido';
      setTimeout(() => this.error = '', 3000);
      return;
    }

    if (this.productForm.name.length < 3) {
      this.error = 'El nombre debe tener al menos 3 caracteres';
      setTimeout(() => this.error = '', 3000);
      return;
    }

    if (this.productForm.price <= 0) {
      this.error = 'El precio debe ser mayor a 0';
      setTimeout(() => this.error = '', 3000);
      return;
    }

    if (this.productForm.stock < 0) {
      this.error = 'El stock no puede ser negativo';
      setTimeout(() => this.error = '', 3000);
      return;
    }

    if (!this.productForm.categoryId) {
      this.error = 'Debes seleccionar una categoría';
      setTimeout(() => this.error = '', 3000);
      return;
    }

    this.loading = true;
    this.error = '';

    const operation = this.modalMode === 'create'
      ? this.productService.createProduct(this.productForm)
      : this.productService.updateProduct(this.selectedProduct!.id, this.productForm);

    operation.subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.closeModal();
          this.loadProducts();
        } else {
          this.error = response.message || 'Error al guardar producto';
          setTimeout(() => this.error = '', 5000);
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 500) {
          const backendMessage = `
=== MENSAJE PARA EL BACKEND ===
🔴 ERROR 500 EN FRONTEND - [Productos Admin - ${this.modalMode === 'create' ? 'Crear' : 'Actualizar'}]

Endpoint: ${this.modalMode === 'create' ? 'POST' : 'PUT'} ${this.productService['apiUrl']}${this.modalMode === 'edit' ? '/' + this.selectedProduct!.id : ''}
Body: ${JSON.stringify(this.productForm, null, 2)}

Error del servidor: ${err.error?.message || err.message || 'Error desconocido'}
${err.error?.stackTrace ? 'Stack trace: ' + err.error.stackTrace : ''}

Por favor revisa:
1. Validaciones en el backend (nombre único, precio > 0, etc.)
2. La relación con la tabla Categories (categoryId válido)
3. Los logs del servidor para más detalles
===============================
          `;
          console.error(backendMessage);
          this.error = 'Error del servidor. Revisa la consola para más detalles.';
        } else {
          this.error = err.error?.message || 'Error al guardar producto';
        }
        setTimeout(() => this.error = '', 5000);
      }
    });
  }

  /**
   * Delete product
   */
  deleteProduct(product: Product) {
    const message = `⚠️ ¿Eliminar el producto "${product.name}"?\n\nEsta acción no se puede deshacer.${product.stock > 0 ? '\n\n⚡ Este producto tiene ' + product.stock + ' unidades en stock.' : ''}`;

    if (!confirm(message)) {
      return;
    }

    this.loading = true;

    this.productService.deleteProduct(product.id).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.loadProducts();
        } else {
          this.error = response.message || 'Error al eliminar producto';
          setTimeout(() => this.error = '', 5000);
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 500) {
          const backendMessage = `
=== MENSAJE PARA EL BACKEND ===
🔴 ERROR 500 EN FRONTEND - [Productos Admin - Eliminar]

Endpoint: DELETE ${this.productService['apiUrl']}/${product.id}

Error del servidor: ${err.error?.message || err.message || 'Error desconocido'}
${err.error?.stackTrace ? 'Stack trace: ' + err.error.stackTrace : ''}

Por favor revisa:
1. Restricciones de clave foránea (productos en OrderItems)
2. Los logs del servidor para más detalles
===============================
          `;
          console.error(backendMessage);
          this.error = 'Error del servidor. Revisa la consola para más detalles.';
        } else {
          this.error = err.error?.message || 'Error al eliminar producto';
        }
        setTimeout(() => this.error = '', 5000);
      }
    });
  }

  /**
   * Get stock badge color
   */
  getStockBadgeClass(stock: number): string {
    if (stock === 0) return 'bg-red-500';
    if (stock < 10) return 'bg-yellow-500';
    return 'bg-green-500';
  }
}
