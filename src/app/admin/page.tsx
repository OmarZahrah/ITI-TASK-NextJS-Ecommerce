export const dynamic = "force-dynamic";

import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { Category } from "@/models/Category";
import { formatCurrency } from "@/lib/format";
import { PageHeader } from "@/components/admin/page-header";

type RecentOrder = {
  _id: { toString: () => string };
  total: number;
  status: string;
  createdAt: Date;
  user?: { name?: string; email?: string };
  guest?: { name?: string; email?: string };
};

export default async function AdminOverviewPage() {
  await connectDB();

  const [ordersCount, productsCount, categoriesCount, usersCount, revenueAgg, recentOrders, lowStockProducts] =
    await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      Category.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email").lean<RecentOrder[]>(),
      Product.find({ stock: { $lt: 5 } }).limit(5).lean(),
    ]);

  const revenue = revenueAgg[0]?.total || 0;

  const stats = [
    { label: "Revenue", value: formatCurrency(revenue), hint: "Lifetime, excluding cancelled" },
    { label: "Orders", value: ordersCount.toLocaleString(), hint: "All-time" },
    { label: "Products", value: productsCount.toLocaleString(), hint: "Live in catalog" },
    { label: "Customers", value: usersCount.toLocaleString(), hint: "Registered accounts" },
  ];

  return (
    <>
      <PageHeader
        title="Overview"
        description="A snapshot of your store at a glance."
        actions={
          <Link
            href="/admin/products"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
          >
            New product
          </Link>
        }
      />

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.hint}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white">
          <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-medium text-slate-900">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-slate-500 hover:text-slate-900">
              View all →
            </Link>
          </header>
          <div className="divide-y divide-slate-200">
            {recentOrders.length ? (
              recentOrders.map((order) => {
                const customer =
                  order.user?.name || order.user?.email || order.guest?.name || order.guest?.email || "Guest";
                return (
                  <div key={order._id.toString()} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">#{order._id.toString().slice(-6).toUpperCase()}</p>
                      <p className="truncate text-xs text-slate-500">{customer}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-slate-200 px-2.5 py-0.5 text-xs text-slate-600">
                        {order.status}
                      </span>
                      <span className="font-medium text-slate-900">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="px-5 py-8 text-center text-sm text-slate-500">No orders yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white">
          <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-medium text-slate-900">Low stock</h2>
            <Link href="/admin/products" className="text-xs text-slate-500 hover:text-slate-900">
              Manage →
            </Link>
          </header>
          <div className="divide-y divide-slate-200">
            {lowStockProducts.length ? (
              lowStockProducts.map((product: { _id: { toString: () => string }; name: string; stock: number }) => (
                <div key={product._id.toString()} className="flex items-center justify-between px-5 py-3 text-sm">
                  <p className="truncate text-slate-900">{product.name}</p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs ${
                      product.stock === 0 ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {product.stock} left
                  </span>
                </div>
              ))
            ) : (
              <p className="px-5 py-8 text-center text-sm text-slate-500">All stock looks healthy.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <QuickLink href="/admin/products" title="Products" desc={`${productsCount} live items`} />
        <QuickLink href="/admin/categories" title="Categories" desc={`${categoriesCount} categories`} />
        <QuickLink href="/admin/users" title="Users" desc={`${usersCount} registered`} />
      </section>
    </>
  );
}

function QuickLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <div>
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
      </div>
      <span className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700">→</span>
    </Link>
  );
}
