# Next Store

Next Store is a full-stack e-commerce project I built to deliver a modern shopping experience with a complete admin dashboard.
It covers the full flow from product discovery to checkout, while giving admins full control over products, categories, users, and orders.

## Project Highlights

- Customer and admin authentication (credentials + Google OAuth)
- Role-based access with protected admin routes
- Full CRUD in admin panel for products, categories, users, and orders
- Product catalog with filtering, search, featured sections, and reviews
- Cart, checkout, and order tracking flow
- Profile and wishlist management
- Cloudinary integration for image uploads

## Tech Stack

- Frontend: Next.js App Router, React, Tailwind CSS
- Backend: Next.js Route Handlers (REST-style APIs)
- Database: MongoDB with Mongoose
- Auth: NextAuth (Credentials + Google)
- Media: Cloudinary (signed uploads)

## Admin Dashboard

The admin dashboard is designed as an operations center for the store:

- Manage products (create, update, delete, feature, upload images)
- Manage categories (create, update, delete with relation checks)
- Manage users (promote/demote, restrict/approve, delete)
- Manage orders (status updates and delete support)
- View store overview metrics and low-stock alerts

## Project Focus

This project focuses on:

- Clean UI/UX for both customer and admin sides
- Secure role-based authorization
- Scalable data modeling for real e-commerce operations
- Practical full-stack implementation using one modern framework

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env.local`:

- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

3. Run the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.
