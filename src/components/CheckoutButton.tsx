"use client";

import { usePaystackPayment } from "react-paystack";
import { Loader2 } from "lucide-react";

interface PaystackConfig {
  reference: string;
  email: string;
  amount: number; // in kobo
  publicKey: string;
}

interface CheckoutButtonProps {
  config: PaystackConfig;
  onSuccess: (reference: any) => void;
  onClose: () => void;
  disabled: boolean;
  isSubmitting: boolean;
  total: number;
}

const CheckoutButton = ({
  config,
  onSuccess,
  onClose,
  disabled,
  isSubmitting,
  total,
}: CheckoutButtonProps) => {
  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    initializePayment({
      onSuccess,
      onClose,
    });
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isSubmitting}
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
  );
};

export default CheckoutButton;
