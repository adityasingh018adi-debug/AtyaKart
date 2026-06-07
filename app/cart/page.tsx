"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const cart = useStore((s) => s.cart);
  const updateQty = useStore((s) => s.updateQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const cartTotal = useStore((s) => s.cartTotal());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <span className="text-6xl">🛍️</span>
        <h1 className="font-heading text-2xl font-extrabold text-dark">Your bag is empty</h1>
        <p className="max-w-sm text-sm text-dark/50">
          Looks like you haven&apos;t added anything yet. Explore our collections and find styles
          you&apos;ll love.
        </p>
        <Link href="/">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const shipping = cartTotal >= 999 ? 0 : 79;
  const total = cartTotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="flex items-center gap-2 font-heading text-2xl font-extrabold tracking-tight text-dark">
        <ShoppingBag size={24} />
        Your Bag ({cart.length})
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-dark/10 bg-white p-4"
            >
              <Link
                href={`/product/${item.product.id}`}
                className="flex h-28 w-24 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f1ede7] to-[#e7e1d8] text-4xl"
              >
                {item.product.emoji}
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-dark/40">
                    {item.product.brand}
                  </p>
                  <Link href={`/product/${item.product.id}`} className="text-sm font-bold text-dark hover:text-primary">
                    {item.product.name}
                  </Link>
                  <p className="mt-1 text-xs text-dark/50">Size: {item.size}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-dark/15 px-2 py-1">
                    <button
                      onClick={() => updateQty(item.product.id, item.size, item.qty - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-dark/5"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.product.id, item.size, item.qty + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-dark/5"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-heading text-base font-extrabold text-dark">
                    {formatPrice(item.product.price * item.qty)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.product.id, item.size)}
                className="self-start rounded-full p-2 text-dark/30 hover:bg-primary/10 hover:text-primary"
                aria-label="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit space-y-4 rounded-2xl border border-dark/10 bg-white p-6">
          <h2 className="font-heading text-lg font-bold text-dark">Order Summary</h2>
          <div className="space-y-2 text-sm text-dark/60">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-dark">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-dark">
                {shipping === 0 ? <span className="text-emerald-700">FREE</span> : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-dark/40">Add {formatPrice(999 - cartTotal)} more for free shipping</p>
            )}
          </div>
          <div className="border-t border-dark/10 pt-3 flex items-center justify-between">
            <span className="font-semibold text-dark">Total</span>
            <span className="font-heading text-xl font-extrabold text-dark">{formatPrice(total)}</span>
          </div>
          <Link href="/checkout" className="block">
            <Button size="lg" className="w-full">
              Proceed to Checkout
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
