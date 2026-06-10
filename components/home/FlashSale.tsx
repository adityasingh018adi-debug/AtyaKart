"use client";

import { useEffect, useMemo, useState } from "react";
import { Zap } from "lucide-react";
import { products } from "@/lib/products";
import ProductRail from "@/components/product/ProductRail";

function getNextMidnight() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next;
}

function useCountdown() {
  const target = useMemo(getNextMidnight, []);
  const [remaining, setRemaining] = useState(() => target.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => setRemaining(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const total = Math.max(0, remaining);
  const hours = Math.floor(total / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1000);

  return { hours, minutes, seconds };
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-dark px-3 py-1.5 text-white">
      <span className="font-heading text-lg font-extrabold tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] uppercase tracking-wide text-white/60">{label}</span>
    </div>
  );
}

export default function FlashSale() {
  const { hours, minutes, seconds } = useCountdown();
  const deals = products.filter((p) => p.discountPercent >= 40).slice(0, 8);

  return (
    <ProductRail
      title="Flash Sale"
      subtitle="Deep discounts that disappear at midnight — grab them before they're gone."
      products={deals}
      viewAllHref="/search?q=off"
      accent={
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            <Zap size={13} className="fill-primary" />
            Up to 70% off
          </span>
          <div className="flex items-center gap-1.5">
            <TimeBox value={hours} label="hrs" />
            <span className="font-bold text-fg/30">:</span>
            <TimeBox value={minutes} label="min" />
            <span className="font-bold text-fg/30">:</span>
            <TimeBox value={seconds} label="sec" />
          </div>
        </div>
      }
    />
  );
}
