import mongoose, { Schema, models } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Category = models.Category || mongoose.model("Category", categorySchema);
