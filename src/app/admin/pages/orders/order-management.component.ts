import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderAdminService } from '../../../services/order-admin.service';

// Interfaces
interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  items: number;
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
  newStatus: string = '';
  statusNote: string = '';

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
        console.error('Error loading order details:', err);
        this.isLoading = false;

        let errorMsg = 'Error al cargar los detalles del pedido.\n\n';
        let backendMessage = '';

        if (err.status === 404) {
          errorMsg += 'Pedido no encontrado.';
        } else if (err.status === 500) {
          const errorDetails = err.error?.message || err.error?.title || 'Error desconocido';
          errorMsg += `Error del servidor: ${errorDetails}`;

          // Generate message for backend team
          backendMessage = `🔴 ERROR 500 EN FRONTEND - Detalles de Pedido\n\n`;
          backendMessage += `Endpoint: GET /api/admin/orders/{id}\n`;
          backendMessage += `ID del pedido: ${orderId}\n\n`;
          backendMessage += `Error del servidor:\n${errorDetails}\n\n`;
          backendMessage += `Stack trace (si está disponible):\n${err.error?.stackTrace || 'No disponible'}\n\n`;
          backendMessage += `Por favor revisa:\n`;
          backendMessage += `1. Que el pedido con ID ${orderId} exista en la BD\n`;
          backendMessage += `2. Que se estén cargando correctamente las relaciones (customer, shippingAddress, orderItems, statusHistory)\n`;
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
}
