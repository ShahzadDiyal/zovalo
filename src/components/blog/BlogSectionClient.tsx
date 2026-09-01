// src/components/blog/BlogSectionClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronRight,
  Sparkles,
  Clock,
  Eye,
  User,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { BlogPost } from "../../types";

interface BlogSectionClientProps {
  initialPosts: BlogPost[];
  limit?: number;
  title?: string;
  subtitle?: string;
}

// Individual Blog Card Component
function BlogCard({ post, featured }: { post: BlogPost; featured?: boolean }) {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";

    let date;

    // Check if it's a Firestore Timestamp (has toDate method)
    if (timestamp.toDate && typeof timestamp.toDate === "function") {
      date = timestamp.toDate();
    }
    // Check if it's a Firestore timestamp object with seconds/nanoseconds
    else if (timestamp.seconds !== undefined) {
      date = new Date(
        timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000,
      );
    }
    // Check if it's an ISO string or already a Date object
    else if (typeof timestamp === "string" || timestamp instanceof Date) {
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

  const getReadTime = (content: string) => {
    const words = content?.split(/\s+/).length || 0;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  return (
    <Link href={`/blog/${post.slug}`} className="group h-full block">
      <article
        className={`bg-white border border-neutral-200/80 overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-col ${featured ? "md:col-span-2 lg:col-span-2" : ""
          }`}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-neutral-100">
          <div className={`${featured ? "aspect-[21/9]" : "aspect-video"}`}>
            {post.featuredImage ? (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                <span className="text-6xl opacity-20">🪑</span>
              </div>
            )}
          </div>

          {/* Category Badge */}
          {post.categoryName && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[8px] font-bold uppercase tracking-widest text-amber-600 border border-amber-200/50 rounded-full shadow-sm">
                {post.categoryName}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-neutral-500 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getReadTime(post.content || "")} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.views || 0}
            </span>
          </div>

          {/* Title */}
          <h3
            className={` text-neutral-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2 ${featured ? "text-xl sm:text-2xl" : "text-lg"
              }`}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          <p
            className={`text-neutral-500 line-clamp-2 flex-1 ${featured ? "text-sm sm:text-base" : "text-sm"
              }`}
          >
            {post.excerpt || post.content?.substring(0, 120) + "..."}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <span className="text-xs text-neutral-600 truncate">
                {post.author?.name || "Royal Furniture"}
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 group-hover:text-neutral-900 transition-colors flex items-center gap-1 flex-shrink-0">
              Read More <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {/* Tags */}
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
              {post.tags.length > 3 && (
                <span className="text-[8px] text-neutral-400">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export function BlogSectionClient({
  initialPosts,
  limit = 3,
  title = "Latest from Our Blog",
  subtitle = "Discover expert tips, design inspiration, and furniture care guides",
}: BlogSectionClientProps) {
  const posts = initialPosts;

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F5]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/50 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600">
                Our Blog
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl  text-neutral-900 tracking-tight">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 max-w-2xl">
              {subtitle}
            </p>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-neutral-900 transition-colors whitespace-nowrap"
          >
            Explore All Articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Blog Grid */}
        <div
          className={`grid gap-6 ${posts.length === 1
              ? "grid-cols-1 max-w-2xl mx-auto"
              : posts.length === 2
                ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
        >
          {posts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              featured={index === 0 && posts.length >= 3}
            />
          ))}
        </div>

        {/* View All Button - Mobile Friendly */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
          >
            <BookOpen className="w-4 h-4" />
            Read All Articles
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
