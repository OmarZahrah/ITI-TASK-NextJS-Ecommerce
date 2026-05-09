import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/utils";

export async function POST() {
  const session = await requireAdmin(); if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const timestamp = Math.round(Date.now() / 1000); const folder = "next-commerce";
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, process.env.CLOUDINARY_API_SECRET || "");
  return NextResponse.json({ timestamp, folder, signature, cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY });
}
