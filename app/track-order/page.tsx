"use client";

import { useState } from "react";
import { PackageSearch } from "lucide-react";
import InfoPage from "@/components/ui/InfoPage";
import Button from "@/components/ui/Button";

export default function TrackOrderPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <InfoPage
      icon={PackageSearch}
      title="Track Your Order"
      subtitle="Enter your order ID and email to see the latest status."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="not-prose flex flex-col gap-3 rounded-2xl border border-dark/10 bg-dark/[0.02] p-5 sm:flex-row sm:items-end"
      >
        <label className="flex-1 text-sm">
          <span className="mb-1 block font-semibold text-dark">Order ID</span>
          <input
            required
            placeholder="e.g. AK-204871"
            className="w-full rounded-xl border border-dark/15 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="flex-1 text-sm">
          <span className="mb-1 block font-semibold text-dark">Email address</span>
          <input
            required
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-dark/15 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>
        <Button type="submit" size="md">
          Track Order
        </Button>
      </form>

      {submitted && (
        <p className="not-prose rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          Thanks! If this order exists on your account, status updates will appear here and be
          emailed to you shortly.
        </p>
      )}

      <h2>How tracking works</h2>
      <p>
        Once your order ships, you&apos;ll receive an email and SMS with a tracking link. You can
        also check status anytime from <span className="font-semibold text-dark">My Orders</span>{" "}
        in your account, or right here using your order ID and email.
      </p>
      <ul>
        <li>Orders are usually processed within 24 hours of being placed.</li>
        <li>Standard delivery takes 3–6 business days depending on your location.</li>
        <li>You&apos;ll get a notification at every step — packed, shipped, out for delivery, delivered.</li>
      </ul>
    </InfoPage>
  );
}
