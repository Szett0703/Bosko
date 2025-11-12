import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  t = computed(() => this.languageService.getTranslations());
  currentLang = computed(() => this.languageService.getCurrentLanguage());
  contactForm: FormGroup;
  isSubmitting = signal(false);
  submitSuccess = signal(false);

  constructor(
    private fb: FormBuilder,
    private languageService: LanguageService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting.set(false);
        this.submitSuccess.set(true);
        this.contactForm.reset();

        // Reset success message after 5 seconds
        setTimeout(() => {
          this.submitSuccess.set(false);
        }, 5000);
      }, 1500);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    const lang = this.languageService.getCurrentLanguage();

    if (field?.hasError('required')) {
      return lang === 'es' ? 'Este campo es requerido' : 'This field is required';
    }
    if (field?.hasError('email')) {
      return lang === 'es' ? 'Email inválido' : 'Invalid email';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return lang === 'es'
        ? `Mínimo ${minLength} caracteres`
        : `Minimum ${minLength} characters`;
    }
    return '';
  }
}
