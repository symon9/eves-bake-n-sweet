"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const OurStory = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      gsap.from(el.querySelector(".story-image"), {
        scrollTrigger: { trigger: el, start: "top 80%" },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(el.querySelector(".story-text"), {
        scrollTrigger: { trigger: el, start: "top 80%" },
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-24 bg-pink-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="story-image relative h-80 rounded-lg shadow-xl">
            <Image
              src="/images/bakery-owner.jpg"
              alt="Eve, the owner of the bakery"
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <div className="story-text">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              A Pinch of Passion in Every Bite
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to Eve&apos;s Bake n Sweet, where every creation is a piece of
              our heart. Founded from a lifelong love for baking, we believe in
              the magic of simple, high-quality ingredients. From our family to
              yours, we&apos;re dedicated to baking delicious memories that last a
              lifetime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
