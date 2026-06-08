"use client";

import { useState } from "react";
import { Mail, MessageCircle, Phone, MapPin } from "lucide-react";
import InfoPage from "@/components/ui/InfoPage";
import Button from "@/components/ui/Button";

const channels = [
  { icon: Mail, label: "Email", value: "support@atyakart.in" },
  { icon: Phone, label: "Phone", value: "+91 1800-123-4567 (Mon–Sat, 10am–7pm)" },
  { icon: MapPin, label: "Studio", value: "Bandra Kurla Complex, Mumbai, India" },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <InfoPage
      icon={MessageCircle}
      title="Contact Us"
      subtitle="Questions about an order, sizing, or anything else — we're here to help."
    >
      <div className="not-prose grid gap-3 sm:grid-cols-3">
        {channels.map((c) => (
          <div key={c.label} className="rounded-2xl border border-dark/10 p-4">
            <c.icon size={18} className="text-primary" />
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-dark/40">{c.label}</p>
            <p className="mt-0.5 text-sm font-medium text-dark">{c.value}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="not-prose flex flex-col gap-3 rounded-2xl border border-dark/10 bg-dark/[0.02] p-5"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-dark">Name</span>
            <input
              required
              className="w-full rounded-xl border border-dark/15 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-dark">Email</span>
            <input
              required
              type="email"
              className="w-full rounded-xl border border-dark/15 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
        </div>
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-dark">Message</span>
          <textarea
            required
            rows={4}
            placeholder="How can we help?"
            className="w-full rounded-xl border border-dark/15 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>
        <Button type="submit" size="md" className="self-start">
          Send Message
        </Button>
        {sent && (
          <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
            Thanks for reaching out — our team will get back to you within 24 hours.
          </p>
        )}
      </form>
    </InfoPage>
  );
}
