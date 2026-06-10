"use client";

import { useMemo, useState } from "react";
import { products } from "@/lib/products";
import FilterChips from "@/components/product/FilterChips";
import ProductGrid from "@/components/product/ProductGrid";

const filters = [
  { label: "All", value: "all" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Kids", value: "kids" },
  { label: "ZenG", value: "zeng" },
  { label: "New Arrivals", value: "new" },
];

export default function ProductsSection() {
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return products;
    if (active === "new") return products.filter((p) => p.isNew);
    return products.filter((p) => p.category === active);
  }, [active]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-fg sm:text-3xl">
            Picked for You
          </h2>
          <p className="mt-1 text-sm text-fg/50">Trending styles across all AtyaKart edits</p>
        </div>
        <FilterChips options={filters} active={active} onChange={setActive} />
      </div>

      <div className="mt-6">
        <ProductGrid products={filtered} />
      </div>
    </section>
  );
}
