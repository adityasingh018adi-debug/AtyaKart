import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

function fallbackDescription({
  name,
  brand,
  category,
  tags,
}: {
  name: string;
  brand: string;
  category: string;
  tags: string[];
}) {
  const tagText = tags.length ? tags.join(", ") : category;
  const audience =
    category === "men" ? "him" : category === "women" ? "her" : category === "kids" ? "your little one" : "everyone";
  return `Meet the ${name} from ${brand || "AtyaKart"} — designed with ${tagText} in mind. A versatile pick that's perfect for ${audience}, blending comfort and style for everyday wear.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, brand, category, tags } = body as {
      name?: string;
      brand?: string;
      category?: string;
      tags?: string[];
    };

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const safeBrand = brand || "AtyaKart";
    const safeCategory = category || "fashion";
    const safeTags = Array.isArray(tags) ? tags.filter((t) => typeof t === "string") : [];

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        description: fallbackDescription({ name, brand: safeBrand, category: safeCategory, tags: safeTags }),
        mode: "demo",
      });
    }

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You write short, compelling e-commerce product descriptions for AtyaKart, an Indian fashion store. Write 1-2 sentences (max 40 words), in an inviting, premium tone. No markdown, no quotes, just the description text.`;

    const userPrompt = `Product: ${name}\nBrand: ${safeBrand}\nCategory: ${safeCategory}\nTags: ${safeTags.join(", ") || "none"}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 150,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const description =
      textBlock && "text" in textBlock
        ? textBlock.text.trim()
        : fallbackDescription({ name, brand: safeBrand, category: safeCategory, tags: safeTags });

    return NextResponse.json({ description, mode: "live" });
  } catch (err) {
    console.error("ai-product-description error", err);
    return NextResponse.json({
      description: fallbackDescription({ name: "this product", brand: "AtyaKart", category: "fashion", tags: [] }),
      mode: "demo",
    });
  }
}
