import { Component, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';
import { LanguageService } from '../../services/language.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { getImageUrl } from '../../config/api.config';
import { Subscription } from 'rxjs';

interface CollectionWithExpansion extends Category {
  isExpanded: boolean;
}

@Component({
  selector: 'app-collections',
  imports: [CommonModule, ProductGridComponent],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class CollectionsComponent implements OnInit, OnDestroy {
  t = computed(() => this.languageService.getTranslations());
  collections: CollectionWithExpansion[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  private subscriptions = new Subscription();

  constructor(
    private languageService: LanguageService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCollections();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadCollections(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const categorySub = this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.collections = categories.map(cat => ({
          ...cat,
          isExpanded: false
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar colecciones. Por favor verifica que el backend esté corriendo.';
        this.isLoading = false;
        console.error('Error loading collections:', err);
      }
    });

    this.subscriptions.add(categorySub);
  }

  toggleCollection(collectionId: number): void {
    const collection = this.collections.find(c => c.id === collectionId);
    if (collection) {
      collection.isExpanded = !collection.isExpanded;
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
    imgElement.src = 'https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Collection';
  }
}
