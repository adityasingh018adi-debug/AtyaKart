"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ananya R.",
    role: "Verified Buyer · Mumbai",
    quote:
      "The AI Fitting Room nailed my size on the first try — no more guessing or returns. AtyaKart genuinely feels like shopping with a personal stylist.",
    rating: 5,
    avatar: "🧕",
  },
  {
    name: "Kabir M.",
    role: "Verified Buyer · Delhi",
    quote:
      "Fast delivery, premium packaging, and the blazer fit exactly like the size recommendation said it would. This is how online fashion should feel.",
    rating: 5,
    avatar: "🧑",
  },
  {
    name: "Meher S.",
    role: "Verified Buyer · Bengaluru",
    quote:
      "ZenG's organic cotton line is unreal — soft, sustainable, and the AI styling suggestions matched my vibe perfectly. Already ordered three more pieces.",
    rating: 4.8,
    avatar: "👩",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-dark py-14 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
            Loved by 2M+ shoppers across India
          </h2>
          <p className="mt-1.5 text-sm text-white/50">
            Real stories from the AtyaKart community.
          </p>
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-dark relative rounded-2xl p-6"
            >
              <Quote size={28} className="text-primary/60" />
              <p className="mt-3 text-sm leading-relaxed text-white/80">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl">
                  {t.avatar}
                </span>
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
                <span className="ml-auto flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs font-semibold">
                  {t.rating} <Star size={11} className="fill-accent text-accent" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
