"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";

type Category = { _id: string; name: string; description?: string };

export function AdminCategories({ categories }: { categories: Category[] }) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function createCategory(formData: FormData) {
    setSubmitting(true);
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    location.reload();
  }

  return (
    <>
      <PageHeader
        title="Categories"
        description={`${categories.length} categor${categories.length === 1 ? "y" : "ies"}`}
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
        {categories.length ? (
          categories.map((category) => (
            <div key={category._id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-base font-medium text-slate-900">{category.name}</p>
              {category.description && <p className="mt-1 text-sm text-slate-500">{category.description}</p>}
            </div>
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
