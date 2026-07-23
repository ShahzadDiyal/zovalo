// src/app/admin/blogs/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  FileText,
  Calendar,
  Tag,
  Filter,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { blogPostApi } from "../../../services/blogPostApi";
import { BlogPost } from "../../../types";
import { formatCurrency } from "../../../lib/utils";
import { LoadingSpinner } from "../../../components/ui/Loading";
import { Skeleton } from "../../../components/ui/Loading";

export default function AdminBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft"
  >("all");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogPostApi.getAll();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setError("Failed to load posts. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await blogPostApi.delete(id);
      setSuccessMessage("Post deleted successfully!");
      await fetchPosts();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete post");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return status === "published"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-amber-50 text-amber-700 border-amber-200";
  };

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
            Blog Posts
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your blog articles and content
          </p>
        </div>
        <Link
          href="/admin/blogs/create"
          className="bg-near-black text-white px-4 sm:px-6 py-2.5 sm:py-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gold transition-all duration-300 w-full sm:w-auto justify-center rounded"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-warm-beige p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream border border-warm-beige py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-gold outline-none rounded"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-colors ${
                filterStatus === "all"
                  ? "bg-near-black text-white"
                  : "bg-cream text-gray-600 hover:bg-gold/20"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("published")}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-colors ${
                filterStatus === "published"
                  ? "bg-emerald-600 text-white"
                  : "bg-cream text-gray-600 hover:bg-gold/20"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilterStatus("draft")}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-colors ${
                filterStatus === "draft"
                  ? "bg-amber-600 text-white"
                  : "bg-cream text-gray-600 hover:bg-gold/20"
              }`}
            >
              Drafts
            </button>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-warm-beige rounded-lg p-4"
            >
              <div className="flex gap-4">
                <Skeleton className="w-24 h-24 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-white border border-warm-beige rounded-lg">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">
            {searchQuery ? "No posts match your search" : "No blog posts found"}
          </p>
          {!searchQuery && (
            <Link
              href="/admin/blogs/create"
              className="inline-block mt-4 text-gold hover:underline text-sm font-medium"
            >
              Create your first post
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-warm-beige rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-4">
                {/* Image */}
                <div className="w-full sm:w-32 h-48 sm:h-32 bg-cream rounded-lg overflow-hidden flex-shrink-0">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Link href={`/admin/blogs/edit/${post.id}`}>
                        <h3 className="font-display text-near-black hover:text-gold transition-colors line-clamp-1">
                          {post.title}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.createdAt?.toDate?.().toLocaleDateString() ||
                            "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {post.categoryName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views || 0} views
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${getStatusColor(post.status)}`}
                      >
                        {post.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 line-clamp-2 mt-2">
                    {post.excerpt ||
                      post.content?.substring(0, 150) + "..." ||
                      "No excerpt"}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-warm-beige">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="text-[9px] font-bold uppercase tracking-widest text-gold hover:text-near-black transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> View Post
                    </Link>
                    <Link
                      href={`/admin/blogs/edit/${post.id}`}
                      className="text-[9px] font-bold uppercase tracking-widest text-walnut hover:text-gold transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-[9px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 ml-auto">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[8px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-[8px] text-gray-400">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
