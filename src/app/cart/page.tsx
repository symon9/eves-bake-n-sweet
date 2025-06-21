"use client";

import Image from "next/image";
import Link from "next/link";
import { usePaystackPayment } from "react-paystack";
import { Trash2, Plus, Minus, ShoppingCart, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { useCart } from "@/context/CartContext";
import { useModal } from "@/context/ModalProvider";

export default function CartPage() {
  const { state, dispatch } = useCart();
  const { items } = state;
  const router = useRouter();
  const { showModal } = useModal();

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria",
  });
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePaymentSuccess = async (reference: any) => {
    toast.success("Payment Received! Finalizing your order...");

    const orderPayload = {
      customer: customerInfo,
      shippingAddress: { ...customerInfo },
      items: items.map(({ id, name, quantity, price }) => ({
        productId: id,
        name,
        quantity,
        price,
      })),
      totalAmount: total,
      notes: orderNotes,
      status: "paid",
      paymentReference: reference.reference,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const orderData = await res.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to save order.");
      }
    } catch (error: any) {
      console.error("CRITICAL: Failed to save a paid order.", error);
      toast.error(
        `Order confirmation failed. Please contact support with reference ${reference.reference}`
      );
    } finally {
      dispatch({ type: "CLEAR_CART" });
      router.push("/thank-you");
    }
  };

  const handlePaymentClose = () => {
    setIsSubmitting(false);
  };

  // Configure Paystack. This object is passed to the hook.
  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: customerInfo.email,
    amount: Math.round(total * 100), // Amount in Kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const handleCheckout = () => {
    setIsSubmitting(true);
    initializePayment({
      onSuccess: handlePaymentSuccess,
      onClose: handlePaymentClose,
    });
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id, quantity: newQuantity },
    });
  };

  const handleRemoveItem = (id: string, itemName: string) => {
    const performRemoveAction = () => {
      dispatch({ type: "REMOVE_ITEM", payload: { id } });
      toast.success(`"${itemName}" removed from cart.`);
    };

    showModal({
      title: "Remove Item",
      message: `Are you sure you want to remove "${itemName}" from your cart?`,
      confirmText: "Remove",
      onConfirm: performRemoveAction,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "notes") {
      setOrderNotes(value);
    } else {
      setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isFormValid =
    customerInfo.name &&
    customerInfo.email &&
    customerInfo.phone &&
    customerInfo.street &&
    customerInfo.city &&
    customerInfo.state &&
    customerInfo.postalCode;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24">
        <ShoppingCart size={64} className="text-gray-300 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-gray-500 mb-8">
          Looks like you haven't added any delicious treats yet.
        </p>
        <Link
          href="/menu"
          className="bg-pink-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-pink-700 transition-all shadow-md hover:shadow-lg"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const inputStyle =
    "block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500 focus:ring-opacity-50 focus:outline-none";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10">
        Shopping Cart
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-6">
          <h2 className="text-xl font-semibold border-b pb-4">
            Your Items ({items.reduce((acc, item) => acc + item.quantity, 0)})
          </h2>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center gap-4 border-b pb-6 last:border-b-0 last:pb-0"
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={100}
                height={100}
                className="rounded-md object-cover w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0"
              />
              <div className="flex-grow text-center sm:text-left">
                <h3 className="font-semibold text-lg text-gray-800">
                  {item.name}
                </h3>
                <p className="text-gray-500 text-sm">
                  Unit Price: ₦{item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-md"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 text-center font-medium w-12">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-md"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="font-bold w-24 text-right text-lg">
                  ₦{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item.id, item.name)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold border-b pb-4 mb-6">
            Order Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₦{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-green-600">FREE</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4 mt-2">
              <span>Total</span>
              <span>₦{total.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">
              Customer & Shipping Details
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleInputChange}
                className={inputStyle}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleInputChange}
                className={inputStyle}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                onChange={handleInputChange}
                className={inputStyle}
                required
              />
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                onChange={handleInputChange}
                className={`${inputStyle} mt-2`}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  onChange={handleInputChange}
                  className={inputStyle}
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  onChange={handleInputChange}
                  className={inputStyle}
                  required
                />
              </div>
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                onChange={handleInputChange}
                className={inputStyle}
                required
              />
              <textarea
                name="notes"
                placeholder="Any special instructions for your order?"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className={`${inputStyle} h-20`}
              />
            </div>
          </div>
          <div className="mt-8">
            <button
              onClick={handleCheckout}
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-700 transition-all shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSubmitting ? (
                <Loader2 className="mx-auto animate-spin" />
              ) : (
                `Pay ₦${total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
