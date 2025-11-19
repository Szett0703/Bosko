# 🎯 CRUD COMPLETO - ADMIN PANEL (PRODUCTOS Y CATEGORÍAS)

**Fecha:** 18 de Noviembre, 2025  
**Estado Frontend:** ✅ COMPLETADO - Listo para integración  
**Estado Backend:** ⏳ PENDIENTE - Requiere implementación completa

---

## 📋 RESUMEN EJECUTIVO

El panel de administración del frontend está **100% funcional** con interfaces modernas para gestionar:
- ✅ **Categorías:** Crear, Editar, Eliminar, Listar
- ✅ **Productos:** Crear, Editar, Eliminar, Listar, Filtrar, Paginar

**Lo que necesita el backend:**
1. Implementar todos los endpoints de CRUD
2. Agregar validaciones robustas
3. Manejar relaciones entre tablas (Productos ↔ Categorías)
4. Devolver errores claros y estructurados
5. Implementar paginación y filtros para productos

---

## 🔐 AUTENTICACIÓN REQUERIDA

**TODOS los endpoints requieren:**
- **Header:** `Authorization: Bearer {JWT_TOKEN}`
- **Roles permitidos:** `Admin` o `Employee`
- **Respuesta si falla:** `401 Unauthorized` o `403 Forbidden`

---

## 📦 PARTE 1: CATEGORÍAS (Categories)

### **Base URL:** `https://localhost:5006/api/admin/categories`

---

### **1.1 GET - Obtener todas las categorías**

**Endpoint:** `GET /api/admin/categories`

**Headers:**
```http
Authorization: Bearer {token}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Categorías obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Camisetas",
      "description": "Camisetas casuales y formales",
      "image": "https://example.com/images/camisetas.jpg",
      "productCount": 15,
      "isActive": true,
      "createdAt": "2025-11-01T10:00:00Z"
    },
    {
      "id": 2,
      "name": "Pantalones",
      "description": "Pantalones de mezclilla y casuales",
      "image": "https://example.com/images/pantalones.jpg",
      "productCount": 8,
      "isActive": true,
      "createdAt": "2025-11-02T14:30:00Z"
    }
  ]
}
```

**Campos Importantes:**
- `productCount`: Número de productos asociados a la categoría (para validar eliminación)
- `isActive`: Si la categoría está activa (opcional, puede ser siempre `true`)
- `createdAt`: Fecha de creación (se muestra en el frontend)

**Errores Posibles:**
- `401`: Token inválido o expirado
- `403`: Usuario no tiene rol Admin/Employee
- `500`: Error del servidor (logs internos)

---

### **1.2 GET - Obtener categorías simples (para dropdowns)**

**Endpoint:** `GET /api/admin/categories/simple`

**Headers:**
```http
Authorization: Bearer {token}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Categorías simples obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Camisetas"
    },
    {
      "id": 2,
      "name": "Pantalones"
    },
    {
      "id": 3,
      "name": "Accesorios"
    }
  ]
}
```

**Propósito:** Este endpoint es para los dropdowns de selección de categoría. Solo devuelve `id` y `name` para ser eficiente.

---

### **1.3 POST - Crear nueva categoría**

**Endpoint:** `POST /api/admin/categories`

**Headers:**
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Chaquetas",
  "description": "Chaquetas de mezclilla y bomber",
  "image": "https://example.com/images/chaquetas.jpg"
}
```

**Validaciones Requeridas en Backend:**
1. ✅ `name` es obligatorio y único (no case-sensitive)
2. ✅ `name` mínimo 3 caracteres
3. ✅ `description` opcional, máximo 500 caracteres
4. ✅ `image` opcional, debe ser URL válida si se proporciona

**Respuesta Exitosa (201 Created):**
```json
{
  "success": true,
  "message": "Categoría creada exitosamente",
  "data": {
    "id": 4,
    "name": "Chaquetas",
    "description": "Chaquetas de mezclilla y bomber",
    "image": "https://example.com/images/chaquetas.jpg",
    "productCount": 0,
    "isActive": true,
    "createdAt": "2025-11-18T15:45:00Z"
  }
}
```

**Errores Esperados:**
```json
// 400 - Nombre duplicado
{
  "success": false,
  "message": "Ya existe una categoría con el nombre 'Chaquetas'"
}

// 400 - Validación fallida
{
  "success": false,
  "message": "El nombre debe tener al menos 3 caracteres"
}

// 500 - Error del servidor
{
  "success": false,
  "message": "Error al crear la categoría",
  "error": "Detalles técnicos del error"
}
```

---

### **1.4 PUT - Actualizar categoría existente**

**Endpoint:** `PUT /api/admin/categories/{id}`

**Ejemplo:** `PUT /api/admin/categories/3`

**Headers:**
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Chaquetas Premium",
  "description": "Chaquetas de cuero y mezclilla premium",
  "image": "https://example.com/images/chaquetas-premium.jpg"
}
```

**Validaciones Requeridas:**
1. ✅ Verificar que el `id` exista en la base de datos
2. ✅ `name` único (excepto para la misma categoría)
3. ✅ Mismas validaciones que en POST

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Categoría actualizada exitosamente",
  "data": {
    "id": 3,
    "name": "Chaquetas Premium",
    "description": "Chaquetas de cuero y mezclilla premium",
    "image": "https://example.com/images/chaquetas-premium.jpg",
    "productCount": 5,
    "isActive": true,
    "createdAt": "2025-11-10T10:00:00Z"
  }
}
```

**Errores Esperados:**
```json
// 404 - Categoría no encontrada
{
  "success": false,
  "message": "Categoría con ID 3 no encontrada"
}

// 400 - Nombre duplicado
{
  "success": false,
  "message": "Ya existe otra categoría con el nombre 'Chaquetas Premium'"
}
```

---

### **1.5 DELETE - Eliminar categoría**

**Endpoint:** `DELETE /api/admin/categories/{id}`

**Ejemplo:** `DELETE /api/admin/categories/3`

**Headers:**
```http
Authorization: Bearer {token}
```

**⚠️ COMPORTAMIENTO ESPERADO:**

**Opción A - Eliminación en Cascada (Recomendado):**
- Eliminar la categoría
- Actualizar todos los productos asociados: `categoryId = NULL`
- Devolver mensaje indicando que los productos quedaron sin categoría

**Opción B - Prevenir Eliminación:**
- Si `productCount > 0`, devolver error `400` indicando que no se puede eliminar
- Requerir que primero se reasignen o eliminen todos los productos

**Respuesta Exitosa (200) - Opción A:**
```json
{
  "success": true,
  "message": "Categoría eliminada exitosamente. 5 productos actualizados sin categoría."
}
```

**Respuesta Exitosa (200) - Opción B:**
```json
{
  "success": true,
  "message": "Categoría eliminada exitosamente"
}
```

**Errores Esperados:**
```json
// 404 - No encontrada
{
  "success": false,
  "message": "Categoría con ID 3 no encontrada"
}

// 400 - Tiene productos (solo Opción B)
{
  "success": false,
  "message": "No se puede eliminar la categoría porque tiene 5 productos asociados. Reasigna o elimina los productos primero."
}

// 500 - Error del servidor
{
  "success": false,
  "message": "Error al eliminar la categoría",
  "error": "Detalles técnicos del error"
}
```

---

## 🛍️ PARTE 2: PRODUCTOS (Products)

### **Base URL:** `https://localhost:5006/api/admin/products`

---

### **2.1 GET - Obtener productos con paginación y filtros**

**Endpoint:** `GET /api/admin/products`

**Query Parameters (TODOS OPCIONALES):**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `page` | `int` | Número de página (default: 1) | `page=2` |
| `pageSize` | `int` | Items por página (default: 10, max: 100) | `pageSize=20` |
| `search` | `string` | Buscar en nombre/descripción | `search=camiseta` |
| `categoryId` | `int` | Filtrar por categoría | `categoryId=3` |
| `inStock` | `bool` | Solo productos en stock (`stock > 0`) | `inStock=true` |
| `minPrice` | `decimal` | Precio mínimo | `minPrice=50` |
| `maxPrice` | `decimal` | Precio máximo | `maxPrice=200` |
| `sortBy` | `string` | Campo de ordenamiento: `Name`, `Price`, `Stock`, `CreatedAt` | `sortBy=Price` |
| `sortDescending` | `bool` | Orden descendente (default: true) | `sortDescending=false` |

**Ejemplo de URL Completa:**
```
GET /api/admin/products?page=1&pageSize=10&search=camisa&categoryId=1&inStock=true&minPrice=30&maxPrice=100&sortBy=Price&sortDescending=false
```

**Headers:**
```http
Authorization: Bearer {token}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Camiseta Básica Blanca",
        "description": "Camiseta de algodón 100% blanca",
        "price": 45.00,
        "stock": 150,
        "image": "https://example.com/images/camiseta-blanca.jpg",
        "categoryId": 1,
        "categoryName": "Camisetas",
        "createdAt": "2025-11-01T10:00:00Z"
      },
      {
        "id": 2,
        "name": "Camiseta Polo Negra",
        "description": "Polo casual negro con logo bordado",
        "price": 65.00,
        "stock": 80,
        "image": "https://example.com/images/polo-negro.jpg",
        "categoryId": 1,
        "categoryName": "Camisetas",
        "createdAt": "2025-11-02T11:30:00Z"
      }
    ],
    "currentPage": 1,
    "pageSize": 10,
    "totalCount": 25,
    "totalPages": 3
  }
}
```

**Campos Importantes:**
- `categoryName`: Nombre de la categoría (JOIN con tabla Categories)
- `currentPage`, `pageSize`, `totalCount`, `totalPages`: Para paginación en frontend
- `stock`: Para mostrar badge "En Stock" / "Sin Stock"
- `createdAt`: Se muestra formateado en la tabla

**Lógica de Filtros en Backend:**
```csharp
// Pseudocódigo
var query = _context.Products.Include(p => p.Category);

// Filtro de búsqueda (nombre o descripción)
if (!string.IsNullOrEmpty(search)) {
    query = query.Where(p => 
        p.Name.Contains(search) || 
        p.Description.Contains(search)
    );
}

// Filtro por categoría
if (categoryId.HasValue) {
    query = query.Where(p => p.CategoryId == categoryId.Value);
}

// Filtro de stock
if (inStock.HasValue) {
    if (inStock.Value) {
        query = query.Where(p => p.Stock > 0);
    } else {
        query = query.Where(p => p.Stock == 0);
    }
}

// Filtro de precio
if (minPrice.HasValue) {
    query = query.Where(p => p.Price >= minPrice.Value);
}
if (maxPrice.HasValue) {
    query = query.Where(p => p.Price <= maxPrice.Value);
}

// Ordenamiento
query = sortBy switch {
    "Name" => sortDescending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
    "Price" => sortDescending ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
    "Stock" => sortDescending ? query.OrderByDescending(p => p.Stock) : query.OrderBy(p => p.Stock),
    _ => sortDescending ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt)
};

// Paginación
var totalCount = await query.CountAsync();
var items = await query
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .Select(p => new ProductDto {
        Id = p.Id,
        Name = p.Name,
        // ... otros campos
        CategoryName = p.Category != null ? p.Category.Name : "Sin categoría"
    })
    .ToListAsync();

return new PagedResponse<ProductDto> {
    Items = items,
    CurrentPage = page,
    PageSize = pageSize,
    TotalCount = totalCount,
    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
};
```

---

### **2.2 GET - Obtener producto por ID**

**Endpoint:** `GET /api/admin/products/{id}`

**Ejemplo:** `GET /api/admin/products/5`

**Headers:**
```http
Authorization: Bearer {token}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Producto obtenido exitosamente",
  "data": {
    "id": 5,
    "name": "Pantalón Mezclilla Azul",
    "description": "Pantalón de mezclilla ajustado color azul oscuro",
    "price": 120.00,
    "stock": 45,
    "image": "https://example.com/images/pantalon-azul.jpg",
    "categoryId": 2,
    "categoryName": "Pantalones",
    "createdAt": "2025-11-05T14:20:00Z"
  }
}
```

**Errores Esperados:**
```json
// 404 - No encontrado
{
  "success": false,
  "message": "Producto con ID 5 no encontrado"
}
```

---

### **2.3 POST - Crear nuevo producto**

**Endpoint:** `POST /api/admin/products`

**Headers:**
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Sudadera con Capucha Gris",
  "description": "Sudadera de algodón con capucha y bolsillo frontal",
  "price": 95.50,
  "stock": 60,
  "image": "https://example.com/images/sudadera-gris.jpg",
  "categoryId": 3
}
```

**Validaciones Requeridas en Backend:**
1. ✅ `name` es obligatorio y único (no case-sensitive)
2. ✅ `name` mínimo 3 caracteres, máximo 100 caracteres
3. ✅ `description` opcional, máximo 500 caracteres
4. ✅ `price` debe ser > 0 (decimal con 2 decimales)
5. ✅ `stock` debe ser >= 0 (entero)
6. ✅ `categoryId` es obligatorio y debe existir en la tabla Categories
7. ✅ `image` opcional, debe ser URL válida si se proporciona

**Respuesta Exitosa (201 Created):**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": 26,
    "name": "Sudadera con Capucha Gris",
    "description": "Sudadera de algodón con capucha y bolsillo frontal",
    "price": 95.50,
    "stock": 60,
    "image": "https://example.com/images/sudadera-gris.jpg",
    "categoryId": 3,
    "categoryName": "Sudaderas",
    "createdAt": "2025-11-18T16:30:00Z"
  }
}
```

**Errores Esperados:**
```json
// 400 - Nombre duplicado
{
  "success": false,
  "message": "Ya existe un producto con el nombre 'Sudadera con Capucha Gris'"
}

// 400 - Precio inválido
{
  "success": false,
  "message": "El precio debe ser mayor a 0"
}

// 400 - Stock negativo
{
  "success": false,
  "message": "El stock no puede ser negativo"
}

// 400 - Categoría no existe
{
  "success": false,
  "message": "La categoría con ID 3 no existe"
}

// 400 - Categoría no proporcionada
{
  "success": false,
  "message": "Debes seleccionar una categoría"
}

// 500 - Error del servidor
{
  "success": false,
  "message": "Error al crear el producto",
  "error": "Detalles técnicos del error",
  "stackTrace": "Stack trace completo (solo en desarrollo)"
}
```

---

### **2.4 PUT - Actualizar producto existente**

**Endpoint:** `PUT /api/admin/products/{id}`

**Ejemplo:** `PUT /api/admin/products/10`

**Headers:**
```http
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Sudadera con Capucha Premium Gris",
  "description": "Sudadera premium de algodón orgánico con capucha",
  "price": 120.00,
  "stock": 75,
  "image": "https://example.com/images/sudadera-premium-gris.jpg",
  "categoryId": 3
}
```

**Validaciones Requeridas:**
1. ✅ Verificar que el `id` exista en la base de datos
2. ✅ `name` único (excepto para el mismo producto)
3. ✅ Mismas validaciones que en POST
4. ✅ Verificar que `categoryId` exista

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Producto actualizado exitosamente",
  "data": {
    "id": 10,
    "name": "Sudadera con Capucha Premium Gris",
    "description": "Sudadera premium de algodón orgánico con capucha",
    "price": 120.00,
    "stock": 75,
    "image": "https://example.com/images/sudadera-premium-gris.jpg",
    "categoryId": 3,
    "categoryName": "Sudaderas",
    "createdAt": "2025-11-10T12:00:00Z"
  }
}
```

**Errores Esperados:**
```json
// 404 - Producto no encontrado
{
  "success": false,
  "message": "Producto con ID 10 no encontrado"
}

// 400 - Nombre duplicado
{
  "success": false,
  "message": "Ya existe otro producto con el nombre 'Sudadera con Capucha Premium Gris'"
}

// 400 - Categoría no existe
{
  "success": false,
  "message": "La categoría con ID 3 no existe"
}
```

---

### **2.5 DELETE - Eliminar producto**

**Endpoint:** `DELETE /api/admin/products/{id}`

**Ejemplo:** `DELETE /api/admin/products/10`

**Headers:**
```http
Authorization: Bearer {token}
```

**⚠️ COMPORTAMIENTO ESPERADO:**

**Opción A - Permitir Eliminación Siempre:**
- Eliminar el producto de la base de datos
- Si el producto está en `OrderItems`, considerar:
  - **Soft Delete:** Marcar como eliminado pero mantener en DB
  - **Mantener Referencia:** Permitir eliminar pero mantener historial en órdenes

**Opción B - Prevenir Eliminación:**
- Si el producto está en alguna orden, devolver error `400`
- Solo permitir eliminar productos sin órdenes asociadas

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

**Errores Esperados:**
```json
// 404 - No encontrado
{
  "success": false,
  "message": "Producto con ID 10 no encontrado"
}

// 400 - Tiene órdenes asociadas (solo Opción B)
{
  "success": false,
  "message": "No se puede eliminar el producto porque está incluido en 3 órdenes. Considera desactivarlo en lugar de eliminarlo."
}

// 500 - Error del servidor
{
  "success": false,
  "message": "Error al eliminar el producto",
  "error": "Detalles técnicos del error",
  "stackTrace": "Stack trace completo (solo en desarrollo)"
}
```

---

## 🔍 PARTE 3: ESTADÍSTICAS DEL DASHBOARD

**Nota:** Estos endpoints ya están documentados en `ADMIN-PANEL-ENDPOINTS.md`, pero repito los más relevantes aquí.

### **3.1 GET - Estadísticas de categorías**

**Endpoint:** `GET /api/admin/categories`

Asegúrate de que el `productCount` esté calculado correctamente:

```csharp
var categories = await _context.Categories
    .Select(c => new CategoryDto {
        Id = c.Id,
        Name = c.Name,
        Description = c.Description,
        Image = c.Image,
        ProductCount = c.Products.Count(), // JOIN con Products
        IsActive = c.IsActive,
        CreatedAt = c.CreatedAt
    })
    .ToListAsync();
```

---

## 🛠️ PARTE 4: ESTRUCTURA DE DATOS (Models)

### **4.1 Modelo Category (Backend)**

```csharp
public class Category
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    [MaxLength(500)]
    [Url]
    public string? Image { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
```

### **4.2 Modelo Product (Backend)**

```csharp
public class Product
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    [Range(0.01, 999999.99)]
    public decimal Price { get; set; }
    
    [Required]
    [Range(0, int.MaxValue)]
    public int Stock { get; set; }
    
    [MaxLength(500)]
    [Url]
    public string? Image { get; set; }
    
    [Required]
    public int CategoryId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public Category Category { get; set; } = null!;
    
    // Relación con órdenes
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
```

### **4.3 DTOs para Frontend**

**CategoryDto:**
```csharp
public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Image { get; set; }
    public int ProductCount { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

**SimpleCategoryDto:**
```csharp
public class SimpleCategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
```

**ProductDto:**
```csharp
public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string? Image { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
```

**ProductCreateDto:**
```csharp
public class ProductCreateDto
{
    [Required(ErrorMessage = "El nombre es requerido")]
    [MinLength(3, ErrorMessage = "El nombre debe tener al menos 3 caracteres")]
    [MaxLength(100, ErrorMessage = "El nombre no puede exceder 100 caracteres")]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500, ErrorMessage = "La descripción no puede exceder 500 caracteres")]
    public string? Description { get; set; }
    
    [Required(ErrorMessage = "El precio es requerido")]
    [Range(0.01, 999999.99, ErrorMessage = "El precio debe ser mayor a 0")]
    public decimal Price { get; set; }
    
    [Required(ErrorMessage = "El stock es requerido")]
    [Range(0, int.MaxValue, ErrorMessage = "El stock no puede ser negativo")]
    public int Stock { get; set; }
    
    [Url(ErrorMessage = "La URL de la imagen no es válida")]
    [MaxLength(500)]
    public string? Image { get; set; }
    
    [Required(ErrorMessage = "Debes seleccionar una categoría")]
    public int CategoryId { get; set; }
}
```

**PagedResponse:**
```csharp
public class PagedResponse<T>
{
    public List<T> Items { get; set; } = new();
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
}
```

---

## ⚠️ PARTE 5: VALIDACIONES Y REGLAS DE NEGOCIO

### **5.1 Validaciones de Categorías**

| Campo | Validación | Mensaje de Error |
|-------|-----------|------------------|
| `name` | Requerido, mínimo 3 caracteres, único | "El nombre es requerido y debe ser único" |
| `description` | Opcional, máximo 500 caracteres | "La descripción no puede exceder 500 caracteres" |
| `image` | Opcional, debe ser URL válida | "La URL de la imagen no es válida" |

**Eliminación de Categoría:**
- Si tiene productos: Actualizar `categoryId = NULL` en productos (recomendado) O prevenir eliminación
- Mensaje claro al usuario sobre el impacto

### **5.2 Validaciones de Productos**

| Campo | Validación | Mensaje de Error |
|-------|-----------|------------------|
| `name` | Requerido, 3-100 caracteres, único | "El nombre debe tener entre 3 y 100 caracteres y ser único" |
| `description` | Opcional, máximo 500 caracteres | "La descripción no puede exceder 500 caracteres" |
| `price` | Requerido, > 0, decimal(18,2) | "El precio debe ser mayor a 0" |
| `stock` | Requerido, >= 0, entero | "El stock no puede ser negativo" |
| `image` | Opcional, URL válida | "La URL de la imagen no es válida" |
| `categoryId` | Requerido, debe existir | "Debes seleccionar una categoría válida" |

**Eliminación de Producto:**
- Verificar si está en `OrderItems`
- Opción 1: Soft delete (marcar como eliminado)
- Opción 2: Prevenir eliminación si tiene órdenes

---

## 📊 PARTE 6: EJEMPLOS DE RESPUESTAS DE ERROR

### **6.1 Error 401 - No Autenticado**
```json
{
  "success": false,
  "message": "Token inválido o expirado. Por favor inicia sesión nuevamente."
}
```

### **6.2 Error 403 - No Autorizado**
```json
{
  "success": false,
  "message": "No tienes permisos para realizar esta acción. Se requiere rol Admin o Employee."
}
```

### **6.3 Error 400 - Validación Fallida**
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": {
    "Name": ["El nombre debe tener al menos 3 caracteres"],
    "Price": ["El precio debe ser mayor a 0"],
    "CategoryId": ["Debes seleccionar una categoría válida"]
  }
}
```

### **6.4 Error 404 - No Encontrado**
```json
{
  "success": false,
  "message": "Producto con ID 10 no encontrado"
}
```

### **6.5 Error 500 - Error del Servidor**
```json
{
  "success": false,
  "message": "Error interno del servidor al procesar la solicitud",
  "error": "SqlException: Cannot insert duplicate key in object 'dbo.Products'",
  "stackTrace": "   at System.Data.SqlClient.SqlConnection.OnError(...)\n   at ..." // Solo en desarrollo
}
```

**⚡ Importante:** El frontend detecta errores 500 y genera un mensaje detallado en la consola para que el usuario te lo envíe. Incluye:
- Endpoint y método HTTP
- Body de la petición
- Error del servidor
- Stack trace (si está disponible)
- Checklist de qué revisar

---

## 🧪 PARTE 7: TESTING DEL BACKEND

### **7.1 Checklist de Testing para Categorías**

- [ ] **GET /api/admin/categories**
  - [ ] Devuelve lista vacía si no hay categorías
  - [ ] Devuelve todas las categorías con `productCount` correcto
  - [ ] Requiere autenticación (token válido)
  - [ ] Rechaza usuarios sin rol Admin/Employee

- [ ] **GET /api/admin/categories/simple**
  - [ ] Devuelve solo `id` y `name`
  - [ ] Requiere autenticación

- [ ] **POST /api/admin/categories**
  - [ ] Crea categoría con datos válidos
  - [ ] Rechaza nombre duplicado (case-insensitive)
  - [ ] Rechaza nombre vacío o menor a 3 caracteres
  - [ ] Permite `description` e `image` opcionales
  - [ ] Valida que `image` sea URL válida

- [ ] **PUT /api/admin/categories/{id}**
  - [ ] Actualiza categoría existente
  - [ ] Rechaza si ID no existe (404)
  - [ ] Rechaza nombre duplicado de otra categoría
  - [ ] Permite mismo nombre para la misma categoría

- [ ] **DELETE /api/admin/categories/{id}**
  - [ ] Elimina categoría sin productos
  - [ ] Maneja categoría con productos (opción A o B)
  - [ ] Rechaza si ID no existe (404)

### **7.2 Checklist de Testing para Productos**

- [ ] **GET /api/admin/products (sin filtros)**
  - [ ] Devuelve productos con paginación
  - [ ] `totalCount` y `totalPages` correctos
  - [ ] Incluye `categoryName` (JOIN con Categories)
  - [ ] Respeta `pageSize` máximo (100)

- [ ] **GET /api/admin/products (con filtros)**
  - [ ] Búsqueda por `search` funciona en nombre y descripción
  - [ ] Filtro `categoryId` funciona correctamente
  - [ ] Filtro `inStock` = true solo devuelve productos con stock > 0
  - [ ] Filtros `minPrice` y `maxPrice` funcionan correctamente
  - [ ] Ordenamiento por `Name`, `Price`, `Stock`, `CreatedAt` funciona
  - [ ] `sortDescending` = true ordena descendente

- [ ] **GET /api/admin/products/{id}**
  - [ ] Devuelve producto con `categoryName`
  - [ ] Rechaza si ID no existe (404)

- [ ] **POST /api/admin/products**
  - [ ] Crea producto con datos válidos
  - [ ] Rechaza nombre duplicado (case-insensitive)
  - [ ] Rechaza precio <= 0
  - [ ] Rechaza stock < 0
  - [ ] Rechaza si `categoryId` no existe
  - [ ] Rechaza si `categoryId` no se proporciona

- [ ] **PUT /api/admin/products/{id}**
  - [ ] Actualiza producto existente
  - [ ] Rechaza si ID no existe (404)
  - [ ] Rechaza nombre duplicado de otro producto
  - [ ] Permite mismo nombre para el mismo producto
  - [ ] Valida que nueva `categoryId` exista

- [ ] **DELETE /api/admin/products/{id}**
  - [ ] Elimina producto sin órdenes
  - [ ] Maneja producto con órdenes (opción A o B)
  - [ ] Rechaza si ID no existe (404)

---

## 🚀 PARTE 8: IMPLEMENTACIÓN PASO A PASO

### **Paso 1: Configurar Controllers**

**CategoryAdminController.cs:**
```csharp
[ApiController]
[Route("api/admin/categories")]
[Authorize(Roles = "Admin,Employee")]
public class CategoryAdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public CategoryAdminController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    // Implementar todos los endpoints aquí
}
```

**ProductAdminController.cs:**
```csharp
[ApiController]
[Route("api/admin/products")]
[Authorize(Roles = "Admin,Employee")]
public class ProductAdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public ProductAdminController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    // Implementar todos los endpoints aquí
}
```

### **Paso 2: Implementar Servicios (Opcional pero Recomendado)**

Separar la lógica de negocio en servicios:

**ICategoryService.cs:**
```csharp
public interface ICategoryService
{
    Task<ApiResponse<List<CategoryDto>>> GetCategoriesAsync();
    Task<ApiResponse<List<SimpleCategoryDto>>> GetSimpleCategoriesAsync();
    Task<ApiResponse<CategoryDto>> CreateCategoryAsync(CategoryCreateDto dto);
    Task<ApiResponse<CategoryDto>> UpdateCategoryAsync(int id, CategoryCreateDto dto);
    Task<ApiResponse<bool>> DeleteCategoryAsync(int id);
}
```

**IProductService.cs:**
```csharp
public interface IProductService
{
    Task<ApiResponse<PagedResponse<ProductDto>>> GetProductsAsync(ProductFilters filters);
    Task<ApiResponse<ProductDto>> GetProductByIdAsync(int id);
    Task<ApiResponse<ProductDto>> CreateProductAsync(ProductCreateDto dto);
    Task<ApiResponse<ProductDto>> UpdateProductAsync(int id, ProductCreateDto dto);
    Task<ApiResponse<bool>> DeleteProductAsync(int id);
}
```

### **Paso 3: Configurar Base de Datos**

**DbContext:**
```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configurar índice único para nombre de categoría
        modelBuilder.Entity<Category>()
            .HasIndex(c => c.Name)
            .IsUnique();
        
        // Configurar índice único para nombre de producto
        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Name)
            .IsUnique();
        
        // Configurar relación Category -> Products
        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict); // O SetNull según tu elección
    }
}
```

### **Paso 4: Crear Migraciones**

```bash
dotnet ef migrations add AddCategoriesAndProducts
dotnet ef database update
```

### **Paso 5: Seed Data (Opcional)**

```csharp
public static class DbInitializer
{
    public static void Seed(ApplicationDbContext context)
    {
        if (!context.Categories.Any())
        {
            var categories = new[]
            {
                new Category { Name = "Camisetas", Description = "Camisetas casuales y formales", IsActive = true },
                new Category { Name = "Pantalones", Description = "Pantalones de mezclilla y casuales", IsActive = true },
                new Category { Name = "Accesorios", Description = "Gorras, cinturones y más", IsActive = true }
            };
            
            context.Categories.AddRange(categories);
            context.SaveChanges();
        }
        
        if (!context.Products.Any())
        {
            var products = new[]
            {
                new Product { Name = "Camiseta Blanca Básica", Price = 45.00m, Stock = 150, CategoryId = 1 },
                new Product { Name = "Pantalón Mezclilla Azul", Price = 120.00m, Stock = 80, CategoryId = 2 },
                new Product { Name = "Gorra Negra Logo", Price = 35.00m, Stock = 200, CategoryId = 3 }
            };
            
            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
```

---

## 📝 PARTE 9: CHECKLIST FINAL DE IMPLEMENTACIÓN

### **Backend Developer - Tareas Pendientes:**

#### **🔧 Configuración Inicial**
- [ ] Crear modelos `Category` y `Product` en `Models/`
- [ ] Crear DTOs: `CategoryDto`, `SimpleCategoryDto`, `ProductDto`, `ProductCreateDto`, `PagedResponse<T>`
- [ ] Configurar `DbContext` con relaciones y índices únicos
- [ ] Crear y ejecutar migraciones de base de datos
- [ ] (Opcional) Crear seed data para testing

#### **📁 Categorías - Endpoints**
- [ ] `GET /api/admin/categories` - Listar todas con `productCount`
- [ ] `GET /api/admin/categories/simple` - Listar solo id y nombre
- [ ] `POST /api/admin/categories` - Crear con validaciones
- [ ] `PUT /api/admin/categories/{id}` - Actualizar con validaciones
- [ ] `DELETE /api/admin/categories/{id}` - Eliminar con manejo de productos asociados

#### **🛍️ Productos - Endpoints**
- [ ] `GET /api/admin/products` - Listar con paginación y 8 filtros
- [ ] `GET /api/admin/products/{id}` - Obtener por ID con `categoryName`
- [ ] `POST /api/admin/products` - Crear con todas las validaciones
- [ ] `PUT /api/admin/products/{id}` - Actualizar con validaciones
- [ ] `DELETE /api/admin/products/{id}` - Eliminar con manejo de órdenes

#### **✅ Validaciones Críticas**
- [ ] Nombres únicos (case-insensitive) en categorías y productos
- [ ] Validar que `categoryId` exista antes de crear/actualizar producto
- [ ] Precio > 0 y Stock >= 0 en productos
- [ ] Longitud de campos respetada (name 3-100, description max 500)
- [ ] URLs de imágenes válidas

#### **🔐 Seguridad y Autorización**
- [ ] Todos los endpoints requieren `[Authorize(Roles = "Admin,Employee")]`
- [ ] Devolver 401 si token inválido/expirado
- [ ] Devolver 403 si usuario no tiene rol adecuado

#### **📊 Manejo de Errores**
- [ ] Respuestas estructuradas con `{ success, message, data }`
- [ ] Errores 400 con mensajes claros para validaciones
- [ ] Errores 404 para recursos no encontrados
- [ ] Errores 500 con detalles técnicos (solo en desarrollo)
- [ ] Logs detallados en servidor para debugging

#### **🧪 Testing**
- [ ] Probar todos los endpoints con Postman/Swagger
- [ ] Verificar paginación y filtros de productos
- [ ] Probar eliminación de categorías con y sin productos
- [ ] Verificar que `productCount` se calcule correctamente
- [ ] Probar validaciones con datos inválidos

---

## 🎨 PARTE 10: FRONTEND - ESTADO ACTUAL

### **✅ Lo que YA está implementado en el Frontend:**

**Categorías:**
- ✅ Interfaz moderna con stats cards (Total, Activas, Total Productos)
- ✅ Grid de categorías con imágenes y overlay de acciones
- ✅ Modal profesional para crear/editar con validaciones en tiempo real
- ✅ Eliminación con confirmación y mensaje según `productCount`
- ✅ Manejo de errores y loading states
- ✅ Formato de fechas en español
- ✅ Placeholder para imágenes faltantes

**Productos:**
- ✅ Interfaz con stats cards (Total, En Stock, Categorías, Valor Inventario)
- ✅ Tarjeta de filtros avanzados (6 filtros: búsqueda, categoría, stock, ordenamiento, rango de precio)
- ✅ Tabla de productos con imágenes, badges de stock, precio, acciones
- ✅ Paginación completa con "Mostrando X-Y de Z productos"
- ✅ Modal grande para crear/editar con preview de imagen
- ✅ Validaciones en tiempo real (nombre 3-100 chars, precio > 0, stock >= 0)
- ✅ Eliminación con confirmación mostrando stock actual
- ✅ Manejo de errores con mensajes para el backend en consola
- ✅ Loading states y spinners

**Servicios:**
- ✅ `CategoryAdminService` completo con todos los métodos CRUD
- ✅ `ProductAdminService` completo con filtros y paginación
- ✅ Interceptor de autenticación que agrega JWT automáticamente
- ✅ Guard de roles para proteger rutas admin

**Diseño:**
- ✅ Tema Bosko oscuro profesional (#0f172a, #1e293b)
- ✅ Gradientes azul/morado (#3b82f6 → #8b5cf6)
- ✅ Animaciones suaves (fadeIn, slideUp, hover effects)
- ✅ Responsive completo (móvil, tablet, desktop)
- ✅ Pure CSS (no Tailwind)

---

## 📞 PARTE 11: SOPORTE Y PRÓXIMOS PASOS

### **¿Necesitas ayuda con algún endpoint?**

Si tienes dudas sobre cómo implementar algún endpoint específico, puedes:

1. **Revisar ejemplos de código** en este documento
2. **Consultar los DTOs y validaciones** en la Parte 4 y 5
3. **Seguir el checklist** de la Parte 9 paso a paso
4. **Revisar los errores del frontend** en la consola (mensajes formateados para backend)

### **Testing con el Frontend:**

Una vez que implementes los endpoints:

1. **Inicia el backend** en `https://localhost:5006`
2. **Inicia el frontend** con `npm start` (Angular)
3. **Navega al admin panel:** `/admin/categories` y `/admin/products`
4. **Prueba cada operación:**
   - Crear categoría/producto
   - Editar existente
   - Filtrar productos (prueba cada filtro)
   - Cambiar página
   - Eliminar con y sin relaciones

### **Si encuentras errores:**

El frontend genera mensajes detallados en la consola cuando hay errores 500. Busca:
```
=== MENSAJE PARA EL BACKEND ===
🔴 ERROR 500 EN FRONTEND - [...]
```

Estos mensajes incluyen:
- Endpoint y método HTTP
- Body enviado
- Error del servidor
- Checklist de qué revisar

---

## 🎯 RESUMEN FINAL

**Frontend:** ✅ **COMPLETO Y LISTO**
- CRUD completo de categorías y productos
- Filtros, paginación, validaciones
- UI/UX profesional con tema Bosko
- Manejo de errores robusto

**Backend:** ⏳ **PENDIENTE**
- Implementar 10 endpoints (5 categorías + 5 productos)
- Agregar validaciones y manejo de errores
- Configurar relaciones en base de datos
- Testing de todos los endpoints

**Tiempo estimado de implementación:** 4-6 horas para un desarrollador backend con experiencia en ASP.NET Core.

---

**Documento creado:** 18 de Noviembre, 2025  
**Versión:** 1.0  
**Autor:** Frontend Team (Angular)  
**Para:** Backend Team (ASP.NET Core)

---

¡Éxito con la implementación! 🚀
