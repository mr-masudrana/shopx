"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const {
    wishlistItems,
    wishlistCount,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Saved Products
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            My Wishlist
          </h1>

          <p className="mt-2 text-zinc-500">
            {wishlistCount} saved product
            {wishlistCount !== 1 ? "s" : ""}
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
          >
            <Trash2 size={17} />
            Clear Wishlist
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="rounded-2xl border bg-white px-5 py-16 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <Heart
            size={50}
            className="mx-auto text-zinc-300"
          />

          <h2 className="mt-5 text-xl font-bold">
            Your Wishlist Is Empty
          </h2>

          <p className="mt-2 text-zinc-500">
            Save products you love and find them here later.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ShoppingBag size={18} />
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <Link href={`/product/${product.id}`}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-56 w-full object-cover"
                />
              </Link>

              <div className="p-4">
                <Link
                  href={`/product/${product.id}`}
                  className="line-clamp-2 font-semibold hover:text-blue-600"
                >
                  {product.title}
                </Link>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-lg font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      removeFromWishlist(product.id)
                    }
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <ShoppingBag size={17} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}