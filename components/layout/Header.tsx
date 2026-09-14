"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import SearchInput from "@/components/search/SearchInput";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { wishlistCount } = useWishlist();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
            S
          </div>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            Shop<span className="text-indigo-600">X</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
          >
            Home
          </Link>

          <Link
            href="/shop"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
          >
            Shop
          </Link>

          <Link
            href="/shop"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
          >
            Categories
          </Link>

          <Link
            href="/shop"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
          >
            Deals
          </Link>
          
          <Link
            href={isAuthenticated ? "/account" : "/login"}
            className="..."
          >
            {isAuthenticated ? user?.name : "Login"}
          </Link>
        </nav>

        {/* Desktop Search */}
        <div className="hidden flex-1 justify-center px-6 md:flex">
          <SearchInput />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <Heart size={20} />
          
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-indigo-600"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={20} />

            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <Link
            href={isAuthenticated ? "/account" : "/login"}
            aria-label={isAuthenticated ? "My Account" : "Login"}
            className="..."
          >
            <User size={20} />
          </Link>

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="px-4 pb-3 md:hidden">
        <SearchInput compact />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Home
            </Link>

            <Link
              href="/shop"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Shop
            </Link>

            <Link
              href="/shop"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Categories
            </Link>

            <Link
              href="/shop"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Deals
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}