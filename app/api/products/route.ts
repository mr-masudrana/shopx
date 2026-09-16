import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getAllProducts } from "@/lib/products";
import { getSessionUser } from "@/lib/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;

  const products = await getAllProducts({
    search,
    category,
    limit: limit && Number.isFinite(limit) ? limit : undefined,
  });

  return NextResponse.json({ products, total: products.length });
}

const createProductSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  category: z.string().trim().min(1, "Category is required"),
  price: z.number().nonnegative(),
  discountPercentage: z.number().min(0).max(100).optional(),
  stock: z.number().int().nonnegative().optional(),
  brand: z.string().trim().optional(),
  sku: z.string().trim().optional(),
  tags: z.array(z.string().trim()).optional(),
  images: z.array(z.string().url()).min(1, "At least one image URL is required"),
  thumbnail: z.string().url().optional(),
});

// Any logged-in user can add a product for now — this project has no
// separate admin role yet. Add one later if you need to restrict this.
export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid product data" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const product = await prisma.product.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      price: data.price,
      discountPercentage: data.discountPercentage ?? 0,
      stock: data.stock ?? 0,
      brand: data.brand,
      sku: data.sku,
      tags: data.tags ?? [],
      images: data.images,
      thumbnail: data.thumbnail ?? data.images[0],
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
