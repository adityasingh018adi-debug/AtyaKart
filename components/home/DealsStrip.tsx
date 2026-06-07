"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const deals = [
  "⚡ Flat 50% OFF on Festive Ethnic Wear",
  "🔥 Buy 2 Get 1 Free on ZenG Loungewear",
  "🎉 Extra 10% off on first AI-matched order",
  "🚚 Free delivery on orders above ₹999",
  "👕 Min. 40% off on Men's Casuals",
  "🥻 Banarasi Sarees starting ₹3,499",
];

export default function DealsStrip() {
  const loop = [...deals, ...deals];

  return (
    <div className="overflow-hidden border-y border-primary/20 bg-primary py-2.5 text-white">
      <motion.div
        className="flex shrink-0 gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((deal, i) => (
          <span key={i} className="flex items-center gap-2 text-sm font-semibold">
            <Zap size={14} className="fill-accent text-accent" />
            {deal}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
