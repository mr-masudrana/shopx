"use client";

import Link from "next/link";
import {
  ChevronRight,
  ClipboardList,
  Mail,
  MapPin,
  Package,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

import { useOrder } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();

  const {
    user,
    logout,
    isLoading,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/account");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        Loading...
      </div>
    );
  }
  
  const { orders } = useOrder();

  const totalOrders = orders.length;
  const activeOrders = orders.filter(
    (order) =>
      order.status !== "cancelled" &&
      order.status !== "delivered"
  ).length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          ShopX Account
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          My Account
        </h1>

        <p className="mt-2 text-zinc-500">
          Manage your profile, orders and account settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950">
              <User size={24} />
            </div>

            <div>
              <h2 className="font-semibold">
                {user?.name || "ShopX Customer"}
              </h2>
              <p className="text-sm text-zinc-500">
                {user?.email || "customer@example.com"}
              </p>
            </div>
          </div>

          <nav className="mt-4 space-y-1">
            <AccountNavItem
              href="/account"
              icon={<User size={18} />}
              label="Profile"
              active
            />

            <AccountNavItem
              href="/account/orders"
              icon={<Package size={18} />}
              label="My Orders"
            />

            <AccountNavItem
              href="/account/settings"
              icon={<Settings size={18} />}
              label="Settings"
            />
          </nav>
        </aside>

        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={<ClipboardList size={21} />}
              label="Total Orders"
              value={totalOrders}
            />

            <StatCard
              icon={<Package size={21} />}
              label="Active Orders"
              value={activeOrders}
            />

            <StatCard
              icon={<ShieldCheck size={21} />}
              label="Account Status"
              value="Active"
            />
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  Profile Information
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Your basic account information
                </p>
              </div>

              <Link
                href="/account/settings"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Edit
              </Link>
            </div>

            <button
              type="button"
              onClick={logout}
              className="mt-6 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
              >
                Logout
            </button>

            <div className="grid gap-5 sm:grid-cols-2">
              <ProfileItem
                icon={<User size={18} />}
                label="Full Name"
                value={user?.name || "ShopX Customer"}
              />

              <ProfileItem
                icon={<Mail size={18} />}
                label="Email"
                value={user?.email || "customer@example.com"}
              />

              <ProfileItem
                icon={<MapPin size={18} />}
                label="Location"
                value="Bangladesh"
              />

              <ProfileItem
                icon={<ShieldCheck size={18} />}
                label="Account Type"
                value="Customer"
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  Recent Orders
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Check your latest purchases
                </p>
              </div>

              <Link
                href="/account/orders"
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
              >
                View All
                <ChevronRight size={16} />
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="py-10 text-center">
                <Package
                  size={36}
                  className="mx-auto text-zinc-300"
                />

                <p className="mt-3 text-sm text-zinc-500">
                  You have not placed any orders yet.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="flex items-center justify-between rounded-xl border p-4 transition hover:border-blue-400 hover:bg-blue-50/50 dark:border-zinc-800 dark:hover:bg-blue-950/20"
                  >
                    <div>
                      <p className="font-semibold">
                        {order.id}
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        ${order.total.toFixed(2)}
                      </p>

                      <OrderStatus status={order.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function AccountNavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-blue-600 text-white"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
      }`}
    >
      {icon}
      {label}
    </Link>
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

function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-zinc-100 p-2 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
        {icon}
      </div>

      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="mt-1 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
