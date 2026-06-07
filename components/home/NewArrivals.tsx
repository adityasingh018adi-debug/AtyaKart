import { Sparkles } from "lucide-react";
import { products } from "@/lib/products";
import ProductRail from "@/components/product/ProductRail";

export default function NewArrivals() {
  const arrivals = products.filter((p) => p.isNew).slice(0, 8);

  return (
    <ProductRail
      title="New Arrivals"
      subtitle="Fresh drops, just landed in the AtyaKart edit."
      products={arrivals}
      viewAllHref="/search?q=new"
      accent={
        <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-bold text-accent">
          <Sparkles size={13} />
          Just dropped
        </span>
      }
    />
  );
}
