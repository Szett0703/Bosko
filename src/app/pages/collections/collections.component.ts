import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';
import { LanguageService } from '../../services/language.service';

interface Collection {
  id: number;
  name: string;
  description: string;
  image: string;
  isExpanded: boolean;
}

@Component({
  selector: 'app-collections',
  imports: [CommonModule, ProductGridComponent],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class CollectionsComponent {
  t = computed(() => this.languageService.getTranslations());

  constructor(private languageService: LanguageService) {}

  collections: Collection[] = [
    {
      id: 1,
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&h=600&fit=crop',
      isExpanded: false
    },
    {
      id: 2,
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop',
      isExpanded: false
    },
    {
      id: 3,
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=600&fit=crop',
      isExpanded: false
    },
    {
      id: 4,
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=800&h=600&fit=crop',
      isExpanded: false
    },
    {
      id: 5,
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=600&fit=crop',
      isExpanded: false
    },
    {
      id: 6,
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&h=600&fit=crop',
      isExpanded: false
    }
  ];

  getCollectionName(id: number): string {
    const trans = this.t().collections;
    switch(id) {
      case 1: return trans.menCollection.name;
      case 2: return trans.womenCollection.name;
      case 3: return trans.kidsCollection.name;
      case 4: return trans.accessoriesCollection.name;
      case 5: return trans.footwearCollection.name;
      case 6: return trans.saleCollection.name;
      default: return '';
    }
  }

  getCollectionDescription(id: number): string {
    const trans = this.t().collections;
    switch(id) {
      case 1: return trans.menCollection.description;
      case 2: return trans.womenCollection.description;
      case 3: return trans.kidsCollection.description;
      case 4: return trans.accessoriesCollection.description;
      case 5: return trans.footwearCollection.description;
      case 6: return trans.saleCollection.description;
      default: return '';
    }
  }

  toggleCollection(collectionId: number): void {
    const collection = this.collections.find(c => c.id === collectionId);
    if (collection) {
      collection.isExpanded = !collection.isExpanded;
    }
  }
}
