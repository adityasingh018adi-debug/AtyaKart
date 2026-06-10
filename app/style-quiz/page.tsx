"use client";

import { useState } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import InfoPage from "@/components/ui/InfoPage";
import ProductGrid from "@/components/product/ProductGrid";
import { products } from "@/lib/products";

type Persona = "festive" | "office" | "casual" | "party";

const PERSONAS: Record<Persona, { title: string; description: string; tags: string[] }> = {
  festive: {
    title: "Festive Royal",
    description:
      "You light up every celebration. Rich fabrics, intricate work, and statement colours are your signature.",
    tags: ["ethnic", "festive", "saree", "wedding"],
  },
  office: {
    title: "Office Sharp",
    description:
      "Polished, structured, and always put-together. You favour clean lines and timeless tailoring.",
    tags: ["formal", "office", "shirt", "blazer"],
  },
  casual: {
    title: "Easy Comfort",
    description:
      "Effortless and relaxed — you reach for soft fabrics and breathable fits that move with your day.",
    tags: ["casual", "loungewear", "organic", "sustainable"],
  },
  party: {
    title: "Fusion Party",
    description:
      "Bold, fun, and always ready for the next event — you mix textures and silhouettes with confidence.",
    tags: ["party", "fusion", "coord", "dress"],
  },
};

const QUESTIONS: { question: string; options: { label: string; persona: Persona }[] }[] = [
  {
    question: "It's Saturday morning — what are you reaching for?",
    options: [
      { label: "A flowy kurta or saree, just because", persona: "festive" },
      { label: "A crisp shirt — even weekends feel productive", persona: "office" },
      { label: "Something soft and loose, coffee in hand", persona: "casual" },
      { label: "A coord set I can dress up later", persona: "party" },
    ],
  },
  {
    question: "Pick a colour palette:",
    options: [
      { label: "Deep reds, golds, and jewel tones", persona: "festive" },
      { label: "Navy, charcoal, and crisp white", persona: "office" },
      { label: "Sage, sand, and soft neutrals", persona: "casual" },
      { label: "Bold prints and unexpected colour mixes", persona: "party" },
    ],
  },
  {
    question: "Your ideal weekend plan?",
    options: [
      { label: "A wedding or festive get-together", persona: "festive" },
      { label: "Catching up on work from a café", persona: "office" },
      { label: "A long walk and doing nothing much", persona: "casual" },
      { label: "A night out with friends", persona: "party" },
    ],
  },
  {
    question: "Which fabric calls to you?",
    options: [
      { label: "Silk and embroidered georgette", persona: "festive" },
      { label: "Structured cotton and wool blends", persona: "office" },
      { label: "Organic cotton and linen", persona: "casual" },
      { label: "Satin, velvet, or anything with texture", persona: "party" },
    ],
  },
  {
    question: "What's missing from your wardrobe right now?",
    options: [
      { label: "A statement ethnic piece", persona: "festive" },
      { label: "A sharp blazer", persona: "office" },
      { label: "Comfortable loungewear", persona: "casual" },
      { label: "A versatile fusion outfit", persona: "party" },
    ],
  },
];

export default function StyleQuizPage() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<Persona, number>>({ festive: 0, office: 0, casual: 0, party: 0 });
  const [result, setResult] = useState<Persona | null>(null);

  const answer = (persona: Persona) => {
    const next = { ...scores, [persona]: scores[persona] + 1 };
    setScores(next);
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      const winner = (Object.keys(next) as Persona[]).reduce((a, b) => (next[a] >= next[b] ? a : b));
      setResult(winner);
    }
  };

  const restart = () => {
    setStep(0);
    setScores({ festive: 0, office: 0, casual: 0, party: 0 });
    setResult(null);
  };

  if (result) {
    const persona = PERSONAS[result];
    const matches = products.filter((p) => p.tags.some((t) => persona.tags.includes(t))).slice(0, 8);

    return (
      <InfoPage icon={Sparkles} title="Your Style Result" subtitle="Here's what suits you best.">
        <div className="not-prose rounded-2xl bg-primary/10 p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Your style is</p>
          <p className="mt-1 font-heading text-3xl font-extrabold text-primary">{persona.title}</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-fg/70">{persona.description}</p>
          <button
            onClick={restart}
            className="mx-auto mt-4 flex items-center gap-1.5 rounded-full border border-primary/30 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/5"
          >
            <RotateCcw size={14} />
            Retake quiz
          </button>
        </div>

        <h2>Picked for you</h2>
        <div className="not-prose">
          <ProductGrid products={matches} />
        </div>
      </InfoPage>
    );
  }

  const current = QUESTIONS[step];

  return (
    <InfoPage icon={Sparkles} title="Style Personality Quiz" subtitle="Five quick questions to find your perfect aesthetic.">
      <div className="not-prose">
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-dark/10">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
          />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-fg/40">
          Question {step + 1} of {QUESTIONS.length}
        </p>
        <p className="mt-1 font-heading text-xl font-bold text-fg">{current.question}</p>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {current.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => answer(opt.persona)}
              className="rounded-2xl border border-dark/10 bg-surface p-4 text-left text-sm font-medium text-fg transition hover:border-primary/40 hover:bg-primary/5"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </InfoPage>
  );
}
