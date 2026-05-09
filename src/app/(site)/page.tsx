export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { ProductCard } from "@/components/product-card";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2400&auto=format&fit=crop";

const COLLECTION_TILES = [
  {
    title: "Everyday essentials",
    subtitle: "Wear-everywhere staples",
    href: "/products",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop",
    span: "lg:col-span-2 lg:row-span-2",
    height: "min-h-[420px] lg:min-h-[640px]",
  },
  {
    title: "Home & Living",
    subtitle: "Quiet, considered design",
    href: "/products",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    span: "",
    height: "min-h-[300px]",
  },
  {
    title: "Accessories",
    subtitle: "The finishing touch",
    href: "/products",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1200&auto=format&fit=crop",
    span: "",
    height: "min-h-[300px]",
  },
];

const CATEGORY_IMAGES: Record<string, string> = {
  Fashion: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
  Electronics: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
  "Home & Living": "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
  Beauty: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1200&auto=format&fit=crop",
  Sports: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
  Accessories: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1200&auto=format&fit=crop",
};

const FALLBACK_CATEGORY_IMAGE = COLLECTION_TILES[0].image;

const TESTIMONIALS = [
  {
    quote: "The quality is unreal — feels like everything was hand-picked. My new go-to.",
    author: "Sarah K.",
    role: "Verified buyer",
  },
  {
    quote: "Fast shipping, easy returns, and pieces I actually wear every week.",
    author: "Daniel M.",
    role: "Verified buyer",
  },
  {
    quote: "Beautifully presented, no fluff. Buying online should always feel this calm.",
    author: "Priya R.",
    role: "Verified buyer",
  },
];

export default async function Home() {
  await connectDB();
  const [featuredRaw, categoriesRaw] = await Promise.all([
    Product.find({ featured: true }).populate("category", "name").limit(8).lean(),
    Category.find().limit(6).lean(),
  ]);
  const featuredProducts = JSON.parse(JSON.stringify(featuredRaw)) as Array<{
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

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="relative h-[70vh] min-h-[520px] w-full lg:h-[82vh]">
          <Image
            src={HERO_IMAGE}
            alt="New season editorial"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/30 to-slate-950/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-20">
              <div className="max-w-2xl text-white">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/70">
                  New season · 2026
                </p>
                <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  Quietly considered.
                  <br />
                  Built to last.
                </h1>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85">
                  A small, curated catalog from independent makers. Real reviews. Honest prices. Free returns within 30 days.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
                  >
                    Shop the catalog
                    <ArrowRight />
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm text-white transition hover:bg-white/10"
                  >
                    Our story
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { title: "Free shipping", desc: "On orders over $150" },
            { title: "30-day returns", desc: "No questions asked" },
            { title: "Secure checkout", desc: "Cards, PayPal & Wallet" },
            { title: "Real support", desc: "Mon–Fri, 9–6 EST" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <CheckMark />
              <div>
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Collections
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Made for every moment
            </h2>
          </div>
          <Link href="/products" className="hidden text-sm text-slate-700 hover:text-slate-900 sm:block">
            View all →
          </Link>
        </div>
        <div className="grid auto-rows-[minmax(180px,auto)] gap-4 lg:grid-cols-3 lg:grid-rows-2">
          {COLLECTION_TILES.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className={`group relative overflow-hidden rounded-3xl bg-slate-100 ${tile.span} ${tile.height}`}
            >
              <Image
                src={tile.image}
                alt={tile.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 text-white">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                  {tile.subtitle}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{tile.title}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-white/90">
                  Explore <ArrowRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Featured</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                This week&apos;s edit
              </h2>
            </div>
            <Link href="/products" className="text-sm text-slate-700 hover:text-slate-900">
              View all →
            </Link>
          </div>

          {featuredProducts.length ? (
            <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-sm text-slate-600">No featured products yet.</p>
              <Link
                href="/admin/products"
                className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm text-white"
              >
                Open admin
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Browse</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Shop by category
            </h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(categories.length
            ? categories.map((c) => ({
                id: c._id,
                name: c.name,
                href: `/products?category=${c._id}`,
                image: CATEGORY_IMAGES[c.name] || FALLBACK_CATEGORY_IMAGE,
              }))
            : Object.keys(CATEGORY_IMAGES).map((name) => ({
                id: name,
                name,
                href: "/products",
                image: CATEGORY_IMAGES[name],
              }))
          ).map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative aspect-4/3 overflow-hidden rounded-2xl bg-slate-100"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/55 via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-4 flex items-center justify-between text-white">
                <p className="text-sm font-medium">{category.name}</p>
                <ArrowRight />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">Reviews</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Loved by 25,000+ shoppers
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <figure key={item.author} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                <p className="text-amber-300">★★★★★</p>
                <blockquote className="mt-3 text-sm leading-relaxed text-white/85">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-white/10 pt-4 text-xs">
                  <span className="font-medium text-white">{item.author}</span>
                  <span className="ml-2 text-white/50">{item.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Newsletter</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Stay in the loop
        </h2>
        <p className="mt-3 text-slate-600">
          Subscribe for first access to new arrivals, restocks, and member-only sales.
        </p>
        <form className="mx-auto mt-7 flex max-w-md flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            placeholder="Email address"
            className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm focus:border-slate-400 focus:outline-none"
          />
          <button className="rounded-full bg-slate-900 px-6 py-3 text-sm text-white transition hover:bg-slate-700">
            Subscribe
          </button>
        </form>
        <p className="mt-3 text-xs text-slate-400">No spam. Unsubscribe anytime.</p>
      </section>
    </>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function CheckMark() {
  return (
    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l4 4L19 6" />
      </svg>
    </span>
  );
}
