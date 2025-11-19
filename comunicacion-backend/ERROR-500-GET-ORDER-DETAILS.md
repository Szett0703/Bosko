# 🔴 ERROR 500: GET Order Details - Debugging Guide

**Fecha:** 19 de Noviembre 2025  
**Prioridad:** 🔥 ALTA (Funcionalidad crítica bloqueada)  
**Endpoint afectado:** `GET /api/admin/orders/{id}`  
**Ejemplo del error:** Order ID 22

---

## 📋 Descripción del Error

Al intentar ver los detalles de un pedido desde el panel de administración, el backend devuelve un **HTTP 500 Internal Server Error**. Esto impide que los administradores puedan:

- ✅ Ver información completa del pedido
- ✅ Ver productos incluidos en el pedido
- ✅ Ver historial de estados
- ✅ Ver información del cliente y dirección de envío

---

## 🔍 Información del Error (Frontend)

### Request:
```http
GET /api/admin/orders/22
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### Response:
```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "type": "...",
  "title": "An error occurred...",
  "message": "...",
  "stackTrace": "...",
  "innerException": "..."
}
```

### Frontend Console Output:
El frontend ahora genera un mensaje detallado en consola con:
- 📍 Endpoint y parámetros usados
- ⚠️ Tipo de error y mensaje del servidor
- 📜 Stack trace completo (si está disponible)
- 🔍 Inner exceptions (si existen)
- ✅ Checklist de debugging
- 📦 Error JSON completo

---

## 🎯 Causas Más Probables

### 1. **Relaciones no cargadas (Entity Framework)**

El endpoint probablemente intenta acceder a propiedades de navegación sin cargarlas explícitamente.

**Síntoma:** `NullReferenceException` al intentar acceder a `order.Customer`, `order.ShippingAddress`, etc.

**Solución:**
```csharp
// ❌ INCORRECTO
var order = await _context.Orders.FindAsync(id);

// ✅ CORRECTO
var order = await _context.Orders
    .Include(o => o.Customer)
    .Include(o => o.ShippingAddress)
    .Include(o => o.OrderItems)
        .ThenInclude(oi => oi.Product)
    .Include(o => o.StatusHistory)
    .FirstOrDefaultAsync(o => o.Id == id);
```

---

### 2. **Foreign Keys NULL cuando no deberían serlo**

Si `CustomerId` o `ShippingAddressId` están NULL en la base de datos, acceder a las propiedades de navegación puede fallar.

**Verificación SQL:**
```sql
SELECT 
    Id,
    OrderNumber,
    CustomerId,
    ShippingAddressId,
    CreatedAt
FROM Orders
WHERE Id = 22;

-- Verificar si existen las entidades relacionadas
SELECT * FROM Users WHERE Id = (SELECT CustomerId FROM Orders WHERE Id = 22);
SELECT * FROM Addresses WHERE Id = (SELECT ShippingAddressId FROM Orders WHERE Id = 22);
```

**Solución:**
```csharp
// Validar que las relaciones existan
if (order.CustomerId == null || order.ShippingAddressId == null)
{
    _logger.LogError($"Order {id} has NULL foreign keys: CustomerId={order.CustomerId}, ShippingAddressId={order.ShippingAddressId}");
    return StatusCode(500, new { message = "Order data integrity issue: missing required relationships" });
}
```

---

### 3. **Error en Mapeo del DTO**

Si AutoMapper intenta mapear una propiedad que es NULL o no existe, puede lanzar una excepción.

**Verificar configuración de AutoMapper:**
```csharp
// OrderMappingProfile.cs
CreateMap<Order, OrderDetailDto>()
    .ForMember(dest => dest.CustomerName, 
        opt => opt.MapFrom(src => src.Customer != null ? src.Customer.FullName : "N/A"))
    .ForMember(dest => dest.CustomerEmail, 
        opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Email : "N/A"))
    .ForMember(dest => dest.ShippingAddress, 
        opt => opt.MapFrom(src => src.ShippingAddress != null ? src.ShippingAddress : null));
```

**O mapeo manual con validación:**
```csharp
var orderDto = new OrderDetailDto
{
    Id = order.Id,
    OrderNumber = order.OrderNumber,
    CustomerName = order.Customer?.FullName ?? "N/A",
    CustomerEmail = order.Customer?.Email ?? "N/A",
    CustomerPhone = order.Customer?.PhoneNumber ?? "N/A",
    ShippingAddress = order.ShippingAddress != null ? new AddressDto
    {
        FullName = order.ShippingAddress.FullName,
        Street = order.ShippingAddress.Street,
        // ... rest of properties
    } : null,
    // ... rest of properties
};
```

---

### 4. **Referencias Circulares en Serialización JSON**

Si no se configuró `ReferenceHandler.IgnoreCycles`, JSON serialization puede fallar con relaciones bidireccionales.

**Verificar en `Program.cs`:**
```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });
```

---

### 5. **OrderItems sin Product relacionado**

Si `OrderItems` tiene `ProductId` pero el producto fue eliminado de la BD, puede causar error.

**Verificación SQL:**
```sql
SELECT 
    oi.Id,
    oi.OrderId,
    oi.ProductId,
    p.Name as ProductName
FROM OrderItems oi
LEFT JOIN Products p ON oi.ProductId = p.Id
WHERE oi.OrderId = 22;
```

**Solución en código:**
```csharp
.Include(o => o.OrderItems)
    .ThenInclude(oi => oi.Product)
// Luego filtrar items sin producto:
.Select(o => new OrderDetailDto
{
    // ... other properties
    Items = o.OrderItems
        .Where(oi => oi.Product != null) // Excluir items sin producto
        .Select(oi => new OrderItemDto
        {
            ProductId = oi.ProductId,
            ProductName = oi.Product.Name,
            // ... rest of properties
        })
        .ToList()
});
```

---

## 🛠️ Implementación Correcta del Endpoint

### Controller: `AdminOrdersController.cs`

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BoskoAPI.Controllers
{
    [ApiController]
    [Route("api/admin/orders")]
    [Authorize(Roles = "Admin,Employee")]
    public class AdminOrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AdminOrdersController> _logger;

        public AdminOrdersController(ApplicationDbContext context, ILogger<AdminOrdersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get detailed information of a specific order
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetails(int id)
        {
            try
            {
                _logger.LogInformation($"Fetching details for order {id}");

                // Load order with all related entities
                var order = await _context.Orders
                    .Include(o => o.Customer)
                    .Include(o => o.ShippingAddress)
                    .Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.Product)
                    .Include(o => o.StatusHistory)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                {
                    _logger.LogWarning($"Order {id} not found");
                    return NotFound(new 
                    { 
                        success = false, 
                        message = $"Pedido con ID {id} no encontrado" 
                    });
                }

                // Validate required relationships
                if (order.Customer == null)
                {
                    _logger.LogError($"Order {id} has NULL Customer (CustomerId: {order.CustomerId})");
                    return StatusCode(500, new 
                    { 
                        success = false, 
                        message = "Error: Pedido sin cliente asociado. Contacte al administrador del sistema." 
                    });
                }

                if (order.ShippingAddress == null)
                {
                    _logger.LogError($"Order {id} has NULL ShippingAddress (ShippingAddressId: {order.ShippingAddressId})");
                    return StatusCode(500, new 
                    { 
                        success = false, 
                        message = "Error: Pedido sin dirección de envío asociada. Contacte al administrador del sistema." 
                    });
                }

                // Build OrderDetailDto manually with safe navigation
                var orderDto = new OrderDetailDto
                {
                    Id = order.Id,
                    OrderNumber = order.OrderNumber,
                    Status = order.Status.ToLower(),
                    CustomerName = order.Customer.FullName,
                    CustomerEmail = order.Customer.Email,
                    CustomerPhone = order.Customer.PhoneNumber ?? "No especificado",
                    
                    ShippingAddress = new AddressDto
                    {
                        FullName = order.ShippingAddress.FullName,
                        Street = order.ShippingAddress.Street,
                        City = order.ShippingAddress.City,
                        State = order.ShippingAddress.State,
                        PostalCode = order.ShippingAddress.PostalCode,
                        Country = order.ShippingAddress.Country,
                        Phone = order.ShippingAddress.Phone
                    },

                    Items = order.OrderItems
                        .Where(oi => oi.Product != null) // Excluir items sin producto
                        .Select(oi => new OrderItemDto
                        {
                            Id = oi.Id,
                            ProductId = oi.ProductId,
                            ProductName = oi.Product.Name,
                            ProductImage = oi.Product.ImageUrl,
                            Quantity = oi.Quantity,
                            UnitPrice = oi.UnitPrice,
                            Subtotal = oi.Subtotal
                        })
                        .ToList(),

                    StatusHistory = order.StatusHistory
                        .OrderByDescending(sh => sh.ChangedAt)
                        .Select(sh => new StatusHistoryDto
                        {
                            Id = sh.Id,
                            PreviousStatus = sh.PreviousStatus?.ToLower(),
                            NewStatus = sh.NewStatus.ToLower(),
                            ChangedAt = sh.ChangedAt,
                            ChangedBy = sh.ChangedBy,
                            Note = sh.Note
                        })
                        .ToList(),

                    Subtotal = order.Subtotal,
                    Tax = order.Tax,
                    ShippingCost = order.ShippingCost,
                    Total = order.Total,
                    PaymentMethod = order.PaymentMethod,
                    Notes = order.Notes,
                    CreatedAt = order.CreatedAt,
                    UpdatedAt = order.UpdatedAt
                };

                _logger.LogInformation($"Successfully retrieved order {id} with {orderDto.Items.Count} items");

                return Ok(new 
                { 
                    success = true, 
                    message = "Detalles del pedido obtenidos correctamente", 
                    data = orderDto 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching order details for order {id}");
                return StatusCode(500, new 
                { 
                    success = false, 
                    message = $"Error interno del servidor: {ex.Message}",
                    type = ex.GetType().Name,
                    stackTrace = ex.StackTrace,
                    innerException = ex.InnerException?.Message
                });
            }
        }
    }
}
```

---

## 📦 DTOs Requeridos

### `OrderDetailDto.cs`
```csharp
public class OrderDetailDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; }
    public string Status { get; set; }
    
    // Customer info
    public string CustomerName { get; set; }
    public string CustomerEmail { get; set; }
    public string CustomerPhone { get; set; }
    
    // Shipping address
    public AddressDto ShippingAddress { get; set; }
    
    // Order items with product details
    public List<OrderItemDto> Items { get; set; }
    
    // Status history
    public List<StatusHistoryDto> StatusHistory { get; set; }
    
    // Financial details
    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal Total { get; set; }
    
    public string PaymentMethod { get; set; }
    public string? Notes { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

### `OrderItemDto.cs`
```csharp
public class OrderItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public string ProductImage { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Subtotal { get; set; }
}
```

### `AddressDto.cs`
```csharp
public class AddressDto
{
    public string FullName { get; set; }
    public string Street { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string PostalCode { get; set; }
    public string Country { get; set; }
    public string Phone { get; set; }
}
```

### `StatusHistoryDto.cs`
```csharp
public class StatusHistoryDto
{
    public int Id { get; set; }
    public string? PreviousStatus { get; set; }
    public string NewStatus { get; set; }
    public DateTime ChangedAt { get; set; }
    public string ChangedBy { get; set; }
    public string? Note { get; set; }
}
```

---

## 🧪 Testing & Validation

### 1. **Database Integrity Check**
```sql
-- Check if order exists
SELECT COUNT(*) FROM Orders WHERE Id = 22;

-- Check customer relationship
SELECT o.Id, o.CustomerId, u.Email 
FROM Orders o
LEFT JOIN Users u ON o.CustomerId = u.Id
WHERE o.Id = 22;

-- Check shipping address relationship
SELECT o.Id, o.ShippingAddressId, a.FullName, a.City
FROM Orders o
LEFT JOIN Addresses a ON o.ShippingAddressId = a.Id
WHERE o.Id = 22;

-- Check order items with products
SELECT oi.Id, oi.OrderId, oi.ProductId, p.Name, oi.Quantity
FROM OrderItems oi
LEFT JOIN Products p ON oi.ProductId = p.Id
WHERE oi.OrderId = 22;

-- Check status history
SELECT * FROM OrderStatusHistory WHERE OrderId = 22 ORDER BY ChangedAt DESC;
```

### 2. **Test with Postman/Thunder Client**
```http
GET https://localhost:5006/api/admin/orders/22
Authorization: Bearer {{admin_jwt_token}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Detalles del pedido obtenidos correctamente",
  "data": {
    "id": 22,
    "orderNumber": "ORD-20251119-0022",
    "status": "pending",
    "customerName": "Juan Pérez",
    "customerEmail": "juan@example.com",
    "customerPhone": "+1234567890",
    "shippingAddress": {
      "fullName": "Juan Pérez",
      "street": "Calle Principal 123",
      "city": "Madrid",
      "state": "Madrid",
      "postalCode": "28001",
      "country": "España",
      "phone": "+1234567890"
    },
    "items": [
      {
        "id": 45,
        "productId": 10,
        "productName": "Camiseta Bosko Blue",
        "productImage": "https://example.com/images/camiseta-blue.jpg",
        "quantity": 2,
        "unitPrice": 29.99,
        "subtotal": 59.98
      }
    ],
    "statusHistory": [
      {
        "id": 100,
        "previousStatus": null,
        "newStatus": "pending",
        "changedAt": "2025-11-19T10:30:00Z",
        "changedBy": "system",
        "note": "Pedido creado"
      }
    ],
    "subtotal": 59.98,
    "tax": 12.60,
    "shippingCost": 5.00,
    "total": 77.58,
    "paymentMethod": "credit_card",
    "notes": null,
    "createdAt": "2025-11-19T10:30:00Z",
    "updatedAt": null
  }
}
```

### 3. **Enable Detailed Logging**

**appsettings.Development.json:**
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore": "Information",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information",
      "BoskoAPI.Controllers": "Debug"
    }
  }
}
```

Esto mostrará las queries SQL generadas por Entity Framework y ayudará a identificar problemas de carga de relaciones.

---

## ✅ Checklist de Verificación

Antes de reportar el bug como resuelto, verificar:

- [ ] **Database integrity:** Order 22 existe y tiene `CustomerId` y `ShippingAddressId` válidos
- [ ] **Entity Framework includes:** Se cargan Customer, ShippingAddress, OrderItems, Product, StatusHistory
- [ ] **NULL safety:** Se validan relaciones antes de acceder a propiedades
- [ ] **DTO mapping:** Todos los campos se mapean correctamente sin excepciones
- [ ] **JSON serialization:** ReferenceHandler.IgnoreCycles configurado
- [ ] **Logging:** Se registran errores detallados en logs del servidor
- [ ] **Response format:** Retorna `{ success, message, data }` en casos de éxito
- [ ] **Error format:** Retorna `{ success: false, message, type, stackTrace }` en errores
- [ ] **Testing:** Endpoint probado con Postman/Thunder Client con órdenes existentes
- [ ] **Status codes:** 200 OK para éxito, 404 Not Found para orden inexistente, 500 para errores internos

---

## 📞 Comunicación

### Frontend Message Format
El frontend ahora genera automáticamente mensajes detallados en consola cuando ocurre un error 500. El mensaje incluye:

1. **Endpoint y parámetros** utilizados
2. **Error type y message** del servidor
3. **Stack trace completo** (si está disponible)
4. **Inner exceptions** (si existen)
5. **Checklist de debugging** con verificaciones específicas
6. **Posibles causas** del error
7. **JSON completo del error** para análisis detallado

### Para enviar al equipo de backend:
1. Reproducir el error en el navegador
2. Abrir DevTools (F12) → Console
3. Buscar el mensaje con título "🔴 ERROR 500 EN FRONTEND"
4. Copiar todo el mensaje formateado
5. Enviar en comunicación con el backend

---

## 🚀 Siguiente Paso

Una vez implementado el endpoint correctamente:

1. ✅ Compilar el backend
2. ✅ Ejecutar el proyecto (`dotnet run`)
3. ✅ Probar el endpoint con Postman/Thunder Client
4. ✅ Verificar que retorne datos completos de la orden
5. ✅ Probar en el frontend (Admin Panel → Pedidos → Click en 👁️ Ver)
6. ✅ Confirmar que el modal se abre con toda la información

---

**Documento creado:** 19 Nov 2025  
**Última actualización:** 19 Nov 2025  
**Frontend mejoras aplicadas:** ✅ Logging detallado con catchError en service + mensaje formateado para backend  
**Estado:** ⏳ Esperando implementación backend
