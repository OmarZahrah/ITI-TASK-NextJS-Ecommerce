export const dynamic = "force-dynamic";

import Image from "next/image";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { formatCurrency } from "@/lib/format";
import { ProductActions } from "./product-actions";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop";

type Review = {
  _id: { toString: () => string };
  name: string;
  rating: number;
  comment: string;
};

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const product = await Product.findById(id).populate("category").lean<{
    _id: { toString: () => string };
    name: string;
    description: string;
    price: number;
    images?: string[];
    stock: number;
    rating?: number;
    reviews?: Review[];
    category?: { name: string };
  }>();

  if (!product) notFound();
  const image = product.images?.[0] || FALLBACK_IMAGE;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
          <Image src={image} alt={product.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div>
          {product.category && (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{product.category.name}</p>
          )}
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-2xl font-medium text-slate-900">{formatCurrency(product.price)}</p>
          <p className="mt-1 text-sm text-slate-500">
            {product.stock > 0 ? `In stock — ${product.stock} available` : "Out of stock"}
          </p>

          <p className="mt-6 leading-relaxed text-slate-600">{product.description}</p>

          <ProductActions
            product={{ _id: product._id.toString(), name: product.name, price: product.price, image, stock: product.stock }}
          />

          <dl className="mt-10 divide-y divide-slate-200 border-t border-slate-200">
            <div className="flex justify-between py-3 text-sm">
              <dt className="text-slate-500">Free shipping</dt>
              <dd className="text-slate-700">On orders over $150</dd>
            </div>
            <div className="flex justify-between py-3 text-sm">
              <dt className="text-slate-500">Returns</dt>
              <dd className="text-slate-700">30-day return window</dd>
            </div>
            <div className="flex justify-between py-3 text-sm">
              <dt className="text-slate-500">Average rating</dt>
              <dd className="text-slate-700">{product.rating?.toFixed?.(1) || 0} / 5</dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="mt-20 border-t border-slate-200 pt-12">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Reviews</h2>
        <p className="mt-1 text-sm text-slate-500">{product.reviews?.length || 0} review(s)</p>

        <div className="mt-6 space-y-4">
          {product.reviews?.length ? (
            product.reviews.map((review) => (
              <div key={review._id.toString()} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">{review.name}</p>
                  <p className="text-sm text-amber-500">{"★".repeat(review.rating)}</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No reviews yet — be the first to share your thoughts.</p>
          )}
        </div>
      </section>
    </main>
  );
}
