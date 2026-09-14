"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ShoppingCart, Star, ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/product";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const discount = Math.round(product.discountPercentage);

  const originalPrice = (
    product.price /
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-gray-200/60"
    >
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {/* Discount Badge */}
          <div className="absolute left-3 top-3 z-10 rounded-lg bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white">
            -{discount}%
          </div>

          {/* View Icon */}
          <div className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight size={16} />
          </div>

          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute right-3 top-3 z-10">
            <WishlistButton product={product} />
          </div>
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-4">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-indigo-600">
          {product.category}
        </p>

        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-gray-900 transition-colors hover:text-indigo-600">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 text-amber-500">
            <Star size={13} fill="currentColor" />
            <span className="text-xs font-semibold">
              {product.rating.toFixed(1)}
            </span>
          </div>

          <span className="text-xs text-gray-400">
            ({product.stock} in stock)
          </span>
        </div>

        {/* Price + Cart */}
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-xs text-gray-400 line-through">
              ${originalPrice}
            </p>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              addToCart(product, 1);
              toast.success(`${product.title} added to cart`, {
                description: `$${product.price.toFixed(2)}`,
              });
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 transition-colors hover:bg-indigo-700"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}