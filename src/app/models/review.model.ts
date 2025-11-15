import { User } from './user.model';

export interface Review {
  id: number;
  productId: number;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
  author: Pick<User, 'id' | 'name' | 'email'>;
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest extends CreateReviewRequest {}
