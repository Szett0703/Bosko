# 📋 RESUMEN DE APIS IMPLEMENTADAS - BOSKO FRONTEND

**Fecha:** 18 de Noviembre 2025  
**Backend URL:** `https://localhost:5006`  
**Frontend URL:** `http://localhost:4300`

---

## 🔐 AUTENTICACIÓN (`/api/auth`)

### POST `/api/auth/login`
**Request:**
```json
{
  "email": "admin@bosko.com",
  "password": "Admin123!"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@bosko.com",
    "role": "Admin",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

**Response 401:**
```json
{
  "message": "Email o contraseña incorrectos"
}
```

**Frontend:** `auth.service.ts` - método `login()`

---

### POST `/api/auth/register`
**Request:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123!"
}
```

**Response 200:** Igual que login (token + user)

**Frontend:** `auth.service.ts` - método `register()`

---

### POST `/api/auth/forgot-password`
**Request:**
```json
{
  "email": "usuario@example.com"
}
```

**Response 200:**
```json
{
  "message": "Se ha enviado un correo con instrucciones"
}
```

**Frontend:** `auth.service.ts` - método `forgotPassword()`

---

### POST `/api/auth/reset-password`
**Request:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewPassword123!"
}
```

**Response 200:**
```json
{
  "message": "Contraseña actualizada exitosamente"
}
```

**Frontend:** `auth.service.ts` - método `resetPassword()`

---

## 🛍️ ÓRDENES (`/api/orders`)

### POST `/api/orders` - Crear Orden
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "customerId": 5,
  "items": [
    {
      "productId": 10,
      "productName": "Camiseta Bosko Básica",
      "productImage": "camiseta-basica.jpg",
      "quantity": 2,
      "unitPrice": 299.99
    }
  ],
  "shippingAddress": {
    "fullName": "Juan Pérez",
    "phone": "555-1234",
    "street": "Calle Principal 123",
    "city": "Ciudad de México",
    "state": "CDMX",
    "postalCode": "01000",
    "country": "México"
  },
  "paymentMethod": "credit_card",
  "notes": "Entregar en horario laboral"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Orden creada exitosamente",
  "data": {
    "id": 42,
    "orderNumber": "ORD-20251118-42",
    "customerId": 5,
    "customerName": "Juan Pérez",
    "customerEmail": "juan@example.com",
    "status": "pending",
    "paymentMethod": "credit_card",
    "paymentStatus": "pending",
    "subtotal": 599.98,
    "taxAmount": 95.99,
    "shippingCost": 99.00,
    "totalAmount": 794.97,
    "date": "2025-11-18T10:30:00Z",
    "items": [...],
    "shippingAddress": {...}
  }
}
```

**Frontend:** `order.service.ts` - método `createOrder()`  
**Usado en:** `cart.component.ts` - método `checkout()`

---

### GET `/api/orders/customer/{customerId}` - Mis Órdenes
**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "message": "Órdenes obtenidas",
  "data": [
    {
      "id": 42,
      "orderNumber": "ORD-20251118-42",
      "status": "pending",
      "totalAmount": 794.97,
      "date": "2025-11-18T10:30:00Z",
      "items": [...]
    }
  ]
}
```

**Frontend:** `order.service.ts` - método `getMyOrders(customerId)`  
**Usado en:** 
- `orders.component.ts` - página de pedidos del cliente
- `profile.component.ts` - historial en perfil

---

### POST `/api/orders/{id}/cancel` - Cancelar Orden
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "reason": "Ya no necesito el producto"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Orden cancelada exitosamente",
  "data": true
}
```

**Restricciones:**
- Solo se pueden cancelar órdenes con estado `pending` o `processing`
- Solo el cliente dueño de la orden puede cancelarla

**Frontend:** `order.service.ts` - método `cancelOrder(orderId, reason)`  
**Usado en:** `orders.component.ts` - modal de cancelación

---

### GET `/api/orders` - Listar Órdenes (ADMIN)
**Headers:** `Authorization: Bearer {token}` (requiere rol Admin/Employee)

**Query params:**
- `page=1`
- `pageSize=10`
- `status=pending` (opcional: pending, processing, delivered, cancelled)
- `search=ORD-20251118` (opcional: buscar por número de orden)
- `sortBy=Date` (opcional: Date, TotalAmount, Status)
- `sortDescending=true` (opcional)

**Response 200:**
```json
{
  "success": true,
  "message": "Órdenes obtenidas",
  "data": {
    "items": [...],
    "totalCount": 150,
    "page": 1,
    "pageSize": 10,
    "totalPages": 15
  }
}
```

**Frontend:** `order.service.ts` - método `getOrders(filters)`  
**Usado en:** `admin/pages/orders/` - gestión de órdenes

---

### PUT `/api/orders/{id}/status` - Actualizar Estado (ADMIN)
**Headers:** `Authorization: Bearer {token}` (requiere rol Admin)

**Request:**
```json
{
  "status": "processing",
  "note": "Pedido en preparación",
  "trackingNumber": "TRACK-123456"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Estado actualizado",
  "data": { /* orden actualizada */ }
}
```

**Estados válidos:**
- `pending` → `processing` → `delivered`
- `pending` → `cancelled`
- `processing` → `cancelled`

**Frontend:** `order.service.ts` - método `updateOrderStatus()`  
**Usado en:** Panel de admin (órdenes)

---

### GET `/api/orders/stats` - Estadísticas (ADMIN)
**Headers:** `Authorization: Bearer {token}` (requiere rol Admin)

**Response 200:**
```json
{
  "success": true,
  "message": "Estadísticas obtenidas",
  "data": {
    "totalOrders": 250,
    "pendingOrders": 45,
    "processingOrders": 30,
    "deliveredOrders": 160,
    "cancelledOrders": 15,
    "totalRevenue": 125000.50,
    "averageOrderValue": 500.00
  }
}
```

**Frontend:** `order.service.ts` - método `getOrderStats()`  
**Usado en:** `admin/pages/dashboard/` - tarjetas de estadísticas

---

## 👥 USUARIOS (`/api/users`)

### GET `/api/users` - Listar Usuarios (ADMIN)
**Headers:** `Authorization: Bearer {token}` (requiere rol Admin)

**Query params:**
- `page=1`
- `pageSize=10`
- `search=juan` (buscar por nombre o email)
- `role=Customer` (filtrar por rol: Admin, Employee, Customer)
- `isActive=true` (filtrar por estado activo)
- `sortBy=Name` (Name, Email, CreatedAt)
- `sortDescending=false`

**Response 200:**
```json
{
  "success": true,
  "message": "Usuarios obtenidos",
  "data": {
    "items": [
      {
        "id": 5,
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "phone": "555-1234",
        "role": "Customer",
        "isActive": true,
        "createdAt": "2025-01-15T10:00:00Z",
        "totalOrders": 12,
        "totalSpent": 5000.00
      }
    ],
    "totalCount": 150,
    "page": 1,
    "pageSize": 10,
    "totalPages": 15
  }
}
```

**Frontend:** `auth.service.ts` - método `getUsers(filters)`  
**Usado en:** `admin/pages/users/` - gestión de usuarios

---

### PUT `/api/users/{id}` - Actualizar Usuario (ADMIN)
**Headers:** `Authorization: Bearer {token}` (requiere rol Admin)

**Request:**
```json
{
  "name": "Juan Pérez Actualizado",
  "email": "juan.nuevo@example.com",
  "phone": "555-9999",
  "role": "Employee",
  "isActive": true
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Usuario actualizado",
  "data": { /* usuario actualizado */ }
}
```

**Frontend:** `auth.service.ts` - método `updateUser()`  
**Usado en:** `admin/pages/users/` - edición de usuarios

---

### DELETE `/api/users/{id}` - Eliminar Usuario (ADMIN)
**Headers:** `Authorization: Bearer {token}` (requiere rol Admin)

**Response 200:**
```json
{
  "success": true,
  "message": "Usuario eliminado"
}
```

**Frontend:** `auth.service.ts` - método `deleteUser()`  
**Usado en:** `admin/pages/users/` - eliminar usuarios

---

### PUT `/api/users/{id}/role` - Cambiar Rol (ADMIN)
**Headers:** `Authorization: Bearer {token}` (requiere rol Admin)

**Request:**
```json
{
  "role": "Employee"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Rol actualizado"
}
```

**Frontend:** `auth.service.ts` - método `changeUserRole()`  
**Usado en:** `admin/pages/users/` - cambio rápido de rol

---

## 📦 PRODUCTOS (`/api/products`)

### GET `/api/products` - Listar Productos
**Sin autenticación requerida**

**Query params:**
- `page=1`
- `pageSize=12`
- `categoryId=5` (filtrar por categoría)
- `search=camiseta` (buscar en nombre y descripción)
- `minPrice=100`
- `maxPrice=500`
- `inStock=true` (solo productos en stock)
- `sortBy=Name` (Name, Price, CreatedAt)
- `sortDescending=false`

**Response 200:**
```json
{
  "items": [
    {
      "id": 10,
      "name": "Camiseta Bosko Básica",
      "description": "Camiseta de algodón 100%",
      "price": 299.99,
      "stock": 50,
      "image": "camiseta-basica.jpg",
      "categoryId": 2,
      "categoryName": "Camisetas",
      "inStock": true,
      "createdAt": "2025-01-10T00:00:00Z"
    }
  ],
  "totalCount": 45,
  "page": 1,
  "pageSize": 12,
  "totalPages": 4
}
```

**Frontend:** `product.service.ts` - método `getProducts(filters)`  
**Usado en:** 
- `collections.component.ts` - catálogo de productos
- `home.component.ts` - productos destacados

---

### GET `/api/products/{id}` - Obtener Producto
**Sin autenticación requerida**

**Response 200:**
```json
{
  "id": 10,
  "name": "Camiseta Bosko Básica",
  "description": "Camiseta de algodón 100%...",
  "price": 299.99,
  "stock": 50,
  "image": "camiseta-basica.jpg",
  "categoryId": 2,
  "categoryName": "Camisetas",
  "inStock": true,
  "createdAt": "2025-01-10T00:00:00Z"
}
```

**Frontend:** `product.service.ts` - método `getProductById(id)`  
**Usado en:** Página de detalle de producto (cuando se implemente)

---

### POST `/api/products` - Crear Producto (ADMIN)
**Headers:** `Authorization: Bearer {token}` (requiere rol Admin)

**Request:**
```json
{
  "name": "Nueva Camiseta",
  "description": "Descripción del producto",
  "price": 399.99,
  "stock": 100,
  "image": "nueva-camiseta.jpg",
  "categoryId": 2
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Producto creado",
  "data": { /* producto creado */ }
}
```

**Frontend:** `product.service.ts` - método `createProduct()`  
**Usado en:** `admin/pages/products/` - agregar productos

---

### PUT `/api/products/{id}` - Actualizar Producto (ADMIN)
**Headers:** `Authorization: Bearer {token}` (requiere rol Admin)

**Request:** Mismo formato que crear producto

**Response 200:**
```json
{
  "success": true,
  "message": "Producto actualizado",
  "data": { /* producto actualizado */ }
}
```

**Frontend:** `product.service.ts` - método `updateProduct()`  
**Usado en:** `admin/pages/products/` - editar productos

---

### DELETE `/api/products/{id}` - Eliminar Producto (ADMIN)
**Headers:** `Authorization: Bearer {token}` (requiere rol Admin)

**Response 200:**
```json
{
  "success": true,
  "message": "Producto eliminado"
}
```

**Frontend:** `product.service.ts` - método `deleteProduct()`  
**Usado en:** `admin/pages/products/` - eliminar productos

---

## 📂 CATEGORÍAS (`/api/categories`)

### GET `/api/categories` - Listar Categorías
**Sin autenticación requerida**

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "Hombre",
    "description": "Ropa para hombre",
    "productCount": 25
  },
  {
    "id": 2,
    "name": "Mujer",
    "description": "Ropa para mujer",
    "productCount": 30
  }
]
```

**Frontend:** `category.service.ts` - método `getCategories()`  
**Usado en:** 
- `sidebar.component.ts` - menú de categorías
- `admin/pages/categories/` - gestión de categorías

---

### POST `/api/categories` - Crear Categoría (ADMIN)
**Headers:** `Authorization: Bearer {token}` (requiere rol Admin)

**Request:**
```json
{
  "name": "Accesorios",
  "description": "Accesorios de moda"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Categoría creada",
  "data": { /* categoría creada */ }
}
```

**Frontend:** `category.service.ts` - método `createCategory()`  
**Usado en:** `admin/pages/categories/` - agregar categorías

---

### PUT `/api/categories/{id}` - Actualizar Categoría (ADMIN)
**Headers:** `Authorization: Bearer {token}` (requiere rol Admin)

**Request:** Mismo formato que crear categoría

**Response 200:**
```json
{
  "success": true,
  "message": "Categoría actualizada",
  "data": { /* categoría actualizada */ }
}
```

**Frontend:** `category.service.ts` - método `updateCategory()`  
**Usado en:** `admin/pages/categories/` - editar categorías

---

### DELETE `/api/categories/{id}` - Eliminar Categoría (ADMIN)
**Headers:** `Authorization: Bearer {token}` (requiere rol Admin)

**Response 200:**
```json
{
  "success": true,
  "message": "Categoría eliminada"
}
```

**Restricciones:**
- No se puede eliminar si tiene productos asociados

**Frontend:** `category.service.ts` - método `deleteCategory()`  
**Usado en:** `admin/pages/categories/` - eliminar categorías

---

## 📊 ESTADÍSTICAS ADMIN (`/api/admin/stats`)

### GET `/api/admin/stats` - Dashboard Stats
**Headers:** `Authorization: Bearer {token}` (requiere rol Admin)

**Response 200:**
```json
{
  "totalSales": 125000.50,
  "totalOrders": 250,
  "totalCustomers": 180,
  "totalProducts": 45,
  "salesGrowth": 15.5,
  "ordersGrowth": 12.3,
  "customersGrowth": 8.7,
  "productsGrowth": 5.2,
  "recentOrders": [
    {
      "orderNumber": "ORD-20251118-42",
      "customerName": "Juan Pérez",
      "totalAmount": 794.97,
      "status": "pending",
      "date": "2025-11-18T10:30:00Z"
    }
  ],
  "topProducts": [
    {
      "productName": "Camiseta Bosko Premium",
      "unitsSold": 150,
      "revenue": 44997.00
    }
  ]
}
```

**Frontend:** Crear servicio `dashboard.service.ts` con método `getStats()`  
**Usado en:** `admin/pages/dashboard/` - panel principal de admin

---

## 🔑 DATOS IMPORTANTES

### Estados de Orden (OrderStatus)
```typescript
'pending'     // Pendiente - recién creada, puede cancelarse
'processing'  // En proceso - preparando envío, puede cancelarse
'delivered'   // Entregada - completada, no se puede cancelar
'cancelled'   // Cancelada - orden cancelada
```

### Métodos de Pago (PaymentMethod)
```typescript
'credit_card'   // Tarjeta de crédito
'debit_card'    // Tarjeta de débito
'paypal'        // PayPal
'bank_transfer' // Transferencia bancaria
'cash'          // Efectivo
```

### Roles de Usuario (UserRole)
```typescript
'Admin'     // Acceso total - CRUD de todo
'Employee'  // Acceso lectura - Ver órdenes y productos
'Customer'  // Cliente - Ver sus propias órdenes
```

---

## 🔒 AUTENTICACIÓN Y SEGURIDAD

### JWT Token
- **Storage:** `localStorage.getItem('bosko-token')`
- **Header:** `Authorization: Bearer {token}`
- **Expiration:** Token expira después de X tiempo (configurar en backend)

### Interceptor HTTP
- **Archivo:** `interceptors/auth.interceptor.ts`
- **Función:** Agrega automáticamente el token JWT a todas las peticiones excepto auth endpoints
- **Endpoints sin token:**
  - `/auth/login`
  - `/auth/register`
  - `/auth/google-login`
  - `/auth/forgot-password`

### Guards de Ruta
1. **auth.guard.ts** - Verifica que el usuario esté autenticado
2. **role.guard.ts** - Verifica que el usuario tenga el rol correcto

---

## 📝 ESTRUCTURA DE RESPUESTAS

### Respuestas Exitosas
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { /* datos */ }
}
```

### Respuestas de Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": {
    "field1": ["Error específico 1"],
    "field2": ["Error específico 2"]
  }
}
```

### Códigos de Estado HTTP
- **200 OK** - Operación exitosa
- **201 Created** - Recurso creado
- **400 Bad Request** - Datos inválidos
- **401 Unauthorized** - No autenticado o token inválido
- **403 Forbidden** - No tiene permisos
- **404 Not Found** - Recurso no encontrado
- **500 Internal Server Error** - Error del servidor

---

## 🛠️ SERVICIOS FRONTEND

### auth.service.ts
- `login(credentials)`
- `register(userData)`
- `forgotPassword(email)`
- `resetPassword(token, newPassword)`
- `logout()`
- `getCurrentUser()`
- `isAuthenticated()`
- `getUsers(filters)` - Admin
- `updateUser(id, data)` - Admin
- `deleteUser(id)` - Admin
- `changeUserRole(id, role)` - Admin

### order.service.ts
- `createOrder(orderData)`
- `getMyOrders(customerId)`
- `cancelOrder(orderId, reason)`
- `getOrders(filters)` - Admin
- `updateOrderStatus(id, status, note, tracking)` - Admin
- `getOrderStats()` - Admin

### product.service.ts
- `getProducts(filters)`
- `getProductById(id)`
- `createProduct(data)` - Admin
- `updateProduct(id, data)` - Admin
- `deleteProduct(id)` - Admin

### category.service.ts
- `getCategories()`
- `createCategory(data)` - Admin
- `updateCategory(id, data)` - Admin
- `deleteCategory(id)` - Admin

### cart.service.ts (Local - sin backend)
- `addToCart(product, quantity)`
- `removeFromCart(productId)`
- `updateQuantity(productId, quantity)`
- `clearCart()`
- `getItems()`
- `getTotal()`

---

## 🚀 PRÓXIMOS ENDPOINTS SUGERIDOS

### Wishlist (Lista de Deseos)
- `GET /api/wishlist` - Obtener wishlist del usuario
- `POST /api/wishlist/{productId}` - Agregar a wishlist
- `DELETE /api/wishlist/{productId}` - Quitar de wishlist

### Reviews (Reseñas)
- `GET /api/products/{productId}/reviews` - Reviews de un producto
- `POST /api/products/{productId}/reviews` - Crear review
- `PUT /api/reviews/{id}` - Actualizar review
- `DELETE /api/reviews/{id}` - Eliminar review

### Addresses (Direcciones de Envío)
- `GET /api/addresses` - Direcciones del usuario
- `POST /api/addresses` - Crear dirección
- `PUT /api/addresses/{id}` - Actualizar dirección
- `DELETE /api/addresses/{id}` - Eliminar dirección

---

## 📞 CONTACTO Y SOPORTE

**Frontend Developer:** Angular 19.2.0 + Tailwind CSS  
**Backend Developer:** ASP.NET Core  
**Repositorio:** Szett0703/Bosko (branch: Szett)

---

**NOTA:** Este documento debe actualizarse cada vez que se agreguen o modifiquen endpoints en el backend.
