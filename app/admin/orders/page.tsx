"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Package, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import OrderStatus from "@/components/orders/OrderStatus";

interface AdminOrder {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
}

const STATUSES = ["all", "placed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadOrders(status: string) {
    try {
      const response = await fetch(
        `/api/admin/orders${status !== "all" ? `?status=${status}` : ""}`
      );
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to load orders.");
      }

      setOrders(data.orders);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Something went wrong.");
    }
  }

  useEffect(() => {
    loadOrders(filter);
  }, [filter]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);

    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to update status.");
      }

      setOrders(
        (previous) =>
          previous?.map((order) => (order.id === id ? { ...order, status } : order)) ?? null
      );
      toast.success("Order status updated.");
    } catch (updateError) {
      toast.error(updateError instanceof Error ? updateError.message : "Something went wrong.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="mt-2 text-zinc-500">View and manage every customer order.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      {!orders ? (
        <div className="py-16 text-center text-zinc-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border bg-white px-5 py-16 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <Package size={44} className="mx-auto text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-500">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950"
            >
              <Link
                href={`/admin/orders/${order.id}`}
                className="flex items-start gap-4"
              >
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950">
                  <Package size={22} />
                </div>

                <div>
                  <p className="font-bold">{order.id}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {order.user.name} &middot; {order.user.email}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString()} &middot; $
                    {order.total.toFixed(2)}
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-3 sm:justify-end">
                <select
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(event) => handleStatusChange(order.id, event.target.value)}
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm capitalize outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900"
                >
                  {STATUSES.filter((s) => s !== "all").map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <OrderStatus status={order.status} />

                <Link href={`/admin/orders/${order.id}`}>
                  <ChevronRight size={20} className="text-zinc-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
