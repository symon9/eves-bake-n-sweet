"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

interface AnimatedTextProps {
  text: string;
  className?: string;
  stagger?: number;
}

const AnimatedText = ({
  text,
  className,
  stagger = 0.03,
}: AnimatedTextProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  // Split the text into letters, wrapping each in a span
  const letters = text.split("").map((letter, index) => (
    <span
      key={index}
      className="letter inline-block"
      style={{ whiteSpace: letter === " " ? "pre" : "normal" }}
    >
      {letter}
    </span>
  ));

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Animate each letter from a starting state
      gsap.from(containerRef.current.querySelectorAll(".letter"), {
        y: "100%",
        opacity: 0,
        rotationZ: 15,
        duration: 0.8,
        ease: "power3.out",
        stagger: stagger,
      });
    },
    { scope: containerRef, dependencies: [text] }
  );

  return (
    <h1 ref={containerRef} className={`overflow-hidden ${className}`}>
      {letters}
    </h1>
  );
};

export default AnimatedText;
