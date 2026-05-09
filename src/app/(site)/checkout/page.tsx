"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/format";

const PAYMENT_METHODS = ["Credit Card", "PayPal", "Cash on Delivery", "Wallet"];

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const shipping = total > 150 ? 0 : 12;
  const tax = Number((total * 0.08).toFixed(2));
  const orderTotal = total + shipping + tax;

  async function submit(formData: FormData) {
    setSubmitting(true);
    setError("");
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({ product: item.product, quantity: item.quantity })),
        guest: session
          ? undefined
          : { name: formData.get("name"), email: formData.get("email"), phone: formData.get("phone") },
        shippingAddress: formData.get("shippingAddress"),
        paymentMethod: formData.get("paymentMethod"),
      }),
    });
    setSubmitting(false);
    if (response.ok) {
      clearCart();
      router.push("/account?order=success");
    } else {
      setError("Could not place order. Check stock and required fields.");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Checkout</h1>
      <p className="mt-1 text-sm text-slate-500">
        {session ? `Signed in as ${session.user.email}` : "Checking out as a guest"}
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <form action={submit} className="space-y-8">
          {!session && (
            <Section title="Contact">
              <div className="grid gap-3 sm:grid-cols-3">
                <input name="name" required placeholder="Name" className={inputCls} />
                <input name="email" required type="email" placeholder="Email" className={inputCls} />
                <input name="phone" required placeholder="Phone" className={inputCls} />
              </div>
            </Section>
          )}

          <Section title="Shipping address">
            <textarea name="shippingAddress" required placeholder="Street, city, postal code, country" className={`${inputCls} min-h-28`} />
          </Section>

          <Section title="Payment">
            <select name="paymentMethod" defaultValue={PAYMENT_METHODS[0]} className={inputCls}>
              {PAYMENT_METHODS.map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>
            <p className="mt-2 text-xs text-slate-500">
              This is a demo checkout — no real payment is taken.
            </p>
          </Section>

          <button
            disabled={!items.length || submitting}
            className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? "Placing order..." : `Place order — ${formatCurrency(orderTotal)}`}
          </button>
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </form>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-medium text-slate-900">Order summary</h2>
          <ul className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
            {items.map((item) => (
              <li key={item.product} className="flex justify-between gap-3">
                <span className="truncate text-slate-700">
                  {item.name} <span className="text-slate-400">× {item.quantity}</span>
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd>{formatCurrency(total)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Shipping</dt><dd>{shipping === 0 ? "Free" : formatCurrency(shipping)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Tax</dt><dd>{formatCurrency(tax)}</dd></div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-4">
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-xl font-semibold text-slate-900">{formatCurrency(orderTotal)}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-medium uppercase tracking-wider text-slate-500">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
