import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { products } from "@/lib/products";
import { Category } from "@/types";

export const runtime = "nodejs";

const OCCASION_TAGS: Record<string, string[]> = {
  office: ["office", "formal"],
  festive: ["festive", "ethnic", "wedding"],
  casual: ["casual", "minimal"],
  party: ["party", "fusion", "coord"],
  activewear: ["activewear", "yoga", "loungewear", "sustainable"],
};

const STYLING_TIPS: Record<string, string> = {
  office: "Keep accessories minimal and stick to one statement piece — let the tailoring do the talking.",
  festive: "Layer on traditional jewellery and a bold lip to bring the festive look together.",
  casual: "Roll up your sleeves and add a crossbody bag for an effortless everyday vibe.",
  party: "Mix textures — pair something satin or sequinned with a clean, simple base.",
  activewear: "Choose breathable fabrics and finish with comfortable sneakers for all-day movement.",
};

function fallbackOutfit(occasion: string, category?: Category) {
  const tags = OCCASION_TAGS[occasion] ?? OCCASION_TAGS.casual;
  let pool = products.filter((p) => p.tags.some((t) => tags.includes(t)));
  if (category) {
    const sameCategory = pool.filter((p) => p.category === category);
    if (sameCategory.length) pool = sameCategory;
  }

  const seen = new Set<string>();
  const items = pool
    .filter((p) => {
      if (seen.has(p.category + p.tags[0])) return false;
      seen.add(p.category + p.tags[0]);
      return true;
    })
    .slice(0, 3)
    .map((p) => p.id);

  if (items.length === 0) {
    items.push(...products.slice(0, 3).map((p) => p.id));
  }

  return {
    items,
    tip: STYLING_TIPS[occasion] ?? STYLING_TIPS.casual,
    mode: "demo" as const,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { occasion, category } = body as { occasion?: string; category?: Category };

    if (!occasion || typeof occasion !== "string") {
      return NextResponse.json({ error: "No occasion provided" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(fallbackOutfit(occasion, category));
    }

    const anthropic = new Anthropic({ apiKey });

    const catalog = products
      .filter((p) => !category || p.category === category)
      .map((p) => `${p.id}: ${p.name} (${p.category}, tags: ${p.tags.join("/")})`)
      .join("\n");

    const systemPrompt = `You are AtyaKart's AI Outfit Builder. Given an occasion, pick 2-3 product IDs from the catalog below that work well together as a complete outfit, and write one short styling tip (max 25 words).

Catalog:
${catalog}

Respond ONLY with valid JSON in this exact shape: {"items": ["id1", "id2"], "tip": "..."}. Use only IDs from the catalog above.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: "user", content: `Occasion: ${occasion}` }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text.trim() : "";

    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw) as { items: string[]; tip: string };
      const validIds = new Set(products.map((p) => p.id));
      const items = parsed.items.filter((id) => validIds.has(id)).slice(0, 3);
      if (items.length === 0) return NextResponse.json(fallbackOutfit(occasion, category));
      return NextResponse.json({ items, tip: parsed.tip, mode: "live" });
    } catch {
      return NextResponse.json(fallbackOutfit(occasion, category));
    }
  } catch (err) {
    console.error("ai-outfit error", err);
    return NextResponse.json(fallbackOutfit("casual"));
  }
}
