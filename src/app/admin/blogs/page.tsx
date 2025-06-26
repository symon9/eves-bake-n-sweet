"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Edit,
  Trash2,
  Newspaper,
  Search,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useDebounce } from "use-debounce";

import { useGetBlogs, useDeleteBlog } from "@/lib/hooks/useBlogs";
import Pagination from "@/components/Pagination";
import { useModal } from "@/context/ModalProvider";

export default function AdminBlogsPage() {
  const router = useRouter();
  const { showModal } = useModal();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
  } = useGetBlogs({
    page: currentPage,
    limit,
    search: debouncedSearchTerm,
  });

  const { mutateAsync: deletePostAsync } = useDeleteBlog();

  const posts = paginatedData?.data;
  const totalPages = paginatedData?.pagination.totalPages || 1;

  const handleDelete = (id: string, title: string) => {
    const performDeleteAction = () => {
      toast.promise(deletePostAsync(id), {
        loading: "Deleting post...",
        success: "Post deleted successfully!",
        error: (err: Error) => `Error: ${err.message}`,
      });
    };

    showModal({
      title: "Delete Blog Post",
      message: `Are you sure you want to permanently delete the post "${title}"? This action cannot be undone.`,
      confirmText: "Delete",
      onConfirm: performDeleteAction,
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  const renderContent = () => {
    if (isLoading && !paginatedData) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="p-10 text-center text-red-500">
          Error: {error.message}
        </div>
      );
    }

    if (!posts || posts.length === 0) {
      return (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
          <Newspaper className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            {searchTerm ? "No Posts Found" : "No Blog Posts Yet"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchTerm
              ? `Your search for "${searchTerm}" did not return any results.`
              : "It looks a little empty here. Why not share a story?"}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Link
                href="/admin/blogs/new"
                className="inline-flex items-center gap-2 bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-pink-700 shadow-sm transition-all"
              >
                <PlusCircle size={20} />
                <span>Create Your First Post</span>
              </Link>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {posts.map((post) => (
          <div
            key={post._id as string}
            className="flex flex-col sm:flex-row items-center p-4 border-b last:border-b-0 gap-4"
          >
            <Image
              src={post.featuredMediaUrl}
              alt={post.title}
              width={100}
              height={60}
              className="rounded-md object-cover w-full sm:w-24 h-40 sm:h-16 flex-shrink-0"
            />
            <div className="ml-0 sm:ml-4 flex-grow w-full">
              <p className="font-semibold text-gray-900 line-clamp-1">
                {post.title}
              </p>
              <p className="text-sm text-gray-500">
                By {typeof post.author === "object" && "name" in post.author
                  ? (post.author as { name: string }).name
                  : "Unknown Author"} on{" "}
                {format(new Date(post.createdAt), "d MMM yyyy")}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => router.push(`/admin/blogs/edit/${post._id}`)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Edit Post"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(post._id as string, post.title as string)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                title="Delete Post"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Manage Blog</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          {/* Only show "New Post" button if there are already posts */}
          {posts && posts.length > 0 && (
            <Link
              href="/admin/blogs/new"
              className="flex-shrink-0 flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
            >
              <PlusCircle size={20} />
              <span className="hidden sm:inline">New Post</span>
            </Link>
          )}
        </div>
      </div>

      {renderContent()}

      {/* Conditionally render pagination */}
      {paginatedData && paginatedData.pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
