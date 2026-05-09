export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { AdminProducts } from "./products-client";

export default async function AdminProductsPage() {
  await connectDB();
  const [products, categories] = await Promise.all([
    Product.find().populate("category").sort({ createdAt: -1 }).lean(),
    Category.find().lean(),
  ]);
  return (
    <AdminProducts
      initialProducts={JSON.parse(JSON.stringify(products))}
      categories={JSON.parse(JSON.stringify(categories))}
    />
  );
}
