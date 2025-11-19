# 🔵 User Profile - Backend Endpoints & Database Specification

**Fecha:** 19 de Noviembre 2025  
**Prioridad:** 🔥 ALTA - Sistema de perfil de usuario completo  
**Módulo:** User Profile Management  
**Frontend Service:** `user-profile.service.ts`

---

## 📋 Descripción General

Sistema completo de gestión de perfil de usuario que incluye:
- ✅ Actualización de información personal (nombre, email, teléfono)
- ✅ Cambio de contraseña
- ✅ Gestión de preferencias (notificaciones, newsletter, idioma)
- ✅ Upload de avatar/foto de perfil
- ✅ Gestión de direcciones de envío
- ✅ Visualización de historial de pedidos
- ✅ Soft delete de cuenta

---

## 🎯 Endpoints Requeridos

### 1. **GET /api/users/me** - Obtener Perfil del Usuario

**Descripción:** Obtiene la información completa del usuario autenticado.

**Autenticación:** ✅ Requerida (JWT Bearer Token)

**Request:**
```http
GET /api/users/me
Authorization: Bearer {JWT_TOKEN}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Perfil del usuario obtenido correctamente",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+34 600 000 000",
    "role": "Customer",
    "provider": "Local",
    "isActive": true,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-11-19T14:00:00Z",
    "totalOrders": 5,
    "totalSpent": 450.75,
    "avatarUrl": "https://localhost:5006/uploads/avatars/user-1.jpg",
    "preferences": {
      "notifications": true,
      "newsletter": true,
      "language": "es"
    }
  }
}
```

---

### 2. **PUT /api/users/me** - Actualizar Perfil del Usuario

**Descripción:** Actualiza información personal del usuario (nombre, email, teléfono).

**Autenticación:** ✅ Requerida (JWT Bearer Token)

**Request:**
```http
PUT /api/users/me
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "name": "Juan Carlos Pérez",
  "email": "juan.perez@example.com",
  "phone": "+34 611 222 333"
}
```

**Validaciones:**
- `name`: Required, MinLength(2), MaxLength(100)
- `email`: Required, EmailAddress format, Unique (no otro usuario puede tener el mismo email)
- `phone`: Optional, formato válido de teléfono

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Perfil actualizado correctamente",
  "data": {
    "id": 1,
    "name": "Juan Carlos Pérez",
    "email": "juan.perez@example.com",
    "phone": "+34 611 222 333",
    "role": "Customer",
    "provider": "Local",
    "isActive": true,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-11-19T15:30:00Z"
  }
}
```

**Error Responses:**
```json
// 400 Bad Request - Email ya existe
{
  "success": false,
  "message": "El correo electrónico ya está registrado"
}

// 400 Bad Request - Validación fallida
{
  "success": false,
  "message": "Datos inválidos",
  "errors": {
    "Name": ["El nombre es requerido", "El nombre debe tener al menos 2 caracteres"],
    "Email": ["El correo electrónico no es válido"]
  }
}
```

---

### 3. **PUT /api/users/me/password** - Cambiar Contraseña

**Descripción:** Permite al usuario cambiar su contraseña proporcionando la actual.

**Autenticación:** ✅ Requerida (JWT Bearer Token)

**Request:**
```http
PUT /api/users/me/password
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Validaciones:**
- `currentPassword`: Required, debe coincidir con la contraseña actual hasheada en BD
- `newPassword`: Required, MinLength(6), debe ser diferente de la actual

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Contraseña cambiada correctamente",
  "data": true
}
```

**Error Responses:**
```json
// 400 Bad Request - Contraseña actual incorrecta
{
  "success": false,
  "message": "La contraseña actual es incorrecta"
}

// 400 Bad Request - Nueva contraseña igual a la actual
{
  "success": false,
  "message": "La nueva contraseña debe ser diferente a la actual"
}

// 403 Forbidden - Usuario con Google Auth no puede cambiar contraseña
{
  "success": false,
  "message": "Los usuarios de Google no pueden cambiar la contraseña desde aquí"
}
```

---

### 4. **PUT /api/users/me/preferences** - Actualizar Preferencias

**Descripción:** Actualiza las preferencias del usuario (notificaciones, newsletter, idioma).

**Autenticación:** ✅ Requerida (JWT Bearer Token)

**Request:**
```http
PUT /api/users/me/preferences
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "notifications": true,
  "newsletter": false,
  "language": "es"
}
```

**Validaciones:**
- `notifications`: boolean (true/false)
- `newsletter`: boolean (true/false)
- `language`: Optional, valores permitidos: "es", "en"

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Preferencias actualizadas correctamente",
  "data": true
}
```

---

### 5. **POST /api/users/me/avatar** - Subir Avatar del Usuario

**Descripción:** Permite subir una imagen de perfil/avatar.

**Autenticación:** ✅ Requerida (JWT Bearer Token)

**Request:**
```http
POST /api/users/me/avatar
Authorization: Bearer {JWT_TOKEN}
Content-Type: multipart/form-data

avatar: [FILE] (image/jpeg, image/png, image/webp)
```

**Validaciones:**
- Tipo de archivo: image/jpeg, image/png, image/webp
- Tamaño máximo: 5 MB
- Dimensiones recomendadas: 400x400px (se redimensiona automáticamente)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Avatar actualizado correctamente",
  "data": "https://localhost:5006/uploads/avatars/user-1-20251119-150530.jpg"
}
```

**Error Responses:**
```json
// 400 Bad Request - Archivo muy grande
{
  "success": false,
  "message": "El archivo es demasiado grande. Máximo 5 MB"
}

// 400 Bad Request - Tipo de archivo no permitido
{
  "success": false,
  "message": "Tipo de archivo no permitido. Solo JPEG, PNG o WEBP"
}
```

---

### 6. **DELETE /api/users/me** - Eliminar Cuenta (Soft Delete)

**Descripción:** Desactiva la cuenta del usuario (soft delete). No elimina físicamente los datos.

**Autenticación:** ✅ Requerida (JWT Bearer Token)

**Request:**
```http
DELETE /api/users/me
Authorization: Bearer {JWT_TOKEN}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Cuenta desactivada correctamente. Puedes reactivarla contactando soporte",
  "data": true
}
```

**Nota:** El usuario se marca como `IsActive = false` en la BD. Sus pedidos y direcciones se mantienen.

---

## 📦 DTOs Necesarios (C# Classes)

### `UserProfileDto.cs`
```csharp
namespace BoskoAPI.DTOs
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public string Role { get; set; } // "Admin", "Employee", "Customer"
        public string? Provider { get; set; } // "Local", "Google"
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
        public string? AvatarUrl { get; set; }
        public UserPreferencesDto? Preferences { get; set; }
    }

    public class UserPreferencesDto
    {
        public bool Notifications { get; set; }
        public bool Newsletter { get; set; }
        public string? Language { get; set; }
    }
}
```

### `UpdateProfileDto.cs`
```csharp
using System.ComponentModel.DataAnnotations;

namespace BoskoAPI.DTOs
{
    public class UpdateProfileDto
    {
        [Required(ErrorMessage = "El nombre es requerido")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 100 caracteres")]
        public string Name { get; set; }

        [Required(ErrorMessage = "El correo electrónico es requerido")]
        [EmailAddress(ErrorMessage = "El correo electrónico no es válido")]
        public string Email { get; set; }

        [Phone(ErrorMessage = "El teléfono no es válido")]
        public string? Phone { get; set; }
    }
}
```

### `ChangePasswordDto.cs`
```csharp
using System.ComponentModel.DataAnnotations;

namespace BoskoAPI.DTOs
{
    public class ChangePasswordDto
    {
        [Required(ErrorMessage = "La contraseña actual es requerida")]
        public string CurrentPassword { get; set; }

        [Required(ErrorMessage = "La nueva contraseña es requerida")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
        public string NewPassword { get; set; }
    }
}
```

### `UpdatePreferencesDto.cs`
```csharp
namespace BoskoAPI.DTOs
{
    public class UpdatePreferencesDto
    {
        public bool Notifications { get; set; }
        public bool Newsletter { get; set; }
        public string? Language { get; set; } // "es", "en"
    }
}
```

---

## 🗄️ Scripts SQL - Database Schema

### Tabla `UserPreferences` (Nueva tabla)

```sql
-- ==================================
-- SCRIPT 1: Crear tabla UserPreferences
-- ==================================

CREATE TABLE UserPreferences (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Notifications BIT NOT NULL DEFAULT 1,
    Newsletter BIT NOT NULL DEFAULT 1,
    Language NVARCHAR(10) NULL DEFAULT 'es',
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    
    CONSTRAINT FK_UserPreferences_Users FOREIGN KEY (UserId) 
        REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_UserPreferences_UserId UNIQUE (UserId)
);

-- Índice para búsquedas por UserId
CREATE INDEX IX_UserPreferences_UserId ON UserPreferences(UserId);

PRINT '✅ Tabla UserPreferences creada correctamente';
GO
```

### Modificar Tabla `Users` para Avatar

```sql
-- ==================================
-- SCRIPT 2: Agregar columna AvatarUrl a Users
-- ==================================

-- Verificar si la columna ya existe
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'AvatarUrl')
BEGIN
    ALTER TABLE Users
    ADD AvatarUrl NVARCHAR(500) NULL;
    
    PRINT '✅ Columna AvatarUrl agregada a Users';
END
ELSE
BEGIN
    PRINT '⚠️ La columna AvatarUrl ya existe en Users';
END
GO
```

### Insertar Preferencias por Defecto para Usuarios Existentes

```sql
-- ==================================
-- SCRIPT 3: Crear preferencias por defecto para usuarios existentes
-- ==================================

INSERT INTO UserPreferences (UserId, Notifications, Newsletter, Language, CreatedAt)
SELECT 
    u.Id,
    1, -- Notifications habilitadas por defecto
    1, -- Newsletter habilitado por defecto
    'es', -- Idioma español por defecto
    GETUTCDATE()
FROM Users u
WHERE NOT EXISTS (
    SELECT 1 FROM UserPreferences up WHERE up.UserId = u.Id
);

PRINT '✅ Preferencias por defecto creadas para usuarios existentes';
GO
```

### Views Útiles para el Backend

```sql
-- ==================================
-- SCRIPT 4: Vista completa de usuario con preferencias
-- ==================================

CREATE OR ALTER VIEW vw_UserProfileComplete AS
SELECT 
    u.Id,
    u.FullName AS Name,
    u.Email,
    u.PhoneNumber AS Phone,
    u.Role,
    u.Provider,
    u.IsActive,
    u.AvatarUrl,
    u.CreatedAt,
    u.UpdatedAt,
    
    -- Contar pedidos del usuario
    (SELECT COUNT(*) FROM Orders o WHERE o.CustomerId = u.Id) AS TotalOrders,
    
    -- Sumar total gastado
    (SELECT ISNULL(SUM(o.Total), 0) FROM Orders o WHERE o.CustomerId = u.Id) AS TotalSpent,
    
    -- Preferencias
    up.Notifications,
    up.Newsletter,
    up.Language
FROM Users u
LEFT JOIN UserPreferences up ON u.Id = up.UserId;

PRINT '✅ Vista vw_UserProfileComplete creada correctamente';
GO
```

### Stored Procedures (Opcional pero Recomendado)

```sql
-- ==================================
-- SCRIPT 5: SP para obtener perfil completo
-- ==================================

CREATE OR ALTER PROCEDURE sp_GetUserProfile
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Name,
        Email,
        Phone,
        Role,
        Provider,
        IsActive,
        AvatarUrl,
        CreatedAt,
        UpdatedAt,
        TotalOrders,
        TotalSpent,
        Notifications,
        Newsletter,
        Language
    FROM vw_UserProfileComplete
    WHERE Id = @UserId AND IsActive = 1;
END
GO

PRINT '✅ Stored Procedure sp_GetUserProfile creado correctamente';
GO
```

```sql
-- ==================================
-- SCRIPT 6: SP para actualizar perfil
-- ==================================

CREATE OR ALTER PROCEDURE sp_UpdateUserProfile
    @UserId INT,
    @Name NVARCHAR(100),
    @Email NVARCHAR(255),
    @Phone NVARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verificar que el email no esté en uso por otro usuario
        IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email AND Id != @UserId)
        BEGIN
            THROW 50001, 'El correo electrónico ya está registrado', 1;
        END
        
        -- Actualizar usuario
        UPDATE Users
        SET 
            FullName = @Name,
            Email = @Email,
            PhoneNumber = @Phone,
            UpdatedAt = GETUTCDATE()
        WHERE Id = @UserId;
        
        COMMIT TRANSACTION;
        
        -- Devolver usuario actualizado
        SELECT 
            Id,
            FullName AS Name,
            Email,
            PhoneNumber AS Phone,
            Role,
            Provider,
            IsActive,
            AvatarUrl,
            CreatedAt,
            UpdatedAt
        FROM Users
        WHERE Id = @UserId;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        THROW;
    END CATCH
END
GO

PRINT '✅ Stored Procedure sp_UpdateUserProfile creado correctamente';
GO
```

```sql
-- ==================================
-- SCRIPT 7: SP para cambiar contraseña
-- ==================================

CREATE OR ALTER PROCEDURE sp_ChangeUserPassword
    @UserId INT,
    @CurrentPasswordHash NVARCHAR(500),
    @NewPasswordHash NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Verificar que la contraseña actual sea correcta
        IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = @UserId AND PasswordHash = @CurrentPasswordHash)
        BEGIN
            THROW 50002, 'La contraseña actual es incorrecta', 1;
        END
        
        -- Verificar que el usuario sea de tipo Local (no Google)
        IF EXISTS (SELECT 1 FROM Users WHERE Id = @UserId AND Provider = 'Google')
        BEGIN
            THROW 50003, 'Los usuarios de Google no pueden cambiar la contraseña', 1;
        END
        
        -- Actualizar contraseña
        UPDATE Users
        SET 
            PasswordHash = @NewPasswordHash,
            UpdatedAt = GETUTCDATE()
        WHERE Id = @UserId;
        
        SELECT 1 AS Success;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO

PRINT '✅ Stored Procedure sp_ChangeUserPassword creado correctamente';
GO
```

```sql
-- ==================================
-- SCRIPT 8: SP para actualizar preferencias
-- ==================================

CREATE OR ALTER PROCEDURE sp_UpdateUserPreferences
    @UserId INT,
    @Notifications BIT,
    @Newsletter BIT,
    @Language NVARCHAR(10) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Actualizar o insertar preferencias
    IF EXISTS (SELECT 1 FROM UserPreferences WHERE UserId = @UserId)
    BEGIN
        UPDATE UserPreferences
        SET 
            Notifications = @Notifications,
            Newsletter = @Newsletter,
            Language = ISNULL(@Language, Language),
            UpdatedAt = GETUTCDATE()
        WHERE UserId = @UserId;
    END
    ELSE
    BEGIN
        INSERT INTO UserPreferences (UserId, Notifications, Newsletter, Language, CreatedAt)
        VALUES (@UserId, @Notifications, @Newsletter, ISNULL(@Language, 'es'), GETUTCDATE());
    END
    
    SELECT 1 AS Success;
END
GO

PRINT '✅ Stored Procedure sp_UpdateUserPreferences creado correctamente';
GO
```

---

## 🔧 Implementación Backend (C#)

### `UsersController.cs`

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BoskoAPI.Data;
using BoskoAPI.DTOs;
using BoskoAPI.Models;
using System.Security.Claims;

namespace BoskoAPI.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize] // Todos los endpoints requieren autenticación
    public class UsersController : ControllerBase
    {
        private the _context;
        private readonly ILogger<UsersController> _logger;
        private readonly IWebHostEnvironment _env;

        public UsersController(
            ApplicationDbContext context, 
            ILogger<UsersController> logger,
            IWebHostEnvironment env)
        {
            _context = context;
            _logger = logger;
            _env = env;
        }

        /// <summary>
        /// Get current user's profile
        /// GET /api/users/me
        /// </summary>
        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                
                var user = await _context.Users
                    .Include(u => u.Preferences)
                    .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);

                if (user == null)
                {
                    return NotFound(new { success = false, message = "Usuario no encontrado" });
                }

                // Calcular estadísticas
                var totalOrders = await _context.Orders.CountAsync(o => o.CustomerId == userId);
                var totalSpent = await _context.Orders
                    .Where(o => o.CustomerId == userId)
                    .SumAsync(o => (decimal?)o.Total) ?? 0;

                var profileDto = new UserProfileDto
                {
                    Id = user.Id,
                    Name = user.FullName,
                    Email = user.Email,
                    Phone = user.PhoneNumber,
                    Role = user.Role,
                    Provider = user.Provider,
                    IsActive = user.IsActive,
                    AvatarUrl = user.AvatarUrl,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    TotalOrders = totalOrders,
                    TotalSpent = totalSpent,
                    Preferences = user.Preferences != null ? new UserPreferencesDto
                    {
                        Notifications = user.Preferences.Notifications,
                        Newsletter = user.Preferences.Newsletter,
                        Language = user.Preferences.Language
                    } : null
                };

                return Ok(new 
                { 
                    success = true, 
                    message = "Perfil obtenido correctamente", 
                    data = profileDto 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user profile");
                return StatusCode(500, new 
                { 
                    success = false, 
                    message = "Error interno del servidor" 
                });
            }
        }

        /// <summary>
        /// Update current user's profile
        /// PUT /api/users/me
        /// </summary>
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new 
                { 
                    success = false, 
                    message = "Datos inválidos", 
                    errors = ModelState 
                });
            }

            try
            {
                var userId = GetCurrentUserId();
                
                var user = await _context.Users.FindAsync(userId);
                if (user == null || !user.IsActive)
                {
                    return NotFound(new { success = false, message = "Usuario no encontrado" });
                }

                // Verificar email único
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email && u.Id != userId))
                {
                    return BadRequest(new 
                    { 
                        success = false, 
                        message = "El correo electrónico ya está registrado" 
                    });
                }

                // Actualizar datos
                user.FullName = dto.Name;
                user.Email = dto.Email;
                user.PhoneNumber = dto.Phone;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var updatedUser = new 
                {
                    id = user.Id,
                    name = user.FullName,
                    email = user.Email,
                    phone = user.PhoneNumber,
                    role = user.Role,
                    provider = user.Provider,
                    isActive = user.IsActive,
                    avatarUrl = user.AvatarUrl,
                    createdAt = user.CreatedAt,
                    updatedAt = user.UpdatedAt
                };

                return Ok(new 
                { 
                    success = true, 
                    message = "Perfil actualizado correctamente", 
                    data = updatedUser 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user profile");
                return StatusCode(500, new 
                { 
                    success = false, 
                    message = "Error interno del servidor" 
                });
            }
        }

        /// <summary>
        /// Change user password
        /// PUT /api/users/me/password
        /// </summary>
        [HttpPut("me/password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new 
                { 
                    success = false, 
                    message = "Datos inválidos", 
                    errors = ModelState 
                });
            }

            try
            {
                var userId = GetCurrentUserId();
                
                var user = await _context.Users.FindAsync(userId);
                if (user == null || !user.IsActive)
                {
                    return NotFound(new { success = false, message = "Usuario no encontrado" });
                }

                // Verificar que no sea usuario de Google
                if (user.Provider == "Google")
                {
                    return Forbid("Los usuarios de Google no pueden cambiar la contraseña");
                }

                // Verificar contraseña actual (usar BCrypt o tu método de hashing)
                if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                {
                    return BadRequest(new 
                    { 
                        success = false, 
                        message = "La contraseña actual es incorrecta" 
                    });
                }

                // Verificar que la nueva sea diferente
                if (BCrypt.Net.BCrypt.Verify(dto.NewPassword, user.PasswordHash))
                {
                    return BadRequest(new 
                    { 
                        success = false, 
                        message = "La nueva contraseña debe ser diferente a la actual" 
                    });
                }

                // Hash nueva contraseña
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    success = true, 
                    message = "Contraseña cambiada correctamente", 
                    data = true 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password");
                return StatusCode(500, new 
                { 
                    success = false, 
                    message = "Error interno del servidor" 
                });
            }
        }

        /// <summary>
        /// Update user preferences
        /// PUT /api/users/me/preferences
        /// </summary>
        [HttpPut("me/preferences")]
        public async Task<IActionResult> UpdatePreferences([FromBody] UpdatePreferencesDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                
                var preferences = await _context.UserPreferences
                    .FirstOrDefaultAsync(p => p.UserId == userId);

                if (preferences == null)
                {
                    // Crear nuevas preferencias
                    preferences = new UserPreferences
                    {
                        UserId = userId,
                        Notifications = dto.Notifications,
                        Newsletter = dto.Newsletter,
                        Language = dto.Language ?? "es",
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.UserPreferences.Add(preferences);
                }
                else
                {
                    // Actualizar existentes
                    preferences.Notifications = dto.Notifications;
                    preferences.Newsletter = dto.Newsletter;
                    if (!string.IsNullOrEmpty(dto.Language))
                    {
                        preferences.Language = dto.Language;
                    }
                    preferences.UpdatedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    success = true, 
                    message = "Preferencias actualizadas correctamente", 
                    data = true 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating preferences");
                return StatusCode(500, new 
                { 
                    success = false, 
                    message = "Error interno del servidor" 
                });
            }
        }

        /// <summary>
        /// Upload user avatar
        /// POST /api/users/me/avatar
        /// </summary>
        [HttpPost("me/avatar")]
        public async Task<IActionResult> UploadAvatar(IFormFile avatar)
        {
            if (avatar == null || avatar.Length == 0)
            {
                return BadRequest(new 
                { 
                    success = false, 
                    message = "No se proporcionó ningún archivo" 
                });
            }

            // Validar tipo de archivo
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
            if (!allowedTypes.Contains(avatar.ContentType.ToLower()))
            {
                return BadRequest(new 
                { 
                    success = false, 
                    message = "Tipo de archivo no permitido. Solo JPEG, PNG o WEBP" 
                });
            }

            // Validar tamaño (5 MB máximo)
            if (avatar.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new 
                { 
                    success = false, 
                    message = "El archivo es demasiado grande. Máximo 5 MB" 
                });
            }

            try
            {
                var userId = GetCurrentUserId();
                
                // Crear directorio si no existe
                var uploadsDir = Path.Combine(_env.WebRootPath, "uploads", "avatars");
                Directory.CreateDirectory(uploadsDir);

                // Generar nombre único
                var fileName = $"user-{userId}-{DateTime.UtcNow:yyyyMMdd-HHmmss}{Path.GetExtension(avatar.FileName)}";
                var filePath = Path.Combine(uploadsDir, fileName);

                // Guardar archivo
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await avatar.CopyToAsync(stream);
                }

                // Actualizar usuario
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    // Eliminar avatar anterior si existe
                    if (!string.IsNullOrEmpty(user.AvatarUrl))
                    {
                        var oldPath = Path.Combine(_env.WebRootPath, user.AvatarUrl.TrimStart('/'));
                        if (System.IO.File.Exists(oldPath))
                        {
                            System.IO.File.Delete(oldPath);
                        }
                    }

                    user.AvatarUrl = $"/uploads/avatars/{fileName}";
                    user.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }

                var avatarUrl = $"{Request.Scheme}://{Request.Host}/uploads/avatars/{fileName}";

                return Ok(new 
                { 
                    success = true, 
                    message = "Avatar actualizado correctamente", 
                    data = avatarUrl 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading avatar");
                return StatusCode(500, new 
                { 
                    success = false, 
                    message = "Error interno del servidor" 
                });
            }
        }

        /// <summary>
        /// Soft delete user account
        /// DELETE /api/users/me
        /// </summary>
        [HttpDelete("me")]
        public async Task<IActionResult> DeleteMyAccount()
        {
            try
            {
                var userId = GetCurrentUserId();
                
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { success = false, message = "Usuario no encontrado" });
                }

                // Soft delete: marcar como inactivo
                user.IsActive = false;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    success = true, 
                    message = "Cuenta desactivada correctamente. Puedes reactivarla contactando soporte", 
                    data = true 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user account");
                return StatusCode(500, new 
                { 
                    success = false, 
                    message = "Error interno del servidor" 
                });
            }
        }

        // Helper method to get current user ID from JWT
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? User.FindFirst("nameid")?.Value
                           ?? User.FindFirst("sub")?.Value;

            return int.Parse(userIdClaim);
        }
    }
}
```

---

## 🗃️ Modelos Entity Framework

### `User.cs` (Actualizado)
```csharp
namespace BoskoAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string? PhoneNumber { get; set; }
        public string Role { get; set; } // "Admin", "Employee", "Customer"
        public string Provider { get; set; } = "Local"; // "Local", "Google"
        public bool IsActive { get; set; } = true;
        public string? AvatarUrl { get; set; } // NUEVA COLUMNA
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public UserPreferences? Preferences { get; set; }
        public ICollection<Order> Orders { get; set; }
        public ICollection<Address> Addresses { get; set; }
    }
}
```

### `UserPreferences.cs` (Nuevo modelo)
```csharp
namespace BoskoAPI.Models
{
    public class UserPreferences
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public bool Notifications { get; set; } = true;
        public bool Newsletter { get; set; } = true;
        public string Language { get; set; } = "es"; // "es", "en"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation property
        public User User { get; set; }
    }
}
```

### `ApplicationDbContext.cs` (Actualizado)
```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<UserPreferences> UserPreferences { get; set; }
    // ... otros DbSets

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración UserPreferences
        modelBuilder.Entity<UserPreferences>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(p => p.User)
                  .WithOne(u => u.Preferences)
                  .HasForeignKey<UserPreferences>(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(p => p.UserId).IsUnique();
        });

        // ... otras configuraciones
    }
}
```

---

## ✅ Checklist de Implementación

### Backend:
- [ ] Crear tabla `UserPreferences` en SQL Server
- [ ] Agregar columna `AvatarUrl` a tabla `Users`
- [ ] Crear DTOs: `UserProfileDto`, `UpdateProfileDto`, `ChangePasswordDto`, `UpdatePreferencesDto`
- [ ] Crear modelo `UserPreferences.cs`
- [ ] Actualizar modelo `User.cs` con propiedad `AvatarUrl` y `Preferences`
- [ ] Actualizar `ApplicationDbContext.cs` con configuración de `UserPreferences`
- [ ] Crear `UsersController.cs` con los 6 endpoints
- [ ] Configurar BCrypt para hashing de contraseñas
- [ ] Configurar directorio `/uploads/avatars` con permisos de escritura
- [ ] Configurar servicio de archivos estáticos en `Program.cs`
- [ ] Probar todos los endpoints con Postman/Thunder Client
- [ ] Generar migración de Entity Framework (`dotnet ef migrations add AddUserPreferences`)
- [ ] Aplicar migración (`dotnet ef database update`)

### Frontend:
- [x] Crear `UserProfileService` con métodos de actualización ✅
- [x] Actualizar `ProfileComponent` con tabs (Personal, Orders, Addresses, Security, Preferences) ✅
- [x] Implementar form de actualización de perfil ✅
- [x] Implementar form de cambio de contraseña ✅
- [x] Implementar gestión de direcciones ✅
- [x] Implementar visualización mejorada de pedidos ✅
- [ ] Implementar upload de avatar (input file + preview)
- [ ] Aplicar diseño Bosko con gradientes azules
- [ ] Testing completo de funcionalidades

### Database:
- [ ] Ejecutar Script 1: Crear tabla `UserPreferences`
- [ ] Ejecutar Script 2: Agregar columna `AvatarUrl`
- [ ] Ejecutar Script 3: Insertar preferencias por defecto
- [ ] Ejecutar Script 4: Crear vista `vw_UserProfileComplete`
- [ ] Ejecutar Scripts 5-8: Crear stored procedures (opcional)
- [ ] Verificar índices y constraints
- [ ] Backup de base de datos antes de cambios

---

## 🧪 Testing con Postman/Thunder Client

### Test 1: GET /api/users/me
```http
GET https://localhost:5006/api/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Test 2: PUT /api/users/me
```http
PUT https://localhost:5006/api/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Juan Carlos Pérez",
  "email": "juan.perez@example.com",
  "phone": "+34 611 222 333"
}
```

### Test 3: PUT /api/users/me/password
```http
PUT https://localhost:5006/api/users/me/password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

### Test 4: PUT /api/users/me/preferences
```http
PUT https://localhost:5006/api/users/me/preferences
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "notifications": true,
  "newsletter": false,
  "language": "es"
}
```

### Test 5: POST /api/users/me/avatar
```http
POST https://localhost:5006/api/users/me/avatar
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

avatar: [FILE]
```

---

## 📝 Notas Importantes

1. **Seguridad:**
   - Todos los endpoints requieren JWT válido
   - Validar que el usuario sea el dueño de los datos que modifica
   - Nunca exponer PasswordHash en las respuestas
   - Usar HTTPS en producción

2. **Validaciones:**
   - Email debe ser único en la BD
   - Contraseña actual debe verificarse con BCrypt
   - Avatares deben cumplir restricciones de tamaño y tipo

3. **Performance:**
   - Usar `.Include()` para cargar relaciones
   - Implementar paginación si hay muchas direcciones/pedidos
   - Cachear estadísticas de usuario si es posible

4. **Migrations:**
   ```bash
   dotnet ef migrations add AddUserPreferencesAndAvatar
   dotnet ef database update
   ```

5. **NuGet Packages Necesarios:**
   ```bash
   dotnet add package BCrypt.Net-Next
   dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
   ```

---

**Documento creado:** 19 Nov 2025  
**Última actualización:** 19 Nov 2025  
**Frontend status:** ✅ Service creado, componente actualizado, falta CSS y HTML completo  
**Backend status:** ⏳ Pendiente implementación completa  
**Database status:** ⏳ Scripts SQL listos para ejecutar
