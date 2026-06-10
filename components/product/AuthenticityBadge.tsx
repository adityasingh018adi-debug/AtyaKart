import { BadgeCheck } from "lucide-react";

export default function AuthenticityBadge({ id }: { id: string }) {
  const verifyUrl = `https://atyakart.in/verify/${id}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${encodeURIComponent(verifyUrl)}`;

  return (
    <div className="mt-4 flex items-center gap-4 rounded-2xl border border-dark/10 bg-surface p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrSrc}
        alt="Authenticity verification QR code"
        width={72}
        height={72}
        className="shrink-0 rounded-lg border border-dark/10 bg-white p-1"
      />
      <div>
        <p className="flex items-center gap-1.5 text-sm font-bold text-fg">
          <BadgeCheck size={16} className="text-emerald-600" />
          Authenticity Guaranteed
        </p>
        <p className="mt-1 text-xs text-fg/50">
          Scan this code to verify your product is 100% genuine, sourced directly from
          AtyaKart-certified sellers.
        </p>
      </div>
    </div>
  );
}
