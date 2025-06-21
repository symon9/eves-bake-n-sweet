"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Header from "./Header";
import Footer from "./Footer";
//import PageTransition from './PageTransition';

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isHomePage = pathname === "/";

  // For admin pages, render nothing but the children.
  // The AdminLayout will provide its own structure.
  if (isAdminPage) {
    return <>{children}</>;
  }

  // For all public-facing pages, render with Header and Footer.
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="h-18" />

      <>
        {isHomePage ? (
          <main className="flex-grow">{children}</main>
        ) : (
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
        )}
      </>

      <Footer />
    </div>
  );
}
