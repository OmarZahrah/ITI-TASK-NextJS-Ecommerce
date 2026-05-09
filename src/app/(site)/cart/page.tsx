"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/format";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const empty = items.length === 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Cart</h1>
      <p className="mt-1 text-sm text-slate-500">{empty ? "Your cart is empty." : `${items.length} item(s)`}</p>

      {empty ? (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-sm text-slate-600">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/products" className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm text-white hover:bg-slate-700">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {items.map((item) => (
              <div key={item.product} className="flex gap-4 p-5">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <Image src={item.image || FALLBACK_IMAGE} alt={item.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{formatCurrency(item.price)}</p>
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-slate-200">
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        className="px-3 py-1 text-slate-600 hover:text-slate-900"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        className="px-3 py-1 text-slate-600 hover:text-slate-900"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product)}
                      className="text-xs text-slate-500 hover:text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-medium text-slate-900">Summary</h2>
            <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd>{formatCurrency(total)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Shipping</dt><dd className="text-slate-500">Calculated at checkout</dd></div>
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-xl font-semibold text-slate-900">{formatCurrency(total)}</p>
            </div>
            <Link
              href="/checkout"
              className="mt-6 flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm text-white hover:bg-slate-700"
            >
              Checkout
            </Link>
            <Link
              href="/products"
              className="mt-2 flex items-center justify-center text-sm text-slate-600 hover:text-slate-900"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
