import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, select: false },
    image: { type: String },
    address: { type: String, default: "" },
    paymentDetails: { type: String, default: "" },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isRestricted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const User = models.User || mongoose.model("User", userSchema);
