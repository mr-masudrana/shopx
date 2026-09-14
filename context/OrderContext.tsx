"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Order, ShippingInfo, PaymentMethod } from "@/types/order";
import type { CartItem } from "@/types/cart";
import { useAuth } from "@/context/AuthContext";

interface CreateOrderData {
  items: CartItem[];
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  createOrder: (data: CreateOrderData) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
  cancelOrder: (id: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshOrders = async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/orders");
      const data = await parseJsonSafe(response);

      if (response.ok) {
        setOrders(data?.orders ?? []);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const createOrder = async (data: CreateOrderData): Promise<Order> => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await parseJsonSafe(response);

    if (!response.ok) {
      throw new Error(result?.error ?? "Failed to place order.");
    }

    setOrders((current) => [result.order, ...current]);

    return result.order;
  };

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  const cancelOrder = async (id: string) => {
    const response = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });

    const result = await parseJsonSafe(response);

    if (!response.ok) {
      throw new Error(result?.error ?? "Failed to cancel order.");
    }

    setOrders((current) =>
      current.map((order) => (order.id === id ? result.order : order))
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        createOrder,
        getOrderById,
        cancelOrder,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrder must be used inside OrderProvider");
  }

  return context;
}
