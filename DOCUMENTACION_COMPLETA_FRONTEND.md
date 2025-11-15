# 📚 DOCUMENTACIÓN COMPLETA DEL PROYECTO BOSKO FRONTEND

## 🎯 DESCRIPCIÓN GENERAL DEL PROYECTO

**Bosko** es una aplicación de e-commerce para venta de ropa y accesorios, desarrollada con Angular 19 en el frontend, diseñada para conectarse con un backend en .NET 8 con SQL Server.

### Información Básica
- **Nombre del Proyecto**: Bosko
- **Versión**: 0.0.0
- **Tipo**: E-commerce de Moda
- **Framework Frontend**: Angular 19.2.0
- **Lenguaje**: TypeScript 5.7.2
- **Estilos**: Tailwind CSS (utility-first)
- **Puerto de Desarrollo**: http://localhost:4300
- **Estado Actual**: ✅ Funcionando correctamente sin errores

---

## 🏗️ ARQUITECTURA DEL PROYECTO

### Estructura de Carpetas Principal

```
Bosko/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── header/         # Navegación principal
│   │   │   ├── footer/         # Pie de página
│   │   │   ├── hero/           # Banner principal
│   │   │   ├── sidebar/        # Menú lateral categorías
│   │   │   ├── product-card/   # Tarjeta de producto
│   │   │   └── product-grid/   # Grid de productos
│   │   │
│   │   ├── pages/              # Páginas principales
│   │   │   ├── home/           # Página de inicio
│   │   │   ├── collections/    # Categorías/colecciones
│   │   │   ├── about/          # Acerca de
│   │   │   ├── contact/        # Contacto
│   │   │   ├── profile/        # Perfil de usuario
│   │   │   ├── cart/           # Carrito de compras
│   │   │   ├── login/          # Inicio de sesión
│   │   │   ├── register/       # Registro de usuario
│   │   │   ├── forgot-password/ # Recuperación contraseña
│   │   │   └── reset-password/  # Restablecer contraseña
│   │   │
│   │   ├── services/           # Servicios Angular
│   │   │   ├── auth.service.ts      # Autenticación
│   │   │   ├── product.service.ts   # Productos
│   │   │   ├── category.service.ts  # Categorías
│   │   │   ├── order.service.ts     # Pedidos
│   │   │   ├── cart.service.ts      # Carrito
│   │   │   └── language.service.ts  # Internacionalización
│   │   │
│   │   ├── models/             # Interfaces TypeScript
│   │   │   ├── product.model.ts     # Modelo Producto
│   │   │   ├── category.model.ts    # Modelo Categoría
│   │   │   ├── user.model.ts        # Modelo Usuario
│   │   │   └── order.model.ts       # Modelo Pedido
│   │   │
│   │   ├── guards/             # Protección de rutas
│   │   │   └── auth.guard.ts        # Guard autenticación
│   │   │
│   │   ├── interceptors/       # Interceptores HTTP
│   │   │   └── auth.interceptor.ts  # JWT interceptor
│   │   │
│   │   ├── config/             # Configuraciones
│   │   │   └── api.config.ts        # Config API endpoints
│   │   │
│   │   ├── app.config.ts       # Configuración principal
│   │   ├── app.routes.ts       # Definición de rutas
│   │   └── app.component.ts    # Componente raíz
│   │
│   ├── assets/                 # Recursos estáticos
│   ├── styles.css             # Estilos globales (Tailwind)
│   └── index.html             # HTML principal
│
├── public/                    # Archivos públicos
├── angular.json              # Configuración Angular
├── package.json              # Dependencias NPM
├── tsconfig.json             # Configuración TypeScript
└── BACKEND_SETUP.md          # Guía de configuración backend
```

---

## 🔧 TECNOLOGÍAS Y DEPENDENCIAS

### Dependencias Principales (package.json)

```json
{
  "dependencies": {
    "@angular/common": "^19.2.0",           // Módulos comunes Angular
    "@angular/compiler": "^19.2.0",         // Compilador Angular
    "@angular/core": "^19.2.0",             // Core de Angular
    "@angular/forms": "^19.2.0",            // Formularios reactivos
    "@angular/platform-browser": "^19.2.0", // Renderizado navegador
    "@angular/router": "^19.2.0",           // Enrutamiento SPA
    "@angular/ssr": "^19.2.13",             // Server-Side Rendering
    "rxjs": "~7.8.0",                       // Programación reactiva
    "zone.js": "~0.15.0"                    // Change detection
  }
}
```

### Características Técnicas
- **Standalone Components**: Todos los componentes usan el nuevo sistema standalone de Angular
- **Signals**: Uso extensivo de Angular Signals para estado reactivo
- **Reactive Forms**: Formularios con validación reactiva
- **HTTP Client**: Peticiones HTTP con interceptores
- **Router Guards**: Protección de rutas con guards funcionales
- **TypeScript Strict**: Tipado estricto para mayor seguridad

---

## 📡 CONFIGURACIÓN DE API Y BACKEND

### API Configuration (api.config.ts)

```typescript
export const API_CONFIG = {
  baseUrl: 'http://localhost:5000/api',  // ⚠️ AJUSTAR SEGÚN TU BACKEND
  endpoints: {
    products: '/products',
    categories: '/categories',
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      googleLogin: '/auth/google-login',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password'
    },
    orders: '/orders',
    users: '/users/me'
  }
};
```

### Endpoints Esperados del Backend .NET

#### 1. **Autenticación**

**POST /api/auth/login**
```json
// Request
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "usuario@ejemplo.com"
  }
}
```

**POST /api/auth/register**
```json
// Request
{
  "name": "Juan Pérez",
  "email": "usuario@ejemplo.com",
  "password": "password123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "usuario@ejemplo.com"
  }
}
```

**POST /api/auth/google-login**
```json
// Request
{
  "token": "google_id_token_here"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "usuario@ejemplo.com"
  }
}
```

**POST /api/auth/forgot-password**
```json
// Request
{
  "email": "usuario@ejemplo.com"
}

// Response
{
  "message": "Email enviado exitosamente"
}
```

**POST /api/auth/reset-password**
```json
// Request
{
  "email": "usuario@ejemplo.com",
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}

// Response
{
  "message": "Contraseña actualizada exitosamente"
}
```

#### 2. **Productos**

**GET /api/products**
```json
// Response
[
  {
    "id": 1,
    "name": "Classic Winter Jacket",
    "price": 129.99,
    "image": "url_imagen",
    "description": "Descripción del producto",
    "categoryId": 1,
    "stock": 50
  }
]
```

**GET /api/products?categoryId=1**
```json
// Response: Array de productos filtrados por categoría
[
  {
    "id": 1,
    "name": "Classic Winter Jacket",
    "price": 129.99,
    "categoryId": 1,
    // ...
  }
]
```

**GET /api/products/{id}**
```json
// Response: Un producto específico
{
  "id": 1,
  "name": "Classic Winter Jacket",
  "price": 129.99,
  // ...
}
```

#### 3. **Categorías**

**GET /api/categories**
```json
// Response
[
  {
    "id": 1,
    "name": "Men's Collection",
    "description": "Ropa para hombres",
    "image": "url_imagen"
  }
]
```

**GET /api/categories/{id}**
```json
// Response
{
  "id": 1,
  "name": "Men's Collection",
  "description": "Ropa para hombres",
  "image": "url_imagen"
}
```

#### 4. **Pedidos (Orders)**

**POST /api/orders** (Requiere autenticación)
```json
// Request
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}

// Response
{
  "orderId": 123,
  "message": "Pedido creado exitosamente"
}
```

**GET /api/orders** (Requiere autenticación)
```json
// Response
[
  {
    "id": 123,
    "date": "2025-11-13T10:30:00Z",
    "total": 259.97,
    "status": "Pending",
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Classic Winter Jacket",
        "quantity": 2,
        "price": 129.99
      }
    ]
  }
]
```

**GET /api/orders/{id}** (Requiere autenticación)
```json
// Response: Detalle de un pedido específico
{
  "id": 123,
  "date": "2025-11-13T10:30:00Z",
  "total": 259.97,
  "status": "Pending",
  "items": [...]
}
```

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### Flujo de Autenticación JWT

1. **Usuario inicia sesión** en `/login`
2. **Frontend envía credenciales** a `POST /api/auth/login`
3. **Backend valida y retorna JWT**
4. **Frontend almacena token** en `localStorage` con key `'bosko-token'`
5. **Interceptor añade token** a todas las peticiones autenticadas
6. **Backend valida token** en cada request protegido

### AuthService (auth.service.ts)

**Métodos principales:**
```typescript
- login(credentials: LoginRequest): Observable<AuthResponse>
- register(userData: RegisterRequest): Observable<AuthResponse>
- googleLogin(googleToken: string): Observable<AuthResponse>
- forgotPassword(email: string): Observable<{message: string}>
- resetPassword(email, token, newPassword): Observable<{message: string}>
- logout(): void
- isAuthenticated(): boolean
- getCurrentUser(): User | null
```

### AuthGuard (auth.guard.ts)

Protege rutas que requieren autenticación:
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};
```

### AuthInterceptor (auth.interceptor.ts)

Añade automáticamente el JWT a peticiones HTTP:
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('bosko-token');

  // Skip auth endpoints
  const isAuthEndpoint = req.url.includes('/auth/');

  if (token && !isAuthEndpoint) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
```

---

## 🛒 SISTEMA DE CARRITO DE COMPRAS

### CartService (cart.service.ts)

Gestiona el carrito usando **Angular Signals**:

```typescript
export interface CartItem extends Product {
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  
  // Computed signals
  items = computed(() => this.cartItems());
  itemCount = computed(() => ...);
  subtotal = computed(() => ...);
  tax = computed(() => this.subtotal() * 0.1); // 10% tax
  total = computed(() => this.subtotal() + this.tax());

  // Métodos
  addToCart(product: Product): void
  removeFromCart(productId: number): void
  updateQuantity(productId: number, quantity: number): void
  clearCart(): void
}
```

**Persistencia**: Los items del carrito se guardan en `localStorage` con key `'bosko-cart'`

### Flujo de Checkout

1. Usuario agrega productos al carrito
2. Va a `/cart` y hace click en "Checkout"
3. **Si NO está autenticado**: Redirige a `/login?returnUrl=/cart`
4. **Si está autenticado**: Envía pedido a `POST /api/orders`
5. **Backend crea pedido** y retorna confirmación
6. **Frontend limpia carrito** y redirige a `/profile`
7. Usuario ve su pedido en el historial

---

## 🌐 SISTEMA DE INTERNACIONALIZACIÓN (i18n)

### LanguageService (language.service.ts)

Soporta **Español** e **Inglés**:

```typescript
export type Language = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private currentLanguage = signal<Language>('es');
  
  getCurrentLanguage = computed(() => this.currentLanguage());
  getTranslations = computed(() => {
    return this.currentLanguage() === 'es' 
      ? this.spanishTranslations 
      : this.englishTranslations;
  });

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'es' ? 'en' : 'es';
    this.currentLanguage.set(newLang);
    localStorage.setItem('bosko-language', newLang);
  }
}
```

**Uso en componentes:**
```typescript
t = computed(() => this.languageService.getTranslations());

// En template
{{ t().headerNav.home }}
```

---

## 📦 MODELOS DE DATOS (TypeScript Interfaces)

### Product Model (product.model.ts)
```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  categoryId?: number;
  stock?: number;
  createdAt?: Date;
}
```

### Category Model (category.model.ts)
```typescript
export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}
```

### User Model (user.model.ts)
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface GoogleLoginRequest {
  token: string;
}
```

### Order Model (order.model.ts)
```typescript
export interface Order {
  id: number;
  date: Date;
  total: number;
  status: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface CreateOrderResponse {
  orderId: number;
  message: string;
}
```

---

## 🎨 SISTEMA DE ESTILOS

### Tailwind CSS

El proyecto usa **Tailwind CSS** con enfoque utility-first:

**Clases comunes usadas:**
- Layout: `flex`, `grid`, `container`, `mx-auto`, `px-4`
- Responsive: `sm:`, `md:`, `lg:`, `xl:`
- Colores: `bg-blue-600`, `text-white`, `hover:bg-blue-700`
- Espaciado: `p-4`, `m-2`, `gap-4`
- Bordes: `rounded-lg`, `border`, `shadow-lg`
- Transiciones: `transition-all`, `duration-300`

**Esquema de colores del brand:**
- Primario: `blue-600` (#2563EB)
- Hover: `blue-700` (#1D4ED8)
- Texto: `gray-900`, `gray-600`
- Fondos: `white`, `gray-50`, `blue-50`

### Estilos Globales (styles.css)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Configuración global Tailwind */
```

---

## 🔀 SISTEMA DE RUTAS

### Configuración de Rutas (app.routes.ts)

```typescript
export const routes: Routes = [
  // Páginas públicas
  { path: '', component: HomeComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'cart', component: CartComponent },
  
  // Autenticación
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  
  // Páginas protegidas
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [authGuard]  // ⚠️ Requiere autenticación
  },
  
  // Ruta por defecto
  { path: '**', redirectTo: '' }
];
```

---

## 🧩 COMPONENTES PRINCIPALES

### 1. HeaderComponent
**Ubicación**: `src/app/components/header/`

**Funcionalidad:**
- Navegación principal responsive
- Selector de idioma (ES/EN)
- Botones de login/logout según estado auth
- Contador de items en carrito
- Menú hamburguesa en mobile
- Botón para abrir sidebar

**Características:**
- Muestra "Ingresar/Registrarse" si NO autenticado
- Muestra "Mi Perfil/Cerrar Sesión" si autenticado
- Cart badge con cantidad de items
- Responsive con menú mobile

### 2. ProductGridComponent
**Ubicación**: `src/app/components/product-grid/`

**Funcionalidad:**
- Muestra grid de productos
- Carga productos desde API
- Soporte para filtrado por categoría
- Estados de carga y error
- **Requiere backend funcionando (sin fallback)**

**Props:**
```typescript
@Input() categoryId?: number; // Opcional para filtrar
```

### 3. ProductCardComponent
**Ubicación**: `src/app/components/product-card/`

**Funcionalidad:**
- Muestra tarjeta individual de producto
- Botón "Añadir al carrito"
- Imagen, nombre, precio, descripción
- Animaciones hover

### 4. SidebarComponent
**Ubicación**: `src/app/components/sidebar/`

**Funcionalidad:**
- Menú lateral de categorías
- Se muestra/oculta en mobile
- Links a diferentes secciones
- Integrado con LanguageService

---

## 📄 PÁGINAS PRINCIPALES

### 1. HomeComponent (`/`)
- Hero section con CTA
- Grid de productos destacados
- Secciones promocionales

### 2. CollectionsComponent (`/collections`)
- Lista de categorías/colecciones
- Carga desde API CategoryService
- Cada colección es expandible
- Muestra ProductGrid filtrado al expandir
- **Requiere backend funcionando (sin fallback)**

### 3. LoginComponent (`/login`)
- Formulario de login reactivo
- Validación de email y password
- Botón de Google Sign-In
- Links a register y forgot-password
- Manejo de errores

### 4. RegisterComponent (`/register`)
- Formulario de registro
- Validación de contraseñas coincidentes
- Campos: nombre, email, password, confirmPassword
- Auto-login tras registro exitoso

### 5. ForgotPasswordComponent (`/forgot-password`)
- Formulario simple con email
- Envía solicitud de recuperación
- Mensaje de confirmación

### 6. ResetPasswordComponent (`/reset-password`)
- Recibe token y email por query params
- Formulario para nueva contraseña
- Validación de contraseñas coincidentes
- Redirige a login tras éxito

### 7. ProfileComponent (`/profile`) 🔒 Protegida
- Muestra información del usuario
- Formulario editable de perfil
- Lista de pedidos (órdenes)
- Tabla con historial de compras
- Configuración de preferencias

### 8. CartComponent (`/cart`)
- Lista de items del carrito
- Actualizar cantidades
- Eliminar items
- Resumen de costos (subtotal, tax, total)
- Botón de checkout
- Valida autenticación antes de checkout

### 9. AboutComponent (`/about`)
- Información sobre la marca Bosko
- Historia de la empresa
- Valores y misión

### 10. ContactComponent (`/contact`)
- Formulario de contacto
- Información de contacto
- Mapa/dirección

---

## 🔄 SERVICIOS HTTP

### ProductService
```typescript
getAllProducts(): Observable<Product[]>
getProductsByCategory(categoryId: number): Observable<Product[]>
getProductById(id: number): Observable<Product>
```

### CategoryService
```typescript
getCategories(): Observable<Category[]>
getCategoryById(id: number): Observable<Category>
```

### OrderService
```typescript
createOrder(orderData: CreateOrderRequest): Observable<CreateOrderResponse>
getOrders(): Observable<Order[]>
getOrderById(id: number): Observable<Order>
```

---

## 🔌 INTEGRACIÓN CON GOOGLE SIGN-IN

### Configuración Requerida

1. **Agregar script en index.html:**
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

2. **Obtener Client ID** de Google Cloud Console

3. **Configurar en LoginComponent:**
```typescript
private initializeGoogleSignIn(): void {
  if (typeof google !== 'undefined') {
    google.accounts.id.initialize({
      client_id: 'TU_CLIENT_ID.apps.googleusercontent.com',
      callback: this.handleGoogleResponse.bind(this)
    });
  }
}
```

4. **Backend debe tener endpoint:** `POST /api/auth/google-login`

---

## ⚙️ CONFIGURACIÓN BACKEND .NET 8

### Configuración CORS Requerida

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4300")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

app.UseCors();
```

### JWT Configuration

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "tu-issuer",
            ValidAudience = "tu-audience",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("tu-secret-key"))
        };
    });

app.UseAuthentication();
app.UseAuthorization();
```

### Estructura de Controllers Recomendada

```
Controllers/
├── AuthController.cs         // Login, Register, GoogleLogin, etc.
├── ProductsController.cs      // CRUD Productos
├── CategoriesController.cs    // CRUD Categorías
├── OrdersController.cs        // CRUD Pedidos
└── UsersController.cs         // Perfil usuario
```

### Ejemplo AuthController

```csharp
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // Validar credenciales
        // Generar JWT
        // Retornar token y user
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // Crear usuario
        // Generar JWT
        // Retornar token y user
    }

    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        // Validar token de Google
        // Crear/obtener usuario
        // Generar JWT propio
        // Retornar token y user
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        // Generar token de reset
        // Enviar email con link
        // Retornar confirmación
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        // Validar token
        // Actualizar contraseña
        // Retornar confirmación
    }
}
```

---

## 🗄️ ESQUEMA DE BASE DE DATOS SQL

### Tablas Recomendadas

```sql
-- Usuarios
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Phone NVARCHAR(20),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Categorías
CREATE TABLE Categories (
    Id INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Image NVARCHAR(MAX)
);

-- Productos
CREATE TABLE Products (
    Id INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Price DECIMAL(18,2) NOT NULL,
    Image NVARCHAR(MAX),
    CategoryId INT,
    Stock INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

-- Pedidos
CREATE TABLE Orders (
    Id INT PRIMARY KEY IDENTITY,
    UserId INT NOT NULL,
    Total DECIMAL(18,2) NOT NULL,
    Status NVARCHAR(50) DEFAULT 'Pending',
    Date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Items de Pedidos
CREATE TABLE OrderItems (
    Id INT PRIMARY KEY IDENTITY,
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(Id),
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

-- Tokens de Reset Password
CREATE TABLE PasswordResetTokens (
    Id INT PRIMARY KEY IDENTITY,
    UserId INT NOT NULL,
    Token NVARCHAR(MAX) NOT NULL,
    ExpiresAt DATETIME NOT NULL,
    Used BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
```

---

## 🚀 COMANDOS PARA EJECUTAR

### Frontend

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
# Disponible en: http://localhost:4300

# Build para producción
npm run build

# Ejecutar tests
npm test
```

### Backend (Ejemplo)

```bash
# Restaurar paquetes NuGet
dotnet restore

# Ejecutar en desarrollo
dotnet run

# Publicar para producción
dotnet publish -c Release
```

---

## ✅ CHECKLIST DE INTEGRACIÓN FRONTEND-BACKEND

### Para que funcione completamente:

- [ ] **Backend corriendo** en http://localhost:5000
- [ ] **CORS configurado** en backend para permitir http://localhost:4300
- [ ] **JWT implementado** en backend con misma configuración
- [ ] **Todos los endpoints** implementados según documentación
- [ ] **Base de datos SQL** creada con esquema
- [ ] **URL de API configurada** en `src/app/config/api.config.ts`
- [ ] **Google Client ID** configurado en `login.component.ts`
- [ ] **Email service** configurado para forgot-password
- [ ] **Datos de prueba** cargados en base de datos

---

## 🐛 PROBLEMAS COMUNES Y SOLUCIONES

### Error CORS
**Problema**: "Access-Control-Allow-Origin header"
**Solución**: Configurar CORS en backend con origen correcto

### Error 401 Unauthorized
**Problema**: Peticiones fallan con 401
**Solución**: Verificar que JWT se envía correctamente y backend valida bien

### Puerto en uso
**Problema**: "Port 4300 is already in use"
**Solución**: 
```bash
Get-NetTCPConnection -LocalPort 4300 | Select-Object OwningProcess
Stop-Process -Id <ProcessId> -Force
npm start
```

### Google Sign-In no funciona
**Problema**: Botón no responde
**Solución**: 
1. Verificar Client ID en código
2. URL autorizada en Google Cloud Console
3. Backend implementado

---

## 📊 ESTADO ACTUAL DEL PROYECTO

### ✅ Implementado y Funcionando
- ✅ Arquitectura Angular 19 completa
- ✅ Sistema de autenticación JWT
- ✅ Servicios HTTP para todos los endpoints
- ✅ Interceptor HTTP automático
- ✅ Guards de autenticación
- ✅ Carrito de compras con localStorage
- ✅ Sistema de checkout funcional
- ✅ Internacionalización ES/EN
- ✅ Componentes responsive
- ✅ Formularios con validación
- ✅ Manejo de errores
- ✅ Estados de carga
- ✅ **Consumo 100% de API (sin datos estáticos)**
- ✅ Google Sign-In integrado

### ⚠️ Requiere Configuración
- ⚠️ URL del backend
- ⚠️ Google Client ID
- ⚠️ Backend .NET 8 implementado
- ⚠️ Base de datos SQL configurada

### 📝 Opcional / Mejoras Futuras
- Paginación de productos
- Búsqueda de productos
- Filtros avanzados
- Wishlist / Favoritos
- Reviews de productos
- Chat de soporte
- Pasarela de pago real
- Notificaciones push
- Tracking de envíos

---

## 📞 RESUMEN PARA LA IA

**Para integrar correctamente Frontend y Backend:**

1. **Frontend listo** en Angular 19, corriendo en puerto 4300
2. **Backend debe estar** en .NET 8, puerto 5000
3. **Todos los endpoints** documentados deben implementarse
4. **CORS configurado** para permitir origen frontend
5. **JWT** debe generarse en backend y validarse en cada request protegido
6. **Modelos de datos** (interfaces) ya están definidos en frontend
7. **Esquema SQL** sugerido para base de datos
8. **⚠️ Backend es OBLIGATORIO** - No hay datos estáticos de fallback
9. **Sistema completo** de autenticación implementado
10. **Requiere backend** para funcionar correctamente

**⚠️ IMPORTANTE: El frontend ahora requiere el backend corriendo para mostrar productos y categorías!** 🚀
