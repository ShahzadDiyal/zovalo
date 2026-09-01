import { Suspense } from "react";
import { Metadata } from "next";
import { fetchHomeData } from "./home/HomeData";
import { HomeClient } from "./home/HomeClient";
import { HomeBlogSection } from "@/src/components/blog/HomeBlogSection";
import { HomeReviewsSection } from "@/src/components/reviews/HomeReviewsSection";
import { reviewApi } from "../../services/reviewApi";

const SITE_URL = "https://royalfurnitures.store";

export const metadata: Metadata = {
  title: "Royal Furniture - Quality Sofas, Beds & Wardrobes | Cash on Delivery",
  description:
    "Shop premium furniture including sofas, beds, dining sets, and wardrobes. Fast delivery across the UK with Cash on Delivery options. Trusted since 2020.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Royal Furniture - Quality Sofas, Beds & Wardrobes | Cash on Delivery",
    description:
      "Shop premium furniture including sofas, beds, dining sets, and wardrobes. Fast delivery across the UK with Cash on Delivery options.",
    url: SITE_URL,
    type: "website",
    siteName: "Royal Furniture",
    locale: "en_GB",
    images: [
      {
        url: `${SITE_URL}/Royal-furnitures-logo.png`,
        width: 1200,
        height: 630,
        alt: "Royal Furniture - Premium Quality Furniture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Furniture - Quality Sofas, Beds & Wardrobes | Cash on Delivery",
    description:
      "Shop premium furniture including sofas, beds, dining sets, and wardrobes. Fast delivery across the UK.",
    images: [`${SITE_URL}/Royal-furnitures-logo.png`],
  },
};

export default async function HomePage() {
  const { categories, featuredProducts, recentProducts } =
    await fetchHomeData();

  const aggregate = await reviewApi.getSiteAggregate().catch(() => ({
    count: 0,
    average: 0,
  }));

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      }
    >
      <HomeClient
        initialCategories={categories}
        initialFeaturedProducts={featuredProducts}
        initialRecentProducts={recentProducts}
        aggregate={aggregate}
      />
      <HomeReviewsSection />
      <HomeBlogSection />
    </Suspense>
  );
}