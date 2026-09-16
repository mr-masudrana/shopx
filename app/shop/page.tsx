"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import type { Product } from "@/types/product";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/products?limit=100"),
        fetch("/api/products/categories"),
      ]);

      if (!productsResponse.ok || !categoriesResponse.ok) {
        throw new Error("Failed to fetch products");
      }

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      setProducts(productsData.products);
      setCategories(categoriesData);
    } catch {
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    // Category
    if (category !== "all") {
      result = result.filter((product) => product.category === category);
    }

    // Sorting
    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;

      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;

      default:
        break;
    }

    return result;
  }, [products, search, category, sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-indigo-600">SHOPX STORE</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Explore Products
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            Discover products you'll love from our curated collection.
          </p>
        </div>
      </section>

      {/* Products */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductFilters
          search={search}
          category={category}
          sort={sort}
          categories={categories}
          productCount={filteredProducts.length}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onSortChange={setSort}
        />

        {error ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-6 text-center">
            <div className="mb-4 text-4xl">⚠️</div>

            <h3 className="text-lg font-semibold text-gray-900">
              Something went wrong
            </h3>

            <p className="mt-2 text-sm text-gray-500">{error}</p>

            <button
              type="button"
              onClick={fetchProducts}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} loading={loading} />
        )}
      </main>
    </div>
  );
}