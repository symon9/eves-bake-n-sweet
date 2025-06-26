'use client';

import Link from 'next/link';
import { Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-pink-50 text-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-pink-600 mb-2">Eve&apos;s Bake n Sweet</h3>
            <p className="max-w-md">Crafting delicious memories, one baked good at a time. All our products are made with love, using the finest local ingredients.</p>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-pink-600">Home</Link></li>
              <li><Link href="/menu" className="hover:text-pink-600">Full Menu</Link></li>
              <li><Link href="/blog" className="hover:text-pink-600">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-pink-600">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600"><Twitter /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600"><Instagram /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600"><Facebook /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-pink-200 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Eve&apos;s Bake n Sweet. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
