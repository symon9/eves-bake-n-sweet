"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";

import { useCreateManualOrder } from "@/lib/hooks/useOrders";
import { useGetProducts } from "@/lib/hooks/useProducts";
import { useModal } from "@/context/ModalProvider";

// Interface for items in the manual order form
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function NewOrderPage() {
  const router = useRouter();
  const { showModal } = useModal();

  const { data: productData, isLoading: isLoadingProducts } = useGetProducts({
    page: 1,
    limit: 1000,
  });
  const allProducts = productData?.data || [];

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria",
  });
  const [status, setStatus] = useState<
    "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  >("paid");
  const [notes, setNotes] = useState("");

  const { mutate: createOrder, isPending } = useCreateManualOrder();

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const addProductItem = () => {
    if (allProducts.length > 0) {
      const firstProduct = allProducts[0];
      setOrderItems([
        ...orderItems,
        {
          productId: String(firstProduct._id),
          name: firstProduct.name,
          price: firstProduct.price,
          quantity: 1,
        },
      ]);
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...orderItems];
    if (field === "productId") {
      const selectedProduct = allProducts.find((p) => p._id === value);
      if (selectedProduct) {
        newItems[index] = {
          ...newItems[index],
          productId: value,
          name: selectedProduct.name,
          price: selectedProduct.price,
        };
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setOrderItems(newItems);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      toast.error("Please add at least one product to the order.");
      return;
    }

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const orderData = {
      customer,
      shippingAddress,
      items: orderItems.map(({ productId, name, price, quantity }) => ({
        productId,
        name,
        price,
        quantity,
      })),
      totalAmount,
      status,
      notes,
    };

    const performCreateAction = () => {
      toast.promise(
        new Promise<void>((resolve, reject) => {
          createOrder(orderData, {
            onSuccess: () => {
              router.push("/admin/orders");
              resolve();
            },
            onError: reject,
          });
        }),
        {
          loading: "Creating order...",
          success: "Manual order created successfully!",
          error: (err: Error) => `Error: ${err.message}`,
        }
      );
    };

    showModal({
      title: "Confirm Order Creation",
      message: `You are about to create a manual order for ${
        customer.name
      } with a total of ₦${totalAmount.toFixed(2)}. Proceed?`,
      confirmText: "Create Order",
      onConfirm: performCreateAction,
    });
  };

  const inputStyle =
    "block w-full px-3 py-2 mt-1 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-pink-400 focus:ring-pink-300 focus:ring-opacity-40 focus:outline-none focus:ring";

  return (
    <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-lg font-semibold text-gray-700">
          Create Manual Order
        </h2>
        <Link
          href="/admin/orders"
          className="text-sm text-pink-600 hover:underline"
        >
          ← Back to Orders
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Order Items Section */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Order Items
          </h3>
          <div className="space-y-4">
            {orderItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 items-center p-3 bg-gray-50 rounded-md"
              >
                <select
                  value={item.productId}
                  onChange={(e) =>
                    handleItemChange(index, "productId", e.target.value)
                  }
                  className={`${inputStyle} col-span-6`}
                >
                  {allProducts.map((p) => (
                    <option key={String(p._id)} value={String(p._id)}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className={`${inputStyle} col-span-2 text-center`}
                  min="1"
                />
                <span className="col-span-3 text-right text-gray-700">
                  ₦{(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="col-span-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addProductItem}
            disabled={isLoadingProducts}
            className="mt-4 flex items-center gap-2 text-sm text-pink-600 font-medium hover:underline"
          >
            <PlusCircle size={18} /> Add Item
          </button>
        </div>

        {/* Customer Details Section */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Customer Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
              className={inputStyle}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={customer.email}
              onChange={(e) =>
                setCustomer({ ...customer, email: e.target.value })
              }
              className={inputStyle}
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
              className={inputStyle}
            />
          </div>
        </div>

        {/* Shipping Address Section (can be simplified if not always needed) */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Shipping Address
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Street"
              value={shippingAddress.street}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  street: e.target.value,
                })
              }
              className={`${inputStyle} sm:col-span-2`}
              required
            />
            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, city: e.target.value })
              }
              className={inputStyle}
              required
            />
            <input
              type="text"
              placeholder="State"
              value={shippingAddress.state}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  state: e.target.value,
                })
              }
              className={inputStyle}
              required
            />

            <input
              type="text"
              placeholder="Postal Code"
              value={shippingAddress.postalCode}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  postalCode: e.target.value,
                })
              }
              className={inputStyle}
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className={inputStyle}
              required
            />
          </div>
        </div>

        {/* Order Status and Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-700 font-medium">Order Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className={inputStyle}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="text-gray-700 font-medium">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputStyle} h-20`}
            ></textarea>
          </div>
        </div>

        {/* Total and Submit */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="text-xl font-bold">
            Total:{" "}
            <span className="text-pink-600">₦{totalAmount.toFixed(2)}</span>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center px-6 py-2.5 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-pink-300"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Creating...
              </>
            ) : (
              "Create Order"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
