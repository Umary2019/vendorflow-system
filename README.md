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

## Deploy On Vercel

This repository is configured for monorepo deployment on Vercel:

- React frontend is built from `client/`.
- Express backend runs as a Vercel serverless catch-all function at `api/[...path].js`.
- Frontend and API can share the same domain.

### 1. Import the repository in Vercel

- Framework preset: `Other`
- Root directory: project root (do not set to `client` or `server`)

`vercel.json` already defines:

- install command: `npm install`
- build command: `npm run build --workspace client`
- output directory: `client/dist`
- routing for `/api/*`

### 2. Add environment variables in Vercel

Set these in your Vercel project settings:

- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (for example `7d`)
- `CLIENT_URL` (your production frontend URL)
- `ALLOWED_ORIGINS` (comma-separated list for production + preview domains if needed)
- `VITE_API_URL=/api`

Do not use `http://localhost:5000` in production env vars. `localhost` only works on your own machine.

Recommended CORS configuration example:

```env
CLIENT_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-main-your-team.vercel.app
```

### 3. Redeploy after saving env vars

After adding env vars, trigger a new deployment so both frontend and API use the updated values.

### 4. Verify connectivity after deploy

1. Open `https://your-app.vercel.app/api/health` and confirm JSON response.
2. Open browser DevTools on your app and confirm auth/product requests target `/api/*` on your deployed domain.
3. If requests fail, verify Vercel env vars and ensure your backend CORS allowlist includes your app domain.

### Important Vercel caveat (uploads)

Vercel serverless file storage is ephemeral. Local disk uploads are not persistent between invocations.

- This project now returns a clear error if image file upload is attempted on Vercel.
- Use image URLs for product images in production, or integrate a persistent file service (Cloudinary, S3, etc.).
