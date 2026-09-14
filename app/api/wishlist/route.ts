import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

const addSchema = z.object({
  product: z.object({ id: z.number() }).passthrough(),
});

const removeSchema = z.object({
  productId: z.number(),
});

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    orderBy: { addedAt: "desc" },
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = addSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }

  const { product } = parsed.data;

  const item = await prisma.wishlistItem.upsert({
    where: {
      userId_productId: { userId: user.id, productId: product.id },
    },
    update: {},
    create: {
      userId: user.id,
      productId: product.id,
      product,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = removeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  await prisma.wishlistItem.deleteMany({
    where: { userId: user.id, productId: parsed.data.productId },
  });

  return NextResponse.json({ success: true });
}
