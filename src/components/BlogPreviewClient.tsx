"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { IBlog } from "@/lib/models/Blog";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BlogPreviewClient = ({ posts }: { posts: IBlog[] }) => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = containerRef.current;
      if (!section) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });

      tl.from(section.querySelector(".section-header"), {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(
          section.querySelectorAll(".blog-card"),
          {
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .from(
          section.querySelector(".view-all-link"),
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
          },
          "-=0.3"
        );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-24">
      <div className="container mx-auto px-4">
        <div className="section-header text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Fresh from the Blog
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 mt-4">
            Stories, tips, and sweet inspiration from our kitchen to yours.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post._id} className="blog-card">
              <Link href={`/blog/${post.slug}`}>
                <div className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  <div className="relative aspect-video">
                    <Image
                      src={post.featuredMediaUrl}
                      alt={post.title}
                      fill
                      className="transition-transform duration-300 group-hover:scale-105 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">
                      {format(new Date(post.createdAt), "MMMM d, yyyy")}
                    </p>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="view-all-link mt-12 text-center">
          <Link
            href="/blog"
            className="group inline-flex items-center text-pink-600 font-semibold text-lg"
          >
            Read More Posts
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewClient;
