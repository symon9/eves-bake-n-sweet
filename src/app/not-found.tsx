'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.text-404', { scale: 0.5, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' })
      .from('.cookie-icon', { y: -50, opacity: 0, rotation: -45, duration: 0.6 }, '-=0.4')
      .from('.main-text', { y: 30, opacity: 0, stagger: 0.15 }, '-=0.3')
      .from('.action-button', { scale: 0.8, opacity: 0, duration: 0.5 }, '-=0.2');
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center min-h-screen bg-gray-50 text-center px-4"
    >
      <div className="max-w-md">
        <div className="relative inline-block">
          <h1 className="sr-only">Page Not Found</h1>
          <h1 className="text-404 text-9xl font-extrabold text-pink-200">404</h1>
          <Cookie size={64} className="cookie-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-500" />
        </div>

        <h2 className="main-text mt-4 text-3xl font-bold text-gray-800">
          Oops! The cookie crumbled.
        </h2>

        <p className="main-text mt-4 text-gray-600">
          The page you&apos;re looking for seems to have gone missing. Don&apos;t worry, we can get you back to the deliciousness.
        </p>

        <div className="mt-10">
          <Link
            href="/"
            className="action-button inline-block bg-pink-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-pink-700 transition-all shadow-md hover:shadow-lg"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
