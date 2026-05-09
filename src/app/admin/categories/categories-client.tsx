"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";

type Category = { _id: string; name: string; description?: string };

export function AdminCategories({ categories }: { categories: Category[] }) {
  const [rows, setRows] = useState(categories);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function createCategory(formData: FormData) {
    setSubmitting(true);
    setError("");
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    setSubmitting(false);
    if (!response.ok) {
      setError("Could not create category.");
      return;
    }
    const created = await response.json();
    setRows((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    setShowForm(false);
  }

  return (
    <>
      <PageHeader
        title="Categories"
        description={`${rows.length} categor${rows.length === 1 ? "y" : "ies"}`}
        actions={
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
          >
            {showForm ? "Cancel" : "New category"}
          </button>
        }
      />

      {showForm && (
        <form action={createCategory} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-medium text-slate-900">Add category</h2>
          <div className="mt-4 grid gap-3">
            <Field label="Name"><input name="name" required className={inputCls} /></Field>
            <Field label="Description"><textarea name="description" className={`${inputCls} min-h-20`} /></Field>
          </div>
          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button disabled={submitting} className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:bg-slate-400">
              {submitting ? "Saving..." : "Save category"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.length ? (
          rows.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              editing={editingId === category._id}
              onEdit={() => setEditingId(category._id)}
              onCancel={() => setEditingId(null)}
              onSaved={(updated) => {
                setRows((prev) => prev.map((row) => (row._id === updated._id ? updated : row)));
                setEditingId(null);
              }}
              onDeleted={(id) => {
                setRows((prev) => prev.filter((row) => row._id !== id));
                setEditingId(null);
              }}
            />
          ))
        ) : (
          <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
            No categories yet.
          </p>
        )}
      </div>
    </>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function CategoryCard({
  category,
  editing,
  onEdit,
  onCancel,
  onSaved,
  onDeleted,
}: {
  category: Category;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSaved: (category: Category) => void;
  onDeleted: (id: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function updateCategory(formData: FormData) {
    setSaving(true);
    setError("");
    const response = await fetch(`/api/categories/${category._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    setSaving(false);
    if (!response.ok) {
      setError("Could not update category.");
      return;
    }
    onSaved(await response.json());
  }

  async function deleteCategory() {
    if (!confirm(`Delete "${category.name}"?`)) return;
    setDeleting(true);
    setError("");
    const response = await fetch(`/api/categories/${category._id}`, { method: "DELETE" });
    setDeleting(false);
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message || "Could not delete category.");
      return;
    }
    onDeleted(category._id);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      {editing ? (
        <form action={updateCategory} className="space-y-3">
          <Field label="Name">
            <input name="name" required defaultValue={category.name} className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea name="description" defaultValue={category.description || ""} className={`${inputCls} min-h-20`} />
          </Field>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex gap-2">
            <button disabled={saving} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs text-white hover:bg-slate-700 disabled:bg-slate-400">
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={onCancel} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="text-base font-medium text-slate-900">{category.name}</p>
          {category.description && <p className="mt-1 text-sm text-slate-500">{category.description}</p>}
          {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
          <div className="mt-4 flex gap-2">
            <button onClick={onEdit} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
              Edit
            </button>
            <button
              onClick={deleteCategory}
              disabled={deleting}
              className="rounded-full border border-rose-200 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
