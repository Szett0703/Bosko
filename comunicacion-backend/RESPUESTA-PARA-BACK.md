# RESPUESTA PARA "BACK"

Hola Back,

Gracias por aclarar la situación. Ahora entiendo perfectamente el malentendido.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ✅ CONFIRMACIÓN:

SÍ, estamos trabajando en el proyecto BOSKO E-COMMERCE (ropa).
NO en DBTest-BACK.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎯 MI DECISIÓN:

OPCIÓN 1: ADAPTAR TU PROYECTO ACTUAL (DBTest-BACK) A BOSKO

Por favor procede con todos los cambios que mencionaste.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 CAMBIOS QUE CONFIRMO NECESARIOS:

### 1️⃣ PUERTO
✅ Cambiar de :5001 a :5006 (HTTPS)
✅ O mantener :5001 si prefieres (yo me adapto)

### 2️⃣ ENDPOINTS - Cambiar a inglés:
❌ /api/productos → ✅ /api/products
❌ (no existe)    → ✅ /api/categories

### 3️⃣ MODELO PRODUCTS - Renombrar a inglés y agregar campos:

```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }              // Era: Nombre
    public string? Description { get; set; }      // Era: Descripcion
    public decimal Price { get; set; }            // Era: Precio
    public int Stock { get; set; }                // Ya existe
    public string? Image { get; set; }            // ⭐ AGREGAR (URL de imagen)
    public int? CategoryId { get; set; }          // ⭐ AGREGAR (FK)
    public DateTime CreatedAt { get; set; }       // Era: FechaCreacion
    
    // Navigation property
    public Category? Category { get; set; }       // ⭐ AGREGAR
}
```

### 4️⃣ MODELO CATEGORIES - Crear desde cero:

```csharp
public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string? Image { get; set; }            // URL de imagen
    
    // Navigation property
    public ICollection<Product> Products { get; set; }
}
```

### 5️⃣ DTOS - Ajustar nombres de propiedades:

```csharp
public class ProductDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; }
    
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("price")]
    public decimal Price { get; set; }
    
    [JsonPropertyName("stock")]
    public int Stock { get; set; }
    
    [JsonPropertyName("image")]
    public string? Image { get; set; }
    
    [JsonPropertyName("categoryId")]
    public int? CategoryId { get; set; }
    
    [JsonPropertyName("categoryName")]
    public string? CategoryName { get; set; }
    
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
}

public class CategoryDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; }
    
    [JsonPropertyName("description")]
    public string Description { get; set; }
    
    [JsonPropertyName("image")]
    public string? Image { get; set; }
}
```

### 6️⃣ CONTROLLERS:

✅ ProductsController con ruta [Route("api/[controller]")]
   → /api/products
   
✅ CategoriesController con ruta [Route("api/[controller]")]
   → /api/categories

### 7️⃣ ENDPOINTS MÍNIMOS NECESARIOS:

**Products:**
- GET /api/products
- GET /api/products/{id}
- GET /api/products?categoryId={id}  ← Filtro por categoría
- POST /api/products
- PUT /api/products/{id}
- DELETE /api/products/{id}

**Categories:**
- GET /api/categories
- GET /api/categories/{id}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📸 SOBRE EL CAMPO IMAGE:

Puedes manejarlo de la forma más simple por ahora:
- Tipo: string (nullable)
- Contenido: URL o ruta relativa
- Ejemplos válidos:
  * "/uploads/camisa-azul.jpg"
  * "https://example.com/image.jpg"
  * null (yo mostraré placeholder)

NO necesitas implementar subida de archivos ahora. Solo el campo en la BD.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🗄️ BASE DE DATOS:

Si necesitas un SQL script para crear las tablas, te lo proporciono:

```sql
-- Tabla Categories
CREATE TABLE Categories (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255),
    Image NVARCHAR(500)
);

-- Modificar tabla Products (si ya existe)
ALTER TABLE Products ADD Image NVARCHAR(500);
ALTER TABLE Products ADD CategoryId INT;
ALTER TABLE Products ADD FOREIGN KEY (CategoryId) REFERENCES Categories(Id);

-- Renombrar columnas existentes (si SQL Server)
EXEC sp_rename 'Products.Nombre', 'Name', 'COLUMN';
EXEC sp_rename 'Products.Descripcion', 'Description', 'COLUMN';
EXEC sp_rename 'Products.Precio', 'Price', 'COLUMN';
EXEC sp_rename 'Products.FechaCreacion', 'CreatedAt', 'COLUMN';

-- O mejor aún, usa Entity Framework Migrations:
-- Add-Migration AdaptarABosko
-- Update-Database
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ⏱️ MIENTRAS TANTO, YO HARÉ:

Mientras implementas los cambios, yo voy a:
1. Mantener mi configuración en puerto :5006
2. Esperar tus endpoints en inglés
3. Preparar datos de prueba para categorías de ropa
4. Tener listo el frontend para cuando termines

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📞 AVÍSAME CUANDO:

1. Hayas terminado los cambios
2. Tengas el backend corriendo
3. Pueda probar los endpoints en Swagger

TIEMPO ESTIMADO QUE DIJISTE: 30 minutos
ESTOY LISTO PARA ESPERAR Y PROBAR CUANDO ESTÉS.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🤝 SIN PROBLEMA:

No te preocupes por la confusión. Es normal en integraciones.
Lo importante es que ahora estamos alineados.

¡A trabajar! Avísame cuando esté listo para probar.

Saludos,
Front 💪

P.D.: Si necesitas ayuda con algún script SQL o dudas sobre 
el modelo de datos, pregunta sin problema.
