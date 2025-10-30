import { Component, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  isOpen = false;
  isCollapsed = true; // Empieza colapsado
  isPinned = false; // Para mantener expandido cuando se hace click
  private toggleListener: any;

  t = computed(() => this.languageService.getTranslations());

  constructor(private languageService: LanguageService) {}

  categories = [
    {
      key: 'men',
      icon: 'M12 2a5 5 0 015 5v1h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9a2 2 0 012-2h2V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v1h6V7a3 3 0 00-3-3z'
    },
    {
      key: 'women',
      icon: 'M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm5 18h-2v-6H9v6H7V11c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v9z'
    },
    {
      key: 'kids',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'
    },
    {
      key: 'accessories',
      icon: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z'
    },
    {
      key: 'footwear',
      icon: 'M12.48 3L7.73 7.75 3 12.59 9 10l-4 11h2l4.5-8 4.5 8h2l-4-11 6-2.59-4.73-4.84z'
    },
    {
      key: 'sale',
      icon: 'M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z'
    }
  ];

  getCategoryName(key: string): string {
    const translations = this.t();
    const categories = translations.sidebar.categories;
    switch(key) {
      case 'men': return categories.men;
      case 'women': return categories.women;
      case 'kids': return categories.kids;
      case 'accessories': return categories.accessories;
      case 'footwear': return categories.footwear;
      case 'sale': return categories.sale;
      default: return key;
    }
  }

  ngOnInit() {
    this.toggleListener = () => this.toggle();
    window.addEventListener('toggleSidebar', this.toggleListener);
    // Asegurar que el body no tenga la clase al inicio
    document.body.classList.remove('sidebar-expanded');
  }

  ngOnDestroy() {
    window.removeEventListener('toggleSidebar', this.toggleListener);
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  togglePin() {
    this.isPinned = !this.isPinned;
    if (this.isPinned) {
      this.isCollapsed = false;
      document.body.classList.add('sidebar-expanded');
    } else {
      document.body.classList.remove('sidebar-expanded');
    }
  }

  onMouseEnter() {
    if (!this.isPinned) {
      this.isCollapsed = false;
      document.body.classList.add('sidebar-expanded');
    }
  }

  onMouseLeave() {
    if (!this.isPinned) {
      this.isCollapsed = true;
      document.body.classList.remove('sidebar-expanded');
    }
  }

  close() {
    this.isOpen = false;
  }
}
