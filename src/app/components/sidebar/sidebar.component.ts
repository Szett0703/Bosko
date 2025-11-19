import { Component, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  isOpen = false;
  isCollapsed = true; // Empieza colapsado
  isPinned = false; // Para mantener expandido cuando se hace click
  isAdminMenuOpen = false; // Estado del menú desplegable de admin
  private toggleListener: any;

  t = computed(() => this.languageService.getTranslations());
  currentUser = computed(() => this.authService.getCurrentUser());

  // Check if user is admin
  isAdmin = computed(() => {
    const user = this.currentUser();
    return user !== null && user.role === 'Admin';
  });

  constructor(
    private languageService: LanguageService,
    private authService: AuthService
  ) {}

  // Categories will be loaded dynamically from API in future implementation
  categories: any[] = [];

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

  close() {
    this.isOpen = false;
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

  toggleAdminMenu() {
    this.isAdminMenuOpen = !this.isAdminMenuOpen;
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
}
