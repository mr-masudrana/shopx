"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Package,
  ShoppingBag,
} from "lucide-react";

import { useOrder } from "@/context/OrderContext";
import OrderStatus from "@/components/orders/OrderStatus";

export default function OrdersPage() {
  const { orders } = useOrder();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/account"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Account
        </Link>

        <h1 className="text-3xl font-bold">My Orders</h1>

        <p className="mt-2 text-zinc-500">
          View and manage all your orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border bg-white px-5 py-16 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <Package
            size={48}
            className="mx-auto text-zinc-300"
          />

          <h2 className="mt-5 text-xl font-bold">
            No Orders Yet
          </h2>

          <p className="mt-2 text-zinc-500">
            Your completed purchases will appear here.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ShoppingBag size={18} />
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block rounded-2xl border bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950">
                    <Package size={22} />
                  </div>

                  <div>
                    <p className="font-bold">{order.id}</p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Placed on{" "}
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      {order.items.length} product
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-5 sm:justify-end">
                  <div className="sm:text-right">
                    <p className="font-bold">
                      ${order.total.toFixed(2)}
                    </p>

                    <OrderStatus status={order.status} />
                  </div>

                  <ChevronRight
                    size={20}
                    className="text-zinc-400"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}