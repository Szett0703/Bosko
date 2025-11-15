import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { getImageUrl } from '../../config/api.config';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product;
  imageLoaded = false;
  imageError = false;
  placeholderImage = 'https://via.placeholder.com/400x500/3B82F6/FFFFFF?text=Bosko+Product';

  t = computed(() => this.languageService.getTranslations());

  constructor(
    private languageService: LanguageService,
    private cartService: CartService
  ) {}

  /**
   * Obtiene la URL completa de la imagen del producto
   */
  getProductImageUrl(): string {
    return getImageUrl(this.product.image);
  }

  /**
   * Maneja el error al cargar la imagen
   */
  onImageError(event: Event): void {
    this.imageError = true;
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.placeholderImage;
  }

  /**
   * Maneja la carga exitosa de la imagen
   */
  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onAddToCart() {
    this.cartService.addToCart(this.product);
  }
}
