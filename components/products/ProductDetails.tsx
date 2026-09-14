"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Check,
  Truck,
  ShieldCheck,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import WishlistButton from "@/components/wishlist/WishlistButton";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();

  const discount = Math.round(product.discountPercentage);

  const originalPrice = (
    product.price /
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);

    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={16} />
          Back to Shop
        </Link>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-gray-100 bg-white">
              <div className="absolute left-4 top-4 z-10 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white">
                -{discount}%
              </div>

              <motion.div
                key={selectedImage}
                initial={{ opacity: 0.5, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full"
              >
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-8 sm:p-14"
                />
              </motion.div>
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition ${
                    selectedImage === index
                      ? "border-indigo-600"
                      : "border-gray-100 hover:border-indigo-300"
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              {product.category}
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-amber-600">
                <Star size={16} fill="currentColor" />
                <span className="text-sm font-bold">
                  {product.rating.toFixed(1)}
                </span>
              </div>

              <span className="text-sm text-gray-500">
                {product.reviews?.length ?? 0} reviews
              </span>

              <span className="text-sm text-gray-400">•</span>

              <span className="text-sm text-gray-500">
                {product.stock} in stock
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>

              <span className="mb-1 text-lg text-gray-400 line-through">
                ${originalPrice}
              </span>
            </div>

            <p className="mt-6 text-sm leading-7 text-gray-600">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-gray-900">
                Quantity
              </p>

              <div className="flex items-center gap-3">
                <div className="flex h-12 items-center rounded-xl border border-gray-200 bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    className="flex h-full w-11 items-center justify-center text-gray-500 transition hover:text-indigo-600"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="w-10 text-center text-sm font-semibold text-gray-900">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) =>
                        Math.min(product.stock, current + 1)
                      )
                    }
                    className="flex h-full w-11 items-center justify-center text-gray-500 transition hover:text-indigo-600"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <span className="text-xs text-gray-500">
                  Maximum {product.stock} available
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              className={`mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-xl text-sm font-semibold text-white shadow-lg transition-all ${
                added
                  ? "bg-emerald-600 shadow-emerald-200"
                  : "bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700"
              }`}
            >
              {added ? <Check size={20} /> : <ShoppingCart size={20} />}

              {added ? "Added to Cart!" : "Add to Cart"}
            </motion.button>

            <div className="flex items-center gap-3">
              <WishlistButton product={product} />

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                Add to Cart
              </button>
            </div>

            {/* Benefits */}
            <div className="mt-8 grid grid-cols-1 gap-4 border-t border-gray-200 pt-6 sm:grid-cols-3 lg:grid-cols-1">
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-indigo-600" />

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Fast Delivery
                  </p>

                  <p className="text-xs text-gray-500">
                    {product.shippingInformation ?? "Reliable shipping"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-indigo-600" />

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Secure Shopping
                  </p>

                  <p className="text-xs text-gray-500">
                    Safe and secure checkout
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Check size={20} className="text-indigo-600" />

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Easy Returns
                  </p>

                  <p className="text-xs text-gray-500">
                    {product.returnPolicy ?? "Hassle-free returns"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}