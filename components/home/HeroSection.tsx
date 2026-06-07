"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import MagneticButton from "@/components/ui/MagneticButton";

const tiles = [
  { slug: "men", label: "Men", emoji: "👔", color: "from-[#1f2937] to-[#374151]" },
  { slug: "women", label: "Women", emoji: "👗", color: "from-[#7c2d12] to-[#b45309]" },
  { slug: "kids", label: "Kids", emoji: "🧸", color: "from-[#0f766e] to-[#14b8a6]" },
  { slug: "zeng", label: "ZenG", emoji: "🌿", color: "from-[#365314] to-[#65a30d]" },
];

export default function HeroSection({ onOpenAI }: { onOpenAI: () => void }) {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-[#fff7ee] to-background">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Sparkles size={14} />
            New: AI Fitting Room — scan your photo, get your size
          </span>
          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-dark sm:text-5xl lg:text-6xl">
            Fashion for
            <span className="block text-primary">Every Story.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-dark/60 sm:text-lg">
            Shop curated Men&apos;s, Women&apos;s, Kids and ZenG wellness wear — then let our AI
            scan your photo to recommend the exact fit and styles made for you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton>
              <Button size="lg" onClick={onOpenAI}>
                <Sparkles size={18} />
                Try AI Fitting Room
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Link href="/category/zeng">
                <Button size="lg" variant="outline">
                  Explore ZenG
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </MagneticButton>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                href={`/category/${tile.slug}`}
                className={`group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${tile.color} text-white shadow-lg transition hover:-translate-y-1`}
              >
                <span className="text-5xl transition duration-300 group-hover:scale-110 sm:text-6xl">
                  {tile.emoji}
                </span>
                <span className="mt-3 font-heading text-lg font-bold sm:text-xl">{tile.label}</span>
                <span className="mt-1 flex items-center gap-1 text-xs text-white/70">
                  Shop now <ArrowRight size={12} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
