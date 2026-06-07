"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AddToCartButton({
  onAdd,
  className,
  size = "lg",
}: {
  onAdd: () => boolean | void;
  className?: string;
  size?: "md" | "lg";
}) {
  const [state, setState] = useState<"idle" | "added">("idle");

  const handleClick = () => {
    const ok = onAdd();
    if (ok === false) return;
    setState("added");
    setTimeout(() => setState("idle"), 1400);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.96 }}
      animate={{
        backgroundColor: state === "added" ? "#16a34a" : "#ef4444",
        width: state === "added" ? "auto" : "auto",
      }}
      transition={{ duration: 0.25 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 overflow-hidden rounded-full text-white shadow-sm shadow-primary/30 transition-shadow hover:shadow-lg",
        size === "lg" ? "px-7 py-3.5 text-base font-semibold" : "px-5 py-2.5 text-sm font-semibold",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "idle" ? (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-2"
          >
            <ShoppingBag size={18} />
            Add to Bag
          </motion.span>
        ) : (
          <motion.span
            key="added"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-2"
          >
            <motion.span
              initial={{ scale: 0.4, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
            >
              <Check size={18} />
            </motion.span>
            Added to Bag
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
