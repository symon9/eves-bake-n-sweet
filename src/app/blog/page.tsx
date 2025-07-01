import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { IBlog } from "@/lib/models/Blog";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/lib/models/Blog";

export const dynamic = "force-dynamic";
export const revalidate = 600;

// --- SEO METADATA ---
export const metadata: Metadata = {
  title: "The Blog | Eve's Bake n Sweet",
  description:
    "From our oven to your screen! Read the latest stories, recipes, and sweet inspiration from the kitchen of Eve's Bake n Sweet.",
  openGraph: {
    title: "The Blog | Eve's Bake n Sweet",
    description:
      "Stories, recipes, and sweet inspiration from our kitchen to yours.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
    siteName: "Eve's Bake n Sweet",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/og-blog.jpg`, // TODO: Create a specific OG image for the blog page
        width: 1200,
        height: 630,
        alt: "A collage of blog posts from Eve's Bake n Sweet",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Blog | Eve's Bake n Sweet",
    description:
      "Stories, recipes, and sweet inspiration from our kitchen to yours.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/images/og-blog.jpg`],
  },
};

async function getPosts() {
  await dbConnect();
  const posts = await Blog.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(posts));
}

const BlogCard = ({ post }: { post: IBlog }) => (
  <Link href={`/blog/${post.slug}`}>
    <div className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full flex flex-col">
      <div className="relative aspect-video">
        {post.mediaType === "image" ? (
          <Image
            src={post.featuredMediaUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <video
            src={post.featuredMediaUrl}
            muted
            loop
            playsInline
            autoPlay
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm text-gray-500 mb-2">
          {format(new Date(post.createdAt), "MMMM d, yyyy")}
        </p>
        <h2 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">
          {post.title}
        </h2>
        <p className="mt-2 text-gray-600 leading-relaxed flex-grow">
          {post.excerpt}
        </p>
        <div className="mt-4 text-pink-500 font-semibold group-hover:underline">
          Read More →
        </div>
      </div>
    </div>
  </Link>
);

export default async function BlogPage() {
  const posts: IBlog[] = await getPosts();

  // --- JSON-LD STRUCTURED DATA FOR BLOG POSTING LIST ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Eve's Bake n Sweet Blog",
    description: "A list of articles, stories, and recipes from our bakery.",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "BlogPosting",
        headline: post.title,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`,
        image: post.featuredMediaUrl,
        datePublished: post.createdAt,
        dateModified: post.updatedAt,
        author: {
          "@type": "Person",
          name: typeof post.author === "object" && "name" in post.author
            ? (post.author as { name: string }).name
            : "Eve's Bake n Sweet",
        },
        publisher: {
          "@type": "Organization",
          name: "Eve's Bake n Sweet",
          logo: {
            "@type": "ImageObject",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
          },
        },
      },
    })),
  };

  return (
    <>
      {/* Inject the structured data script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <PageHeader
          title="From Our Oven"
          subtitle="Stories, recipes, and sweet inspiration from our kitchen to yours."
        />

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post._id as string} post={post} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
