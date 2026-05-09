import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Next Store",
};

const VALUES = [
  { title: "Quality first", desc: "Every product is hand-picked, tested, and curated by our team." },
  { title: "Customer obsessed", desc: "Real human support, every order treated like our first." },
  { title: "Fair & honest", desc: "Transparent pricing, real reviews, easy returns. No tricks." },
];

const TIMELINE = [
  { year: "2018", title: "The idea", desc: "Three friends sketch a better online shopping experience." },
  { year: "2020", title: "First 1,000 orders", desc: "Launched with 50 hand-picked items." },
  { year: "2023", title: "Going global", desc: "Shipping to 30+ countries, team of 40." },
  { year: "2026", title: "Today", desc: "25,000+ customers, 1,200+ products, 4.9★ rating." },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Our story</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Crafting commerce with care since 2018
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-slate-600">
            A small team building a modern shopping experience that puts you first. Real products, real people, real value.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop"
              alt="Our team"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Our mission</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Better products, better experience
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              We started Next Store because online shopping should feel as good as walking into your favorite store. Easy to discover, easy to trust, built around what matters: the products themselves.
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Every item is reviewed by our team before going live. Every customer is treated like our first.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-slate-200 pt-8 text-sm">
              <div><dt className="text-2xl font-semibold text-slate-900">25k+</dt><dd className="mt-0.5 text-slate-500">Happy customers</dd></div>
              <div><dt className="text-2xl font-semibold text-slate-900">1,200+</dt><dd className="mt-0.5 text-slate-500">Products curated</dd></div>
              <div><dt className="text-2xl font-semibold text-slate-900">98%</dt><dd className="mt-0.5 text-slate-500">Satisfaction rate</dd></div>
              <div><dt className="text-2xl font-semibold text-slate-900">30+</dt><dd className="mt-0.5 text-slate-500">Countries served</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">What we stand for</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Our values</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-medium text-slate-900">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Our journey</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">From idea to today</h2>
        </div>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINE.map((item) => (
            <li key={item.year} className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{item.year}</p>
              <p className="mt-3 text-base font-medium text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Ready to start shopping?</h2>
          <p className="mx-auto mt-3 max-w-md text-slate-600">
            Browse thousands of curated products from a team that genuinely cares.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/products" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm text-white hover:bg-slate-700">
              Browse the shop
            </Link>
            <Link href="/contact" className="rounded-full border border-slate-200 px-5 py-2.5 text-sm text-slate-700 hover:bg-white">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
