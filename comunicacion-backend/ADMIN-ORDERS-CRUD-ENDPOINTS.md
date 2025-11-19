# 📋 Endpoints Necesarios - CRUD Completo de Pedidos (Admin)

**Fecha:** 19 de Noviembre 2025  
**Prioridad:** 🟡 MEDIA  
**Status:** ⚠️ PENDIENTE IMPLEMENTACIÓN

---

## 🎯 Resumen

El frontend del panel de administración de pedidos está **completo con CRUD funcional**, pero necesita que el backend implemente **2 endpoints adicionales** para edición y cancelación desde el admin.

---

## ✅ Endpoints YA Implementados

Estos endpoints ya funcionan correctamente:

| Método | Endpoint | Descripción | Status |
|--------|----------|-------------|--------|
| GET | `/api/admin/orders` | Listar pedidos con filtros y paginación | ✅ Funcionando |
| GET | `/api/admin/orders/{id}` | Obtener detalles completos de un pedido | ✅ Funcionando |
| PUT | `/api/admin/orders/{id}/status` | Actualizar estado del pedido | ✅ Funcionando |

---

## ❌ Endpoints FALTANTES

### **1. PUT /api/admin/orders/{id}** ⚠️ REQUERIDO

**Descripción:** Editar dirección de envío y notas de un pedido (solo estado "pending")

**Autenticación:** JWT Bearer Token (Roles: Admin, Employee)

**Restricciones:**
- Solo pedidos en estado `"pending"` pueden editarse
- No se pueden editar items ni totales (solo dirección y notas)

**Request Body:**
```json
{
  "shippingAddress": {
    "fullName": "Juan Pérez García",
    "phone": "+52 55 9876 5432",
    "street": "Av. Reforma 456, Col. Juárez",
    "city": "Ciudad de México",
    "state": "CDMX",
    "postalCode": "06600",
    "country": "México"
  },
  "notes": "Nueva instrucción: Entregar en recepción del edificio"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Pedido actualizado exitosamente",
  "data": {
    "id": 22,
    "orderNumber": "ORD-20251119141100-5678",
    "customerId": 1,
    "customerName": "Santiago",
    "customerEmail": "santiago.c0399@gmail.com",
    "status": "pending",
    "subtotal": 1199.98,
    "tax": 191.99,
    "shippingCost": 100.00,
    "total": 1491.97,
    "paymentMethod": "credit_card",
    "notes": "Nueva instrucción: Entregar en recepción del edificio",
    "shippingAddress": {
      "fullName": "Juan Pérez García",
      "phone": "+52 55 9876 5432",
      "street": "Av. Reforma 456, Col. Juárez",
      "city": "Ciudad de México",
      "state": "CDMX",
      "postalCode": "06600",
      "country": "México"
    },
    "items": [...],
    "createdAt": "2025-11-19T14:11:00Z",
    "updatedAt": "2025-11-19T15:30:00Z"
  }
}
```

**Error Responses:**

```json
// 400 Bad Request - Estado incorrecto
{
  "success": false,
  "message": "No se puede editar un pedido que no está en estado 'pending'",
  "error": "Invalid order status"
}

// 404 Not Found
{
  "success": false,
  "message": "Pedido no encontrado",
  "error": "Order not found"
}

// 403 Forbidden
{
  "success": false,
  "message": "No tienes permisos para editar este pedido",
  "error": "Insufficient permissions"
}
```

**Implementación Sugerida (C#):**

```csharp
// DTO
public class UpdateOrderDto
{
    public ShippingAddressDto ShippingAddress { get; set; }
    public string? Notes { get; set; }
}

// Controller
[HttpPut("{id}")]
[Authorize(Roles = "Admin,Employee")]
public async Task<ActionResult<ApiResponse<OrderResponseDto>>> UpdateOrder(int id, [FromBody] UpdateOrderDto dto)
{
    try
    {
        // 1. Obtener orden
        var order = await _context.Orders
            .Include(o => o.ShippingAddressDetails)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new ApiResponse<OrderResponseDto>
            {
                Success = false,
                Message = "Pedido no encontrado",
                Data = null
            });

        // 2. Validar estado
        if (order.Status != "pending")
            return BadRequest(new ApiResponse<OrderResponseDto>
            {
                Success = false,
                Message = "No se puede editar un pedido que no está en estado 'pending'",
                Data = null
            });

        // 3. Actualizar dirección
        order.ShippingAddressDetails.FullName = dto.ShippingAddress.FullName;
        order.ShippingAddressDetails.Phone = dto.ShippingAddress.Phone;
        order.ShippingAddressDetails.Street = dto.ShippingAddress.Street;
        order.ShippingAddressDetails.City = dto.ShippingAddress.City;
        order.ShippingAddressDetails.State = dto.ShippingAddress.State;
        order.ShippingAddressDetails.PostalCode = dto.ShippingAddress.PostalCode;
        order.ShippingAddressDetails.Country = dto.ShippingAddress.Country;

        // 4. Actualizar notas
        if (!string.IsNullOrWhiteSpace(dto.Notes))
            order.Notes = dto.Notes;

        // 5. Actualizar timestamp
        order.UpdatedAt = DateTime.UtcNow;

        // 6. Guardar cambios
        await _context.SaveChangesAsync();

        // 7. Retornar orden actualizada
        var response = await _orderService.GetOrderByIdAsync(id);

        return Ok(new ApiResponse<OrderResponseDto>
        {
            Success = true,
            Message = "Pedido actualizado exitosamente",
            Data = response
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, $"Error updating order {id}");
        return StatusCode(500, new ApiResponse<OrderResponseDto>
        {
            Success = false,
            Message = "Error al actualizar el pedido",
            Data = null
        });
    }
}
```

---

### **2. POST /api/admin/orders/{id}/cancel** ⚠️ REQUERIDO

**Descripción:** Cancelar un pedido desde el panel de administración

**Autenticación:** JWT Bearer Token (Roles: Admin, Employee)

**Restricciones:**
- Solo pedidos en estado `"pending"` o `"processing"` pueden cancelarse
- No se pueden cancelar pedidos `"delivered"`
- El stock de los productos debe restaurarse

**Request Body:**
```json
{
  "reason": "Cliente solicitó cancelación por cambio de dirección"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Pedido cancelado exitosamente",
  "data": true
}
```

**Error Responses:**

```json
// 400 Bad Request - Estado incorrecto
{
  "success": false,
  "message": "No se puede cancelar un pedido que ya fue entregado",
  "error": "Invalid order status"
}

// 400 Bad Request - Razón faltante
{
  "success": false,
  "message": "Debes proporcionar una razón para cancelar el pedido",
  "error": "Reason is required"
}

// 404 Not Found
{
  "success": false,
  "message": "Pedido no encontrado",
  "error": "Order not found"
}
```

**Implementación Sugerida (C#):**

```csharp
// DTO
public class CancelOrderDto
{
    [Required(ErrorMessage = "La razón de cancelación es obligatoria")]
    [MinLength(10, ErrorMessage = "La razón debe tener al menos 10 caracteres")]
    public string Reason { get; set; }
}

// Controller
[HttpPost("{id}/cancel")]
[Authorize(Roles = "Admin,Employee")]
public async Task<ActionResult<ApiResponse<bool>>> CancelOrder(int id, [FromBody] CancelOrderDto dto)
{
    try
    {
        // 1. Validar razón
        if (string.IsNullOrWhiteSpace(dto.Reason))
            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "Debes proporcionar una razón para cancelar el pedido",
                Data = false
            });

        // 2. Obtener orden con items
        var order = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new ApiResponse<bool>
            {
                Success = false,
                Message = "Pedido no encontrado",
                Data = false
            });

        // 3. Validar que se puede cancelar
        if (order.Status == "delivered")
            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "No se puede cancelar un pedido que ya fue entregado",
                Data = false
            });

        if (order.Status == "cancelled")
            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "El pedido ya está cancelado",
                Data = false
            });

        // 4. Restaurar stock de productos
        foreach (var item in order.Items)
        {
            item.Product.Stock += item.Quantity;
        }

        // 5. Actualizar estado a cancelado
        order.Status = "cancelled";
        order.UpdatedAt = DateTime.UtcNow;

        // 6. Registrar en historial
        order.StatusHistory.Add(new OrderStatusHistory
        {
            Status = "cancelled",
            Note = $"Cancelado por admin: {dto.Reason}",
            Timestamp = DateTime.UtcNow
        });

        // 7. Guardar cambios
        await _context.SaveChangesAsync();

        _logger.LogInformation($"Order {id} cancelled by admin. Reason: {dto.Reason}");

        return Ok(new ApiResponse<bool>
        {
            Success = true,
            Message = "Pedido cancelado exitosamente",
            Data = true
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, $"Error cancelling order {id}");
        return StatusCode(500, new ApiResponse<bool>
        {
            Success = false,
            Message = "Error al cancelar el pedido",
            Data = false
        });
    }
}
```

---

## 🔄 Diferencias con Endpoints de Cliente

| Característica | Cliente (`/api/orders`) | Admin (`/api/admin/orders`) |
|---------------|-------------------------|------------------------------|
| **Editar Pedido** | Solo sus propios pedidos | Cualquier pedido |
| **Cancelar Pedido** | Solo sus propios pedidos | Cualquier pedido |
| **Autorización** | JWT del cliente | JWT con rol Admin/Employee |
| **Validación de Ownership** | Verifica que `userId` coincida | No necesita validación de ownership |
| **Endpoint Base** | `/api/orders` | `/api/admin/orders` |

---

## 📊 Estado de Implementación

| Funcionalidad | Frontend | Backend | Bloqueador |
|---------------|----------|---------|------------|
| Ver lista de pedidos | ✅ Completo | ✅ Completo | No |
| Ver detalles completos | ✅ Completo | ✅ Completo | No |
| Cambiar estado | ✅ Completo | ✅ Completo | No |
| **Editar pedido** | ✅ Completo | ❌ Falta | Sí |
| **Cancelar pedido** | ✅ Completo | ❌ Falta | Sí |
| Filtros y búsqueda | ✅ Completo | ✅ Completo | No |
| Paginación | ✅ Completo | ✅ Completo | No |

---

## 🧪 Testing Checklist

### **Para PUT /api/admin/orders/{id}:**

- [ ] Actualizar dirección de envío de pedido en estado "pending"
- [ ] Actualizar notas del pedido
- [ ] Intentar editar pedido en estado "processing" (debe fallar)
- [ ] Intentar editar pedido en estado "delivered" (debe fallar)
- [ ] Intentar editar pedido inexistente (404)
- [ ] Validar que UpdatedAt se actualiza correctamente
- [ ] Validar que items y totales NO se modifican

### **Para POST /api/admin/orders/{id}/cancel:**

- [ ] Cancelar pedido en estado "pending"
- [ ] Cancelar pedido en estado "processing"
- [ ] Intentar cancelar pedido "delivered" (debe fallar)
- [ ] Validar que stock se restaura correctamente
- [ ] Validar que razón es obligatoria (400 si falta)
- [ ] Validar que se registra en OrderStatusHistory
- [ ] Verificar query SQL: `SELECT * FROM Products WHERE Id IN (SELECT ProductId FROM OrderItems WHERE OrderId = X)` para confirmar stock restaurado

---

## 🎯 Prioridad de Implementación

### **Alta Prioridad** 🔴
- **POST /api/admin/orders/{id}/cancel** - Funcionalidad crítica para administración

### **Media Prioridad** 🟡
- **PUT /api/admin/orders/{id}** - Útil pero no bloqueante (clientes pueden editar desde su perfil)

---

## 💡 Notas Adicionales

### **Sobre Edición de Pedidos:**
- Solo se edita dirección y notas (NO items ni precios)
- Si necesitas cambiar items, el pedido debe cancelarse y crear uno nuevo
- Los totales se recalculan automáticamente en el frontend (no se envían al backend)

### **Sobre Cancelación:**
- El stock debe restaurarse automáticamente
- La razón es obligatoria para auditoría
- Se registra en `OrderStatusHistory` para trazabilidad
- Los clientes también tienen su propio endpoint de cancelación (`POST /api/orders/{id}/cancel`)

### **Consistencia con Documentación Existente:**
- Los endpoints deben seguir el mismo formato que `RESUMEN-APIS-IMPLEMENTADAS.md`
- Usar `ApiResponse<T>` para todas las respuestas
- Logs detallados con `_logger.LogInformation` y `_logger.LogError`
- Validaciones claras con mensajes descriptivos en español

---

## 📞 Integración con Frontend

Una vez implementados estos endpoints, descomenta las siguientes líneas en el frontend:

**Archivo:** `src/app/admin/pages/orders/order-management.component.ts`

```typescript
// Buscar y descomentar:

// En saveOrderChanges():
// this.orderService.updateOrder(this.selectedOrder.id, this.editForm).subscribe({...});

// En confirmCancelOrder():
// this.orderService.cancelOrder(this.selectedOrder.id, this.cancelReason).subscribe({...});
```

**Archivo:** `src/app/services/order-admin.service.ts`

```typescript
// Agregar estos métodos:

updateOrder(id: number, data: UpdateOrderRequest): Observable<Order> {
  return this.http.put<ApiResponse<Order>>(`${this.apiUrl}/${id}`, data).pipe(
    map(response => response.data)
  );
}

cancelOrder(id: number, reason: string): Observable<boolean> {
  return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/${id}/cancel`, { reason }).pipe(
    map(response => response.data)
  );
}
```

---

## ✅ Resumen

**Endpoints Necesarios:** 2  
**Tiempo Estimado de Implementación:** 2-3 horas  
**Impacto:** Permite CRUD completo desde panel de administración  
**Bloqueador:** Medio (funcionalidad parcial disponible)  

**Frontend Status:** ✅ Completo y listo para integración  
**Backend Status:** ⏳ Pendiente implementación

---

**Última Actualización:** 19 de Noviembre 2025  
**Próximo Paso:** Implementar endpoints en backend y descomentar código en frontend
