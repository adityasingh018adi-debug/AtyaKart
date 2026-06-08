import Link from "next/link";
import { Truck, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Men", href: "/category/men" },
      { label: "Women", href: "/category/women" },
      { label: "Kids", href: "/category/kids" },
      { label: "ZenG", href: "/category/zeng" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track Order", href: "/track-order" },
      { label: "Shipping & Returns", href: "/shipping-returns" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "About AtyaKart",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "AI Fitting Room", href: "/ai-fitting-room" },
      { label: "Sustainability", href: "/sustainability" },
    ],
  },
];

const trust = [
  { icon: Truck, label: "Free Delivery over ₹999" },
  { icon: RotateCcw, label: "7-Day Easy Returns" },
  { icon: ShieldCheck, label: "100% Secure Payments" },
  { icon: Sparkles, label: "AI-Powered Sizing" },
];

export default function Footer() {
  return (
    <footer className="border-t border-dark/10 bg-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <p className="font-heading text-2xl font-extrabold tracking-tight">
            Atya<span className="text-accent">Kart</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-white/60">
            Fashion for Every Story. Premium Indian fashion across Men&apos;s, Women&apos;s, Kids
            and ZenG — sized smarter with AI.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {trust.map((t) => (
              <div key={t.label} className="flex items-center gap-2 text-xs text-white/70">
                <t.icon size={16} className="text-accent" />
                {t.label}
              </div>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold text-white">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 transition hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} AtyaKart. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="rounded bg-white/10 px-2.5 py-1">UPI</span>
            <span className="rounded bg-white/10 px-2.5 py-1">Visa</span>
            <span className="rounded bg-white/10 px-2.5 py-1">Mastercard</span>
            <span className="rounded bg-white/10 px-2.5 py-1">Net Banking</span>
            <span className="rounded bg-white/10 px-2.5 py-1">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
