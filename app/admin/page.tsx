"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ClipboardList,
  DollarSign,
  Package,
  Users,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

import OrderStatus from "@/components/orders/OrderStatus";

interface Stats {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  lowStockProducts: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    total: number;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.error ?? "Failed to load dashboard.");
        }

        if (mounted) setStats(data);
      } catch (loadError) {
        if (mounted) {
          setError(
            loadError instanceof Error ? loadError.message : "Something went wrong."
          );
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30">
        {error}
      </div>
    );
  }

  if (!stats) {
    return <div className="py-16 text-center text-zinc-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Admin Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold">Overview</h1>
        <p className="mt-2 text-zinc-500">Store performance at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<DollarSign size={21} />}
          label="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
        />
        <StatCard icon={<ClipboardList size={21} />} label="Total Orders" value={stats.totalOrders} />
        <StatCard icon={<Package size={21} />} label="Products" value={stats.totalProducts} />
        <StatCard icon={<Users size={21} />} label="Users" value={stats.totalUsers} />
      </div>

      {stats.lowStockProducts > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle size={20} />
          <span>
            {stats.lowStockProducts} product{stats.lowStockProducts !== 1 ? "s" : ""} low on
            stock (5 or fewer left).{" "}
            <Link href="/admin/products" className="font-semibold underline">
              Review products
            </Link>
          </span>
        </div>
      )}

      <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
          >
            View All
            <ChevronRight size={16} />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="py-10 text-center text-sm text-zinc-500">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between rounded-xl border p-4 transition hover:border-blue-400 hover:bg-blue-50/50 dark:border-zinc-800 dark:hover:bg-blue-950/20"
              >
                <div>
                  <p className="font-semibold">{order.id}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {order.user.name} &middot; {order.user.email}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">${order.total.toFixed(2)}</p>
                  <OrderStatus status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-3 text-blue-600">
        {icon}
        <span className="text-sm text-zinc-500">{label}</span>
      </div>
      <p className="mt-4 text-2xl font-bold">{value}</p>
    </div>
  );
}
