"use client";

import { useMemo, useState } from "react";
import { Product } from "@/types";
import FilterChips from "@/components/product/FilterChips";
import ProductGrid from "@/components/product/ProductGrid";

const sortOptions = [
  { label: "Popular", value: "popular" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
  { label: "New Arrivals", value: "new" },
];

export default function CategoryClient({ products }: { products: Product[] }) {
  const [sort, setSort] = useState("popular");
  const [tag, setTag] = useState("all");

  const types = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of products) {
      const t = p.tags[0];
      if (t && !seen.has(t)) seen.set(t, p.emoji);
    }
    return Array.from(seen.entries()).map(([value, emoji]) => ({ value, emoji }));
  }, [products]);

  const filtered = useMemo(() => {
    if (tag === "all") return products;
    return products.filter((p) => p.tags.includes(tag));
  }, [products, tag]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "new":
        return list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      default:
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [filtered, sort]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {types.length > 1 && (
        <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setTag("all")}
            className="flex shrink-0 flex-col items-center gap-2"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full border-2 text-2xl transition ${
                tag === "all" ? "border-primary bg-primary/10" : "border-dark/10 bg-surface"
              }`}
            >
              ✨
            </span>
            <span className={`text-xs font-semibold ${tag === "all" ? "text-primary" : "text-fg/60"}`}>
              All
            </span>
          </button>
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => setTag(t.value)}
              className="flex shrink-0 flex-col items-center gap-2"
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full border-2 text-2xl transition ${
                  tag === t.value ? "border-primary bg-primary/10" : "border-dark/10 bg-surface"
                }`}
              >
                {t.emoji}
              </span>
              <span className={`text-xs font-semibold capitalize ${tag === t.value ? "text-primary" : "text-fg/60"}`}>
                {t.value}
              </span>
            </button>
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-fg/50">{sorted.length} products</p>
        <FilterChips options={sortOptions} active={sort} onChange={setSort} />
      </div>
      <div className="mt-6">
        <ProductGrid products={sorted} />
      </div>
    </section>
  );
}
