"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { formatCurrency } from "@/lib/format";

type Category = { _id: string; name: string };
type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  featured?: boolean;
  category?: { name: string } | string;
};

export function AdminProducts({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function createProduct(formData: FormData) {
    setSubmitting(true);
    const raw = Object.fromEntries(formData);
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...raw,
        price: Number(raw.price),
        stock: Number(raw.stock),
        featured: raw.featured === "on",
        images: String(raw.images || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });
    location.reload();
  }

  return (
    <>
      <PageHeader
        title="Products"
        description={`${initialProducts.length} item${initialProducts.length === 1 ? "" : "s"} in catalog`}
        actions={
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
          >
            {showForm ? "Cancel" : "New product"}
          </button>
        }
      />

      {showForm && (
        <form action={createProduct} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-medium text-slate-900">Add product</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Name"><input name="name" required className={inputCls} /></Field>
            <Field label="Category">
              <select name="category" required className={inputCls} defaultValue="">
                <option value="" disabled>Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Price"><input name="price" required type="number" step="0.01" className={inputCls} /></Field>
            <Field label="Stock"><input name="stock" required type="number" className={inputCls} /></Field>
            <Field label="Image URLs (comma separated)" className="sm:col-span-2">
              <input name="images" placeholder="https://..., https://..." className={inputCls} />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <textarea name="description" required className={`${inputCls} min-h-24`} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input name="featured" type="checkbox" /> Mark as featured
            </label>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button disabled={submitting} className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:bg-slate-400">
              {submitting ? "Saving..." : "Save product"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-200 px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 sm:grid">
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-slate-200">
          {initialProducts.length ? (
            initialProducts.map((product) => {
              const categoryName =
                typeof product.category === "object" ? product.category?.name : "—";
              return (
                <div
                  key={product._id}
                  className="grid grid-cols-2 gap-y-2 gap-x-4 px-5 py-4 text-sm sm:grid-cols-[2fr_1fr_1fr_1fr_auto]"
                >
                  <div className="col-span-2 sm:col-span-1">
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="line-clamp-2 text-xs text-slate-500">{product.description}</p>
                  </div>
                  <div className="text-slate-700">{categoryName}</div>
                  <div className="text-slate-900">{formatCurrency(product.price)}</div>
                  <div className="text-slate-700">{product.stock}</div>
                  <div>
                    {product.featured ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs text-emerald-700">Featured</span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">Standard</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="px-5 py-12 text-center text-sm text-slate-500">No products yet.</p>
          )}
        </div>
      </div>
    </>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
