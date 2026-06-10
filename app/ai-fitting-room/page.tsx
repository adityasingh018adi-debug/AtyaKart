"use client";

import { Sparkles, ScanFace, Ruler, Wand2 } from "lucide-react";
import InfoPage from "@/components/ui/InfoPage";
import Button from "@/components/ui/Button";
import { useAIModal } from "@/components/layout/LayoutShell";

const steps = [
  { icon: ScanFace, title: "Scan", text: "Upload or take a quick photo — no special equipment needed." },
  { icon: Ruler, title: "Measure", text: "Our AI estimates your body shape and measurements in seconds." },
  { icon: Wand2, title: "Match", text: "Get a personalised size recommendation for any product, every time." },
];

export default function AIFittingRoomPage() {
  const openAI = useAIModal();

  return (
    <InfoPage
      icon={Sparkles}
      title="AI Fitting Room"
      subtitle="Scan your photo, get your size — no more guessing, no more returns."
    >
      <div className="not-prose grid gap-3 sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.title} className="rounded-2xl border border-dark/10 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <s.icon size={18} />
            </span>
            <p className="mt-3 font-semibold text-fg">{s.title}</p>
            <p className="mt-1 text-sm text-fg/60">{s.text}</p>
          </div>
        ))}
      </div>

      <p>
        Most online returns happen because something didn&apos;t fit — not because people changed
        their mind. The AI Fitting Room solves that by turning a single photo into a size
        recommendation tailored to you, for every product on AtyaKart.
      </p>
      <p>Your photos are used only to estimate fit and are never shared or sold.</p>

      <div className="not-prose">
        <Button size="lg" onClick={openAI}>
          <Sparkles size={18} />
          Scan My Body & Find Perfect Fit
        </Button>
      </div>
    </InfoPage>
  );
}
