"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { formatCurrency } from "@/lib/format";

const STATUSES = ["Placed", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLES: Record<string, string> = {
  Placed: "bg-slate-100 text-slate-700",
  Confirmed: "bg-blue-50 text-blue-700",
  Processing: "bg-amber-50 text-amber-700",
  Shipped: "bg-indigo-50 text-indigo-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

type Order = {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  user?: { name?: string; email?: string };
  guest?: { name?: string; email?: string };
  items: { name: string; quantity: number }[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/orders").then((r) => r.json()).then(setOrders);
  }, []);

  async function update(id: string, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((order) => (order._id === id ? { ...order, status } : order)));
  }

  async function remove(id: string) {
    if (!confirm("Delete this order?")) return;
    const response = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (response.ok) setOrders((prev) => prev.filter((order) => order._id !== id));
  }

  const filtered = filter === "all" ? orders : orders.filter((order) => order.status === filter);

  return (
    <>
      <PageHeader
        title="Orders"
        description={`${orders.length} total order${orders.length === 1 ? "" : "s"}`}
      />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" />
        {STATUSES.map((status) => (
          <FilterChip key={status} active={filter === status} onClick={() => setFilter(status)} label={status} />
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="hidden grid-cols-[1fr_2fr_1fr_auto_auto] gap-4 border-b border-slate-200 px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 lg:grid">
          <span>Order</span>
          <span>Customer & items</span>
          <span>Total</span>
          <span>Status</span>
          <span>Update</span>
        </div>

        <div className="divide-y divide-slate-200">
          {filtered.length ? (
            filtered.map((order) => {
              const customer =
                order.user?.name || order.user?.email || order.guest?.name || order.guest?.email || "Guest";
              return (
                <div
                  key={order._id}
                  className="grid gap-3 px-5 py-4 text-sm lg:grid-cols-[1fr_2fr_1fr_auto_auto] lg:items-center"
                >
                  <div>
                    <p className="font-medium text-slate-900">#{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-900">{customer}</p>
                    <p className="line-clamp-1 text-xs text-slate-500">
                      {order.items.map((item) => `${item.name} × ${item.quantity}`).join(" · ")}
                    </p>
                  </div>
                  <div className="font-medium text-slate-900">{formatCurrency(order.total)}</div>
                  <div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_STYLES[order.status] || "bg-slate-100 text-slate-600"}`}>
                      {order.status}
                    </span>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => update(order._id, e.target.value)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-slate-400"
                  >
                    {STATUSES.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => remove(order._id)}
                    className="rounded-full border border-rose-200 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              );
            })
          ) : (
            <p className="px-5 py-12 text-center text-sm text-slate-500">No orders match this filter.</p>
          )}
        </div>
      </div>
    </>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs transition ${
        active ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}
