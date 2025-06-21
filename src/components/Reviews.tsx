"use client";

import { useRef } from "react";
import { Star } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AnimatedSection from "./AnimatedSection";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// --- DATA ---
const reviewsData = [
  {
    name: "Sarah L.",
    text: "The chocolate lava cake is an absolute dream! It's our go-to for every family celebration. Truly made with love.",
    rating: 5,
  },
  {
    name: "Michael B.",
    text: "I ordered a custom birthday cake, and it exceeded all expectations. It was not only beautiful but incredibly delicious.",
    rating: 5,
  },
  {
    name: "Jessica T.",
    text: "The best sourdough bread in town. The crust is perfect, and the inside is so soft. I pick up a loaf every week!",
    rating: 5,
  },
  {
    name: "David R.",
    text: "Eve's cookies are dangerously addictive. The sea salt chocolate chip is a masterpiece. Highly recommend!",
    rating: 5,
  },
  {
    name: "Emily C.",
    text: "A wonderful local bakery with a cozy atmosphere. The staff is always so friendly and the pastries are always fresh.",
    rating: 5,
  },
  {
    name: "Daniel K.",
    text: "The croissants are flaky, buttery, and perfect. They transport me straight to a cafe in Paris. A must-try.",
    rating: 5,
  },
];

// Split reviews into three columns for the parallax effect
const columns = [
  reviewsData.slice(0, 2),
  reviewsData.slice(2, 4),
  reviewsData.slice(4, 6),
];

const ReviewCard = ({ review }: { review: (typeof reviewsData)[0] }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
    <div className="flex items-center">
      {[...Array(review.rating)].map((_, i) => (
        <Star key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
      ))}
    </div>
    <p className="text-gray-600 italic">"{review.text}"</p>
    <p className="font-semibold text-pink-600">- {review.name}</p>
  </div>
);

const Reviews = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = containerRef.current;
      if (!section) return;

      gsap.from(section.querySelector(".section-header"), {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(section.querySelectorAll(".review-col-1, .review-col-3"), {
        y: "-10%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(section.querySelector(".review-col-2"), {
        y: "5%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <AnimatedSection>
      <section ref={containerRef} className="py-24 bg-pink-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="section-header text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">
              Words from Our Customers
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600 mt-4">
              We love our community, and we're so grateful for the sweet things
              they have to say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {columns.map((col, colIndex) => (
              <div
                key={colIndex}
                className={`space-y-8 review-col-${colIndex + 1}`}
              >
                {col.map((review, reviewIndex) => (
                  <ReviewCard key={reviewIndex} review={review} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default Reviews;
