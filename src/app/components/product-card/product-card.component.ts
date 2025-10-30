import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
}

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product;

  t = computed(() => this.languageService.getTranslations());

  constructor(private languageService: LanguageService) {}
}
