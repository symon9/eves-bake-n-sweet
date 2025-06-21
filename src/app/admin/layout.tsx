"use client";

import { ReactNode, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import { Menu, UserCircle } from "lucide-react";

import Sidebar from "@/components/admin/Sidebar";

// ... generateTitle helper function ...
const generateTitle = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean); // e.g., ['admin', 'products', 'edit', '...id...']

  if (segments.length === 1 && segments[0] === "admin") {
    return "Dashboard";
  }

  // Handle /admin/products/new
  if (segments.length === 3 && segments[2] === "new") {
    return "New Product";
  }

  // Handle /admin/products/edit/[id]
  if (segments.length === 4 && segments[2] === "edit") {
    return "Edit Product";
  }

  // Handle /admin/orders/[id]
  if (segments.length === 3 && segments[1] === "orders") {
    const lastSegment = segments[2];
    if (lastSegment.length === 24 && /^[a-f\d]{24}$/i.test(lastSegment)) {
      return "Order Detail";
    }
  }

  // Fallback for simple routes like /admin/orders or /admin/products
  const title = segments[segments.length - 1] || "Dashboard";
  return title.charAt(0).toUpperCase() + title.slice(1);
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = generateTitle(pathname);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm flex items-center justify-between p-4 sticky top-0 z-30">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden mr-4 text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
          </div>

          {/* --- RIGHT SIDE WITH ICONS --- */}
          <div className="flex items-center space-x-5">
            {/* User Profile Section */}
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 bg-gray-200 rounded-full flex items-center justify-center">
                <UserCircle size={24} className="text-gray-500" />
              </div>
              <span className="hidden sm:block font-medium text-gray-700">
                {/* Use the name from the session */}
                {session?.user?.name || "Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
