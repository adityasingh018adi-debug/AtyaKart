"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Phone, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState<"google" | "phone" | null>(null);
  const [error, setError] = useState("");

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }
    setLoading("phone");
    const res = await signIn("phone", {
      phone: phone.trim(),
      name: name.trim(),
      redirect: false,
    });
    setLoading(null);
    if (res?.error) {
      setError("Couldn't sign you in. Please try again.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading("google");
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles size={22} />
        </div>
        <h1 className="font-display text-2xl font-bold text-fg">Sign in to AtyaKart</h1>
        <p className="mt-1 text-sm text-fg/50">
          Track orders, save your wishlist, and unlock the AI Fitting Room.
        </p>
      </div>

      <div className="rounded-2xl border border-dark/10 bg-surface p-6 shadow-sm">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center"
          onClick={handleGoogleSignIn}
          disabled={loading !== null}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.8-.4-4.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 19 12 24 12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 16.3 3 9.6 7.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 45c5.4 0 10.3-2.1 14-5.4l-6.5-5.3C29.5 36 26.9 37 24 37c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.5 40.6 16.2 45 24 45z"/>
            <path fill="#1976D2" d="M43.6 20.5h-1.9V20H24v8h11.3c-.8 2.3-2.2 4.2-4 5.6l6.5 5.3C40.9 36.6 45 31 45 24c0-1.4-.1-2.8-.4-4.5z"/>
          </svg>
          {loading === "google" ? "Redirecting…" : "Continue with Google"}
        </Button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-dark/10" />
          <span className="text-xs uppercase tracking-wide text-fg/40">or use your phone</span>
          <div className="h-px flex-1 bg-dark/10" />
        </div>

        <form onSubmit={handlePhoneSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-fg/60">Phone number</label>
            <div className="flex items-center gap-2 rounded-xl border border-dark/15 px-3 py-2.5 focus-within:border-primary/50">
              <Phone size={16} className="text-fg/40" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-transparent text-sm text-fg placeholder:text-fg/30 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-fg/60">Name (first time only)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should we call you?"
              className="w-full rounded-xl border border-dark/15 px-3 py-2.5 text-sm text-fg placeholder:text-fg/30 focus:border-primary/50 focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-primary">{error}</p>}

          <Button type="submit" className="w-full justify-center" disabled={loading !== null}>
            {loading === "phone" ? "Signing in…" : "Continue with phone"}
          </Button>
        </form>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-fg/40">
          No OTP needed for this demo — we&apos;ll create or sign you into your account using
          the phone number you enter.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
