"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "@/types/product";
import type { WishlistItem } from "@/types/wishlist";
import { useAuth } from "@/context/AuthContext";

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  isInWishlist: (productId: number) => boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

// Guest (logged-out) wishlist still lives in localStorage so visitors can
// use it before creating an account. Once logged in, the account's
// wishlist (from the database) takes over.
const GUEST_STORAGE_KEY = "shopx-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load guest wishlist from localStorage.
  useEffect(() => {
    if (isAuthenticated) return;

    try {
      const saved = localStorage.getItem(GUEST_STORAGE_KEY);

      if (saved) {
        setWishlistItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    }
  }, [isAuthenticated]);

  // Load account wishlist from the API once logged in, merging in any
  // items that were added as a guest before this login.
  useEffect(() => {
    if (!isAuthenticated) return;

    let mounted = true;

    (async () => {
      try {
        let guestItems: WishlistItem[] = [];

        try {
          const saved = localStorage.getItem(GUEST_STORAGE_KEY);
          guestItems = saved ? JSON.parse(saved) : [];
        } catch (error) {
          console.error("Failed to read guest wishlist:", error);
        }

        const response = await fetch("/api/wishlist");
        const data = await response.json().catch(() => null);

        if (!mounted || !response.ok) return;

        const accountItems: WishlistItem[] = (data?.items ?? []).map(
          (entry: { product: Product; addedAt: string }) => ({
            ...entry.product,
            addedAt: entry.addedAt,
          })
        );

        const accountIds = new Set(accountItems.map((item) => item.id));
        const itemsToMerge = guestItems.filter(
          (item) => !accountIds.has(item.id)
        );

        if (itemsToMerge.length > 0) {
          await Promise.all(
            itemsToMerge.map((item) =>
              fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product: item }),
              }).catch((error) =>
                console.error("Failed to merge wishlist item:", error)
              )
            )
          );
        }

        localStorage.removeItem(GUEST_STORAGE_KEY);

        if (mounted) {
          setWishlistItems([...accountItems, ...itemsToMerge]);
        }
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  const saveGuestWishlist = (items: WishlistItem[]) => {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(items));
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const addToWishlist = (product: Product) => {
    if (isInWishlist(product.id)) return;

    const wishlistItem: WishlistItem = {
      ...product,
      addedAt: new Date().toISOString(),
    };

    setWishlistItems((current) => {
      const updated = [...current, wishlistItem];

      if (!isAuthenticated) {
        saveGuestWishlist(updated);
      }

      return updated;
    });

    if (isAuthenticated) {
      fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      }).catch((error) => console.error("Failed to add to wishlist:", error));
    }
  };

  const removeFromWishlist = (productId: number) => {
    setWishlistItems((current) => {
      const updated = current.filter((item) => item.id !== productId);

      if (!isAuthenticated) {
        saveGuestWishlist(updated);
      }

      return updated;
    });

    if (isAuthenticated) {
      fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      }).catch((error) =>
        console.error("Failed to remove from wishlist:", error)
      );
    }
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    if (!isAuthenticated) {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    }

    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}
