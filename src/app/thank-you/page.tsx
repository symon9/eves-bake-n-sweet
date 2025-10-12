'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { CheckCircle, PartyPopper, Download, BookOpen } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useCart } from '@/context/CartContext';
import { generateReceiptPDF } from '@/lib/generateReceipt';

gsap.registerPlugin(useGSAP);

export default function ThankYouPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state } = useCart();
  const { lastSuccessfulOrder } = state;
  const hasDownloaded = useRef(false);

  useEffect(() => {
    if (lastSuccessfulOrder && !hasDownloaded.current) {
      const timer = setTimeout(() => {
        generateReceiptPDF(lastSuccessfulOrder);
        hasDownloaded.current = true;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [lastSuccessfulOrder]);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.icon-swoop', {
      scale: 0,
      opacity: 0,
      rotation: -90,
      duration: 0.7,
    })
    .from('.text-reveal', {
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 0.6,
    }, "-=0.4")
    .from('.action-button', {
      scale: 0.8,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
    }, "-=0.3")
    .from('.download-prompt', {
      y: 10,
      opacity: 0,
      duration: 0.5,
    }, "-=0.2");
  }, { scope: containerRef });
  
  const handleDownloadClick = () => {
    if (lastSuccessfulOrder) {
      generateReceiptPDF(lastSuccessfulOrder);
    }
  };

  return (
    <div ref={containerRef} className="flex items-center justify-center min-h-[70vh] text-center p-4">
      <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl max-w-2xl mx-auto">
        <div className="icon-swoop w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={60} className="text-green-600" />
        </div>
        
        <h1 className="text-reveal mt-6 text-3xl sm:text-4xl font-extrabold text-gray-900">
          Thank You for Your Order!
        </h1>
        
        <p className="text-reveal mt-4 text-base sm:text-lg text-gray-600">
          Your payment was successful and your order is confirmed. A receipt should begin downloading automatically.
        </p>

        {/* --- RE-INTEGRATED "WHAT HAPPENS NEXT" SECTION --- */}
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

        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <div className="w-full flex flex-wrap justify-center gap-4">
            <Link 
              href="/"
              className="action-button flex-grow sm:flex-grow-0 bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-pink-700 transition-all shadow-md hover:shadow-lg"
            >
              Back to Homepage
            </Link>
            {lastSuccessfulOrder && (
              <button
                onClick={handleDownloadClick}
                className="action-button flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 text-pink-600 font-semibold px-6 py-3 rounded-lg hover:bg-pink-100 transition-colors"
              >
                <Download size={18} />
                Download Receipt
              </button>
            )}
            <Link 
              href="/blog"
              className="action-button flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <BookOpen size={18} />
              Read Our Blog
            </Link>
          </div>
          {lastSuccessfulOrder && (
            <div className="download-prompt mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <span className="text-green-600 font-bold text-sm">✓</span>
              <p className="text-xs text-green-800">
                Your receipt has been automatically downloaded. Click the button again if you need another copy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
