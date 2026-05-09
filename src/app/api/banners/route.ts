import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Banner } from "@/models/Banner";
import { requireAdmin } from "@/lib/utils";

export async function GET() { await connectDB(); return NextResponse.json(await Banner.find().sort({ createdAt: -1 }).lean()); }
export async function POST(request: Request) { const session = await requireAdmin(); if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); await connectDB(); return NextResponse.json(await Banner.create(await request.json()), { status: 201 }); }
