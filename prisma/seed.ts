import "dotenv/config";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  images: string[];
  thumbnail: string;
}

interface DummyProductsResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

async function main() {
  const existingCount = await prisma.product.count();

  if (existingCount > 0) {
    console.log(
      `Database already has ${existingCount} product(s) — skipping seed.`
    );
    console.log(
      "Delete existing products first if you want to reseed."
    );
    return;
  }

  console.log("Fetching starter catalog from dummyjson.com...");

  const response = await fetch(
    "https://dummyjson.com/products?limit=100",
    {
      signal: AbortSignal.timeout(30000),
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch DummyJSON products. Status: ${response.status}`
    );
  }

  const data =
    (await response.json()) as DummyProductsResponse;

  if (!Array.isArray(data.products) || data.products.length === 0) {
    throw new Error("DummyJSON returned no products");
  }

  console.log(`Inserting ${data.products.length} products...`);

  for (const item of data.products) {
    await prisma.product.create({
      data: {
        title: item.title,
        description: item.description,
        category: item.category,
        price: item.price,
        discountPercentage: item.discountPercentage ?? 0,
        rating: item.rating ?? 0,
        stock: item.stock ?? 0,
        tags: item.tags ?? [],
        brand: item.brand ?? null,
        sku: item.sku ?? null,
        weight: item.weight ?? null,

        // Optional JSON field: use undefined instead of null
        dimensions: item.dimensions ?? undefined,

        warrantyInformation: item.warrantyInformation ?? null,
        shippingInformation: item.shippingInformation ?? null,
        availabilityStatus:
          item.availabilityStatus ?? "In Stock",
        returnPolicy: item.returnPolicy ?? null,
        minimumOrderQuantity:
          item.minimumOrderQuantity ?? 1,
        images: item.images,
        thumbnail: item.thumbnail,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });