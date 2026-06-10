"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { products } from "@/lib/products";
import ProductGrid from "@/components/product/ProductGrid";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const maxPriceParam = searchParams.get("maxPrice");
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : null;

  const results = useMemo(() => {
    if (!query && !maxPrice) return [];
    let list = products;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        [p.name, p.brand, p.category, p.badge, ...p.tags].some((field) =>
          field.toLowerCase().includes(q)
        )
      );
    }
    if (maxPrice) {
      list = list.filter((p) => p.price <= maxPrice);
    }
    return list;
  }, [query, maxPrice]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 text-fg/50">
        <SearchIcon size={16} />
        <p className="text-sm">
          {query ? (
            <>
              {results.length} result{results.length === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-fg">&ldquo;{query}&rdquo;</span>
              {maxPrice ? ` under ₹${maxPrice}` : ""}
            </>
          ) : maxPrice ? (
            <>
              {results.length} product{results.length === 1 ? "" : "s"} under{" "}
              <span className="font-semibold text-fg">₹{maxPrice}</span>
            </>
          ) : (
            "Type something in the search bar to find products"
          )}
        </p>
      </div>

      <div className="mt-6">
        <ProductGrid products={results} />
      </div>
    </div>
  );
}
