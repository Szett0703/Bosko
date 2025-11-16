# Copilot Instructions for Bosko (Angular Project)

## 🎯 Project Overview
- **E-commerce platform** for Bosko clothing brand with modern, professional UI/UX
- Built with **Angular CLI v19.2.13** (standalone components) + **Tailwind CSS**
- **Backend Integration**: ASP.NET Core API on `https://localhost:5006` (documented in `comunicacion-backend/`)
- **Design System**: Blue gradient theme (`#3b82f6` to `#2563eb`) with white accents
- **Architecture**: Feature-based structure with pages, components, services, guards, interceptors
- Main source: `src/app/` with modular organization (pages/, components/, services/, admin/)

## 🚀 Development Workflows

### **Server & Build**
- **Dev server:** `npm start` → `http://localhost:4200/` (or auto-port like 4300)
- **Build:** `ng build` → outputs to `dist/`
- **Error checking:** Always run `get_errors` before starting server
- **Fix & run:** Correct TypeScript errors immediately, then start server
- **Clean cache:** Delete `.angular/` folder if encountering build cache issues

### **Component Generation**
```bash
ng generate component pages/<name> --skip-tests
ng generate component components/<name> --skip-tests
ng generate service services/<name> --skip-tests
ng generate guard guards/<name> --skip-tests
```

### **Code Quality Standards**
- ✅ **Always check for errors** before declaring work complete
- ✅ **Fix all TypeScript errors** immediately (syntax, types, imports)
- ✅ **Use multi_replace_string_in_file** for multiple edits (efficiency)
- ✅ **Test compilation** after significant changes
- ✅ **No placeholder code** - implement complete, working solutions
- ✅ **Consistent naming**: kebab-case for files, PascalCase for classes, camelCase for variables
- ❌ **NO STATIC/MOCK DATA** - Always integrate with real backend API, never use hardcoded arrays or setTimeout simulations
- ❌ **NO FALLBACK DATA** - If backend fails, show proper error messages, never populate with fake data
- ✅ **BACKEND ERROR REPORTING** - When there's a 500 error, generate a formatted message in console with:
  - Endpoint and parameters used
  - Error details from server
  - Stack trace if available
  - Checklist for backend team to debug
  - Mark message clearly as "MENSAJE PARA EL BACKEND" so user can copy and send it


## 🏗️ Project Architecture

### **Public Pages** (`src/app/pages/`)
- `home/` - Landing page with hero, featured products, collections
- `collections/` - Product catalog with filters and grid
- `cart/` - Shopping cart with item management
- `login/` - Modern split-screen authentication (left image, right form)
- `register/` - Split-screen registration matching login design
- `profile/` - User account management with avatar and order history
- `contact/` - Contact form with company info
- `about/` - Brand story and team information
- `forgot-password/`, `reset-password/` - Password recovery flow
- `forbidden/` - 403 error page for unauthorized access

### **Admin Panel** (`src/app/admin/`)
- **Layout:** `components/admin-layout/` - Modern dark sidebar (collapsible 280px → 80px), header with breadcrumbs, search, notifications, user profile
- **Dashboard:** `pages/dashboard/` - Stats cards (sales, orders, customers, products), charts placeholders, recent orders table, top products, activity feed
- **Management Pages:** `pages/products/`, `pages/orders/`, `pages/categories/`, `pages/users/` (pending implementation)
- **Design:** Dark theme (#1e293b), blue accents (#3b82f6), fully responsive, smooth animations

### **Shared Components** (`src/app/components/`)
- `header/` - Sticky nav with logo, links, mobile hamburger menu
- `sidebar/` - Category navigation (collapsible on mobile)
- `hero/` - Promotional banner with CTA buttons
- `product-card/` - Individual product display with hover effects
- `product-grid/` - Responsive grid using `*ngFor`
- `footer/` - Links, contact info, social media

### **Services** (`src/app/services/`)
- `auth.service.ts` - JWT authentication, login/register, token management
- `product.service.ts` - Product CRUD operations
- `cart.service.ts` - Shopping cart state management
- `order.service.ts` - Order creation and tracking
- `category.service.ts` - Category management
- `wishlist.service.ts` - User wishlist
- `address.service.ts` - Shipping addresses
- `review.service.ts` - Product reviews
- `language.service.ts` - i18n support

### **Guards & Interceptors**
- `guards/auth.guard.ts` - Protect authenticated routes
- `guards/role.guard.ts` - Admin/Employee role-based access
- `interceptors/auth.interceptor.ts` - Attach JWT to requests, handle 401 errors

### **Models** (`src/app/models/`)
- TypeScript interfaces: `User`, `Product`, `Order`, `Category`, `Address`, `Review`, `Wishlist`
- Consistent with backend API contracts (documented in `comunicacion-backend/`)

## 🎨 Design System & Styling

### **Color Palette**
```css
Primary Blue: #3b82f6 → #2563eb (gradients)
Success Green: #10b981
Warning Yellow: #fbbf24
Error Red: #ef4444
Purple Accent: #a855f7
Orange Accent: #f97316

Dark Theme (Admin):
  Background: #1e293b → #0f172a
  Text: #f8fafc
  Borders: #334155
```

### **Tailwind Patterns**
```html
<!-- Buttons -->
<button class="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 font-semibold">
  Action
</button>

<!-- Cards -->
<div class="bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 p-6">
  Content
</div>

<!-- Gradients -->
<div class="bg-gradient-to-r from-blue-600 to-blue-700">
  Gradient Background
</div>

<!-- Admin Dark Cards -->
<div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
  Admin Content
</div>
```

### **Responsive Breakpoints**
- **Mobile:** < 640px (1 column grids, hamburger menus)
- **Tablet:** 640px - 1024px (2 column grids)
- **Desktop:** 1024px - 1280px (3-4 column grids, visible sidebars)
- **Large:** > 1280px (max-width containers, expanded layouts)

### **Component Styling Rules**
- ✅ Use Tailwind utilities directly in templates (avoid custom CSS unless necessary)
- ✅ Consistent spacing: `px-4 py-6` for sections, `gap-4` for grids
- ✅ Smooth transitions: `transition-all duration-300`
- ✅ Hover states on interactive elements: `hover:scale-105`, `hover:bg-blue-700`
- ✅ Mobile-first approach: base styles for mobile, then `sm:`, `md:`, `lg:` breakpoints

## 🔐 Authentication & Authorization

### **Auth Flow**
1. User logs in → `AuthService.login()` → receives JWT token
2. Token stored in localStorage: `localStorage.setItem('token', jwt)`
3. `AuthInterceptor` attaches token to all API requests: `Authorization: Bearer {token}`
4. `AuthGuard` protects routes: redirects to `/login` if not authenticated
5. `RoleGuard` checks roles: redirects to `/forbidden` if insufficient permissions

### **User Roles**
- **Customer:** Access to public pages, cart, orders, profile
- **Employee:** Access to admin dashboard, view orders/products (read-only)
- **Admin:** Full access to all admin features (CRUD operations)

### **Protected Routes**
```typescript
// Public routes - no guard
/home, /collections, /login, /register, /about, /contact

// Authenticated routes - AuthGuard
/profile, /cart, /orders

// Admin routes - AuthGuard + RoleGuard (Admin, Employee)
/admin/dashboard, /admin/orders, /admin/products, /admin/categories, /admin/users
```

## 🔌 Backend Integration

### **API Configuration** (`src/app/config/api.config.ts`)
```typescript
export const API_URL = 'https://localhost:5006';
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    // ...
  },
  products: '/api/products',
  // ...
};
```

### **Backend Documentation**
- **Main docs:** `comunicacion-backend/ADMIN-PANEL-ENDPOINTS.md`
- **Auth endpoints:** Login, register, forgot password, reset password
- **Admin endpoints:** Dashboard stats, orders, products, categories, users
- **All endpoints** documented with request/response examples, authorization levels

### **Service Pattern**
```typescript
// Example: ProductService
@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${API_URL}/api/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
  
  // CRUD methods...
}
```

## 🛠️ Development Best Practices

### **Before Starting Work**
1. ✅ Read user requirements carefully
2. ✅ Check existing code structure with `semantic_search` or `grep_search`
3. ✅ Understand component relationships and data flow
4. ✅ Plan multi-step work with task breakdown

### **During Implementation**
1. ✅ **Fix errors immediately** - don't leave broken code
2. ✅ **Use `multi_replace_string_in_file`** for multiple edits (faster, more efficient)
3. ✅ **Include context** in replacements (3-5 lines before/after)
4. ✅ **Test incrementally** - verify compilation after major changes
5. ✅ **Match existing patterns** - consistent with codebase style

### **Common Errors to Avoid**
- ❌ **Syntax errors:** Missing commas, extra commas in arrays/objects
- ❌ **Type errors:** Wrong property types, number formatting (e.g., `1, 243` instead of `1243`)
- ❌ **Import errors:** Missing imports, wrong paths
- ❌ **Template errors:** Unclosed tags, wrong directive syntax
- ❌ **Placeholder code:** Comments like `// TODO` or `...existing code...`

### **Quality Checklist**
- [ ] No TypeScript compilation errors (`get_errors` returns clean)
- [ ] All imports are correct and paths are absolute
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Consistent styling with existing components
- [ ] Services use proper error handling (try/catch, catchError)
- [ ] Routes are configured correctly in routing modules
- [ ] Guards are applied where needed (auth, roles)

## 📁 File Organization

### **Naming Conventions**
- **Files:** `kebab-case.component.ts`, `user.service.ts`, `auth.guard.ts`
- **Classes:** `PascalCase` → `ProductCardComponent`, `AuthService`
- **Variables/Methods:** `camelCase` → `getUserData()`, `isLoggedIn`
- **Constants:** `UPPER_SNAKE_CASE` → `API_URL`, `DEFAULT_PAGE_SIZE`

### **Component Structure**
```
component-name/
  ├── component-name.component.ts    # Logic & data
  ├── component-name.component.html  # Template
  └── component-name.component.css   # Styles (if Tailwind not enough)
```

### **Module Organization**
- **Pages:** Feature components with routing (`src/app/pages/`)
- **Components:** Reusable UI components (`src/app/components/`)
- **Services:** Business logic and API calls (`src/app/services/`)
- **Models:** TypeScript interfaces (`src/app/models/`)
- **Guards:** Route protection (`src/app/guards/`)
- **Admin:** Separate admin feature module (`src/app/admin/`)

## 🎯 Communication Guidelines

### **Documentation for Backend**
- ✅ **Always create docs** when backend endpoints are needed
- ✅ **Store in:** `comunicacion-backend/` folder
- ✅ **Include:** Request/response examples, auth requirements, error codes
- ✅ **Format:** Markdown with clear sections and code blocks
- ✅ **Examples:** See `ADMIN-PANEL-ENDPOINTS.md` for reference

### **User Communication**
- ✅ Be concise and clear (1-3 sentences for simple tasks)
- ✅ Confirm what was done, not how it was done
- ✅ Report errors immediately with solutions
- ✅ Use Spanish for user communication (code/comments in English)
- ✅ Provide next steps or options when work is complete

## 🚀 Workflow Optimization

### **Efficient Tool Usage**
1. **Multiple edits:** Use `multi_replace_string_in_file` instead of sequential `replace_string_in_file`
2. **Parallel reads:** Read multiple files simultaneously when gathering context
3. **Smart searching:** Use `semantic_search` for concepts, `grep_search` for exact strings
4. **Error first:** Always run `get_errors` before claiming completion

### **Task Management**
- ✅ Break complex work into clear, actionable steps
- ✅ Complete one task fully before moving to next
- ✅ Verify each step compiles without errors
- ✅ Document backend requirements as you go

### **Creative Freedom**
- ✅ User grants freedom to design modern, professional UIs
- ✅ Follow established design patterns (gradients, cards, animations)
- ✅ Innovate within the brand guidelines (blue theme, clean layouts)
- ✅ Document any backend needs for implementation

## 📝 Examples & Patterns

### **Generate Admin Page**
```bash
ng generate component admin/pages/products --skip-tests
ng generate component admin/pages/orders --skip-tests
```

### **Create Service with Backend Integration**
```typescript
// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${API_URL}/api/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
```

### **Protected Route with Guard**
```typescript
// src/app/app.routes.ts
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/components/admin-layout/admin-layout.component'),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Employee'] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./admin/pages/dashboard/admin-dashboard.component') }
    ]
  }
];
```

### **Split-Screen Auth Page Pattern**
```html
<!-- Used in login/register pages -->
<div class="min-h-screen flex">
  <!-- Left side: Image -->
  <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 items-center justify-center">
    <img src="assets/images/auth-image.jpg" alt="Bosko" class="w-full h-full object-cover">
  </div>
  
  <!-- Right side: Form -->
  <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
    <div class="max-w-md w-full">
      <h2 class="text-3xl font-bold text-gray-900 mb-8">Iniciar Sesión</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <!-- Form fields -->
      </form>
    </div>
  </div>
</div>
```

### **Admin Dark Card Pattern**
```html
<!-- Used in admin dashboard -->
<div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-gray-400 text-sm">Label</p>
      <p class="text-white text-3xl font-bold mt-2">Value</p>
    </div>
    <div class="bg-blue-500/10 p-4 rounded-lg">
      <svg class="w-8 h-8 text-blue-500"><!-- Icon --></svg>
    </div>
  </div>
</div>
```

## 🔍 Debugging & Troubleshooting

### **Common Issues & Solutions**

**Issue:** Port 4200/4300 already in use
```bash
# Solution: Use different port
echo "Y" | npm start
```

**Issue:** Compilation errors with commas
```typescript
// ❌ Wrong
{ value: 1, 243 }

// ✅ Correct  
{ value: 1243 }
```

**Issue:** Missing imports
```typescript
// Always check imports at top of file
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
```

**Issue:** Cache problems
```bash
# Delete .angular folder
Remove-Item -Recurse -Force .angular
npm start
```

### **Error Prevention**
1. ✅ Always run `get_errors` before finishing work
2. ✅ Test in browser after major changes
3. ✅ Verify responsive design at multiple breakpoints
4. ✅ Check console for runtime errors
5. ✅ Validate API integration with backend docs

## 📚 Additional Resources

- **Angular Docs:** https://angular.dev
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Project README:** `README.md` for setup and commands
- **Backend Specs:** `comunicacion-backend/` for API documentation
- **Git Repo:** Szett0703/Bosko on branch `Szett`

---

**Last Updated:** November 16, 2025  
**Version:** 2.0 - Complete E-commerce with Admin Panel  
**Status:** 🚀 Production Ready (Frontend) | ⏳ Backend Integration Pending


