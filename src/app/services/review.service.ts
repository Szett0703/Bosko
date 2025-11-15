import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Review, CreateReviewRequest, UpdateReviewRequest } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private http: HttpClient) {}

  getProductReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products}/${productId}/reviews`);
  }

  createReview(productId: number, payload: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products}/${productId}/reviews`, payload);
  }

  updateReview(reviewId: number, payload: UpdateReviewRequest): Observable<Review> {
    return this.http.put<Review>(`${API_CONFIG.baseUrl}/reviews/${reviewId}`, payload);
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.baseUrl}/reviews/${reviewId}`);
  }
}
