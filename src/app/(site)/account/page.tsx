"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/lib/format";

type Profile = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  paymentDetails?: string;
  wishlist?: { _id: string; name: string; price: number }[];
};

type Order = {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!session) return;
    if (session.user.role === "admin") {
      router.replace("/admin");
      return;
    }
    fetch("/api/profile").then((r) => r.json()).then(setProfile);
    fetch("/api/orders").then((r) => r.json()).then(setOrders);
  }, [router, session]);

  if (status === "loading") {
    return <main className="mx-auto max-w-3xl px-4 py-16 text-sm text-slate-500">Loading...</main>;
  }

  if (!session) {
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to view your profile, wishlist, and order history.</p>
        <Link href="/login" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm text-white hover:bg-slate-700">
          Go to sign in
        </Link>
      </main>
    );
  }

  async function saveProfile(formData: FormData) {
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    if (response.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">My account</h1>
          <p className="mt-1 text-sm text-slate-500">{session.user.email}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-medium text-slate-900">Profile</h2>
          <p className="text-sm text-slate-500">Update your details below.</p>

          <form action={saveProfile} className="mt-5 grid gap-3">
            <Input name="name" label="Full name" defaultValue={profile?.name} />
            <Input name="phone" label="Phone" defaultValue={profile?.phone} />
            <Field label="Shipping address">
              <textarea name="address" defaultValue={profile?.address} className={`${inputCls} min-h-24`} />
            </Field>
            <Input name="paymentDetails" label="Payment notes" defaultValue={profile?.paymentDetails} />
            <button className="mt-2 w-fit rounded-full bg-slate-900 px-5 py-2 text-sm text-white hover:bg-slate-700">
              Save changes
            </button>
            {saved && <p className="text-sm text-emerald-600">Saved.</p>}
          </form>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-medium text-slate-900">Wishlist</h2>
          {profile?.wishlist?.length ? (
            <ul className="mt-4 divide-y divide-slate-200">
              {profile.wishlist.map((item) => (
                <li key={item._id} className="flex items-center justify-between py-3 text-sm">
                  <Link href={`/products/${item._id}`} className="text-slate-900 hover:underline">
                    {item.name}
                  </Link>
                  <span className="text-slate-500">{formatCurrency(item.price)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Your wishlist is empty.</p>
          )}
        </aside>
      </div>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-medium text-slate-900">Order history</h2>
        <p className="text-sm text-slate-500">{orders.length} order(s)</p>

        <div className="mt-5 divide-y divide-slate-200">
          {orders.length ? (
            orders.map((order) => (
              <div key={order._id} className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
                <div>
                  <p className="font-medium text-slate-900">#{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-slate-500">
                    {order.items.map((i) => `${i.name} × ${i.quantity}`).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700">
                    {order.status}
                  </span>
                  <span className="font-medium text-slate-900">{formatCurrency(order.total)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="py-4 text-sm text-slate-500">No orders yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none";

function Input({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string }) {
  return (
    <Field label={label}>
      <input name={name} defaultValue={defaultValue || ""} className={inputCls} />
    </Field>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
