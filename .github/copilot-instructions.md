# Copilot Instructions for Bosko (Angular Project)

## Project Overview
- This is a promotional **clothing e-commerce website** for the Bosko brand, showcasing apparel items with a modern, responsive UI.
- Built with **Angular CLI v19.2.13** and styled with **Tailwind CSS**.
- **No backend or database** - all data is static/hardcoded for front-end demonstration purposes.
- Uses a consistent **blue-and-white color scheme** (`bg-blue-600`, `text-white`) for branding.
- Main source code is in `src/app/` with components organized in `src/app/components/`.

## Key Workflows
- **Development server:** `ng serve` or `npm start` → runs at `http://localhost:4200/` with hot reload
- **Build:** `ng build` → outputs to `dist/`
- **Generate components:** `ng generate component components/<name> --skip-tests`
- **Clean cache:** Delete `.angular/` folder if encountering build issues
- **SSR disabled:** Server-side rendering has been removed from `angular.json` to simplify development

## Project Structure & Components
- **Layout Components** (in `src/app/components/`):
  - `header/` - Sticky top nav with brand logo, desktop nav links, and mobile hamburger menu
  - `sidebar/` - Collapsible left navigation with categories (Men, Women, Kids, Accessories, etc.)
  - `hero/` - Promotional banner with CTA buttons for featured collections
  - `product-card/` - Individual product display with image, name, price, and "Add to Cart" button
  - `product-grid/` - Responsive grid layout using `*ngFor` to display hardcoded product array
  - `footer/` - Contact info, quick links, and social media icons

- **Component Communication:**
  - Sidebar toggle uses custom events: `window.dispatchEvent(new CustomEvent('toggleSidebar'))` 
  - Header listens for sidebar toggle on mobile via hamburger button
  - Product data is hardcoded in `product-grid.component.ts` as an array of `Product` objects

- **Responsive Design:**
  - Mobile-first approach using Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
  - Sidebar: hidden off-canvas on mobile, visible on desktop (`lg:translate-x-0`)
  - Product grid: 1 column on mobile → 2 on tablet → 3-4 on desktop
  - Header: hamburger menu on mobile, full nav on desktop

## Styling Conventions
- **Tailwind CSS** is configured in `tailwind.config.js` with custom Bosko blue colors
- Global styles in `src/styles.css` include Tailwind directives: `@tailwind base/components/utilities`
- Component-specific styles use Tailwind utility classes directly in templates
- Common patterns:
  - Buttons: `bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all`
  - Cards: `bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl`
  - Layout: `flex`, `grid`, `container mx-auto px-4`

## Data Management
- Products are defined as static arrays in components (e.g., `product-grid.component.ts`)
- Product interface: `{ id: number, name: string, price: number, image: string, description?: string }`
- Placeholder images from Unsplash (`https://images.unsplash.com/...`)
- No API calls or backend integration - all content is client-side only

## Examples
- Generate new component: `ng generate component components/cart --skip-tests`
- Add new product category in sidebar: Edit `categories` array in `sidebar.component.ts`
- Change brand colors: Update `tailwind.config.js` theme colors and replace `bg-blue-600` classes
- Add new product: Push to `products` array in `product-grid.component.ts`

Refer to `README.md` for Angular CLI commands and project setup details.

