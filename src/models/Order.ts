import mongoose, { Schema, models } from "mongoose";

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    guest: { name: String, email: String, phone: String },
    items: [orderItemSchema],
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, enum: ["Credit Card", "PayPal", "Cash on Delivery", "Wallet"], required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ["Placed", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Placed" },
  },
  { timestamps: true },
);

export const Order = models.Order || mongoose.model("Order", orderSchema);
