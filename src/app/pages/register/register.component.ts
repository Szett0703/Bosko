import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup;
  registerError: string = '';
  isLoading: boolean = false;
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.registerError = '';

    const { name, email, password } = this.registerForm.value;
    const userData = { name, email, password };

    const registerSub = this.authService.register(userData).subscribe({
      next: () => {
        this.isLoading = false;
        // Navigate to home after successful registration
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.registerError = err.error?.message || 'Error al registrar usuario. Por favor intenta de nuevo.';
      }
    });

    this.subscriptions.add(registerSub);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);

    if (control?.hasError('required')) {
      const fieldNames: { [key: string]: string } = {
        name: 'Nombre',
        email: 'Email',
        password: 'Contraseña',
        confirmPassword: 'Confirmar contraseña'
      };
      return `${fieldNames[fieldName]} es requerido`;
    }

    if (control?.hasError('email')) {
      return 'Email no es válido';
    }

    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }

    return '';
  }

  getPasswordMatchError(): string {
    if (this.registerForm.hasError('passwordMismatch') &&
        this.registerForm.get('confirmPassword')?.touched) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }
}
