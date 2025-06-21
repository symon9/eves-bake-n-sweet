"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(answerRef.current, { height: isOpen ? "auto" : 0 });
    },
    { dependencies: [isOpen], scope: containerRef }
  );

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={containerRef} className="border-b border-gray-200 py-6">
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-gray-800">{question}</h3>
        <ChevronDown
          className={`h-6 w-6 text-pink-600 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div ref={answerRef} className="overflow-hidden">
        <p className="pt-4 text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

export default FaqItem;
