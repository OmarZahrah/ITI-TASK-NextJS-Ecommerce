import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { requireAdmin } from "@/lib/utils";

export async function GET() { await connectDB(); return NextResponse.json(await Category.find().sort({ name: 1 }).lean()); }
export async function POST(request: Request) {
  const session = await requireAdmin(); if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB(); const body = await request.json(); const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return NextResponse.json(await Category.create({ ...body, slug }), { status: 201 });
}
