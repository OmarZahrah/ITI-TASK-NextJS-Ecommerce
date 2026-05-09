import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { requireAdmin } from "@/lib/utils";

function makeSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const update = {
    ...body,
    ...(body.name ? { slug: makeSlug(String(body.name)) } : {}),
  };

  const category = await Category.findByIdAndUpdate(id, update, { new: true });
  if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });

  return NextResponse.json(category);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const inUse = await Product.exists({ category: id });
  if (inUse) {
    return NextResponse.json(
      { message: "This category is assigned to products. Reassign or delete those products first." },
      { status: 400 },
    );
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });

  return NextResponse.json({ message: "Category deleted" });
}
