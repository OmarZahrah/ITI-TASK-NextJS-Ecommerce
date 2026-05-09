import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { Product } from "@/models/Product";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Login required" }, { status: 401 });
  await connectDB(); const { id } = await params; const { rating, comment } = await request.json();
  const product = await Product.findById(id);
  if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
  product.reviews.push({ user: session.user.id, name: session.user.name, rating, comment });
  product.rating = product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / product.reviews.length;
  await product.save();
  return NextResponse.json(product);
}
