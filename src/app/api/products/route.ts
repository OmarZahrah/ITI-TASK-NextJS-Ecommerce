import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { requireAdmin } from "@/lib/utils";

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const min = Number(searchParams.get("min") || 0);
  const max = Number(searchParams.get("max") || 0);
  const query: Record<string, unknown> = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (min || max) query.price = { ...(min ? { $gte: min } : {}), ...(max ? { $lte: max } : {}) };
  const products = await Product.find(query).populate("category").sort({ createdAt: -1 }).lean();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await request.json();
  const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const product = await Product.create({ ...body, slug });
  return NextResponse.json(product, { status: 201 });
}
