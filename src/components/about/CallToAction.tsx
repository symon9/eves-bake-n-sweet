"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CallToAction = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
        },
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: "elastic.out(1, 0.75)",
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-20 bg-pink-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Ready for a Sweet Treat?
        </h2>
        <p className="text-gray-600 mt-4 mb-8 max-w-xl mx-auto">
          Explore our menu of delightful, handcrafted baked goods and find your
          new favorite.
        </p>
        <Link href="/menu">
          <button className="bg-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-pink-700 transition-transform hover:scale-105">
            Browse the Menu
          </button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
