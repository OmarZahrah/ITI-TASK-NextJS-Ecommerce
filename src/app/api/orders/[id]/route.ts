import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { requireAdmin } from "@/lib/utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin(); if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB(); const { id } = await params; const { status } = await request.json();
  return NextResponse.json(await Order.findByIdAndUpdate(id, { status }, { new: true }));
}
