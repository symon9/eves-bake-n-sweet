"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  LogOut,
  Home,
  Newspaper,
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Orders", href: "/admin/orders", icon: Package },
  { name: "Blog", href: "/admin/blogs", icon: Newspaper },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <aside
      className={`
        bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out
        fixed inset-y-0 left-0 z-50 w-64
        md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
        <Link href="/admin">Eve&apos;s Admin</Link>
      </div>
      <nav className="flex-grow p-4">
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href))
                    ? "bg-pink-600 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Link
          href="/"
          className="flex items-center p-3 rounded-lg hover:bg-gray-700 mb-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Home className="mr-3 h-5 w-5" />
          <span>View Main Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
