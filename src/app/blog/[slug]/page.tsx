import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import { format } from "date-fns";
import ShareButtons from "@/components/ShareButtons";

async function getPostData(slug: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/blogs/slug/${slug}`, {
    next: { revalidate: 3600 }, // Revalidate data once per hour
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const postData = await getPostData(params.slug);

  if (!postData || !postData.success) {
    return {
      title: "Post Not Found",
      description: "The blog post you're looking for couldn't be found.",
    };
  }

  const post = postData.data.mainPost;

  return {
    title: `${post.title} | Eve's Bake n Sweet Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`,
      siteName: "Eve's Bake n Sweet",
      images: [
        {
          url: post.featuredMediaUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: post.createdAt,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.featuredMediaUrl],
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const postData = await getPostData(params.slug);

  if (!postData || !postData.success) {
    return <div className="text-center py-20">Post not found.</div>;
  }

  const { mainPost, recommendedPosts } = postData.data;

  // 2. JSON-LD STRUCTURED DATA (for Google Rich Results)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: mainPost.title,
    image: mainPost.featuredMediaUrl,
    author: {
      "@type": "Person",
      name: mainPost.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Eve's Bake n Sweet",
      logo: {
        "@type": "ImageObject",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/logo.png`,
      },
    },
    datePublished: mainPost.createdAt,
    dateModified: mainPost.updatedAt,
    description: mainPost.excerpt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${mainPost.slug}`,
    },
  };

  return (
    <>
      {/* This script tag injects the structured data into the page's head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-12 bg-gray-50">
        <header className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            {mainPost.title}
          </h1>
          <p className="text-lg text-gray-500">
            Posted on {format(new Date(mainPost.createdAt), "MMMM d, yyyy")} by{" "}
            <span className="font-semibold text-gray-700">
              {mainPost.author.name}
            </span>
          </p>
        </header>

        <div className="relative w-full max-w-5xl h-64 md:h-96 mx-auto rounded-lg overflow-hidden shadow-lg my-12">
          {mainPost.mediaType === "image" ? (
            <Image
              src={mainPost.featuredMediaUrl}
              alt={mainPost.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <video
              src={mainPost.featuredMediaUrl}
              controls
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="prose lg:prose-xl mx-auto px-4">
          {parse(mainPost.content)}
        </div>

        <footer className="max-w-4xl mx-auto px-4 mt-16">
          <div className="py-8 border-t border-b border-gray-200">
            <ShareButtons title={mainPost.title} />
          </div>

          {recommendedPosts && recommendedPosts.length > 0 && (
            <div className="py-12">
              <h3 className="text-2xl font-bold text-center mb-8">
                You Might Also Like...
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recommendedPosts.map((post: any) => (
                  <Link key={post._id} href={`/blog/${post.slug}`}>
                    <div className="group block">
                      <div className="relative aspect-video rounded-lg overflow-hidden shadow-sm">
                        <Image
                          src={post.featuredMediaUrl}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="mt-4 font-semibold text-lg text-gray-800 group-hover:text-pink-600 transition-colors">
                        {post.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </footer>
      </article>
    </>
  );
}
