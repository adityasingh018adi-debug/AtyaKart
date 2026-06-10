import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reviews = await prisma.review.findMany({
    where: { productId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { authorName, rating, comment } = body as { authorName?: string; rating?: number; comment?: string };

  if (!authorName || typeof authorName !== "string" || !authorName.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!comment || typeof comment !== "string" || !comment.trim()) {
    return NextResponse.json({ error: "Review text is required" }, { status: 400 });
  }
  const ratingNum = Number(rating);
  if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      productId: id,
      authorName: authorName.trim().slice(0, 60),
      rating: Math.round(ratingNum),
      comment: comment.trim().slice(0, 1000),
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
