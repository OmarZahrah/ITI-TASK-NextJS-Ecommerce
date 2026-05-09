"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      identifier: formData.get("identifier"),
      password: formData.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (result?.ok) router.push("/account");
    else setError("Invalid credentials, or your account is restricted.");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue shopping.</p>
        </div>

        <form action={login} className="mt-8 space-y-3">
          <input
            name="identifier"
            required
            placeholder="Email or phone"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400"
          />
          <input
            name="password"
            required
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400"
          />
          <button
            disabled={loading}
            className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm text-white transition hover:bg-slate-700 disabled:bg-slate-400"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          OR
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/account" })}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          <GoogleMark />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-slate-900 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.7 4.7-6.2 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.4 2.4-7.2 2.4-5 0-9.5-3.3-11.2-7.9l-6.5 5C9.5 39.5 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}
