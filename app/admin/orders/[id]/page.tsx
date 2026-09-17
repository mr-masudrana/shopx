"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, MapPin, User } from "lucide-react";

import OrderStatus from "@/components/orders/OrderStatus";

const STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"];

interface AdminOrderDetail {
  id: string;
  status: string;
  createdAt: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentMethod: string;
  items: Array<{ product: { id: number; title: string; thumbnail: string; price: number }; quantity: number }>;
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  user: { name: string; email: string };
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  async function loadOrder() {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to load order.");
      }

      setOrder(data.order);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Something went wrong.");
    }
  }

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleStatusChange = async (status: string) => {
    setUpdating(true);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to update status.");
      }

      setOrder((previous) => (previous ? { ...previous, status } : previous));
      toast.success("Order status updated.");
    } catch (updateError) {
      toast.error(updateError instanceof Error ? updateError.message : "Something went wrong.");
    } finally {
      setUpdating(false);
    }
  };

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30">
        {error}
      </div>
    );
  }

  if (!order) {
    return <div className="py-16 text-center text-zinc-500">Loading order...</div>;
  }

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Order Details</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{order.id}</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={order.status}
            disabled={updating}
            onChange={(event) => handleStatusChange(event.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm capitalize outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <OrderStatus status={order.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-7">
            <div className="mb-4 flex items-center gap-2">
              <User size={19} className="text-blue-600" />
              <h2 className="text-lg font-bold">Customer</h2>
            </div>
            <p className="font-medium">{order.user.name}</p>
            <p className="text-sm text-zinc-500">{order.user.email}</p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-7">
            <h2 className="mb-5 text-lg font-bold">Ordered Products</h2>

            <div className="space-y-5">
              {order.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 border-b pb-5 last:border-0 last:pb-0 dark:border-zinc-800"
                >
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    className="h-20 w-20 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 font-semibold">{item.product.title}</h3>
                    <p className="mt-1 text-sm text-zinc-500">Quantity: {item.quantity}</p>
                    <p className="mt-2 font-bold text-blue-600">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit space-y-6 lg:sticky lg:top-24">
          <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-7">
            <h2 className="mb-5 text-lg font-bold">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Shipping</span>
                <span>{order.shippingCost === 0 ? "Free" : `$${order.shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 dark:border-zinc-800">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">${order.total.toFixed(2)}</span>
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
              <h2 className="text-lg font-bold">Delivery Address</h2>
            </div>

            <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {order.shipping.firstName} {order.shipping.lastName}
              </p>
              <p>{order.shipping.address}</p>
              <p>
                {order.shipping.city}, {order.shipping.postalCode}
              </p>
              <p>{order.shipping.country}</p>
              <p>{order.shipping.phone}</p>
              <p>{order.shipping.email}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
