import { IBlog } from "@/lib/models/Blog";

export interface PaginatedBlogsResponse {
  data: IBlog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
  };
}

/**
 * Fetches a paginated and searchable list of blog posts.
 */
export const getBlogs = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}): Promise<PaginatedBlogsResponse> => {
  const url = `/api/blogs?page=${page}&limit=${limit}&search=${search}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch blog posts.");
  const data = await res.json();
  if (!data.success)
    throw new Error(data.error || "API returned an error for blog posts.");
  return data;
};

export const getBlogById = async (id: string): Promise<IBlog> => {
  const res = await fetch(`/api/blogs/${id}`);
  if (!res.ok) throw new Error("Failed to fetch blog post.");
  const data = await res.json();
  return data.data;
};

export const createBlogPost = async (postData: any): Promise<IBlog> => {
  const res = await fetch("/api/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create post.");
  return data.data;
};

export const updateBlogPost = async ({
  id,
  postData,
}: {
  id: string;
  postData: any;
}): Promise<IBlog> => {
  const res = await fetch(`/api/blogs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update post.");
  return data.data;
};

export const deleteBlogPost = async (id: string): Promise<any> => {
  const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete post.");
  return res.json();
};
