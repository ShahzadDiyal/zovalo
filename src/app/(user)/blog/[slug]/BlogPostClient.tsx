// src/app/(user)/blog/[slug]/BlogPostClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Eye,
  User,
  Clock,
  Share2,
  Heart,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { BlogPost } from "../../../../types";
import { blogService } from "../../../../services/blogService";

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const [isLiked, setIsLiked] = useState(false);

  // Increment views on client-side
  useEffect(() => {
    if (post.id) {
      blogService.incrementViews(post.id).catch(console.error);
    }
  }, [post.id]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    // Handle both Firestore Timestamp and regular Date objects
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <>
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <Link
            href={`/blog?category=${post.category}`}
            className="inline-block px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 hover:bg-amber-100 transition-colors"
          >
            {post.categoryName || "Blog"}
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-neutral-900 leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author?.name || "Royal Furniture"}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {Math.ceil((post.content?.length || 0) / 1000)} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.views || 0} views
            </span>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8 rounded-2xl overflow-hidden bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-900 prose-li:text-neutral-600 prose-blockquote:border-l-amber-500 prose-blockquote:bg-amber-50/50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:border-l-4 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-neutral-200/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-neutral-600">
                Tags:
              </span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?search=${tag}`}
                  className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full hover:bg-neutral-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share & Like */}
        <div className="mt-8 pt-8 border-t border-neutral-200/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isLiked
                  ? "bg-amber-50 text-amber-600 border border-amber-200"
                  : "bg-white border border-neutral-200/80 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-amber-600" : ""}`} />
              {isLiked ? "Liked" : "Like"}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200/80 text-neutral-600 hover:bg-neutral-50 rounded-xl transition-all"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 rounded-xl transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Have Questions?
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-serif text-neutral-900 mb-6">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className="group bg-white border border-neutral-200/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
                  {relatedPost.featuredImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={relatedPost.featuredImage}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🪑
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-neutral-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-2 mt-1">
                    {relatedPost.excerpt ||
                      relatedPost.content?.substring(0, 100) + "..."}
                  </p>
                  <div className="mt-3 text-[10px] text-neutral-400">
                    {formatDate(
                      relatedPost.publishedAt || relatedPost.createdAt,
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
