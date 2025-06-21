"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

import { useGetProductById, useUpdateProduct } from "@/lib/hooks/useProducts";
import { IProduct } from "@/lib/models/Product";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: product, isLoading, isError, error } = useGetProductById(id);
  const { mutate: updateProduct, isPending: isSubmitting } = useUpdateProduct();

  const handleUpdateProduct = (productData: Omit<IProduct, "_id">) => {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        updateProduct(
          { productId: id, productData },
          {
            onSuccess: () => {
              router.push("/admin/products");
              resolve();
            },
            onError: (err) => reject(err),
          }
        );
      }),
      {
        loading: "Saving changes...",
        success: <b>Product updated successfully!</b>,
        error: (err) => <b>Error: {err.message}</b>,
      }
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-10">Loading product details...</div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-10 text-red-500">
          Error: {error.message}
        </div>
      );
    }

    if (!product) {
      return (
        <div className="text-center py-10 text-gray-600">
          Product not found.
        </div>
      );
    }

    return (
      <ProductForm
        onSubmit={handleUpdateProduct}
        initialData={product}
        isSubmitting={isSubmitting}
        buttonText="Update Product"
      />
    );
  };

  return (
    <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-lg font-semibold text-gray-700">
          Edit Product Details
        </h2>
        <Link
          href="/admin/products"
          className="text-sm text-pink-600 hover:underline"
        >
          ← Back to Products
        </Link>
      </div>
      {renderContent()}
    </section>
  );
}
