import { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import OurMission from "@/components/about/OurMission";
import MeetTheBaker from "@/components/about/MeetTheBaker";
import OurValues from "@/components/about/OurValues";
import CallToAction from "@/components/about/CallToAction";
import Faq from "@/components/about/Faq";

// --- ENHANCED SEO METADATA ---
export const metadata: Metadata = {
  title: "About Us | Eve's Bake n Sweet",
  description:
    "Learn the story behind Eve's Bake n Sweet. Discover our passion for baking, our commitment to quality ingredients, and the love we pour into every creation.",
  openGraph: {
    title: "About Eve's Bake n Sweet | Our Story & Passion for Baking",
    description:
      "Discover our mission, meet our founder, and learn about the values that make our bakery special.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
    siteName: "Eve's Bake n Sweet",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/og-about.jpg`, // TODO: Create a specific OG image for the about page
        width: 1200,
        height: 630,
        alt: "A portrait of the baker, Eve, in her bakery.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Eve's Bake n Sweet | Our Story & Passion for Baking",
    description:
      "Discover our mission, meet our founder, and learn about the values that make our bakery special.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/images/og-about.jpg`],
  },
};

export default function AboutPage() {
  // --- JSON-LD STRUCTURED DATA for AboutPage and Bakery ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Us | Eve's Bake n Sweet",
    description:
      "Learn the story behind Eve's Bake n Sweet, our mission, values, and the baker behind our delicious treats.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
    // TODO: Embed information about the main entity of this page, which is your business
    mainEntity: {
      "@type": "Bakery",
      name: "Eve's Bake n Sweet",
      image: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
      telephone: "+234-801-234-5678",
      address: {
        "@type": "PostalAddress",
        streetAddress: "123 Sweet Street",
        addressLocality: "Kano",
        addressRegion: "Kano",
        postalCode: "700271",
        addressCountry: "NG",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <PageHeader
          title="Our Story"
          subtitle="Crafting delicious memories, one baked good at a time."
        />

        <OurMission />
        <MeetTheBaker />
        <OurValues />
        <Faq />
        <CallToAction />
      </div>
    </>
  );
}
