# Bosko Frontend - Configuración de Backend

## Resumen de Cambios Implementados

Se ha completado la refactorización del frontend de Bosko para conectarlo con el backend .NET 8. A continuación se detallan todos los cambios realizados:

## 🎯 Características Implementadas

### 1. **Configuración HTTP y Modelos**
- ✅ Configurado `HttpClient` en `app.config.ts`
- ✅ Creados modelos TypeScript para: `Product`, `Category`, `User`, `Order`
- ✅ Archivo de configuración de API (`api.config.ts`) con endpoints centralizados

### 2. **Servicios HTTP**
- ✅ **ProductService**: Obtiene productos desde la API
  - `getAllProducts()`
  - `getProductsByCategory(categoryId)`
  - `getProductById(id)`
  
- ✅ **CategoryService**: Maneja categorías/colecciones
  - `getCategories()`
  - `getCategoryById(id)`
  
- ✅ **AuthService**: Autenticación completa
  - `login(credentials)`
  - `register(userData)`
  - `googleLogin(googleToken)`
  - `forgotPassword(email)`
  - `resetPassword(email, token, newPassword)`
  - `logout()`
  - `isAuthenticated()`
  
- ✅ **OrderService**: Gestión de pedidos
  - `createOrder(orderData)`
  - `getOrders()`
  - `getOrderById(id)`

### 3. **Interceptor HTTP**
- ✅ `authInterceptor`: Añade automáticamente el JWT token a todas las peticiones autenticadas

### 4. **Componentes de Autenticación**
- ✅ **LoginComponent**: Formulario de inicio de sesión con validación
- ✅ **RegisterComponent**: Registro de nuevos usuarios con validación de contraseñas
- ✅ **ForgotPasswordComponent**: Recuperación de contraseña
- ✅ **ResetPasswordComponent**: Restablecimiento de contraseña con token

### 5. **Google Sign-In**
- ✅ Integración del SDK de Google en `index.html`
- ✅ Lógica de autenticación con Google implementada en `LoginComponent`
- ⚠️ **REQUIERE CONFIGURACIÓN**: Ver sección de configuración abajo

### 6. **Rutas y Seguridad**
- ✅ `AuthGuard`: Protege rutas que requieren autenticación
- ✅ Rutas actualizadas con nuevos componentes de autenticación
- ✅ Ruta `/profile` protegida con guard

### 7. **Componentes Actualizados**
- ✅ **ProductGridComponent**: Carga productos dinámicamente desde API (**sin fallback**)
- ✅ **CollectionsComponent**: Obtiene categorías desde backend (**sin fallback**)
- ✅ **HeaderComponent**: Muestra opciones de login/logout según estado de autenticación
- ✅ **ProfileComponent**: Lista pedidos del usuario desde la API
- ✅ **CartComponent**: Funcionalidad completa de checkout con validación de autenticación
- ⚠️ **IMPORTANTE**: Ya no hay datos estáticos - **requiere backend funcionando**

### 8. **Funcionalidad de Checkout**
- ✅ Validación de autenticación antes de checkout
- ✅ Creación de pedido en el backend
- ✅ Limpieza del carrito después de pedido exitoso
- ✅ Redirección a perfil para ver el pedido
- ✅ Manejo de errores con mensajes al usuario

## 🔧 Configuración Requerida

### 1. Configurar URL del Backend

Edita `src/app/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  baseUrl: 'http://localhost:5000/api', // ← Cambia esto a la URL de tu backend
  // ...
};
```

### 2. Configurar Google Sign-In

Para habilitar la autenticación con Google:

1. **Crear Proyecto en Google Cloud Console**:
   - Ve a https://console.cloud.google.com/
   - Crea un nuevo proyecto o selecciona uno existente
   - Ve a "APIs & Services" > "Credentials"

2. **Configurar OAuth 2.0**:
   - Click en "Create Credentials" > "OAuth client ID"
   - Tipo de aplicación: "Web application"
   - Authorized JavaScript origins: `http://localhost:4300` (o tu URL de desarrollo)
   - Authorized redirect URIs: `http://localhost:4300` (opcional para desarrollo)

3. **Copiar Client ID**:
   - Copia el Client ID generado

4. **Actualizar el Código**:
   Edita `src/app/pages/login/login.component.ts`:
   
   ```typescript
   private initializeGoogleSignIn(): void {
     if (typeof google !== 'undefined') {
       google.accounts.id.initialize({
         client_id: 'TU_CLIENT_ID_AQUI.apps.googleusercontent.com', // ← REEMPLAZA ESTO
         callback: this.handleGoogleResponse.bind(this)
       });
     }
   }
   ```

5. **Verificar Backend**:
   - Asegúrate de que tu backend .NET tiene implementado el endpoint `POST /api/auth/google-login`
   - El endpoint debe validar el token de Google y retornar un JWT propio

### 3. Configurar CORS en el Backend

En tu backend .NET 8, asegúrate de tener configurado CORS para permitir peticiones desde el frontend:

```csharp
// Program.cs o Startup.cs
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

## 🚀 Cómo Ejecutar

1. **Instalar dependencias** (si no lo has hecho):
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo**:
   ```bash
   npm start
   ```
   El frontend estará disponible en `http://localhost:4300/`

3. **Asegúrate de que el backend esté corriendo** en `http://localhost:5000` (o la URL configurada)

## 📋 Flujos de Usuario Implementados

### Flujo de Registro y Login
1. Usuario visita `/register`
2. Completa el formulario de registro
3. Al registrarse exitosamente, se autentica automáticamente
4. Es redirigido a la página principal con sesión iniciada

### Flujo de Recuperación de Contraseña
1. Usuario hace click en "¿Olvidaste tu contraseña?" en `/login`
2. Ingresa su email en `/forgot-password`
3. Recibe email con enlace de recuperación (backend maneja el envío)
4. Hace click en el enlace que lleva a `/reset-password?token=XXX&email=YYY`
5. Ingresa nueva contraseña
6. Es redirigido a `/login` para iniciar sesión

### Flujo de Compra
1. Usuario navega por productos y los agrega al carrito
2. Va a `/cart` y hace click en "Checkout"
3. Si no está autenticado, es redirigido a `/login?returnUrl=/cart`
4. Después de autenticarse, regresa al carrito
5. Completa el checkout
6. El pedido se crea en el backend
7. Es redirigido a `/profile` donde puede ver su pedido

## 🔍 Características Adicionales

### Manejo de Errores
- Todos los servicios HTTP manejan errores apropiadamente
- Mensajes de error amigables para el usuario
- **⚠️ Ya no hay fallback a datos estáticos - requiere API funcionando**

### Estados de Carga
- Spinners de carga mientras se obtienen datos
- Estados vacíos cuando no hay datos
- Mensajes de error informativos

### Seguridad
- JWT tokens almacenados en localStorage
- Tokens incluidos automáticamente en peticiones autenticadas
- Rutas protegidas con AuthGuard
- Validación de expiración de tokens

## 📝 Notas Importantes

1. **Google Sign-In**: Requiere configuración manual del Client ID
2. **Backend OBLIGATORIO**: Debe estar corriendo para que la aplicación funcione
3. **CORS**: Debe estar configurado en el backend
4. **⚠️ Sin Datos Estáticos**: El frontend ahora consume 100% API - sin fallbacks
5. **LocalStorage**: Los tokens y carrito se almacenan en localStorage del navegador

## 🐛 Solución de Problemas

### Error: "CORS policy blocked"
- Verifica que CORS esté configurado correctamente en el backend
- Asegúrate de que el origen permitido coincida con la URL del frontend

### Error: "Failed to fetch"
- Verifica que el backend esté corriendo
- Verifica la URL de la API en `api.config.ts`
- Revisa la consola del navegador para detalles

### Google Sign-In no funciona
- Verifica que hayas reemplazado el Client ID en `login.component.ts`
- Asegúrate de que la URL autorizada en Google Cloud Console coincida con tu URL local
- Revisa que el backend tenga implementado `/api/auth/google-login`

## 📚 Estructura de Archivos Nuevos

```
src/app/
├── config/
│   └── api.config.ts                 # Configuración de endpoints de API
├── models/
│   ├── product.model.ts              # Modelo de Product
│   ├── category.model.ts             # Modelo de Category
│   ├── user.model.ts                 # Modelos de User y Auth
│   └── order.model.ts                # Modelos de Order
├── services/
│   ├── product.service.ts            # Servicio de productos
│   ├── category.service.ts           # Servicio de categorías
│   ├── auth.service.ts               # Servicio de autenticación
│   └── order.service.ts              # Servicio de pedidos
├── interceptors/
│   └── auth.interceptor.ts           # Interceptor HTTP para JWT
├── guards/
│   └── auth.guard.ts                 # Guard de autenticación
└── pages/
    ├── login/                        # Componente de Login
    ├── register/                     # Componente de Registro
    ├── forgot-password/              # Componente de Recuperación
    └── reset-password/               # Componente de Restablecimiento
```

## ✅ Testing Recomendado

1. **⚠️ Backend REQUERIDO**: El frontend ya no tiene datos de fallback
2. **Con Backend Funcionando**: Prueba todos los flujos de autenticación
3. **Google Sign-In**: Verifica la integración completa
4. **Checkout**: Prueba el flujo completo de compra
5. **Permisos**: Verifica que las rutas protegidas funcionen correctamente
6. **Sin Backend**: La aplicación mostrará solo errores de carga

---

**¡El frontend requiere backend .NET 8 funcionando para mostrar datos!** ⚠️🎉
