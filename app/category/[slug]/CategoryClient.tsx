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

  const sorted = useMemo(() => {
    const list = [...products];
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
  }, [products, sort]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-dark/50">{sorted.length} products</p>
        <FilterChips options={sortOptions} active={sort} onChange={setSort} />
      </div>
      <div className="mt-6">
        <ProductGrid products={sorted} />
      </div>
    </section>
  );
}
