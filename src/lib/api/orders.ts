import { IOrder } from "@/lib/models/Order";

export interface PaginatedOrdersResponse {
  data: IOrder[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
  };
}

/**
 * Fetches a paginated and searchable list of orders.
 */
export const getOrders = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}): Promise<PaginatedOrdersResponse> => {
  const url = `/api/orders?page=${page}&limit=${limit}&search=${search}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Network response was not ok while fetching orders.");
  }
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch orders from API.");
  }
  return data;
};

/**
 * Fetches a single order by its ID.
 */
export const getOrderById = async (orderId: string): Promise<IOrder> => {
  const res = await fetch(`/api/orders/${orderId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch order details.");
  }
  const data = await res.json();
  if (!data.success) {
    throw new Error(
      data.error || "API returned unsuccessful status for order details."
    );
  }
  return data.data;
};

/**
 * Updates the status of an existing order.
 * @param {Object} params - The parameters for updating the status.
 * @param {string} params.orderId - The ID of the order to update.
 * @param {string} params.status - The new status for the order.
 */
export const updateOrderStatus = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}): Promise<IOrder> => {
  const res = await fetch(`/api/orders/${orderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to update order status.");
  }

  return data.data;
};

/**
 * Creates a new order manually (for admin use).
 */
export const createManualOrder = async (orderData: any): Promise<IOrder> => {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create manual order.");
  return data.data;
};
