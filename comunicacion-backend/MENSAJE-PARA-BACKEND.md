# 📨 MENSAJE PARA BACKEND - SISTEMA DE AUTENTICACIÓN

**Fecha:** 16 de Noviembre 2025  
**De:** Frontend Team  
**Para:** Backend Team  
**Asunto:** Sistema de Autenticación Completo - Listo para Integración

---

## 🎯 RESUMEN

Hola equipo de Backend,

He completado **todo el sistema de autenticación y roles** en el frontend de Bosko. Está **100% funcional y listo para integrarse** con el backend.

---

## 📄 DOCUMENTO PRINCIPAL A LEER

**Por favor lean este documento completo:**

📂 **`AUTENTICACION-ROLES-ESPECIFICACIONES.md`** (en esta misma carpeta)

Este documento de **500+ líneas** contiene absolutamente TODO lo que necesitan:

### ✅ Contenido del Documento:

1. ✅ **Estructura del JWT** - Claims exactos requeridos
2. ✅ **5 Endpoints de Autenticación** - Request/Response completos
3. ✅ **Código C# Completo** - Listo para copiar y pegar
4. ✅ **Script SQL Completo** - Tabla Users con índices
5. ✅ **Configuración JWT** - appsettings.json y Program.cs
6. ✅ **Validación BCrypt** - Para passwords
7. ✅ **Google OAuth** - Integración completa
8. ✅ **Controllers con [Authorize]** - Ejemplos reales
9. ✅ **Casos de Prueba** - Para Postman/Swagger
10. ✅ **Checklist Implementación** - Paso a paso

---

## 🔑 DATOS CRÍTICOS

### Usuarios de Prueba (DEBEN CREAR):

```
1. ADMIN:
   Email: admin@bosko.com
   Password: Bosko123!
   Role: Admin

2. EMPLOYEE:
   Email: employee@bosko.com
   Password: Bosko123!
   Role: Employee

3. CUSTOMER:
   Email: customer@bosko.com
   Password: Bosko123!
   Role: Customer
```

### JWT Claims Requeridos:

```json
{
  "sub": "123",              // User ID
  "name": "Juan Pérez",      // Nombre del usuario
  "email": "juan@bosko.com", // Email
  "role": "Admin",           // "Admin", "Employee", o "Customer"
  "provider": "Local",       // "Local" o "Google"
  "exp": 1732000000          // Timestamp de expiración
}
```

**IMPORTANTE:** El frontend puede leer cualquiera de estos formatos de claims:
- `sub`, `userId`, `nameid`, `id` → Para User ID
- `name`, `unique_name`, `given_name` → Para nombre
- `role` o claim de .NET → Para rol

---

## 🌐 ENDPOINTS A IMPLEMENTAR

### 1. POST `/api/auth/login`
```json
Request:
{
  "email": "usuario@bosko.com",
  "password": "contraseña123"
}

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "usuario@bosko.com",
    "role": "Customer",
    "provider": "Local"
  }
}
```

### 2. POST `/api/auth/register`
```json
Request:
{
  "name": "Nuevo Usuario",
  "email": "nuevo@bosko.com",
  "password": "Contraseña123!"
}

Response (201 Created):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "Nuevo Usuario",
    "email": "nuevo@bosko.com",
    "role": "Customer",  // Siempre Customer en registro
    "provider": "Local"
  }
}
```

### 3. POST `/api/auth/google-login`
```json
Request:
{
  "token": "google_id_token_aqui..."
}

Response (200 OK):
{
  "token": "jwt_de_bosko...",
  "user": { ... }
}
```

### 4. POST `/api/auth/forgot-password`
```json
Request:
{
  "email": "usuario@bosko.com"
}

Response (200 OK):
{
  "message": "Se ha enviado un correo con instrucciones"
}
```

### 5. POST `/api/auth/reset-password`
```json
Request:
{
  "email": "usuario@bosko.com",
  "token": "reset_token_temporal",
  "newPassword": "NuevaContraseña123!"
}

Response (200 OK):
{
  "message": "Contraseña actualizada exitosamente"
}
```

---

## 🛡️ PROTECCIÓN DE RUTAS POR ROL

### Rutas Públicas (Sin autenticación):
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/categories`
- `GET /api/reviews/{productId}`

### Rutas Customer (Usuario autenticado):
- `GET /api/users/me`
- `PUT /api/users/me`
- `POST /api/orders`
- `GET /api/orders/my-orders`
- `POST /api/reviews`
- `GET /api/wishlist`
- `POST /api/wishlist`
- `GET /api/addresses`
- `POST /api/addresses`

### Rutas Employee (Roles: Admin, Employee):
- `GET /api/admin/stats`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/{id}/status`

### Rutas Admin (Solo Admin):
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PUT /api/admin/users/{id}`
- `DELETE /api/admin/users/{id}`
- `PUT /api/admin/users/{id}/role`
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `DELETE /api/admin/products/{id}`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/{id}`
- `DELETE /api/admin/categories/{id}`

---

## 💻 CÓDIGO C# - EJEMPLO RÁPIDO

### appsettings.json
```json
{
  "JwtSettings": {
    "SecretKey": "tu_clave_secreta_muy_larga_minimo_32_caracteres",
    "Issuer": "BoskoAPI",
    "Audience": "BoskoFrontend",
    "ExpirationMinutes": 1440
  }
}
```

### Generación de JWT
```csharp
public string GenerateToken(User user)
{
    var securityKey = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"])
    );
    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Name, user.Name),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim("role", user.Role.ToString()),
        new Claim("provider", user.Provider ?? "Local")
    };

    var token = new JwtSecurityToken(
        issuer: _configuration["JwtSettings:Issuer"],
        audience: _configuration["JwtSettings:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(1440),
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

### Controller con Autorización
```csharp
[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin,Employee")]
public class AdminController : ControllerBase
{
    [HttpGet("stats")]
    public IActionResult GetStats()
    {
        // Admin y Employee pueden acceder
        return Ok(stats);
    }

    [HttpPost("products")]
    [Authorize(Roles = "Admin")] // Solo Admin
    public IActionResult CreateProduct([FromBody] ProductDto dto)
    {
        return Ok(product);
    }
}
```

---

## 🗄️ SCRIPT SQL

```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NULL, -- Null para usuarios de Google
    Phone NVARCHAR(20) NULL,
    Role NVARCHAR(20) NOT NULL DEFAULT 'Customer',
    Provider NVARCHAR(20) NOT NULL DEFAULT 'Local',
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsActive BIT NOT NULL DEFAULT 1,
    
    CONSTRAINT CK_Users_Role CHECK (Role IN ('Admin', 'Employee', 'Customer')),
    CONSTRAINT CK_Users_Provider CHECK (Provider IN ('Local', 'Google'))
);

CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_Role ON Users(Role);

-- Usuarios de prueba (password: Bosko123! para todos)
INSERT INTO Users (Name, Email, PasswordHash, Role, Provider) VALUES 
('Admin Bosko', 'admin@bosko.com', '$2a$11$...hashedPassword...', 'Admin', 'Local'),
('Empleado Test', 'employee@bosko.com', '$2a$11$...hashedPassword...', 'Employee', 'Local'),
('Cliente Test', 'customer@bosko.com', '$2a$11$...hashedPassword...', 'Customer', 'Local');
```

---

## 🔐 SEGURIDAD

### Passwords:
- ✅ Hash con BCrypt (nunca texto plano)
- ✅ Mínimo 6 caracteres (frontend valida)

```csharp
using BCrypt.Net;

// Registrar
string hashedPassword = BCrypt.HashPassword(dto.Password);

// Login
bool isValid = BCrypt.Verify(loginDto.Password, user.PasswordHash);
```

### Google OAuth:
- ✅ Validar token con Google API
- ✅ NuGet: `Google.Apis.Auth`

```csharp
var payload = await GoogleJsonWebSignature.ValidateAsync(googleToken);
string email = payload.Email;
string name = payload.Name;
```

---

## ✅ FRONTEND ESTÁ LISTO CON:

- ✅ Login con email/password
- ✅ Login con Google OAuth
- ✅ Registro de usuarios
- ✅ Forgot/Reset password
- ✅ Remember me (recordar email)
- ✅ Show/hide password
- ✅ Redirects automáticos por rol:
  - Admin → `/admin`
  - Employee → `/admin`
  - Customer → `/`
- ✅ Guards para proteger rutas
- ✅ Directiva `*appHasRole` para mostrar/ocultar elementos
- ✅ Manejo completo de JWT
- ✅ Validación de tokens
- ✅ UI profesional y responsive

---

## 🧪 TESTING RECOMENDADO

### Con Postman/Swagger:

1. **Login Admin:**
```bash
POST https://localhost:5006/api/auth/login
{
  "email": "admin@bosko.com",
  "password": "Bosko123!"
}
```

2. **Verificar Token en jwt.io:**
   - Copiar el token generado
   - Pegar en https://jwt.io
   - Verificar claims: sub, name, email, role, exp

3. **Probar ruta protegida:**
```bash
GET https://localhost:5006/api/admin/stats
Authorization: Bearer {token_aqui}
```

4. **Probar sin permisos:**
```bash
# Login como Customer
# Intentar acceder a /api/admin/products
# Debe devolver 403 Forbidden
```

---

## 📋 CHECKLIST IMPLEMENTACIÓN

Marcar cuando completen cada paso:

- [ ] **1. Configurar JWT en appsettings.json**
- [ ] **2. Instalar NuGet packages:**
  - `Microsoft.AspNetCore.Authentication.JwtBearer`
  - `BCrypt.Net-Next`
  - `Google.Apis.Auth`
- [ ] **3. Crear tabla Users en BD**
- [ ] **4. Implementar generación de JWT**
- [ ] **5. Configurar middleware de autenticación**
- [ ] **6. Implementar POST /api/auth/login**
- [ ] **7. Implementar POST /api/auth/register**
- [ ] **8. Implementar POST /api/auth/google-login**
- [ ] **9. Implementar POST /api/auth/forgot-password**
- [ ] **10. Implementar POST /api/auth/reset-password**
- [ ] **11. Agregar [Authorize] en controllers**
- [ ] **12. Crear usuarios de prueba (seed)**
- [ ] **13. Probar con Postman/Swagger**
- [ ] **14. Verificar CORS para localhost:4300**

---

## 🚀 CUANDO ESTÉN LISTOS

**Por favor avísenme cuando:**

1. ✅ Tengan el backend corriendo en `https://localhost:5006`
2. ✅ Los 5 endpoints estén implementados
3. ✅ Los usuarios de prueba estén creados
4. ✅ Puedan hacer login exitoso en Swagger/Postman
5. ✅ El JWT se genere correctamente

**Entonces haré las pruebas de integración completas desde el frontend.**

---

## 📞 DUDAS O PREGUNTAS

Si tienen preguntas sobre:
- ❓ Estructura del JWT
- ❓ Algún endpoint específico
- ❓ Validaciones de seguridad
- ❓ Google OAuth
- ❓ Configuración de .NET
- ❓ Lo que sea...

**Solo avisen y lo aclaramos de inmediato.**

El documento `AUTENTICACION-ROLES-ESPECIFICACIONES.md` tiene **ejemplos de código C# listos para copiar y pegar**, casos de uso completos, y toda la información técnica detallada.

---

## 📚 DOCUMENTOS DE REFERENCIA

En esta carpeta `comunicacion-backend/` encontrarán:

1. **`AUTENTICACION-ROLES-ESPECIFICACIONES.md`** ⭐ PRINCIPAL
   - 500+ líneas
   - Código C# completo
   - SQL scripts
   - Casos de prueba
   - Checklist detallado

2. **`RESUMEN-MEJORAS-LOGIN.md`**
   - Overview de mejoras del frontend
   - Funcionalidades implementadas
   - Ejemplos de uso

3. **`MENSAJE-PARA-BACKEND.md`** ← Este archivo
   - Resumen ejecutivo
   - Datos críticos
   - Quick start

---

## ✅ CONCLUSIÓN

**TODO el sistema de autenticación está implementado en el frontend y funcionando perfectamente.**

**Ahora es turno del backend de implementar los endpoints según las especificaciones.**

**El documento principal tiene absolutamente TODO lo que necesitan. 🚀**

---

**¿Listos para empezar? Lean el documento y cualquier duda me avisan.** 👍
