# 🎯 Instrucciones para el Equipo de Backend - Proyecto Bosko

## 👥 Identidad del Equipo

### **Frontend Team (Angular)**
- **Tech Stack:** Angular 19.2.0 + Tailwind CSS + TypeScript
- **Responsabilidad:** Interfaz de usuario, experiencia del cliente, consumo de APIs REST
- **Repositorio:** Szett0703/Bosko (branch: Szett)
- **URL Local:** http://localhost:4300
- **Comunicación:** Este directorio `comunicacion-backend/` es el punto de contacto oficial

### **Backend Team (ASP.NET Core)**
- **Tech Stack:** ASP.NET Core 8+ + Entity Framework Core + SQL Server
- **Responsabilidad:** APIs REST, lógica de negocio, base de datos, autenticación JWT
- **URL Local:** https://localhost:5006
- **Base URL API:** `https://localhost:5006/api`
- **Comunicación:** Responder en este directorio con documentación de cambios/endpoints

---

## 🎨 Filosofía de Trabajo

### **Principios de Comunicación**
1. ✅ **Documentación Primero:** Antes de implementar, documenta el endpoint en este directorio
2. ✅ **Contratos Claros:** Request/Response siempre con ejemplos JSON reales
3. ✅ **Versionamiento:** Si cambias un endpoint, documenta la versión anterior
4. ✅ **Errores Descriptivos:** Mensajes de error claros y traducibles al español
5. ✅ **Consistencia:** Misma estructura de respuesta en todos los endpoints

### **Frontend Ya Implementado - Backend Pendiente**
El frontend está 100% funcional con los siguientes módulos esperando conexión:
- ✅ Sistema de autenticación (login, register, reset password)
- ✅ Gestión de órdenes (crear, ver, editar, cancelar)
- ✅ Panel de administración (dashboard, usuarios, productos, categorías, órdenes)
- ✅ Catálogo de productos con filtros
- ✅ Carrito de compras (local, sincronizar con backend pendiente)

**El frontend consume las APIs documentadas en `RESUMEN-APIS-IMPLEMENTADAS.md` y `ORDERS-SYSTEM.md`**

---

## 🏗️ Arquitectura Backend Esperada

### **Estructura de Proyecto Sugerida**
```
BoskoAPI/
├── Controllers/
│   ├── AuthController.cs
│   ├── OrdersController.cs
│   ├── ProductsController.cs
│   ├── CategoriesController.cs
│   ├── UsersController.cs
│   └── AdminController.cs
├── Services/
│   ├── AuthService.cs
│   ├── OrderService.cs
│   ├── ProductService.cs
│   ├── CategoryService.cs
│   └── UserService.cs
├── Models/
│   ├── User.cs
│   ├── Order.cs
│   ├── OrderItem.cs
│   ├── ShippingAddress.cs
│   ├── Product.cs
│   └── Category.cs
├── DTOs/
│   ├── Auth/
│   │   ├── LoginDto.cs
│   │   ├── RegisterDto.cs
│   │   └── AuthResponseDto.cs
│   ├── Orders/
│   │   ├── CreateOrderDto.cs
│   │   ├── OrderResponseDto.cs
│   │   └── CancelOrderDto.cs
│   └── Products/
│       ├── ProductDto.cs
│       └── ProductFilterDto.cs
├── Data/
│   └── ApplicationDbContext.cs
├── Middleware/
│   └── ErrorHandlingMiddleware.cs
└── Program.cs
```

---

## 📋 Estándares de Código

### **1. Estructura de Respuesta API**

**✅ Respuesta Exitosa:**
```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; } = true;
    public string Message { get; set; } = "";
    public T Data { get; set; }
}

// Uso:
return Ok(new ApiResponse<Order>
{
    Success = true,
    Message = "Orden creada exitosamente",
    Data = order
});
```

**❌ Respuesta de Error:**
```csharp
public class ErrorResponse
{
    public bool Success { get; set; } = false;
    public string Message { get; set; }
    public Dictionary<string, string[]> Errors { get; set; }
}

// Uso:
return BadRequest(new ErrorResponse
{
    Success = false,
    Message = "Datos inválidos",
    Errors = new Dictionary<string, string[]>
    {
        { "Email", new[] { "El email ya está registrado" } },
        { "Password", new[] { "La contraseña debe tener al menos 8 caracteres" } }
    }
});
```

### **2. Códigos de Estado HTTP**

| Código | Uso | Ejemplo |
|--------|-----|---------|
| **200 OK** | Operación exitosa | GET, PUT exitoso |
| **201 Created** | Recurso creado | POST crear orden |
| **204 No Content** | Eliminación exitosa | DELETE producto |
| **400 Bad Request** | Datos inválidos | Email incorrecto, campos faltantes |
| **401 Unauthorized** | Token JWT inválido/ausente | Sin autenticación |
| **403 Forbidden** | Usuario sin permisos | Customer intentando acceder a admin |
| **404 Not Found** | Recurso no existe | Producto ID inexistente |
| **409 Conflict** | Conflicto de estado | Email duplicado, stock insuficiente |
| **500 Internal Error** | Error del servidor | Exception no controlada |

### **3. Nomenclatura**

```csharp
// ✅ CORRECTO
public class OrderService
{
    public async Task<Order> GetOrderByIdAsync(int orderId)
    {
        // lógica
    }
}

// ❌ INCORRECTO
public class orderservice
{
    public Order GetOrder(int id)  // No async, nombre genérico
    {
        // lógica
    }
}
```

**Reglas:**
- **Clases:** PascalCase (`OrderService`, `ProductController`)
- **Métodos:** PascalCase + sufijo `Async` si es asíncrono
- **Variables:** camelCase (`userId`, `orderTotal`)
- **Constantes:** UPPER_SNAKE_CASE (`TAX_RATE`, `FREE_SHIPPING_THRESHOLD`)
- **DTOs:** Sufijo `Dto` (`CreateOrderDto`, `LoginDto`)

---

## 🔐 Autenticación JWT

### **Configuración Esperada**
```csharp
// appsettings.json
{
  "Jwt": {
    "Key": "super-secret-key-bosko-2024-min-32-chars",
    "Issuer": "BoskoAPI",
    "Audience": "BoskoFrontend",
    "ExpirationInMinutes": 60
  }
}
```

### **Generación de Token**
```csharp
private string GenerateJwtToken(User user)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Name),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role), // "Admin", "Employee", "Customer"
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(int.Parse(_config["Jwt:ExpirationInMinutes"])),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

### **Validación en Controllers**
```csharp
[Authorize] // Requiere token JWT
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    // Obtener userId del token
    private int GetUserIdFromToken()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userId);
    }

    // Obtener rol del usuario
    private string GetUserRole()
    {
        return User.FindFirst(ClaimTypes.Role)?.Value;
    }

    // Verificar si es admin
    private bool IsAdmin()
    {
        return GetUserRole() == "Admin";
    }
}
```

### **Autorización por Rol**
```csharp
[Authorize(Roles = "Admin")] // Solo admins
public async Task<IActionResult> DeleteUser(int id) { ... }

[Authorize(Roles = "Admin,Employee")] // Admin o Employee
public async Task<IActionResult> GetAllOrders() { ... }

[Authorize] // Cualquier usuario autenticado
public async Task<IActionResult> GetMyOrders() { ... }
```

---

## 📊 Base de Datos

### **Convenciones de Entity Framework**
```csharp
public class Order
{
    public int Id { get; set; } // PK automático
    public int CustomerId { get; set; } // FK a Users
    public string OrderNumber { get; set; }
    public DateTime Date { get; set; }
    public string Status { get; set; } // "pending", "processing", "delivered", "cancelled"
    public decimal Subtotal { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal TotalAmount { get; set; }
    public string PaymentMethod { get; set; } // "credit_card", "debit_card", etc.
    public string? TrackingNumber { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation Properties
    public User Customer { get; set; }
    public ICollection<OrderItem> Items { get; set; }
    public ShippingAddress ShippingAddress { get; set; }
}
```

### **Configuración en DbContext**
```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<ShippingAddress> ShippingAddresses { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Order Configuration
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OrderNumber).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.OrderNumber).IsUnique();
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Subtotal).HasPrecision(18, 2);
            entity.Property(e => e.TaxAmount).HasPrecision(18, 2);
            entity.Property(e => e.ShippingCost).HasPrecision(18, 2);
            entity.Property(e => e.TotalAmount).HasPrecision(18, 2);

            // Relationships
            entity.HasOne(o => o.Customer)
                  .WithMany(u => u.Orders)
                  .HasForeignKey(o => o.CustomerId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(o => o.Items)
                  .WithOne(i => i.Order)
                  .HasForeignKey(i => i.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(o => o.ShippingAddress)
                  .WithOne(a => a.Order)
                  .HasForeignKey<ShippingAddress>(a => a.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
```

---

## 🎯 Reglas de Negocio Críticas

### **1. Estados de Orden (Order Status)**

**Estados Válidos:**
```csharp
public static class OrderStatus
{
    public const string Pending = "pending";
    public const string Processing = "processing";
    public const string Delivered = "delivered";
    public const string Cancelled = "cancelled";
}
```

**Transiciones Permitidas:**
```
pending → processing → delivered
pending → cancelled
processing → cancelled
```

**❌ Transiciones NO Permitidas:**
- `delivered` → cualquier otro estado (orden completada es inmutable)
- `cancelled` → cualquier otro estado (orden cancelada es inmutable)

### **2. Métodos de Pago**
```csharp
public static class PaymentMethod
{
    public const string CreditCard = "credit_card";
    public const string DebitCard = "debit_card";
    public const string PayPal = "paypal";
    public const string BankTransfer = "bank_transfer";
    public const string Cash = "cash";
}
```

### **3. Roles de Usuario**
```csharp
public static class UserRole
{
    public const string Admin = "Admin";      // CRUD completo, acceso total
    public const string Employee = "Employee"; // Read-only en admin panel
    public const string Customer = "Customer"; // Solo sus propios datos
}
```

### **4. Cálculos de Orden**
```csharp
public class OrderCalculator
{
    private const decimal TAX_RATE = 0.16m; // IVA México 16%
    private const decimal FREE_SHIPPING_THRESHOLD = 500m;
    private const decimal SHIPPING_COST = 50m;

    public static decimal CalculateSubtotal(IEnumerable<OrderItem> items)
    {
        return items.Sum(i => i.Quantity * i.UnitPrice);
    }

    public static decimal CalculateTax(decimal subtotal)
    {
        return Math.Round(subtotal * TAX_RATE, 2);
    }

    public static decimal CalculateShippingCost(decimal subtotal)
    {
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    }

    public static decimal CalculateTotal(decimal subtotal, decimal tax, decimal shipping)
    {
        return subtotal + tax + shipping;
    }
}
```

### **5. Generación de Order Number**
```csharp
private async Task<string> GenerateOrderNumberAsync()
{
    var year = DateTime.UtcNow.Year;
    var lastOrder = await _context.Orders
        .Where(o => o.OrderNumber.StartsWith($"ORD-{year}-"))
        .OrderByDescending(o => o.Id)
        .FirstOrDefaultAsync();

    int sequence = 1;
    if (lastOrder != null)
    {
        var parts = lastOrder.OrderNumber.Split('-');
        if (parts.Length == 3 && int.TryParse(parts[2], out int lastSequence))
        {
            sequence = lastSequence + 1;
        }
    }

    return $"ORD-{DateTime.UtcNow:yyyyMMdd}-{sequence}";
    // Ejemplo: ORD-20251118-1, ORD-20251118-2, etc.
}
```

---

## ⚠️ Validaciones Importantes

### **1. Crear Orden**
```csharp
// ✅ Validaciones requeridas:
- Items no puede estar vacío
- Todos los productId deben existir en Products
- Cantidad > 0 para todos los items
- Stock suficiente (si se maneja inventario)
- Dirección completa (todos los campos requeridos)
- PaymentMethod debe ser válido
- CustomerId debe existir en Users
```

### **2. Actualizar Orden**
```csharp
// ✅ Validaciones requeridas:
- Order.Status == "pending" (solo se puede editar si está pendiente)
- User.Id == Order.CustomerId OR User.Role == "Admin"
- ShippingAddress completa si se actualiza
```

### **3. Cancelar Orden**
```csharp
// ✅ Validaciones requeridas:
- Order.Status == "pending" OR "processing"
- User.Id == Order.CustomerId OR User.Role == "Admin"
- Reason no vacío (mínimo 10 caracteres)
- Agregar timestamp de cancelación
```

### **4. Cambiar Estado de Orden (Admin)**
```csharp
// ✅ Validaciones requeridas:
- User.Role == "Admin" (solo admins)
- Transición de estado válida (ver diagrama arriba)
- TrackingNumber requerido si status = "processing" o "delivered"
```

---

## 🚨 Manejo de Errores

### **Middleware de Errores Globales**
```csharp
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access attempt");
            await HandleExceptionAsync(context, ex, StatusCodes.Status403Forbidden);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Resource not found");
            await HandleExceptionAsync(context, ex, StatusCodes.Status404NotFound);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation");
            await HandleExceptionAsync(context, ex, StatusCodes.Status400BadRequest);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex, StatusCodes.Status500InternalServerError);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception ex, int statusCode)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var response = new ErrorResponse
        {
            Success = false,
            Message = statusCode == 500 
                ? "Ocurrió un error interno. Contacta al administrador."
                : ex.Message
        };

        await context.Response.WriteAsJsonAsync(response);
    }
}
```

### **Logging en Controllers**
```csharp
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
    {
        _orderService = orderService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        try
        {
            var userId = GetUserIdFromToken();
            _logger.LogInformation("Usuario {UserId} creando orden", userId);

            var order = await _orderService.CreateOrderAsync(userId, dto);

            _logger.LogInformation("Orden {OrderNumber} creada exitosamente", order.OrderNumber);
            
            return CreatedAtAction(
                nameof(GetOrderById),
                new { id = order.Id },
                new ApiResponse<Order>
                {
                    Success = true,
                    Message = "Orden creada exitosamente",
                    Data = order
                }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear orden");
            throw;
        }
    }
}
```

---

## 📤 Formato de Respuestas

### **Listas Paginadas**
```csharp
public class PagedResult<T>
{
    public List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}

// Uso:
var result = new PagedResult<Order>
{
    Items = orders,
    TotalCount = totalOrders,
    Page = request.Page,
    PageSize = request.PageSize
};

return Ok(new ApiResponse<PagedResult<Order>>
{
    Success = true,
    Message = "Órdenes obtenidas",
    Data = result
});
```

### **Fechas en UTC**
```csharp
// ✅ SIEMPRE usar UTC
order.CreatedAt = DateTime.UtcNow;
order.UpdatedAt = DateTime.UtcNow;

// ✅ En DTOs, serializar como ISO 8601
// "2025-11-18T14:30:00Z"
```

---

## 🧪 Testing Sugerido

### **Casos de Prueba Críticos**

#### **Autenticación**
- [ ] Login con credenciales válidas → 200 + token
- [ ] Login con email incorrecto → 401
- [ ] Login con password incorrecto → 401
- [ ] Register con email duplicado → 409
- [ ] Token JWT expira correctamente

#### **Órdenes**
- [ ] Crear orden con carrito válido → 201
- [ ] Crear orden con carrito vacío → 400
- [ ] Obtener mis órdenes → 200 + solo mis órdenes
- [ ] Obtener orden de otro usuario → 403 (Customer)
- [ ] Editar orden en estado "pending" → 200
- [ ] Editar orden en estado "delivered" → 400
- [ ] Cancelar orden en "pending" → 200
- [ ] Cancelar orden en "delivered" → 400

#### **Admin**
- [ ] Admin puede ver todas las órdenes → 200
- [ ] Employee puede ver todas las órdenes → 200
- [ ] Customer no puede acceder a admin → 403
- [ ] Admin puede cambiar estado de orden → 200
- [ ] Admin puede ver estadísticas → 200

---

## 📦 Ejemplo Completo: POST /api/orders

### **1. DTO de Request**
```csharp
public class CreateOrderDto
{
    [Required]
    public int CustomerId { get; set; }

    [Required]
    [MinLength(1, ErrorMessage = "Debe haber al menos 1 item")]
    public List<OrderItemDto> Items { get; set; }

    [Required]
    public ShippingAddressDto ShippingAddress { get; set; }

    [Required]
    public string PaymentMethod { get; set; }

    public string? Notes { get; set; }
}

public class OrderItemDto
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    public string ProductName { get; set; }

    public string? ProductImage { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal UnitPrice { get; set; }
}
```

### **2. Service Implementation**
```csharp
public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<OrderService> _logger;

    public async Task<Order> CreateOrderAsync(CreateOrderDto dto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Validar productos
            var productIds = dto.Items.Select(i => i.ProductId).ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            if (products.Count != productIds.Count)
            {
                throw new InvalidOperationException("Algunos productos no existen");
            }

            // 2. Calcular totales
            var subtotal = OrderCalculator.CalculateSubtotal(dto.Items);
            var tax = OrderCalculator.CalculateTax(subtotal);
            var shipping = OrderCalculator.CalculateShippingCost(subtotal);
            var total = OrderCalculator.CalculateTotal(subtotal, tax, shipping);

            // 3. Crear orden
            var order = new Order
            {
                CustomerId = dto.CustomerId,
                OrderNumber = await GenerateOrderNumberAsync(),
                Date = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                Subtotal = subtotal,
                TaxAmount = tax,
                ShippingCost = shipping,
                TotalAmount = total,
                PaymentMethod = dto.PaymentMethod,
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // 4. Crear items
            foreach (var itemDto in dto.Items)
            {
                var item = new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = itemDto.ProductId,
                    ProductName = itemDto.ProductName,
                    ProductImage = itemDto.ProductImage,
                    Quantity = itemDto.Quantity,
                    UnitPrice = itemDto.UnitPrice,
                    Subtotal = itemDto.Quantity * itemDto.UnitPrice
                };
                _context.OrderItems.Add(item);
            }

            // 5. Crear dirección
            var address = new ShippingAddress
            {
                OrderId = order.Id,
                FullName = dto.ShippingAddress.FullName,
                Phone = dto.ShippingAddress.Phone,
                Street = dto.ShippingAddress.Street,
                City = dto.ShippingAddress.City,
                State = dto.ShippingAddress.State,
                PostalCode = dto.ShippingAddress.PostalCode,
                Country = dto.ShippingAddress.Country
            };
            _context.ShippingAddresses.Add(address);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            _logger.LogInformation("Orden {OrderNumber} creada exitosamente", order.OrderNumber);
            return order;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
```

### **3. Controller Action**
```csharp
[HttpPost]
[Authorize]
public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
{
    try
    {
        var order = await _orderService.CreateOrderAsync(dto);

        return CreatedAtAction(
            nameof(GetOrderById),
            new { id = order.Id },
            new ApiResponse<Order>
            {
                Success = true,
                Message = "Orden creada exitosamente",
                Data = order
            }
        );
    }
    catch (InvalidOperationException ex)
    {
        return BadRequest(new ErrorResponse
        {
            Success = false,
            Message = ex.Message
        });
    }
}
```

---

## 📞 Protocolo de Comunicación

### **Cuando el Backend Complete un Endpoint:**
1. ✅ Crear/actualizar archivo en `comunicacion-backend/`
2. ✅ Documentar:
   - Endpoint completo (método + ruta)
   - Request body con ejemplo JSON
   - Response con ejemplo JSON
   - Códigos de estado posibles
   - Validaciones implementadas
3. ✅ Notificar al frontend con mensaje:
   ```
   ✅ ENDPOINT COMPLETADO: POST /api/orders
   📄 Documentación: comunicacion-backend/ORDERS-ENDPOINT.md
   🧪 Probado con Postman: ✅
   ```

### **Cuando el Frontend Necesite un Cambio:**
1. ✅ Crear issue en `comunicacion-backend/CAMBIOS-SOLICITADOS.md`
2. ✅ Especificar:
   - Qué endpoint necesita cambio
   - Qué se necesita (nuevo campo, cambio de formato, etc.)
   - Por qué se necesita (caso de uso)
   - Prioridad (Alta/Media/Baja)

### **Cuando Haya un Error 500:**
Frontend enviará mensaje formateado:
```
🔴 MENSAJE PARA EL BACKEND - ERROR 500
═══════════════════════════════════════
🌐 Endpoint: POST /api/orders
📦 Request enviado:
{
  "customerId": 5,
  "items": [...]
}
❌ Error: 500 Internal Server Error
💬 Mensaje: "An error occurred while processing your request"

✅ CHECKLIST PARA DEBUGGING:
   [ ] Verificar logs del servidor
   [ ] Revisar validaciones de datos
   [ ] Verificar transacción de BD
   [ ] Confirmar tipos de datos coinciden
═══════════════════════════════════════
```

---

## 🚀 Prioridades de Implementación

### **Fase 1: Autenticación (CRÍTICO)**
1. POST `/api/auth/login`
2. POST `/api/auth/register`
3. POST `/api/auth/forgot-password`
4. POST `/api/auth/reset-password`

### **Fase 2: Órdenes (ALTO)**
1. POST `/api/orders` - Crear orden
2. GET `/api/orders/customer/{id}` - Mis órdenes
3. POST `/api/orders/{id}/cancel` - Cancelar orden
4. GET `/api/orders` - Admin: todas las órdenes
5. PUT `/api/orders/{id}/status` - Admin: cambiar estado

### **Fase 3: Gestión Admin (MEDIO)**
1. GET `/api/users` - Listar usuarios
2. PUT `/api/users/{id}` - Editar usuario
3. DELETE `/api/users/{id}` - Eliminar usuario
4. GET `/api/admin/stats` - Estadísticas dashboard

### **Fase 4: Catálogo (MEDIO)**
1. GET `/api/products` - Listar productos (con filtros)
2. POST `/api/products` - Crear producto
3. PUT `/api/products/{id}` - Editar producto
4. DELETE `/api/products/{id}` - Eliminar producto
5. GET `/api/categories` - Listar categorías

---

## ✅ Checklist Final

Antes de marcar un endpoint como "completo":
- [ ] Implementado en controller
- [ ] Lógica de negocio en service
- [ ] Validaciones de datos
- [ ] Autorización por rol
- [ ] Manejo de errores
- [ ] Logs informativos
- [ ] Transacciones de BD (si aplica)
- [ ] Probado con Postman/Swagger
- [ ] Documentado en `comunicacion-backend/`
- [ ] Notificado al frontend

---

## 📧 Contacto

**Frontend Lead:** Repositorio Szett0703/Bosko  
**Documentación Frontend:** `.github/copilot-instructions.md`  
**Punto de Comunicación:** `comunicacion-backend/` directory

**¡Trabajemos juntos para hacer Bosko la mejor plataforma de e-commerce! 🚀**
