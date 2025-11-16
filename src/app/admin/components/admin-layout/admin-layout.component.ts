import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  searchQuery = '';
  pendingOrders = 8; // TODO: Get from backend
  notifications = 5; // TODO: Get from backend
  currentPage = 'Dashboard';

  currentUser = computed(() => this.authService.getCurrentUser());
  currentLang = computed(() => this.languageService.getCurrentLanguage());

  constructor(
    private authService: AuthService,
    private languageService: LanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Update page title on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageTitle();
    });

    this.updatePageTitle();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }

  getUserInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getCurrentPageTitle(): string {
    return this.currentPage;
  }

  private updatePageTitle(): void {
    const url = this.router.url;
    if (url === '/admin' || url === '/admin/') {
      this.currentPage = 'Dashboard';
    } else if (url.includes('/admin/orders')) {
      this.currentPage = 'Gestión de Pedidos';
    } else if (url.includes('/admin/products')) {
      this.currentPage = 'Gestión de Productos';
    } else if (url.includes('/admin/categories')) {
      this.currentPage = 'Gestión de Categorías';
    } else if (url.includes('/admin/users')) {
      this.currentPage = 'Gestión de Usuarios';
    } else {
      this.currentPage = 'Admin Panel';
    }
  }
}
