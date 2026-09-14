"use client";

import { Heart } from "lucide-react";

import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/types/product";

export default function WishlistButton({
  product,
  size = 19,
}: {
  product: Product;
  size?: number;
}) {
  const { isInWishlist, toggleWishlist } = useWishlist();

  const active = isInWishlist(product.id);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleWishlist(product);
      }}
      aria-label={
        active
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur transition ${
        active
          ? "border-red-200 bg-red-50 text-red-500 dark:border-red-900 dark:bg-red-950/40"
          : "border-zinc-200 bg-white/90 text-zinc-600 hover:border-red-300 hover:text-red-500 dark:border-zinc-700 dark:bg-zinc-900/90"
      }`}
    >
      <Heart
        size={size}
        fill={active ? "currentColor" : "none"}
      />
    </button>
  );
}