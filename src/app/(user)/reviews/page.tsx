// src/app/(user)/reviews/page.tsx
import { Metadata } from "next";
import { reviewApi } from "../../../services/reviewApi";
import { productApi } from "../../../services/productApi";
import { Schema } from "../../../components/SEO/Schema";
import { AllReviewsPageClient } from "../../../components/reviews/AllReviewsPageClient";

const SITE_URL = "https://royalfurnitures.store";

export const metadata: Metadata = {
  title: "Customer Reviews | Royal Furniture",
  description:
    "Read genuine reviews from Royal Furniture customers across the UK – real feedback on our sofas, dining sets, beds and more.",
  alternates: {
    canonical: "/reviews",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Customer Reviews | Royal Furniture",
    description:
      "Read genuine reviews from Royal Furniture customers across the UK.",
    type: "website",
    url: `${SITE_URL}/reviews`,
    images: [
      {
        url: `${SITE_URL}/og-reviews.jpg`,
        width: 1200,
        height: 630,
        alt: "Royal Furniture Customer Reviews",
      },
    ],
  },
};

export default async function ReviewsPage() {
  const [rawReviews, products] = await Promise.all([
    reviewApi.getAllPublished().catch(() => []),
    productApi.getAll().catch(() => []),
  ]);

  // Sanitize reviews to remove non-serializable Firestore Timestamps
  const reviews = rawReviews.map((review: any) => ({
    ...review,
    createdAt: review.createdAt?.toDate
      ? review.createdAt.toDate().toISOString()
      : typeof review.createdAt === "object"
        ? new Date(review.createdAt.seconds * 1000).toISOString()
        : String(review.createdAt || ""),
    updatedAt: review.updatedAt?.toDate
      ? review.updatedAt.toDate().toISOString()
      : typeof review.updatedAt === "object"
        ? new Date(review.updatedAt.seconds * 1000).toISOString()
        : String(review.updatedAt || ""),
    reviewDate: review.reviewDate?.toDate
      ? review.reviewDate.toDate().toISOString()
      : typeof review.reviewDate === "object"
        ? new Date(review.reviewDate.seconds * 1000).toISOString()
        : String(review.reviewDate || ""),
  }));

  // Create a plain serializable map object instead of JS Map
  const productSlugMap: Record<string, string> = {};
  products.forEach((product) => {
    if (product.id && product.slug) {
      productSlugMap[product.id] = product.slug;
    }
  });

  const aggregate = {
    count: reviews.length,
    average:
      reviews.length > 0
        ? Number(
          (
            reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) /
            reviews.length
          ).toFixed(1)
        )
        : 0,
  };

  const breadcrumbItems = [
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Reviews", url: `${SITE_URL}/reviews` },
  ];

  return (
    <>
      <Schema type="BreadcrumbList" data={{ items: breadcrumbItems }} />
      <Schema type="SiteReviews" data={{ reviews, aggregate }} />

      <AllReviewsPageClient
        initialReviews={reviews}
        aggregate={aggregate}
        productSlugMap={new Map(Object.entries(productSlugMap))}
      />
    </>
  );
}