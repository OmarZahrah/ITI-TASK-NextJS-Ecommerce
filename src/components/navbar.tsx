"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { data: session } = useSession();
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-base font-semibold tracking-tight text-slate-900">
          Next <span className="text-slate-400">Store</span>
        </Link>

        <div className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-slate-900">
              {link.label}
            </Link>
          ))}
        </div>

        <form action="/products" className="ml-auto hidden flex-1 max-w-sm md:block">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 transition focus-within:border-slate-400">
            <SearchIcon />
            <input
              name="search"
              placeholder="Search"
              className="w-full bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link
            href="/account"
            aria-label="Account"
            className="hidden rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:inline-flex"
          >
            <UserIcon />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-medium text-white">
                {count}
              </span>
            )}
          </Link>
          {session ? (
            <button
              onClick={() => signOut()}
              className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-700 md:inline-flex"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-700 md:inline-flex"
            >
              Sign in
            </Link>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Menu"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="space-y-2 px-4 py-4">
            <form action="/products" className="mb-3">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
                <SearchIcon />
                <input name="search" placeholder="Search" className="w-full bg-transparent text-sm focus:outline-none" />
              </div>
            </form>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Account
            </Link>
            {session ? (
              <button
                onClick={() => signOut()}
                className="mt-2 w-full rounded-full bg-slate-900 px-4 py-2 text-sm text-white"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-2 block w-full rounded-full bg-slate-900 px-4 py-2 text-center text-sm text-white"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function SearchIcon() {
  return (
    <Icon>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Icon>
  );
}

function UserIcon() {
  return (
    <Icon>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Icon>
  );
}

function CartIcon() {
  return (
    <Icon>
      <path d="M3 3h2l2.4 12.5a2 2 0 0 0 2 1.5h8.6a2 2 0 0 0 2-1.6L21.5 7H6" />
      <circle cx="9" cy="21" r="1" />
      <circle cx="18" cy="21" r="1" />
    </Icon>
  );
}

function MenuIcon() {
  return (
    <Icon>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  );
}

function CloseIcon() {
  return (
    <Icon>
      <path d="M18 6 6 18M6 6l12 12" />
    </Icon>
  );
}
