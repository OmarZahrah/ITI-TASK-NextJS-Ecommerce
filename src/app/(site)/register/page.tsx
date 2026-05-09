"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(formData: FormData) {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    setLoading(false);
    if (response.ok) router.push("/login");
    else setMessage((await response.json()).message || "Registration failed");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Create account</h1>
          <p className="mt-2 text-sm text-slate-500">Join Next Store in under a minute.</p>
        </div>

        <form action={register} className="mt-8 space-y-3">
          <input name="name" required placeholder="Full name" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400" />
          <input name="email" required type="email" placeholder="Email" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400" />
          <input name="phone" placeholder="Phone (optional)" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400" />
          <input name="password" required type="password" minLength={6} placeholder="Password (min 6 chars)" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400" />
          <button
            disabled={loading}
            className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm text-white transition hover:bg-slate-700 disabled:bg-slate-400"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
          {message && <p className="text-sm text-rose-600">{message}</p>}
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-slate-900 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
