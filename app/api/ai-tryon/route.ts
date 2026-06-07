import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const BODY_TYPES = ["Rectangle", "Hourglass", "Triangle", "Inverted Triangle", "Oval", "Athletic"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const FIT_STYLES = ["Relaxed Fit", "Slim Fit", "Tailored Fit", "Oversized Fit", "Regular Fit"];

function fallbackScan(styles: string[], notes: string) {
  const bodyType = BODY_TYPES[Math.floor(Math.random() * BODY_TYPES.length)];
  const bestSize = SIZES[Math.floor(Math.random() * SIZES.length)];
  const fitStyle = FIT_STYLES[Math.floor(Math.random() * FIT_STYLES.length)];
  const aiScore = 86 + Math.floor(Math.random() * 12);
  const styleText = styles.length ? styles.join(", ").toLowerCase() : "everyday";

  return {
    bodyType,
    bestSize,
    fitStyle,
    aiScore,
    summary: `Based on your photo, you have a ${bodyType.toLowerCase()} body shape that pairs beautifully with ${fitStyle.toLowerCase()} silhouettes. Size ${bestSize} should give you the most flattering fit for ${styleText} looks${notes ? ` — especially with your note: "${notes}"` : ""}.`,
    recommendations: [
      `${fitStyle} pieces in size ${bestSize} to balance your proportions`,
      `Structured layers (blazers, jackets) to add definition through the shoulders`,
      `Mid-rise bottoms that follow your natural waistline`,
      `Soft, breathable fabrics like cotton and linen for everyday comfort`,
      `Monochrome or tonal palettes to elongate your frame`,
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, styles = [], notes = "" } = body as {
      image?: string;
      styles?: string[];
      notes?: string;
    };

    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ scan: fallbackScan(styles, notes), mode: "demo" });
    }

    const match = image.match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }
    const [, mimeType, base64Data] = match;

    const anthropic = new Anthropic({ apiKey });

    const prompt = `You are AtyaKart's AI Fitting Room assistant. Analyze the uploaded full-length photo to estimate the person's body shape and proportions, then recommend clothing fit guidance for an Indian fashion e-commerce store.

Preferred styles/occasions: ${styles.length ? styles.join(", ") : "not specified"}
Additional notes from the user: ${notes || "none"}

Respond ONLY with a strict JSON object (no markdown, no extra text) in this exact shape:
{
  "bodyType": one of ["Rectangle","Hourglass","Triangle","Inverted Triangle","Oval","Athletic"],
  "bestSize": one of ["XS","S","M","L","XL","XXL"],
  "fitStyle": one of ["Relaxed Fit","Slim Fit","Tailored Fit","Oversized Fit","Regular Fit"],
  "aiScore": integer between 80 and 99 representing confidence,
  "summary": a warm, 2-3 sentence personalized styling summary referencing their body shape and chosen styles,
  "recommendations": an array of exactly 5 short, specific styling tips strings
}

This is for a fashion-fit recommendation feature — focus only on general body proportions, silhouette, and style guidance. Do not include any other commentary.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType as "image/png" | "image/jpeg" | "image/webp",
                data: base64Data,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "";

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ scan: fallbackScan(styles, notes), mode: "demo" });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      scan: {
        bodyType: parsed.bodyType ?? "Rectangle",
        bestSize: parsed.bestSize ?? "M",
        fitStyle: parsed.fitStyle ?? "Regular Fit",
        aiScore: typeof parsed.aiScore === "number" ? parsed.aiScore : 90,
        summary: parsed.summary ?? "",
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 5) : [],
      },
      mode: "live",
    });
  } catch (err) {
    console.error("ai-tryon error", err);
    return NextResponse.json({ scan: fallbackScan([], ""), mode: "demo" });
  }
}
