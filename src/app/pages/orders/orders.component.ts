import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order, OrderStatus, UpdateOrderRequest, ShippingAddress } from '../../models/order.model';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  // Filtros
  selectedStatus = signal<OrderStatus | 'all'>('all');
  searchQuery = signal('');

  // Modal de detalles
  selectedOrder = signal<Order | null>(null);
  showDetailsModal = signal(false);

  // Modal de edición
  showEditModal = signal(false);
  editFormData: UpdateOrderRequest = {
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

  // Modal de cancelación
  showCancelModal = signal(false);
  cancelReason = signal('');

  // Computed
  filteredOrders = computed(() => {
    let filtered = this.orders();

    // Filtrar por estado
    if (this.selectedStatus() !== 'all') {
      filtered = filtered.filter(o => o.status === this.selectedStatus());
    }

    // Filtrar por búsqueda
    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(o =>
        o.orderNumber.toLowerCase().includes(query) ||
        o.status.toLowerCase().includes(query) ||
        (o.items && o.items.some(item => item.productName.toLowerCase().includes(query)))
      );
    }

    return filtered;
  });

  statusCounts = computed(() => ({
    total: this.orders().length,
    pending: this.orders().filter(o => o.status === 'pending').length,
    processing: this.orders().filter(o => o.status === 'processing').length,
    delivered: this.orders().filter(o => o.status === 'delivered').length,
    cancelled: this.orders().filter(o => o.status === 'cancelled').length
  }));

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage.set('Usuario no autenticado');
      this.isLoading.set(false);
      return;
    }

    this.orderService.getMyOrders(user.id).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('❌ ERROR AL CARGAR PEDIDOS:', error);
        this.errorMessage.set('No se pudieron cargar los pedidos. Por favor, intenta de nuevo.');
        this.isLoading.set(false);
        this.logBackendError('GET /api/orders/customer/' + user.id, error);
      }
    });
  }

  openDetailsModal(order: Order): void {
    this.selectedOrder.set(order);
    this.showDetailsModal.set(true);
  }

  closeDetailsModal(): void {
    this.showDetailsModal.set(false);
    this.selectedOrder.set(null);
  }

  openEditModal(order: Order): void {
    this.selectedOrder.set(order);
    this.editFormData = {
      shippingAddress: { ...order.shippingAddress },
      notes: order.notes || ''
    };
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.selectedOrder.set(null);
  }

  saveOrderChanges(): void {
    const order = this.selectedOrder();
    if (!order) return;

    // Solo permitir edición si está en estado Pendiente
    if (order.status !== 'pending') {
      alert('Solo puedes editar pedidos en estado Pendiente');
      return;
    }

    // TODO: El backend actualmente no soporta actualización completa de pedidos
    // Solo permite cambiar el estado (updateOrderStatus) desde el panel de admin
    alert('La edición de pedidos no está disponible. Solo puedes cancelar pedidos pendientes.');
    this.closeEditModal();

    // const updateData = this.editFormData;
    // this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
    //   next: (updatedOrder: Order) => {
    //     const orders = this.orders();
    //     const index = orders.findIndex(o => o.id === order.id);
    //     if (index !== -1) {
    //       orders[index] = updatedOrder;
    //       this.orders.set([...orders]);
    //     }
    //     this.closeEditModal();
    //   },
    //   error: (error: any) => {
    //     console.error('❌ ERROR AL ACTUALIZAR PEDIDO:', error);
    //     alert('No se pudo actualizar el pedido.');
    //   }
    // });
  }

  openCancelModal(order: Order): void {
    this.selectedOrder.set(order);
    this.cancelReason.set('');
    this.showCancelModal.set(true);
  }

  closeCancelModal(): void {
    this.showCancelModal.set(false);
    this.selectedOrder.set(null);
    this.cancelReason.set('');
  }

  confirmCancelOrder(): void {
    const order = this.selectedOrder();
    const reason = this.cancelReason().trim();

    if (!order) return;

    if (!reason) {
      alert('Por favor, indica el motivo de la cancelación');
      return;
    }

    // Solo permitir cancelación si está en Pendiente o Procesando
    if (order.status !== 'pending' && order.status !== 'processing') {
      alert('Solo puedes cancelar pedidos en estado Pendiente o Procesando');
      return;
    }

    this.orderService.cancelOrder(order.id, reason).subscribe({
      next: (success) => {
        if (success) {
          // Recargar pedidos
          this.loadOrders();
          this.closeCancelModal();
          alert('Pedido cancelado exitosamente');
        } else {
          alert('No se pudo cancelar el pedido');
        }
      },
      error: (error) => {
        console.error('❌ ERROR AL CANCELAR PEDIDO:', error);
        alert('No se pudo cancelar el pedido. Por favor, intenta de nuevo.');
        this.logBackendError(`POST /api/orders/${order.id}/cancel`, error, { reason });
      }
    });
  }

  getStatusClass(status: OrderStatus): string {
    const classes: Record<OrderStatus, string> = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return classes[status] || '';
  }

  getStatusIcon(status: OrderStatus): string {
    const icons: Record<OrderStatus, string> = {
      'pending': '⏳',
      'processing': '🔄',
      'delivered': '✅',
      'cancelled': '❌'
    };
    return icons[status] || '📋';
  }

  getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      'pending': 'Pendiente',
      'processing': 'Procesando',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }

  canEditOrder(order: Order): boolean {
    return order.status === 'pending';
  }

  canCancelOrder(order: Order): boolean {
    return order.status === 'pending' || order.status === 'processing';
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  private logBackendError(endpoint: string, error: any, params?: any): void {
    console.log('\n🔴 ═══════════════════════════════════════════════════════════');
    console.log('📋 MENSAJE PARA EL BACKEND - ERROR EN PEDIDOS');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('🌐 Endpoint:', endpoint);
    if (params) {
      console.log('📦 Parámetros enviados:', JSON.stringify(params, null, 2));
    }
    console.log('❌ Error:', error.status, error.statusText);
    console.log('💬 Mensaje:', error.error?.message || error.message);
    if (error.error?.errors) {
      console.log('📝 Errores de validación:', JSON.stringify(error.error.errors, null, 2));
    }
    console.log('\n✅ CHECKLIST PARA DEBUGGING:');
    console.log('   [ ] Verificar que el endpoint existe en el backend');
    console.log('   [ ] Verificar autenticación JWT en headers');
    console.log('   [ ] Verificar que el userId se obtiene del token');
    console.log('   [ ] Validar formato de datos enviados');
    console.log('   [ ] Revisar permisos y autorizaciones');
    console.log('   [ ] Verificar conexión a base de datos');
    console.log('═══════════════════════════════════════════════════════════\n');
  }
}
