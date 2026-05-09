import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions); if (!session) return NextResponse.json({ message: "Login required" }, { status: 401 });
  await connectDB(); const { productId } = await request.json(); const user = await User.findById(session.user.id);
  const exists = user.wishlist.some((id: { toString: () => string }) => id.toString() === productId);
  const update = exists ? { $pull: { wishlist: productId } } : { $addToSet: { wishlist: productId } };
  const updatedUser = await User.findByIdAndUpdate(session.user.id, update, { new: true }).populate("wishlist");
  return NextResponse.json({ wishlist: updatedUser.wishlist, added: !exists });
}
