"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/types/cart";
import { useCart } from "@/context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const { product, quantity } = item;

  return (
    <div className="flex gap-4 border-b border-gray-100 py-5 first:pt-0 last:border-b-0">
      {/* Image */}
      <Link
        href={`/product/${product.id}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50 sm:h-32 sm:w-32"
      >
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="128px"
          className="object-contain p-3"
        />
      </Link>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">
            {product.category}
          </p>

          <Link href={`/product/${product.id}`}>
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900 transition hover:text-indigo-600 sm:text-base">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          {/* Quantity */}
          <div className="flex h-9 items-center rounded-lg border border-gray-200 bg-white">
            <button
              type="button"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="flex h-full w-8 items-center justify-center text-gray-500 transition hover:text-indigo-600"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>

            <span className="w-7 text-center text-xs font-semibold text-gray-900">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                updateQuantity(
                  product.id,
                  Math.min(product.stock, quantity + 1)
                )
              }
              className="flex h-full w-8 items-center justify-center text-gray-500 transition hover:text-indigo-600"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(product.id)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 transition hover:text-red-500"
          >
            <Trash2 size={15} />
            Remove
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="hidden shrink-0 text-right sm:block">
        <p className="text-base font-bold text-gray-900">
          ${(product.price * quantity).toFixed(2)}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          ${product.price.toFixed(2)} each
        </p>
      </div>
    </div>
  );
}