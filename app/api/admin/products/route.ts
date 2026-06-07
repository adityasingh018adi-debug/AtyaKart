import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const product = await prisma.product.create({
    data: {
      category: body.category,
      brand: body.brand,
      name: body.name,
      price: Number(body.price),
      originalPrice: Number(body.originalPrice),
      discountPercent: Number(body.discountPercent),
      rating: Number(body.rating),
      reviewCount: Number(body.reviewCount),
      badge: body.badge ?? "",
      emoji: body.emoji ?? "🛍️",
      isNew: Boolean(body.isNew),
      tags: JSON.stringify(body.tags ?? []),
      sizes: JSON.stringify(body.sizes ?? []),
      description: body.description ?? "",
    },
  });
  return NextResponse.json({ product }, { status: 201 });
}
