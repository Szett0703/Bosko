/**
 * Category interface matching backend API
 */
export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  productCount: number;
  createdAt: Date;
}

/**
 * DTO for creating/updating categories
 */
export interface CategoryCreateDto {
  name: string;
  description?: string;
  image?: string;
}

/**
 * Simple category for dropdowns
 */
export interface SimpleCategoryDto {
  id: number;
  name: string;
  productCount: number;
}
