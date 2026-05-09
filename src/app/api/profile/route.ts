import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions); if (!session) return NextResponse.json({ message: "Login required" }, { status: 401 });
  await connectDB(); return NextResponse.json(await User.findById(session.user.id).select("-password").populate("wishlist").lean());
}
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions); if (!session) return NextResponse.json({ message: "Login required" }, { status: 401 });
  await connectDB(); const body = await request.json();
  return NextResponse.json(await User.findByIdAndUpdate(session.user.id, { name: body.name, phone: body.phone, address: body.address, paymentDetails: body.paymentDetails }, { new: true }).select("-password"));
}
