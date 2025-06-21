"use client";

import { useState, FormEvent, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

import EditorToolbar from "./EditorToolbar";

interface BlogFormProps {
  onSubmit: (formData: any) => void;
  initialData?: any;
  buttonText: string;
  isSubmitting: boolean;
}

const BlogForm = ({
  onSubmit,
  initialData,
  buttonText,
  isSubmitting,
}: BlogFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredMediaUrl, setFeaturedMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none p-4 min-h-[300px] bg-white rounded-b-md",
      },
    },
  });

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setExcerpt(initialData.excerpt || "");
      setFeaturedMediaUrl(initialData.featuredMediaUrl || "");
      setMediaType(initialData.mediaType || "image");

      if (
        editor &&
        initialData.content &&
        editor.getHTML() !== initialData.content
      ) {
        editor.commands.setContent(initialData.content);
      }
    }
  }, [initialData, editor]);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadToast = toast.loading("Uploading media...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "eves_bake_n_sweet");
    const resourceType = file.type.startsWith("video") ? "video" : "image";

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setFeaturedMediaUrl(data.secure_url);
        setMediaType(resourceType);
        toast.success("Media uploaded successfully!", { id: uploadToast });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.error("Upload failed. Please try again.", { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!featuredMediaUrl) {
      toast.error("Please upload a featured image or video.");
      return;
    }
    onSubmit({ title, content, excerpt, featuredMediaUrl, mediaType });
  };

  const inputStyle =
    "block w-full px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-pink-400 focus:ring-pink-300 focus:ring-opacity-40 focus:outline-none focus:ring";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="text-gray-700 font-medium">
          Post Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputStyle}
          required
        />
      </div>
      <div>
        <label className="text-gray-700 font-medium">
          Featured Image or Video
        </label>
        {!featuredMediaUrl && (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <label
                htmlFor="media-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500"
              >
                <span>Upload a file</span>
                <input
                  id="media-upload"
                  name="media-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleMediaUpload}
                  accept="image/*,video/*"
                  disabled={isUploading}
                />
              </label>
              {isUploading && (
                <Loader2 className="mx-auto mt-2 h-6 w-6 animate-spin" />
              )}
            </div>
          </div>
        )}
        {featuredMediaUrl && (
          <div className="mt-4 relative w-full max-w-md">
            {mediaType === "image" ? (
              <Image
                src={featuredMediaUrl}
                alt="Preview"
                width={400}
                height={225}
                className="rounded-md object-cover"
              />
            ) : (
              <video
                src={featuredMediaUrl}
                controls
                width="400"
                className="rounded-md"
              />
            )}
            <button
              type="button"
              onClick={() => setFeaturedMediaUrl("")}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      <div>
        <label htmlFor="content" className="text-gray-700 font-medium">
          Blog Content
        </label>
        <div className="border border-gray-300 rounded-md mt-1">
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>
      <div>
        <label htmlFor="excerpt" className="text-gray-700 font-medium">
          Excerpt (Short Summary)
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className={`${inputStyle} h-24`}
          maxLength={250}
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="flex items-center justify-center px-8 py-2.5 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-pink-300"
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

export default BlogForm;
