"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MapPin, CreditCard, Wallet, Banknote } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const paymentOptions = [
  { value: "upi", label: "UPI", icon: Wallet },
  { value: "card", label: "Credit / Debit Card", icon: CreditCard },
  { value: "cod", label: "Cash on Delivery", icon: Banknote },
];

export default function CheckoutPage() {
  const cart = useStore((s) => s.cart);
  const cartTotal = useStore((s) => s.cartTotal());
  const clearCart = useStore((s) => s.clearCart);
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  const [payment, setPayment] = useState("upi");
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", pincode: "" });

  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;

  if (cart.length === 0 && !placed) {
    router.replace("/cart");
    return null;
  }

  const shipping = cartTotal >= 999 ? 0 : 79;
  const total = cartTotal + shipping;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <CheckCircle2 size={64} className="text-emerald-600" />
        <h1 className="font-heading text-2xl font-extrabold text-dark">Order placed successfully!</h1>
        <p className="max-w-sm text-sm text-dark/50">
          Thank you for shopping with AtyaKart. Your order of {formatPrice(total)} will be
          delivered soon. A confirmation has been sent to your phone.
        </p>
        <Button size="lg" onClick={() => router.push("/")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-dark">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-dark/10 bg-white p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-dark">
              <MapPin size={18} className="text-primary" />
              Delivery Address
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-xl border border-dark/15 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              <input
                required
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="rounded-xl border border-dark/15 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              <input
                required
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="rounded-xl border border-dark/15 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none sm:col-span-2"
              />
              <input
                required
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="rounded-xl border border-dark/15 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              <input
                required
                placeholder="Pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="rounded-xl border border-dark/15 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-dark/10 bg-white p-6">
            <h2 className="font-heading text-lg font-bold text-dark">Payment Method</h2>
            <div className="mt-4 space-y-2">
              {paymentOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setPayment(opt.value)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition",
                    payment === opt.value
                      ? "border-primary bg-primary/5 text-dark"
                      : "border-dark/15 text-dark/60 hover:border-dark/30"
                  )}
                >
                  <opt.icon size={18} className={payment === opt.value ? "text-primary" : "text-dark/40"} />
                  {opt.label}
                  {payment === opt.value && (
                    <CheckCircle2 size={16} className="ml-auto text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-fit space-y-4 rounded-2xl border border-dark/10 bg-white p-6">
          <h2 className="font-heading text-lg font-bold text-dark">Order Summary</h2>
          <div className="space-y-2 text-sm text-dark/60">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="line-clamp-1">
                  {item.product.name} ({item.size}) × {item.qty}
                </span>
                <span className="font-semibold text-dark">{formatPrice(item.product.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-dark/10 pt-3 text-sm text-dark/60">
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
          </div>
          <div className="flex items-center justify-between border-t border-dark/10 pt-3">
            <span className="font-semibold text-dark">Total</span>
            <span className="font-heading text-xl font-extrabold text-dark">{formatPrice(total)}</span>
          </div>
          <Button type="submit" size="lg" className="w-full">
            Place Order
          </Button>
        </div>
      </form>
    </div>
  );
}
