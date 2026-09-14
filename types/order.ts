import type { CartItem } from "@/types/cart";

export type PaymentMethod = "cod" | "card" | "mobile-banking";

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}