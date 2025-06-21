"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { useGetProducts, useDeleteProduct } from "@/lib/hooks/useProducts";
import { useModal } from "@/context/ModalProvider";
import Pagination from "@/components/Pagination";
import AdminProductCard from "@/components/admin/AdminProductCard";

export default function AdminProductsPage() {
  const router = useRouter();
  const { showModal } = useModal();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(8);

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
  } = useGetProducts({ page: currentPage, limit });

  const { mutateAsync: deleteProductAsync, isPending: isDeleting } =
    useDeleteProduct();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const products = paginatedData?.data;
  const totalPages = paginatedData?.pagination.totalPages || 1;

  const handleDelete = (productId: string, productName: string) => {
    const performDeleteAction = () => {
      setDeletingId(productId);
      toast.promise(
        deleteProductAsync(productId).finally(() => {
          setDeletingId(null);
        }),
        {
          loading: "Deleting product...",
          success: <b>Product deleted successfully!</b>,
          error: (err) => <b>Error: {err.message}</b>,
        }
      );
    };

    showModal({
      title: "Delete Product",
      message: `Are you sure you want to permanently delete "${productName}"? This action cannot be undone.`,
      confirmText: "Delete",
      onConfirm: performDeleteAction,
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Manage Products</h1>
        {products && products.length > 0 && (
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            <PlusCircle size={20} />
            <span className="hidden sm:inline">Add New</span>
          </Link>
        )}
      </div>

      {isLoading && !paginatedData ? (
        <div className="flex justify-center h-full items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-500">
          Error: {error.message}
        </div>
      ) : products && products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <AdminProductCard
                key={product._id}
                product={product}
                onDelete={() => handleDelete(product._id, product.name)}
                isDeleting={isDeleting}
                deletingId={deletingId}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            Your Menu is Empty
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Let's add your first delicious creation to the menu.
          </p>
          <div className="mt-6">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-pink-700 transition-all shadow-md hover:shadow-lg"
            >
              <PlusCircle size={20} />
              <span>Add Your First Product</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
