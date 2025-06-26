import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getBlogs,
  getBlogById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/api/blogs";
import { IBlog } from "../models/Blog";

type UpdateBlogVariables = {
  id: string;
  postData: Partial<IBlog>; // It can be a partial update
};

export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  detail: (id: string) => [...blogKeys.all, "detail", id] as const,
};

/**
 * Custom hook to fetch a paginated list of blog posts.
 */
export const useGetBlogs = ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}) => {
  return useQuery({
    queryKey: [blogKeys.lists(), { page, limit, search }],
    queryFn: keepPreviousData(() => getBlogs({ page, limit, search })),
  });
};

export const useGetBlogById = (id: string) => {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => getBlogById(id),
    enabled: !!id,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<IBlog, Error, UpdateBlogVariables>({
    mutationFn: updateBlogPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(String(data._id)) });
    },
    onError: (error) => {
        console.error("Update failed:", error.message);
    }
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};
