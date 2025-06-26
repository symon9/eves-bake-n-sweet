"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ProductCard from "./ProductCard";
import { IProduct } from "@/lib/models/Product";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FeaturedProductsClient = ({ products }: { products: IProduct[] }) => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = containerRef.current;
      if (!section) return;

      gsap.from(section.querySelector(".section-title"), {
        scrollTrigger: { trigger: section, start: "top 80%" },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(section.querySelector(".section-description"), {
        scrollTrigger: { trigger: section, start: "top 75%" },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.from(section.querySelectorAll(".product-card-container"), {
        scrollTrigger: {
          trigger: section.querySelector(".products-grid"),
          start: "top 85%",
        },
        opacity: 0,
        y: 50,
        duration: 1.6,
        stagger: 0.3,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="text-center">
      <h2 className="section-title text-3xl font-bold mb-4 text-gray-800">
        Our Best Sellers
      </h2>
      <p className="section-description max-w-2xl mx-auto text-gray-600 mb-12">
        Hand-picked by our customers, these are the treats that keep them coming
        back for more.
      </p>

      <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={String(product._id)} className="product-card-container text-left">
            <ProductCard product={{ ...product, _id: String(product._id) }} />
          </div>
        ))}
      </div>

      <div className="mt-12">
        <Link
          href="/menu"
          className="group inline-flex items-center text-pink-600 font-semibold text-lg"
        >
          View Full Menu
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProductsClient;
