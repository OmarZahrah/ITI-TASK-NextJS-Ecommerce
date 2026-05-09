export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { AdminCategories } from "./categories-client";

export default async function AdminCategoriesPage() {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();
  return <AdminCategories categories={JSON.parse(JSON.stringify(categories))} />;
}
