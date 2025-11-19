import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderAdminService } from '../../../services/order-admin.service';

// Interfaces
interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
  amount: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface OrderDetail extends Order {
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderItems: {
    productId: number;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    imageUrl: string;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  statusHistory: {
    status: string;
    timestamp: string;
    note: string;
  }[];
}

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})
export class OrderManagementComponent implements OnInit {
  // Data
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: OrderDetail | null = null;

  // Filters
  searchQuery: string = '';
  statusFilter: string = 'all';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // Modal
  showDetailModal: boolean = false;
  showStatusModal: boolean = false;
  showEditModal: boolean = false;
  showCancelModal: boolean = false;
  newStatus: string = '';
  statusNote: string = '';
  cancelReason: string = '';

  // Edit Form
  editForm: any = {
    shippingAddress: {
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    notes: ''
  };

  // Loading
  isLoading: boolean = false;

  constructor(private orderService: OrderAdminService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;

    this.orderService.getOrders(
      this.currentPage,
      this.itemsPerPage,
      this.statusFilter,
      this.searchQuery
    ).subscribe({
      next: (response) => {
        console.log('=== ADMIN ORDERS DEBUG ===');
        console.log('Full Response:', response);
        console.log('Orders Array:', response.orders);
        console.log('First Order:', response.orders[0]);
        console.log('First Order itemsCount:', response.orders[0]?.itemsCount);
        console.log('==========================');

        this.orders = response.orders;
        this.filteredOrders = response.orders;
        this.totalPages = response.pagination.pages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.error?.message || err.message,
          url: err.url
        });

        this.isLoading = false;

        // Clear data and show error
        this.orders = [];
        this.filteredOrders = [];
        this.totalPages = 1;

        // Show detailed error message
        let errorMsg = 'Error al cargar los pedidos.\n\n';
        let backendMessage = ''; // Message to send to backend team

        if (err.status === 0) {
          errorMsg += 'No se puede conectar con el servidor.\nVerifica que el backend esté corriendo en https://localhost:5006';
        } else if (err.status === 401) {
          errorMsg += 'No autorizado. Por favor inicia sesión nuevamente.';
        } else if (err.status === 500) {
          const errorDetails = err.error?.message || err.error?.title || 'Error desconocido';
          errorMsg += `Error interno del servidor (500).\nDetalles: ${errorDetails}`;

          // Generate message for backend team
          backendMessage = `🔴 ERROR 500 EN FRONTEND - Gestión de Pedidos\n\n`;
          backendMessage += `Endpoint: GET /api/admin/orders\n`;
          backendMessage += `Parámetros:\n`;
          backendMessage += `  - page: ${this.currentPage}\n`;
          backendMessage += `  - limit: ${this.itemsPerPage}\n`;
          backendMessage += `  - status: ${this.statusFilter}\n`;
          backendMessage += `  - search: ${this.searchQuery || '(vacío)'}\n\n`;
          backendMessage += `Error del servidor:\n${errorDetails}\n\n`;
          backendMessage += `Stack trace (si está disponible):\n${err.error?.stackTrace || 'No disponible'}\n\n`;
          backendMessage += `Por favor revisa:\n`;
          backendMessage += `1. Que la tabla Orders exista y tenga datos\n`;
          backendMessage += `2. Que el endpoint esté implementado correctamente\n`;
          backendMessage += `3. Los logs del servidor para más detalles`;

          console.error('\n=== MENSAJE PARA EL BACKEND ===\n' + backendMessage + '\n===============================\n');
          errorMsg += '\n\n📝 Mensaje copiado en consola para enviar al backend.';
        } else {
          errorMsg += `Error ${err.status}: ${err.statusText || 'Error desconocido'}`;
        }

        alert(errorMsg);
      }
    });
  }

  applyFilters(): void {
    // Reset to first page and reload from server with filters
    this.currentPage = 1;
    this.loadOrders();
  }

  get paginatedOrders(): Order[] {
    // Server handles pagination, return filtered orders
    return this.filteredOrders;
  }

  viewOrderDetails(orderId: number): void {
    this.isLoading = true;

    this.orderService.getOrderDetails(orderId).subscribe({
      next: (order) => {
        this.selectedOrder = order as OrderDetail;
        this.showDetailModal = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;

        let errorMsg = 'Error al cargar los detalles del pedido.\n\n';
        let backendMessage = '';

        if (err.status === 404) {
          errorMsg += 'Pedido no encontrado.';
        } else if (err.status === 500) {
          const errorDetails = err.error?.message || err.error?.title || err.error?.Message || 'Error interno del servidor';
          const errorType = err.error?.type || err.error?.Type || 'Unknown';
          const stackTrace = err.error?.stackTrace || err.error?.StackTrace || err.error?.stack || 'No disponible';
          const innerException = err.error?.innerException || err.error?.InnerException || null;

          errorMsg += `Error del servidor: ${errorDetails}`;

          // Generate detailed message for backend team
          backendMessage = `\n╔════════════════════════════════════════════════════════════════╗\n`;
          backendMessage += `║   🔴 ERROR 500 EN FRONTEND - Detalles de Pedido               ║\n`;
          backendMessage += `╚════════════════════════════════════════════════════════════════╝\n\n`;

          backendMessage += `📍 ENDPOINT:\n`;
          backendMessage += `   GET /api/admin/orders/${orderId}\n\n`;

          backendMessage += `📋 PARÁMETROS:\n`;
          backendMessage += `   - Order ID: ${orderId}\n`;
          backendMessage += `   - Timestamp: ${new Date().toISOString()}\n\n`;

          backendMessage += `⚠️ ERROR DEL SERVIDOR:\n`;
          backendMessage += `   Type: ${errorType}\n`;
          backendMessage += `   Message: ${errorDetails}\n\n`;

          if (stackTrace !== 'No disponible') {
            backendMessage += `📜 STACK TRACE:\n`;
            backendMessage += `${stackTrace}\n\n`;
          }

          if (innerException) {
            backendMessage += `🔍 INNER EXCEPTION:\n`;
            backendMessage += `${JSON.stringify(innerException, null, 2)}\n\n`;
          }

          backendMessage += `✅ CHECKLIST PARA DEBUGGING:\n`;
          backendMessage += `   [ ] 1. Verificar que el pedido con ID ${orderId} exista en la base de datos\n`;
          backendMessage += `   [ ] 2. Revisar que las relaciones se carguen correctamente:\n`;
          backendMessage += `       - Customer (Users table)\n`;
          backendMessage += `       - ShippingAddress (Addresses table)\n`;
          backendMessage += `       - OrderItems (OrderItems table con Product)\n`;
          backendMessage += `       - StatusHistory (OrderStatusHistory table)\n`;
          backendMessage += `   [ ] 3. Verificar configuración de Entity Framework:\n`;
          backendMessage += `       - .Include() o .ThenInclude() para navegación\n`;
          backendMessage += `       - Foreign keys correctamente configuradas\n`;
          backendMessage += `   [ ] 4. Revisar los logs del servidor (appsettings.json LogLevel)\n`;
          backendMessage += `   [ ] 5. Verificar que el DTO OrderDetailDto tenga todas las propiedades\n`;
          backendMessage += `   [ ] 6. Comprobar que AutoMapper esté configurado correctamente\n\n`;

          backendMessage += `🔧 POSIBLES CAUSAS:\n`;
          backendMessage += `   - Relación no cargada (NullReferenceException)\n`;
          backendMessage += `   - Foreign key NULL cuando no debería serlo\n`;
          backendMessage += `   - Error de mapeo en el DTO\n`;
          backendMessage += `   - Referencia circular no configurada en JSON serialization\n\n`;

          backendMessage += `📦 ERROR COMPLETO (JSON):\n`;
          backendMessage += JSON.stringify(err.error, null, 2);
          backendMessage += `\n\n═══════════════════════════════════════════════════════════════\n`;

          console.error(backendMessage);
          errorMsg += '\n\n📝 Mensaje detallado copiado en consola para enviar al backend.';
        } else {
          errorMsg += `Error ${err.status}: ${err.statusText || 'Error desconocido'}`;
        }

        alert(errorMsg);
      }
    });
  }

  openStatusModal(order: Order): void {
    this.selectedOrder = order as OrderDetail;
    this.newStatus = order.status;
    this.statusNote = '';
    this.showStatusModal = true;
  }

  updateOrderStatus(): void {
    if (!this.selectedOrder || !this.newStatus) return;

    this.isLoading = true;

    this.orderService.updateOrderStatus(
      this.selectedOrder.id,
      this.newStatus,
      this.statusNote
    ).subscribe({
      next: (response) => {
        console.log('Status updated:', response);
        this.closeStatusModal();
        this.closeDetailModal();
        this.loadOrders(); // Reload orders to reflect changes
        this.isLoading = false;
        alert('Estado del pedido actualizado exitosamente');
      },
      error: (err) => {
        console.error('Error updating order status:', err);
        this.isLoading = false;

        let errorMsg = 'Error al actualizar el estado del pedido.\n\n';
        let backendMessage = '';

        if (err.status === 400) {
          errorMsg += `Solicitud inválida: ${err.error?.message || 'Estado no válido'}`;
        } else if (err.status === 404) {
          errorMsg += 'Pedido no encontrado.';
        } else if (err.status === 500) {
          const errorDetails = err.error?.message || err.error?.title || 'Error desconocido';
          errorMsg += `Error del servidor: ${errorDetails}`;

          // Generate message for backend team
          backendMessage = `🔴 ERROR 500 EN FRONTEND - Actualizar Estado de Pedido\n\n`;
          backendMessage += `Endpoint: PUT /api/admin/orders/{id}/status\n`;
          backendMessage += `ID del pedido: ${this.selectedOrder?.id}\n`;
          backendMessage += `Estado nuevo: ${this.newStatus}\n`;
          backendMessage += `Nota: ${this.statusNote || '(vacío)'}\n\n`;
          backendMessage += `Error del servidor:\n${errorDetails}\n\n`;
          backendMessage += `Stack trace (si está disponible):\n${err.error?.stackTrace || 'No disponible'}\n\n`;
          backendMessage += `Por favor revisa:\n`;
          backendMessage += `1. Que la transición de estado sea válida\n`;
          backendMessage += `2. Que se esté creando correctamente el registro en OrderStatusHistory\n`;
          backendMessage += `3. Que el campo UpdatedAt se actualice correctamente\n`;
          backendMessage += `4. Los logs del servidor para más detalles`;

          console.error('\n=== MENSAJE PARA EL BACKEND ===\n' + backendMessage + '\n===============================\n');
          errorMsg += '\n\n📝 Mensaje copiado en consola para enviar al backend.';
        } else {
          errorMsg += `Error ${err.status}: ${err.statusText || 'Error desconocido'}`;
        }

        alert(errorMsg);
      }
    });
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedOrder = null;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.newStatus = '';
    this.statusNote = '';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pendiente',
      'processing': 'Procesando',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return classes[status] || '';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return `€${amount.toFixed(2)}`;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadOrders();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadOrders();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  exportOrders(): void {
    alert('Función de exportar pedidos (implementar con backend)');
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  // Edit Order
  openEditModal(order: Order): void {
    this.viewOrderDetails(order.id);
    setTimeout(() => {
      if (this.selectedOrder) {
        this.editForm = {
          shippingAddress: { ...this.selectedOrder.shippingAddress },
          notes: '' // Backend will need to provide notes
        };
        this.showEditModal = true;
        this.showDetailModal = false;
      }
    }, 500);
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editForm = {
      shippingAddress: {
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      },
      notes: ''
    };
  }

  saveOrderChanges(): void {
    if (!this.selectedOrder) return;

    this.isLoading = true;

    this.orderService.updateOrder(this.selectedOrder.id, this.editForm).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Pedido actualizado exitosamente');
        this.closeEditModal();
        this.loadOrders();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error updating order:', err);
        const errorMsg = err.error?.message || 'Error al actualizar el pedido';
        alert(errorMsg);
      }
    });
  }

  // Cancel Order
  openCancelModal(order: Order): void {
    this.selectedOrder = order as OrderDetail;
    this.cancelReason = '';
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.cancelReason = '';
  }

  confirmCancelOrder(): void {
    if (!this.selectedOrder || !this.cancelReason.trim()) {
      alert('Por favor ingresa una razón para cancelar el pedido');
      return;
    }

    this.isLoading = true;

    this.orderService.cancelOrder(this.selectedOrder.id, this.cancelReason).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Pedido cancelado exitosamente');
        this.closeCancelModal();
        this.loadOrders();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error canceling order:', err);
        const errorMsg = err.error?.message || 'Error al cancelar el pedido';
        alert(errorMsg);
      }
    });
  }
}
