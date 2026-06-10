"use client";

import { useEffect, useState } from "react";
import { Star, Coins } from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductReviews({
  productId,
  baseRating,
  baseReviewCount,
}: {
  productId: string;
  baseRating: number;
  baseReviewCount: number;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const earnCoins = useStore((s) => s.earnCoins);
  const hasReviewed = useStore((s) => s.hasReviewed(productId));
  const markReviewed = useStore((s) => s.markReviewed);
  const { show } = useToast();

  useEffect(() => {
    fetch(`/api/products/${productId}/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews ?? []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [productId]);

  const totalCount = baseReviewCount + reviews.length;
  const totalRatingSum = baseRating * baseReviewCount + reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = totalCount > 0 ? totalRatingSum / totalCount : baseRating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName: name.trim(), rating, comment: comment.trim() }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      const data = await res.json();
      setReviews((prev) => [data.review, ...prev]);
      setShowForm(false);
      setName("");
      setComment("");
      setRating(5);
      show("Thanks for your review!");

      if (!hasReviewed) {
        earnCoins(20, "Wrote a review");
        markReviewed(productId);
        show("You earned 20 AtyaCoins for your review");
      }
    } catch {
      show("Couldn't submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-fg">Ratings & Reviews</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-fg/60">
            <span className="flex items-center gap-1 rounded bg-emerald-700 px-2 py-0.5 text-xs font-bold text-white">
              {avgRating.toFixed(1)} <Star size={11} className="fill-white" />
            </span>
            {totalCount.toLocaleString("en-IN")} ratings
          </p>
        </div>
        {!showForm && (
          <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
            <Coins size={14} className="text-accent" />
            Write a review
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-2xl border border-dark/10 bg-surface p-4">
          {!hasReviewed && (
            <p className="flex items-center gap-1.5 rounded-xl bg-accent/10 px-3 py-2 text-xs font-semibold text-accent">
              <Coins size={14} />
              Earn 20 AtyaCoins for your first review on this product
            </p>
          )}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`Rate ${n} stars`}
                className="p-0.5"
              >
                <Star size={22} className={cn(n <= rating ? "fill-accent text-accent" : "text-dark/20")} />
              </button>
            ))}
          </div>
          <input
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-dark/15 bg-surface px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <textarea
            required
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-dark/15 bg-surface px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit review"}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="mt-4 space-y-3">
        {loading ? (
          <p className="text-sm text-fg/40">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-fg/40">No reviews yet. Be the first to share your thoughts!</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-dark/10 bg-surface p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-fg">{r.authorName}</p>
                <span className="flex items-center gap-1 rounded bg-emerald-700 px-1.5 py-0.5 text-[11px] font-bold text-white">
                  {r.rating} <Star size={10} className="fill-white" />
                </span>
              </div>
              <p className="mt-1.5 text-sm text-fg/60">{r.comment}</p>
              <p className="mt-1.5 text-[11px] text-fg/35">
                {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
