"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MeetTheBaker = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      gsap.from(el.querySelectorAll(".baker-text-anim"), {
        scrollTrigger: { trigger: el, start: "top 80%" },
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-24 bg-pink-50 text-center">
      <div className="container mx-auto px-4">
        <div className="relative mx-auto h-32 w-32 rounded-full mb-6 shadow-lg baker-text-anim">
          <Image
            src="/images/bakery-owner.jpg"
            alt="Eve, the founder"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4 baker-text-anim">
          Meet Eve
        </h2>
        <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed baker-text-anim">
          "For me, baking has always been more than just a recipe. it's a way to
          connect with people and create moments of pure happiness. I started
          this bakery from my home kitchen, driven by a passion to share the
          comforting flavors I grew up with. Thank you for being a part of this
          sweet journey."
        </p>
      </div>
    </section>
  );
};

export default MeetTheBaker;
