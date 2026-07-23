// src/app/admin/blogs/edit/[id]/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  Image as ImageIcon,
  Tag,
  Info,
  ChevronRight,
  Upload,
  Trash2,
  AlertCircle,
  Eye,
  EyeOff,
  Calendar,
  User,
  FileText,
  Globe,
  Sparkles,
  Loader2,
} from "lucide-react";
import { blogPostApi } from "../../../../../services/blogPostApi";
import { blogCategoryApi } from "../../../../../services/blogCategoryApi";
import { BlogCategory, BlogPost } from "../../../../../types";
import { storage } from "../../../../../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { LoadingSpinner } from "../../../../../components/ui/Loading";
import { SEO } from "../../../../../components/SEO";

export default function EditBlogPost() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [slugGenerated, setSlugGenerated] = useState(false);

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    category: "",
    categoryName: "",
    tags: [],
    author: {
      name: "",
      avatar: "",
      bio: "",
    },
    status: "draft",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
  });

  useEffect(() => {
    if (postId) {
      fetchData();
    }
  }, [postId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch categories and post in parallel
      const [categoriesData, postData] = await Promise.all([
        blogCategoryApi.getAll(),
        blogPostApi.getById(postId),
      ]);

      setCategories(categoriesData);

      if (postData) {
        setFormData(postData);
        setImagePreview(postData.featuredImage || null);
        setSearchTerm("");
      } else {
        setError("Post not found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load post data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    setUploadProgress(0);
    setError(null);

    try {
      const timestamp = Date.now();
      const fileName = `blog-posts/${timestamp}-${file.name}`;
      const storageRef = ref(storage, fileName);

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
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prev) => ({ ...prev, featuredImage: downloadURL }));
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

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, featuredImage: "" }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "title" && !slugGenerated) {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: slug,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugGenerated(true);
    const slug = e.target.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    const category = categories.find((c) => c.id === categoryId);
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      categoryName: category?.name || "",
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tag),
    }));
  };

  const handleAddKeyword = (keyword: string) => {
    if (keyword.trim() && !formData.seoKeywords?.includes(keyword.trim())) {
      setFormData((prev) => ({
        ...prev,
        seoKeywords: [...(prev.seoKeywords || []), keyword.trim()],
      }));
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      seoKeywords: (prev.seoKeywords || []).filter((k) => k !== keyword),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const postData = {
        ...formData,
        author: {
          name: formData.author?.name || "Royal Furniture",
          avatar: formData.author?.avatar || "",
          bio: formData.author?.bio || "",
        },
      };

      await blogPostApi.update(postId, postData);

      setSuccessMessage("Blog post updated successfully!");
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1500);
    } catch (error: any) {
      console.error("Error updating blog post:", error);
      setError(error.message || "Failed to update blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-amber-600">
            Loading Post...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SEO
          title="Edit Blog Post"
          description="Edit your blog post for Royal Furniture"
        />

        {/* Success Message */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/blogs"
              className="p-2 bg-white border border-warm-beige hover:bg-gold hover:text-white transition-colors rounded"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display text-near-black uppercase tracking-tight">
                Edit Post
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Update your blog article
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  status: prev.status === "draft" ? "published" : "draft",
                }));
              }}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-colors ${
                formData.status === "published"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {formData.status === "published" ? (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Published
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <EyeOff className="w-3 h-3" /> Draft
                </span>
              )}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || uploadingImage}
              className="bg-near-black text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gold transition-all rounded"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Update Post"}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Post Title *
                </label>
                <input
                  name="title"
                  required
                  value={formData.title || ""}
                  onChange={handleChange}
                  className="w-full bg-cream border border-warm-beige py-3 px-4 text-lg font-display focus:border-gold outline-none rounded"
                  placeholder="Write an attention-grabbing title..."
                />
              </div>

              {/* Slug */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  URL Slug *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    /blog/
                  </span>
                  <input
                    name="slug"
                    required
                    value={formData.slug || ""}
                    onChange={handleSlugChange}
                    className="flex-1 bg-cream border border-warm-beige py-2 px-3 text-sm font-mono focus:border-gold outline-none rounded"
                    placeholder="your-post-slug"
                  />
                </div>
                <p className="text-[8px] text-gray-400 mt-1">
                  URL-friendly version of your title
                </p>
              </div>

              {/* Featured Image */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Featured Image
                </label>

                <div className="space-y-3">
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
                        value={formData.featuredImage || ""}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            featuredImage: e.target.value,
                          }));
                          setImagePreview(e.target.value);
                        }}
                        placeholder="Paste image URL"
                        className="flex-1 min-w-[150px] bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                      />
                    </div>

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

                  {(imagePreview || formData.featuredImage) && (
                    <div className="relative inline-block">
                      <div className="w-48 h-32 bg-cream border border-warm-beige rounded-lg overflow-hidden">
                        <img
                          src={imagePreview || formData.featuredImage || ""}
                          alt="Featured image preview"
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

              {/* Content */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Content *
                </label>
                <textarea
                  name="content"
                  required
                  rows={15}
                  value={formData.content || ""}
                  onChange={handleChange}
                  className="w-full bg-cream border border-warm-beige py-3 px-4 text-sm focus:border-gold outline-none rounded resize-none font-mono"
                  placeholder="Write your blog content here... Use HTML for formatting if needed."
                />
              </div>

              {/* Excerpt */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Excerpt / Summary
                </label>
                <textarea
                  name="excerpt"
                  rows={3}
                  value={formData.excerpt || ""}
                  onChange={handleChange}
                  className="w-full bg-cream border border-warm-beige py-3 px-4 text-sm focus:border-gold outline-none rounded resize-none"
                  placeholder="A brief summary of your post (used in blog listings and SEO)"
                />
                <p className="text-[8px] text-gray-400 mt-1">
                  Recommended: 150-160 characters for SEO
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Category */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category || ""}
                  onChange={handleCategoryChange}
                  className="w-full bg-cream border border-warm-beige py-2.5 px-3 text-sm focus:border-gold outline-none rounded"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add a tag..."
                    className="flex-1 bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-gold text-near-black px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition rounded"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-cream text-xs rounded-full border border-warm-beige"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
                {(formData.tags || []).length === 0 && (
                  <p className="text-[8px] text-gray-400 mt-1">
                    Press Enter or click Add to add tags
                  </p>
                )}
              </div>

              {/* Author */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                  Author Name
                </label>
                <input
                  name="author.name"
                  value={formData.author?.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      author: { ...prev.author, name: e.target.value },
                    }))
                  }
                  className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                  placeholder="Author name"
                />
              </div>

              {/* SEO Section */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-4 h-4 text-gold" />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-walnut">
                    SEO Settings
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[8px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                      SEO Title
                    </label>
                    <input
                      value={formData.seoTitle || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          seoTitle: e.target.value,
                        }))
                      }
                      className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                      placeholder="SEO title (defaults to post title)"
                    />
                    <p className="text-[8px] text-gray-400 mt-1">
                      Recommended: 50-60 characters
                    </p>
                  </div>

                  <div>
                    <label className="text-[8px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                      SEO Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.seoDescription || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          seoDescription: e.target.value,
                        }))
                      }
                      className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded resize-none"
                      placeholder="SEO meta description"
                    />
                    <p className="text-[8px] text-gray-400 mt-1">
                      Recommended: 150-160 characters
                    </p>
                  </div>

                  <div>
                    <label className="text-[8px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                      SEO Keywords
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add keyword..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const input = e.currentTarget;
                            handleAddKeyword(input.value);
                            input.value = "";
                          }
                        }}
                        className="flex-1 bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget
                            .previousElementSibling as HTMLInputElement;
                          if (input) {
                            handleAddKeyword(input.value);
                            input.value = "";
                          }
                        }}
                        className="bg-gold text-near-black px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition rounded"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(formData.seoKeywords || []).map((keyword) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gold/10 text-xs rounded-full border border-gold/20"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(keyword)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Info */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-walnut mb-4">
                  Post Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span
                      className={`font-medium ${formData.status === "published" ? "text-emerald-600" : "text-amber-600"}`}
                    >
                      {formData.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Created</span>
                    <span className="text-near-black">
                      {formData.createdAt?.toDate?.().toLocaleDateString() ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Updated</span>
                    <span className="text-near-black">
                      {formData.updatedAt?.toDate?.().toLocaleDateString() ||
                        "N/A"}
                    </span>
                  </div>
                  {formData.views !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Views</span>
                      <span className="text-near-black">{formData.views}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
