/**
 * Interface for standardized API responses
 * Used by all backend endpoints
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: string[];
}
