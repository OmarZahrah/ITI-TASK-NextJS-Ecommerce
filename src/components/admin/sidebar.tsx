"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Overview", icon: HomeIcon },
  { href: "/admin/products", label: "Products", icon: BoxIcon },
  { href: "/admin/categories", label: "Categories", icon: TagIcon },
  { href: "/admin/orders", label: "Orders", icon: CartIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
];

export function AdminSidebar({ user }: { user: { name?: string | null; email?: string | null } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Link href="/admin" className="text-base font-semibold tracking-tight text-slate-900">
          Next <span className="text-slate-400">Store Admin</span>
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle navigation"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-5">
          <Link href="/admin" className="text-base font-semibold tracking-tight text-slate-900">
            Next <span className="text-slate-400">Store Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-200 px-3 py-4">
          <div className="rounded-xl px-3 py-2">
            <p className="truncate text-sm font-medium text-slate-900">{user.name || "Admin"}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <Link
            href="/"
            className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <ExternalIcon />
            View site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <SignOutIcon />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function HomeIcon() {
  return (
    <Icon>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
    </Icon>
  );
}
function BoxIcon() {
  return (
    <Icon>
      <path d="M3 7l9-4 9 4-9 4-9-4Z" />
      <path d="M3 7v10l9 4V11" />
      <path d="M21 7v10l-9 4" />
    </Icon>
  );
}
function TagIcon() {
  return (
    <Icon>
      <path d="M20.6 13.4 12 22 2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="7" cy="7" r="1.5" />
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
function UsersIcon() {
  return (
    <Icon>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  );
}
function ExternalIcon() {
  return (
    <Icon>
      <path d="M14 3h7v7" />
      <path d="m21 3-9 9" />
      <path d="M21 14v7H3V3h7" />
    </Icon>
  );
}
function SignOutIcon() {
  return (
    <Icon>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
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
