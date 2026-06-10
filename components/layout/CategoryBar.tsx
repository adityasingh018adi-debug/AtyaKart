"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const categories = [
  { slug: "men", label: "Men", emoji: "👔" },
  { slug: "women", label: "Women", emoji: "👗" },
  { slug: "kids", label: "Kids", emoji: "🧸" },
  { slug: "zeng", label: "ZenG", emoji: "🌿" },
];

export default function CategoryBar() {
  const pathname = usePathname();

  return (
    <div className="border-b border-dark/10 bg-surface">
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 scrollbar-none sm:px-6 lg:px-8">
        {categories.map((c) => {
          const href = `/category/${c.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={c.slug}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-semibold transition",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-fg/60 hover:text-fg"
              )}
            >
              <span>{c.emoji}</span>
              {c.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
