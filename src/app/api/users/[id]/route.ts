import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin(); if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB(); const { id } = await params;
  return NextResponse.json(await User.findByIdAndUpdate(id, await request.json(), { new: true }).select("-password"));
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await params;
  if (session.user.id === id) {
    return NextResponse.json({ message: "You cannot delete your own account." }, { status: 400 });
  }
  await User.findByIdAndDelete(id);
  return NextResponse.json({ message: "User deleted" });
}
