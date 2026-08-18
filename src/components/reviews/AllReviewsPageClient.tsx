"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Star,
  BadgeCheck,
  MessageCircle,
  ThumbsUp,
  Camera,
  Globe,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Quote,
} from "lucide-react";
import { Review } from "../../types";

// Source icons
const SOURCE_META: Record<
  Review["source"],
  { label: string; icon: React.ElementType; color: string }
> = {
  whatsapp: { label: "WhatsApp", icon: MessageCircle, color: "text-[#25d366]" },
  facebook: { label: "Facebook", icon: ThumbsUp, color: "text-[#1877f2]" },
  instagram: { label: "Instagram", icon: Camera, color: "text-[#E1306C]" },
  google: { label: "Google", icon: Globe, color: "text-[#4285F4]" },
  website: { label: "Website", icon: Globe, color: "text-walnut" },
};

function Stars({ value, size = "w-4 h-4" }: { value: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${
            n <= Math.round(value)
              ? "fill-amber-500 text-amber-500"
              : "text-neutral-200 fill-neutral-200"
          }`}
        />
      ))}
    </div>
  );
}

interface AllReviewsPageClientProps {
  initialReviews: Review[];
  aggregate: { count: number; average: number };
  productSlugMap: Map<string, string>;
}

type SortOption = "newest" | "highest" | "lowest";

export function AllReviewsPageClient({
  initialReviews,
  aggregate,
  productSlugMap,
}: AllReviewsPageClientProps) {
  const [reviews] = useState(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [visibleCount, setVisibleCount] = useState(9);

  // Rating breakdown
  const breakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.round(r.rating);
      if (star >= 1 && star <= 5) counts[star as keyof typeof counts]++;
    });
    return counts;
  }, [reviews]);

  // Filter and sort
  const filtered = useMemo(() => {
    let result = reviews;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          (r.productTitle || "").toLowerCase().includes(q)
      );
    }

    if (ratingFilter !== null) {
      result = result.filter((r) => Math.round(r.rating) === ratingFilter);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
        );
        break;
      case "highest":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        result.sort((a, b) => a.rating - b.rating);
        break;
    }

    return result;
  }, [reviews, searchQuery, ratingFilter, sortBy]);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = () => setVisibleCount((prev) => prev + 9);

  const handleWriteReview = () => {
    const message =
      "Hi Royal Furniture,\n\nI'd like to share a review for my recent purchase.\nMy review: ";
    window.open(
      `https://wa.me/447529661726?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // Empty state
  if (reviews.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white border border-neutral-200/80 p-12 shadow-sm">
          <div className="text-7xl mb-6">⭐</div>
          <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900 mb-3">
            No reviews yet
          </h2>
          <p className="text-neutral-500 max-w-md mx-auto mb-6">
            We haven't received any reviews yet. Be the first to share your
            experience!
          </p>
          <button
            onClick={handleWriteReview}
            className="inline-flex items-center gap-2 bg-[#25d366] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#128C7E] transition-colors shadow-lg"
          >
            <MessageCircle className="w-4 h-4" />
            Write a review on WhatsApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero / Summary Section */}
        <div className="bg-white border border-neutral-200/80 p-6 sm:p-8 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            {/* Left: Average Rating */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-5xl sm:text-6xl font-bold text-neutral-900">
                  {aggregate.average ? aggregate.average.toFixed(1) : "—"}
                </span>
                <span className="text-xl text-neutral-400">/ 5</span>
              </div>
              <Stars value={aggregate.average || 0} size="w-6 h-6" />
              <p className="text-sm text-neutral-500 mt-2">
                Based on <span className="font-bold">{aggregate.count}</span>{" "}
                reviews
              </p>
              <button
                onClick={handleWriteReview}
                className="mt-4 inline-flex items-center gap-2 bg-[#25d366] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#128C7E] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Send your review
              </button>
            </div>

            {/* Right: Rating Breakdown */}
            <div className="flex-1 w-full">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = breakdown[star as keyof typeof breakdown] || 0;
                  const pct =
                    aggregate.count > 0 ? (count / aggregate.count) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-sm">
                      <span className="w-12 text-right font-medium text-neutral-700">
                        {star} ★
                      </span>
                      <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-neutral-500 text-xs">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Controls: Search, Filter, Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search reviews by customer, product, or text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200/80 py-2.5 pl-9 pr-3 text-sm rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select
              value={ratingFilter ?? ""}
              onChange={(e) =>
                setRatingFilter(e.target.value ? Number(e.target.value) : null)
              }
              className="bg-white border border-neutral-200/80 py-2.5 px-3 text-sm rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
            >
              <option value="">All ratings</option>
              <option value="5">5 ★</option>
              <option value="4">4 ★ & up</option>
              <option value="3">3 ★ & up</option>
              <option value="2">2 ★ & up</option>
              <option value="1">1 ★ & up</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-white border border-neutral-200/80 py-2.5 px-3 text-sm rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
            >
              <option value="newest">Newest first</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-neutral-200/80">
            <p className="text-neutral-500">No reviews match your filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {displayed.map((review) => {
                const Source = SOURCE_META[review.source] ?? SOURCE_META.website;
                const SourceIcon = Source.icon;
                const productSlug =
                  productSlugMap.get(review.productId) || review.productId;

                return (
                  <div
                    key={review.id}
                    className="group bg-white border border-neutral-200/80 p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  >
                    {/* Top: Avatar & Name */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-full bg-amber-50 flex-shrink-0 overflow-hidden flex items-center justify-center border border-amber-100">
                        {review.customerImage ? (
                          <img
                            src={review.customerImage}
                            alt={review.customerName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-amber-700 font-bold text-lg">
                            {review.customerName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-neutral-900 text-sm truncate">
                            {review.customerName}
                          </span>
                          {review.verifiedPurchase && (
                            <BadgeCheck className="w-3.5 h-3.5 text-green-700 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                          <SourceIcon className="w-3 h-3" />
                          <span className="truncate">via {Source.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rating & Title */}
                    <Stars value={review.rating} size="w-3.5 h-3.5" />
                    {review.title && (
                      <h3 className="text-sm font-semibold text-neutral-900 mt-2 leading-tight">
                        {review.title}
                      </h3>
                    )}

                    {/* Review Text */}
                    <p className="text-sm text-neutral-600 mt-2 leading-relaxed flex-1 line-clamp-4">
                      {review.comment}
                    </p>

                    {/* Footer: Product & Date */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
                      {review.productTitle && review.productId && (
                        <Link
                          href={`/product/${productSlug}`}
                          className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full hover:bg-amber-100 transition-colors truncate max-w-[70%]"
                        >
                          {review.productTitle}
                        </Link>
                      )}
                      <span className="text-xs text-neutral-400 flex-shrink-0">
                        {new Date(review.reviewDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3 border-2 border-neutral-900 text-neutral-900 text-sm font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all rounded-xl"
                >
                  Load more reviews ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}