import { Component, computed, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { getImageUrl } from '../../config/api.config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnDestroy {
  t = computed(() => this.languageService.getTranslations());
  cartItems = computed(() => this.cartService.items());
  itemCount = computed(() => this.cartService.itemCount());
  subtotal = computed(() => this.cartService.subtotal());
  tax = computed(() => this.cartService.tax());
  total = computed(() => this.cartService.total());

  isCheckingOut = signal(false);
  checkoutError = signal('');
  checkoutSuccess = signal(false);
  private subscriptions = new Subscription();

  constructor(
    private cartService: CartService,
    public languageService: LanguageService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateQuantity(productId: number, newQuantity: number) {
    this.cartService.updateQuantity(productId, newQuantity);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    if (confirm(this.t().cart.clearCart + '?')) {
      this.cartService.clearCart();
    }
  }

  /**
   * Obtiene la URL completa de la imagen
   */
  getImageUrl(imagePath: string | undefined): string {
    return getImageUrl(imagePath);
  }

  /**
   * Maneja el error al cargar la imagen
   */
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=Bosko';
  }

  continueShopping() {
    this.router.navigate(['/collections']);
  }

  checkout() {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      // Redirect to login with return URL
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/cart' }
      });
      return;
    }

    // Check if cart is empty
    if (this.cartItems().length === 0) {
      this.checkoutError.set(
        this.languageService.getCurrentLanguage() === 'es'
          ? 'El carrito está vacío'
          : 'Cart is empty'
      );
      return;
    }

    this.isCheckingOut.set(true);
    this.checkoutError.set('');
    this.checkoutSuccess.set(false);

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.checkoutError.set('Debes iniciar sesión para realizar un pedido');
      this.isCheckingOut.set(false);
      return;
    }

    // Prepare order data
    const orderData = {
      customerId: user.id,
      items: this.cartItems().map(item => ({
        productId: item.id,
        productName: item.name,
        productImage: item.image || '',
        quantity: item.quantity,
        unitPrice: item.price
      })),
      shippingAddress: {
        fullName: user.name,
        phone: '555-0000',
        street: 'Dirección temporal',
        city: 'Ciudad',
        state: 'Estado',
        postalCode: '00000',
        country: 'México'
      },
      paymentMethod: 'credit_card' as const,
      notes: 'Pedido desde carrito - actualizar dirección en Mis Pedidos'
    };

    // Debug: Log order data being sent
    console.log('=== CHECKOUT DEBUG ===');
    console.log('Order Data:', JSON.stringify(orderData, null, 2));
    console.log('URL:', `${this.orderService['baseUrl']}`);
    console.log('User:', user);

    const checkoutSub = this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('✅ Order created successfully:', response);
        this.isCheckingOut.set(false);
        this.checkoutSuccess.set(true);

        // Clear the cart
        this.cartService.clearCart();

        // Redirect to profile after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 2000);
      },
      error: (err) => {
        console.error('❌ CHECKOUT ERROR - Full Details:');
        console.error('Status:', err.status);
        console.error('Status Text:', err.statusText);
        console.error('Error Body:', err.error);
        console.error('Message:', err.message);
        console.error('Full Error Object:', err);

        this.isCheckingOut.set(false);

        // Try to extract detailed error message from backend
        let errorMessage = '';
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.error?.errors) {
          // Validation errors from backend
          const validationErrors = Object.entries(err.error.errors)
            .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          errorMessage = `Errores de validación:\n${validationErrors}`;
        } else {
          errorMessage = this.languageService.getCurrentLanguage() === 'es'
            ? 'Error al procesar el pedido. Por favor intenta de nuevo.'
            : 'Error processing order. Please try again.';
        }

        this.checkoutError.set(errorMessage);

        // Generate backend report
        console.log('\n🔴 MENSAJE PARA EL BACKEND:');
        console.log('==========================');
        console.log('Endpoint: POST https://localhost:5006/api/orders');
        console.log('Datos enviados:', JSON.stringify(orderData, null, 2));
        console.log('\nRespuesta del servidor:');
        console.log('- Status:', err.status);
        console.log('- Error:', err.error);
        console.log('\nChecklist para Backend:');
        console.log('[ ] Verificar que el DTO OrderCreateDto acepta estos campos');
        console.log('[ ] Verificar validaciones en el modelo');
        console.log('[ ] Revisar logs del servidor para más detalles');
        console.log('[ ] Verificar que customerId existe en la tabla Users');
        console.log('[ ] Verificar que productId existe en la tabla Products');
        console.log('==========================\n');
      }
    });

    this.subscriptions.add(checkoutSub);
  }
}
