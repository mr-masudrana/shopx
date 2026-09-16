import type { Product as PrismaProduct } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { Product } from "@/types/product";

interface ListProductsOptions {
  search?: string;
  category?: string;
  limit?: number;
}

// Prisma represents "no value" as null; the app's Product type (shaped
// after dummyjson's API) uses undefined for optional fields. Normalize
// here so every consumer gets a consistent, correctly-typed Product.
function toProduct(product: PrismaProduct): Product {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    category: product.category,
    price: product.price,
    discountPercentage: product.discountPercentage,
    rating: product.rating,
    stock: product.stock,
    tags: product.tags,
    brand: product.brand ?? undefined,
    sku: product.sku ?? undefined,
    weight: product.weight ?? undefined,
    dimensions: (product.dimensions as Product["dimensions"]) ?? undefined,
    warrantyInformation: product.warrantyInformation ?? undefined,
    shippingInformation: product.shippingInformation ?? undefined,
    availabilityStatus: product.availabilityStatus ?? undefined,
    returnPolicy: product.returnPolicy ?? undefined,
    minimumOrderQuantity: product.minimumOrderQuantity ?? undefined,
    images: product.images,
    thumbnail: product.thumbnail,
  };
}

export async function getAllProducts(
  options: ListProductsOptions = {}
): Promise<Product[]> {
  const { search, category, limit } = options;

  const where: Record<string, unknown> = {};

  if (category && category !== "all") {
    where.category = category;
  }

  if (search && search.trim()) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return products.map(toProduct);
}

export async function getProductById(id: string | number): Promise<Product> {
  const numericId = typeof id === "string" ? Number(id) : id;

  if (!Number.isInteger(numericId)) {
    throw new Error("Product not found");
  }

  const product = await prisma.product.findUnique({
    where: { id: numericId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return toProduct(product);
}

export async function getCategories(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" },
  });

  return rows.map((row) => row.category);
}
