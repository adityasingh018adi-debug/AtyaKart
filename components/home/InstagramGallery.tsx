"use client";

import { motion } from "framer-motion";
import { Camera, Heart } from "lucide-react";

const posts = [
  { emoji: "👗", likes: "12.4k", handle: "@anaya.styles" },
  { emoji: "🧥", likes: "8.1k", handle: "@kabir.fits" },
  { emoji: "👟", likes: "15.7k", handle: "@streetwear.in" },
  { emoji: "👜", likes: "6.3k", handle: "@meher.edits" },
  { emoji: "🕶️", likes: "9.9k", handle: "@zeng.wellness" },
  { emoji: "👔", likes: "11.2k", handle: "@officewear.co" },
];

export default function InstagramGallery() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera size={20} className="text-primary" />
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-fg sm:text-3xl">
              #AtyaKartStyle
            </h2>
          </div>
          <p className="mt-1 text-sm text-fg/50">Tag us to get featured — real looks from real people.</p>
        </div>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hidden shrink-0 rounded-full border border-dark/15 px-4 py-2 text-sm font-semibold text-fg transition hover:border-dark/40 sm:block"
        >
          Follow @atyakart
        </a>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {posts.map((post, i) => (
          <motion.div
            key={post.handle}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10"
          >
            <div className="flex h-full w-full items-center justify-center text-6xl transition duration-300 group-hover:scale-110">
              {post.emoji}
            </div>
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-dark/70 via-transparent to-transparent p-3 opacity-0 transition group-hover:opacity-100">
              <p className="text-xs font-semibold text-white">{post.handle}</p>
              <p className="flex items-center gap-1 text-[11px] text-white/70">
                <Heart size={11} className="fill-white" /> {post.likes}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
