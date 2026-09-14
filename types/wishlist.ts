import type { Product } from "@/types/product";

export interface WishlistItem extends Product {
  addedAt: string;
}