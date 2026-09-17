import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

const ORDER_STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"] as const;

const updateSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid status" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { status } = parsed.data;
  const isNewlyCancelled = status === "cancelled" && order.status !== "cancelled";

  const items = Array.isArray(order.items)
    ? (order.items as Array<{ product: { id: number }; quantity: number }>)
    : [];

  const updated = await prisma.$transaction(async (tx) => {
    if (isNewlyCancelled) {
      // Give the stock back, same as a customer self-cancel would.
      for (const item of items) {
        if (typeof item?.product?.id === "number" && item.quantity > 0) {
          await tx.product.updateMany({
            where: { id: item.product.id },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    return tx.order.update({ where: { id }, data: { status } });
  });

  return NextResponse.json({ order: updated });
}
