import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  t = computed(() => this.languageService.getTranslations());
  cartItems = computed(() => this.cartService.items());
  itemCount = computed(() => this.cartService.itemCount());
  subtotal = computed(() => this.cartService.subtotal());
  tax = computed(() => this.cartService.tax());
  total = computed(() => this.cartService.total());

  constructor(
    private cartService: CartService,
    private languageService: LanguageService,
    private router: Router
  ) {}

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

  continueShopping() {
    this.router.navigate(['/collections']);
  }

  checkout() {
    alert(this.t().cart.checkout + ' - ' + (this.languageService.getCurrentLanguage() === 'es' ? 'Próximamente' : 'Coming Soon'));
  }
}
