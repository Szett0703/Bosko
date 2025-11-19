import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  // Computed signals
  items = computed(() => this.cartItems());
  itemCount = computed(() => this.cartItems().reduce((sum, item) => sum + item.quantity, 0));
  subtotal = computed(() => this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0));
  tax = computed(() => this.subtotal() * 0.1); // 10% tax
  total = computed(() => this.subtotal() + this.tax());

  constructor() {
    // Load cart from localStorage on init
    this.loadCartFromStorage();
  }

  addToCart(product: Product) {
    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Increment quantity if item already exists
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1
      };
      this.cartItems.set(updatedItems);
    } else {
      // Add new item with quantity 1
      this.cartItems.set([...currentItems, { ...product, quantity: 1 }]);
    }

    this.saveCartToStorage();
  }

  removeFromCart(productId: number) {
    const updatedItems = this.cartItems().filter(item => item.id !== productId);
    this.cartItems.set(updatedItems);
    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems();
    const updatedItems = currentItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    this.cartItems.set(updatedItems);
    this.saveCartToStorage();
  }

  clearCart() {
    this.cartItems.set([]);
    this.saveCartToStorage();
  }

  private saveCartToStorage() {
    localStorage.setItem('bosko-cart', JSON.stringify(this.cartItems()));
  }

  private loadCartFromStorage() {
    const savedCart = localStorage.getItem('bosko-cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        this.cartItems.set(items);
      } catch (e) {
        console.error('Error loading cart from storage:', e);
      }
    }
  }
}
