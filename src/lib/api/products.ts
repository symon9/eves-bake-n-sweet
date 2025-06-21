import { IProduct } from "@/lib/models/Product";

// Interface for the paginated response
export interface PaginatedProductsResponse {
  data: IProduct[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
  };
}

/**
 * Fetches all products from the API.
 * Fetches a paginated list of products from the API.
 * This function is designed to be used with React Query's useQuery.
 */
export const getProducts = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<PaginatedProductsResponse> => {
  const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
  if (!res.ok) {
    throw new Error("Network response was not ok while fetching products.");
  }
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch products from API.");
  }
  return data;
};

/**
 * Deletes a product by its ID.
 * This function is designed to be used with React Query's useMutation.
 * @param productId - The ID of the product to delete.
 */
export const deleteProduct = async (productId: string): Promise<any> => {
  const res = await fetch(`/api/products/${productId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete product.");
  }
  return res.json();
};

/**
 * Creates a new product.
 * @param productData - The data for the new product.
 */
export const createProduct = async (
  productData: Omit<IProduct, "_id">
): Promise<IProduct> => {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    throw new Error("Failed to create product.");
  }
  const data = await res.json();
  return data.data;
};

/**
 * Updates an existing product.
 * @param {Object} params - The parameters for updating a product.
 * @param {string} params.productId - The ID of the product to update.
 * @param {Partial<IProduct>} params.productData - The new data for the product.
 */
export const updateProduct = async ({
  productId,
  productData,
}: {
  productId: string;
  productData: Partial<IProduct>;
}): Promise<IProduct> => {
  const res = await fetch(`/api/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    throw new Error("Failed to update product.");
  }
  const data = await res.json();
  return data.data;
};

/**
 * Fetches a single product by its ID.
 * @param productId - The ID of the product to fetch.
 */
export const getProductById = async (productId: string): Promise<IProduct> => {
  const res = await fetch(`/api/products/${productId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch product details.");
  }
  const data = await res.json();
  if (!data.success) {
    throw new Error(
      data.error || "API returned unsuccessful status for product details."
    );
  }
  return data.data;
};
