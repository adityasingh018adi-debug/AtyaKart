"use client";

import { useEffect, useMemo, useState } from "react";
import { History } from "lucide-react";
import { products } from "@/lib/products";
import { useStore } from "@/lib/store";
import ProductRail from "@/components/product/ProductRail";

export default function RecentlyViewed() {
  const recentlyViewed = useStore((s) => s.recentlyViewed);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const items = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    return recentlyViewed.map((id) => byId.get(id)).filter((p): p is (typeof products)[number] => Boolean(p));
  }, [recentlyViewed]);

  if (!mounted || items.length === 0) return null;

  return (
    <ProductRail
      title="Recently Viewed"
      subtitle="Pick up where you left off."
      products={items}
      accent={
        <span className="flex items-center gap-1 rounded-full bg-dark/5 px-2.5 py-1 text-xs font-bold text-dark/60">
          <History size={13} />
          Your history
        </span>
      }
    />
  );
}
