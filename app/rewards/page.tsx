"use client";

import { useEffect, useState } from "react";
import { Coins, Copy, Gift, ShoppingBag, Sparkles, Star, Users } from "lucide-react";
import InfoPage from "@/components/ui/InfoPage";
import Button from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";

const earnWays = [
  { icon: ShoppingBag, label: "Shop", detail: "Earn 1 AtyaCoin for every ₹100 you spend" },
  { icon: Star, label: "Review", detail: "Earn 20 coins for every product review" },
  { icon: Users, label: "Refer a friend", detail: "Earn 200 coins when they place their first order" },
  { icon: Sparkles, label: "Try the AI Fitting Room", detail: "Earn 10 coins the first time you use it" },
];

const rewards = [
  { coins: 100, value: "₹50 off your next order" },
  { coins: 250, value: "₹150 off your next order" },
  { coins: 500, value: "Free shipping for 3 months" },
  { coins: 1000, value: "₹750 off your next order" },
];

export default function RewardsPage() {
  const atyaCoins = useStore((s) => s.atyaCoins);
  const coinHistory = useStore((s) => s.coinHistory);
  const redeemCoins = useStore((s) => s.redeemCoins);
  const referralCode = useStore((s) => s.referralCode);
  const { show } = useToast();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  return (
    <InfoPage icon={Coins} title="AtyaCoins" subtitle="Earn coins on every order and redeem them for discounts.">
      <div className="not-prose rounded-2xl bg-gradient-to-r from-primary to-accent p-6 text-center text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Your balance</p>
        <p className="mt-1 font-heading text-4xl font-extrabold">{atyaCoins} coins</p>
        <p className="mt-1 text-sm text-white/80">≈ {formatINR(atyaCoins)} in rewards</p>
      </div>

      <h2>Ways to earn</h2>
      <div className="not-prose grid gap-3 sm:grid-cols-2">
        {earnWays.map((w) => (
          <div key={w.label} className="rounded-2xl border border-dark/10 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <w.icon size={18} />
            </span>
            <p className="mt-3 font-semibold text-fg">{w.label}</p>
            <p className="mt-1 text-sm text-fg/60">{w.detail}</p>
          </div>
        ))}
      </div>

      <h2>Refer friends, earn more</h2>
      <div className="not-prose rounded-2xl border border-dark/10 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users size={18} />
          </span>
          <div>
            <p className="font-semibold text-fg">Share your referral link</p>
            <p className="mt-1 text-sm text-fg/60">
              Friends who join using your link get 50 welcome AtyaCoins instantly.
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-dark/10 bg-dark/[0.02] px-3 py-2.5">
          <code className="flex-1 truncate text-xs text-fg/70">
            atyakart.in/?ref={referralCode}
          </code>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(`https://atyakart.in/?ref=${referralCode}`);
              show("Referral link copied!");
            }}
          >
            <Copy size={14} />
            Copy
          </Button>
        </div>
      </div>

      <h2>Redeem your coins</h2>
      <div className="not-prose space-y-2">
        {rewards.map((r) => {
          const canRedeem = atyaCoins >= r.coins;
          return (
            <div
              key={r.coins}
              className="flex items-center justify-between gap-3 rounded-2xl border border-dark/10 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Gift size={18} />
                </span>
                <div>
                  <p className="font-semibold text-fg">{r.value}</p>
                  <p className="text-xs text-fg/50">{r.coins} AtyaCoins</p>
                </div>
              </div>
              <Button
                size="sm"
                variant={canRedeem ? "primary" : "outline"}
                disabled={!canRedeem}
                onClick={() => {
                  if (redeemCoins(r.coins)) {
                    show(`Redeemed: ${r.value}`);
                  }
                }}
              >
                Redeem
              </Button>
            </div>
          );
        })}
      </div>

      {coinHistory.length > 0 && (
        <>
          <h2>Recent activity</h2>
          <div className="not-prose space-y-1.5">
            {coinHistory.map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl bg-dark/[0.02] px-4 py-2.5 text-sm"
              >
                <span className="text-fg/70">{entry.label}</span>
                <span className={entry.amount >= 0 ? "font-semibold text-emerald-700" : "font-semibold text-primary"}>
                  {entry.amount >= 0 ? "+" : ""}
                  {entry.amount}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

    </InfoPage>
  );
}

function formatINR(coins: number) {
  return `₹${(coins / 2).toLocaleString("en-IN")}`;
}
