import { Tag } from "lucide-react";
import { products } from "@/lib/products";
import ProductRail from "@/components/product/ProductRail";

const BUDGET_CAP = 999;

export default function BudgetPicks() {
  const picks = products
    .filter((p) => p.price <= BUDGET_CAP)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  return (
    <ProductRail
      title={`Under ₹${BUDGET_CAP}`}
      subtitle="Smart styles that won't stretch your budget."
      products={picks}
      viewAllHref={`/search?maxPrice=${BUDGET_CAP}`}
      accent={
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-600">
          <Tag size={13} />
          Budget picks
        </span>
      }
    />
  );
}
