"use client";

import { useRef } from "react";
import type { ElementType } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  ArrowRight,
  MessageCircle,
  ThumbsUp,
  Camera,
  Globe,
} from "lucide-react";
import { Stars } from "./Stars";
import { Review } from "../../types";

type SourceMeta = { label: string; icon: ElementType };

const SOURCE_META: Record<Review["source"], SourceMeta> = {
  whatsapp: { label: "WhatsApp", icon: MessageCircle },
  facebook: { label: "Facebook", icon: ThumbsUp },
  instagram: { label: "Instagram", icon: Camera },
  google: { label: "Google", icon: Globe },
  website: { label: "royalfurnitures.store", icon: Globe },
};

interface ReviewsCarouselClientProps {
  reviews: Review[];
  aggregate: { count: number; average: number };
  viewAllHref?: string;
  title?: string;
  subtitle?: string;
  productSlugMap?: Map<string, string>; // productId -> slug
}

export function ReviewsCarouselClient({
  reviews,
  aggregate,
  viewAllHref = "/reviews",
  title = "Loved by Our Customers",
  subtitle = "Real reviews from real Royal Furniture customers across the UK",
  productSlugMap = new Map(),
}: ReviewsCarouselClientProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const amount = 320;
    trackRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 md:py-24 bg-gradient-to-b from-amber-50/30 to-white border-t border-amber-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100/80 px-3.5 py-1 rounded-full mb-3">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-800">
                ★ Real Reviews
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-neutral-900">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 mt-2 font-light max-w-xl">
              {subtitle}
            </p>
            {aggregate.count > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <Stars value={aggregate.average} size="w-4 h-4" />
                <span className="text-sm font-bold text-neutral-900">
                  {aggregate.average.toFixed(1)}
                </span>
                <span className="text-xs text-neutral-500">
                  from {aggregate.count.toLocaleString()} review
                  {aggregate.count === 1 ? "" : "s"}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll reviews left"
              className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-amber-50 hover:border-amber-300 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll reviews right"
              className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-amber-50 hover:border-amber-300 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              href={viewAllHref}
              className="ml-2 hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 hover:text-amber-900 transition-colors"
            >
              See all reviews <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Carousel track */}
        <div
          ref={trackRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.map((review) => {
            const Source = SOURCE_META[review.source] ?? SOURCE_META.website;
            const SourceIcon = Source.icon;

            // Priority: review.productSlug > productSlugMap lookup by productId
            const productSlug =
              (review as any).productSlug ||
              (review.productId ? productSlugMap.get(review.productId) : null);

            return (
              <div
                key={review.id}
                className="snap-start flex-shrink-0 w-[280px] sm:w-[340px] bg-white rounded-2xl border border-neutral-200/80 transition-all duration-300 p-5 sm:p-6 flex flex-col group"
              >
                {/* User info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex-shrink-0 overflow-hidden flex items-center justify-center border border-amber-100">
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
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-neutral-900 text-sm truncate">
                        {review.customerName}
                      </span>
                      {review.verifiedPurchase && (
                        <BadgeCheck className="w-3.5 h-3.5 text-green-700 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-neutral-400 mt-0.5">
                      <SourceIcon className="w-3 h-3" /> via {Source.label}
                    </div>
                  </div>
                </div>

                <Stars value={review.rating} size="w-3.5 h-3.5" />

                {review.title && (
                  <p className="text-sm font-semibold text-neutral-900 mt-2">
                    {review.title}
                  </p>
                )}
                <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed line-clamp-4 flex-1">
                  {review.comment}
                </p>

                {/* Product link using Slug */}
                {review.productTitle && productSlug && (
                  <Link
                    href={`/product/${productSlug}`}
                    className="mt-3 inline-flex items-center gap-1 w-fit text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 hover:text-amber-800 transition-colors group-hover:shadow-sm"
                  >
                    {review.productTitle}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
                {review.productTitle && !productSlug && (
                  <span className="mt-3 inline-block w-fit text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg">
                    {review.productTitle}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <Link
          href={viewAllHref}
          className="sm:hidden mt-6 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 hover:text-amber-900 transition-colors"
        >
          See all reviews <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
