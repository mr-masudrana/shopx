"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PackageSearch,
} from "lucide-react";

import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";
import ProductSkeleton from "@/components/products/ProductSkeleton";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = use(params);

  const categorySlug = decodeURIComponent(slug);

  const { products, loading, error } = useProducts();

  const categoryProducts = useMemo(() => {
    return products.filter(
      (product) => product.category === categorySlug
    );
  }, [products, categorySlug]);

  const categoryTitle = categorySlug
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/shop"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Shop
        </Link>

        <p className="text-sm font-medium capitalize text-blue-600">
          Category
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          {categoryTitle}
        </h1>

        <p className="mt-2 text-zinc-500">
          Explore products from this category.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <ProductSkeleton key={index} />
            )
          )}
        </div>
      ) : categoryProducts.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-16 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <PackageSearch
            size={48}
            className="mx-auto text-zinc-300"
          />

          <h2 className="mt-5 text-xl font-bold">
            No Products in This Category
          </h2>

          <p className="mt-2 text-zinc-500">
            Please explore another category.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categoryProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
}