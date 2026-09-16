"use client";

import { useEffect, useState } from "react";

import type { Product } from "@/types/product";

interface ProductsApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/products?limit=100");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: ProductsApiResponse =
          await response.json();

        if (!mounted) {
          return;
        }

        setProducts(
          Array.isArray(data.products)
            ? data.products
            : []
        );
      } catch (loadError) {
        if (!mounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load products."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    products,
    loading,
    error,
  };
}