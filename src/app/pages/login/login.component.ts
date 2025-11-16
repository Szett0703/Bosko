import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loginError: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Pre-fill email if remember me was checked
    const savedEmail = localStorage.getItem('bosko-remember-email');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true
      });
    }

    // Initialize Google Sign-In if available
    this.initializeGoogleSignIn();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.loginError = '';

    const { email, password, rememberMe } = this.loginForm.value;
    const credentials = { email, password };

    // Save email if remember me is checked
    if (rememberMe) {
      localStorage.setItem('bosko-remember-email', email);
    } else {
      localStorage.removeItem('bosko-remember-email');
    }

    const loginSub = this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;

        // Get return URL or redirect based on role
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

        if (returnUrl) {
          this.router.navigate([returnUrl]);
        } else {
          // Redirect based on user role
          this.redirectByRole(response.user.role);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = this.getApiErrorMessage(err);
      }
    });

    this.subscriptions.add(loginSub);
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case 'Admin':
        this.router.navigate(['/admin']);
        break;
      case 'Employee':
        this.router.navigate(['/admin']);
        break;
      case 'Customer':
      default:
        this.router.navigate(['/']);
        break;
    }
  }

  private getApiErrorMessage(err: any): string {
    if (err.status === 401) {
      return 'Email o contraseña incorrectos';
    }
    if (err.status === 0) {
      return 'No se puede conectar al servidor. Verifica tu conexión.';
    }
    return err.error?.message || err.error?.title || 'Error al iniciar sesión. Intenta nuevamente.';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private initializeGoogleSignIn(): void {
    // Initialize Google Sign-In when the library is loaded
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace with your actual Client ID
        callback: this.handleGoogleResponse.bind(this)
      });
    }
  }

  handleGoogleResponse(response: any): void {
    if (response.credential) {
      this.isLoading = true;
      this.loginError = '';

      const googleSub = this.authService.googleLogin(response.credential).subscribe({
        next: (authResponse) => {
          this.isLoading = false;
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

          if (returnUrl) {
            this.router.navigate([returnUrl]);
          } else {
            this.redirectByRole(authResponse.user.role);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.loginError = this.getApiErrorMessage(err);
        }
      });

      this.subscriptions.add(googleSub);
    }
  }

  onGoogleSignIn(): void {
    // Trigger Google One Tap prompt
    if (typeof google !== 'undefined') {
      google.accounts.id.prompt();
    } else {
      this.loginError = 'Google Sign-In no está disponible en este momento';
    }
  }  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName === 'email' ? 'Email' : 'Contraseña'} es requerido`;
    }
    if (control?.hasError('email')) {
      return 'Email no es válido';
    }
    if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }
}
