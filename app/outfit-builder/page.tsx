"use client";

import { useState } from "react";
import { Wand2, Loader2, Sparkles, RotateCcw } from "lucide-react";
import InfoPage from "@/components/ui/InfoPage";
import ProductGrid from "@/components/product/ProductGrid";
import Button from "@/components/ui/Button";
import { products } from "@/lib/products";
import { Category, Product } from "@/types";
import { cn } from "@/lib/utils";

const OCCASIONS = [
  { value: "office", label: "Office", emoji: "💼" },
  { value: "festive", label: "Festive", emoji: "🪔" },
  { value: "casual", label: "Casual", emoji: "👕" },
  { value: "party", label: "Party", emoji: "🎉" },
  { value: "activewear", label: "Active", emoji: "🧘" },
];

const CATEGORIES: { value: Category | ""; label: string }[] = [
  { value: "", label: "Any" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
  { value: "zeng", label: "ZenG" },
];

export default function OutfitBuilderPage() {
  const [occasion, setOccasion] = useState("casual");
  const [category, setCategory] = useState<Category | "">("");
  const [loading, setLoading] = useState(false);
  const [tip, setTip] = useState<string | null>(null);
  const [items, setItems] = useState<Product[] | null>(null);

  const buildOutfit = async () => {
    setLoading(true);
    setTip(null);
    setItems(null);
    try {
      const res = await fetch("/api/ai-outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occasion, category: category || undefined }),
      });
      const data = await res.json();
      const matched = (data.items as string[])
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p));
      setItems(matched);
      setTip(data.tip);
    } catch {
      setTip("Something went wrong building your outfit. Please try again.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setItems(null);
    setTip(null);
  };

  return (
    <InfoPage
      icon={Wand2}
      title="AI Outfit Builder"
      subtitle="Pick an occasion and let AI put together a complete look from our catalog."
    >
      <div className="not-prose">
        <p className="text-sm font-semibold text-fg">What's the occasion?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setOccasion(o.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition",
                occasion === o.value
                  ? "border-primary bg-primary text-white"
                  : "border-dark/15 bg-surface text-fg/70 hover:border-dark/30"
              )}
            >
              <span>{o.emoji}</span>
              {o.label}
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm font-semibold text-fg">For</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                category === c.value
                  ? "border-primary bg-primary text-white"
                  : "border-dark/15 bg-surface text-fg/70 hover:border-dark/30"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <Button onClick={buildOutfit} disabled={loading} size="lg" className="mt-5">
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Building your outfit...
            </>
          ) : (
            <>
              <Wand2 size={18} />
              Build My Outfit
            </>
          )}
        </Button>

        {tip && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-primary/10 p-4 text-sm text-primary">
            <Sparkles size={18} className="mt-0.5 shrink-0" />
            <p>{tip}</p>
          </div>
        )}

        {items && items.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="font-heading text-lg font-bold text-fg">Your AI-curated outfit</p>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-xs font-semibold text-fg/50 hover:text-primary"
              >
                <RotateCcw size={14} />
                Build another
              </button>
            </div>
            <div className="mt-3">
              <ProductGrid products={items} />
            </div>
          </div>
        )}
      </div>
    </InfoPage>
  );
}
