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
  const [reviews, products] = await Promise.all([
    reviewApi.getAllPublished().catch(() => []),
    productApi.getAll().catch(() => []),
  ]);

  const productSlugMap = new Map<string, string>();
  products.forEach((product) => {
    if (product.id && product.slug) {
      productSlugMap.set(product.id, product.slug);
    }
  });

  const aggregate = {
    count: reviews.length,
    average:
      reviews.length > 0
        ? Number(
            (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
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
        productSlugMap={productSlugMap}
      />
    </>
  );
}