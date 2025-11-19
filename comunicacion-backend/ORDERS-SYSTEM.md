# 📦 Sistema de Gestión de Pedidos - Documentación Backend

## 🎯 Objetivo
Implementar un sistema completo para que los clientes puedan:
- Crear pedidos desde el carrito de compras
- Ver todos sus pedidos históricos
- Ver detalles completos de cada pedido
- Editar dirección de envío y notas (solo si el pedido está en estado "Pendiente")
- Cancelar pedidos (si están en estado "Pendiente" o "Procesando")

---

## 📊 Modelo de Datos

### **Tabla: Orders**
```sql
CREATE TABLE Orders (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
    OrderNumber NVARCHAR(50) NOT NULL UNIQUE,  -- ej: "ORD-2024-00001"
    Date DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pendiente',  -- Pendiente, Procesando, Enviado, Entregado, Cancelado
    Subtotal DECIMAL(18,2) NOT NULL,
    Tax DECIMAL(18,2) NOT NULL,
    ShippingCost DECIMAL(18,2) NOT NULL DEFAULT 0,
    Total DECIMAL(18,2) NOT NULL,
    PaymentMethod NVARCHAR(50) NOT NULL,  -- CreditCard, DebitCard, PayPal, BankTransfer, Cash
    TrackingNumber NVARCHAR(100) NULL,
    Notes NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
```

### **Tabla: OrderItems**
```sql
CREATE TABLE OrderItems (
    Id INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT NOT NULL FOREIGN KEY REFERENCES Orders(Id) ON DELETE CASCADE,
    ProductId INT NOT NULL FOREIGN KEY REFERENCES Products(Id),
    ProductName NVARCHAR(200) NOT NULL,
    ProductImage NVARCHAR(500) NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    Subtotal DECIMAL(18,2) NOT NULL  -- Quantity * UnitPrice
);
```

### **Tabla: ShippingAddresses**
```sql
CREATE TABLE ShippingAddresses (
    Id INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT NOT NULL FOREIGN KEY REFERENCES Orders(Id) ON DELETE CASCADE,
    FullName NVARCHAR(200) NOT NULL,
    Phone NVARCHAR(20) NOT NULL,
    Street NVARCHAR(300) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    State NVARCHAR(100) NOT NULL,
    PostalCode NVARCHAR(20) NOT NULL,
    Country NVARCHAR(100) NOT NULL DEFAULT 'México'
);
```

---

## 🔌 Endpoints Requeridos

### **1. Crear Pedido (POST /api/orders)**

**Autenticación:** ✅ Requerida (Customer, Employee, Admin)

**Request Body:**
```json
{
  "items": [
    {
      "productId": 5,
      "quantity": 2,
      "unitPrice": 599.99
    },
    {
      "productId": 12,
      "quantity": 1,
      "unitPrice": 899.00
    }
  ],
  "shippingAddress": {
    "fullName": "Juan Pérez García",
    "phone": "+52 55 1234 5678",
    "street": "Av. Insurgentes Sur 1234, Col. Del Valle",
    "city": "Ciudad de México",
    "state": "CDMX",
    "postalCode": "03100",
    "country": "México"
  },
  "paymentMethod": "CreditCard",
  "notes": "Por favor tocar el timbre 3 veces. Entregar entre 9am-5pm."
}
```

**Lógica Backend:**
1. Obtener `userId` del token JWT
2. Generar `orderNumber` único (formato: `ORD-YYYY-NNNNN`)
   - Ejemplo: `ORD-2024-00001`
   - Usar número secuencial por año
3. Calcular:
   - `subtotal` = suma de (quantity × unitPrice) de todos los items
   - `tax` = subtotal × 0.16 (IVA México 16%)
   - `shippingCost` = 0 si subtotal > $500, sino $50
   - `total` = subtotal + tax + shippingCost
4. Validar que todos los `productId` existan y tengan stock suficiente
5. Crear registro en `Orders` con status "Pendiente"
6. Crear registros en `OrderItems` para cada item
7. Crear registro en `ShippingAddresses`
8. **OPCIONAL:** Reducir stock de productos (si se maneja inventario)

**Response (201 Created):**
```json
{
  "orderId": 42,
  "orderNumber": "ORD-2024-00042",
  "message": "Pedido creado exitosamente"
}
```

**Errores:**
- **400 Bad Request:** Datos inválidos, carrito vacío, producto no existe
- **401 Unauthorized:** No autenticado
- **409 Conflict:** Stock insuficiente

---

### **2. Obtener Pedidos del Usuario (GET /api/orders/my-orders)**

**Autenticación:** ✅ Requerida (Customer, Employee, Admin)

**Query Parameters:** Ninguno

**Lógica Backend:**
1. Obtener `userId` del token JWT
2. Buscar todos los pedidos donde `UserId = userId`
3. Incluir `OrderItems` y `ShippingAddress` de cada pedido
4. Ordenar por `CreatedAt DESC` (más recientes primero)

**Response (200 OK):**
```json
[
  {
    "id": 42,
    "userId": 15,
    "orderNumber": "ORD-2024-00042",
    "date": "2024-11-18T14:30:00Z",
    "status": "Pendiente",
    "subtotal": 2098.98,
    "tax": 335.84,
    "shippingCost": 0.00,
    "total": 2434.82,
    "paymentMethod": "CreditCard",
    "trackingNumber": null,
    "notes": "Por favor tocar el timbre 3 veces.",
    "createdAt": "2024-11-18T14:30:00Z",
    "updatedAt": "2024-11-18T14:30:00Z",
    "items": [
      {
        "id": 101,
        "orderId": 42,
        "productId": 5,
        "productName": "Chamarra de Cuero Premium",
        "productImage": "https://example.com/images/chamarra.jpg",
        "quantity": 2,
        "unitPrice": 599.99,
        "subtotal": 1199.98
      },
      {
        "id": 102,
        "orderId": 42,
        "productId": 12,
        "productName": "Botas de Montaña",
        "quantity": 1,
        "unitPrice": 899.00,
        "subtotal": 899.00
      }
    ],
    "shippingAddress": {
      "fullName": "Juan Pérez García",
      "phone": "+52 55 1234 5678",
      "street": "Av. Insurgentes Sur 1234, Col. Del Valle",
      "city": "Ciudad de México",
      "state": "CDMX",
      "postalCode": "03100",
      "country": "México"
    }
  }
]
```

**Errores:**
- **401 Unauthorized:** No autenticado

---

### **3. Obtener Detalles de un Pedido (GET /api/orders/{id})**

**Autenticación:** ✅ Requerida (Customer, Employee, Admin)

**Path Parameters:**
- `id` (int): ID del pedido

**Lógica Backend:**
1. Obtener `userId` del token JWT
2. Buscar pedido por `id`
3. **SEGURIDAD:** Verificar que `order.UserId == userId` O que el usuario sea Admin/Employee
   - Si es Customer, solo puede ver sus propios pedidos
   - Si es Admin/Employee, puede ver cualquier pedido
4. Incluir `OrderItems` y `ShippingAddress`

**Response (200 OK):**
```json
{
  "id": 42,
  "userId": 15,
  "orderNumber": "ORD-2024-00042",
  "date": "2024-11-18T14:30:00Z",
  "status": "Enviado",
  "subtotal": 2098.98,
  "tax": 335.84,
  "shippingCost": 0.00,
  "total": 2434.82,
  "paymentMethod": "CreditCard",
  "trackingNumber": "FED123456789MX",
  "notes": "Por favor tocar el timbre 3 veces.",
  "createdAt": "2024-11-18T14:30:00Z",
  "updatedAt": "2024-11-19T10:00:00Z",
  "items": [...],
  "shippingAddress": {...}
}
```

**Errores:**
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** Usuario intentando ver pedido de otro usuario
- **404 Not Found:** Pedido no existe

---

### **4. Actualizar Pedido (PUT /api/orders/{id})**

**Autenticación:** ✅ Requerida (Customer, Employee, Admin)

**Restricción:** Solo se puede editar si el pedido está en estado **"Pendiente"**

**Path Parameters:**
- `id` (int): ID del pedido

**Request Body:**
```json
{
  "shippingAddress": {
    "fullName": "Juan Pérez García",
    "phone": "+52 55 9876 5432",
    "street": "Calle Nueva 456, Col. Reforma",
    "city": "Guadalajara",
    "state": "Jalisco",
    "postalCode": "44100",
    "country": "México"
  },
  "notes": "Entregar solo en horario de oficina (9am-6pm)"
}
```

**Lógica Backend:**
1. Obtener `userId` del token JWT
2. Buscar pedido por `id`
3. **SEGURIDAD:** Verificar que `order.UserId == userId` (o que sea Admin)
4. **VALIDACIÓN:** Verificar que `order.Status == "Pendiente"`
   - Si no, retornar 400 con mensaje: "Solo puedes editar pedidos en estado Pendiente"
5. Actualizar `ShippingAddress` en la base de datos
6. Actualizar `Notes` en la tabla `Orders`
7. Actualizar `UpdatedAt` con la fecha actual

**Response (200 OK):**
```json
{
  "id": 42,
  "userId": 15,
  "orderNumber": "ORD-2024-00042",
  "status": "Pendiente",
  "updatedAt": "2024-11-18T15:45:00Z",
  "items": [...],
  "shippingAddress": {
    "fullName": "Juan Pérez García",
    "phone": "+52 55 9876 5432",
    "street": "Calle Nueva 456, Col. Reforma",
    "city": "Guadalajara",
    "state": "Jalisco",
    "postalCode": "44100",
    "country": "México"
  },
  "notes": "Entregar solo en horario de oficina (9am-6pm)"
}
```

**Errores:**
- **400 Bad Request:** Pedido no está en estado Pendiente
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** Usuario intentando editar pedido de otro
- **404 Not Found:** Pedido no existe

---

### **5. Cancelar Pedido (POST /api/orders/{id}/cancel)**

**Autenticación:** ✅ Requerida (Customer, Employee, Admin)

**Restricción:** Solo se puede cancelar si el pedido está en estado **"Pendiente"** o **"Procesando"**

**Path Parameters:**
- `id` (int): ID del pedido

**Request Body:**
```json
{
  "reason": "Cambié de opinión sobre el color. Prefiero otro modelo."
}
```

**Lógica Backend:**
1. Obtener `userId` del token JWT
2. Buscar pedido por `id`
3. **SEGURIDAD:** Verificar que `order.UserId == userId` (o que sea Admin)
4. **VALIDACIÓN:** Verificar que `order.Status == "Pendiente" OR "Procesando"`
   - Si no, retornar 400: "Solo puedes cancelar pedidos en estado Pendiente o Procesando"
5. Cambiar `Status` a "Cancelado"
6. Guardar `reason` en campo `Notes` (agregar al final si ya había notas)
7. Actualizar `UpdatedAt`
8. **OPCIONAL:** Restaurar stock de productos (si se maneja inventario)

**Response (200 OK):**
```json
{
  "message": "Pedido cancelado exitosamente"
}
```

**Errores:**
- **400 Bad Request:** No se puede cancelar (ya está Enviado/Entregado/Cancelado)
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** Usuario intentando cancelar pedido de otro
- **404 Not Found:** Pedido no existe

---

### **6. Obtener Información de Rastreo (GET /api/orders/{id}/tracking)**

**Autenticación:** ✅ Requerida (Customer, Employee, Admin)

**Path Parameters:**
- `id` (int): ID del pedido

**Lógica Backend:**
1. Obtener `userId` del token JWT
2. Buscar pedido por `id`
3. **SEGURIDAD:** Verificar que `order.UserId == userId` (o Admin/Employee)
4. Retornar información de rastreo

**Response (200 OK):**
```json
{
  "trackingNumber": "FED123456789MX",
  "carrier": "FedEx",
  "status": "En tránsito"
}
```

**Errores:**
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** Usuario intentando ver tracking de otro usuario
- **404 Not Found:** Pedido no existe o aún no tiene tracking

---

## 🔐 Seguridad y Validaciones

### **Autorización por Rol**
```csharp
// Ejemplo en C# (ASP.NET Core)
[Authorize] // Todos los endpoints requieren autenticación
public class OrdersController : ControllerBase
{
    // Los Customers solo pueden ver/editar sus propios pedidos
    private bool IsAuthorizedToAccessOrder(Order order)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        
        return order.UserId.ToString() == userId || 
               userRole == "Admin" || 
               userRole == "Employee";
    }
}
```

### **Estados de Pedido (Order Status)**
Los estados deben seguir este flujo:

```
Pendiente → Procesando → Enviado → Entregado
     ↓
  Cancelado (solo desde Pendiente o Procesando)
```

### **Validaciones de Negocio**
1. **Crear Pedido:**
   - ✅ Al menos 1 item en el carrito
   - ✅ Todos los productos existen en la BD
   - ✅ Stock suficiente (si se maneja inventario)
   - ✅ Dirección completa y válida
   - ✅ Método de pago válido

2. **Editar Pedido:**
   - ✅ Solo estado "Pendiente"
   - ✅ Usuario es dueño del pedido o Admin

3. **Cancelar Pedido:**
   - ✅ Solo estados "Pendiente" o "Procesando"
   - ✅ Motivo de cancelación obligatorio (mínimo 10 caracteres)
   - ✅ Usuario es dueño del pedido o Admin

---

## 📝 Notas Técnicas

### **Generación de Order Number**
```csharp
// Ejemplo de generación de número de orden
private async Task<string> GenerateOrderNumber()
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
        sequence = int.Parse(parts[2]) + 1;
    }
    
    return $"ORD-{year}-{sequence:D5}"; // ORD-2024-00001
}
```

### **Cálculo de Costos**
```csharp
public class OrderCalculator
{
    public const decimal TAX_RATE = 0.16M; // IVA México 16%
    public const decimal FREE_SHIPPING_THRESHOLD = 500M;
    public const decimal SHIPPING_COST = 50M;
    
    public static decimal CalculateSubtotal(List<OrderItem> items)
    {
        return items.Sum(i => i.Quantity * i.UnitPrice);
    }
    
    public static decimal CalculateTax(decimal subtotal)
    {
        return subtotal * TAX_RATE;
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

### **Transacciones de Base de Datos**
Al crear un pedido, usa transacciones para asegurar consistencia:

```csharp
using (var transaction = await _context.Database.BeginTransactionAsync())
{
    try
    {
        // 1. Crear Order
        var order = new Order { ... };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        
        // 2. Crear OrderItems
        foreach (var item in request.Items)
        {
            var orderItem = new OrderItem
            {
                OrderId = order.Id,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Subtotal = item.Quantity * item.UnitPrice
            };
            _context.OrderItems.Add(orderItem);
        }
        
        // 3. Crear ShippingAddress
        var address = new ShippingAddress
        {
            OrderId = order.Id,
            FullName = request.ShippingAddress.FullName,
            // ...
        };
        _context.ShippingAddresses.Add(address);
        
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
        
        return order;
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
}
```

---

## ✅ Checklist de Implementación

### **Base de Datos**
- [ ] Crear tabla `Orders`
- [ ] Crear tabla `OrderItems`
- [ ] Crear tabla `ShippingAddresses`
- [ ] Crear índices en `OrderNumber` (único), `UserId`, `Status`
- [ ] Configurar foreign keys y ON DELETE CASCADE

### **Backend**
- [ ] Crear modelo `Order` con propiedades completas
- [ ] Crear modelo `OrderItem`
- [ ] Crear modelo `ShippingAddress`
- [ ] Crear DTOs para Request/Response
- [ ] Implementar `OrdersController` con todos los endpoints
- [ ] Implementar `OrderService` con lógica de negocio
- [ ] Agregar validaciones de autorización
- [ ] Implementar generación de `OrderNumber`
- [ ] Implementar cálculo automático de costos
- [ ] Usar transacciones para crear pedidos
- [ ] Validar estados antes de editar/cancelar
- [ ] Agregar logs para debugging

### **Testing**
- [ ] Probar crear pedido con datos válidos
- [ ] Probar crear pedido con carrito vacío (debe fallar)
- [ ] Probar obtener pedidos del usuario autenticado
- [ ] Probar obtener pedido de otro usuario (debe fallar)
- [ ] Probar editar pedido en estado Pendiente
- [ ] Probar editar pedido en estado Enviado (debe fallar)
- [ ] Probar cancelar pedido en Pendiente
- [ ] Probar cancelar pedido en Entregado (debe fallar)
- [ ] Probar sin autenticación (debe retornar 401)

---

## 🚀 Ejemplo de Uso (Flujo Completo)

### **1. Usuario agrega productos al carrito (Frontend)**
```typescript
cartService.addToCart(product);
```

### **2. Usuario va a checkout y confirma pedido**
```typescript
const orderRequest = {
  items: cartService.items().map(item => ({
    productId: item.id,
    quantity: item.quantity,
    unitPrice: item.price
  })),
  shippingAddress: {
    fullName: "Juan Pérez",
    phone: "+52 55 1234 5678",
    street: "Av. Insurgentes Sur 1234",
    city: "Ciudad de México",
    state: "CDMX",
    postalCode: "03100",
    country: "México"
  },
  paymentMethod: "CreditCard",
  notes: "Entregar en horario de oficina"
};

orderService.createOrder(orderRequest).subscribe(response => {
  console.log('Pedido creado:', response.orderNumber);
  cartService.clearCart(); // Limpiar carrito
  router.navigate(['/orders']); // Ir a página de pedidos
});
```

### **3. Usuario ve sus pedidos**
```typescript
orderService.getMyOrders().subscribe(orders => {
  console.log('Mis pedidos:', orders);
});
```

### **4. Usuario edita dirección (si está Pendiente)**
```typescript
orderService.updateOrder(orderId, {
  shippingAddress: newAddress,
  notes: "Nueva instrucción"
}).subscribe(updatedOrder => {
  console.log('Pedido actualizado');
});
```

### **5. Usuario cancela pedido**
```typescript
orderService.cancelOrder(orderId, {
  reason: "Cambié de opinión"
}).subscribe(response => {
  console.log(response.message);
});
```

---

## 📧 Contacto

Si tienes dudas sobre la implementación, revisa:
- Esta documentación completa
- Los modelos TypeScript en `src/app/models/order.model.ts`
- El componente de pedidos en `src/app/pages/orders/`
- El servicio en `src/app/services/order.service.ts`

**Frontend está listo y esperando los endpoints. ¡Manos a la obra con el backend! 🚀**
