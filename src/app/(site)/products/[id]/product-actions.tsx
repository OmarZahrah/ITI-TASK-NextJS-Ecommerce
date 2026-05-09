"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

type Product = { _id: string; name: string; price: number; image: string; stock: number };

export function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [message, setMessage] = useState("");
  const outOfStock = product.stock <= 0;

  async function toggleWishlist() {
    const response = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id }),
    });
    setMessage(response.ok ? "Added to wishlist" : "Sign in to use the wishlist");
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <button
        disabled={outOfStock}
        onClick={() =>
          addItem({
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock,
          })
        }
        className="rounded-full bg-slate-900 px-6 py-2.5 text-sm text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {outOfStock ? "Sold out" : "Add to cart"}
      </button>
      <button
        onClick={toggleWishlist}
        className="rounded-full border border-slate-200 px-6 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
      >
        Save for later
      </button>
      {message && <span className="text-sm text-slate-500">{message}</span>}
    </div>
  );
}
