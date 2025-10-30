import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMobileMenuOpen = false;

  // Computed signals for translations
  currentLang = computed(() => this.languageService.getCurrentLanguage());
  t = computed(() => this.languageService.getTranslations());

  constructor(
    private router: Router,
    public languageService: LanguageService
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
}
