// src/app/(user)/page.tsx
import { Suspense } from "react";
import { fetchHomeData } from "./home/HomeData";
import { HomeClient } from "./home/HomeClient";
import { HomeBlogSection } from "@/src/components/blog/HomeBlogSection";
import { HomeReviewsSection } from "@/src/components/reviews/HomeReviewsSection";


export default async function HomePage() {
  const { categories, featuredProducts, recentProducts } =
    await fetchHomeData();

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
      />

<HomeReviewsSection />
      <HomeBlogSection />
    </Suspense>
  );
}
