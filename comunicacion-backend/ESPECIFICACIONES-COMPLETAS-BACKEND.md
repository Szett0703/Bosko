# 📋 ESPECIFICACIONES COMPLETAS PARA EL BACKEND - PROYECTO BOSKO

**Fecha:** 16 de Noviembre, 2025  
**De:** Front (Angular Developer)  
**Para:** Back (.NET Developer)  
**Proyecto:** Bosko E-Commerce - Tienda de Ropa

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎯 OBJETIVO

Necesito que implementes un backend completo en .NET 8 con SQL Server para el proyecto Bosko E-Commerce.

Este documento contiene:
1. ✅ Script SQL completo para la base de datos
2. ✅ Estructura de modelos C#
3. ✅ DTOs con serialización JSON
4. ✅ Endpoints de API necesarios
5. ✅ Configuración de CORS
6. ✅ Ejemplos de respuestas JSON

**TODO ESTÁ LISTO PARA COPIAR Y PEGAR.**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🗄️ PARTE 1: SCRIPT SQL - BASE DE DATOS

Ejecuta este script completo en SQL Server Management Studio:

```sql
-- ============================================
-- SCRIPT DE BASE DE DATOS - BOSKO E-COMMERCE
-- ============================================

-- Crear la base de datos (si no existe)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'BoskoDB')
BEGIN
    CREATE DATABASE BoskoDB;
END
GO

USE BoskoDB;
GO

-- ============================================
-- TABLA: Categories
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Categories')
BEGIN
    CREATE TABLE Categories (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(500) NOT NULL,
        Image NVARCHAR(500) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END
GO

-- ============================================
-- TABLA: Products
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Products')
BEGIN
    CREATE TABLE Products (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(200) NOT NULL,
        Description NVARCHAR(1000) NULL,
        Price DECIMAL(10,2) NOT NULL,
        Stock INT NOT NULL DEFAULT 0,
        Image NVARCHAR(500) NULL,
        CategoryId INT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId) 
            REFERENCES Categories(Id) ON DELETE SET NULL
    );
END
GO

-- ============================================
-- ÍNDICES PARA MEJOR PERFORMANCE
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Products_CategoryId')
BEGIN
    CREATE INDEX IX_Products_CategoryId ON Products(CategoryId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Products_Name')
BEGIN
    CREATE INDEX IX_Products_Name ON Products(Name);
END
GO

-- ============================================
-- DATOS DE PRUEBA: Categories
-- ============================================
IF NOT EXISTS (SELECT * FROM Categories)
BEGIN
    INSERT INTO Categories (Name, Description, Image) VALUES
    ('Camisas', 'Colección de camisas elegantes para hombre y mujer', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'),
    ('Pantalones', 'Pantalones casuales y formales de alta calidad', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'),
    ('Vestidos', 'Vestidos elegantes para toda ocasión', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'),
    ('Chaquetas', 'Chaquetas y abrigos para toda temporada', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'),
    ('Accesorios', 'Complementos perfectos para tu outfit', 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=800');
END
GO

-- ============================================
-- DATOS DE PRUEBA: Products
-- ============================================
IF NOT EXISTS (SELECT * FROM Products)
BEGIN
    INSERT INTO Products (Name, Description, Price, Stock, Image, CategoryId) VALUES
    -- Camisas (CategoryId = 1)
    ('Camisa Oxford Azul', 'Camisa clásica de algodón 100%, perfecta para el día a día', 49.99, 25, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', 1),
    ('Camisa Lino Blanca', 'Camisa de lino premium, ideal para verano', 59.99, 30, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500', 1),
    ('Camisa Casual Rayas', 'Diseño moderno con rayas verticales', 39.99, 20, 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500', 1),
    
    -- Pantalones (CategoryId = 2)
    ('Jean Slim Fit Oscuro', 'Pantalón jean ajustado de mezclilla premium', 79.99, 40, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 2),
    ('Pantalón Chino Beige', 'Estilo casual-formal versátil', 69.99, 35, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500', 2),
    ('Jean Regular Negro', 'Clásico jean negro de corte regular', 74.99, 28, 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=500', 2),
    
    -- Vestidos (CategoryId = 3)
    ('Vestido Floral Primavera', 'Vestido ligero con estampado floral', 89.99, 15, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', 3),
    ('Vestido Elegante Negro', 'Vestido de cóctel para eventos especiales', 129.99, 12, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500', 3),
    ('Vestido Casual Verano', 'Perfecto para días casuales de verano', 69.99, 20, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500', 3),
    
    -- Chaquetas (CategoryId = 4)
    ('Chaqueta Cuero Negra', 'Chaqueta de cuero genuino estilo biker', 249.99, 8, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 4),
    ('Blazer Formal Gris', 'Blazer elegante para look profesional', 159.99, 18, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500', 4),
    ('Cazadora Denim', 'Chaqueta jean clásica atemporal', 89.99, 22, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500', 4),
    
    -- Accesorios (CategoryId = 5)
    ('Cinturón Cuero Marrón', 'Cinturón de cuero genuino con hebilla plateada', 34.99, 50, 'https://images.unsplash.com/photo-1624222247344-550fb60583aa?w=500', 5),
    ('Bufanda Lana Gris', 'Bufanda suave de lana merino', 29.99, 45, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500', 5),
    ('Gorra Baseball Negra', 'Gorra ajustable de estilo deportivo', 24.99, 60, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', 5);
END
GO

-- ============================================
-- VERIFICAR LOS DATOS
-- ============================================
SELECT 'Categories' AS Tabla, COUNT(*) AS TotalRegistros FROM Categories
UNION ALL
SELECT 'Products', COUNT(*) FROM Products;
GO

PRINT 'Base de datos BoskoDB creada exitosamente!';
PRINT 'Categorías insertadas: ' + CAST((SELECT COUNT(*) FROM Categories) AS NVARCHAR(10));
PRINT 'Productos insertados: ' + CAST((SELECT COUNT(*) FROM Products) AS NVARCHAR(10));
GO
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📦 PARTE 2: MODELOS C# - ENTITIES

Crea estas clases en tu carpeta `Models/`:

### 📄 Models/Category.cs

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BoskoAPI.Models
{
    [Table("Categories")]
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Image { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
```

### 📄 Models/Product.cs

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BoskoAPI.Models
{
    [Table("Products")]
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Required]
        public int Stock { get; set; } = 0;

        [MaxLength(500)]
        public string? Image { get; set; }

        public int? CategoryId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }
    }
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 PARTE 3: DTOs - DATA TRANSFER OBJECTS

Crea estas clases en tu carpeta `DTOs/`:

### 📄 DTOs/ProductDto.cs

```csharp
using System.Text.Json.Serialization;

namespace BoskoAPI.DTOs
{
    public class ProductDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

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
}
```

### 📄 DTOs/CategoryDto.cs

```csharp
using System.Text.Json.Serialization;

namespace BoskoAPI.DTOs
{
    public class CategoryDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;

        [JsonPropertyName("image")]
        public string? Image { get; set; }
    }
}
```

### 📄 DTOs/ProductCreateDto.cs

```csharp
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BoskoAPI.DTOs
{
    public class ProductCreateDto
    {
        [Required(ErrorMessage = "El nombre es requerido")]
        [MaxLength(200)]
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "El precio es requerido")]
        [Range(0.01, 999999.99, ErrorMessage = "El precio debe estar entre 0.01 y 999999.99")]
        [JsonPropertyName("price")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "El stock es requerido")]
        [Range(0, int.MaxValue, ErrorMessage = "El stock no puede ser negativo")]
        [JsonPropertyName("stock")]
        public int Stock { get; set; }

        [MaxLength(500)]
        [JsonPropertyName("image")]
        public string? Image { get; set; }

        [JsonPropertyName("categoryId")]
        public int? CategoryId { get; set; }
    }
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🔌 PARTE 4: DbContext

### 📄 Data/BoskoDbContext.cs

```csharp
using Microsoft.EntityFrameworkCore;
using BoskoAPI.Models;

namespace BoskoAPI.Data
{
    public class BoskoDbContext : DbContext
    {
        public BoskoDbContext(DbContextOptions<BoskoDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de relaciones
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configuración de índices
            modelBuilder.Entity<Product>()
                .HasIndex(p => p.CategoryId)
                .HasDatabaseName("IX_Products_CategoryId");

            modelBuilder.Entity<Product>()
                .HasIndex(p => p.Name)
                .HasDatabaseName("IX_Products_Name");
        }
    }
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎮 PARTE 5: CONTROLLERS

### 📄 Controllers/ProductsController.cs

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BoskoAPI.Data;
using BoskoAPI.Models;
using BoskoAPI.DTOs;

namespace BoskoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly BoskoDbContext _context;

        public ProductsController(BoskoDbContext context)
        {
            _context = context;
        }

        // GET: api/products
        // GET: api/products?categoryId=1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts([FromQuery] int? categoryId)
        {
            IQueryable<Product> query = _context.Products.Include(p => p.Category);

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId.Value);
            }

            var products = await query.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                Image = p.Image,
                CategoryId = p.CategoryId,
                CategoryName = p.Category != null ? p.Category.Name : null,
                CreatedAt = p.CreatedAt
            }).ToListAsync();

            return Ok(products);
        }

        // GET: api/products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound(new { message = $"Producto con Id {id} no encontrado" });
            }

            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                Image = product.Image,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name,
                CreatedAt = product.CreatedAt
            };

            return Ok(productDto);
        }

        // POST: api/products
        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(ProductCreateDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validar que la categoría existe si se proporciona
            if (productDto.CategoryId.HasValue)
            {
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == productDto.CategoryId.Value);
                if (!categoryExists)
                {
                    return BadRequest(new { message = $"Categoría con Id {productDto.CategoryId} no existe" });
                }
            }

            var product = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                Stock = productDto.Stock,
                Image = productDto.Image,
                CategoryId = productDto.CategoryId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Recargar con la categoría
            await _context.Entry(product).Reference(p => p.Category).LoadAsync();

            var result = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                Image = product.Image,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name,
                CreatedAt = product.CreatedAt
            };

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, result);
        }

        // PUT: api/products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductCreateDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = $"Producto con Id {id} no encontrado" });
            }

            // Validar que la categoría existe si se proporciona
            if (productDto.CategoryId.HasValue)
            {
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == productDto.CategoryId.Value);
                if (!categoryExists)
                {
                    return BadRequest(new { message = $"Categoría con Id {productDto.CategoryId} no existe" });
                }
            }

            product.Name = productDto.Name;
            product.Description = productDto.Description;
            product.Price = productDto.Price;
            product.Stock = productDto.Stock;
            product.Image = productDto.Image;
            product.CategoryId = productDto.CategoryId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ProductExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = $"Producto con Id {id} no encontrado" });
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> ProductExists(int id)
        {
            return await _context.Products.AnyAsync(e => e.Id == id);
        }
    }
}
```

### 📄 Controllers/CategoriesController.cs

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BoskoAPI.Data;
using BoskoAPI.Models;
using BoskoAPI.DTOs;

namespace BoskoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly BoskoDbContext _context;

        public CategoriesController(BoskoDbContext context)
        {
            _context = context;
        }

        // GET: api/categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            var categories = await _context.Categories
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Image = c.Image
                })
                .ToListAsync();

            return Ok(categories);
        }

        // GET: api/categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound(new { message = $"Categoría con Id {id} no encontrada" });
            }

            var categoryDto = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Image = category.Image
            };

            return Ok(categoryDto);
        }
    }
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ⚙️ PARTE 6: CONFIGURACIÓN - Program.cs

Reemplaza tu `Program.cs` con esto:

```csharp
using Microsoft.EntityFrameworkCore;
using BoskoAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar DbContext con SQL Server
builder.Services.AddDbContext<BoskoDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:4200",
            "http://localhost:4300",
            "https://localhost:4200",
            "https://localhost:4300"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// IMPORTANTE: CORS debe ir ANTES de Authorization
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📝 PARTE 7: CONFIGURACIÓN - appsettings.json

Actualiza tu `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=BoskoDB;Integrated Security=true;TrustServerCertificate=True;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Urls": "https://localhost:5001;http://localhost:5000"
}
```

**NOTA:** Ajusta el `ConnectionString` según tu configuración de SQL Server:
- Si usas autenticación de Windows: `Integrated Security=true`
- Si usas usuario/contraseña: `User Id=tu_usuario;Password=tu_contraseña`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📦 PARTE 8: PAQUETES NUGET NECESARIOS

Ejecuta estos comandos en la terminal de tu proyecto:

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 8.0.0
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 8.0.0
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.0
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🚀 PARTE 9: PASOS PARA EJECUTAR

1. **Ejecutar el script SQL:**
   - Abre SQL Server Management Studio
   - Conecta a tu servidor local
   - Copia y ejecuta TODO el script SQL de la PARTE 1
   - Verifica que se creó la base de datos `BoskoDB`

2. **Crear el proyecto (si es nuevo):**
   ```bash
   dotnet new webapi -n BoskoAPI
   cd BoskoAPI
   ```

3. **Instalar paquetes NuGet** (comandos de la PARTE 8)

4. **Crear estructura de carpetas:**
   ```
   BoskoAPI/
   ├── Models/
   ├── DTOs/
   ├── Data/
   └── Controllers/
   ```

5. **Copiar todos los archivos C#** de las PARTES 2, 3, 4 y 5

6. **Actualizar Program.cs** con el código de la PARTE 6

7. **Actualizar appsettings.json** con la PARTE 7

8. **Compilar y ejecutar:**
   ```bash
   dotnet build
   dotnet run
   ```

9. **Verificar en Swagger:**
   - Abre: `https://localhost:5001/swagger`
   - Deberías ver los endpoints:
     * GET /api/products
     * GET /api/products/{id}
     * POST /api/products
     * PUT /api/products/{id}
     * DELETE /api/products/{id}
     * GET /api/categories
     * GET /api/categories/{id}

10. **Probar los endpoints:**
    ```bash
    # Obtener todas las categorías
    GET https://localhost:5001/api/categories
    
    # Obtener todos los productos
    GET https://localhost:5001/api/products
    
    # Obtener productos de una categoría específica
    GET https://localhost:5001/api/products?categoryId=1
    ```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📊 PARTE 10: EJEMPLOS DE RESPUESTAS JSON

### GET /api/products

```json
[
  {
    "id": 1,
    "name": "Camisa Oxford Azul",
    "description": "Camisa clásica de algodón 100%, perfecta para el día a día",
    "price": 49.99,
    "stock": 25,
    "image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
    "categoryId": 1,
    "categoryName": "Camisas",
    "createdAt": "2024-11-16T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Camisa Lino Blanca",
    "description": "Camisa de lino premium, ideal para verano",
    "price": 59.99,
    "stock": 30,
    "image": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
    "categoryId": 1,
    "categoryName": "Camisas",
    "createdAt": "2024-11-16T10:31:00Z"
  }
]
```

### GET /api/categories

```json
[
  {
    "id": 1,
    "name": "Camisas",
    "description": "Colección de camisas elegantes para hombre y mujer",
    "image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800"
  },
  {
    "id": 2,
    "name": "Pantalones",
    "description": "Pantalones casuales y formales de alta calidad",
    "image": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800"
  }
]
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ✅ CHECKLIST FINAL

Marca cuando completes cada paso:

- [ ] Script SQL ejecutado en SQL Server
- [ ] Base de datos BoskoDB creada
- [ ] 5 categorías insertadas
- [ ] 15 productos insertados
- [ ] Paquetes NuGet instalados
- [ ] Carpetas creadas (Models, DTOs, Data, Controllers)
- [ ] Modelos C# copiados (Product.cs, Category.cs)
- [ ] DTOs copiados (ProductDto, CategoryDto, ProductCreateDto)
- [ ] DbContext creado (BoskoDbContext.cs)
- [ ] Controllers copiados (ProductsController, CategoriesController)
- [ ] Program.cs actualizado con CORS
- [ ] appsettings.json actualizado con connection string
- [ ] Proyecto compilado sin errores (dotnet build)
- [ ] Proyecto corriendo (dotnet run)
- [ ] Swagger accesible en https://localhost:5001/swagger
- [ ] Endpoint GET /api/products funciona
- [ ] Endpoint GET /api/categories funciona
- [ ] Endpoint GET /api/products?categoryId=1 funciona
- [ ] CORS permite peticiones desde http://localhost:4300

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot open database BoskoDB"
**Solución:** Verifica que el script SQL se ejecutó correctamente.

### Error: "Unable to resolve service for type 'BoskoDbContext'"
**Solución:** Asegúrate de haber agregado `AddDbContext` en Program.cs

### Error: CORS
**Solución:** Verifica que `UseCors` esté ANTES de `UseAuthorization` en Program.cs

### Error: "Connection string not found"
**Solución:** Revisa que el `appsettings.json` tenga el ConnectionString correcto

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📞 COMUNICACIÓN CONMIGO (FRONT)

Cuando hayas terminado TODO, respóndeme con:

```
✅ BACKEND COMPLETADO

Puerto: https://localhost:5001
Swagger: ✅ Funcionando
Endpoints:
  - GET /api/products ✅
  - GET /api/categories ✅
  - GET /api/products?categoryId=1 ✅
Total Productos: XX
Total Categorías: 5

LISTO PARA INTEGRACIÓN CON FRONTEND
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Cualquier duda o error que tengas, dime EXACTAMENTE qué error te sale y te ayudo.**

**Este documento tiene TODO lo que necesitas. No falta nada.**

Saludos,
Front 🚀
