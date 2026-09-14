"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  Order,
  ShippingInfo,
  PaymentMethod,
} from "@/types/order";

import type { CartItem } from "@/types/cart";

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
  createOrder: (data: CreateOrderData) => Order;
  getOrderById: (id: string) => Order | undefined;
  cancelOrder: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(
  undefined
);

export function OrderProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem("shopx-orders");

      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem(
      "shopx-orders",
      JSON.stringify(updatedOrders)
    );
  };

  const createOrder = (data: CreateOrderData): Order => {
    const order: Order = {
      id: `SHX-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 7)
        .toUpperCase()}`,
      ...data,
      status: "placed",
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [order, ...orders];

    saveOrders(updatedOrders);

    return order;
  };

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  const cancelOrder = (id: string) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === id && order.status === "placed") {
        return {
          ...order,
          status: "cancelled" as const,
        };
      }

      return order;
    });

    saveOrders(updatedOrders);
  };

  return (
    <OrderContext.Provider
      value={{
        orders: isHydrated ? orders : [],
        createOrder,
        getOrderById,
        cancelOrder,
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