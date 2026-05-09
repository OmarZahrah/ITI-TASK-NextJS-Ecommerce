export const dynamic = "force-dynamic";

import Link from "next/link";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { ProductCard } from "@/components/product-card";
import { MobileFilterDrawer } from "./filter-drawer";
import { SortDropdown } from "./sort-dropdown";

type SearchParams = Promise<{
  search?: string;
  category?: string;
  min?: string;
  max?: string;
  sort?: string;
}>;

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  new: { createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { rating: -1 },
};

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  await connectDB();
  const params = await searchParams;

  const query: Record<string, unknown> = {};
  if (params.search) query.name = { $regex: params.search, $options: "i" };
  const validCategoryId = params.category && isValidObjectId(params.category) ? params.category : undefined;
  if (validCategoryId) query.category = validCategoryId;
  if (params.min || params.max) {
    query.price = {
      ...(params.min ? { $gte: Number(params.min) } : {}),
      ...(params.max ? { $lte: Number(params.max) } : {}),
    };
  }

  const sortKey = (params.sort && SORT_MAP[params.sort] ? params.sort : "new") as string;
  const sort = SORT_MAP[sortKey];

  const [productsRaw, categoriesRaw] = await Promise.all([
    Product.find(query).populate("category", "name").sort(sort).lean(),
    Category.find().sort({ name: 1 }).lean(),
  ]);

  const products = JSON.parse(JSON.stringify(productsRaw)) as Array<{
    _id: string;
    name: string;
    description: string;
    price: number;
    images?: string[];
    stock: number;
    rating?: number;
    featured?: boolean;
    category?: { _id: string; name: string } | string;
  }>;
  const categories = JSON.parse(JSON.stringify(categoriesRaw)) as Array<{ _id: string; name: string }>;

  const activeCategory = categories.find((c) => c._id === validCategoryId)?.name;

  const activeFilters: { label: string; href: string }[] = [];
  if (params.search) activeFilters.push({ label: `“${params.search}”`, href: removeParam(params, "search") });
  if (activeCategory) activeFilters.push({ label: activeCategory, href: removeParam(params, "category") });
  if (params.min) activeFilters.push({ label: `Min $${params.min}`, href: removeParam(params, "min") });
  if (params.max) activeFilters.push({ label: `Max $${params.max}`, href: removeParam(params, "max") });

  const filterContent = (
    <FilterForm
      currentSearch={params.search}
      currentCategory={validCategoryId}
      currentMin={params.min}
      currentMax={params.max}
      currentSort={sortKey}
      categories={categories}
    />
  );

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Catalog</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            All products
          </h1>
          <p className="mt-3 max-w-xl text-sm text-slate-500">
            Browse our full catalog. Use filters to narrow by category, price, and more.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">{filterContent}</div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-900">{products.length}</span> result
                {products.length === 1 ? "" : "s"}
                {params.search ? ` for “${params.search}”` : ""}
              </p>
              <div className="flex items-center gap-2">
                <MobileFilterDrawer>{filterContent}</MobileFilterDrawer>
                <SortDropdown
                  current={sortKey}
                  hidden={[
                    ...(params.search ? [{ name: "search", value: params.search }] : []),
                    ...(validCategoryId ? [{ name: "category", value: validCategoryId }] : []),
                    ...(params.min ? [{ name: "min", value: params.min }] : []),
                    ...(params.max ? [{ name: "max", value: params.max }] : []),
                  ]}
                />
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-slate-500">Active</span>
                {activeFilters.map((filter) => (
                  <Link
                    key={filter.label}
                    href={filter.href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    {filter.label}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </Link>
                ))}
                <Link href="/products" className="text-xs text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline">
                  Clear all
                </Link>
              </div>
            )}

            {products.length ? (
              <div className="mt-8 grid gap-x-5 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <p className="text-base font-medium text-slate-900">No products match your filters.</p>
                <p className="mt-2 text-sm text-slate-500">Try adjusting your search or clearing filters.</p>
                <Link
                  href="/products"
                  className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
                >
                  Clear filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function FilterForm({
  currentSearch,
  currentCategory,
  currentMin,
  currentMax,
  currentSort,
  categories,
}: {
  currentSearch?: string;
  currentCategory?: string;
  currentMin?: string;
  currentMax?: string;
  currentSort: string;
  categories: { _id: string; name: string }[];
}) {
  return (
    <form className="space-y-7">
      <input type="hidden" name="sort" value={currentSort} />

      <FilterSection title="Search">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 transition focus-within:border-slate-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            name="search"
            defaultValue={currentSearch}
            placeholder="Search"
            className="w-full bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name="category" value="" defaultChecked={!currentCategory} className="accent-slate-900" />
            All categories
          </label>
          {categories.map((category) => (
            <label key={category._id} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="category"
                value={category._id}
                defaultChecked={currentCategory === category._id}
                className="accent-slate-900"
              />
              {category.name}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price">
        <div className="grid grid-cols-2 gap-2">
          <input
            name="min"
            defaultValue={currentMin}
            placeholder="Min"
            type="number"
            min="0"
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          />
          <input
            name="max"
            defaultValue={currentMax}
            placeholder="Max"
            type="number"
            min="0"
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          />
        </div>
      </FilterSection>

      <button className="w-full rounded-full bg-slate-900 px-5 py-2.5 text-sm text-white transition hover:bg-slate-700">
        Apply filters
      </button>
    </form>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">{title}</h3>
      {children}
    </div>
  );
}

function removeParam(params: Awaited<SearchParams>, key: keyof Awaited<SearchParams>) {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (k !== key && v) next.set(k, String(v));
  }
  const qs = next.toString();
  return qs ? `/products?${qs}` : "/products";
}
