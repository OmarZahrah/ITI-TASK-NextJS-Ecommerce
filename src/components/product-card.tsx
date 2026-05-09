"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/format";

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  stock: number;
  featured?: boolean;
  rating?: number;
  category?: { name?: string } | string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=900&auto=format&fit=crop";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const primaryImage = product.images?.[0] || FALLBACK_IMAGE;
  const hoverImage = product.images?.[1];

  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;

  const categoryName =
    typeof product.category === "object" ? product.category?.name : undefined;

  function add() {
    addItem({
      product: product._id,
      name: product.name,
      price: product.price,
      image: primaryImage,
      stock: product.stock,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="group flex flex-col">
      <Link
        href={`/products/${product._id}`}
        className="relative block aspect-square overflow-hidden rounded-2xl bg-slate-100"
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition duration-700 group-hover:scale-[1.04] ${
            hoverImage ? "group-hover:opacity-0" : ""
          }`}
        />
        {hoverImage && (
          <Image
            src={hoverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-0 transition duration-700 group-hover:opacity-100"
          />
        )}

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1">
          {outOfStock ? (
            <Badge tone="muted">Sold out</Badge>
          ) : (
            <>
              {product.featured && <Badge tone="dark">Featured</Badge>}
              {lowStock && <Badge tone="warn">Only {product.stock} left</Badge>}
            </>
          )}
        </div>

        <div className="absolute inset-x-3 bottom-3 translate-y-1 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            disabled={outOfStock}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              add();
            }}
            className="w-full rounded-full bg-white px-4 py-2.5 text-xs font-medium text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            {outOfStock ? "Sold out" : added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </Link>

      <div className="mt-3 flex flex-1 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {categoryName && (
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
              {categoryName}
            </p>
          )}
          <Link
            href={`/products/${product._id}`}
            className="mt-0.5 block truncate text-sm font-medium text-slate-900 hover:underline"
          >
            {product.name}
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm text-slate-700">{formatCurrency(product.price)}</p>
            {product.rating ? <Stars rating={product.rating} /> : null}
          </div>
        </div>

        <button
          aria-label={`Add ${product.name} to cart`}
          disabled={outOfStock}
          onClick={add}
          className="hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-600 sm:inline-flex"
        >
          {added ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l4 4L19 6" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          )}
        </button>
      </div>
    </article>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "dark" | "muted" | "warn" }) {
  const styles =
    tone === "dark"
      ? "bg-slate-900 text-white"
      : tone === "warn"
        ? "bg-amber-50 text-amber-700"
        : "bg-white/90 text-slate-700";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${styles}`}>
      {children}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs leading-none text-amber-500">
        {"★".repeat(filled)}
        <span className="text-slate-300">{"★".repeat(Math.max(0, 5 - filled))}</span>
      </span>
    </div>
  );
}
