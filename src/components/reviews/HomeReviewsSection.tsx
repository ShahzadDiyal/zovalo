// src/components/reviews/HomeReviewsSection.tsx
import { unstable_cache } from "next/cache";
import { reviewApi } from "../../services/reviewApi";
import { Schema } from "../SEO/Schema";
import { ReviewsCarouselClient } from "./ReviewsCarouselClient";

const getLatestReviewsCached = unstable_cache(
  async () => {
    try {
      const [reviews, aggregate] = await Promise.all([
        reviewApi.getLatest(10),
        reviewApi.getSiteAggregate(),
      ]);
      return { reviews, aggregate };
    } catch (error) {
      console.error("Error fetching latest site reviews:", error);
      return { reviews: [], aggregate: { count: 0, average: 0 } };
    }
  },
  ["home-latest-reviews"],
  { revalidate: 300 },
);

interface HomeReviewsSectionProps {
  title?: string;
  subtitle?: string;
}

/** Drop this anywhere (home page, landing pages, etc.) to show the latest
 *  10 published reviews in a carousel, with a "See all reviews" link to
 *  /reviews and JSON-LD so search engines / AI agents can read them. */
export async function HomeReviewsSection({
  title,
  subtitle,
}: HomeReviewsSectionProps = {}) {
  const { reviews, aggregate } = await getLatestReviewsCached();

  if (reviews.length === 0) return null;

  return (
    <>
      <Schema type="SiteReviews" data={{ reviews, aggregate }} />
      <ReviewsCarouselClient
        reviews={reviews}
        aggregate={aggregate}
        title={title}
        subtitle={subtitle}
      />
    </>
  );
}
