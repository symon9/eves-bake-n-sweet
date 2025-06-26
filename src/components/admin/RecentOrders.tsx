"use client";

import { IOrder } from "@/lib/models/Order";
import Link from "next/link";
import { format } from "date-fns";

const RecentOrders = ({ orders }: { orders: IOrder[] }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Orders
      </h3>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={String(order._id)} href={`/admin/orders/${order._id}`}>
            <div className="flex justify-between items-center hover:bg-gray-50 p-2 rounded-md transition-colors">
              <div>
                <p className="font-medium text-gray-900 truncate">
                  {order.customer.name}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(order.createdAt), "d MMM yyyy")}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="font-semibold text-gray-800">
                  ₦{order.totalAmount.toFixed(2)}
                </p>
                <p
                  className={`text-xs font-medium ${
                    order.status === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
