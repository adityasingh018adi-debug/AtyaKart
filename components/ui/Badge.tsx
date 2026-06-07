import { cn } from "@/lib/utils";

const palette: Record<string, string> = {
  BESTSELLER: "bg-dark text-white",
  NEW: "bg-emerald-600 text-white",
  TRENDING: "bg-accent text-dark",
  PREMIUM: "bg-violet-700 text-white",
  "ECO-FRIENDLY": "bg-green-700 text-white",
  "PARTY WEAR": "bg-fuchsia-600 text-white",
  "SCHOOL ESSENTIAL": "bg-sky-700 text-white",
};

export default function Badge({ label, className }: { label: string; className?: string }) {
  const isDiscount = /OFF/i.test(label);
  const tone = isDiscount ? "bg-primary text-white" : palette[label] ?? "bg-dark/85 text-white";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        tone,
        className
      )}
    >
      {label}
    </span>
  );
}
