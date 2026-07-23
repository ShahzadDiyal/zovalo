// src/app/admin/blogs/categories/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  FolderTree,
  ChevronRight,
  Image as ImageIcon,
  Filter,
  AlertCircle,
  Upload,
  Camera,
} from "lucide-react";
import { blogCategoryApi } from "../../../../services/blogCategoryApi";
import { BlogCategory } from "../../../../types";
import { LoadingSpinner } from "../../../../components/ui/Loading";
import { Skeleton } from "../../../../components/ui/Loading";
import { storage } from "../../../../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function AdminBlogCategories() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<Partial<BlogCategory> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogCategoryApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      setError("Failed to load categories. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `blog-categories/${timestamp}-${file.name}`;
      const storageRef = ref(storage, fileName);

      // Upload the file
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          setError("Failed to upload image. Please try again.");
          setUploadingImage(false);
        },
        async () => {
          // Get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Update form data with the image URL
          setCurrentCategory((prev) => ({
            ...prev,
            image: downloadURL,
          }));
          setImagePreview(downloadURL);
          setUploadingImage(false);
          setUploadProgress(0);
          setSuccessMessage("Image uploaded successfully!");
          setTimeout(() => setSuccessMessage(null), 3000);
        },
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setCurrentCategory((prev) => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const removeImage = () => {
    setCurrentCategory((prev) => ({ ...prev, image: "" }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory?.name || !currentCategory?.slug) {
      setError("Name and slug are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (currentCategory.id) {
        await blogCategoryApi.update(currentCategory.id, currentCategory);
        setSuccessMessage("Category updated successfully!");
      } else {
        await blogCategoryApi.create(
          currentCategory as Omit<
            BlogCategory,
            "id" | "createdAt" | "updatedAt"
          >,
        );
        setSuccessMessage("Category created successfully!");
      }

      setIsModalOpen(false);
      setCurrentCategory(null);
      setImagePreview(null);
      await fetchCategories();

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error("Error saving category:", error);
      setError(error.message || "Failed to save category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    setError(null);
    try {
      await blogCategoryApi.delete(id);
      setSuccessMessage("Category deleted successfully!");
      await fetchCategories();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Failed to delete category. Please try again.");
    }
  };

  const handleEdit = (category: BlogCategory) => {
    setCurrentCategory(category);
    setImagePreview(category.image || null);
    setIsModalOpen(true);
    setError(null);
  };

  const handleAddNew = () => {
    setCurrentCategory({});
    setImagePreview(null);
    setIsModalOpen(true);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display text-near-black uppercase tracking-tight">
            Blog Categories
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your blog categories and topics
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-near-black text-white px-4 sm:px-6 py-2.5 sm:py-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gold transition-all duration-300 w-full sm:w-auto justify-center rounded"
        >
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-warm-beige p-4 rounded-lg">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream border border-warm-beige py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-gold outline-none rounded"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white border border-warm-beige rounded-lg overflow-hidden"
            >
              <Skeleton className="h-32 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-12 bg-white border border-warm-beige rounded-lg">
          <FolderTree className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">
            {searchQuery
              ? "No categories match your search"
              : "No blog categories found"}
          </p>
          {!searchQuery && (
            <button
              onClick={handleAddNew}
              className="mt-4 text-gold hover:underline text-sm font-medium"
            >
              Create your first category
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white border border-warm-beige rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-32 bg-cream relative overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderTree className="w-10 h-10 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-1.5 bg-white rounded shadow hover:bg-gold transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1.5 bg-white rounded shadow hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-near-black uppercase tracking-tight">
                  {category.name}
                </h3>
                <p className="text-[10px] font-mono text-walnut font-bold uppercase tracking-widest mb-2">
                  /{category.slug}
                </p>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {category.description || "No description"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-near-black/80 backdrop-blur-sm"
            onClick={() => {
              setIsModalOpen(false);
              setCurrentCategory(null);
              setImagePreview(null);
              setError(null);
            }}
          />
          <div className="bg-white max-w-md w-full relative z-10 shadow-2xl border border-warm-beige rounded-lg p-6 max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-near-black"
              onClick={() => {
                setIsModalOpen(false);
                setCurrentCategory(null);
                setImagePreview(null);
                setError(null);
              }}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-display text-near-black mb-6">
              {currentCategory?.id ? "Edit Category" : "New Category"}
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Category Name *
                </label>
                <input
                  required
                  value={currentCategory?.name || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/\s+/g, "-");
                    setCurrentCategory((prev) => ({
                      ...prev,
                      name,
                      slug: prev?.slug || slug,
                    }));
                  }}
                  className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none rounded"
                  placeholder="e.g., Design Tips"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Slug *
                </label>
                <input
                  required
                  value={currentCategory?.slug || ""}
                  onChange={(e) =>
                    setCurrentCategory((prev) => ({
                      ...prev,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    }))
                  }
                  className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm font-mono focus:border-gold outline-none rounded"
                  placeholder="design-tips"
                />
                <p className="text-[8px] text-gray-400 mt-1">
                  URL-friendly version of the category name
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Description
                </label>
                <textarea
                  value={currentCategory?.description || ""}
                  onChange={(e) =>
                    setCurrentCategory((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none rounded resize-none"
                  placeholder="Brief description for SEO..."
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Category Image
                </label>

                {/* Image Upload Area */}
                <div className="space-y-3">
                  {/* Upload Button */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="flex items-center gap-2 px-4 py-2 bg-cream border border-warm-beige text-sm hover:bg-gold/20 transition-colors rounded"
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingImage ? "Uploading..." : "Upload Image"}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <span className="text-[10px] text-gray-400 self-center">
                        or
                      </span>
                      <input
                        type="text"
                        value={currentCategory?.image || ""}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                        placeholder="Paste image URL"
                        className="flex-1 min-w-[150px] bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                      />
                    </div>

                    {/* Upload Progress */}
                    {uploadingImage && (
                      <div className="space-y-1">
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold transition-all duration-300 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-[8px] text-gray-400">
                          Uploading... {Math.round(uploadProgress)}%
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Image Preview */}
                  {(imagePreview || currentCategory?.image) && (
                    <div className="relative inline-block">
                      <div className="w-32 h-32 bg-cream border border-warm-beige rounded-lg overflow-hidden">
                        <img
                          src={imagePreview || currentCategory?.image || ""}
                          alt="Category preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <p className="text-[8px] text-gray-400">
                    Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentCategory(null);
                    setImagePreview(null);
                    setError(null);
                  }}
                  className="flex-1 border-2 border-near-black py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingImage}
                  className="flex-1 bg-near-black text-white py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-near-black transition disabled:opacity-50 rounded"
                >
                  {isSubmitting
                    ? "Saving..."
                    : currentCategory?.id
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
