"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartSummary() {
  const { cartTotal, cartCount } = useCart();

  const shipping = cartTotal >= 100 ? 0 : 9.99;
  const tax = cartTotal * 0.05;
  const grandTotal = cartTotal + shipping + tax;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

      <div className="mt-6 space-y-4 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal ({cartCount} items)</span>
          <span className="font-medium text-gray-900">
            ${cartTotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-gray-500">
          <span>Shipping</span>
          <span className="font-medium text-gray-900">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-gray-500">
          <span>Estimated Tax</span>
          <span className="font-medium text-gray-900">
            ${tax.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">
              Total
            </span>

            <span className="text-xl font-bold text-indigo-600">
              ${grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
      >
        Proceed to Checkout
        <ArrowRight size={17} />
      </Link>

      <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Truck size={16} className="text-indigo-600" />
          Free shipping on orders over $100
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheck size={16} className="text-indigo-600" />
          Secure and protected checkout
        </div>
      </div>
    </div>
  );
}