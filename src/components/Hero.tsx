"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import HeroSlideshow from "./HeroSlideshow";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const slides = [
    {
      image: {
        src: "/images/hero-bread.jpg",
        alt: "A beautiful tiered celebration cake",
      },
      subtitle: "CELEBRATION CAKES",
      title: "Baked with Love, Just for You",
      button: { text: "Explore Cakes", href: "/menu" },
    },
    {
      image: {
        src: "/images/hero-cupcakes.png",
        alt: "A colorful assortment of freshly baked cupcakes",
      },
      subtitle: "ARTISAN CUPCAKES",
      title: "A Little Bite of Happiness",
      button: { text: "Discover Flavors", href: "/menu" },
    },
    {
      image: {
        src: "/images/hero-cookies.png",
        alt: "A warm batch of chocolate chip cookies",
      },
      subtitle: "GOURMET COOKIES",
      title: "Fresh from Our Oven to Yours",
      button: { text: "Shop Cookies", href: "/menu" },
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];

  const contentRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const animateTextOut = contextSafe(() => {
    gsap.to(".hero-text", {
      y: -20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.4,
      ease: "power2.in",
    });
  });

  const animateTextIn = contextSafe(() => {
    gsap.fromTo(
      ".hero-text",
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.4,
      }
    );
  });

  const handleSlideChange = (index: number) => {
    animateTextOut();

    setTimeout(() => {
      setCurrentIndex(index);
      animateTextIn();
    }, 400);
  };

  return (
    <section
      ref={containerRef}
      className="relative h-[80vh] text-white overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <HeroSlideshow
          images={slides.map((s) => s.image)}
          onChange={handleSlideChange}
        />
      </div>

      <div className="absolute inset-0 bg-black/50 z-10"></div>

      <div className="relative z-20 flex items-center justify-center h-full text-center p-4">
        <div className="flex flex-col items-center max-w-3xl">
          <div className="hero-text">
            <p className="text-lg md:text-xl mb-2 font-light">
              <span className="bg-black/50 rounded-full py-2 px-4 text-sm tracking-widest">
                {currentSlide.subtitle}
              </span>
            </p>
          </div>
          <div className="hero-text">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
              {currentSlide.title}
            </h1>
          </div>
          <div className="hero-text">
            <Link href={currentSlide.button.href}>
              <button className="bg-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-pink-700 transition-transform hover:scale-105 shadow-lg">
                {currentSlide.button.text}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
