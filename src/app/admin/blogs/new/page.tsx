"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

import { useCreateBlog } from "@/lib/hooks/useBlogs";
import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPostPage() {
  const router = useRouter();
  const { mutate: createPost, isPending } = useCreateBlog();

  const handleSubmit = (formData: any) => {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        createPost(formData, {
          onSuccess: () => {
            router.push("/admin/blogs");
            resolve();
          },
          onError: reject,
        });
      }),
      {
        loading: "Creating post...",
        success: "Post created successfully!",
        error: (err) => `Error: ${err.message}`,
      }
    );
  };

  return (
    <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-lg font-semibold text-gray-700">
          Create a New Blog Post
        </h2>
        <Link
          href="/admin/blogs"
          className="text-sm text-pink-600 hover:underline"
        >
          ← Back to Blog List
        </Link>
      </div>
      <BlogForm
        onSubmit={handleSubmit}
        buttonText="Publish Post"
        isSubmitting={isPending}
      />
    </section>
  );
}
