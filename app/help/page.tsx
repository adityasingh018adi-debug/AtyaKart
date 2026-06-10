import Link from "next/link";
import {
  HelpCircle,
  PackageSearch,
  RotateCcw,
  Ruler,
  Coins,
  MessageCircle,
  User,
  Heart,
  ArrowRight,
} from "lucide-react";
import InfoPage from "@/components/ui/InfoPage";

const actions = [
  {
    icon: PackageSearch,
    title: "Track your order",
    desc: "Check delivery status using your order ID and email.",
    href: "/track-order",
  },
  {
    icon: RotateCcw,
    title: "Returns & refunds",
    desc: "Start a return, check eligibility, and refund timelines.",
    href: "/shipping-returns",
  },
  {
    icon: Ruler,
    title: "Size guide",
    desc: "Find your perfect fit across all categories.",
    href: "/size-guide",
  },
  {
    icon: Coins,
    title: "AtyaCoins & rewards",
    desc: "Check your balance, redeem coins, and refer friends.",
    href: "/rewards",
  },
  {
    icon: Heart,
    title: "Wishlist",
    desc: "View and manage the items you've saved.",
    href: "/wishlist",
  },
  {
    icon: User,
    title: "Account & sign in",
    desc: "Sign in to manage your addresses and orders.",
    href: "/login",
  },
];

const faqs = [
  {
    q: "How do I cancel or change my order?",
    a: "Orders can be cancelled within 1 hour of placing them from the Track Order page. After that, please contact support and we'll do our best to help.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, Visa, Mastercard, net banking, and Cash on Delivery (COD) on eligible orders.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 3–6 business days. Free delivery is available on orders above ₹999.",
  },
  {
    q: "How do I know my product is genuine?",
    a: "Every AtyaKart product ships with an authenticity QR code on its product page — scan it to verify.",
  },
];

export default function HelpPage() {
  return (
    <InfoPage
      icon={HelpCircle}
      title="Hello. What can we help you with?"
      subtitle="Find quick answers below, or reach out to our support team."
    >
      <div className="not-prose grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="group flex flex-col rounded-2xl border border-dark/10 p-4 transition hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <a.icon size={18} />
            </span>
            <p className="mt-3 flex items-center gap-1 font-semibold text-fg">
              {a.title}
              <ArrowRight size={14} className="text-fg/30 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </p>
            <p className="mt-1 text-sm text-fg/60">{a.desc}</p>
          </Link>
        ))}
      </div>

      <h2>Frequently asked questions</h2>
      <div className="not-prose space-y-2">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-dark/10 p-4">
            <summary className="cursor-pointer list-none font-semibold text-fg marker:hidden">
              {f.q}
            </summary>
            <p className="mt-2 text-sm text-fg/60">{f.a}</p>
          </details>
        ))}
      </div>

      <p>
        Still need help?{" "}
        <Link href="/contact" className="font-semibold text-primary hover:underline">
          Contact our support team
        </Link>{" "}
        and we'll get back to you within 24 hours.
      </p>
    </InfoPage>
  );
}
