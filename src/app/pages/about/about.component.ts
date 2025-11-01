import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  t = computed(() => this.languageService.getTranslations());
  currentLang = computed(() => this.languageService.getCurrentLanguage());

  constructor(private languageService: LanguageService) {}
}
