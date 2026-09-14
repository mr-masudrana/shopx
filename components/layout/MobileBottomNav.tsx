"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Grid2X2,
  ShoppingCart,
  Heart,
  User,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Shop",
    href: "/shop",
    icon: Grid2X2,
  },
  {
    label: "Cart",
    href: "/cart",
    icon: ShoppingCart,
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
  {
    label: "Account",
    href: "/account",
    icon: User,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`tap-scale flex min-w-[56px] flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-all ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-indigo-600"
              }`}
            >
              <div
                className={`relative rounded-xl p-1 transition-all ${
                  isActive ? "bg-indigo-50" : ""
                }`}
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                {item.label === "Cart" && cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}

                {item.label === "Wishlist" &&
                  wishlistCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                      {wishlistCount > 99
                        ? "99+"
                        : wishlistCount}
                    </span>
                  )}
              </div>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}