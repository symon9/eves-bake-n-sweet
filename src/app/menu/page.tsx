import dbConnect from "@/lib/dbConnect";
import Product, { IProduct } from "@/lib/models/Product";
import ProductCard from "@/components/ProductCard";
import { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

// --- ENHANCED SEO METADATA ---
export const metadata: Metadata = {
  title: "Our Full Menu | Eve's Bake n Sweet",
  description:
    "Explore the full menu of delicious, handcrafted baked goods from Eve's Bake n Sweet. From custom cakes to daily fresh pastries, find your perfect treat.",
  openGraph: {
    title: "Our Full Menu | Eve's Bake n Sweet",
    description:
      "Browse our complete selection of cakes, cookies, pastries, and more.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/menu`,
    siteName: "Eve's Bake n Sweet",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/og-menu.jpg`, // TODO: Create a specific OG image for the menu page
        width: 1200,
        height: 630,
        alt: "A delicious assortment of baked goods from Eve's Bake n Sweet",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Full Menu | Eve's Bake n Sweet",
    description:
      "Browse our complete selection of cakes, cookies, pastries, and more.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/images/og-menu.jpg`],
  },
};

async function getAllProducts() {
  await dbConnect();
  const products = await Product.find({}).sort({ name: 1 });
  return JSON.parse(JSON.stringify(products));
}

export default async function MenuPage() {
  const allProducts: IProduct[] = await getAllProducts();

  // --- JSON-LD STRUCTURED DATA FOR ITEM LIST ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Eve's Bake n Sweet Full Menu",
    description:
      "A list of all available baked goods and treats from our bakery.",
    itemListElement: allProducts.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product._id}`,
        image: product.imageUrls[0],
        description: product.description,
        offers: {
          "@type": "Offer",
          priceCurrency: "NGN",
          price: product.price.toFixed(2),
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "Eve's Bake n Sweet",
          },
        },
      },
    })),
  };

  return (
    <>
      {/* Inject the structured data into the page's head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <PageHeader
          title="Our Full Menu"
          subtitle="Every item is baked fresh daily with the finest ingredients and a dash of love."
        />

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
