"use client";

import { useState } from "react";

const INFO = [
  { title: "Email", value: "support@nextstore.com", desc: "We respond within 24 hours" },
  { title: "Phone", value: "+1 (555) 123-4567", desc: "Mon–Fri, 9am–6pm EST" },
  { title: "Office", value: "123 Commerce Avenue", desc: "New York, NY 10001" },
];

const FAQ = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 2–5 business days within the US. International orders ship in 5–10 business days. Free shipping on orders over $150.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 30-day return policy on most items. Products must be unused and in original packaging.",
  },
  {
    q: "How can I track my order?",
    a: "Once your order ships you'll receive an email with tracking. You can also check status in your account dashboard.",
  },
  {
    q: "Do you offer discounts for bulk orders?",
    a: "Yes — for wholesale inquiries please use the form below or email wholesale@nextstore.com.",
  },
];

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit(formData: FormData) {
    setStatus("sending");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    setStatus(response.ok ? "success" : "error");
  }

  return (
    <>
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Get in touch</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            We&apos;re here to help
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-slate-600">
            Questions, feedback, or just saying hello — drop us a line and we&apos;ll be back within 24 hours.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[360px_1fr]">
          <div className="space-y-4">
            {INFO.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{item.title}</p>
                <p className="mt-2 text-base font-medium text-slate-900">{item.value}</p>
                <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>

          <form action={submit} className="rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Send a message</h2>
            <p className="mt-1 text-sm text-slate-500">We typically respond within 24 hours.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Your name">
                <input name="name" required placeholder="Jane Doe" className={inputCls} />
              </Field>
              <Field label="Email">
                <input name="email" required type="email" placeholder="jane@example.com" className={inputCls} />
              </Field>
            </div>
            <Field label="Subject" className="mt-4">
              <select name="subject" required className={inputCls} defaultValue="">
                <option value="" disabled>Choose a topic</option>
                <option>General inquiry</option>
                <option>Order issue</option>
                <option>Returns & refunds</option>
                <option>Wholesale</option>
                <option>Press</option>
              </select>
            </Field>
            <Field label="Message" className="mt-4">
              <textarea name="message" required placeholder="How can we help?" className={`${inputCls} min-h-32`} />
            </Field>

            <button
              disabled={status === "sending"}
              className="mt-6 w-full rounded-full bg-slate-900 px-5 py-2.5 text-sm text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {status === "sending" ? "Sending..." : "Send message"}
            </button>

            {status === "success" && (
              <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
                Thanks. Your message has been received.
              </p>
            )}
            {status === "error" && (
              <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">FAQ</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Frequently asked</h2>
          </div>
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {FAQ.map((item) => (
              <details key={item.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-slate-900">
                  {item.q}
                  <span className="text-slate-400 transition group-open:rotate-45">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
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
