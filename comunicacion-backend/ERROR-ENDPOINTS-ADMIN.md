# 🔴 ERRORES DE ENDPOINTS - MENSAJE PARA EL BACKEND

**Fecha:** 16 de Noviembre 2025  
**Prioridad:** 🔥 CRÍTICA  
**Estado:** Frontend completo, esperando implementación backend

---

## 📊 RESUMEN DE ERRORES

El frontend del Admin Panel está completamente implementado y funcional, pero **todos los endpoints del backend están devolviendo 404 (Not Found)**, lo que indica que no están implementados en el servidor.

---

## 🚨 ENDPOINTS QUE FALLAN (404 Not Found)

### 1. **Products Admin**
```
GET https://localhost:5006/api/admin/products?page=1&pageSize=10&sortBy=CreatedAt&sortDescending=true
Status: 404 (Not Found)
```

**¿Qué espera el frontend?**
- Endpoint: `GET /api/admin/products`
- Query params: `page`, `pageSize`, `search`, `categoryId`, `inStock`, `minPrice`, `maxPrice`, `sortBy`, `sortDescending`
- Response esperado:
```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Producto 1",
        "description": "Descripción",
        "price": 29.99,
        "imageUrl": "/images/producto.jpg",
        "categoryId": 1,
        "categoryName": "Categoría 1",
        "stock": 50,
        "inStock": true,
        "createdAt": "2025-11-16T00:00:00Z"
      }
    ],
    "totalCount": 50,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5,
    "hasPrevious": false,
    "hasNext": true
  }
}
```

**Documentación completa:** Ver `ADMIN-PANEL-ENDPOINTS.md` sección "Products Management"

---

### 2. **Categories Admin**
```
GET https://localhost:5006/api/admin/categories/simple
Status: 404 (Not Found)

GET https://localhost:5006/api/admin/categories
Status: 404 (Not Found)
```

**¿Qué espera el frontend?**
- Endpoint 1: `GET /api/admin/categories/simple` (para dropdowns)
- Endpoint 2: `GET /api/admin/categories` (lista completa con productCount)
- Response esperado:
```json
{
  "success": true,
  "message": "Categorías obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Camisetas",
      "description": "Camisetas de alta calidad",
      "imageUrl": "/images/categoria.jpg",
      "productCount": 25,
      "createdAt": "2025-11-16T00:00:00Z"
    }
  ]
}
```

**Documentación completa:** Ver `ADMIN-PANEL-ENDPOINTS.md` sección "Categories Management"

---

### 3. **Users Admin**
```
GET https://localhost:5006/api/admin/users?page=1&pageSize=20&sortBy=CreatedAt&sortDescending=true
Status: 404 (Not Found)
```

**¿Qué espera el frontend?**
- Endpoint: `GET /api/admin/users`
- Query params: `page`, `pageSize`, `search`, `role`, `isActive`, `sortBy`, `sortDescending`
- Response esperado:
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "role": "Customer",
        "isActive": true,
        "createdAt": "2025-11-16T00:00:00Z",
        "updatedAt": "2025-11-16T00:00:00Z",
        "totalOrders": 5,
        "totalSpent": 250.00
      }
    ],
    "totalCount": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "hasPrevious": false,
    "hasNext": true
  }
}
```

**Documentación completa:** Ver `ADMIN-PANEL-ENDPOINTS.md` sección "Users Management"

---

### 4. **Orders Public** (401 Unauthorized)
```
GET https://localhost:5006/api/orders
Status: 401 (Unauthorized)
```

**Problema:** El frontend intenta cargar las órdenes del usuario en `/profile` pero:
1. Si el usuario no está autenticado, devuelve 401 (correcto)
2. El endpoint existe pero requiere JWT válido

**Solución Backend:**
- ✅ Endpoint ya implementado correctamente
- ⚠️ Asegurarse de que valida el token JWT
- ⚠️ Solo devolver órdenes del usuario autenticado

---

### 5. **Auth Login** (401 Unauthorized)
```
POST https://localhost:5006/api/auth/login
Status: 401 (Unauthorized)
```

**Problema:** Se está llamando el login automáticamente sin credenciales.

**Causa en Frontend:** Posiblemente el componente de login está enviando una petición vacía al cargar.

**Solución Backend:**
- ✅ Endpoint ya implementado correctamente
- ✅ Debe devolver 401 si no hay credenciales o son incorrectas

---

## ✅ CHECKLIST PARA EL BACKEND

### Endpoints Críticos a Implementar (Prioridad Alta)

- [ ] `GET /api/admin/products` - Lista paginada de productos con filtros
- [ ] `GET /api/admin/products/{id}` - Detalle de un producto
- [ ] `POST /api/admin/products` - Crear producto
- [ ] `PUT /api/admin/products/{id}` - Actualizar producto
- [ ] `DELETE /api/admin/products/{id}` - Eliminar producto

- [ ] `GET /api/admin/categories` - Lista de categorías con productCount
- [ ] `GET /api/admin/categories/simple` - Lista simplificada (id, name, productCount)
- [ ] `GET /api/admin/categories/{id}` - Detalle de categoría
- [ ] `POST /api/admin/categories` - Crear categoría
- [ ] `PUT /api/admin/categories/{id}` - Actualizar categoría
- [ ] `DELETE /api/admin/categories/{id}` - Eliminar categoría (validar que no tenga productos)

- [ ] `GET /api/admin/users` - Lista paginada de usuarios con filtros
- [ ] `GET /api/admin/users/{id}` - Detalle de usuario con estadísticas
- [ ] `PUT /api/admin/users/{id}` - Actualizar información de usuario
- [ ] `PATCH /api/admin/users/{id}/role` - Cambiar rol de usuario
- [ ] `PATCH /api/admin/users/{id}/toggle-status` - Activar/Desactivar usuario
- [ ] `DELETE /api/admin/users/{id}` - Eliminar usuario (validar que no sea el último admin)

### Autorización Requerida

Todos los endpoints `/api/admin/*` deben:
- ✅ Requerir JWT válido (header `Authorization: Bearer {token}`)
- ✅ Validar que el usuario tenga rol `Admin` o `Employee`
- ✅ Devolver 401 si no hay token
- ✅ Devolver 403 si el usuario no tiene permisos

### Formato de Respuesta Estándar

**Éxito:**
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { /* contenido */ }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    "Detalle del error 1",
    "Detalle del error 2"
  ]
}
```

**Paginación:**
```json
{
  "success": true,
  "data": {
    "items": [ /* array de items */ ],
    "totalCount": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10,
    "hasPrevious": false,
    "hasNext": true
  }
}
```

---

## 🔍 CÓMO REPRODUCIR LOS ERRORES

1. **Iniciar frontend:** `npm start` en `c:\Users\santi.SZETT\Desktop\Dev\BOSKO\BOSKOFRONT\Bosko`
2. **Abrir navegador:** `http://localhost:4300/`
3. **Navegar a:** `/admin/products` o `/admin/categories` o `/admin/users`
4. **Ver consola del navegador:** Todos los endpoints devuelven 404

---

## 📝 NOTAS ADICIONALES

1. **Frontend está 100% completo:**
   - ✅ Todos los componentes implementados
   - ✅ Todos los servicios creados
   - ✅ Manejo de errores implementado
   - ✅ UI moderna y responsive
   - ✅ Validaciones en formularios

2. **Lo único que falta es el backend:**
   - ❌ No existen los endpoints `/api/admin/*`
   - ❌ Sin endpoints, el frontend no puede funcionar

3. **Documentación completa disponible:**
   - Ver: `comunicacion-backend/ADMIN-PANEL-ENDPOINTS.md`
   - Incluye todos los endpoints con ejemplos de request/response
   - Incluye validaciones y casos de error

---

## 📞 CONTACTO

Si necesitas aclaraciones sobre:
- Formato de las respuestas
- Validaciones específicas
- Casos de uso adicionales

Revisar el archivo `ADMIN-PANEL-ENDPOINTS.md` que tiene toda la especificación detallada con ejemplos.

---

**Estado:** ⏳ Esperando implementación backend  
**Última actualización:** 16 de Noviembre 2025
