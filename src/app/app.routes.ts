import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { authGuard } from './guards/auth.guard';
import { adminRoutes } from './admin/admin.routes';

export const routes: Routes = [
  ...adminRoutes,
  // Public routes
  { path: '', component: HomeComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'cart', component: CartComponent },

  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Protected routes
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  // Error pages
  { path: 'forbidden', component: ForbiddenComponent },

  // Fallback
  { path: '**', redirectTo: '' }
];
