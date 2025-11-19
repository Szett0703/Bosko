# 📦 GESTIÓN DE PEDIDOS - DOCUMENTACIÓN BACKEND

**Fecha:** 16 de Noviembre 2025  
**Componente Frontend:** `admin/pages/orders/order-management.component`  
**Estado:** ✅ UI 100% COMPLETA - REQUIERE INTEGRACIÓN CON BACKEND

---

## 🎯 RESUMEN

La página de **Gestión de Pedidos** está completamente implementada en el frontend con:

- ✅ Tabla de pedidos con paginación (10 por página)
- ✅ Filtros por estado (pending, processing, delivered, cancelled)
- ✅ Búsqueda por cliente, email o ID de pedido
- ✅ Modal de detalles completos del pedido
- ✅ Modal para actualizar estado del pedido
- ✅ Historial de cambios de estado (timeline)
- ✅ Vista de productos del pedido
- ✅ Información de cliente y dirección de envío
- ✅ Resumen de costos (subtotal, envío, total)
- ✅ Diseño responsive

---

## 🔌 ENDPOINTS REQUERIDOS

### **1. Listar Pedidos con Filtros y Paginación**

#### `GET /api/admin/orders`

**Request:**
```http
GET https://localhost:5006/api/admin/orders?page=1&limit=10&status=pending&search=maria
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Items por página (default: 10, máximo: 100)
- `status` (opcional): Filtrar por estado (`pending`, `processing`, `delivered`, `cancelled`)
- `search` (opcional): Buscar por nombre de cliente, email o ID de pedido
- `sortBy` (opcional): Campo para ordenar (default: `createdAt`)
- `sortOrder` (opcional): `asc` o `desc` (default: `desc`)

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
    },
    {
      "id": 1233,
      "customerName": "Carlos Rodríguez",
      "customerEmail": "carlos@email.com",
      "items": 2,
      "amount": 890.50,
      "status": "processing",
      "createdAt": "2025-11-16T09:15:00Z",
      "updatedAt": "2025-11-16T09:15:00Z"
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "pages": 16,
    "limit": 10
  }
}
```

**Autorización:** `Admin`, `Employee`

---

### **2. Obtener Detalles Completos de un Pedido**

#### `GET /api/admin/orders/{id}`

**Request:**
```http
GET https://localhost:5006/api/admin/orders/1234
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "id": 1234,
  "customerName": "María González",
  "customerEmail": "maria@email.com",
  "items": 3,
  "amount": 1250.00,
  "status": "pending",
  "createdAt": "2025-11-16T10:30:00Z",
  "updatedAt": "2025-11-16T10:30:00Z",
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
  "orderItems": [
    {
      "productId": 45,
      "name": "Camisa Casual Bosko",
      "quantity": 2,
      "price": 50.00,
      "subtotal": 100.00,
      "imageUrl": "https://example.com/images/camisa.jpg"
    },
    {
      "productId": 67,
      "name": "Pantalón Slim Fit",
      "quantity": 1,
      "price": 60.00,
      "subtotal": 60.00,
      "imageUrl": "https://example.com/images/pantalon.jpg"
    }
  ],
  "subtotal": 1200.00,
  "shipping": 50.00,
  "total": 1250.00,
  "paymentMethod": "Tarjeta de Crédito",
  "statusHistory": [
    {
      "status": "pending",
      "timestamp": "2025-11-16T10:30:00Z",
      "note": "Pedido creado"
    }
  ]
}
```

**Response (404 Not Found):**
```json
{
  "error": "Pedido no encontrado",
  "orderId": 1234
}
```

**Autorización:** `Admin`, `Employee`

---

### **3. Actualizar Estado del Pedido**

#### `PUT /api/admin/orders/{id}/status`

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
- `note` (opcional): Nota sobre el cambio de estado (máximo 500 caracteres)

**Response (200 OK):**
```json
{
  "id": 1234,
  "status": "processing",
  "updatedAt": "2025-11-16T12:00:00Z",
  "message": "Estado del pedido actualizado exitosamente"
}
```

**Response (400 Bad Request) - Estado inválido:**
```json
{
  "error": "Estado inválido",
  "validStatuses": ["pending", "processing", "delivered", "cancelled"]
}
```

**Response (404 Not Found):**
```json
{
  "error": "Pedido no encontrado",
  "orderId": 1234
}
```

**Autorización:** `Admin`, `Employee`

**Nota:** Al actualizar el estado, también debe:
1. Actualizar el campo `UpdatedAt` en la tabla `Orders`
2. Crear un registro en la tabla `OrderStatusHistory`

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
    FOREIGN KEY (CustomerId) REFERENCES Users(Id),
    FOREIGN KEY (ShippingAddressId) REFERENCES Addresses(Id),
    INDEX IX_Orders_Status (Status),
    INDEX IX_Orders_CreatedAt (CreatedAt DESC),
    INDEX IX_Orders_CustomerId (CustomerId)
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
    FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
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
    ChangedBy INT,
    FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
    FOREIGN KEY (ChangedBy) REFERENCES Users(Id),
    INDEX IX_OrderStatusHistory_OrderId (OrderId),
    INDEX IX_OrderStatusHistory_Timestamp (Timestamp DESC)
);
```

---

## 💾 LÓGICA DE NEGOCIO

### **Estados Válidos y Transiciones**

```
pending → processing → delivered
        ↘ cancelled ↙
```

**Reglas:**
- `pending` → Puede cambiar a `processing` o `cancelled`
- `processing` → Puede cambiar a `delivered` o `cancelled`
- `delivered` → Estado final, no puede cambiar
- `cancelled` → Estado final, no puede cambiar

### **Búsqueda (Search)**

El parámetro `search` debe buscar en:
1. Nombre del cliente (`CustomerName`)
2. Email del cliente (`CustomerEmail`)
3. ID del pedido (convertido a string)

**Query SQL sugerida:**
```sql
WHERE 
    (CustomerName LIKE '%' + @search + '%' 
    OR CustomerEmail LIKE '%' + @search + '%' 
    OR CAST(Id AS NVARCHAR) LIKE '%' + @search + '%')
    AND (@status IS NULL OR Status = @status)
ORDER BY CreatedAt DESC
OFFSET (@page - 1) * @limit ROWS
FETCH NEXT @limit ROWS ONLY
```

### **Historial de Estados**

Cuando se actualiza el estado de un pedido:

```csharp
// 1. Actualizar el pedido
order.Status = newStatus;
order.UpdatedAt = DateTime.UtcNow;
await _context.SaveChangesAsync();

// 2. Crear registro en historial
var historyEntry = new OrderStatusHistory
{
    OrderId = orderId,
    Status = newStatus,
    Note = statusNote,
    Timestamp = DateTime.UtcNow,
    ChangedBy = currentUserId // Del token JWT
};
await _context.OrderStatusHistory.AddAsync(historyEntry);
await _context.SaveChangesAsync();

// 3. Opcionalmente: enviar notificación al cliente
await _notificationService.NotifyOrderStatusChange(orderId, newStatus);
```

---

## 🧪 DATOS DE PRUEBA

```sql
-- Pedidos de ejemplo
INSERT INTO Orders (CustomerId, CustomerName, CustomerEmail, ShippingAddressId, SubTotal, Shipping, Total, Status, PaymentMethod) 
VALUES
(1, 'María González', 'maria@email.com', 1, 1200.00, 50.00, 1250.00, 'pending', 'credit_card'),
(2, 'Carlos Rodríguez', 'carlos@email.com', 2, 840.00, 50.50, 890.50, 'processing', 'paypal'),
(3, 'Ana Martínez', 'ana@email.com', 3, 2050.00, 50.00, 2100.00, 'delivered', 'credit_card'),
(4, 'Juan Pérez', 'juan@email.com', 4, 400.00, 50.00, 450.00, 'cancelled', 'debit_card'),
(5, 'Laura García', 'laura@email.com', 5, 1630.00, 50.00, 1680.00, 'delivered', 'credit_card'),
(6, 'Pedro Sánchez', 'pedro@email.com', 6, 730.00, 50.00, 780.00, 'processing', 'paypal'),
(7, 'Sofia López', 'sofia@email.com', 7, 1300.00, 50.00, 1350.00, 'pending', 'credit_card'),
(8, 'Diego Torres', 'diego@email.com', 8, 2400.00, 50.00, 2450.00, 'delivered', 'credit_card');

-- Items de pedido de ejemplo
INSERT INTO OrderItems (OrderId, ProductId, ProductName, Quantity, Price, Subtotal)
VALUES
(1, 1, 'Camisa Casual Bosko', 2, 50.00, 100.00),
(1, 2, 'Pantalón Slim Fit', 1, 60.00, 60.00);

-- Historial de estados
INSERT INTO OrderStatusHistory (OrderId, Status, Note, ChangedBy)
VALUES
(1, 'pending', 'Pedido creado', 1),
(2, 'pending', 'Pedido creado', 2),
(2, 'processing', 'Pedido en preparación', 1);
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Endpoints Básicos** (Prioritario)
- [ ] Implementar `GET /api/admin/orders` con filtros y paginación
- [ ] Implementar `GET /api/admin/orders/{id}` con todos los detalles
- [ ] Crear índices en la BD para optimizar queries
- [ ] Configurar autorización por roles

### **Fase 2: Actualización de Estado**
- [ ] Implementar `PUT /api/admin/orders/{id}/status`
- [ ] Validar transiciones de estado permitidas
- [ ] Crear triggers o lógica para historial automático
- [ ] Implementar notificaciones opcionales

### **Fase 3: Optimizaciones**
- [ ] Caché para pedidos recientes
- [ ] Paginación eficiente con cursor
- [ ] Exportar pedidos a CSV/Excel
- [ ] Logs de auditoría

---

## 🔐 SEGURIDAD

### **Validaciones**
- ✅ Validar que el usuario tiene permisos (Admin o Employee)
- ✅ Validar que el `status` es uno de los valores permitidos
- ✅ Sanitizar el parámetro `search` para prevenir SQL injection
- ✅ Limitar el `limit` máximo a 100 items por página
- ✅ Validar que el pedido existe antes de actualizar

### **Rate Limiting**
- Limitar a 100 requests por minuto por usuario
- Limitar actualizaciones de estado a 10 por minuto

---

## 📝 NOTAS IMPORTANTES

### **Formato de Fechas**
- Usar **ISO 8601**: `2025-11-16T10:30:00Z`
- Todas las fechas en **UTC**
- El frontend convierte automáticamente a zona horaria local

### **Monedas**
- Todos los montos en **decimales** con 2 decimales
- Símbolo de moneda se maneja en frontend (€)

### **Paginación**
- Página 1 es la primera (no 0-indexed)
- Incluir siempre `total`, `page`, `pages`, `limit` en la respuesta

### **Estados**
- Usar **lowercase**: `pending`, `processing`, `delivered`, `cancelled`
- El frontend traduce automáticamente al español

### **Imágenes de Productos**
- URLs completas en `imageUrl`
- Tamaño recomendado: 200x200px para la lista

---

## 🚀 INTEGRACIÓN EN EL FRONTEND

### **Archivos a Modificar**

1. **Crear servicio Angular:**
```typescript
// src/app/services/order-admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class OrderAdminService {
  private apiUrl = `${API_URL}/api/admin/orders`;

  constructor(private http: HttpClient) {}

  getOrders(page: number, limit: number, status?: string, search?: string): Observable<any> {
    let params: any = { page, limit };
    if (status && status !== 'all') params.status = status;
    if (search) params.search = search;
    return this.http.get(this.apiUrl, { params });
  }

  getOrderDetails(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateOrderStatus(id: number, status: string, note?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status, note });
  }
}
```

2. **Actualizar componente:**
```typescript
// En order-management.component.ts
// Reemplazar las llamadas simuladas con:

constructor(private orderService: OrderAdminService) {}

loadOrders(): void {
  this.isLoading = true;
  this.orderService.getOrders(
    this.currentPage, 
    this.itemsPerPage, 
    this.statusFilter, 
    this.searchQuery
  ).subscribe({
    next: (response) => {
      this.orders = response.orders;
      this.totalPages = response.pagination.pages;
      this.applyFilters();
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading orders:', err);
      this.isLoading = false;
    }
  });
}

// Similar para viewOrderDetails y updateOrderStatus
```

---

## 🎯 PRÓXIMOS PASOS

1. **Backend implementa los 3 endpoints** prioritarios
2. **Frontend crea el servicio** OrderAdminService
3. **Frontend integra** las llamadas reales al API
4. **Testing** con datos reales
5. **Optimizaciones** y mejoras

---

**¿Dudas o necesitas más detalles?** 👨‍💻  
El frontend está 100% listo y esperando la integración con estos endpoints.
