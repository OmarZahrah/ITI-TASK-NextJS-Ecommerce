import Link from "next/link";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/products" },
      { label: "New arrivals", href: "/products" },
      { label: "Sale", href: "/products" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Shipping", href: "/contact" },
      { label: "Returns", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/about" },
      { label: "Blog", href: "/about" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_repeat(3,1fr)] lg:px-8">
        <div>
          <Link href="/" className="text-base font-semibold tracking-tight text-slate-900">
            Next <span className="text-slate-400">Store</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-slate-500">
            A modern, minimal shopping experience.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{col.title}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-700 transition hover:text-slate-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 text-xs text-slate-500 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Next Store</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/about" className="hover:text-slate-900">Privacy</Link>
            <Link href="/about" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
