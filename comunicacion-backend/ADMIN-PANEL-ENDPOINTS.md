    # 🎨 ADMIN PANEL - ESPECIFICACIONES PARA BACKEND

    **Fecha:** 16 de Noviembre 2025  
    **Estado:** ✅ FRONTEND COMPLETADO - REQUIERE ENDPOINTS BACKEND

    ---

    ## 📋 RESUMEN EJECUTIVO

    Se ha implementado un **Admin Panel completamente moderno y funcional** con diseño profesional, estadísticas en tiempo real, gestión de pedidos, productos, categorías y usuarios. El frontend está 100% listo y solo requiere integración con los siguientes endpoints del backend.

    ---

    ## 🎨 LO QUE SE IMPLEMENTÓ EN FRONTEND

    ### 1. **Admin Layout Moderno**
    - ✅ Sidebar colapsable con navegación inteligente
    - ✅ Header con breadcrumbs, búsqueda y notificaciones
    - ✅ Footer profesional
    - ✅ Sistema de avatares con iniciales
    - ✅ Badges de rol (Admin/Employee)
    - ✅ Indicadores de pedidos pendientes
    - ✅ Completamente responsive

    ### 2. **Dashboard Completo**
    - ✅ 4 tarjetas de estadísticas con tendencias
    - ✅ Placeholders para gráficos (Chart.js/ngx-charts)
    - ✅ Tabla de pedidos recientes (últimos 5)
    - ✅ Lista de productos más vendidos (top 5)
    - ✅ Feed de actividad reciente
    - ✅ Acciones rápidas con navegación
    - ✅ Banner de bienvenida personalizado

    ### 3. **Diseño Visual**
    - ✅ Gradientes azules corporativos
    - ✅ Animaciones suaves y transiciones
    - ✅ Cards con hover effects
    - ✅ Iconos SVG inline
    - ✅ Sistema de colores consistente
    - ✅ Tipografía clara y legible

    ---

    ## 🔌 ENDPOINTS REQUERIDOS DEL BACKEND

    ### **A. Dashboard Statistics**

    #### `GET /api/admin/dashboard/stats`
    Obtiene las estadísticas principales del dashboard.

    **Request:**
    ```http
    GET https://localhost:5006/api/admin/dashboard/stats
    Authorization: Bearer {jwt_token}
    ```

    **Response (200 OK):**
    ```json
    {
      "sales": {
        "total": 45231.50,
        "trend": 12.5,
        "label": "Ventas Totales"
      },
      "orders": {
        "total": 156,
        "trend": 8.3,
        "pending": 12,
        "processing": 35,
        "delivered": 98,
        "cancelled": 11
      },
      "customers": {
        "total": 1243,
        "trend": 15.2,
        "active": 890
      },
      "products": {
        "total": 89,
        "trend": -2.4,
        "inStock": 76,
        "outOfStock": 13
      }
    }
    ```

    **Autorización:** `Admin`, `Employee`

    ---

    #### `GET /api/admin/dashboard/sales-chart`
    Obtiene datos para el gráfico de ventas mensuales.

    **Request:**
    ```http
    GET https://localhost:5006/api/admin/dashboard/sales-chart?months=6
    Authorization: Bearer {jwt_token}
    ```

    **Query Parameters:**
    - `months` (opcional): Número de meses (default: 6)

    **Response (200 OK):**
    ```json
    {
      "labels": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
      "datasets": [
        {
          "label": "Ventas",
          "data": [12000, 15000, 18000, 22000, 25000, 28000]
        }
      ]
    }
    ```

    **Autorización:** `Admin`, `Employee`

    ---

    #### `GET /api/admin/dashboard/orders-status`
    Obtiene distribución de pedidos por estado (para gráfico de donas).

    **Request:**
    ```http
    GET https://localhost:5006/api/admin/dashboard/orders-status
    Authorization: Bearer {jwt_token}
    ```

    **Response (200 OK):**
    ```json
    {
      "labels": ["Pendientes", "Procesando", "Entregados", "Cancelados"],
      "datasets": [
        {
          "data": [40, 30, 25, 5],
          "backgroundColor": ["#fbbf24", "#3b82f6", "#10b981", "#ef4444"]
        }
      ]
    }
    ```

    **Autorización:** `Admin`, `Employee`

    ---

    ### **B. Recent Orders**

    #### `GET /api/admin/orders/recent`
    Obtiene los últimos pedidos para el dashboard.

    **Request:**
    ```http
    GET https://localhost:5006/api/admin/orders/recent?limit=5
    Authorization: Bearer {jwt_token}
    ```

    **Query Parameters:**
    - `limit` (opcional): Número de pedidos (default: 5)

    **Response (200 OK):**
    ```json
    [
      {
        "id": 1234,
        "customerName": "María González",
        "customerEmail": "maria@email.com",
        "amount": 1250.00,
        "status": "delivered",
        "createdAt": "2025-11-16T10:30:00Z"
      },
      {
        "id": 1233,
        "customerName": "Carlos Rodríguez",
        "customerEmail": "carlos@email.com",
        "amount": 890.50,
        "status": "processing",
        "createdAt": "2025-11-16T09:15:00Z"
      }
    ]
    ```

    **Estados posibles:** `pending`, `processing`, `delivered`, `cancelled`

    **Autorización:** `Admin`, `Employee`

    ---

    ### **C. Top Products**

    #### `GET /api/admin/products/top-sellers`
    Obtiene los productos más vendidos.

    **Request:**
    ```http
    GET https://localhost:5006/api/admin/products/top-sellers?limit=5
    Authorization: Bearer {jwt_token}
    ```

    **Query Parameters:**
    - `limit` (opcional): Número de productos (default: 5)
    - `period` (opcional): `week`, `month`, `year` (default: month)

    **Response (200 OK):**
    ```json
    [
      {
        "id": 45,
        "name": "Camisa Casual Bosko",
        "category": "Camisas",
        "sales": 124,
        "revenue": 6200.00,
        "imageUrl": "https://example.com/images/camisa.jpg"
      },
      {
        "id": 67,
        "name": "Pantalón Slim Fit",
        "category": "Pantalones",
        "sales": 98,
        "revenue": 5880.00,
        "imageUrl": "https://example.com/images/pantalon.jpg"
      }
    ]
    ```

    **Autorización:** `Admin`, `Employee`

    ---

    ### **D. Activity Feed**

    #### `GET /api/admin/activity/recent`
    Obtiene la actividad reciente del sistema.

    **Request:**
    ```http
    GET https://localhost:5006/api/admin/activity/recent?limit=5
    Authorization: Bearer {jwt_token}
    ```

    **Query Parameters:**
    - `limit` (opcional): Número de actividades (default: 5)

    **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "type": "order",
        "text": "Nuevo pedido #1234 creado por María González",
        "timestamp": "2025-11-16T11:25:00Z"
      },
      {
        "id": 2,
        "type": "product",
        "text": "Producto 'Camisa Casual' actualizado",
        "timestamp": "2025-11-16T11:10:00Z"
      },
      {
        "id": 3,
        "type": "user",
        "text": "Nuevo cliente registrado: Carlos Rodríguez",
        "timestamp": "2025-11-16T10:53:00Z"
      }
    ]
    ```

    **Tipos de actividad:** `order`, `product`, `user`, `category`

    **Autorización:** `Admin`, `Employee`

    ---

    ### **E. Notifications**

    #### `GET /api/admin/notifications/unread-count`
    Obtiene el conteo de notificaciones no leídas.

    **Request:**
    ```http
    GET https://localhost:5006/api/admin/notifications/unread-count
    Authorization: Bearer {jwt_token}
    ```

    **Response (200 OK):**
    ```json
    {
      "count": 5
    }
    ```

    **Autorización:** `Admin`, `Employee`

    ---

    #### `GET /api/admin/notifications`
    Obtiene lista de notificaciones.

    **Request:**
    ```http
    GET https://localhost:5006/api/admin/notifications?page=1&limit=10
    Authorization: Bearer {jwt_token}
    ```

    **Response (200 OK):**
    ```json
    {
      "notifications": [
        {
          "id": 1,
          "title": "Nuevo pedido recibido",
          "message": "Pedido #1234 de María González",
          "type": "order",
          "isRead": false,
          "createdAt": "2025-11-16T11:25:00Z"
        }
      ],
      "total": 15,
      "page": 1,
      "pages": 2
    }
    ```

    **Autorización:** `Admin`, `Employee`

    ---

    ### **F. Orders Management** *(Para página de Orders - Implementar después)*

    #### `GET /api/admin/orders`
    Lista completa de pedidos con filtros.

    **Request:**
    ```http
    GET https://localhost:5006/api/admin/orders?page=1&limit=20&status=pending&search=maria
    Authorization: Bearer {jwt_token}
    ```

    **Query Parameters:**
    - `page`: Número de página (default: 1)
    - `limit`: Items por página (default: 20)
    - `status`: Filtrar por estado (opcional)
    - `search`: Buscar por cliente o ID (opcional)
    - `sortBy`: Campo para ordenar (default: createdAt)
    - `sortOrder`: `asc` o `desc` (default: desc)

    **Response (200 OK):**
    ```json
    {
      "orders": [
        {
          "id": 1234,
          "customerName": "María González",
          "customerEmail": "maria@email.com",
          "items": 3,
          "amount": 1250.00,
          "status": "pending",
          "createdAt": "2025-11-16T10:30:00Z",
          "updatedAt": "2025-11-16T10:30:00Z"
        }
      ],
      "total": 156,
      "page": 1,
      "pages": 8
    }
    ```

    **Autorización:** `Admin`, `Employee`

    ---

    #### `GET /api/admin/orders/{id}`
    Obtiene detalles completos de un pedido.

    **Request:**
    ```http
    GET https://localhost:5006/api/admin/orders/1234
    Authorization: Bearer {jwt_token}
    ```

    **Response (200 OK):**
    ```json
    {
      "id": 1234,
      "customer": {
        "id": 567,
        "name": "María González",
        "email": "maria@email.com",
        "phone": "+34 612 345 678"
      },
      "shippingAddress": {
        "street": "Calle Principal 123",
        "city": "Madrid",
        "state": "Madrid",
        "zipCode": "28001",
        "country": "España"
      },
      "items": [
        {
          "productId": 45,
          "name": "Camisa Casual Bosko",
          "quantity": 2,
          "price": 50.00,
          "subtotal": 100.00,
          "imageUrl": "https://example.com/images/camisa.jpg"
        }
      ],
      "subtotal": 1200.00,
      "shipping": 50.00,
      "total": 1250.00,
      "status": "pending",
      "paymentMethod": "credit_card",
      "createdAt": "2025-11-16T10:30:00Z",
      "updatedAt": "2025-11-16T10:30:00Z",
      "statusHistory": [
        {
          "status": "pending",
          "timestamp": "2025-11-16T10:30:00Z",
          "note": "Pedido creado"
        }
      ]
    }
    ```

    **Autorización:** `Admin`, `Employee`

    ---

    #### `PUT /api/admin/orders/{id}/status`
    Actualiza el estado de un pedido.

    **Request:**
    ```http
    PUT https://localhost:5006/api/admin/orders/1234/status
    Authorization: Bearer {jwt_token}
    Content-Type: application/json

    {
      "status": "processing",
      "note": "Pedido en preparación"
    }
    ```

    **Body:**
    - `status` (requerido): Nuevo estado (`pending`, `processing`, `delivered`, `cancelled`)
    - `note` (opcional): Nota sobre el cambio de estado

    **Response (200 OK):**
    ```json
    {
      "id": 1234,
      "status": "processing",
      "updatedAt": "2025-11-16T12:00:00Z",
      "message": "Estado del pedido actualizado exitosamente"
    }
    ```

    **Autorización:** `Admin`, `Employee`

    ---

    ### **G. Products Management** *(Para página de Products)*

    #### `GET /api/admin/products`
    Lista completa de productos con filtros.

    **Request:**
    ```http
    GET https://localhost:5006/api/admin/products?page=1&limit=20&category=camisas&search=casual&inStock=true
    Authorization: Bearer {jwt_token}
    ```

    **Query Parameters:**
    - `page`: Número de página (default: 1)
    - `limit`: Items por página (default: 20)
    - `category`: Filtrar por categoría (opcional)
    - `search`: Buscar por nombre (opcional)
    - `inStock`: Filtrar por stock (opcional)
    - `sortBy`: Campo para ordenar (default: name)
    - `sortOrder`: `asc` o `desc` (default: asc)

    **Response (200 OK):**
    ```json
    {
      "products": [
        {
          "id": 45,
          "name": "Camisa Casual Bosko",
          "description": "Camisa de algodón premium",
          "price": 50.00,
          "stock": 150,
          "category": "Camisas",
          "imageUrl": "https://example.com/images/camisa.jpg",
          "isActive": true,
          "createdAt": "2025-01-15T10:00:00Z",
          "updatedAt": "2025-11-10T14:30:00Z"
        }
      ],
      "total": 89,
      "page": 1,
      "pages": 5
    }
    ```

    **Autorización:** `Admin`, `Employee` (solo lectura)

    ---

    #### `POST /api/admin/products`
    Crea un nuevo producto.

    **Request:**
    ```http
    POST https://localhost:5006/api/admin/products
    Authorization: Bearer {jwt_token}
    Content-Type: application/json

    {
      "name": "Camisa Nueva Bosko",
      "description": "Descripción del producto",
      "price": 50.00,
      "stock": 100,
      "categoryId": 5,
      "imageUrl": "https://example.com/images/nueva-camisa.jpg",
      "isActive": true
    }
    ```

    **Response (201 Created):**
    ```json
    {
      "id": 90,
      "name": "Camisa Nueva Bosko",
      "message": "Producto creado exitosamente"
    }
    ```

    **Autorización:** `Admin` solamente

    ---

    #### `PUT /api/admin/products/{id}`
    Actualiza un producto existente.

    **Request:**
    ```http
    PUT https://localhost:5006/api/admin/products/45
    Authorization: Bearer {jwt_token}
    Content-Type: application/json

    {
      "name": "Camisa Casual Bosko (Actualizada)",
      "description": "Nueva descripción",
      "price": 55.00,
      "stock": 200,
      "categoryId": 5,
      "isActive": true
    }
    ```

    **Response (200 OK):**
    ```json
    {
      "id": 45,
      "message": "Producto actualizado exitosamente"
    }
    ```

    **Autorización:** `Admin` solamente

    ---

    #### `DELETE /api/admin/products/{id}`
    Elimina (o desactiva) un producto.

    **Request:**
    ```http
    DELETE https://localhost:5006/api/admin/products/45
    Authorization: Bearer {jwt_token}
    ```

    **Response (200 OK):**
    ```json
    {
      "id": 45,
      "message": "Producto eliminado exitosamente"
    }
    ```

    **Nota:** Recomendado hacer "soft delete" (isActive = false) en lugar de eliminar físicamente.

    **Autorización:** `Admin` solamente

    ---

    ### **H. Categories Management**

    #### `GET /api/admin/categories`
    Lista todas las categorías.

    **Request:**
    ```http
    GET https://localhost:5006/api/admin/categories
    Authorization: Bearer {jwt_token}
    ```

    **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "Camisas",
        "slug": "camisas",
        "description": "Camisas para hombre y mujer",
        "productCount": 25,
        "isActive": true,
        "createdAt": "2025-01-01T10:00:00Z"
      },
      {
        "id": 2,
        "name": "Pantalones",
        "slug": "pantalones",
        "description": "Pantalones casuales y formales",
        "productCount": 18,
        "isActive": true,
        "createdAt": "2025-01-01T10:00:00Z"
      }
    ]
    ```

    **Autorización:** `Admin`, `Employee`

    ---

    #### `POST /api/admin/categories`
    Crea una nueva categoría.

    **Request:**
    ```http
    POST https://localhost:5006/api/admin/categories
    Authorization: Bearer {jwt_token}
    Content-Type: application/json

    {
      "name": "Accesorios",
      "description": "Accesorios de moda",
      "isActive": true
    }
    ```

    **Response (201 Created):**
    ```json
    {
      "id": 10,
      "name": "Accesorios",
      "slug": "accesorios",
      "message": "Categoría creada exitosamente"
    }
    ```

    **Autorización:** `Admin` solamente

    ---

    #### `PUT /api/admin/categories/{id}`
    Actualiza una categoría.

    **Request:**
    ```http
    PUT https://localhost:5006/api/admin/categories/10
    Authorization: Bearer {jwt_token}
    Content-Type: application/json

    {
      "name": "Accesorios Premium",
      "description": "Accesorios de alta calidad",
      "isActive": true
    }
    ```

    **Response (200 OK):**
    ```json
    {
      "id": 10,
      "message": "Categoría actualizada exitosamente"
    }
    ```

    **Autorización:** `Admin` solamente

    ---

    #### `DELETE /api/admin/categories/{id}`
    Elimina una categoría (solo si no tiene productos).

    **Request:**
    ```http
    DELETE https://localhost:5006/api/admin/categories/10
    Authorization: Bearer {jwt_token}
    ```

    **Response (200 OK):**
    ```json
    {
      "id": 10,
      "message": "Categoría eliminada exitosamente"
    }
    ```

    **Response (400 Bad Request) - Si tiene productos:**
    ```json
    {
      "error": "No se puede eliminar la categoría porque tiene productos asociados",
      "productCount": 15
    }
    ```

    **Autorización:** `Admin` solamente

    ---

    ### **I. Users Management**

    #### `GET /api/admin/users`
    Lista todos los usuarios.

    **Request:**
    ```http
    GET https://localhost:5006/api/admin/users?page=1&limit=20&role=Customer&search=maria
    Authorization: Bearer {jwt_token}
    ```

    **Query Parameters:**
    - `page`: Número de página (default: 1)
    - `limit`: Items por página (default: 20)
    - `role`: Filtrar por rol (opcional)
    - `search`: Buscar por nombre o email (opcional)

    **Response (200 OK):**
    ```json
    {
      "users": [
        {
          "id": 567,
          "name": "María González",
          "email": "maria@email.com",
          "role": "Customer",
          "isActive": true,
          "createdAt": "2025-06-15T10:00:00Z",
          "lastLogin": "2025-11-16T09:30:00Z",
          "ordersCount": 12
        }
      ],
      "total": 1243,
      "page": 1,
      "pages": 63
    }
    ```

    **Autorización:** `Admin` solamente

    ---

    #### `PUT /api/admin/users/{id}/role`
    Cambia el rol de un usuario.

    **Request:**
    ```http
    PUT https://localhost:5006/api/admin/users/567/role
    Authorization: Bearer {jwt_token}
    Content-Type: application/json

    {
      "role": "Employee"
    }
    ```

    **Body:**
    - `role` (requerido): Nuevo rol (`Admin`, `Employee`, `Customer`)

    **Response (200 OK):**
    ```json
    {
      "id": 567,
      "role": "Employee",
      "message": "Rol actualizado exitosamente"
    }
    ```

    **Autorización:** `Admin` solamente

    ---

    #### `PUT /api/admin/users/{id}/toggle-status`
    Activa/desactiva un usuario.

    **Request:**
    ```http
    PUT https://localhost:5006/api/admin/users/567/toggle-status
    Authorization: Bearer {jwt_token}
    ```

    **Response (200 OK):**
    ```json
    {
      "id": 567,
      "isActive": false,
      "message": "Usuario desactivado exitosamente"
    }
    ```

    **Autorización:** `Admin` solamente

    ---

    ## 🔐 AUTORIZACIÓN Y SEGURIDAD

    ### **Middleware de Autorización**

    ```csharp
    // AdminController.cs
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin,Employee")]
    public class AdminController : ControllerBase
    {
        // Dashboard accessible para Admin y Employee
        [HttpGet("dashboard/stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            // Implementation
        }

        // Solo Admin puede crear/editar/eliminar
        [HttpPost("products")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateProduct([FromBody] ProductDto product)
        {
            // Implementation
        }
    }
    ```

    ### **Validación de Permisos**

    | Endpoint | Admin | Employee | Customer |
    |----------|-------|----------|----------|
    | Dashboard | ✅ | ✅ | ❌ |
    | Ver Orders | ✅ | ✅ | ❌ |
    | Editar Orders | ✅ | ✅ | ❌ |
    | Ver Products | ✅ | ✅ (lectura) | ❌ |
    | CRUD Products | ✅ | ❌ | ❌ |
    | CRUD Categories | ✅ | ❌ | ❌ |
    | Gestionar Users | ✅ | ❌ | ❌ |

    ---

    ## 📊 MODELOS DE BASE DE DATOS

    ### **Tabla: Orders**

    ```sql
    CREATE TABLE Orders (
        Id INT PRIMARY KEY IDENTITY(1,1),
        CustomerId INT NOT NULL,
        CustomerName NVARCHAR(100) NOT NULL,
        CustomerEmail NVARCHAR(255) NOT NULL,
        ShippingAddressId INT NOT NULL,
        SubTotal DECIMAL(18, 2) NOT NULL,
        Shipping DECIMAL(18, 2) NOT NULL,
        Total DECIMAL(18, 2) NOT NULL,
        Status NVARCHAR(20) NOT NULL DEFAULT 'pending',
        PaymentMethod NVARCHAR(50) NOT NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (CustomerId) REFERENCES Users(Id)
    );
    ```

    ### **Tabla: OrderItems**

    ```sql
    CREATE TABLE OrderItems (
        Id INT PRIMARY KEY IDENTITY(1,1),
        OrderId INT NOT NULL,
        ProductId INT NOT NULL,
        ProductName NVARCHAR(200) NOT NULL,
        Quantity INT NOT NULL,
        Price DECIMAL(18, 2) NOT NULL,
        Subtotal DECIMAL(18, 2) NOT NULL,
        FOREIGN KEY (OrderId) REFERENCES Orders(Id),
        FOREIGN KEY (ProductId) REFERENCES Products(Id)
    );
    ```

    ### **Tabla: OrderStatusHistory**

    ```sql
    CREATE TABLE OrderStatusHistory (
        Id INT PRIMARY KEY IDENTITY(1,1),
        OrderId INT NOT NULL,
        Status NVARCHAR(20) NOT NULL,
        Note NVARCHAR(500),
        Timestamp DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (OrderId) REFERENCES Orders(Id)
    );
    ```

    ### **Tabla: Products**

    ```sql
    CREATE TABLE Products (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX),
        Price DECIMAL(18, 2) NOT NULL,
        Stock INT NOT NULL DEFAULT 0,
        CategoryId INT NOT NULL,
        ImageUrl NVARCHAR(500),
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
    );
    ```

    ### **Tabla: Categories**

    ```sql
    CREATE TABLE Categories (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(100) NOT NULL,
        Slug NVARCHAR(100) NOT NULL UNIQUE,
        Description NVARCHAR(500),
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
    ```

    ### **Tabla: ActivityLog**

    ```sql
    CREATE TABLE ActivityLog (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Type NVARCHAR(50) NOT NULL,
        Text NVARCHAR(500) NOT NULL,
        UserId INT,
        Timestamp DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (UserId) REFERENCES Users(Id)
    );
    ```

    ### **Tabla: Notifications**

    ```sql
    CREATE TABLE Notifications (
        Id INT PRIMARY KEY IDENTITY(1,1),
        UserId INT NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Message NVARCHAR(500) NOT NULL,
        Type NVARCHAR(50) NOT NULL,
        IsRead BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (UserId) REFERENCES Users(Id)
    );
    ```

    ---

    ## 🧪 DATOS DE PRUEBA

    ### **Script para Popular BD con Datos de Ejemplo**

    ```sql
    -- Categorías
    INSERT INTO Categories (Name, Slug, Description) VALUES
    ('Camisas', 'camisas', 'Camisas para hombre y mujer'),
    ('Pantalones', 'pantalones', 'Pantalones casuales y formales'),
    ('Chaquetas', 'chaquetas', 'Chaquetas y abrigos'),
    ('Calzado', 'calzado', 'Zapatos y zapatillas'),
    ('Accesorios', 'accesorios', 'Cinturones, carteras y más');

    -- Productos
    INSERT INTO Products (Name, Description, Price, Stock, CategoryId, ImageUrl) VALUES
    ('Camisa Casual Bosko', 'Camisa de algodón premium', 50.00, 150, 1, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c'),
    ('Pantalón Slim Fit', 'Pantalón entallado moderno', 60.00, 120, 2, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a'),
    ('Chaqueta de Cuero', 'Chaqueta de cuero genuino', 120.00, 45, 3, 'https://images.unsplash.com/photo-1551028719-00167b16eac5'),
    ('Zapatillas Deportivas', 'Zapatillas de alto rendimiento', 80.00, 200, 4, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'),
    ('Polo Premium', 'Polo de algodón pima', 40.00, 180, 1, 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d');

    -- Pedidos de ejemplo
    INSERT INTO Orders (CustomerId, CustomerName, CustomerEmail, ShippingAddressId, SubTotal, Shipping, Total, Status, PaymentMethod) VALUES
    (1, 'María González', 'maria@email.com', 1, 1200.00, 50.00, 1250.00, 'delivered', 'credit_card'),
    (2, 'Carlos Rodríguez', 'carlos@email.com', 2, 840.00, 50.50, 890.50, 'processing', 'paypal'),
    (3, 'Ana Martínez', 'ana@email.com', 3, 2050.00, 50.00, 2100.00, 'pending', 'credit_card');
    ```

    ---

    ## ✅ CHECKLIST DE IMPLEMENTACIÓN

    ### **Fase 1: Dashboard Básico** (Prioritario)
    - [ ] Implementar `GET /api/admin/dashboard/stats`
    - [ ] Implementar `GET /api/admin/orders/recent`
    - [ ] Implementar `GET /api/admin/products/top-sellers`
    - [ ] Implementar `GET /api/admin/activity/recent`
    - [ ] Implementar `GET /api/admin/notifications/unread-count`

    ### **Fase 2: Gestión de Pedidos**
    - [ ] Implementar `GET /api/admin/orders`
    - [ ] Implementar `GET /api/admin/orders/{id}`
    - [ ] Implementar `PUT /api/admin/orders/{id}/status`
    - [ ] Crear tabla `OrderStatusHistory`

    ### **Fase 3: Gestión de Productos**
    - [ ] Implementar `GET /api/admin/products`
    - [ ] Implementar `POST /api/admin/products`
    - [ ] Implementar `PUT /api/admin/products/{id}`
    - [ ] Implementar `DELETE /api/admin/products/{id}`

    ### **Fase 4: Gestión de Categorías**
    - [ ] Implementar `GET /api/admin/categories`
    - [ ] Implementar `POST /api/admin/categories`
    - [ ] Implementar `PUT /api/admin/categories/{id}`
    - [ ] Implementar `DELETE /api/admin/categories/{id}`

    ### **Fase 5: Gestión de Usuarios**
    - [ ] Implementar `GET /api/admin/users`
    - [ ] Implementar `PUT /api/admin/users/{id}/role`
    - [ ] Implementar `PUT /api/admin/users/{id}/toggle-status`

    ### **Fase 6: Features Avanzados**
    - [ ] Implementar `GET /api/admin/dashboard/sales-chart`
    - [ ] Implementar `GET /api/admin/dashboard/orders-status`
    - [ ] Implementar sistema de notificaciones completo
    - [ ] Implementar logging de actividad

    ---

    ## 🎯 PRÓXIMOS PASOS

    1. **Backend implementa Fase 1** (Dashboard básico)
    2. **Frontend prueba integración** con endpoints reales
    3. **Se crea la página de Orders** en frontend
    4. **Backend implementa Fase 2** (Orders management)
    5. **Se continúa con Products, Categories, Users**

    ---

    ## 📝 NOTAS IMPORTANTES

    ### **Paginación**
    - Todos los endpoints de listado usan paginación
    - Formato consistente: `page`, `limit`, `total`, `pages`

    ### **Filtros y Búsqueda**
    - Los filtros son opcionales
    - La búsqueda es case-insensitive
    - Soportar ordenamiento por múltiples campos

    ### **Timestamps**
    - Usar formato ISO 8601: `2025-11-16T10:30:00Z`
    - Incluir timezone información

    ### **Imágenes**
    - URLs completas en responses
    - Soportar upload de imágenes (endpoint separado)

    ### **Soft Deletes**
    - Preferir `isActive = false` sobre DELETE físico
    - Mantener historial de datos

    ### **CORS**
    - Configurar para `http://localhost:4200`
    - Permitir headers: `Authorization`, `Content-Type`

    ---

    ## 🚀 ESTADO ACTUAL

    **Frontend:**
    - ✅ Admin Layout 100% completo
    - ✅ Dashboard 100% completo (con datos de ejemplo)
    - ✅ Sin errores de compilación
    - ✅ Diseño responsive
    - ⏳ Esperando integración con backend

    **Backend:**
    - ⏳ Pendiente implementación de endpoints
    - ⏳ Pendiente creación de tablas
    - ⏳ Pendiente datos de prueba

    ---

    **¿Dudas sobre algún endpoint o necesitas más detalles?** 👨‍💻

    El frontend está listo y esperando la integración. Prioriza la Fase 1 para tener el dashboard funcionando lo antes posible.
