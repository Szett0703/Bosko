import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Address, CreateAddressRequest, UpdateAddressRequest } from '../models/address.model';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.addresses ?? '/addresses'}`;

  constructor(private http: HttpClient) {}

  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(this.baseUrl);
  }

  createAddress(payload: CreateAddressRequest): Observable<Address> {
    return this.http.post<Address>(this.baseUrl, payload);
  }

  updateAddress(id: number, payload: UpdateAddressRequest): Observable<Address> {
    return this.http.put<Address>(`${this.baseUrl}/${id}`, payload);
  }

  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  setDefaultAddress(id: number): Observable<Address> {
    return this.http.post<Address>(`${this.baseUrl}/${id}/default`, {});
  }
}
