import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logoGold" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff3d6" />
          <stop offset="0.5" stopColor="#ffd35c" />
          <stop offset="1" stopColor="#e0a52a" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="#0e0c07" />

      {/* swoosh ring */}
      <path
        d="M9 27c5 7 25 7 30 0"
        stroke="url(#logoGold)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* bag */}
      <path d="M18 14a4 4 0 0 1 8 0v2.5" stroke="url(#logoGold)" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="14.5" y="16.5" width="15" height="11" rx="1.5" fill="url(#logoGold)" />

      {/* cart */}
      <path d="M12 21h22l-2.5 9h-15z" fill="none" stroke="url(#logoGold)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16 24h14M17 27h12" stroke="url(#logoGold)" strokeWidth="0.8" opacity="0.7" />
      <circle cx="20" cy="33" r="1.8" fill="url(#logoGold)" />
      <circle cx="27" cy="33" r="1.8" fill="url(#logoGold)" />

      {/* sparkles */}
      <path d="M37 11l1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z" fill="url(#logoGold)" />
      <circle cx="33" cy="17" r="0.9" fill="url(#logoGold)" />
    </svg>
  );
}

export default function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark className={markClassName} />
      <span className="font-display text-2xl font-bold tracking-tight" style={{ color: "#caa454" }}>
        Atya<span className="text-fg">Kart</span>
      </span>
    </span>
  );
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <span className={cn("flex flex-col items-center gap-3", className)}>
      <LogoMark className="h-16 w-16" />
      <span className="font-display text-4xl font-bold tracking-tight" style={{ color: "#caa454" }}>
        Atya<span className="text-fg">Kart</span>
      </span>
      <span className="flex items-center gap-2 text-xs" style={{ color: "#caa454" }}>
        <span className="h-px w-8" style={{ background: "#caa454" }} />
        <span>✦</span>
        <span className="h-px w-8" style={{ background: "#caa454" }} />
      </span>
    </span>
  );
}
