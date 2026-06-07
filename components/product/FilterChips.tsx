"use client";

import { cn } from "@/lib/utils";

interface FilterChipsProps {
  options: { label: string; value: string }[];
  active: string;
  onChange: (value: string) => void;
}

export default function FilterChips({ options, active, onChange }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-semibold transition",
            active === opt.value
              ? "border-primary bg-primary text-white"
              : "border-dark/15 bg-white text-dark/70 hover:border-dark/40"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
