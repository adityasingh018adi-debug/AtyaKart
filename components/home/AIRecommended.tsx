"use client";

import { useMemo } from "react";
import { Wand2 } from "lucide-react";
import { products } from "@/lib/products";
import { useStore } from "@/lib/store";
import ProductRail from "@/components/product/ProductRail";

export default function AIRecommended() {
  const wishlist = useStore((s) => s.wishlist);
  const cart = useStore((s) => s.cart);

  const recommended = useMemo(() => {
    const seedTags = new Set<string>();
    const seedCategories = new Set<string>();
    const seen = new Set<string>();

    for (const p of [...wishlist, ...cart.map((c) => c.product)]) {
      seen.add(p.id);
      seedCategories.add(p.category);
      p.tags.forEach((t) => seedTags.add(t));
    }

    const scored = products
      .filter((p) => !seen.has(p.id))
      .map((p) => {
        let score = 0;
        if (seedCategories.has(p.category)) score += 2;
        score += p.tags.filter((t) => seedTags.has(t)).length;
        score += p.rating / 5;
        return { product: p, score };
      });

    const hasSignal = seedTags.size > 0 || seedCategories.size > 0;
    const ranked = hasSignal
      ? scored.sort((a, b) => b.score - a.score)
      : scored.sort((a, b) => b.product.rating - a.product.rating);

    return ranked.slice(0, 8).map((s) => s.product);
  }, [wishlist, cart]);

  const personalized = wishlist.length > 0 || cart.length > 0;

  return (
    <ProductRail
      title="AI Recommended For You"
      subtitle={
        personalized
          ? "Curated from what you've been loving lately."
          : "Our style AI's top picks — start browsing to make these even more you."
      }
      products={recommended}
      accent={
        <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 px-2.5 py-1 text-xs font-bold text-primary">
          <Wand2 size={13} />
          Powered by AI
        </span>
      }
    />
  );
}
