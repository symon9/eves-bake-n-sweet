"use client";

import { usePaystackPayment } from "react-paystack";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface PaystackButtonProps {
  amount: number; // Amount in kobo
  email: string;
  disabled: boolean;
}

const PaystackButton = ({ amount, email, disabled }: PaystackButtonProps) => {
  const { dispatch } = useCart();
  const router = useRouter();

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    // IMPORTANT: you should send this `reference`
    // to your backend to verify the transaction status with Paystack's API
    // before confirming the order.
    console.log("Payment successful, reference:", reference);
    alert("Payment successful! Thank you for your order.");

    dispatch({ type: "CLEAR_CART" });

    router.push("/");
  };

  const onClose = () => {
    console.log("Payment dialog closed.");
  };

  return (
    <button
      onClick={() => initializePayment({ onSuccess, onClose })}
      disabled={disabled || !email}
      className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      Pay with Paystack
    </button>
  );
};

export default PaystackButton;
