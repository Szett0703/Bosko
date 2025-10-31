import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../services/language.service';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  t = computed(() => this.languageService.getTranslations());
  currentLang = computed(() => this.languageService.getCurrentLanguage());

  profileForm: FormGroup;
  saveSuccess = signal(false);

  // Mock orders data
  orders: Order[] = [];

  constructor(
    private fb: FormBuilder,
    private languageService: LanguageService
  ) {
    this.profileForm = this.fb.group({
      name: ['John Doe', [Validators.required]],
      email: ['john.doe@example.com', [Validators.required, Validators.email]],
      phone: ['+1 (555) 123-4567', [Validators.required]],
      notifications: [true],
      newsletter: [true]
    });
  }

  onSaveProfile() {
    if (this.profileForm.valid) {
      this.saveSuccess.set(true);
      setTimeout(() => {
        this.saveSuccess.set(false);
      }, 3000);
    }
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }
}
