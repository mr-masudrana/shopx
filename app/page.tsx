"use client";

import { useEffect, useState } from "react";
import HeroBanner from "@/components/home/HeroBanner";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import type { Product } from "@/types/product";
import SearchInput from "@/components/search/SearchInput";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://dummyjson.com/products?limit=20"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Home products error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="bg-white">
      <HeroBanner />

      <Categories />

      <FeaturedProducts products={products} loading={loading} />
    </div>
    <div className="mb-6">
      <SearchInput compact />
    </div>
  );
}