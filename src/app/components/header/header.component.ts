import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { HasRoleDirective } from '../../directives/has-role.directive';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, HasRoleDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMobileMenuOpen = false;

  // Computed signals for translations
  currentLang = computed(() => this.languageService.getCurrentLanguage());
  t = computed(() => this.languageService.getTranslations());
  cartItemCount = computed(() => this.cartService.itemCount());
  isLoggedIn = computed(() => this.authService.isLoggedIn());
  currentUser = computed(() => this.authService.getCurrentUser());
  isAdminUser = computed(() => this.authService.isAdmin());
  isEmployeeUser = computed(() => this.authService.isEmployee());
  hasAdminAccess = computed(() => this.authService.hasRole(['Admin', 'Employee']));

  constructor(
    private router: Router,
    public languageService: LanguageService,
    private cartService: CartService,
    public authService: AuthService
  ) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }

  toggleSidebar() {
    // Emit event to parent component
    window.dispatchEvent(new CustomEvent('toggleSidebar'));
  }

  goToHome() {
    this.router.navigate(['/']);
    this.isMobileMenuOpen = false;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.isMobileMenuOpen = false;
  }

  onLogout() {
    this.authService.logout();
    this.isMobileMenuOpen = false;
  }
}
