"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";

type AdminUser = {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  role: "admin" | "customer";
  isRestricted?: boolean;
  createdAt?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/users").then((r) => r.json()).then(setUsers);
  }, []);

  async function patch(id: string, body: Record<string, unknown>) {
    const response = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const updated = await response.json();
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, ...updated } : u)));
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this user?")) return;
    const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (response.ok) setUsers((prev) => prev.filter((u) => u._id !== id));
  }

  const filtered = search
    ? users.filter(
        (user) =>
          (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()),
      )
    : users;

  return (
    <>
      <PageHeader
        title="Users"
        description={`${users.length} registered account${users.length === 1 ? "" : "s"}`}
        actions={
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users"
            className="w-56 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm focus:border-slate-400"
          />
        }
      />

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="hidden grid-cols-[2fr_1fr_1fr_auto] gap-4 border-b border-slate-200 px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 lg:grid">
          <span>Name</span>
          <span>Role</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        <div className="divide-y divide-slate-200">
          {filtered.length ? (
            filtered.map((user) => (
              <div
                key={user._id}
                className="grid gap-3 px-5 py-4 text-sm lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-center"
              >
                <div>
                  <p className="font-medium text-slate-900">{user.name || "Unnamed"}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs ${
                      user.role === "admin" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs ${
                      user.isRestricted ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {user.isRestricted ? "Restricted" : "Active"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => patch(user._id, { isRestricted: !user.isRestricted })}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    {user.isRestricted ? "Approve" : "Restrict"}
                  </button>
                  <button
                    onClick={() => patch(user._id, { role: user.role === "admin" ? "customer" : "admin" })}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    {user.role === "admin" ? "Demote" : "Promote"}
                  </button>
                  <button
                    onClick={() => remove(user._id)}
                    className="rounded-full border border-rose-200 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="px-5 py-12 text-center text-sm text-slate-500">No users match your search.</p>
          )}
        </div>
      </div>
    </>
  );
}
