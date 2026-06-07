"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  UploadCloud,
  Sparkles,
  Loader2,
  Star,
  Repeat,
  ShoppingBag,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { products } from "@/lib/products";
import { BodyScan } from "@/types";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";

const STYLE_TAGS = [
  "Casual",
  "Office Formal",
  "Wedding/Ethnic",
  "Beach/Vacation",
  "Party",
  "Gym/Sports",
  "ZenG Wellness",
];

const SCAN_STEPS = [
  "Detecting body outline & proportions...",
  "Identifying body type & shape...",
  "Calculating optimal size recommendations...",
  "Matching your style preferences...",
  "Curating personalized AtyaKart picks...",
];

type Phase = "upload" | "scanning" | "results";

export default function AITryOnModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("upload");
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(0);
  const [scan, setScan] = useState<BodyScan | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addToCart = useStore((s) => s.addToCart);
  const { show } = useToast();

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => {
        setPhase("upload");
        setPhoto(null);
        setSelectedStyles([]);
        setNotes("");
        setStep(0);
        setScan(null);
        setError(null);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG or WEBP).");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toggleStyle = (tag: string) => {
    setSelectedStyles((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const runScan = async () => {
    if (!photo) return;
    setPhase("scanning");
    setError(null);
    setStep(0);

    const stepInterval = setInterval(() => {
      setStep((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
    }, 1100);

    try {
      const [scanResult] = await Promise.all([
        fetch("/api/ai-tryon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: photo, styles: selectedStyles, notes }),
        }).then((res) => res.json()),
        new Promise((resolve) => setTimeout(resolve, SCAN_STEPS.length * 1100)),
      ]);

      clearInterval(stepInterval);

      if (scanResult.error) {
        setError(scanResult.error);
        setPhase("upload");
        return;
      }

      setScan(scanResult.scan);
      setPhase("results");
    } catch {
      clearInterval(stepInterval);
      setError("Something went wrong while scanning. Please try again.");
      setPhase("upload");
    }
  };

  const recommended = products.slice(0, 5);

  const handleAddAll = () => {
    recommended.forEach((p) => addToCart(p, scan?.bestSize ?? p.sizes[0]));
    show("Added curated picks to your bag");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-dark/60 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-dark/10 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white">
                  <Sparkles size={17} />
                </span>
                <div>
                  <p className="font-heading text-lg font-extrabold leading-tight text-dark">
                    AI Fitting Room
                  </p>
                  <p className="text-xs text-dark/40">Find your perfect fit, instantly</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-dark/40 hover:bg-dark/5 hover:text-dark"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {phase === "upload" && (
                <div className="space-y-6">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFile(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition",
                      dragOver ? "border-primary bg-primary/5" : "border-dark/15 hover:border-dark/30"
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                      }}
                    />
                    {photo ? (
                      <div className="relative h-56 w-40 overflow-hidden rounded-xl">
                        <Image src={photo} alt="Uploaded preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <>
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <UploadCloud size={26} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-dark">
                            Drag & drop your photo, or click to upload
                          </p>
                          <p className="mt-1 text-xs text-dark/40">
                            A clear, full-length photo works best · JPG, PNG, WEBP
                          </p>
                        </div>
                      </>
                    )}
                    {photo && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhoto(null);
                        }}
                        className="text-xs font-semibold text-primary underline"
                      >
                        Choose a different photo
                      </button>
                    )}
                  </div>

                  {error && <p className="text-sm font-medium text-primary">{error}</p>}

                  <div>
                    <p className="text-sm font-semibold text-dark">What&apos;s the occasion or style?</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {STYLE_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleStyle(tag)}
                          className={cn(
                            "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                            selectedStyles.includes(tag)
                              ? "border-primary bg-primary text-white"
                              : "border-dark/15 bg-white text-dark/60 hover:border-dark/30"
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-dark">
                      Anything else? (optional)
                    </p>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Describe your style or occasion — e.g. 'I prefer relaxed fits and earthy tones for a friend's wedding'"
                      rows={3}
                      className="mt-2 w-full resize-none rounded-2xl border border-dark/15 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <Button size="lg" className="w-full" disabled={!photo} onClick={runScan}>
                    <Sparkles size={18} />
                    Scan My Body & Find Perfect Fit
                  </Button>
                </div>
              )}

              {phase === "scanning" && (
                <div className="flex flex-col items-center justify-center gap-8 py-10 text-center">
                  <div className="relative flex h-32 w-32 items-center justify-center">
                    <motion.span
                      className="absolute inset-0 rounded-full border-4 border-primary/15"
                    />
                    <motion.span
                      className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                    />
                    {photo ? (
                      <div className="relative h-24 w-24 overflow-hidden rounded-full">
                        <Image src={photo} alt="" fill className="object-cover" />
                      </div>
                    ) : (
                      <Loader2 className="animate-spin text-primary" size={32} />
                    )}
                  </div>

                  <div className="w-full max-w-sm space-y-3">
                    {SCAN_STEPS.map((label, i) => (
                      <div key={label} className="flex items-center gap-3 text-left">
                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition",
                            i < step
                              ? "bg-emerald-600 text-white"
                              : i === step
                              ? "bg-primary text-white"
                              : "bg-dark/10 text-dark/40"
                          )}
                        >
                          {i < step ? "✓" : i + 1}
                        </span>
                        <span
                          className={cn(
                            "text-sm transition",
                            i <= step ? "font-semibold text-dark" : "text-dark/40"
                          )}
                        >
                          {label}
                        </span>
                        {i === step && (
                          <Loader2 className="ml-auto animate-spin text-primary" size={14} />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="h-2 w-full max-w-sm overflow-hidden rounded-full bg-dark/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      animate={{ width: `${((step + 1) / SCAN_STEPS.length) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              )}

              {phase === "results" && scan && (
                <div className="space-y-6">
                  <div className="rounded-2xl bg-gradient-to-br from-dark to-[#241a14] p-5 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-accent">
                          <Sparkles size={13} />
                          Your AI Style Report
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-white/80">{scan.summary}</p>
                      </div>
                      {photo && (
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl ring-2 ring-white/20">
                          <Image src={photo} alt="" fill className="object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: "Body Type", value: scan.bodyType },
                      { label: "Best Size", value: scan.bestSize },
                      { label: "Fit Style", value: scan.fitStyle },
                      { label: "AI Score", value: `${scan.aiScore}%` },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-2xl border border-dark/10 bg-white p-4 text-center">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-dark/40">
                          {stat.label}
                        </p>
                        <p className="mt-1 font-heading text-lg font-extrabold text-dark">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-dark">AI Styling Tips</p>
                    <ul className="mt-2 space-y-1.5">
                      {scan.recommendations.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-dark/60">
                          <Star size={13} className="mt-0.5 shrink-0 fill-accent text-accent" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-dark">Curated AtyaKart Picks for You</p>
                      <span className="text-xs text-dark/40">Scroll for more →</span>
                    </div>
                    <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                      {recommended.map((p) => (
                        <Link
                          key={p.id}
                          href={`/product/${p.id}`}
                          onClick={onClose}
                          className="w-36 shrink-0 overflow-hidden rounded-2xl border border-dark/10 bg-white"
                        >
                          <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#f1ede7] to-[#e7e1d8]">
                            <Image src={p.image} alt={p.name} fill sizes="144px" className="object-cover" />
                          </div>
                          <div className="space-y-1 p-3">
                            <p className="line-clamp-1 text-xs font-bold text-dark">{p.name}</p>
                            <p className="text-xs font-extrabold text-dark">{formatPrice(p.price)}</p>
                            <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              Size {scan.bestSize} match
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button size="lg" onClick={handleAddAll} className="flex-1 sm:flex-none">
                      <ShoppingBag size={18} />
                      Shop My AI Picks
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setPhase("upload")}>
                      <Repeat size={16} />
                      Scan Again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
