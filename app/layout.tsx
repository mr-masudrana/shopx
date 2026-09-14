import type { Metadata } from "next";

import "./globals.css";

import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";

import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export const metadata: Metadata = {
  title: "ShopX",
  description: "Modern e-commerce shopping experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <OrderProvider>
            <AuthProvider>
              <WishlistProvider>
                <Header />
        
                <main className="min-h-screen pb-20 md:pb-0">
                  {children}
                </main>
        
                <MobileBottomNav />
              </WishlistProvider>
            </AuthProvider>
          </OrderProvider>
        </CartProvider>
      </body>
    </html>
  );
}