import { Eye, Flame } from "lucide-react";
import { hashString } from "@/lib/utils";

export default function ScarcitySignal({ id }: { id: string }) {
  const hash = hashString(id);

  // Roughly 1 in 3 products show a "low stock" signal, another 1 in 3 show "viewers".
  const bucket = hash % 3;

  if (bucket === 0) {
    const left = (hash % 5) + 1;
    return (
      <p className="flex items-center gap-1 text-[11px] font-semibold text-primary">
        <Flame size={12} className="fill-primary" />
        Only {left} left in stock
      </p>
    );
  }

  if (bucket === 1) {
    const viewers = (hash % 18) + 3;
    return (
      <p className="flex items-center gap-1 text-[11px] font-medium text-fg/50">
        <Eye size={12} />
        {viewers} people viewing this
      </p>
    );
  }

  return null;
}
