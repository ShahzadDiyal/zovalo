"use client";
import React, { useEffect, useState } from "react";
import {
  Star,
  BadgeCheck,
  MessageCircle,
  ThumbsUp,
  Camera,
  Globe,
} from "lucide-react";
import { reviewApi } from "../../services/reviewApi";
import { Review, Product } from "../../types";

const SOURCE_META: Record<Review["source"], { label: string; icon: React.ElementType }> = {
  whatsapp: { label: "via WhatsApp", icon: MessageCircle },
  facebook: { label: "via Facebook", icon: ThumbsUp },
  instagram: { label: "via Instagram", icon: Camera },
  google: { label: "via Google", icon: Globe },
  website: { label: "via royalfurnitures.store", icon: Globe },
};

function Stars({ value, size = "w-4 h-4" }: { value: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${
            n <= Math.round(value) ? "fill-amber-500 text-amber-500" : "text-neutral-200"
          }`}
        />
      ))}
    </div>
  );
}

interface ProductReviewsProps {
  product: Product;
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await reviewApi.getApprovedByProductId(product.id);
        if (active) setReviews(data);
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [product.id]);

  const reviewCount = product.reviewCount ?? reviews.length;
  const avgRating =
    product.rating ??
    (reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0);

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
    return { star, count, pct };
  });

  const handleWriteReview = () => {
    const message = `Hi Royal Furniture,\n\nI'd like to share a review for:\n${product.title}\nLink: https://royalfurnitures.store/product/${product.slug}\n\nMy review: `;
    window.open(
      `https://wa.me/447529661726?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3 py-8">
        <div className="h-6 w-48 bg-neutral-100 rounded" />
        <div className="h-24 w-full bg-neutral-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div id="reviews" className="py-8 sm:py-10 border-t border-neutral-200/80">
      <h2 className="text-xl sm:text-2xl font-serif text-neutral-900 mb-6">
        Customer Reviews
      </h2>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-8">
        {/* Summary */}
        <div className="flex flex-col items-center md:items-start md:w-56 flex-shrink-0 text-center md:text-left">
          <div className="text-4xl font-serif text-neutral-900">
            {avgRating ? avgRating.toFixed(1) : "—"}
          </div>
          <Stars value={avgRating} size="w-5 h-5" />
          <p className="text-xs text-neutral-500 mt-1">
            Based on {reviewCount} review{reviewCount === 1 ? "" : "s"}
          </p>
          <button
            onClick={handleWriteReview}
            className="mt-4 w-full md:w-auto flex items-center justify-center gap-2 bg-[#00491b] hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Send us your review
          </button>
        </div>

        {/* Breakdown bars */}
        {reviews.length > 0 && (
          <div className="flex-1 space-y-1.5 max-w-md">
            {breakdown.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="w-8 flex-shrink-0">{star} star</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 flex-shrink-0 text-right">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      {reviews.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No reviews yet — be the first to share your experience with this piece.
        </p>
      ) : (
        <div className="space-y-5">
          {reviews.slice(0, visibleCount).map((review) => {
            const Source = SOURCE_META[review.source] ?? SOURCE_META.website;
            const SourceIcon = Source.icon;
            return (
              <div
                key={review.id}
                className="border border-neutral-200/80 rounded-2xl p-4 sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {review.customerImage ? (
                      <img
                        src={review.customerImage}
                        alt={review.customerName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-amber-700 font-bold text-sm">
                        {review.customerName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-semibold text-neutral-900 text-sm">
                        {review.customerName}
                      </span>
                      {review.verifiedPurchase && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-green-700">
                          <BadgeCheck className="w-3.5 h-3.5" /> Verified
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                        <SourceIcon className="w-3 h-3" /> {Source.label}
                      </span>
                    </div>
                    <Stars value={review.rating} size="w-3.5 h-3.5" />
                    {review.title && (
                      <p className="text-sm font-semibold text-neutral-900 mt-1.5">
                        {review.title}
                      </p>
                    )}
                    <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                      {review.comment}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-2">
                      {new Date(review.reviewDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {visibleCount < reviews.length && (
            <button
              onClick={() => setVisibleCount((c) => c + 4)}
              className="text-xs font-bold uppercase tracking-widest text-amber-700 hover:text-amber-900 transition-colors"
            >
              Show more reviews
            </button>
          )}
        </div>
      )}
    </div>
  );
}
