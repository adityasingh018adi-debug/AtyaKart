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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  for (const key of [
    "category",
    "brand",
    "name",
    "badge",
    "emoji",
    "description",
  ] as const) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  for (const key of [
    "price",
    "originalPrice",
    "discountPercent",
    "reviewCount",
  ] as const) {
    if (body[key] !== undefined) data[key] = Number(body[key]);
  }
  if (body.rating !== undefined) data.rating = Number(body.rating);
  if (body.isNew !== undefined) data.isNew = Boolean(body.isNew);
  if (body.tags !== undefined) data.tags = JSON.stringify(body.tags);
  if (body.sizes !== undefined) data.sizes = JSON.stringify(body.sizes);

  const product = await prisma.product.update({ where: { id }, data });
  return NextResponse.json({ product });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
