"use client";

import { useRef } from "react";
import FaqItem from "./FaqItem";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const faqData = [
  {
    question: "Do you offer custom cake orders?",
    answer:
      "Absolutely! We specialize in creating custom cakes for birthdays, weddings, and any special occasion. Please contact us at least one week in advance to discuss your design and flavor preferences.",
  },
  {
    question: "What is the best way to place a large or catering order?",
    answer:
      "For large orders of pastries, cookies, or other treats for an event or office meeting, we recommend contacting us directly via email or phone. This allows us to coordinate everything perfectly and ensure we can accommodate your request. A 72-hour notice is appreciated for catering orders.",
  },
  {
    question: "What are your opening hours?",
    answer:
      "We are open Tuesday to Saturday from 8:00 AM to 6:00 PM, and on Sunday from 9:00 AM to 4:00 PM. We are closed on Mondays. Hours may vary on public holidays.",
  },
  {
    question: "Do you offer delivery services?",
    answer:
      "Yes, we offer local delivery within a 10km radius for orders placed through our website. For larger catering or custom cake orders, please contact us directly to arrange delivery.",
  },
];

const Faq = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      gsap.from(el.querySelector(".faq-header"), {
        scrollTrigger: { trigger: el, start: "top 80%" },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(el.querySelectorAll(".faq-item-container"), {
        scrollTrigger: {
          trigger: el.querySelector(".faq-list"),
          start: "top 85%",
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="faq-header text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 mt-4">
            Have a question? We're here to help. If you don't find your answer
            below, feel free to contact us.
          </p>
        </div>
        <div className="faq-list">
          {faqData.map((item, index) => (
            <div key={index} className="faq-item-container">
              <FaqItem question={item.question} answer={item.answer} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
