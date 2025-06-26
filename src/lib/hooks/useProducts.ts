import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  getProductById,
} from "@/lib/api/products";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

/**
 * Custom hook to fetch a paginated list of products.
 */
export const useGetProducts = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: [productKeys.lists(), { page, limit }],
    queryFn: keepPreviousData(() => getProducts({ page, limit })),
  });
};

/**
 * Custom hook for deleting a product.
 * Handles invalidation of the product list on success.
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

/**
 * Custom hook for creating a product.
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

/**
 * Custom hook for updating a product.
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

/**
 * Custom hook to fetch a single product by its ID.
 * @param productId - The ID of the product.
 */
export const useGetProductById = (productId: string) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });
};
