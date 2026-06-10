import { notFound } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, ShieldCheck, Tag, CheckCircle2 } from "lucide-react";
import { getProduct, products } from "@/lib/products";
import InfoPage from "@/components/ui/InfoPage";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <InfoPage
      icon={BadgeCheck}
      title="Authenticity Verified"
      subtitle="This product is certified genuine by AtyaKart."
    >
      <div className="not-prose rounded-2xl bg-emerald-600/10 p-5 text-center">
        <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
        <p className="mt-2 font-heading text-lg font-extrabold text-emerald-700">
          Genuine AtyaKart Product
        </p>
        <p className="mt-1 text-sm text-fg/60">
          The product you scanned matches our records and is sourced from an
          AtyaKart-certified seller.
        </p>
      </div>

      <div className="not-prose flex items-center gap-3 rounded-2xl border border-dark/10 bg-surface p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Tag size={18} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-fg/40">{product.brand}</p>
          <p className="font-heading text-base font-bold text-fg">{product.name}</p>
          <p className="text-xs text-fg/50">Product ID: {product.id}</p>
        </div>
      </div>

      <div className="not-prose flex items-start gap-3 rounded-2xl border border-dark/10 p-4 text-sm text-fg/60">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-primary" />
        <p>
          Every AtyaKart product carries a unique authenticity code. If you have any
          concerns about a purchase, contact our support team with this product ID and
          your order number.
        </p>
      </div>

      <p className="text-center text-sm">
        <Link href={`/product/${product.id}`} className="font-semibold text-primary hover:underline">
          View product page
        </Link>
      </p>
    </InfoPage>
  );
}
