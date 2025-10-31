import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  t = computed(() => this.languageService.getTranslations());

  constructor(
    private languageService: LanguageService,
    private router: Router
  ) {}

  shopNow() {
    this.router.navigate(['/collections']);
  }
}
