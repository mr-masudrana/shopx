import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <WishlistProvider>
                <Header />

                <main className="min-h-screen pb-20 md:pb-0">
                  {children}
                </main>

                <MobileBottomNav />

                <Toaster
                  position="top-center"
                  richColors
                  closeButton
                  toastOptions={{
                    className: "!rounded-xl",
                  }}
                />
              </WishlistProvider>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}