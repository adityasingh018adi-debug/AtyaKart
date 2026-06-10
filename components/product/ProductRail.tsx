import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";

export default function ProductRail({
  title,
  subtitle,
  products,
  viewAllHref,
  accent,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  accent?: React.ReactNode;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-fg sm:text-3xl">
              {title}
            </h2>
            {accent}
          </div>
          {subtitle && <p className="mt-1 text-sm text-fg/50">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline sm:flex"
          >
            View all <ArrowRight size={15} />
          </Link>
        )}
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {products.map((product) => (
          <div key={product.id} className="w-[46%] shrink-0 sm:w-[31%] lg:w-[23%]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
