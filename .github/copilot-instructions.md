# Copilot Instructions for Bosko (Angular Project)

## Project Overview
- This is an Angular application scaffolded with Angular CLI v19.2.13.
- Main source code is in `src/app/`.
- Entry points: `src/main.ts` (browser), `src/main.server.ts` (server-side rendering), and `src/server.ts` (Node server).
- Styles are in `src/styles.css` and `src/app/app.component.css`.

## Key Workflows
- **Development server:**
  - Start with `ng serve` (or `npm start` if configured).
  - App runs at `http://localhost:4200/` and reloads on source changes.
- **Build:**
  - Run `ng build` to output to `dist/`.
- **Unit tests:**
  - Run `ng test` (Karma runner).
- **End-to-end tests:**
  - Run `ng e2e` (no default framework; user must configure).

## Project Structure & Patterns
- **Components:**
  - Located in `src/app/`, e.g., `app.component.ts`.
  - Use Angular CLI for scaffolding: `ng generate component <name>`.
- **Routing:**
  - Defined in `src/app/app.routes.ts`.
- **Configuration:**
  - App config in `src/app/app.config.ts` and `app.config.server.ts`.
- **Server-side rendering:**
  - Handled via `src/main.server.ts` and `src/server.ts`.

## Conventions & Integration
- Use Angular CLI conventions for file/folder naming and code structure.
- Prefer Angular CLI commands for generating code and managing dependencies.
- No custom AI agent rules or conventions found beyond this file.

## Examples
- To add a new component: `ng generate component my-feature`
- To update routes: edit `src/app/app.routes.ts`

Refer to `README.md` for more details on commands and workflows.
