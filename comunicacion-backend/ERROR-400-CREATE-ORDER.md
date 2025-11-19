# 🔴 ERROR 400 - POST /api/orders

**Fecha:** 19 de Noviembre 2025  
**Severidad:** 🔴 CRÍTICO - Bloquea funcionalidad de checkout  
**Endpoint:** `POST https://localhost:5006/api/orders`

---

## 📋 Resumen del Problema

Al intentar crear un pedido desde el frontend, el backend retorna **400 Bad Request** con error de Entity Framework:

```
An error occurred while saving the entity changes. See the inner exception for details.
```

**Stack Trace:**
```
at Microsoft.EntityFrameworkCore.Update.ReaderM…Back\DBTest-BACK\Services\OrderService.cs:line 65
```

---

## 📨 Request Enviado por Frontend

### **Endpoint**
```
POST https://localhost:5006/api/orders
```

### **Headers**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### **Body**
```json
{
  "customerId": 22,
  "items": [
    {
      "productId": 21,
      "productName": "Tenis Blancos Guess",
      "productImage": "https://m.media-amazon.com/images/I/61-2ap5dmJL._AC_SY575_.jpg",
      "quantity": 2,
      "unitPrice": 10.99
    }
  ],
  "shippingAddress": {
    "fullName": "Camilo",
    "phone": "555-0000",
    "street": "Dirección temporal",
    "city": "Ciudad",
    "state": "Estado",
    "postalCode": "00000",
    "country": "México"
  },
  "paymentMethod": "credit_card",
  "notes": "Pedido desde carrito - actualizar dirección en Mis Pedidos"
}
```

---

## ❌ Response del Backend

### **Status Code:** `400 Bad Request`

### **Response Body:**
```json
{
  "success": false,
  "message": "Error al crear el pedido",
  "error": "An error occurred while saving the entity changes. See the inner exception for details.",
  "stackTrace": "   at Microsoft.EntityFrameworkCore.Update.ReaderM…Back\\DBTest-BACK\\Services\\OrderService.cs:line 65"
}
```

---

## 🔍 Posibles Causas del Error

### **1. Problema con Relaciones de Entity Framework** ⚠️ MÁS PROBABLE

El error `saving the entity changes` típicamente ocurre cuando:

- ❌ **Foreign Key inválida:** `customerId: 22` o `productId: 21` no existen en sus respectivas tablas
- ❌ **Relación de navegación no configurada:** `Order.Customer`, `OrderItem.Product` no están correctamente mapeadas
- ❌ **Restricción de base de datos violada:** Unique constraints, NOT NULL constraints, etc.

**Verificar en `AppDbContext.cs`:**
```csharp
modelBuilder.Entity<Order>()
    .HasOne(o => o.Customer)
    .WithMany(u => u.Orders)
    .HasForeignKey(o => o.CustomerId)
    .OnDelete(DeleteBehavior.Restrict);

modelBuilder.Entity<OrderItem>()
    .HasOne(oi => oi.Order)
    .WithMany(o => o.Items)
    .HasForeignKey(oi => oi.OrderId)
    .OnDelete(DeleteBehavior.Cascade);

modelBuilder.Entity<OrderItem>()
    .HasOne(oi => oi.Product)
    .WithMany()
    .HasForeignKey(oi => oi.ProductId)
    .OnDelete(DeleteBehavior.Restrict);

modelBuilder.Entity<ShippingAddress>()
    .HasOne(sa => sa.Order)
    .WithOne(o => o.ShippingAddressDetails)
    .HasForeignKey<ShippingAddress>(sa => sa.OrderId)
    .OnDelete(DeleteBehavior.Cascade);
```

### **2. CustomerId no existe en Users**

Verificar en SQL Server:
```sql
SELECT * FROM Users WHERE Id = 22;
```

Si no existe, el problema es que el usuario autenticado no está en la BD.

### **3. ProductId no existe en Products**

Verificar en SQL Server:
```sql
SELECT * FROM Products WHERE Id = 21;
```

Si no existe, actualizar los productos de prueba.

### **4. Problemas en OrderService.cs línea 65**

Revisar el código en `Services/OrderService.cs` alrededor de la línea 65:

```csharp
// ❌ POSIBLE ERROR: Intentar agregar entidades relacionadas sin cargarlas
var order = new Order
{
    CustomerId = dto.CustomerId,
    Customer = null, // ⚠️ Debe ser null o cargar desde BD
    // ...
};

// ✅ CORRECTO: Solo establecer IDs, no objetos de navegación
var order = new Order
{
    CustomerId = dto.CustomerId,
    // NO asignar Customer, Product, etc.
    // ...
};

_context.Orders.Add(order);
await _context.SaveChangesAsync(); // ⬅️ Aquí falla (línea 65)
```

### **5. Problemas con OrderItems**

Verificar que al crear `OrderItem` **NO se esté intentando adjuntar el objeto `Product`**:

```csharp
// ❌ INCORRECTO
var orderItem = new OrderItem
{
    ProductId = itemDto.ProductId,
    Product = await _context.Products.FindAsync(itemDto.ProductId), // ❌ NO HACER ESTO
    // ...
};

// ✅ CORRECTO
var orderItem = new OrderItem
{
    ProductId = itemDto.ProductId,
    ProductName = itemDto.ProductName,
    ProductImage = itemDto.ProductImage,
    // NO asignar Product, Order
    // ...
};
```

### **6. Problemas con ShippingAddress**

Verificar que `ShippingAddress` se está creando correctamente:

```csharp
// ✅ CORRECTO
var shippingAddress = new ShippingAddress
{
    FullName = dto.ShippingAddress.FullName,
    Phone = dto.ShippingAddress.Phone,
    Street = dto.ShippingAddress.Street,
    City = dto.ShippingAddress.City,
    State = dto.ShippingAddress.State,
    PostalCode = dto.ShippingAddress.PostalCode,
    Country = dto.ShippingAddress.Country
    // NO asignar OrderId aquí si es relación 1:1
};

order.ShippingAddressDetails = shippingAddress; // Asignar a la orden
```

---

## ✅ Checklist de Debug para Backend

### **Verificaciones en Base de Datos**
- [ ] **Verificar que `customerId: 22` existe:**
  ```sql
  SELECT * FROM Users WHERE Id = 22;
  ```
- [ ] **Verificar que `productId: 21` existe:**
  ```sql
  SELECT * FROM Products WHERE Id = 21;
  ```
- [ ] **Verificar constraints de la tabla `Orders`:**
  ```sql
  SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
  WHERE TABLE_NAME = 'Orders';
  ```

### **Verificaciones en Código**

- [ ] **Revisar `OrderService.cs` línea 65** (donde ocurre `SaveChangesAsync`)
- [ ] **Verificar que NO se están asignando objetos de navegación:**
  ```csharp
  // ❌ NUNCA hacer esto al crear entidades
  order.Customer = new User { ... };
  orderItem.Product = new Product { ... };
  ```
- [ ] **Verificar que solo se asignan IDs:**
  ```csharp
  // ✅ Solo IDs
  order.CustomerId = dto.CustomerId;
  orderItem.ProductId = itemDto.ProductId;
  ```
- [ ] **Revisar configuración de `AppDbContext.cs`** (relaciones, cascades)
- [ ] **Agregar logs detallados en `OrderService.CreateOrderAsync`:**
  ```csharp
  try
  {
      _logger.LogInformation($"Creating order for customerId: {dto.CustomerId}");
      
      // Verificar que customer existe
      var customer = await _context.Users.FindAsync(dto.CustomerId);
      if (customer == null)
          throw new Exception($"Customer {dto.CustomerId} not found");
      
      // Verificar que productos existen
      foreach (var item in dto.Items)
      {
          var product = await _context.Products.FindAsync(item.ProductId);
          if (product == null)
              throw new Exception($"Product {item.ProductId} not found");
      }
      
      // Crear orden...
      await _context.SaveChangesAsync();
  }
  catch (Exception ex)
  {
      _logger.LogError(ex, "Error creating order");
      throw;
  }
  ```

### **Verificaciones de Logging**

- [ ] **Habilitar logs detallados de EF Core en `appsettings.Development.json`:**
  ```json
  {
    "Logging": {
      "LogLevel": {
        "Default": "Information",
        "Microsoft.EntityFrameworkCore": "Information",
        "Microsoft.EntityFrameworkCore.Database.Command": "Information"
      }
    }
  }
  ```
- [ ] **Revisar consola del servidor** para ver la excepción completa con `InnerException`
- [ ] **Buscar el SQL generado** por EF Core en los logs

---

## 🔧 Solución Recomendada

### **Paso 1: Agregar Logs Detallados**

Modificar `OrderService.cs` para agregar logs antes de `SaveChangesAsync`:

```csharp
public async Task<Order> CreateOrderAsync(OrderCreateDto dto)
{
    try
    {
        _logger.LogInformation($"[ORDER] Creating order for customer {dto.CustomerId}");
        
        // 1. Verificar que el cliente existe
        var customer = await _context.Users.FindAsync(dto.CustomerId);
        if (customer == null)
        {
            _logger.LogError($"[ORDER] Customer {dto.CustomerId} not found in database");
            throw new ArgumentException($"Customer with ID {dto.CustomerId} not found");
        }
        _logger.LogInformation($"[ORDER] Customer found: {customer.Name} ({customer.Email})");

        // 2. Verificar que todos los productos existen
        foreach (var itemDto in dto.Items)
        {
            var product = await _context.Products.FindAsync(itemDto.ProductId);
            if (product == null)
            {
                _logger.LogError($"[ORDER] Product {itemDto.ProductId} not found in database");
                throw new ArgumentException($"Product with ID {itemDto.ProductId} not found");
            }
            _logger.LogInformation($"[ORDER] Product found: {product.Name}");
        }

        // 3. Crear la orden
        var order = new Order
        {
            CustomerId = dto.CustomerId,
            CustomerName = customer.Name,
            CustomerEmail = customer.Email,
            OrderNumber = GenerateOrderNumber(),
            Status = "pending",
            Subtotal = 0, // Calcular después
            Tax = 0,
            Shipping = 0,
            Total = 0,
            PaymentMethod = dto.PaymentMethod,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Items = new List<OrderItem>(),
            StatusHistory = new List<OrderStatusHistory>()
        };

        _logger.LogInformation($"[ORDER] Order object created with number: {order.OrderNumber}");

        // 4. Agregar items
        decimal subtotal = 0;
        foreach (var itemDto in dto.Items)
        {
            var itemSubtotal = itemDto.Quantity * itemDto.UnitPrice;
            subtotal += itemSubtotal;

            var orderItem = new OrderItem
            {
                ProductId = itemDto.ProductId,
                ProductName = itemDto.ProductName,
                ProductImage = itemDto.ProductImage,
                Quantity = itemDto.Quantity,
                Price = itemDto.UnitPrice,
                Subtotal = itemSubtotal
            };

            order.Items.Add(orderItem);
        }

        _logger.LogInformation($"[ORDER] Added {order.Items.Count} items, subtotal: {subtotal}");

        // 5. Calcular totales
        order.Subtotal = subtotal;
        order.Tax = subtotal * 0.16m;
        order.Shipping = subtotal >= 500 ? 0 : 100;
        order.Total = order.Subtotal + order.Tax + order.Shipping;

        _logger.LogInformation($"[ORDER] Calculated totals - Subtotal: {order.Subtotal}, Tax: {order.Tax}, Shipping: {order.Shipping}, Total: {order.Total}");

        // 6. Agregar dirección de envío
        var shippingAddress = new ShippingAddress
        {
            FullName = dto.ShippingAddress.FullName,
            Phone = dto.ShippingAddress.Phone,
            Street = dto.ShippingAddress.Street,
            City = dto.ShippingAddress.City,
            State = dto.ShippingAddress.State,
            PostalCode = dto.ShippingAddress.PostalCode,
            Country = dto.ShippingAddress.Country
        };

        order.ShippingAddressDetails = shippingAddress;
        _logger.LogInformation($"[ORDER] Shipping address added: {shippingAddress.City}, {shippingAddress.State}");

        // 7. Agregar historial de estado inicial
        order.StatusHistory.Add(new OrderStatusHistory
        {
            Status = "pending",
            Note = "Pedido creado",
            Timestamp = DateTime.UtcNow
        });

        _logger.LogInformation("[ORDER] Status history added");

        // 8. Guardar en base de datos
        _context.Orders.Add(order);
        
        _logger.LogInformation("[ORDER] Order added to context, calling SaveChanges...");
        await _context.SaveChangesAsync();
        
        _logger.LogInformation($"[ORDER] ✅ Order saved successfully with ID: {order.Id}");

        return order;
    }
    catch (DbUpdateException dbEx)
    {
        _logger.LogError(dbEx, "[ORDER] ❌ Database update error");
        _logger.LogError($"[ORDER] InnerException: {dbEx.InnerException?.Message}");
        throw new Exception($"Database error: {dbEx.InnerException?.Message ?? dbEx.Message}");
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "[ORDER] ❌ Error creating order");
        throw;
    }
}
```

### **Paso 2: Verificar Configuración de DbContext**

Asegurarse de que `AppDbContext.cs` tiene la configuración correcta:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // Configurar Order
    modelBuilder.Entity<Order>(entity =>
    {
        entity.HasKey(o => o.Id);
        
        entity.Property(o => o.OrderNumber)
            .IsRequired()
            .HasMaxLength(50);
        
        entity.HasIndex(o => o.OrderNumber)
            .IsUnique();
        
        entity.Property(o => o.Subtotal)
            .HasColumnType("decimal(18,2)");
        
        entity.Property(o => o.Tax)
            .HasColumnType("decimal(18,2)");
        
        entity.Property(o => o.Shipping)
            .HasColumnType("decimal(18,2)");
        
        entity.Property(o => o.Total)
            .HasColumnType("decimal(18,2)");
        
        // Relación con User (Customer)
        entity.HasOne(o => o.Customer)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);
        
        // Relación con OrderItems (1:N)
        entity.HasMany(o => o.Items)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Relación con ShippingAddress (1:1)
        entity.HasOne(o => o.ShippingAddressDetails)
            .WithOne(sa => sa.Order)
            .HasForeignKey<ShippingAddress>(sa => sa.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Relación con OrderStatusHistory (1:N)
        entity.HasMany(o => o.StatusHistory)
            .WithOne(osh => osh.Order)
            .HasForeignKey(osh => osh.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    });

    // Configurar OrderItem
    modelBuilder.Entity<OrderItem>(entity =>
    {
        entity.HasKey(oi => oi.Id);
        
        entity.Property(oi => oi.Price)
            .HasColumnType("decimal(18,2)");
        
        entity.Property(oi => oi.Subtotal)
            .HasColumnType("decimal(18,2)");
        
        // Relación con Product
        entity.HasOne(oi => oi.Product)
            .WithMany()
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    });

    // Configurar ShippingAddress
    modelBuilder.Entity<ShippingAddress>(entity =>
    {
        entity.HasKey(sa => sa.Id);
        
        entity.Property(sa => sa.FullName)
            .IsRequired()
            .HasMaxLength(200);
        
        entity.Property(sa => sa.Phone)
            .IsRequired()
            .HasMaxLength(20);
    });

    // Configurar OrderStatusHistory
    modelBuilder.Entity<OrderStatusHistory>(entity =>
    {
        entity.HasKey(osh => osh.Id);
        
        entity.Property(osh => osh.Status)
            .IsRequired()
            .HasMaxLength(50);
    });
}
```

### **Paso 3: Ejecutar y Revisar Logs**

1. Detener el servidor backend
2. Iniciar con logs habilitados: `dotnet run`
3. Intentar crear orden desde frontend
4. Revisar **todos los logs** en la consola del servidor
5. Buscar específicamente:
   - `[ORDER]` logs personalizados
   - `Executing DbCommand` de EF Core
   - Mensajes de `InnerException`

---

## 📞 Información Adicional del Frontend

### **Usuario Autenticado**
- **ID:** 22
- **Nombre:** Camilo

### **Producto en Carrito**
- **ID:** 21
- **Nombre:** Tenis Blancos Guess
- **Precio:** $10.99
- **Cantidad:** 2

### **Datos de Envío Temporales**
```json
{
  "fullName": "Camilo",
  "phone": "555-0000",
  "street": "Dirección temporal",
  "city": "Ciudad",
  "state": "Estado",
  "postalCode": "00000",
  "country": "México"
}
```

---

## 🎯 Próximos Pasos

1. ✅ Implementar logs detallados en `OrderService.cs`
2. ✅ Verificar que `customerId: 22` y `productId: 21` existen en BD
3. ✅ Revisar configuración de relaciones en `AppDbContext.cs`
4. ✅ Ejecutar backend con logs habilitados
5. ✅ Intentar crear orden desde frontend
6. ✅ Compartir logs completos del servidor con frontend

---

**Prioridad:** 🔴 ALTA  
**Bloqueador:** SÍ - El checkout no funciona  
**Requiere:** Revisión inmediata del backend

---

**Frontend Team**  
19 de Noviembre 2025
