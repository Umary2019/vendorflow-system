# Multi-Vendor Marketplace (Mini Full-Stack App)

A modern, responsive marketplace mini app built with:

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT
- Password hashing: bcrypt

## Project Structure

- client/
  - src/components/
  - src/pages/
  - src/context/
  - src/hooks/
- server/
  - src/controllers/
  - src/routes/
  - src/models/
  - src/middleware/
  - src/utils/
  - src/seed/

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure backend env:

```bash
cp server/.env.example server/.env
```

3. Configure frontend env:

```bash
cp client/.env.example client/.env
```

4. Seed data (optional but recommended):

```bash
npm run seed
```

5. Run both client and server:

```bash
npm run dev
```

## Default Seed Accounts

- Admin: admin@marketplace.com / Admin123!
- Seller: seller@marketplace.com / Seller123!
- Buyer: buyer@marketplace.com / Buyer123!

## API Routes

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Users (admin)
- GET /api/users
- PATCH /api/users/:id/role
- PATCH /api/users/:id/status
- DELETE /api/users/:id

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PATCH /api/products/:id
- DELETE /api/products/:id
- PATCH /api/products/:id/approve

### Cart
- GET /api/cart
- POST /api/cart/add
- DELETE /api/cart/remove/:productId
- DELETE /api/cart/clear

### Orders
- POST /api/orders
- GET /api/orders/my-orders
- GET /api/orders/all
- PATCH /api/orders/:id/status
