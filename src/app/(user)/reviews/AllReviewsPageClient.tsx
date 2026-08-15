// src/components/reviews/AllReviewsPageClient.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  Star,
  BadgeCheck,
  MessageCircle,
  ThumbsUp,
  Camera,
  Globe,
  Search,
  Filter,
} from "lucide-react";
import { Review } from "../../../types";
import { Stars } from "@/src/components/reviews/Stars";

const SOURCE_META: Record<
  Review["source"],
  { label: string; icon: React.ElementType }
> = {
  whatsapp: { label: "WhatsApp", icon: MessageCircle },
  facebook: { label: "Facebook", icon: ThumbsUp },
  instagram: { label: "Instagram", icon: Camera },
  google: { label: "Google", icon: Globe },
  website: { label: "Website", icon: Globe },
};

interface AllReviewsPageClientProps {
  initialReviews: Review[];
  aggregate: { count: number; average: number };
}

export function AllReviewsPageClient({
  initialReviews,
  aggregate,
}: AllReviewsPageClientProps) {
  const [reviews] = useState(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter reviews
  const filtered = useMemo(() => {
    let result = reviews;

    // Search by name, comment, or product title
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          (r.productTitle || "").toLowerCase().includes(q),
      );
    }

    // Filter by rating
    if (ratingFilter !== null) {
      result = result.filter((r) => Math.round(r.rating) === ratingFilter);
    }

    return result;
  }, [reviews, searchQuery, ratingFilter]);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = () => setVisibleCount((prev) => prev + 6);

  const handleWriteReview = () => {
    const message =
      "Hi Royal Furniture,\n\nI'd like to share a review for my recent purchase.\nMy review: ";
    window.open(
      `https://wa.me/447529661726?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  if (reviews.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-8">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-serif text-neutral-900 mb-2">
            No reviews yet
          </h3>
          <p className="text-neutral-500 max-w-md mx-auto">
            We haven't received any reviews for this product yet. Be the first
            to share your experience!
          </p>
          <button
            onClick={handleWriteReview}
            className="mt-4 inline-flex items-center gap-2 bg-[#25d366] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#128C7E] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Write a review on WhatsApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-serif font-bold text-neutral-900">
              {aggregate.average ? aggregate.average.toFixed(1) : "—"}
            </span>
            <Stars value={aggregate.average || 0} size="w-5 h-5" />
            <span className="text-sm text-neutral-500">
              ({aggregate.count} reviews)
            </span>
          </div>
          <button
            onClick={handleWriteReview}
            className="mt-2 inline-flex items-center gap-2 bg-[#25d366] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#128C7E] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Send your review on WhatsApp
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200/80 py-2 pl-9 pr-3 text-sm rounded-xl outline-none focus:border-amber-500"
            />
          </div>
          <select
            value={ratingFilter ?? ""}
            onChange={(e) =>
              setRatingFilter(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full sm:w-auto bg-white border border-neutral-200/80 py-2 px-3 text-sm rounded-xl outline-none focus:border-amber-500"
          >
            <option value="">All ratings</option>
            <option value="5">5 ★</option>
            <option value="4">4 ★ & up</option>
            <option value="3">3 ★ & up</option>
            <option value="2">2 ★ & up</option>
            <option value="1">1 ★ & up</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white border border-neutral-200/80 rounded-2xl">
          <p className="text-neutral-500">No reviews match your filters.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {displayed.map((review) => {
            const Source = SOURCE_META[review.source] ?? SOURCE_META.website;
            const SourceIcon = Source.icon;
            return (
              <div
                key={review.id}
                className="bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
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
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-semibold text-neutral-900 text-sm">
                        {review.customerName}
                      </span>
                      {review.verifiedPurchase && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-green-700">
                          <BadgeCheck className="w-3.5 h-3.5" /> Verified
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                        <SourceIcon className="w-3.5 h-3.5" /> via{" "}
                        {Source.label}
                      </span>
                    </div>
                    <Stars value={review.rating} size="w-4 h-4" />
                    {review.title && (
                      <p className="text-sm font-semibold text-neutral-900 mt-1.5">
                        {review.title}
                      </p>
                    )}
                    <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed">
                      {review.comment}
                    </p>
                    {review.productTitle && (
                      <p className="text-xs text-amber-700 mt-2 bg-amber-50 px-2.5 py-1 rounded-full inline-block">
                        {review.productTitle}
                      </p>
                    )}
                    <p className="text-xs text-neutral-400 mt-3">
                      {new Date(review.reviewDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {hasMore && (
            <div className="text-center mt-6">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2.5 border border-neutral-200/80 text-sm font-bold uppercase tracking-widest text-neutral-600 hover:bg-neutral-50 rounded-xl transition-colors"
              >
                Load more reviews ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
