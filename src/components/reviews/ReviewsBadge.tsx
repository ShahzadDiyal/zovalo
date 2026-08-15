// src/components/reviews/ReviewsBadge.tsx
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { reviewApi } from "../../services/reviewApi";
import { Schema } from "../SEO/Schema";
import { Stars } from "./Stars";

const getSiteAggregateCached = unstable_cache(
  async () => {
    try {
      return await reviewApi.getSiteAggregate();
    } catch (error) {
      console.error("Error fetching site review aggregate:", error);
      return { count: 0, average: 0 };
    }
  },
  ["site-review-aggregate"],
  { revalidate: 300 },
);

interface ReviewsBadgeProps {
  /** Where the badge links to. Pass null to render plain text (no link). */
  href?: string | null;
  /** Set false if this page already renders SiteReviews/Product schema elsewhere,
   *  to avoid emitting duplicate AggregateRating JSON-LD on the same page. */
  includeSchema?: boolean;
  className?: string;
}

/** Tiny "★★★★★ 4.8 (236 reviews)" widget, safe to drop into a header,
 *  footer, hero section, or anywhere else. Server component - renders with
 *  real numbers in the initial HTML so it's crawlable by search engines and
 *  AI agents, not just visible after client-side JS runs. */
export async function ReviewsBadge({
  href = "/reviews",
  includeSchema = true,
  className = "",
}: ReviewsBadgeProps = {}) {
  const { count, average } = await getSiteAggregateCached();

  if (count === 0) return null;

  const content = (
    <span
      className={`inline-flex items-center gap-1.5 text-xs sm:text-sm ${className}`}
    >
      <Stars value={average} size="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      <span className="font-bold text-neutral-900">{average.toFixed(1)}</span>
      <span className="text-neutral-400 font-medium">
        ({count.toLocaleString()} review{count === 1 ? "" : "s"})
      </span>
    </span>
  );

  return (
    <>
      {includeSchema && (
        <Schema
          type="SiteReviews"
          data={{ aggregate: { count, average }, reviews: [] }}
        />
      )}
      {href ? (
        <Link href={href} className="hover:opacity-80 transition-opacity">
          {content}
        </Link>
      ) : (
        content
      )}
    </>
  );
}