import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";
import ProductGrid from "@/components/product/ProductGrid";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductDetailClient product={product} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-dark">
            You may also like
          </h2>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
