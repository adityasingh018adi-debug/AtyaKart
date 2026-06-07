"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { formatPrice, cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

export default function ProductCard({ product }: { product: Product }) {
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlisted = useStore((s) => s.isWishlisted(product.id));
  const { show } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className="group relative overflow-hidden rounded-2xl border border-dark/10 bg-white transition hover:shadow-xl hover:shadow-dark/5"
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-gradient-to-br from-[#f1ede7] to-[#e7e1d8] text-7xl">
          <span className="transition duration-300 group-hover:scale-110">{product.emoji}</span>
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            <Badge label={product.badge} />
            {product.isNew && product.badge !== "NEW" && <Badge label="NEW" />}
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product);
          show(wishlisted ? "Removed from wishlist" : "Added to wishlist");
        }}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-105"
        aria-label="Toggle wishlist"
      >
        <Heart size={17} className={cn(wishlisted ? "fill-primary text-primary" : "text-dark/50")} />
      </button>

      <Link href={`/product/${product.id}`} className="block space-y-1.5 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-dark/40">{product.brand}</p>
        <p className="line-clamp-1 text-sm font-bold text-dark">{product.name}</p>
        <div className="flex items-center gap-1 text-xs text-dark/50">
          <span className="flex items-center gap-0.5 rounded bg-emerald-700 px-1.5 py-0.5 font-semibold text-white">
            {product.rating} <Star size={10} className="fill-white" />
          </span>
          <span>({product.reviewCount.toLocaleString("en-IN")})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-extrabold text-dark">{formatPrice(product.price)}</span>
          <span className="text-xs text-dark/40 line-through">{formatPrice(product.originalPrice)}</span>
          <span className="text-xs font-bold text-primary">{product.discountPercent}% off</span>
        </div>
      </Link>
    </motion.div>
  );
}
