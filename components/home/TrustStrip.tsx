import { Truck, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

const items = [
  { icon: Truck, title: "Free Delivery", subtitle: "On orders above ₹999" },
  { icon: RotateCcw, title: "7-Day Returns", subtitle: "No questions asked" },
  { icon: ShieldCheck, title: "Secure Payments", subtitle: "UPI, Cards & COD" },
  { icon: Sparkles, title: "AI-Powered Sizing", subtitle: "Get your perfect fit" },
];

export default function TrustStrip() {
  return (
    <section className="border-b border-dark/10 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-dark">{item.title}</p>
              <p className="text-xs text-dark/50">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
