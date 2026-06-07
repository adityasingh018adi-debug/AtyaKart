import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { products } from "@/lib/products";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

const DEMO_REPLIES = [
  "Great pick! For that, I'd suggest pairing it with a tailored blazer or a structured jacket — it instantly elevates the look while keeping things comfortable.",
  "Based on what you're after, I'd point you toward our New Arrivals or the AI Recommended rail on the homepage — both are refreshed with pieces that match trending silhouettes this season.",
  "For festive occasions, our Desi Roots and Saree Studio collections are stunning — rich fabrics, intricate embroidery, and colours that photograph beautifully.",
  "If comfort is the priority, I'd lean toward ZenG's organic cotton or linen co-ord sets — breathable, sustainable, and effortlessly stylish for everyday wear.",
  "Try our AI Fitting Room first — upload a photo and I can recommend your best size and fit style before you add anything to your bag.",
];

function fallbackReply(message: string) {
  const lower = message.toLowerCase();
  const matched = products
    .filter((p) => p.tags.some((t) => lower.includes(t)) || lower.includes(p.category))
    .slice(0, 3);

  if (matched.length) {
    const names = matched.map((p) => p.name).join(", ");
    return `Here's what I'd recommend from our catalog: ${names}. Want me to tell you more about sizing, fabric, or styling for any of these?`;
  }

  return DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [] } = body as { message?: string; history?: ChatMessage[] };

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: fallbackReply(message), mode: "demo" });
    }

    const anthropic = new Anthropic({ apiKey });

    const catalogSummary = products
      .map((p) => `- ${p.name} (${p.brand}, ₹${p.price}, ${p.category}, tags: ${p.tags.join("/")})`)
      .join("\n");

    const systemPrompt = `You are AtyaKart's AI Fashion Assistant — a warm, knowledgeable personal stylist for an Indian fashion e-commerce store. Help shoppers with style advice, outfit pairing, fabric/occasion guidance, sizing tips, and product discovery.

Here is a sample of AtyaKart's current catalog you can reference and recommend from:
${catalogSummary}

Keep replies concise (2-4 sentences), friendly, and specific. When relevant, mention the AI Fitting Room feature for sizing help. Do not invent products outside this catalog — if nothing fits, give general styling advice instead.`;

    const messages: Anthropic.MessageParam[] = [
      ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: message },
    ];

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: systemPrompt,
      messages,
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const reply = textBlock && "text" in textBlock ? textBlock.text.trim() : fallbackReply(message);

    return NextResponse.json({ reply, mode: "live" });
  } catch (err) {
    console.error("ai-chat error", err);
    return NextResponse.json({ reply: fallbackReply(""), mode: "demo" });
  }
}
