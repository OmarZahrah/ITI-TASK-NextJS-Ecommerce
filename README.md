# Next Store

A modern full-stack e-commerce platform built with Next.js App Router, Tailwind CSS, MongoDB, Cloudinary, and NextAuth OAuth.

## Features

- Email/phone registration and login
- Google OAuth login
- Customer and admin roles (admin restrict/approve as soft delete)
- Profile management with name, address, payment notes
- Wishlist and favorites
- Product categories, listings, search, filtering, images, stock, reviews and ratings
- Cart with add/remove and quantity updates
- Guest or authenticated checkout
- Multiple payment methods: Credit Card, PayPal, Cash on Delivery, Wallet
- Order placement, order history, and admin status tracking
- Admin management for users, products, categories, orders, and homepage banners
- Cloudinary image hosting + signed upload API endpoint

## Setup

1. Install dependencies (already installed in this scaffold):

```bash
npm install
```

2. Update `.env.local` with your real credentials:
   - MONGODB_URI from MongoDB Atlas
   - NEXTAUTH_SECRET (generate with `openssl rand -base64 32`)
   - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET from https://console.cloud.google.com
   - CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET from https://cloudinary.com

3. Run the dev server:

```bash
npm run dev
```

4. Visit http://localhost:3000.

## Promote First Admin

Register a normal account first, then in your MongoDB collection set the user document `role` field to `admin`.

## API Endpoints

- `POST /api/auth/register` - register customer
- `GET/POST /api/products` - list products / admin create
- `GET/PATCH/DELETE /api/products/:id` - product detail / admin edit / admin delete
- `POST /api/products/:id/reviews` - authenticated review
- `GET/POST /api/categories` - list / admin create
- `GET/POST /api/orders` - list (own/admin all) / create order (guest or auth)
- `PATCH /api/orders/:id` - admin status change
- `GET/PATCH /api/profile` - manage profile
- `POST /api/wishlist` - toggle product in wishlist
- `GET/POST /api/banners` - manage banners
- `GET /api/users` / `PATCH /api/users/:id` - admin user management
- `POST /api/cloudinary/signature` - returns signed upload params for Cloudinary direct upload

## OAuth

Google login is wired through NextAuth. To enable it: create OAuth credentials with redirect URI `http://localhost:3000/api/auth/callback/google` and paste them into `.env.local`.

# ITI-TASK-NextJS-Ecommerce
