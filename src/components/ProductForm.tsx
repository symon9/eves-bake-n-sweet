"use client";

import { useState, FormEvent, useEffect } from "react";
// import { IProduct } from "@/lib/models/Product";
import { Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[];
}

interface ProductFormProps {
  onSubmit: (productData: ProductFormData) => Promise<void> | void;
  initialData?: ProductFormData | null;
  buttonText: string;
  isSubmitting: boolean;
}

const ProductForm = ({
  onSubmit,
  initialData,
  buttonText,
  isSubmitting,
}: ProductFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("Cakes");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setPrice(initialData.price);
      setCategory(initialData.category);
      setImageUrls(initialData.imageUrls);
    }
  }, [initialData]);

  // Handler for direct-to-Cloudinary image uploads
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadToast = toast.loading(`Uploading ${files.length} image(s)...`);

    const uploadPromises = Array.from(files).map(async (file) => {
      // You must create an "unsigned" upload preset in your Cloudinary settings
      // and name it exactly as you have it here.
      const uploadPreset = "eves_bake_n_sweet";

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        return data.secure_url;
      } catch (err) {
        console.error("Single image upload failed:", err);
        return null;
      }
    });

    try {
      const newImageUrls = await Promise.all(uploadPromises);
      const successfulUploads = newImageUrls.filter(
        (url) => url !== null
      ) as string[];
      setImageUrls((prev) => [...prev, ...successfulUploads]);
      toast.success("Images uploaded successfully!", { id: uploadToast });
    } catch (error) {
      console.error("Image upload process failed:", error);
      toast.error("Something went wrong during upload.", { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    setImageUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (imageUrls.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }
    const productData = { name, description, price, category, imageUrls };
    onSubmit(productData);
  };

  const inputStyle =
    "block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-pink-400 focus:ring-pink-300 focus:ring-opacity-40 focus:outline-none focus:ring transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-gray-700 font-medium">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputStyle}
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="text-gray-700 font-medium">
            Price (₦)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            className={inputStyle}
            step="0.01"
            min="0"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="text-gray-700 font-medium">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputStyle}
        >
          <option>Cakes</option>
          <option>Cookies</option>
          <option>Pastries</option>
          <option>Bread</option>
        </select>
      </div>

      <div>
        <label className="text-gray-700 font-medium">Product Images</label>
        <div className="mt-2 flex justify-center items-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                Upload one or more images (PNG, JPG, GIF)
              </p>
              {isUploading && (
                <Loader2 className="mt-4 h-6 w-6 animate-spin text-pink-500" />
              )}
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {imageUrls.length > 0 && (
        <div>
          <label className="text-gray-700 font-medium">Image Previews</label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group aspect-square">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="description" className="text-gray-700 font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputStyle} h-32`}
          required
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="flex items-center justify-center px-8 py-2.5 w-full sm:w-auto leading-5 text-white transition-colors duration-300 transform bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none focus:bg-pink-700 disabled:bg-pink-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-3" />
              Saving...
            </>
          ) : (
            buttonText
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
