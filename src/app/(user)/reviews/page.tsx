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
  },
};

export default async function ReviewsPage() {
  // Fetch reviews and products in parallel
  const [reviews, products] = await Promise.all([
    reviewApi.getAllPublished().catch(() => []),
    productApi.getAll().catch(() => []),
  ]);

  // Create a map of product ID -> slug
  const productSlugMap = new Map<string, string>();
  products.forEach((product) => {
    if (product.id && product.slug) {
      productSlugMap.set(product.id, product.slug);
    }
  });

  // Aggregate
  const aggregate = {
    count: reviews.length,
    average:
      reviews.length > 0
        ? Number(
            (
              reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
              reviews.length
            ).toFixed(1),
          )
        : 0,
  };

  console.log(`✅ ReviewsPage: ${reviews.length} reviews loaded`);

  const breadcrumbItems = [
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Reviews", url: `${SITE_URL}/reviews` },
  ];

  return (
    <>
      <Schema type="BreadcrumbList" data={{ items: breadcrumbItems }} />
      <Schema type="SiteReviews" data={{ reviews, aggregate }} />

      <div className="bg-gradient-to-b from-amber-50/40 to-white border-b border-neutral-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-3">
            Customer Reviews
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 max-w-xl mx-auto font-light">
            Genuine feedback from Royal Furniture customers across the UK,
            shared straight from WhatsApp, Facebook, Instagram and Google.
          </p>
        </div>
      </div>

      <AllReviewsPageClient
        initialReviews={reviews}
        aggregate={aggregate}
        productSlugMap={productSlugMap}
      />
    </>
  );
}
