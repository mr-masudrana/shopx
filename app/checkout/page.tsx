"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";

import { useCart } from "@/context/CartContext";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
            <ShoppingCart
              size={34}
              className="text-zinc-400"
            />
          </div>

          <h1 className="text-2xl font-bold">
            Your cart is empty
          </h1>

          <p className="mt-2 text-zinc-500">
            Add some products before proceeding to checkout.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          ShopX Checkout
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Complete Your Order
        </h1>

        <p className="mt-2 text-zinc-500">
          Enter your details to place your order.
        </p>
      </div>

      <CheckoutForm />
    </main>
  );
}