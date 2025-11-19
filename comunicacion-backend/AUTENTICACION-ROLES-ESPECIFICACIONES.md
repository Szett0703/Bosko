# 🔐 SISTEMA DE AUTENTICACIÓN Y ROLES - ESPECIFICACIONES BACKEND

**Fecha:** 16 de Noviembre 2025  
**Proyecto:** Bosko E-Commerce  
**De:** Frontend Team  
**Para:** Backend Team

---

## 📋 RESUMEN EJECUTIVO

Se ha implementado un **sistema completo de autenticación basado en roles** en el frontend con las siguientes funcionalidades:

✅ Login con email/password  
✅ Login con Google OAuth  
✅ Registro de usuarios  
✅ Recuperación de contraseña  
✅ Sistema de roles (Admin, Employee, Customer)  
✅ Guards para protección de rutas  
✅ Directiva `*appHasRole` para mostrar/ocultar elementos  
✅ Remember me (recordar email)  
✅ Redirección automática según rol  
✅ Manejo de JWT con decodificación automática

---

## 🎯 ROLES DE USUARIO

### 1. **Customer** (Cliente)
- **Acceso:** Todo el sitio público + perfil personal
- **Permisos:**
  - Ver productos y categorías
  - Agregar al carrito
  - Realizar pedidos
  - Ver historial de pedidos propios
  - Gestionar perfil personal
  - Agregar/quitar de wishlist
  - Escribir reseñas de productos

### 2. **Employee** (Empleado)
- **Acceso:** Todo lo de Customer + Panel Admin (limitado)
- **Permisos adicionales:**
  - Ver dashboard de estadísticas
  - Gestionar pedidos (ver, actualizar estado)
  - Ver lista de productos (sin editar)
  - Ver lista de usuarios (sin editar)

### 3. **Admin** (Administrador)
- **Acceso:** Acceso completo a todo el sistema
- **Permisos adicionales:**
  - CRUD completo de productos
  - CRUD completo de categorías
  - CRUD completo de usuarios
  - Gestionar roles de usuarios
  - Ver todas las estadísticas
  - Gestionar todos los pedidos

---

## 🔑 ESTRUCTURA DEL JWT

### Token Claims Requeridos

El backend debe generar un JWT con los siguientes claims (usando formato estándar):

```json
{
  "sub": "123",                    // User ID (también puede ser "userId", "nameid", "id")
  "name": "Juan Pérez",            // Nombre del usuario (o "unique_name", "given_name")
  "email": "juan@bosko.com",       // Email (o "preferred_username")
  "role": "Admin",                 // Rol: "Admin", "Employee", o "Customer"
  "provider": "Local",             // Proveedor: "Local" o "Google"
  "exp": 1732000000,               // Timestamp de expiración (Unix time)
  "iat": 1731914400,               // Timestamp de emisión
  "iss": "BoskoAPI",               // Emisor del token
  "aud": "BoskoFrontend"           // Audiencia del token
}
```

### Claims Alternativos Soportados

El frontend puede parsear cualquiera de estos formatos:

```json
{
  // ID de usuario
  "sub": "123"                     ✅ Preferido
  "userId": "123"                  ✅ Aceptado
  "nameid": "123"                  ✅ Aceptado (.NET)
  "id": "123"                      ✅ Aceptado

  // Nombre de usuario
  "name": "Juan Pérez"             ✅ Preferido
  "unique_name": "Juan Pérez"      ✅ Aceptado (.NET)
  "given_name": "Juan"             ✅ Aceptado

  // Email
  "email": "juan@bosko.com"        ✅ Preferido
  "preferred_username": "juan@"    ✅ Aceptado

  // Rol (IMPORTANTE)
  "role": "Admin"                  ✅ Preferido
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Admin"  ✅ Aceptado (.NET)
}
```

---

## 🌐 ENDPOINTS DE AUTENTICACIÓN

### 1. POST `/api/auth/login`

**Request:**
```json
{
  "email": "usuario@bosko.com",
  "password": "contraseña123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "usuario@bosko.com",
    "phone": "+1234567890",          // Opcional
    "role": "Customer",
    "provider": "Local",
    "createdAt": "2025-01-15T10:30:00Z"  // Opcional
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Email o contraseña incorrectos",
  "title": "Error de autenticación"     // Opcional
}
```

---

### 2. POST `/api/auth/register`

**Request:**
```json
{
  "name": "Nuevo Usuario",
  "email": "nuevo@bosko.com",
  "password": "Contraseña123!",
  "phone": "+1234567890"              // Opcional
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "Nuevo Usuario",
    "email": "nuevo@bosko.com",
    "phone": "+1234567890",
    "role": "Customer",              // Default: siempre Customer en registro
    "provider": "Local",
    "createdAt": "2025-11-16T14:25:00Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "message": "El email ya está registrado",
  "errors": {
    "email": ["Email ya existe en el sistema"]
  }
}
```

---

### 3. POST `/api/auth/google-login`

**Request:**
```json
{
  "token": "google_id_token_aqui..."
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "name": "Usuario Google",
    "email": "usuario@gmail.com",
    "role": "Customer",
    "provider": "Google",
    "createdAt": "2025-11-16T14:30:00Z"
  }
}
```

**Nota:** El backend debe:
1. Verificar el token de Google con Google API
2. Extraer email y nombre del token
3. Buscar usuario existente por email
4. Si no existe, crear nuevo usuario con rol Customer
5. Devolver JWT propio del sistema

---

### 4. POST `/api/auth/forgot-password`

**Request:**
```json
{
  "email": "usuario@bosko.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Se ha enviado un correo con instrucciones para restablecer tu contraseña"
}
```

**Nota:** El backend debe:
1. Verificar que el email existe
2. Generar token único temporal (válido 1 hora)
3. Enviar email con link: `https://bosko.com/reset-password?token=XXX&email=YYY`
4. Siempre devolver 200 OK (aunque el email no exista, por seguridad)

---

### 5. POST `/api/auth/reset-password`

**Request:**
```json
{
  "email": "usuario@bosko.com",
  "token": "reset_token_temporal",
  "newPassword": "NuevaContraseña123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Contraseña actualizada exitosamente"
}
```

**Response (400 Bad Request):**
```json
{
  "message": "Token inválido o expirado"
}
```

---

## 🛡️ ENDPOINTS PROTEGIDOS

### Autenticación Requerida

Todos los endpoints protegidos deben verificar:

1. **Header Authorization:**
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Validar JWT:**
   - Token no expirado
   - Firma válida
   - Usuario existe

3. **Respuesta 401 si no autenticado:**
   ```json
   {
     "message": "No autenticado. Token no válido o expirado."
   }
   ```

---

### Verificación de Roles

Para endpoints con restricción de rol:

**Response (403 Forbidden):**
```json
{
  "message": "No tienes permisos para acceder a este recurso",
  "requiredRole": "Admin"
}
```

---

## 📍 RUTAS Y PERMISOS

### Rutas Públicas (Sin autenticación)
- `GET /api/products` - Listar productos
- `GET /api/products/{id}` - Ver detalle producto
- `GET /api/categories` - Listar categorías
- `GET /api/reviews/{productId}` - Ver reseñas de producto

### Rutas Customer (Autenticado)
- `GET /api/users/me` - Ver perfil propio
- `PUT /api/users/me` - Actualizar perfil propio
- `POST /api/orders` - Crear pedido
- `GET /api/orders/my-orders` - Ver mis pedidos
- `GET /api/addresses` - Ver mis direcciones
- `POST /api/addresses` - Crear dirección
- `GET /api/wishlist` - Ver mi wishlist
- `POST /api/wishlist` - Agregar a wishlist
- `POST /api/reviews` - Crear reseña

### Rutas Employee (Roles: Admin, Employee)
- `GET /api/admin/stats` - Ver estadísticas
- `GET /api/admin/orders` - Ver todos los pedidos
- `PUT /api/admin/orders/{id}/status` - Actualizar estado pedido

### Rutas Admin (Solo Admin)
- `GET /api/admin/users` - Listar usuarios
- `POST /api/admin/users` - Crear usuario
- `PUT /api/admin/users/{id}` - Actualizar usuario
- `DELETE /api/admin/users/{id}` - Eliminar usuario
- `PUT /api/admin/users/{id}/role` - Cambiar rol usuario
- `POST /api/admin/products` - Crear producto
- `PUT /api/admin/products/{id}` - Actualizar producto
- `DELETE /api/admin/products/{id}` - Eliminar producto
- `POST /api/admin/categories` - Crear categoría
- `PUT /api/admin/categories/{id}` - Actualizar categoría
- `DELETE /api/admin/categories/{id}` - Eliminar categoría

---

## 🔧 CONFIGURACIÓN JWT EN BACKEND (.NET)

### appsettings.json

```json
{
  "JwtSettings": {
    "SecretKey": "tu_clave_secreta_muy_larga_y_segura_minimo_32_caracteres",
    "Issuer": "BoskoAPI",
    "Audience": "BoskoFrontend",
    "ExpirationMinutes": 1440
  },
  "GoogleAuth": {
    "ClientId": "tu_google_client_id.apps.googleusercontent.com"
  }
}
```

### Ejemplo de generación de JWT en C#

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
        new Claim("role", user.Role.ToString()), // "Admin", "Employee", "Customer"
        new Claim("provider", user.Provider ?? "Local"),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    var token = new JwtSecurityToken(
        issuer: _configuration["JwtSettings:Issuer"],
        audience: _configuration["JwtSettings:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(
            int.Parse(_configuration["JwtSettings:ExpirationMinutes"])
        ),
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

### Configuración en Program.cs

```csharp
// Agregar autenticación JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"])
            ),
            ClockSkew = TimeSpan.Zero
        };
    });

// Agregar autorización con políticas
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("EmployeeAccess", policy => 
        policy.RequireRole("Admin", "Employee"));
    options.AddPolicy("CustomerAccess", policy => 
        policy.RequireRole("Admin", "Employee", "Customer"));
});

// En el pipeline
app.UseAuthentication();
app.UseAuthorization();
```

### Uso en Controllers

```csharp
[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin,Employee")] // Solo Admin y Employee
public class AdminController : ControllerBase
{
    [HttpGet("stats")]
    public IActionResult GetStats()
    {
        // Ambos Admin y Employee pueden acceder
        return Ok(stats);
    }

    [HttpPost("products")]
    [Authorize(Roles = "Admin")] // Solo Admin
    public IActionResult CreateProduct([FromBody] ProductDto dto)
    {
        // Solo Admin puede crear productos
        return Ok(product);
    }

    [HttpGet("current-user-role")]
    public IActionResult GetCurrentUserRole()
    {
        var userRole = User.FindFirst("role")?.Value;
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        return Ok(new { userId, role = userRole });
    }
}
```

---

## 🔐 VALIDACIONES DE SEGURIDAD

### 1. Contraseñas

**Requisitos mínimos:**
- ✅ Mínimo 6 caracteres (frontend valida)
- ✅ Se recomienda: 8+ caracteres, mayúsculas, minúsculas, números
- ✅ Hash con BCrypt o PBKDF2 (nunca guardar en texto plano)

**Ejemplo en C#:**
```csharp
using BCrypt.Net;

// Registrar usuario
string hashedPassword = BCrypt.HashPassword(dto.Password);

// Login
bool isValid = BCrypt.Verify(loginDto.Password, user.PasswordHash);
```

### 2. Validación de Email

**Requisitos:**
- ✅ Formato email válido
- ✅ Email único en la base de datos
- ✅ Convertir a minúsculas antes de guardar

### 3. Google OAuth

**Pasos de validación:**
1. Recibir `idToken` de Google desde frontend
2. Verificar token con Google API:
   ```csharp
   var payload = await GoogleJsonWebSignature.ValidateAsync(googleToken);
   ```
3. Extraer email y nombre del payload
4. Buscar/crear usuario en BD
5. Generar JWT propio del sistema

**NuGet Package:**
```xml
<PackageReference Include="Google.Apis.Auth" Version="1.68.0" />
```

---

## 📊 MODELO DE USUARIO EN BD

### Tabla Users

```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NULL, -- Null para usuarios de Google
    Phone NVARCHAR(20) NULL,
    Role NVARCHAR(20) NOT NULL DEFAULT 'Customer', -- 'Admin', 'Employee', 'Customer'
    Provider NVARCHAR(20) NOT NULL DEFAULT 'Local', -- 'Local', 'Google'
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsActive BIT NOT NULL DEFAULT 1,
    
    CONSTRAINT CK_Users_Role CHECK (Role IN ('Admin', 'Employee', 'Customer')),
    CONSTRAINT CK_Users_Provider CHECK (Provider IN ('Local', 'Google'))
);

CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_Role ON Users(Role);
```

### Datos Iniciales (Seed)

```sql
-- Usuario Admin por defecto
INSERT INTO Users (Name, Email, PasswordHash, Role, Provider) VALUES 
('Admin Bosko', 'admin@bosko.com', '$2a$11$...', 'Admin', 'Local');

-- Usuario Employee de prueba
INSERT INTO Users (Name, Email, PasswordHash, Role, Provider) VALUES 
('Empleado Test', 'employee@bosko.com', '$2a$11$...', 'Employee', 'Local');

-- Usuario Customer de prueba
INSERT INTO Users (Name, Email, PasswordHash, Role, Provider) VALUES 
('Cliente Test', 'customer@bosko.com', '$2a$11$...', 'Customer', 'Local');
```

**Contraseñas de prueba (todas):** `Bosko123!`

---

## 🧪 TESTING DEL SISTEMA

### Casos de Prueba

#### 1. Login Normal
```bash
POST https://localhost:5006/api/auth/login
Content-Type: application/json

{
  "email": "admin@bosko.com",
  "password": "Bosko123!"
}
```

**Resultado esperado:**
- Status: 200 OK
- Token JWT válido
- Usuario con role "Admin"

#### 2. Login con credenciales incorrectas
```bash
POST https://localhost:5006/api/auth/login
Content-Type: application/json

{
  "email": "admin@bosko.com",
  "password": "IncorrectPassword"
}
```

**Resultado esperado:**
- Status: 401 Unauthorized
- Mensaje: "Email o contraseña incorrectos"

#### 3. Registro de usuario nuevo
```bash
POST https://localhost:5006/api/auth/register
Content-Type: application/json

{
  "name": "Usuario Nuevo",
  "email": "nuevo@test.com",
  "password": "NuevaPass123!"
}
```

**Resultado esperado:**
- Status: 201 Created
- Token JWT válido
- Usuario con role "Customer"

#### 4. Acceso a ruta protegida sin token
```bash
GET https://localhost:5006/api/admin/stats
```

**Resultado esperado:**
- Status: 401 Unauthorized

#### 5. Acceso a ruta Admin con rol Customer
```bash
GET https://localhost:5006/api/admin/products
Authorization: Bearer {customer_token}
```

**Resultado esperado:**
- Status: 403 Forbidden
- Mensaje: "No tienes permisos..."

#### 6. Decodificar token JWT
```bash
# Usar https://jwt.io para verificar el contenido del token
# Pegar token generado y verificar claims:
# - sub (userId)
# - name
# - email
# - role
# - exp (no expirado)
```

---

## 🚀 CHECKLIST DE IMPLEMENTACIÓN

### Backend Debe Completar:

- [ ] **1. Configurar JWT en appsettings.json**
  - Clave secreta (mínimo 32 caracteres)
  - Issuer y Audience
  - Tiempo de expiración

- [ ] **2. Instalar paquetes NuGet necesarios**
  ```bash
  dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
  dotnet add package BCrypt.Net-Next
  dotnet add package Google.Apis.Auth
  ```

- [ ] **3. Crear modelo User en base de datos**
  - Campos: Id, Name, Email, PasswordHash, Phone, Role, Provider, CreatedAt, UpdatedAt, IsActive
  - Índices en Email y Role
  - Constraint para Role y Provider

- [ ] **4. Implementar endpoints de autenticación**
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `POST /api/auth/google-login`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`

- [ ] **5. Implementar generación de JWT**
  - Incluir todos los claims necesarios
  - Firma con algoritmo HS256
  - Expiración configurable

- [ ] **6. Configurar middleware de autenticación**
  - `UseAuthentication()` antes de `UseAuthorization()`
  - Validación de tokens en cada request

- [ ] **7. Agregar atributos [Authorize] en controllers**
  - Rutas públicas sin atributo
  - Rutas Customer con `[Authorize]`
  - Rutas Employee con `[Authorize(Roles = "Admin,Employee")]`
  - Rutas Admin con `[Authorize(Roles = "Admin")]`

- [ ] **8. Implementar verificación de Google OAuth**
  - Validar idToken con Google API
  - Extraer email y nombre
  - Crear usuario si no existe

- [ ] **9. Implementar forgot/reset password**
  - Generar token temporal único
  - Guardar en tabla PasswordResets (Email, Token, ExpiresAt)
  - Enviar email con link
  - Validar y actualizar contraseña

- [ ] **10. Crear usuarios de prueba (Seed)**
  - 1 Admin
  - 1 Employee
  - 1 Customer
  - Todos con contraseña `Bosko123!`

- [ ] **11. Testing completo**
  - Probar cada endpoint con Postman/Swagger
  - Verificar tokens con jwt.io
  - Probar casos de error (401, 403)
  - Verificar CORS para localhost:4300

---

## 📞 CONTACTO Y SOPORTE

**Frontend está listo y esperando:**
- ✅ Todos los componentes implementados
- ✅ Guards y directivas funcionando
- ✅ Manejo de errores configurado
- ✅ UI responsive con roles

**Backend debe implementar:**
- ⏳ Endpoints de autenticación
- ⏳ Sistema JWT
- ⏳ Validación de roles
- ⏳ Google OAuth

**Cuando Backend esté listo:**
1. Confirmar que el servidor corre en `https://localhost:5006`
2. Probar login con usuarios seed
3. Verificar estructura de JWT
4. Confirmar CORS configurado
5. Frontend hará pruebas de integración

---

## 🎨 COMPORTAMIENTO EN FRONTEND

### Redirección Automática Después del Login

**Admin:**
```
Login exitoso → Redirige a /admin (Dashboard)
```

**Employee:**
```
Login exitoso → Redirige a /admin (Dashboard)
```

**Customer:**
```
Login exitoso → Redirige a / (Home)
```

**Con Return URL:**
```
Login desde /profile → Después del login → /profile
```

### Visibilidad de Elementos

**Panel Admin en Header:**
- ❌ No logueado: No se ve
- ❌ Customer: No se ve
- ✅ Employee: Se ve
- ✅ Admin: Se ve

**Botones en Admin Panel:**
```html
<!-- Todos ven Dashboard y Orders -->
<button>Dashboard</button>
<button>Pedidos</button>

<!-- Solo Admin ve estos -->
<button *appHasRole="'Admin'">Productos</button>
<button *appHasRole="'Admin'">Categorías</button>
<button *appHasRole="'Admin'">Usuarios</button>
```

### Protección de Rutas

```typescript
// /admin → Admin y Employee
// /admin/products → Solo Admin
// /admin/orders → Admin y Employee
// /profile → Cualquier usuario autenticado
// /login → Público
```

---

## ✅ CONCLUSIÓN

Con esta documentación, el backend tiene toda la información necesaria para implementar un sistema de autenticación compatible con el frontend de Bosko.

**Siguientes pasos:**
1. Backend lee y confirma comprensión
2. Backend implementa según especificaciones
3. Backend crea usuarios de prueba
4. Backend confirma endpoints listos
5. Frontend hace testing de integración
6. Ajustes si es necesario
7. Deploy a producción

**¿Preguntas? ¿Dudas? ¿Cambios necesarios?**

Frontend está disponible para aclaraciones. 🚀
