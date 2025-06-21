"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const OurMission = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      gsap.from(el.querySelector(".mission-image"), {
        scrollTrigger: { trigger: el, start: "top 80%" },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(el.querySelector(".mission-text"), {
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
    <section ref={containerRef} className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="mission-image relative h-96 rounded-lg shadow-xl">
            <Image
              src="/images/bakery-interior.jpg"
              alt="The warm and inviting interior of Eve's Bake n Sweet"
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <div className="mission-text">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At Eve's Bake n Sweet, our mission is simple: to spread joy
              through the timeless art of baking. We believe that the best
              moments in life are made sweeter with a shared treat, and we pour
              our hearts into creating desserts that are not only delicious but
              also beautiful.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We are committed to using only the finest, locally-sourced
              ingredients whenever possible. From rich, creamy butter to fresh,
              seasonal fruits, every component is chosen with care to ensure the
              highest quality in every single bite.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMission;
