"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { format } from "date-fns";
import { Search, PlusCircle, Package, Loader2 } from "lucide-react";
import Link from "next/link";

import { useGetOrders } from "@/lib/hooks/useOrders";
import Pagination from "@/components/Pagination";

const statusStyles: { [key: string]: string } = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-purple-100 text-purple-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
  } = useGetOrders({
    page: currentPage,
    limit,
    search: debouncedSearchTerm,
  });

  const orders = paginatedData?.data;
  const totalPages = paginatedData?.pagination.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Effect to reset to page 1 when search term changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  const renderContent = () => {
    if (isLoading && !paginatedData) {
      return (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="p-10 text-center text-red-500">
          Error: {error.message}
        </div>
      );
    }

    if (!orders || orders.length === 0) {
      return (
        <div className="text-center py-16 px-6 bg-white rounded-lg">
          <Package className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            {searchTerm ? "No Orders Found" : "No Orders Yet"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchTerm
              ? `Your search for "${searchTerm}" did not match any orders.`
              : "When a new order comes in, it will appear here."}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Link
                href="/admin/orders/new"
                className="inline-flex items-center gap-2 bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-pink-700 transition-all shadow-md hover:shadow-lg"
              >
                <PlusCircle size={20} />
                <span>Add an Order Manually</span>
              </Link>
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  S/N
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Payment Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const style =
                  statusStyles[order.status] || statusStyles.pending;
                return (
                  <tr
                    key={order._id as string}
                    onClick={() => router.push(`/admin/orders/${order._id}`)}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {(currentPage - 1) * limit + index + 1}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm">
                      <div className="flex flex-col">
                        <p className="text-gray-900 font-semibold whitespace-no-wrap">
                          {format(new Date(order.createdAt), "d MMM yyyy")}
                        </p>
                        <p className="text-gray-500 text-xs whitespace-no-wrap mt-1">
                          {format(new Date(order.createdAt), "p")}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {order.customer.name}
                      </p>
                      <p className="text-gray-600 whitespace-no-wrap">
                        {order.customer.email}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm">
                      <p className="text-gray-900 font-semibold whitespace-no-wrap">
                        ₦{order.totalAmount.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm">
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${style}`}
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-0 ${
                            style.split(" ")[0]
                          } opacity-50 rounded-full`}
                        ></span>
                        <span className="relative">
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {orders.map((order) => {
            const style = statusStyles[order.status] || statusStyles.pending;
            return (
              <div
                key={order._id as string}
                onClick={() => router.push(`/admin/orders/${order._id}`)}
                className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-gray-900 truncate pr-2">
                    {order.customer.name}
                  </p>
                  <p className="font-semibold text-gray-800 flex-shrink-0">
                    ₦{order.totalAmount.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {order.customer.email}
                </p>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">
                      {format(new Date(order.createdAt), "d MMM yyyy")}
                    </span>
                    <span className="px-2 py-0.5 bg-pink-100 text-pink-800 text-xs font-medium rounded-full">
                      {format(new Date(order.createdAt), "p")}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full ${style}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Customer Orders</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          {/* Conditionally render the "New Order" button */}
          {orders && orders.length > 0 && (
            <Link
              href="/admin/orders/new"
              className="flex-shrink-0 flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
            >
              <PlusCircle size={20} />
              <span className="hidden sm:inline">New Order</span>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {renderContent()}
      </div>

      {/* Conditionally render the pagination */}
      {!isLoading && orders && orders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
