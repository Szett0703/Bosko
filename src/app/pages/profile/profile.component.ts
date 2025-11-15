import { Component, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  t = computed(() => this.languageService.getTranslations());
  currentLang = computed(() => this.languageService.getCurrentLanguage());

  profileForm: FormGroup;
  saveSuccess = signal(false);
  orders: Order[] = [];
  isLoadingOrders = true;
  ordersError = '';
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private languageService: LanguageService,
    private authService: AuthService,
    private orderService: OrderService
  ) {
    const currentUser = this.authService.getCurrentUser();

    this.profileForm = this.fb.group({
      name: [currentUser?.name || '', [Validators.required]],
      email: [currentUser?.email || '', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      notifications: [true],
      newsletter: [true]
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadOrders(): void {
    this.isLoadingOrders = true;
    this.ordersError = '';

    const ordersSub = this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoadingOrders = false;
      },
      error: (err) => {
        this.ordersError = 'No se pudieron cargar los pedidos.';
        this.isLoadingOrders = false;
        console.error('Error loading orders:', err);
      }
    });

    this.subscriptions.add(ordersSub);
  }

  onSaveProfile() {
    if (this.profileForm.valid) {
      // TODO: Implement user profile update API call
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
