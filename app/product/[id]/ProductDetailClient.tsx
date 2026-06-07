"use client";

import { useEffect, useState } from "react";
import { Heart, Star, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { Product } from "@/types";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { formatPrice, cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function ProductDetailClient({ product }: { product: Product }) {
  const [size, setSize] = useState<string | null>(null);
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlisted = useStore((s) => s.isWishlisted(product.id));
  const addRecentlyViewed = useStore((s) => s.addRecentlyViewed);
  const { show } = useToast();

  useEffect(() => {
    addRecentlyViewed(product.id);
  }, [product.id, addRecentlyViewed]);

  const handleAddToCart = () => {
    if (!size) {
      show("Please select a size first");
      return;
    }
    addToCart(product, size);
    show(`Added ${product.name} (${size}) to cart`);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#f1ede7] to-[#e7e1d8] text-[10rem]">
        {product.emoji}
        <div className="absolute left-4 top-4 flex flex-col gap-1.5">
          <Badge label={product.badge} />
          {product.isNew && product.badge !== "NEW" && <Badge label="NEW" />}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-dark/40">{product.brand}</p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold tracking-tight text-dark">
          {product.name}
        </h1>

        <div className="mt-3 flex items-center gap-2 text-sm text-dark/60">
          <span className="flex items-center gap-1 rounded bg-emerald-700 px-2 py-0.5 text-xs font-bold text-white">
            {product.rating} <Star size={11} className="fill-white" />
          </span>
          <span>{product.reviewCount.toLocaleString("en-IN")} ratings</span>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="font-heading text-3xl font-extrabold text-dark">
            {formatPrice(product.price)}
          </span>
          <span className="text-base text-dark/40 line-through">{formatPrice(product.originalPrice)}</span>
          <span className="text-base font-bold text-primary">{product.discountPercent}% off</span>
        </div>
        <p className="mt-1 text-xs text-emerald-700">inclusive of all taxes</p>

        <p className="mt-5 max-w-lg text-sm leading-relaxed text-dark/60">{product.description}</p>

        <div className="mt-6">
          <p className="text-sm font-semibold text-dark">Select Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "min-w-12 rounded-xl border px-4 py-2 text-sm font-semibold transition",
                  size === s
                    ? "border-primary bg-primary text-white"
                    : "border-dark/15 bg-white text-dark/70 hover:border-dark/40"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" onClick={handleAddToCart} className="flex-1 sm:flex-none">
            Add to Bag
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              toggleWishlist(product);
              show(wishlisted ? "Removed from wishlist" : "Added to wishlist");
            }}
          >
            <Heart size={18} className={cn(wishlisted && "fill-primary text-primary")} />
            Wishlist
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 rounded-2xl border border-dark/10 bg-white p-4 sm:grid-cols-3">
          {[
            { icon: Truck, label: "Free delivery", sub: "Orders above ₹999" },
            { icon: RotateCcw, label: "7-day returns", sub: "Easy & free" },
            { icon: ShieldCheck, label: "Secure checkout", sub: "100% protected" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-2.5">
              <f.icon size={18} className="text-primary" />
              <div>
                <p className="text-xs font-semibold text-dark">{f.label}</p>
                <p className="text-[11px] text-dark/40">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
