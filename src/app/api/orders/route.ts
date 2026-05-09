import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Login required" }, { status: 401 });
  await connectDB(); const query = session.user.role === "admin" ? {} : { user: session.user.id };
  return NextResponse.json(await Order.find(query).populate("user", "name email").sort({ createdAt: -1 }).lean());
}
export async function POST(request: Request) {
  const session = await getServerSession(authOptions); await connectDB(); const body = await request.json();
  const ids = body.items.map((item: { product: string }) => item.product); const products = await Product.find({ _id: { $in: ids } });
  const items = body.items.map((item: { product: string; quantity: number }) => {
    const product = products.find((p) => p._id.toString() === item.product);
    if (!product || product.stock < item.quantity) throw new Error("Product unavailable");
    return { product: product._id, name: product.name, image: product.images?.[0], price: product.price, quantity: item.quantity };
  });
  const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 12; const tax = Number((subtotal * 0.08).toFixed(2)); const total = subtotal + shipping + tax;
  const order = await Order.create({ user: session?.user.id, guest: session ? undefined : body.guest, items, shippingAddress: body.shippingAddress, paymentMethod: body.paymentMethod, subtotal, shipping, tax, total });
  await Promise.all(items.map((item: { product: string; quantity: number }) => Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })));
  return NextResponse.json(order, { status: 201 });
}
