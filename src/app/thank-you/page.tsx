"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle, PartyPopper } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export default function ThankYouPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".icon-swoop", {
        scale: 0,
        opacity: 0,
        rotation: -90,
        duration: 0.7,
      })
        .from(
          ".text-reveal",
          {
            y: 50,
            opacity: 0,
            stagger: 0.15,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          ".action-button",
          {
            scale: 0.8,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
          },
          "-=0.3"
        );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center min-h-[70vh] text-center"
    >
      <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl max-w-2xl mx-auto">
        <div className="icon-swoop w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={60} className="text-green-600" />
        </div>

        <h1 className="text-reveal mt-6 text-3xl sm:text-4xl font-extrabold text-gray-900">
          Thank You for Your Order!
        </h1>

        <p className="text-reveal mt-4 text-base sm:text-lg text-gray-600">
          Your order has been received and is now being processed. We're just as
          excited as you are to get these delicious treats to you!
        </p>

        <div className="text-reveal mt-8 p-4 bg-pink-50 border-l-4 border-pink-500 text-left">
          <div className="flex">
            <div className="flex-shrink-0">
              <PartyPopper className="h-6 w-6 text-pink-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-md font-semibold text-pink-800">
                What Happens Next?
              </h3>
              <div className="mt-2 text-sm text-pink-700">
                <p>
                  A member of our team will give you a quick call shortly to
                  confirm the details and delivery time. Please keep your phone
                  handy!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="action-button w-full sm:w-auto bg-pink-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-pink-700 transition-all shadow-md hover:shadow-lg"
          >
            Back to Homepage
          </Link>
          <Link
            href="/blog"
            className="action-button w-full sm:w-auto text-pink-600 font-semibold px-8 py-3 rounded-lg hover:bg-pink-100 transition-colors"
          >
            Read Our Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
