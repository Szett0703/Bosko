import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CartComponent } from './pages/cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '' }
];
