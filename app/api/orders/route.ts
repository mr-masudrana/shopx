import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

const shippingSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
});

const cartItemSchema = z.object({
  product: z
    .object({
      id: z.number(),
      price: z.number().nonnegative(),
    })
    .passthrough(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Cart is empty"),
  shipping: shippingSchema,
  paymentMethod: z.enum(["cod", "card", "mobile-banking"]),
});

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.05;

function calculateTotals(items: z.infer<typeof cartItemSchema>[]) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  const tax = subtotal * TAX_RATE;
  const total = subtotal + shippingCost + tax;

  return { subtotal, shippingCost, tax, total };
}

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ?? "Invalid order data",
      },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const { subtotal, shippingCost, tax, total } = calculateTotals(
    data.items
  );

  // Convert Zod data into Prisma-compatible JSON values.
  const orderItems = data.items.map((item) => ({
    product: {
      id: item.product.id,
      price: item.product.price,
    },
    quantity: item.quantity,
  })) as Prisma.InputJsonValue;

  const shippingDetails = {
    firstName: data.shipping.firstName,
    lastName: data.shipping.lastName,
    email: data.shipping.email,
    phone: data.shipping.phone,
    address: data.shipping.address,
    city: data.shipping.city,
    postalCode: data.shipping.postalCode,
    country: data.shipping.country,
  } as Prisma.InputJsonValue;

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      items: orderItems,
      shipping: shippingDetails,
      paymentMethod: data.paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      status: "placed",
    },
  });

  return NextResponse.json({ order }, { status: 201 });
}