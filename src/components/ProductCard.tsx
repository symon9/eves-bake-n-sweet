"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { useCart } from "@/context/CartContext";
import ProductSlideshow from "./ProductSlideshow";

gsap.registerPlugin(useGSAP);

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrls: string[];
    description: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useCart();

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
        y: -10,
        scale: 1.03,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        duration: 0.3,
        ease: "power2.out",
      });

      const cardElement = cardRef.current;
      if (cardElement) {
        const onEnter = () => tl.play();
        const onLeave = () => tl.reverse();
        cardElement.addEventListener("mouseenter", onEnter);
        cardElement.addEventListener("mouseleave", onLeave);
        return () => {
          cardElement.removeEventListener("mouseenter", onEnter);
          cardElement.removeEventListener("mouseleave", onLeave);
        };
      }
    },
    { scope: cardRef }
  );

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrls[0],
        quantity: 1,
      },
    });

    // Only run in the browser
    if (typeof window !== "undefined" && cardRef.current) {
      const cardImage = cardRef.current.querySelector(
        ".product-slideshow-container img"
      );
      const cartIcon = document.getElementById("cart-icon");

      if (cardImage && cartIcon) {
        const imageRect = cardImage.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        const flyingImage = cardImage.cloneNode(true) as HTMLImageElement;
        flyingImage.style.position = "fixed";
        flyingImage.style.left = `${imageRect.left}px`;
        flyingImage.style.top = `${imageRect.top}px`;
        flyingImage.style.width = `${imageRect.width}px`;
        flyingImage.style.height = `${imageRect.height}px`;
        flyingImage.style.zIndex = "1000";
        flyingImage.style.borderRadius = "0.5rem";
        document.body.appendChild(flyingImage);

        gsap.to(flyingImage, {
          left: cartRect.left + cartRect.width / 2,
          top: cartRect.top + cartRect.height / 2,
          width: 0,
          height: 0,
          opacity: 0.5,
          duration: 0.8,
          ease: "power2.in",
          onComplete: () => {
            document.body.removeChild(flyingImage);
            gsap.fromTo(
              "#cart-icon",
              { scale: 1.5 },
              { scale: 1, duration: 0.3, ease: "back.out(1.7)" }
            );
          },
        });
      }
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-lg shadow-lg overflow-hidden transform flex flex-col h-full"
    >
      {/* Image Slideshow */}
      <div className="relative product-slideshow-container">
        <ProductSlideshow images={product.imageUrls} altText={product.name} />
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 leading-tight">
          {product.name}
        </h3>
        <p className="text-gray-600 mt-1 flex-grow line-clamp-3">
          {product.description}
        </p>

        {/* Price + Add to Cart */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-pink-500">
            ₦{product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
