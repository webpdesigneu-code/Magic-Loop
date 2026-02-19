# Magic Loop - Project Context

## 1. Project Overview
**Magic Loop** (HandmadeByAnna) is a bilingual (Polish/Swedish) e-commerce showcase website for handmade crochet products. It features a modern, responsive design, a product catalog with filtering, and a custom admin panel for managing products and orders. The site does not handle payments directly; instead, it facilitates orders via email inquiry forms.

**Live URL:** [https://magicloop.se](https://magicloop.se)

## 2. Tech Stack
-   **Framework:** Next.js 15 (App Router)
-   **Language:** TypeScript
-   **Styling:** CSS Modules with global variables (`app/globals.css`)
-   **Icons:** React Icons (Lucide)
-   **Email:** Resend API
-   **Deployment:** VPS (Hostinger) via SSH + PM2

## 3. Project Structure
```
/app
  /admin          # Admin panel (login, dashboard)
  /api            # Backend API routes (auth, products, orders, upload)
  /globals.css    # Global styles (variables, reset, typography)
  page.tsx        # Homepage (Hero, Products, About, FAQ)
  layout.tsx      # Root layout (fonts, metadata)

/components       # Reusable UI components
  Header.tsx      # Navigation & Mobile Menu
  Hero.tsx        # Hero section
  Products.tsx    # Product grid with filtering
  ProductCard.tsx # Individual product display
  Footer.tsx      # Footer with contact info
  OrderModal.tsx  # Order inquiry form

/data
  products.json   # Flat file database for products
  orders.json     # Flat file database for orders (generated)
  settings.json   # App settings (notification email)
  users.json      # Admin credentials (hashed)

/lib
  i18n.ts         # Internationalization dictionary (PL/SE)
  types.ts        # TypeScript interfaces
  email.ts        # Email sending logic (Resend)

/public           # Static assets (images, uploads)
/scripts          # Utility scripts (e.g., password hashing)
```

## 4. Key Features
### Frontend
-   **Bilingual Support:** Switch between PL and SE via `i18n.ts`.
-   **Responsive Design:** Mobile-first approach with a custom hamburger menu.
-   **Product Filtering:** Filter by categories (Pluszaki, Dekoracje, Kwiaty).
-   **Order Modal:** Custom form for product inquiries.

### Backend (Admin Panel)
-   **Authentication:** Cookie-based session with hashed passwords.
-   **Product Management:** CRUD operations for products (images, prices in PLN/SEK, descriptions).
-   **Order Management:** View and update status of inquiries.
-   **Image Upload:** Drag-and-drop upload to `/public/uploads`.
-   **Settings:** Update notification email address.

## 5. Configuration
### Environment Variables
The application relies on `.env.local` (local) or system environment variables (VPS).
-   `RESEND_API_KEY`: API key for sending emails.
-   `ANNA_EMAIL`: Default notification receiver (overridden by `settings.json`).
-   `ADMIN_PASSWORD`: Plaintext password for admin access (default: `Test123` if unset).

### Styling System
Global colors and spacing are defined in `app/globals.css`:
-   `--color-primary`, `--color-secondary`: Business logic colors.
-   `--color-green`, `--color-green-dark`: Admin panel actions.
-   `--font-heading`: Quicksand.
-   `--font-body`: Nunito.

## 6. Deployment
The project is deployed on a Hostinger VPS.
-   **Server:** Nginx (Reverse Proxy to localhost:3000)
-   **Process Manager:** PM2 (name: `handmade`)
-   **Deployment Script:** `./deploy.sh` (handles build, upload, and restart)

### How to Deploy
1.  Run `./deploy.sh` locally.
2.  Enter VPS credentials (User: `root`, IP: `93.127.214.180`).
3.  The script uploads files, runs `npm install`, and reloads PM2.

## 7. Admin Access
-   **URL:** `/admin`
-   **Login:** Any email address (form validation only).
-   **Password:** Managed via environment variable `ADMIN_PASSWORD` (currently set to `MagicLoop2024!` on production).
