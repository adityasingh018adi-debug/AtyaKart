"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Search, Heart, ShoppingBag, Menu, X, Sparkles, User, LogOut, ShieldCheck, Home } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";

function AccountMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-dark/10" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 rounded-full border border-dark/15 px-3.5 py-2 text-sm font-semibold text-fg hover:border-dark/40"
      >
        <User size={16} />
        <span className="hidden sm:inline">Sign in</span>
      </Link>
    );
  }

  const initial = (session.user.name ?? session.user.email ?? "U").charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary hover:bg-primary/20"
        aria-label="Account menu"
      >
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={session.user.image} alt="" className="h-9 w-9 rounded-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-dark/10 bg-surface p-2 shadow-lg">
            <div className="px-3 py-2">
              <p className="truncate text-sm font-semibold text-fg">{session.user.name ?? "Welcome"}</p>
              <p className="truncate text-xs text-fg/40">{session.user.email ?? session.user.id}</p>
            </div>
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-fg/70 hover:bg-primary/5 hover:text-primary"
              >
                <ShieldCheck size={16} />
                Admin Panel
              </Link>
            )}
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-fg/70 hover:bg-dark/5"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md items-center gap-2 rounded-full border border-dark/15 bg-surface px-4 py-2 text-sm text-fg/50 focus-within:border-primary/50"
    >
      <button type="submit" aria-label="Search" className="text-fg/40 hover:text-primary">
        <Search size={16} />
      </button>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for clothing, brands and more"
        className="w-full bg-transparent text-fg placeholder:text-fg/40 focus:outline-none"
      />
    </form>
  );
}

export default function Navbar({ onOpenAI }: { onOpenAI: () => void }) {
  const cartCount = useStore((s) => s.cartCount());
  const wishlistCount = useStore((s) => s.wishlist.length);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-dark/10 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          className="rounded-md p-2 hover:bg-dark/5 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" className="font-heading text-2xl font-extrabold tracking-tight text-primary">
          Atya<span className="text-fg">Kart</span>
        </Link>

        <Link
          href="/"
          className="ml-1 hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-fg/70 transition hover:bg-dark/5 hover:text-primary lg:flex"
        >
          <Home size={16} />
          Home
        </Link>

        <div className="ml-2 hidden flex-1 items-center lg:flex">
          <Suspense fallback={<div className="h-9 w-full max-w-md rounded-full border border-dark/15 bg-surface" />}>
            <SearchBar />
          </Suspense>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenAI}
            className={cn(
              "hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-90 sm:flex"
            )}
          >
            <Sparkles size={16} />
            AI Fitting Room
          </button>

          <ThemeToggle />

          <Link href="/wishlist" className="relative rounded-full p-2.5 hover:bg-dark/5" aria-label="Wishlist">
            <Heart size={20} />
            <AnimatePresence>
              {mounted && wishlistCount > 0 && (
                <motion.span
                  key={wishlistCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 14 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <Link href="/cart" className="relative rounded-full p-2.5 hover:bg-dark/5" aria-label="Cart">
            <ShoppingBag size={20} />
            <AnimatePresence>
              {mounted && cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 14 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {mounted && <AccountMenu />}
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-3 border-t border-dark/10 bg-background px-4 py-3 lg:hidden">
          <Suspense fallback={<div className="h-9 w-full rounded-full border border-dark/15 bg-surface" />}>
            <SearchBar />
          </Suspense>
          {[
            { href: "/", label: "Home" },
            { href: "/category/men", label: "Men" },
            { href: "/category/women", label: "Women" },
            { href: "/category/kids", label: "Kids" },
            { href: "/category/zeng", label: "ZenG" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-fg hover:bg-dark/5"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              onOpenAI();
            }}
            className="mt-1 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-bold text-white"
          >
            <Sparkles size={16} />
            AI Fitting Room
          </button>
        </nav>
      )}
    </header>
  );
}
