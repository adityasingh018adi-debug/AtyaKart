import { notFound } from "next/navigation";
import { getProductsByCategory } from "@/lib/products";
import CategoryClient from "./CategoryClient";

const categoryInfo: Record<string, { title: string; desc: string; emoji: string }> = {
  men: {
    title: "Men",
    desc: "Shirts · Jeans · Blazers · Ethnic · Casuals",
    emoji: "👔",
  },
  women: {
    title: "Women",
    desc: "Sarees · Kurtas · Dresses · Fusion · Western",
    emoji: "🥻",
  },
  kids: {
    title: "Kids",
    desc: "Boys · Girls · Infants · School · Party Wear",
    emoji: "🧸",
  },
  zeng: {
    title: "ZenG",
    desc: "Organic Cotton · Linen Co-ords · Wellness Loungewear",
    emoji: "🌿",
  },
  beauty: {
    title: "Beauty & Personal Care",
    desc: "Skincare · Makeup · Hair Care · Body Care",
    emoji: "🧴",
  },
};

export function generateStaticParams() {
  return Object.keys(categoryInfo).map((slug) => ({ slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const info = categoryInfo[slug];
  if (!info) notFound();

  const items = getProductsByCategory(slug);

  return (
    <div>
      <div className="border-b border-dark/10 bg-surface">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-8 sm:px-6 lg:px-8">
          <span className="text-5xl">{info.emoji}</span>
          <div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-fg">{info.title}</h1>
            <p className="mt-1 text-sm text-fg/50">{info.desc}</p>
          </div>
        </div>
      </div>
      <CategoryClient products={items} />
    </div>
  );
}
