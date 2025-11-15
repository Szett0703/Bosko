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

    // Prepare order data
    const orderData = {
      items: this.cartItems().map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    const checkoutSub = this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
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
        this.isCheckingOut.set(false);
        this.checkoutError.set(
          err.error?.message ||
          (this.languageService.getCurrentLanguage() === 'es'
            ? 'Error al procesar el pedido. Por favor intenta de nuevo.'
            : 'Error processing order. Please try again.')
        );
      }
    });

    this.subscriptions.add(checkoutSub);
  }
}
