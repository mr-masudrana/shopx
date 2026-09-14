"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import SearchInput from "@/components/search/SearchInput";

const PRODUCTS_PER_PAGE = 8;

export default function SearchPageContent() {
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") || "";

  const { products, loading, error } = useProducts();

  const [query, setQuery] = useState(urlQuery);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setQuery(urlQuery);
    setCurrentPage(1);
  }, [urlQuery]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((product) => product.category))
    ).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    const result = products.filter((product) => {
      const searchableText = [
        product.title,
        product.description,
        product.category,
        product.brand || "",
        ...(product.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        !normalizedQuery ||
        searchableText.includes(normalizedQuery);

      const matchesCategory =
        category === "all" ||
        product.category === category;

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
      switch (sort) {
        case "price-low":
          return a.price - b.price;

        case "price-high":
          return b.price - a.price;

        case "rating-high":
          return b.rating - a.rating;

        case "name-asc":
          return a.title.localeCompare(b.title);

        default:
          return 0;
      }
    });
  }, [
    products,
    query,
    category,
    sort,
    maxPrice,
    minRating,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length / PRODUCTS_PER_PAGE
    )
  );

  const paginatedProducts = useMemo(() => {
    const startIndex =
      (currentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE
    );
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setSort("default");
    setMaxPrice(2000);
    setMinRating(0);
    setCurrentPage(1);

    window.history.replaceState(
      null,
      "",
      "/search"
    );
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
        <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
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
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCurrentPage(1);
                }}
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
                onChange={(event) => {
                  setCategory(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="all">
                  All Categories
                </option>

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
                onChange={(event) => {
                  setMaxPrice(Number(event.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-blue-600"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Minimum Rating
              </span>

              <select
                value={minRating}
                onChange={(event) => {
                  setMinRating(Number(event.target.value));
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="0">
                  All Ratings
                </option>

                <option value="3">
                  3+ Stars
                </option>

                <option value="4">
                  4+ Stars
                </option>

                <option value="4.5">
                  4.5+ Stars
                </option>
              </select>
            </label>

            <button
              type="button"
              onClick={resetFilters}
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
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
              onChange={(event) => {
                setSort(event.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="default">
                Sort: Default
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="rating-high">
                Highest Rated
              </option>

              <option value="name-asc">
                Name: A to Z
              </option>
            </select>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <ProductSkeleton key={index} />
                )
              )}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-16 text-center dark:border-zinc-800 dark:bg-zinc-950">
              <Search
                size={46}
                className="mx-auto text-zinc-300"
              />

              <h2 className="mt-5 text-xl font-bold">
                No Products Found
              </h2>

              <p className="mt-2 text-zinc-500">
                Try a different keyword or adjust your
                filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-900"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-900"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}