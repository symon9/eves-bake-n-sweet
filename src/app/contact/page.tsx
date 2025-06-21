import ContactSection from "@/components/ContactSection";
import { Metadata } from "next";

// --- SEO METADATA ---
export const metadata: Metadata = {
  title: "Contact Us | Eve's Bake n Sweet",
  description:
    "Get in touch with Eve's Bake n Sweet. Find our bakery location on the map, check our opening hours, and contact us for custom orders or inquiries. We'd love to hear from you!",
  openGraph: {
    title: "Contact Us | Eve's Bake n Sweet",
    description:
      "Find our bakery location, opening hours, and contact details.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
    siteName: "Eve's Bake n Sweet",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/og-contact.jpg`, // TODO: Create a specific Open Graph image for this page
        width: 1200,
        height: 630,
        alt: "Eve's Bake n Sweet Contact Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Eve's Bake n Sweet",
    description:
      "Find our bakery location, opening hours, and contact details.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/images/og-contact.jpg`],
  },
};

// --- JSON-LD STRUCTURED DATA for Local Business SEO ---
// This explicitly tells Google about the business, which is fantastic for local search results.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Eve's Bake n Sweet",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Sweet Street",
    addressLocality: "Ikeja",
    addressRegion: "Lagos",
    postalCode: "100242",
    addressCountry: "NG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 6.619, // TODO: Will replace with your actual latitude
    longitude: 3.343, // Will replace with your actual longitude
  },
  url: process.env.NEXT_PUBLIC_BASE_URL,
  telephone: "+2348012345678",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "19:00",
    },
  ],
  image: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
};

export default function ContactPage() {
  return (
    <>
      {/* Inject the JSON-LD Structured Data into the page's head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            We're Happy to Help
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Your connection to delicious, handcrafted treats is just a message
            or a visit away.
          </p>
        </div>

        <div className="container mx-auto px-4">
          <div className="rounded-lg shadow-2xl overflow-hidden">
            <ContactSection />
          </div>
        </div>
      </div>
    </>
  );
}
