import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-grid',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.css'
})
export class ProductGridComponent implements OnInit, OnDestroy {
  @Input() categoryId?: number;
  products: Product[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  private subscriptions = new Subscription();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const observable = this.categoryId
      ? this.productService.getProductsByCategory(this.categoryId)
      : this.productService.getAllProducts();

    const subscription = observable.subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar productos. Por favor verifica que el backend esté corriendo.';
        this.isLoading = false;
        console.error('Error loading products:', err);
      }
    });

    this.subscriptions.add(subscription);
  }
}
