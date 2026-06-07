"use client";

import { useMemo } from "react";
import { Shirt } from "lucide-react";
import { products } from "@/lib/products";
import ProductRail from "@/components/product/ProductRail";

export default function CompleteTheLook() {
  const looks = useMemo(() => {
    return [...products]
      .filter((p) => ["BESTSELLER", "TRENDING", "PREMIUM"].includes(p.badge))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, []);

  return (
    <ProductRail
      title="Complete The Look"
      subtitle="Pieces that pair perfectly — styled by the AtyaKart edit team."
      products={looks}
      accent={
        <span className="flex items-center gap-1 rounded-full bg-dark/5 px-2.5 py-1 text-xs font-bold text-dark/60">
          <Shirt size={13} />
          Styled sets
        </span>
      }
    />
  );
}
