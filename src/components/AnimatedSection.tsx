"use client";

import { useRef, ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
}

const AnimatedSection = ({ children, className }: AnimatedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = sectionRef.current;
      if (!element) return;

      const children = Array.from(element.children);

      gsap.from(children, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={className}>
      {children}
    </section>
  );
};

export default AnimatedSection;

/*
 * -- HOW TO USE --
 * You'll see this in action when we build the new homepage. You'll simply wrap your content like this:
 * <AnimatedSection>
 *   <h2>Our Featured Products</h2>
 *  <div className="product-grid">...</div>
 * </AnimatedSection>
 */
