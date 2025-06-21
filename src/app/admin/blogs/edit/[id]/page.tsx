"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

import { useGetBlogById, useUpdateBlog } from "@/lib/hooks/useBlogs";
import BlogForm from "@/components/admin/BlogForm";

export default function EditBlogPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: post, isLoading } = useGetBlogById(id as string);
  const { mutate: updatePost, isPending } = useUpdateBlog();

  const handleSubmit = (formData: any) => {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        updatePost(
          { id: id as string, postData: formData },
          {
            onSuccess: () => {
              router.push("/admin/blogs");
              resolve();
            },
            onError: reject,
          }
        );
      }),
      {
        loading: "Saving changes...",
        success: "Post updated successfully!",
        error: (err) => `Error: ${err.message}`,
      }
    );
  };

  return (
    <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-lg font-semibold text-gray-700">Edit Blog Post</h2>
        <Link
          href="/admin/blogs"
          className="text-sm text-pink-600 hover:underline"
        >
          ← Back to Blog List
        </Link>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <BlogForm
          onSubmit={handleSubmit}
          initialData={post}
          buttonText="Save Changes"
          isSubmitting={isPending}
        />
      )}
    </section>
  );
}
