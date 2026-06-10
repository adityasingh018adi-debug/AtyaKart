"use client";

import { useEffect, useState } from "react";
import { Gift, X } from "lucide-react";
import { useStore } from "@/lib/store";

export default function ReferralBanner() {
  const [show, setShow] = useState(false);
  const claimReferralBonus = useStore((s) => s.claimReferralBonus);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("ref")) return;
    if (claimReferralBonus()) {
      setShow(true);
    }
  }, [claimReferralBonus]);

  if (!show) return null;

  return (
    <div className="bg-accent/10 px-4 py-2.5 text-center text-sm font-semibold text-accent">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
        <Gift size={16} />
        Welcome! You've earned 50 AtyaCoins for joining via a friend's link.
        <button onClick={() => setShow(false)} className="ml-2 text-accent/60 hover:text-accent" aria-label="Dismiss">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
