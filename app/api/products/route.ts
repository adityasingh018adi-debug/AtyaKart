import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/products";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const isNew = searchParams.get("new");

  let result = products;

  if (category) {
    result = result.filter((p) => p.category === category);
  }
  if (tag) {
    result = result.filter((p) => p.tags.includes(tag));
  }
  if (isNew === "true") {
    result = result.filter((p) => p.isNew);
  }

  return NextResponse.json({ count: result.length, products: result });
}
