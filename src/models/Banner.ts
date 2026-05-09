import mongoose, { Schema, models } from "mongoose";

const bannerSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    image: { type: String, default: "" },
    ctaLabel: { type: String, default: "Shop now" },
    ctaHref: { type: String, default: "/products" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Banner = models.Banner || mongoose.model("Banner", bannerSchema);
