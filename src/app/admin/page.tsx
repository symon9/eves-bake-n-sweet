"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  ShoppingBag,
  Package,
  Banknote,
  Loader2,
  PlusCircle,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { useGetDashboardStats } from "@/lib/hooks/useDashboard";
import RecentOrders from "@/components/admin/RecentOrders";
import SalesChart from "@/components/admin/SalesChart";
import AnimatedText from "@/components/AnimatedText";

gsap.registerPlugin(useGSAP);

// --- ANIMATED STAT CARD ---
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  endValue,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  endValue: number;
}) => {
  const valueRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (value.startsWith("₦") && valueRef.current) {
        const target = { val: 0 };
        gsap.to(target, {
          val: endValue,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => {
            if (valueRef.current) {
              valueRef.current.textContent = `₦${Math.round(
                target.val
              ).toLocaleString()}`;
            }
          },
        });
      }
    },
    { dependencies: [endValue, value] }
  );

  if (!value.startsWith("₦")) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p ref={valueRef} className="text-2xl font-semibold text-gray-900">
            ₦0
          </p>
        </div>
      </div>
    </div>
  );
};

// --- ANIMATED QUICK ACTION BUTTON ---
const QuickActionButton = ({
  title,
  href,
  icon: Icon,
}: {
  title: string;
  href: string;
  icon: React.ElementType;
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = buttonRef.current;
      if (!el) return;

      const tl = gsap.timeline({ paused: true });
      tl.to(el, { y: -5, scale: 1.05, duration: 0.2, ease: "power1.inOut" });

      const enter = () => tl.play();
      const leave = () => tl.reverse();

      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);

      return () => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      };
    },
    { scope: buttonRef }
  );

  return (
    <Link href={href}>
      <div
        ref={buttonRef}
        className="text-center p-4 bg-white rounded-lg shadow-md transition-shadow hover:shadow-xl"
      >
        <Icon className="mx-auto h-8 w-8 text-pink-600" />
        <p className="mt-2 text-sm font-semibold text-gray-700">{title}</p>
      </div>
    </Link>
  );
};

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState("7d");
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useGetDashboardStats(dateRange);
  const { data: session } = useSession();

  const containerRef = useRef<HTMLDivElement>(null);

  // --- MAIN PAGE ENTRANCE ANIMATION ---
  useEffect(() => {
    if (!isLoading && stats) {
      gsap.set(".anim-target", { autoAlpha: 0, y: 20 });

      // Use a timeline for a controlled, choreographed sequence
      gsap
        .timeline({ defaults: { duration: 0.6, ease: "power2.out" } })
        .to(".welcome-header", { autoAlpha: 1, y: 0, duration: 0.5 })
        .to(".quick-action-btn", { autoAlpha: 1, y: 0, stagger: 0.1 }, "-=0.3")
        .to(".stat-card", { autoAlpha: 1, y: 0, stagger: 0.15 }, "-=0.3")
        .to(".main-panel", { autoAlpha: 1, y: 0, stagger: 0.2 }, "-=0.4");
    }
  }, [isLoading, stats]);

  if (isLoading && !stats) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  const welcomeMessage = `Welcome back, ${
    session?.user?.name?.split(" ")[0] || "Admin"
  }!`;
  const dateRangeOptions = [
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
    { value: "1y", label: "1Y" },
  ];

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Header with Welcome Message */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="welcome-header anim-target">
          <AnimatedText
            text={welcomeMessage}
            className="text-3xl font-bold text-gray-900"
          />
          <p className="mt-1 text-gray-500">
            Here's a snapshot of your bakery's performance.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:space-x-4 gap-2">
          <div className="quick-action-btn anim-target">
            <QuickActionButton
              title="New Product"
              href="/admin/products/new"
              icon={PlusCircle}
            />
          </div>
          <div className="quick-action-btn anim-target">
            <QuickActionButton
              title="View Orders"
              href="/admin/orders"
              icon={Eye}
            />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="stat-card anim-target">
          <StatCard
            title="Total Revenue"
            value={`₦${(stats?.totalRevenue || 0).toLocaleString()}`}
            endValue={stats?.totalRevenue || 0}
            icon={Banknote}
            color="bg-green-500"
          />
        </div>
        <div className="stat-card anim-target">
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders?.toString() || "0"}
            endValue={stats?.totalOrders || 0}
            icon={Package}
            color="bg-blue-500"
          />
        </div>
        <div className="stat-card anim-target">
          <StatCard
            title="Total Products"
            value={stats?.totalProducts?.toString() || "0"}
            endValue={stats?.totalProducts || 0}
            icon={ShoppingBag}
            color="bg-pink-500"
          />
        </div>
      </div>

      {/* Main Content Area: Chart and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 main-panel anim-target">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Sales Overview
              </h3>
              <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 p-1 rounded-lg mt-2 sm:mt-0">
                {dateRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDateRange(option.value)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      dateRange === option.value
                        ? "bg-white text-pink-600 shadow-sm"
                        : "text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-80 relative">
              {stats?.salesData && stats.salesData.length > 0 ? (
                <SalesChart salesData={stats.salesData} range={dateRange} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No sales data for this period.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 main-panel anim-target">
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <RecentOrders orders={stats.recentOrders} />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center text-gray-500">
              No recent orders.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
