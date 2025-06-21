import { Metadata } from "next";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import OurStory from "@/components/OurStory";
import BlogPreview from "@/components/BlogPreview";
import Reviews from "@/components/Reviews";
import Faq from "@/components/about/Faq";
import ContactSection from "@/components/ContactSection";

// --- ENHANCED SEO METADATA ---
export const metadata: Metadata = {
  title: "Eve's Bake n Sweet | Handcrafted Cakes, Cookies & Pastries",
  description:
    "Welcome to Eve's Bake n Sweet! Discover our delicious range of homemade cakes, cookies, and pastries, all baked with love in Lagos, Nigeria. Order online for a sweet treat.",
  keywords: [
    "bakery in Lagos",
    "bakery in Kano",
    "custom cakes",
    "meat pie",
    "cupcakes",
    "chin chin",
    "gourmet cookies",
    "online bakery",
    "Eve's Bake n Sweet",
  ],
  openGraph: {
    title: "Eve's Bake n Sweet | Handcrafted Cakes, Cookies & Pastries",
    description: "Delicious homemade baked goods, crafted with love.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Eve's Bake n Sweet",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/og-home.jpg`, // TODO: Will create a beautiful OG image for the homepage
        width: 1200,
        height: 630,
        alt: "A showcase of delicious baked goods from Eve's Bake n Sweet",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eve's Bake n Sweet | Handcrafted Cakes, Cookies & Pastries",
    description: "Delicious homemade baked goods, crafted with love.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/images/og-home.jpg`],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function HomePage() {
  // --- JSON-LD STRUCTURED DATA FOR ORGANIZATION & WEBSITE ---
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: "Eve's Bake n Sweet",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    logo: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+234-801-234-5678",
      contactType: "Customer Service",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Sweet Street",
      addressLocality: "Ikeja",
      addressRegion: "Lagos",
      postalCode: "100242",
      addressCountry: "NG",
    },
    sameAs: [
      // TODO: Add links to social media profiles
      "https://www.facebook.com/evesbakesweet",
      "https://www.instagram.com/evesbakesweet",
      "https://www.twitter.com/evesbakesweet",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_BASE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <div>
        <Hero />
        <div className="container mx-auto px-4 py-24">
          <FeaturedProducts />
        </div>
        <OurStory />
        <BlogPreview />
        <Reviews />
        <Faq />
        <ContactSection />
      </div>
    </>
  );
}
