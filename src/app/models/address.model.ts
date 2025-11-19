export interface Address {
  id: number;
  label?: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAddressRequest {
  label?: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends CreateAddressRequest {}
