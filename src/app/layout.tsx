import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import AuthProvider from "@/context/AuthProvider";
import { ModalProvider } from "@/context/ModalProvider";
import MainLayout from "@/components/MainLayout";
import ReactQueryProvider from "@/context/ReactQueryProvider";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair_display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export const metadata = {
  title: "Eve's Bake n Sweet",
  description: "The best baked goods in town!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair_display.variable}`}>
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <ModalProvider>
              <CartProvider>
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#363636",
                      color: "#fff",
                    },
                  }}
                />
                <MainLayout>{children}</MainLayout>
              </CartProvider>
            </ModalProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
