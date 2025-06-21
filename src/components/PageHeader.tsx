"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import AnimatedText from "./AnimatedText";

gsap.registerPlugin(useGSAP);

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const PageHeader = ({ title, subtitle, className = "" }: PageHeaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(containerRef.current?.querySelector(".subtitle"), {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.3,
      }).from(
        containerRef.current?.querySelector(".decorator"),
        {
          scaleX: 0,
          duration: 1,
          transformOrigin: "left center",
        },
        "-=0.6"
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={`text-center py-12 md:py-16 bg-pink-50 ${className}`}
    >
      <div className="container mx-auto px-4">
        <AnimatedText
          text={title}
          className="text-4xl md:text-5xl font-bold text-gray-800"
        />
        {subtitle && (
          <p className="subtitle mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="decorator mt-6 h-1 w-24 bg-pink-500 mx-auto rounded-full"></div>
      </div>
    </div>
  );
};

export default PageHeader;
