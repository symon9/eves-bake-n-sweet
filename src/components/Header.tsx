"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Menu,
  X,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { useCart } from "@/context/CartContext";

gsap.registerPlugin(useGSAP);

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`
        relative py-2 text-lg font-medium text-gray-600 transition-colors hover:text-pink-600
        after:content-[''] after:absolute after:left-0 after:bottom-[-2px]
        after:w-full after:h-[2px] after:bg-pink-600
        after:transition-transform after:duration-300 after:ease-in-out
        ${isActive ? "after:scale-x-100 text-pink-600" : "after:scale-x-0"}
        hover:after:scale-x-100 hover:after:origin-left
      `}
    >
      {children}
    </Link>
  );
};

const Header = () => {
  const { state } = useCart();
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  useGSAP({ scope: mobileMenuRef });

  useEffect(() => {
    if (isMenuOpen) {
      gsap.to(mobileMenuRef.current, {
        height: "auto",
        duration: 0.4,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.fromTo(
            ".mobile-nav-link",
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.3,
              ease: "power2.out",
            }
          );
        },
      });
    } else {
      gsap.to(".mobile-nav-link", {
        opacity: 0,
        y: -10,
        stagger: 0.05,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(mobileMenuRef.current, {
            height: 0,
            duration: 0.4,
            ease: "power3.inOut",
          });
        },
      });
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenuAndNavigate = () => {
    if (isMenuOpen) {
      gsap.to(".mobile-nav-link", {
        opacity: 0,
        stagger: 0.05,
        duration: 0.2,
        onComplete: () => {
          gsap.to(mobileMenuRef.current, {
            height: 0,
            duration: 0.4,
            ease: "power3.inOut",
            onComplete: () => setIsMenuOpen(false),
          });
        },
      });
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-pink-600 z-50">
            Eve&apos;s Bake n Sweet
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/menu">Menu</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/about">About Us</NavLink>
          </div>

          <div className="flex items-center space-x-4 z-50">
            <Link href="/cart" className="relative" id="cart-icon">
              <ShoppingCart className="text-pink-600" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMenu}
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* --- MOBILE MENU PANEL --- */}
        {/* We use `visibility` to keep the div in the DOM for GSAP to target when closing */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden absolute top-full left-0 w-full bg-white/96 backdrop-blur-lg shadow-lg overflow-hidden ${
            isMenuOpen ? "visible" : "invisible"
          }`}
          style={{ height: 0 }}
        >
          <div className="flex flex-col items-left p-6 space-y-6 py-8">
            <Link
              href="/"
              onClick={closeMenuAndNavigate}
              className="mobile-nav-link opacity-0 text-xl font-medium text-gray-700"
            >
              Home
            </Link>
            <Link
              href="/menu"
              onClick={closeMenuAndNavigate}
              className="mobile-nav-link opacity-0 text-xl font-medium text-gray-700"
            >
              Menu
            </Link>
            <Link
              href="/blog"
              onClick={closeMenuAndNavigate}
              className="mobile-nav-link opacity-0 text-xl font-medium text-gray-700"
            >
              Blog
            </Link>
            <Link
              href="/about"
              onClick={closeMenuAndNavigate}
              className="mobile-nav-link opacity-0 text-xl font-medium text-gray-700"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={closeMenuAndNavigate}
              className="mobile-nav-link opacity-0 text-xl font-medium text-gray-700"
            >
              Contact
            </Link>
          </div>
          <div className="mobile-socials p-6 flex space-x-6 border-t border-pink-200">
            <a href="#" className="text-gray-600 hover:text-pink-600">
              <Twitter />
            </a>
            <a href="#" className="text-gray-600 hover:text-pink-600">
              <Instagram />
            </a>
            <a href="#" className="text-gray-600 hover:text-pink-600">
              <Facebook />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
