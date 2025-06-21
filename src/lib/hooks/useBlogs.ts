import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBlogs,
  getBlogById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/api/blogs";

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
    queryFn: () => getBlogs({ page, limit, search }),
    keepPreviousData: true,
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
  return useMutation({
    mutationFn: updateBlogPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(data._id) });
    },
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
