import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  createManualOrder,
} from "@/lib/api/orders";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: { page: number; limit: number; search: string }) =>
    [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

// --- CUSTOM HOOKS ---

/**
 * Custom hook to fetch a paginated list of orders.
 */
export const useGetOrders = ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}) => {
  return useQuery({
    queryKey: orderKeys.list({ page, limit, search }),
    queryFn: () => getOrders({ page, limit, search }),
    keepPreviousData: true,
  });
};

/**
 * Custom hook to fetch a single order by its ID.
 */
export const useGetOrderById = (orderId: string) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });
};

/**
 * Custom hook for updating an order's status.
 * Handles invalidation of both the order list and the specific order detail cache.
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

/**
 * Custom hook for creating a manual order from the admin panel.
 */
export const useCreateManualOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createManualOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};
