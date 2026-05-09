import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { requireAdmin } from "@/lib/utils";

function makeSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB(); const { id } = await params;
  const product = await Product.findById(id).populate("category reviews.user", "name").lean();
  if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
  return NextResponse.json(product);
}
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin(); if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const update = { ...body, ...(body.name ? { slug: makeSlug(String(body.name)) } : {}) };
  const product = await Product.findByIdAndUpdate(id, update, { new: true });
  return NextResponse.json(product);
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin(); if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB(); const { id } = await params; await Product.findByIdAndDelete(id);
  return NextResponse.json({ message: "Product deleted" });
}
