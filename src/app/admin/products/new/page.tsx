"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

import ProductForm from "@/components/ProductForm";
import { IProduct } from "@/lib/models/Product";
import { useCreateProduct } from "@/lib/hooks/useProducts";

export default function NewProductPage() {
  const router = useRouter();
  const { mutate: createProduct, isPending: isSubmitting } = useCreateProduct();

  const handleCreateProduct = (productData: Omit<IProduct, "_id">) => {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        createProduct(productData, {
          onSuccess: () => {
            router.push("/admin/products");
            resolve();
          },
          onError: (err) => reject(err),
        });
      }),
      {
        loading: "Creating new product...",
        success: <b>Product created successfully!</b>,
        error: (err) => <b>Error: {err.message}</b>,
      }
    );
  };

  return (
    <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-lg font-semibold text-gray-700">
          Add a New Product
        </h2>
        <Link
          href="/admin/products"
          className="text-sm text-pink-600 hover:underline"
        >
          ← Back to Products
        </Link>
      </div>

      <ProductForm
        onSubmit={handleCreateProduct}
        isSubmitting={isSubmitting}
        buttonText="Create Product"
      />
    </section>
  );
}
