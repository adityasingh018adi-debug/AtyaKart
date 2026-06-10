"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import ProductGrid from "@/components/product/ProductGrid";
import Button from "@/components/ui/Button";

export default function WishlistPage() {
  const wishlist = useStore((s) => s.wishlist);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <Heart size={56} className="text-fg/20" />
        <h1 className="font-heading text-2xl font-extrabold text-fg">Your wishlist is empty</h1>
        <p className="max-w-sm text-sm text-fg/50">
          Tap the heart on any product to save it here for later.
        </p>
        <Link href="/">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="flex items-center gap-2 font-heading text-2xl font-extrabold tracking-tight text-fg">
        <Heart size={22} className="fill-primary text-primary" />
        Your Wishlist ({wishlist.length})
      </h1>
      <div className="mt-6">
        <ProductGrid products={wishlist} />
      </div>
    </div>
  );
}
