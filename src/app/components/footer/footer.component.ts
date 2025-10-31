import { Component, computed } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  t = computed(() => this.languageService.getTranslations());

  constructor(private languageService: LanguageService) {}
}
