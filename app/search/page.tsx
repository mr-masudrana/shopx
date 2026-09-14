"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import SearchInput from "@/components/search/SearchInput";

export default function SearchPage() {
  const { products, loading, error } = useProducts();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);

  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((product) => product.category))
    ).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    const result = products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.title.toLowerCase().includes(normalizedQuery) ||
        product.description
          .toLowerCase()
          .includes(normalizedQuery) ||
        product.category
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesCategory =
        category === "all" || product.category === category;

      const matchesPrice = product.price <= maxPrice;

      const matchesRating = product.rating >= minRating;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesPrice &&
        matchesRating
      );
    });

    return [...result].sort((a, b) => {
      if (sort === "price-low") {
        return a.price - b.price;
      }

      if (sort === "price-high") {
        return b.price - a.price;
      }

      if (sort === "rating-high") {
        return b.rating - a.rating;
      }

      if (sort === "name-asc") {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });
  }, [
    products,
    query,
    category,
    sort,
    maxPrice,
    minRating,
  ]);

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

        <h1 className="text-3xl font-bold">
          Search Products
        </h1>

        <p className="mt-2 text-zinc-500">
          Find the products you are looking for.
        </p>
      </div>

      <div className="mb-8">
        <SearchInput compact />
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal size={19} />
            <h2 className="font-bold">Filters</h2>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Search Keyword
              </span>

              <input
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="e.g. phone"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Category
              </span>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="all">All Categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 flex justify-between text-sm font-medium">
                <span>Maximum Price</span>
                <span className="text-blue-600">
                  ${maxPrice}
                </span>
              </span>

              <input
                type="range"
                min="0"
                max="2000"
                step="10"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(Number(event.target.value))
                }
                className="w-full accent-blue-600"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Minimum Rating
              </span>

              <select
                value={minRating}
                onChange={(event) =>
                  setMinRating(Number(event.target.value))
                }
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="0">All Ratings</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setSort("default");
                setMaxPrice(2000);
                setMinRating(0);
              }}
              className="w-full rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">
              {loading
                ? "Loading products..."
                : `${filteredProducts.length} products found`}
            </p>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
              <option value="rating-high">
                Highest Rated
              </option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-2xl border bg-white px-5 py-16 text-center dark:border-zinc-800 dark:bg-zinc-950">
              <Search
                size={46}
                className="mx-auto text-zinc-300"
              />

              <h2 className="mt-5 text-xl font-bold">
                No Products Found
              </h2>

              <p className="mt-2 text-zinc-500">
                Try a different keyword or adjust your filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}