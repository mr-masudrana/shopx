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

// NOTE: we only trust `product.id` and `quantity` from the client.
// Price is never taken from the request body — it's always re-read
// from the database below, so a tampered request can't change what
// gets charged.
const cartItemSchema = z.object({
  product: z
    .object({
      id: z.number(),
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

class OrderError extends Error {}

interface PricedItem {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
}

function calculateTotals(items: PricedItem[]) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
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

  // Merge duplicate product ids (e.g. same item added twice) so stock
  // is checked/decremented once per product with the combined quantity.
  const quantityByProductId = new Map<number, number>();
  for (const item of data.items) {
    quantityByProductId.set(
      item.product.id,
      (quantityByProductId.get(item.product.id) ?? 0) + item.quantity
    );
  }
  const productIds = Array.from(quantityByProductId.keys());

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

  try {
    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new OrderError(
          "One or more items in your cart are no longer available."
        );
      }

      const pricedItems: PricedItem[] = products.map((product) => {
        const quantity = quantityByProductId.get(product.id)!;

        if (product.stock < quantity) {
          throw new OrderError(
            `Only ${product.stock} left in stock for "${product.title}".`
          );
        }

        return {
          id: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          price: product.price,
          quantity,
        };
      });

      const { subtotal, shippingCost, tax, total } =
        calculateTotals(pricedItems);

      const orderItems = pricedItems.map((item) => ({
        product: {
          id: item.id,
          title: item.title,
          thumbnail: item.thumbnail,
          price: item.price,
        },
        quantity: item.quantity,
      })) as Prisma.InputJsonValue;

      // Decrement stock atomically, guarded by `stock >= quantity` so a
      // concurrent order can't push it negative. If nothing matched,
      // someone else just took the remaining stock — bail out.
      for (const item of pricedItems) {
        const result = await tx.product.updateMany({
          where: { id: item.id, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });

        if (result.count === 0) {
          throw new OrderError(
            `"${item.title}" just sold out. Please update your cart.`
          );
        }
      }

      return tx.order.create({
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
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof OrderError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Something went wrong while placing your order." },
      { status: 500 }
    );
  }
}