"use client";

import { useRef } from "react";
import { Leaf, Heart, Award } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const values = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description:
      "We believe in quality you can taste, which is why we source the best local and seasonal ingredients.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Every cookie, cake, and pastry is handcrafted with care and attention to detail, just like we would for our own family.",
  },
  {
    icon: Award,
    title: "Community Focused",
    description:
      "We are proud to be a part of this community and are dedicated to bringing people together through our love for baking.",
  },
];

const OurValues = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(containerRef.current?.querySelectorAll(".value-card"), {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.7,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            What We Stand For
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="value-card text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-pink-100 rounded-full">
                  <value.icon className="h-8 w-8 text-pink-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValues;
