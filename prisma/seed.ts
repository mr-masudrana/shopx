// One-time seed: pulls the existing dummyjson.com catalog into your own
// database so you're not starting from an empty shop. After this runs,
// the app never talks to dummyjson again — everything comes from your DB.
// Run manually any time with: npm run db:seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: { width: number; height: number; depth: number };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  images: string[];
  thumbnail: string;
}

async function main() {
  const existingCount = await prisma.product.count();

  if (existingCount > 0) {
    console.log(
      `Database already has ${existingCount} product(s) — skipping seed. ` +
        "Delete existing products first if you want to reseed."
    );
    return;
  }

  console.log("Fetching starter catalog from dummyjson.com...");

  const response = await fetch("https://dummyjson.com/products?limit=100");

  if (!response.ok) {
    throw new Error("Failed to fetch dummyjson products for seeding");
  }

  const data: { products: DummyProduct[] } = await response.json();

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
        brand: item.brand,
        sku: item.sku,
        weight: item.weight,
        dimensions: item.dimensions,
        warrantyInformation: item.warrantyInformation,
        shippingInformation: item.shippingInformation,
        availabilityStatus: item.availabilityStatus ?? "In Stock",
        returnPolicy: item.returnPolicy,
        minimumOrderQuantity: item.minimumOrderQuantity ?? 1,
        images: item.images,
        thumbnail: item.thumbnail,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
