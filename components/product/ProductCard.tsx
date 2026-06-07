"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Product } from "@/types";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { formatPrice, cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

const BURST_PARTICLES = Array.from({ length: 6 });

export default function ProductCard({ product }: { product: Product }) {
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlisted = useStore((s) => s.isWishlisted(product.id));
  const { show } = useToast();
  const [burst, setBurst] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 300, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group relative overflow-hidden rounded-2xl border border-dark/10 bg-white shadow-md shadow-dark/5 transition-shadow duration-300 will-change-transform hover:shadow-2xl hover:shadow-dark/15"
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#f1ede7] to-[#e7e1d8]">
          <motion.div
            style={{ transformPerspective: 900 }}
            className="absolute inset-0"
            whileHover={{ scale: 1.08, z: 40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw"
              className="object-cover"
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            <Badge label={product.badge} />
            {product.isNew && product.badge !== "NEW" && <Badge label="NEW" />}
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          const next = !wishlisted;
          toggleWishlist(product);
          show(next ? "Added to wishlist" : "Removed from wishlist");
          if (next) {
            setBurst(true);
            setTimeout(() => setBurst(false), 600);
          }
        }}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-110"
        aria-label="Toggle wishlist"
      >
        <motion.span
          key={wishlisted ? "filled" : "empty"}
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <Heart size={17} className={cn(wishlisted ? "fill-primary text-primary" : "text-dark/50")} />
        </motion.span>

        <AnimatePresence>
          {burst &&
            BURST_PARTICLES.map((_, i) => {
              const angle = (i / BURST_PARTICLES.length) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
                  animate={{
                    opacity: 0,
                    x: Math.cos(angle) * 26,
                    y: Math.sin(angle) * 26,
                    scale: 1,
                  }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-primary"
                />
              );
            })}
        </AnimatePresence>
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
