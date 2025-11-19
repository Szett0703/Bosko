# 🔴 ERROR - Campo 'items' en lugar de 'itemsCount'

**Fecha:** 19 de Noviembre 2025  
**Severidad:** 🟡 MEDIA - Funcionalidad afectada  
**Endpoint:** `GET /api/admin/orders`

---

## 🎯 PROBLEMA IDENTIFICADO

El endpoint de administración de pedidos está enviando el campo con el **nombre incorrecto**.

### **Respuesta Actual del Backend:**
```json
{
  "orders": [
    {
      "id": 22,
      "customerName": "Santiago",
      "customerEmail": "santiago.c0399@gmail.com",
      "items": 0,  ❌ CAMPO INCORRECTO
      "amount": 308.77,
      "status": "pending",
      "createdAt": "2025-11-19T14:11:00Z",
      "updatedAt": "2025-11-19T14:11:00Z"
    }
  ]
}
```

### **Respuesta Esperada (según documentación):**
```json
{
  "orders": [
    {
      "id": 22,
      "customerName": "Santiago",
      "customerEmail": "santiago.c0399@gmail.com",
      "itemsCount": 2,  ✅ CAMPO CORRECTO
      "amount": 308.77,
      "status": "pending",
      "createdAt": "2025-11-19T14:11:00Z",
      "updatedAt": "2025-11-19T14:11:00Z"
    }
  ]
}
```

---

## 📋 INCONSISTENCIA DETECTADA

### **Otros endpoints SÍ usan 'itemsCount':**

✅ **GET /api/orders/customer/{customerId}** (correcto)
```json
{
  "data": [
    {
      "id": 21,
      "itemsCount": 1  ← Correcto con 's'
    }
  ]
}
```

❌ **GET /api/admin/orders** (incorrecto)
```json
{
  "orders": [
    {
      "id": 22,
      "items": 0  ← Sin 's' y valor incorrecto
    }
  ]
}
```

---

## 🔧 SOLUCIÓN REQUERIDA EN BACKEND

### **Archivo a Modificar:**
Probablemente en el **DTO de respuesta** para el admin:

**Buscar algo como:**
```csharp
public class OrderListDto
{
    public int Id { get; set; }
    public string CustomerName { get; set; }
    public string CustomerEmail { get; set; }
    public int Items { get; set; }  // ❌ CAMBIAR ESTE NOMBRE
    public decimal Amount { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

**Cambiar a:**
```csharp
public class OrderListDto
{
    public int Id { get; set; }
    public string CustomerName { get; set; }
    public string CustomerEmail { get; set; }
    public int ItemsCount { get; set; }  // ✅ NOMBRE CORRECTO
    public decimal Amount { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### **En el Controller o Service:**

**Buscar:**
```csharp
var orders = await _context.Orders
    .Select(o => new OrderListDto
    {
        Id = o.Id,
        CustomerName = o.CustomerName,
        CustomerEmail = o.CustomerEmail,
        Items = o.Items.Count(),  // ❌ Nombre incorrecto
        Amount = o.Total,
        // ...
    })
    .ToListAsync();
```

**Cambiar a:**
```csharp
var orders = await _context.Orders
    .Select(o => new OrderListDto
    {
        Id = o.Id,
        CustomerName = o.CustomerName,
        CustomerEmail = o.CustomerEmail,
        ItemsCount = o.Items.Count(),  // ✅ Nombre correcto
        Amount = o.Total,
        // ...
    })
    .ToListAsync();
```

---

## 🐛 PROBLEMA ADICIONAL: Valor Siempre 0

Además del nombre incorrecto, el valor es **siempre 0** en lugar del número real de items.

### **Posibles causas:**

#### **1. Relación no cargada (MÁS PROBABLE)**
```csharp
// ❌ INCORRECTO - Items no se carga
var orders = await _context.Orders
    .Select(o => new OrderListDto
    {
        ItemsCount = o.Items.Count()  // Items es null, Count() = 0
    })
    .ToListAsync();

// ✅ CORRECTO - Incluir Items en la consulta
var orders = await _context.Orders
    .Include(o => o.Items)  // ← Agregar esto
    .Select(o => new OrderListDto
    {
        ItemsCount = o.Items.Count()
    })
    .ToListAsync();
```

#### **2. Tabla OrderItems vacía**
Verificar en SQL:
```sql
SELECT o.Id, o.OrderNumber, COUNT(oi.Id) as ItemsCount
FROM Orders o
LEFT JOIN OrderItems oi ON oi.OrderId = o.Id
GROUP BY o.Id, o.OrderNumber;
```

Si esto retorna 0, significa que los `OrderItems` no se están guardando al crear la orden.

---

## ✅ CHECKLIST PARA BACKEND

### **Cambio de Nombre:**
- [ ] Cambiar propiedad `Items` a `ItemsCount` en DTO
- [ ] Actualizar LINQ query en Controller/Service
- [ ] Verificar que JSON serializa como `"itemsCount"` (camelCase)

### **Corregir Valor 0:**
- [ ] Agregar `.Include(o => o.Items)` en la consulta
- [ ] Verificar que `OrderItems` se guardan correctamente al crear orden
- [ ] Ejecutar query SQL para confirmar que hay items en la tabla

### **Consistencia:**
- [ ] Verificar que TODOS los endpoints usan `itemsCount` (no `items`)
- [ ] GET /api/orders ✅ (ya usa `itemsCount`)
- [ ] GET /api/orders/customer/{id} ✅ (ya usa `itemsCount`)
- [ ] GET /api/admin/orders ❌ (usar `itemsCount`)

---

## 🧪 TESTING

### **Verificar Fix:**
```bash
# 1. Hacer request a admin orders
GET https://localhost:5006/api/admin/orders?page=1&limit=10

# 2. Verificar respuesta:
{
  "orders": [
    {
      "id": 22,
      "itemsCount": 2,  ← Debe aparecer con 's' y valor correcto
      ...
    }
  ]
}
```

### **Query SQL para Debug:**
```sql
-- Ver cuántos items tiene cada orden
SELECT 
    o.Id,
    o.OrderNumber,
    o.CustomerName,
    COUNT(oi.Id) as RealItemsCount,
    o.Total
FROM Orders o
LEFT JOIN OrderItems oi ON oi.OrderId = o.Id
WHERE o.Id IN (21, 22)
GROUP BY o.Id, o.OrderNumber, o.CustomerName, o.Total;
```

**Resultado esperado:**
```
Id | OrderNumber           | CustomerName | RealItemsCount | Total
22 | ORD-20251119141100... | Santiago     | 2              | 308.77
21 | ORD-20251119140300... | Camilo       | 1              | 125.50
```

---

## 📊 COMPARACIÓN ENDPOINTS

| Endpoint | Campo Actual | Campo Correcto | Valor Correcto |
|----------|--------------|----------------|----------------|
| GET /api/orders | `itemsCount` ✅ | `itemsCount` | ✅ Funciona |
| GET /api/orders/customer/{id} | `itemsCount` ✅ | `itemsCount` | ✅ Funciona |
| GET /api/admin/orders | `items` ❌ | `itemsCount` | ❌ Siempre 0 |

---

## 🎯 IMPACTO

**Afectado:**
- Panel de administración - tabla de pedidos
- Columna "Items" muestra vacía

**No Afectado:**
- Perfil de usuario - pedidos se ven correctamente
- Creación de pedidos - funciona bien
- Otros endpoints de pedidos

---

## 💡 WORKAROUND TEMPORAL EN FRONTEND

Mientras se corrige el backend, el frontend puede mapear temporalmente:

```typescript
// Mapear 'items' a 'itemsCount' en el servicio
getOrders(...): Observable<OrderListResponse> {
  return this.http.get<any>(this.apiUrl, { params }).pipe(
    map(response => ({
      orders: response.orders.map((order: any) => ({
        ...order,
        itemsCount: order.items || 0  // Temporal fix
      })),
      pagination: response.pagination
    }))
  );
}
```

**⚠️ IMPORTANTE:** Este es un fix temporal, el backend debe corregirse.

---

## 📞 RESUMEN

**PROBLEMA:** Campo `items` en lugar de `itemsCount` + valor siempre 0  
**ENDPOINT:** GET /api/admin/orders  
**CAUSA:** DTO incorrecto + falta `.Include(o => o.Items)`  
**SOLUCIÓN:** Renombrar campo y cargar relación  
**RESPONSABLE:** 🔴 BACKEND  
**TIEMPO ESTIMADO:** 10 minutos

---

**Status:** 🔴 BLOQUEADOR para vista de admin  
**Prioridad:** 🟡 MEDIA  
**Última Actualización:** 19 de Noviembre 2025
