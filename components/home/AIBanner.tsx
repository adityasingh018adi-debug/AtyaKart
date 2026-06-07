"use client";

import { motion } from "framer-motion";
import { Camera, Wand2, ScanFace } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AIBanner({ onOpenAI }: { onOpenAI: () => void }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark via-[#241a14] to-primary p-8 text-white sm:p-12"
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-accent">
              <Wand2 size={14} />
              AtyaKart AI Fitting Room
            </span>
            <h3 className="mt-4 font-heading text-2xl font-extrabold leading-tight sm:text-3xl">
              Upload your photo. Let AI find your perfect fit & style.
            </h3>
            <p className="mt-3 max-w-lg text-sm text-white/70 sm:text-base">
              Our AI scans your body proportions, identifies your shape, and curates
              personalized AtyaKart picks — complete with size recommendations and a fit score,
              all in seconds.
            </p>
            <Button onClick={onOpenAI} variant="secondary" size="lg" className="mt-6">
              <Camera size={18} />
              Scan My Body & Find Perfect Fit
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: ScanFace, label: "Body Scan" },
              { icon: Wand2, label: "Style Match" },
              { icon: Camera, label: "Smart Sizing" },
            ].map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-5 text-center backdrop-blur"
              >
                <f.icon size={26} className="text-accent" />
                <span className="text-xs font-semibold text-white/80">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
