import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

const registerSchema = z.object({ name: z.string().min(2), email: z.string().email(), phone: z.string().min(7).optional().or(z.literal("")), password: z.string().min(6) });

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: "Invalid registration data" }, { status: 400 });
  await connectDB();
  const { name, email, phone, password } = parsed.data;
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) return NextResponse.json({ message: "Email is already registered" }, { status: 409 });
  const hashedPassword = await bcrypt.hash(password, 12);
  await User.create({ name, email, phone, password: hashedPassword });
  return NextResponse.json({ message: "Account created" }, { status: 201 });
}
