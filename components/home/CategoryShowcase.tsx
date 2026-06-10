"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const cards = [
  {
    slug: "men",
    title: "Men's Edit",
    desc: "Shirts · Jeans · Blazers · Ethnic · Casuals",
    emoji: "👔",
  },
  {
    slug: "women",
    title: "Women's Edit",
    desc: "Sarees · Kurtas · Dresses · Fusion · Western",
    emoji: "🥻",
  },
  {
    slug: "kids",
    title: "Kids' Edit",
    desc: "Boys · Girls · Infants · School · Party Wear",
    emoji: "🧸",
  },
  {
    slug: "zeng",
    title: "ZenG — New",
    desc: "Organic Cotton · Linen Co-ords · Wellness Loungewear",
    emoji: "🌿",
  },
  {
    slug: "beauty",
    title: "Beauty & Personal Care",
    desc: "Skincare · Makeup · Hair Care · Body Care",
    emoji: "🧴",
  },
];

export default function CategoryShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between">
        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-fg sm:text-3xl">
          Shop by Edit
        </h2>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <Link
              href={`/category/${c.slug}`}
              className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-dark p-6 text-white transition hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <span className="text-5xl">{c.emoji}</span>
                <ArrowUpRight
                  size={20}
                  className="text-white/40 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
                />
              </div>
              <div className="mt-10">
                <p className="font-heading text-xl font-bold">{c.title}</p>
                <p className="mt-1 text-xs text-white/50">{c.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
