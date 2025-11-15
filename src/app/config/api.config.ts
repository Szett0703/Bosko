export const API_CONFIG = {
  baseUrl: 'https://localhost:5001/api',
  backendUrl: 'https://localhost:5001', // URL base para imágenes
  endpoints: {
    products: '/products',
    categories: '/categories',
    addresses: '/addresses',
    wishlist: '/wishlist',
    reviews: '/reviews',
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      googleLogin: '/auth/google-login',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password'
    },
    orders: '/orders',
    users: {
      me: '/users/me',
      base: '/users'
    },
    admin: {
      stats: '/admin/stats',
      products: '/admin/products',
      categories: '/admin/categories',
      orders: '/admin/orders',
      users: '/admin/users'
    }
  }
};

/**
 * Obtiene la URL completa de una imagen
 * @param imagePath - Ruta de la imagen (puede ser URL completa, ruta relativa o nombre de archivo)
 * @returns URL completa de la imagen
 */
export function getImageUrl(imagePath: string | undefined): string {
  const placeholderImage = 'https://via.placeholder.com/400x500/3B82F6/FFFFFF?text=Bosko+Product';

  if (!imagePath) {
    return placeholderImage;
  }

  // Si ya es una URL completa (http/https), devolverla tal cual
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Si empieza con /, concatenar con backendUrl
  if (imagePath.startsWith('/')) {
    // Evitar doble slash
    return `${API_CONFIG.backendUrl}${imagePath}`;
  }

  // Si es solo el nombre del archivo, asumir que está en /uploads/
  return `${API_CONFIG.backendUrl}/uploads/${imagePath}`;
}
