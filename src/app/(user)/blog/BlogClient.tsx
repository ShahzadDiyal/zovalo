// src/app/(user)/blog/BlogClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  ChevronRight,
  Sparkles,
  Clock,
  Eye,
  User,
  AlertCircle,
} from "lucide-react";
import { BlogPost, BlogCategory } from "../../../types";
import { SEO } from "../../../components/SEO";

interface BlogClientProps {
  initialPosts: BlogPost[];
  initialCategories: BlogCategory[];
  categorySlug?: string | null;
  searchQuery?: string | null;
  selectedCategoryName?: string;
  totalPosts: number;
}

// Blog Card Component
function BlogCard({ post }: { post: BlogPost }) {
 const formatDate = (timestamp: any) => {
  if (!timestamp) return "N/A";
  
  let date;
  
  // Check if it's a Firestore Timestamp (has toDate method)
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } 
  // Check if it's a Firestore timestamp object with seconds/nanoseconds
  else if (timestamp.seconds !== undefined) {
    date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
  }
  // Check if it's an ISO string or already a Date object
  else if (typeof timestamp === 'string' || timestamp instanceof Date) {
    date = new Date(timestamp);
  }
  // Fallback
  else {
    date = new Date(timestamp);
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "N/A";
  }
  
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden bg-neutral-100">
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-100">
              <span className="text-4xl">🪑</span>
            </div>
          )}
        </div>

        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-center gap-2 text-[10px] text-neutral-500 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.views || 0}
            </span>
          </div>

          <h3 className="text-lg font-serif text-neutral-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>

          <p className="text-sm text-neutral-500 line-clamp-2 flex-1">
            {post.excerpt || post.content?.substring(0, 120) + "..."}
          </p>

          <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                <User className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-xs text-neutral-600">
                {post.author?.name || "Royal Furniture"}
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 group-hover:text-neutral-900 transition-colors flex items-center gap-1">
              Read More <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[8px] text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export function BlogClient({
  initialPosts,
  initialCategories,
  categorySlug,
  searchQuery: initialSearchQuery,
  selectedCategoryName = "",
  totalPosts,
}: BlogClientProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [allPosts] = useState<BlogPost[]>(initialPosts);
  const [categories] = useState<BlogCategory[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categorySlug || null,
  );
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!searchTerm.trim()) {
      router.push("/blog", { scroll: false });
      setPosts(allPosts);
      setSelectedCategory(null);
      return;
    }

    setFiltering(true);
    setError(null);

    try {
      const searchLower = searchTerm.toLowerCase();
      let filtered = [...allPosts];

      if (selectedCategory) {
        filtered = filtered.filter((p) => {
          const category = categories.find((c) => c.slug === selectedCategory);
          return category ? p.category === category.id : true;
        });
      }

      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          (post.content && post.content.toLowerCase().includes(searchLower)) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
      );

      setPosts(filtered);
      router.push(`/blog?search=${encodeURIComponent(searchTerm)}`, {
        scroll: false,
      });
    } catch (error) {
      console.error("Error searching posts:", error);
      setError("Failed to search posts. Please try again.");
    } finally {
      setFiltering(false);
    }
  };

  const handleCategoryFilter = (categorySlug: string | null) => {
    setFiltering(true);
    setError(null);

    try {
      let filtered = [...allPosts];

      if (categorySlug) {
        const category = categories.find((c) => c.slug === categorySlug);
        if (category) {
          filtered = filtered.filter((p) => p.category === category.id);
          setSelectedCategory(categorySlug);
          router.push(`/blog?category=${categorySlug}`, {
            scroll: false,
          });
        }
      } else {
        setSelectedCategory(null);
        router.push("/blog", { scroll: false });
      }

      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (post) =>
            post.title.toLowerCase().includes(searchLower) ||
            (post.content &&
              post.content.toLowerCase().includes(searchLower)) ||
            (post.excerpt &&
              post.excerpt.toLowerCase().includes(searchLower)) ||
            post.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
        );
      }

      setPosts(filtered);
    } catch (error) {
      console.error("Error filtering posts:", error);
      setError("Failed to filter posts. Please try again.");
    } finally {
      setFiltering(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPosts(allPosts);
    setSelectedCategory(null);
    router.push("/blog", { scroll: false });
  };

  const isFiltering = filtering;

  // Get category name for display
  const getCategoryName = () => {
    if (selectedCategoryName) return selectedCategoryName;
    if (selectedCategory) {
      const category = categories.find((c) => c.slug === selectedCategory);
      return category?.name || "";
    }
    return "";
  };

  const displayCategoryName = getCategoryName();

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <SEO
        title={displayCategoryName ? `${displayCategoryName} - Blog` : "Blog"}
        description={
          displayCategoryName
            ? `Explore our ${displayCategoryName} articles and insights from Royal Furniture experts.`
            : "Discover expert tips, design inspiration, and furniture care guides from Royal Furniture."
        }
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-neutral-900 text-white py-12 sm:py-16 md:py-20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              {initialSearchQuery
                ? "Search Results"
                : displayCategoryName
                  ? `Category: ${displayCategoryName}`
                  : "Royal Blog"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
            {initialSearchQuery
              ? `Search: "${initialSearchQuery}"`
              : displayCategoryName
                ? displayCategoryName
                : "Design & Inspiration"}
          </h1>
          <p className="text-neutral-400 font-light text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {initialSearchQuery
              ? `Found ${posts.length} results for "${initialSearchQuery}"`
              : displayCategoryName
                ? `Explore our collection of ${displayCategoryName} articles and expert insights`
                : "Discover expert tips, design inspiration, and furniture care guides from Royal Furniture experts."}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-2xl mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-neutral-50 border border-neutral-200/80 py-2.5 pl-10 pr-4 text-sm focus:border-amber-500 outline-none rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isFiltering}
                className="px-6 py-2.5 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors rounded-xl disabled:opacity-50"
              >
                {isFiltering ? "Searching..." : "Search"}
              </button>
              {(selectedCategory || initialSearchQuery) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-2.5 border border-neutral-200 text-neutral-600 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors rounded-xl"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories Scroll */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${
              !selectedCategory
                ? "bg-neutral-900 text-white"
                : "bg-white border border-neutral-200/80 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.slug)}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${
                selectedCategory === category.slug
                  ? "bg-neutral-900 text-white"
                  : "bg-white border border-neutral-200/80 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {isFiltering && posts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-neutral-200/80 rounded-2xl">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
            <p className="mt-4 text-sm text-neutral-500">Loading articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-neutral-200/80 rounded-2xl">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-serif text-neutral-900 mb-2">
              No articles found
            </h3>
            <p className="text-neutral-500">
              {initialSearchQuery
                ? `No results found for "${initialSearchQuery}"`
                : displayCategoryName
                  ? `No articles in "${displayCategoryName}" yet`
                  : "Check back soon for new content"}
            </p>
            {(initialSearchQuery || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
