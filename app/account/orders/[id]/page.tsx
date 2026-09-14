"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

import { useOrder } from "@/context/OrderContext";
import OrderStatus from "@/components/orders/OrderStatus";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params.id as string;

  const {
    orders,
    cancelOrder,
  } = useOrder();

  const order = orders.find(
    (currentOrder) => currentOrder.id === orderId
  );

  if (!order) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4">
        <div className="text-center">
          <Package
            size={48}
            className="mx-auto text-zinc-300"
          />

          <h1 className="mt-5 text-2xl font-bold">
            Order Not Found
          </h1>

          <p className="mt-2 text-zinc-500">
            This order may not exist or has been removed.
          </p>

          <Link
            href="/account/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const handleCancelOrder = () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    cancelOrder(order.id);
    router.refresh();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/account/orders"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Order Details
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              {order.id}
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <OrderStatus status={order.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-7">
            <h2 className="mb-6 text-lg font-bold">
              Order Status
            </h2>

            <OrderTimeline status={order.status} />
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-7">
            <h2 className="mb-5 text-lg font-bold">
              Ordered Products
            </h2>

            <div className="space-y-5">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b pb-5 last:border-0 last:pb-0 dark:border-zinc-800"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-20 w-20 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-2 font-bold text-blue-600">
                      $
                      {(item.price * item.quantity).toFixed(
                        2
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {order.status === "placed" && (
            <button
              type="button"
              onClick={handleCancelOrder}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
            >
              <XCircle size={18} />
              Cancel Order
            </button>
          )}
        </div>

        <aside className="h-fit space-y-6 lg:sticky lg:top-24">
          <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-7">
            <h2 className="mb-5 text-lg font-bold">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">Shipping</span>
                <span>
                  {order.shippingCost === 0
                    ? "Free"
                    : `$${order.shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>

              <div className="border-t pt-4 dark:border-zinc-800">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-zinc-50 p-4 text-sm dark:bg-zinc-900">
              <p className="text-zinc-500">Payment Method</p>
              <p className="mt-1 font-semibold capitalize">
                {order.paymentMethod.replace("-", " ")}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-7">
            <div className="mb-4 flex items-center gap-2">
              <MapPin size={19} className="text-blue-600" />

              <h2 className="text-lg font-bold">
                Delivery Address
              </h2>
            </div>

            <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {order.shipping.firstName}{" "}
                {order.shipping.lastName}
              </p>

              <p>{order.shipping.address}</p>
              <p>
                {order.shipping.city},{" "}
                {order.shipping.postalCode}
              </p>
              <p>{order.shipping.country}</p>
              <p>{order.shipping.phone}</p>
              <p>{order.shipping.email}</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function OrderTimeline({ status }: { status: string }) {
  const steps = [
    {
      key: "placed",
      label: "Order Placed",
      icon: <CheckCircle2 size={18} />,
    },
    {
      key: "processing",
      label: "Processing",
      icon: <Clock3 size={18} />,
    },
    {
      key: "shipped",
      label: "Shipped",
      icon: <Truck size={18} />,
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: <Package size={18} />,
    },
  ];

  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-950/30">
        <XCircle size={22} />
        <div>
          <p className="font-semibold">Order Cancelled</p>
          <p className="text-sm">
            This order has been cancelled.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex(
    (step) => step.key === status
  );

  return (
    <div className="space-y-5">
      {steps.map((step, index) => {
        const isCompleted =
          index <= Math.max(currentIndex, 0);

        return (
          <div
            key={step.key}
            className="flex items-center gap-3"
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                isCompleted
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 text-zinc-400 dark:bg-zinc-900"
              }`}
            >
              {step.icon}
            </div>

            <div>
              <p
                className={`text-sm font-semibold ${
                  isCompleted
                    ? "text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-400"
                }`}
              >
                {step.label}
              </p>

              {index === currentIndex && (
                <p className="text-xs text-blue-600">
                  Current status
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}