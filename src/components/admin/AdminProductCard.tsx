"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { IProduct } from "@/lib/models/Product";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import ProductSlideshow from "../ProductSlideshow";

gsap.registerPlugin(useGSAP);

interface AdminProductCardProps {
  product: IProduct;
  onDelete: (productId: string) => void;
  isDeleting: boolean;
  deletingId: string | null;
}

const AdminProductCard = ({
  product,
  onDelete,
  isDeleting,
  deletingId,
}: AdminProductCardProps) => {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "power3.out",
      });

      const tl = gsap.timeline({ paused: true });
      tl.to(cardRef.current, {
        y: -8,
        scale: 1.03,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        duration: 0.3,
        ease: "power2.out",
      });

      const cardElement = cardRef.current;
      if (cardElement) {
        cardElement.addEventListener("mouseenter", () => tl.play());
        cardElement.addEventListener("mouseleave", () => tl.reverse());

        return () => {
          cardElement.removeEventListener("mouseenter", () => tl.play());
          cardElement.removeEventListener("mouseleave", () => tl.reverse());
        };
      }
    },
    { scope: cardRef }
  );

  return (
    <div
      ref={cardRef}
      className={`
        bg-white rounded-lg shadow-md overflow-hidden 
        flex flex-col // <-- Use flexbox to stack children vertically
        transition-opacity duration-300
        ${
          deletingId === product._id
            ? "opacity-50 scale-95"
            : "opacity-100 scale-100"
        }
      `}
    >
      {/* Part 1: The Image Slideshow */}
      <div className="relative">
        <ProductSlideshow images={product.imageUrls} altText={product.name} />
      </div>

      {/* Part 2: The Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-gray-800 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{product.category}</p>
        <p className="text-xl font-bold text-pink-600 mt-auto">
          ₦{product.price.toFixed(2)}
        </p>{" "}
      </div>

      {/* Part 3: The Action Buttons */}
      <div className="grid grid-cols-2 border-t">
        <button
          onClick={() => router.push(`/admin/products/edit/${product._id}`)}
          className="flex items-center justify-center gap-2 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Edit size={16} />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(product._id)}
          disabled={isDeleting && deletingId === product._id}
          className="flex items-center justify-center gap-2 py-3 text-sm text-red-600 hover:bg-red-50 border-l transition-colors disabled:opacity-50"
        >
          {isDeleting && deletingId === product._id ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
          <span>
            {isDeleting && deletingId === product._id ? "Deleting" : "Delete"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default AdminProductCard;
