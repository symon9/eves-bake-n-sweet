"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Types } from "mongoose";
import { Phone, Mail, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { useGetOrderById, useUpdateOrderStatus } from "@/lib/hooks/useOrders";
import { IOrder } from "@/lib/models/Order";

interface PopulatedOrderItem {
  _id: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  productId: {
    _id: string;
    imageUrls: string[];
  };
}

interface PopulatedOrder extends Omit<IOrder, "items"> {
  items: PopulatedOrderItem[];
}

const DetailCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4">
      {title}
    </h3>
    {children}
  </div>
);

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: order, isLoading, isError, error } = useGetOrderById(id);
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateOrderStatus();

  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  const handleStatusUpdate = () => {
    if (selectedStatus && selectedStatus !== order?.status) {
      toast.promise(
        new Promise<void>((resolve, reject) => {
          updateStatus(
            { orderId: id, status: selectedStatus },
            {
              onSuccess: () => resolve(),
              onError: (err) => reject(err),
            }
          );
        }),
        {
          loading: "Updating status...",
          success: <b>Order status updated!</b>,
          error: (err) => <b>Error: {err.message}</b>,
        }
      );
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-20 text-gray-500">
          Loading Order Details...
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-20 text-red-600">
          Error: {error.message}
        </div>
      );
    }

    if (!order) {
      return (
        <div className="text-center py-20 text-gray-600">Order not found.</div>
      );
    }

    const paymentStatusColor =
      order.status === "paid"
        ? "bg-green-100 text-green-800"
        : order.status === "shipped"
        ? "bg-blue-100 text-blue-800"
        : order.status === "delivered"
        ? "bg-purple-100 text-purple-800"
        : order.status === "cancelled"
        ? "bg-red-100 text-red-800"
        : "bg-yellow-100 text-yellow-800";

    const statusOptions = [
      "pending",
      "paid",
      "shipped",
      "delivered",
      "cancelled",
    ];

    return (
      <>
        {/* Responsive Local Page Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
          <h1 className="text-2xl font-bold text-gray-800">
            Order #{order._id.slice(-6).toUpperCase()}
          </h1>
          <Link
            href="/admin/orders"
            className="text-pink-600 hover:underline font-medium"
          >
            ← Back to All Orders
          </Link>
        </div>

        {/* Responsive Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <DetailCard title="Order Items">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item._id.toString()}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      {item.productId &&
                      item.productId.imageUrls &&
                      item.productId.imageUrls.length > 0 ? (
                        <Image
                          src={item.productId.imageUrls[0]}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                      ) : (
                        // Fallback placeholder if there are no images
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Img</span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ₦{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </DetailCard>

            {order.notes && (
              <DetailCard title="Customer Notes">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {order.notes}
                </p>
              </DetailCard>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            <DetailCard title="Update Status">
              <div className="space-y-4">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-pink-400 focus:ring-pink-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdatingStatus || selectedStatus === order.status}
                  className="w-full flex items-center justify-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none focus:ring focus:ring-pink-300 focus:ring-opacity-80 disabled:bg-pink-300 disabled:cursor-not-allowed"
                >
                  {isUpdatingStatus ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Save Status"
                  )}
                </button>
              </div>
            </DetailCard>

            <DetailCard title="Order Summary">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₦{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>₦{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusColor}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
                {order.paymentReference && (
                  <div className="flex justify-between text-xs text-gray-500 pt-2">
                    <span className="font-medium">Paystack Ref</span>
                    <span className="truncate">{order.paymentReference}</span>
                  </div>
                )}
              </div>
            </DetailCard>

            <DetailCard title="Customer Details">
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-base text-gray-800">
                  {order.customer.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 truncate pr-2">
                    {order.customer.email}
                  </span>
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="p-2 rounded-full text-pink-600 bg-pink-100 hover:bg-pink-200 transition-colors flex-shrink-0"
                    aria-label={`Email ${order.customer.name}`}
                    title={`Email ${order.customer.email}`}
                  >
                    <Mail size={16} />
                  </a>
                </div>
                {order.customer.phone && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-gray-600">
                      {order.customer.phone}
                    </span>
                    <a
                      href={`tel:${order.customer.phone}`}
                      className="p-2 rounded-full text-pink-600 bg-pink-100 hover:bg-pink-200 transition-colors flex-shrink-0"
                      aria-label={`Call ${order.customer.name}`}
                      title={`Call ${order.customer.phone}`}
                    >
                      <Phone size={16} />
                    </a>
                  </div>
                )}
              </div>
            </DetailCard>

            <DetailCard title="Shipping Address">
              <address className="not-italic text-gray-600 text-sm leading-relaxed">
                {order.shippingAddress.street}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
                <br />
                {order.shippingAddress.country}
              </address>
            </DetailCard>
          </div>
        </div>
      </>
    );
  };

  return <section className="max-w-7xl mx-auto">{renderContent()}</section>;
}
