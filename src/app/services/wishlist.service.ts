import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { WishlistItem, WishlistResponse } from '../models/wishlist.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.wishlist ?? '/wishlist'}`;

  constructor(private http: HttpClient) {}

  getWishlist(): Observable<WishlistResponse> {
    return this.http.get<WishlistResponse>(this.baseUrl);
  }

  addToWishlist(productId: number): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(this.baseUrl, { productId });
  }

  removeFromWishlist(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}`);
  }

  clearWishlist(): Observable<void> {
    return this.http.delete<void>(this.baseUrl);
  }
}
