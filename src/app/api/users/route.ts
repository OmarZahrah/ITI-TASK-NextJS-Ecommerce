import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/utils";

export async function GET() {
  const session = await requireAdmin(); if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB(); return NextResponse.json(await User.find().select("-password").sort({ createdAt: -1 }).lean());
}
