"use client";

import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-2xl items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border bg-white p-7 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/40">
          <CheckCircle2 size={42} />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-green-600">
          Order Confirmed
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Thank You for Your Order!
        </h1>

        <p className="mt-4 text-zinc-500">
          Your order has been placed successfully. We will
          process it shortly.
        </p>

        {orderId && (
          <div className="mt-6 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">
              Your Order ID
            </p>

            <p className="mt-1 break-all font-mono text-lg font-bold text-blue-600">
              {orderId}
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>

          <Link
            href="/account/orders"
            className="flex items-center justify-center gap-2 rounded-xl border px-5 py-3 font-semibold transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <Package size={18} />
            View Orders
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center">
          Loading...
        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}