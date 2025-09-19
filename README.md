# Café Aroma — Full Stack Coffee Shop Experience

Café Aroma is a production-ready web experience for a boutique coffee shop, featuring a warm and inviting UI, a fully functional shopping cart, admin menu management, and an Express API backed by JSON storage (with easy upgrade paths for MongoDB or PostgreSQL).

## Features

### Frontend (React + Vite)
- Responsive five-page website (Home, About, Menu, Contact, Shop) with earthy, modern café styling and subtle animations.
- Dynamic menu browser with category filtering, richly illustrated cards, and “add to cart” interactions.
- Persistent cart with real-time badge updates, quantity controls, checkout form, and server-backed total calculations.
- Admin portal for authenticated menu management (create/delete items) and viewing recent orders.
- Built with React Router, CSS Modules, Framer Motion animations, and React Context for cart state.

### Backend (Node.js + Express)
- RESTful API exposing menu CRUD operations, cart calculation, and order submission/history endpoints.
- Basic authentication for admin-only routes (`POST/PUT/DELETE /api/menu` and `GET /api/orders`).
- JSON-file persistence via simple storage helpers and a seed script with rich demo data.
- Configurable via environment variables (`PORT`, `ADMIN_USER`, `ADMIN_PASS`, `TAX_RATE`).

## Project Structure

```
backend/   → Express API server, seed script, and data storage
frontend/  → Vite + React client application
```

## Prerequisites

- Node.js 18+
- npm 9+

## Getting Started

### 1. Clone & Install

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 2. Seed Demo Data (optional but recommended)

```bash
npm run seed --prefix backend
```

This populates `backend/data/menu.json` with curated drinks and pastries and resets `backend/data/orders.json`.

### 3. Configure Environment Variables

Copy the provided example to `.env` (adjust as desired):

```bash
cp backend/.env.example backend/.env
```

Default admin credentials are `admin / password123`.

### 4. Run the API Server

```bash
npm run dev --prefix backend
```

The API listens on `http://localhost:4000` (configurable via `.env`). Key endpoints include:

- `GET /api/menu` — list menu items (supports `?category=` filter)
- `POST /api/cart` — calculate totals for an array of `{ id, quantity }`
- `POST /api/orders` — submit an order (customer info + items)
- `POST /api/menu` — create menu item *(admin only)*
- `GET /api/orders` — order history *(admin only)*

### 5. Run the Frontend

In a new terminal session:

```bash
npm run dev --prefix frontend
```

By default the client expects the API at `http://localhost:4000/api`. Override with `VITE_API_URL` if the backend runs elsewhere.

### 6. Production Builds

```bash
npm run build --prefix backend   # (optional) ensure backend compiles
npm run build --prefix frontend  # generates production-ready assets in frontend/dist
```

Deploy the frontend build to any static host and run the Express server on Node-friendly hosting.

## Admin Workflow

1. Navigate to **Admin** in the site navigation.
2. Sign in with the credentials from your `.env`.
3. Add menu items with name, description, price, category, and image URL.
4. Remove items from the menu grid or review order history submitted via checkout.

## Tech Notes & Extensibility

- **Storage**: The API currently uses JSON files for simplicity. Swap `readMenu/writeMenu` in `backend/src/storage.js` with database logic to integrate MongoDB or PostgreSQL.
- **Auth**: Basic Auth keeps the demo lightweight. Replace with JWT or session-based auth for production systems.
- **Styling**: CSS Modules ensure component-scoped styling, while shared color variables live in `src/index.css`.
- **Animations**: Framer Motion powers smooth entrances for cards, sections, and cart interactions to reinforce the premium café experience.

## Testing the Experience

- Browse the **Menu** to add drinks and pastries to the cart; the cart badge updates instantly.
- Visit **Shop** to adjust quantities, see totals recomputed by the backend, and complete the checkout form (orders persist to `backend/data/orders.json`).
- Use the **Admin** page to add/remove items and inspect submitted orders.

Enjoy brewing delightful digital experiences with Café Aroma! ☕️
