"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CupcakeIcon = () => (
  <svg
    className="w-24 h-24 text-pink-500 frosting"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M12 2a2.5 2.5 0 0 1 2.5 2.5V7h-5V4.5A2.5 2.5 0 0 1 12 2z"
      fill="currentColor"
    />
    <path d="M12 7h.01" />
    <path d="M14.5 4.5a2.5 2.5 0 0 0-5 0" />
    <path d="M7 7a5 5 0 0 0 10 0" />
    <path d="M7 7h10" />
    <path d="M7 7a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2" />
    <path d="M7 11h10" />
    <path d="M7 15h10" />
  </svg>
);

export default function Loading() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".frosting",
        { scaleY: 0, transformOrigin: "bottom" },
        { scaleY: 1, duration: 1, ease: "power2.inOut", repeat: -1, yoyo: true }
      );

      gsap.to(".dot", {
        y: -10,
        stagger: {
          each: 0.2,
          repeat: -1,
          yoyo: true,
        },
        ease: "power2.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-pink-50 flex flex-col items-center justify-center z-[100]"
      role="status"
      aria-busy="true"
    >
      <CupcakeIcon />
      <div className="mt-6 text-xl font-semibold text-pink-800 flex items-center">
        <span>Baking fresh content</span>
        <span className="dot ml-1">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </div>
    </div>
  );
}
