import { Component, computed, signal, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { UserProfileService, UpdateProfileDto, ChangePasswordDto, UserPreferencesDto } from '../../services/user-profile.service';
import { AddressService } from '../../services/address.service';
import { Order } from '../../models/order.model';
import { Address, CreateAddressRequest } from '../../models/address.model';
import { User } from '../../models/user.model';
import { ApiResponse } from '../../models/api-response.interface';
import { Subscription } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';

type TabType = 'personal' | 'orders' | 'addresses' | 'security' | 'preferences';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  t = computed(() => this.languageService.getTranslations());
  currentLang = computed(() => this.languageService.getCurrentLanguage());

  // Tab management
  activeTab = signal<TabType>('personal');

  tabs = [
    {
      id: 'personal' as TabType,
      label: 'Personal',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      id: 'security' as TabType,
      label: 'Seguridad',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
    },
    {
      id: 'orders' as TabType,
      label: 'Pedidos',
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
    },
    {
      id: 'addresses' as TabType,
      label: 'Direcciones',
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
    },
    {
      id: 'preferences' as TabType,
      label: 'Preferencias',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z'
    }
  ];

  // Forms
  profileForm: FormGroup;
  passwordForm: FormGroup;
  addressForm: FormGroup;
  preferencesForm: FormGroup;

  // User data
  currentUser: User | null = null;
  avatarUrl = signal<string>('');

  // States
  saveSuccess = signal(false);
  saveError = signal('');
  isLoadingProfile = signal(false);
  isLoadingOrders = signal(true);
  isLoadingAddresses = signal(true);
  isSavingPassword = signal(false);
  passwordSuccess = signal(false);
  passwordError = signal('');

  // Data
  orders: Order[] = [];
  ordersError = '';
  addresses: Address[] = [];
  addressesError = '';

  // Modals
  showAddressModal = signal(false);
  showOrderDetailsModal = signal(false);
  editingAddress: Address | null = null;
  selectedOrder: Order | null = null;

  private subscriptions = new Subscription();

  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private languageService: LanguageService,
    private authService: AuthService,
    private orderService: OrderService,
    private userProfileService: UserProfileService,
    private addressService: AddressService
  ) {
    this.currentUser = this.authService.getCurrentUser();

    // Initialize forms
    this.profileForm = this.fb.group({
      name: [this.currentUser?.name || '', [Validators.required, Validators.minLength(2)]],
      email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
      phone: [this.currentUser?.phone || '']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });

    this.addressForm = this.fb.group({
      fullName: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: [''],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      isDefault: [false]
    });

    this.preferencesForm = this.fb.group({
      notifications: [true],
      newsletter: [false]
    });

    // Set avatar
    this.avatarUrl.set(this.getUserInitials(this.currentUser?.name || 'U'));
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadOrders();
    this.loadAddresses();
  }

  // Load complete user profile from backend
  loadUserProfile(): void {
    this.userProfileService.getMyProfile().subscribe({
      next: (user) => {
        console.log('✅ Perfil de usuario cargado:', user);
        this.currentUser = user;

        // Update form with fresh data from backend
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone || ''
        });

        // Update avatar if available
        if (user.avatarUrl) {
          this.avatarUrl.set(user.avatarUrl);
        }
      },
      error: (err) => {
        console.error('❌ Error cargando perfil:', err);
        // Fallback to cached user data
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Tab navigation
  switchTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  // Password form validator
  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  // Profile update
  onSaveProfile(): void {
    if (this.profileForm.invalid) return;

    this.isLoadingProfile.set(true);
    this.saveSuccess.set(false);
    this.saveError.set('');

    const data: UpdateProfileDto = {
      name: this.profileForm.value.name,
      email: this.profileForm.value.email,
      phone: this.profileForm.value.phone
    };

    this.userProfileService.updateProfile(data).subscribe({
      next: (updatedUser) => {
        console.log('✅ Perfil actualizado:', updatedUser);

        // Update local user data
        this.currentUser = updatedUser;

        // Update auth service with new user data
        this.authService.updateCurrentUserData(updatedUser);

        this.saveSuccess.set(true);
        this.isLoadingProfile.set(false);

        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: (err) => {
        console.error('❌ Error actualizando perfil:', err);
        this.saveError.set(err.error?.message || 'Error al actualizar el perfil');
        this.isLoadingProfile.set(false);
      }
    });
  }

  // Change password
  onChangePassword(): void {
    if (this.passwordForm.invalid) return;

    this.isSavingPassword.set(true);
    this.passwordSuccess.set(false);
    this.passwordError.set('');

    const data: ChangePasswordDto = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.userProfileService.changePassword(data).subscribe({
      next: () => {
        console.log('✅ Contraseña cambiada exitosamente');
        this.passwordSuccess.set(true);
        this.passwordForm.reset();
        this.isSavingPassword.set(false);

        setTimeout(() => this.passwordSuccess.set(false), 3000);
      },
      error: (err) => {
        console.error('❌ Error cambiando contraseña:', err);
        this.passwordError.set(err.error?.message || 'Error al cambiar la contraseña');
        this.isSavingPassword.set(false);
      }
    });
  }

  loadOrders(): void {
    this.isLoadingOrders.set(true);
    this.ordersError = '';

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.ordersError = 'Usuario no autenticado.';
      this.isLoadingOrders.set(false);
      return;
    }

    const ordersSub = this.orderService.getMyOrders(user.id).subscribe({
      next: (orders) => {
        console.log('✅ Pedidos cargados:', orders);
        this.orders = orders;
        this.isLoadingOrders.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando pedidos:', err);
        this.ordersError = 'No se pudieron cargar los pedidos.';
        this.isLoadingOrders.set(false);
      }
    });

    this.subscriptions.add(ordersSub);
  }

  loadAddresses(): void {
    this.isLoadingAddresses.set(true);
    this.addressesError = '';

    const addressesSub = this.addressService.getAddresses().subscribe({
      next: (addresses) => {
        console.log('✅ Direcciones cargadas:', addresses);
        this.addresses = addresses;
        this.isLoadingAddresses.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando direcciones:', err);
        this.addressesError = 'No se pudieron cargar las direcciones.';
        this.isLoadingAddresses.set(false);
      }
    });

    this.subscriptions.add(addressesSub);
  }

  // Address modal management
  openAddressModal(address?: Address): void {
    this.editingAddress = address || null;

    if (address) {
      this.addressForm.patchValue({
        fullName: address.label || '',
        street: address.street,
        city: address.city,
        state: address.state || '',
        postalCode: address.postalCode,
        country: address.country,
        phone: '',
        isDefault: address.isDefault || false
      });
    } else {
      this.addressForm.reset({ isDefault: false });
    }

    this.showAddressModal.set(true);
  }

  closeAddressModal(): void {
    this.showAddressModal.set(false);
    this.editingAddress = null;
    this.addressForm.reset();
  }

  onSaveAddress(): void {
    if (this.addressForm.invalid) return;

    const addressData: CreateAddressRequest = {
      label: this.addressForm.value.fullName,
      street: this.addressForm.value.street,
      city: this.addressForm.value.city,
      state: this.addressForm.value.state,
      postalCode: this.addressForm.value.postalCode,
      country: this.addressForm.value.country,
      isDefault: this.addressForm.value.isDefault
    };

    if (this.editingAddress) {
      // Update existing address
      this.addressService.updateAddress(this.editingAddress.id, addressData).subscribe({
        next: () => {
          console.log('✅ Dirección actualizada');
          this.loadAddresses();
          this.closeAddressModal();
        },
        error: (err) => {
          console.error('❌ Error actualizando dirección:', err);
          alert('Error al actualizar la dirección');
        }
      });
    } else {
      // Create new address
      this.addressService.createAddress(addressData).subscribe({
        next: () => {
          console.log('✅ Dirección creada');
          this.loadAddresses();
          this.closeAddressModal();
        },
        error: (err) => {
          console.error('❌ Error creando dirección:', err);
          alert('Error al crear la dirección');
        }
      });
    }
  }

  onDeleteAddress(addressId: number): void {
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;

    this.addressService.deleteAddress(addressId).subscribe({
      next: () => {
        console.log('✅ Dirección eliminada');
        this.loadAddresses();
      },
      error: (err) => {
        console.error('❌ Error eliminando dirección:', err);
        alert('Error al eliminar la dirección');
      }
    });
  }

  onSetDefaultAddress(addressId: number): void {
    this.addressService.setDefaultAddress(addressId).subscribe({
      next: () => {
        console.log('✅ Dirección predeterminada establecida');
        this.loadAddresses();
      },
      error: (err) => {
        console.error('❌ Error estableciendo dirección predeterminada:', err);
        alert('Error al establecer dirección predeterminada');
      }
    });
  }

  // Order details modal
  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showOrderDetailsModal.set(true);
  }

  closeOrderDetailsModal(): void {
    this.showOrderDetailsModal.set(false);
    this.selectedOrder = null;
  }

  // Avatar upload
  triggerAvatarUpload(): void {
    this.avatarInput.nativeElement.click();
  }

  onAvatarSelected(event: any): void {
    const file: File = event.target.files[0];

    if (!file) return;

    // Validar tamaño (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 5 MB');
      return;
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de archivo no permitido. Solo JPEG, PNG o WEBP');
      return;
    }

    this.uploadAvatar(file);
  }

  uploadAvatar(file: File): void {
    const formData = new FormData();
    formData.append('avatar', file);

    this.http.post<ApiResponse<string>>(`${API_CONFIG.backendUrl}/api/users/me/avatar`, formData)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.avatarUrl.set(response.data);
            if (this.currentUser) {
              this.currentUser.avatarUrl = response.data;
            }
            console.log('✅ Avatar actualizado:', response.data);
            alert('Avatar actualizado correctamente');
          }
        },
        error: (err) => {
          console.error('❌ Error al subir avatar:', err);
          alert(err.error?.message || 'Error al subir avatar');
        }
      });
  }

  // Preferences
  onSavePreferences(): void {
    if (this.preferencesForm.invalid) return;

    const data: UserPreferencesDto = {
      notifications: this.preferencesForm.value.notifications,
      newsletter: this.preferencesForm.value.newsletter,
      language: this.currentLang()
    };

    this.userProfileService.updatePreferences(data).subscribe({
      next: () => {
        console.log('✅ Preferencias actualizadas');
        alert('Preferencias guardadas correctamente');
      },
      error: (err) => {
        console.error('❌ Error actualizando preferencias:', err);
        alert(err.error?.message || 'Error al actualizar preferencias');
      }
    });
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pending': 'Pendiente',
      'processing': 'Procesando',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }

  getUserInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return classes[status] || 'status-pending';
  }

  getFormattedAddress(address: any): string {
    if (typeof address === 'string') {
      return address;
    }
    if (address && typeof address === 'object') {
      const parts = [
        address.street,
        address.city,
        address.state,
        address.postalCode,
        address.country
      ].filter(Boolean);
      return parts.join(', ');
    }
    return 'Sin dirección';
  }
}
