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
  images?: string[];
  featured?: boolean;
  category?: { _id?: string; name: string } | string;
};

export function AdminProducts({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function createProduct(formData: FormData) {
    try {
      setSubmitting(true);
      setError("");
      const raw = Object.fromEntries(formData);
      const uploadedImages = await uploadImages(formData.getAll("images"));
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...raw,
          price: Number(raw.price),
          stock: Number(raw.stock),
          featured: raw.featured === "on",
          images: uploadedImages,
        }),
      });
      if (!response.ok) {
        setError("Could not create product.");
        return;
      }
      const created = await response.json();
      setProducts((prev) => [created, ...prev]);
      setShowForm(false);
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Products"
        description={`${products.length} item${products.length === 1 ? "" : "s"} in catalog`}
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
            <Field label="Product photos" className="sm:col-span-2">
              <input name="images" required type="file" accept="image/*" multiple className={inputCls} />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <textarea name="description" required className={`${inputCls} min-h-24`} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input name="featured" type="checkbox" /> Mark as featured
            </label>
          </div>
          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
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
          {products.length ? (
            products.map((product) => {
              const categoryName =
                typeof product.category === "object" ? product.category?.name : "—";
              const editing = editingId === product._id;
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
                  <div className="col-span-2 sm:col-span-full">
                    {editing ? (
                      <EditProductForm
                        product={product}
                        categories={categories}
                        onCancel={() => setEditingId(null)}
                        onSaved={(updated) => {
                          setProducts((prev) => prev.map((row) => (row._id === updated._id ? updated : row)));
                          setEditingId(null);
                        }}
                      />
                    ) : (
                      <ProductActions
                        product={product}
                        onEdit={() => setEditingId(product._id)}
                        onDeleted={(id) => setProducts((prev) => prev.filter((row) => row._id !== id))}
                      />
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

function ProductActions({
  product,
  onEdit,
  onDeleted,
}: {
  product: Product;
  onEdit: () => void;
  onDeleted: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (!confirm(`Delete "${product.name}"?`)) return;
    setDeleting(true);
    setError("");
    const response = await fetch(`/api/products/${product._id}`, { method: "DELETE" });
    setDeleting(false);
    if (!response.ok) {
      setError("Could not delete product.");
      return;
    }
    onDeleted(product._id);
  }

  return (
    <div className="mt-1 flex items-center gap-2">
      <button onClick={onEdit} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
        Edit
      </button>
      <button
        onClick={remove}
        disabled={deleting}
        className="rounded-full border border-rose-200 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 disabled:opacity-60"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}

function EditProductForm({
  product,
  categories,
  onCancel,
  onSaved,
}: {
  product: Product;
  categories: Category[];
  onCancel: () => void;
  onSaved: (product: Product) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function updateProduct(formData: FormData) {
    try {
      setSaving(true);
      setError("");
      const raw = Object.fromEntries(formData);
      const uploadedImages = await uploadImages(formData.getAll("images"));
      const response = await fetch(`/api/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...raw,
          price: Number(raw.price),
          stock: Number(raw.stock),
          featured: raw.featured === "on",
          images: uploadedImages.length ? uploadedImages : product.images || [],
        }),
      });
      if (!response.ok) {
        setError("Could not update product.");
        return;
      }
      onSaved(await response.json());
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={updateProduct} className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name"><input name="name" required defaultValue={product.name} className={inputCls} /></Field>
        <Field label="Category">
          <select
            name="category"
            required
            className={inputCls}
            defaultValue={typeof product.category === "object" ? (product.category as { _id?: string })._id : String(product.category)}
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Price"><input name="price" required type="number" step="0.01" defaultValue={product.price} className={inputCls} /></Field>
        <Field label="Stock"><input name="stock" required type="number" defaultValue={product.stock} className={inputCls} /></Field>
        <Field label="Replace product photos (optional)" className="sm:col-span-2">
          <input name="images" type="file" accept="image/*" multiple className={inputCls} />
        </Field>
        <div className="sm:col-span-2 text-xs text-slate-500">
          Current images: {product.images?.length || 0}
        </div>
        <Field label="Description" className="sm:col-span-2">
          <textarea name="description" required defaultValue={product.description} className={`${inputCls} min-h-24`} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
          <input name="featured" type="checkbox" defaultChecked={Boolean(product.featured)} /> Mark as featured
        </label>
      </div>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button disabled={saving} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs text-white hover:bg-slate-700 disabled:bg-slate-400">
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-white">
          Cancel
        </button>
      </div>
    </form>
  );
}

async function uploadImages(values: FormDataEntryValue[]) {
  const files = values.filter((value): value is File => value instanceof File && value.size > 0);
  if (!files.length) return [];

  const signatureResponse = await fetch("/api/cloudinary/signature", { method: "POST" });
  if (!signatureResponse.ok) throw new Error("Could not prepare image upload.");
  const { timestamp, folder, signature, cloudName, apiKey } = await signatureResponse.json();

  const uploaded = await Promise.all(
    files.map(async (file) => {
      const payload = new FormData();
      payload.append("file", file);
      payload.append("api_key", apiKey);
      payload.append("timestamp", String(timestamp));
      payload.append("folder", folder);
      payload.append("signature", signature);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: payload,
      });
      if (!response.ok) throw new Error("Image upload failed.");
      const data = await response.json();
      return data.secure_url as string;
    }),
  );

  return uploaded;
}
