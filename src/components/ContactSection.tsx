"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const contactDetails = [
  {
    icon: MapPin,
    title: "Our Bakery",
    text: "123 Sweet Street, Kano, Kano, Nigeria",
    href: "https://www.google.com/maps/search/?api=1&query=123+Sweet+Street+Kano+Kano",
  },
  {
    icon: Phone,
    title: "Call Us",
    text: "+234 801 234 5678",
    href: "tel:+2348012345678",
  },
  {
    icon: Mail,
    title: "Email Us",
    text: "orders@evesbake.com",
    href: "mailto:orders@evesbake.com",
  },
  {
    icon: Clock,
    title: "Opening Hours",
    text: "Mon - Sat: 8:00 AM - 7:00 PM",
  },
];

const ContactSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".contact-item", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
      });

      gsap.from(".map-container", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        scale: 1.1,
        duration: 1.2,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* --- Left Side: The Map --- */}
        <div className="map-container relative h-[50vh] lg:h-screen">
          <div className="absolute inset-0 bg-pink-500 opacity-30 mix-blend-multiply pointer-events-none z-10"></div>
          <div className="absolute inset-0 grayscale pointer-events-none z-0"></div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.2169999999997!2d3.3429999999999997!3d6.619000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b932ef3c706e3%3A0x6bde34380a6b18c6!2sIkeja%2C%20Lagos!5e0!3m2!1sen!2sng!4v1620920445582!5m2!1sen!2sng"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Eve's Bake n Sweet Location"
          ></iframe>
        </div>

        {/* --- Right Side: The Details --- */}
        <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
          <div className="max-w-md w-full">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We&apos;d love to hear from you! Whether it&apos;s a question about an
              order, a special request, or just to say hello, here&apos;s how you can
              reach us.
            </p>
            <div className="mt-12 space-y-8">
              {contactDetails.map((item, index) => {
                const isClickable = !!item.href;
                const Wrapper = isClickable ? "a" : "div";

                return (
                  <Wrapper
                    key={index}
                    href={item.href}
                    target={isClickable ? "_blank" : undefined}
                    rel={isClickable ? "noopener noreferrer" : undefined}
                    className={`contact-item flex items-start gap-4 group ${
                      isClickable ? "cursor-pointer" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 bg-pink-100 p-3 rounded-full">
                      <item.icon className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.title}
                      </h3>
                      <p
                        className={`text-gray-500 ${
                          isClickable
                            ? "group-hover:text-pink-600 group-hover:underline"
                            : ""
                        } transition-colors`}
                      >
                        {item.text}
                      </p>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
