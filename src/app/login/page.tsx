"use client";

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Mail, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(useGSAP);
/* TODO: add a background image */

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);

        gsap.fromTo(
          containerRef.current,
          { x: -10 },
          { x: 10, duration: 0.05, repeat: 5, yoyo: true, clearProps: "x" }
        );
      } else if (result?.ok) {
        router.push("/admin");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle =
    "w-full pl-10 pr-4 py-2 text-gray-700 bg-white/80 border border-gray-300 rounded-lg focus:border-pink-400 focus:ring-pink-300 focus:ring-opacity-40 focus:outline-none focus:ring transition-colors";

  return (
    <div
      className="
      min-h-[80vh] flex items-center justify-center p-4
      bg-[url('/images/hero-bread.jpg')] bg-cover bg-center
    "
    >
      <div className="absolute inset-0 bg-pink-900/40 backdrop-blur-sm"></div>

      <div ref={containerRef} className="relative w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="
            p-8 space-y-6
            bg-white/30 backdrop-blur-xl
            border border-white/20
            rounded-2xl shadow-2xl
          "
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-pink-100 text-sm">Welcome back, please login.</p>
          </div>

          {error && (
            <p className="bg-red-500/50 text-white p-3 text-center text-sm rounded-lg border border-red-500">
              {error}
            </p>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyle}
              placeholder="Email Address"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputStyle}
              placeholder="Password"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full flex items-center justify-center 
              px-4 py-2.5 
              font-semibold text-white 
              transition-colors duration-300 transform 
              bg-pink-600 rounded-lg 
              hover:bg-pink-700 
              focus:outline-none focus:bg-pink-700
              disabled:bg-pink-400 disabled:cursor-not-allowed
            "
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
