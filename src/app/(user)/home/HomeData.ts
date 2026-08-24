// src/app/(user)/HomeData.ts
import { unstable_cache } from "next/cache";
import { productApi } from "../../../services/productApi";
import { categoryApi } from "../../../services/categoryApi";
import { Category, Product } from "../../../types";

export interface HomePageData {
  categories: Category[];
  featuredProducts: Product[];
  recentProducts: Product[];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Convert Timestamps/Dates to plain strings to satisfy RSC & cache serialization
function sanitize<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (value && typeof value === "object" && "seconds" in value) {
        return new Date(value.seconds * 1000).toISOString();
      }
      return value;
    }),
  );
}

export const fetchHomeData = unstable_cache(
  async (): Promise<HomePageData> => {
    try {
      const [featuredProductsRaw, recentProductsRaw, categoriesData] =
        await Promise.all([
          productApi.getFeaturedProducts(10),
          productApi.getRecentProducts(10),
          categoryApi.getAllCategories(),
        ]);

      const shuffledFeatured = shuffleArray(featuredProductsRaw);
      const featuredProducts = shuffledFeatured.slice(0, 4);

      const shuffledRecent = shuffleArray(recentProductsRaw);
      const recentProducts = shuffledRecent.slice(0, 4);

      const finalFeatured =
        featuredProducts.length > 0
          ? featuredProducts
          : shuffleArray(recentProductsRaw).slice(0, 4);

      const finalRecent =
        recentProducts.length > 0
          ? recentProducts
          : shuffleArray(featuredProductsRaw).slice(0, 4);

      // Sanitize timestamps to plain string primitives before caching/returning
      return sanitize({
        categories: categoriesData,
        featuredProducts: finalFeatured,
        recentProducts: finalRecent,
      });
    } catch (error) {
      console.error("Error fetching home data:", error);
      return {
        categories: [],
        featuredProducts: [],
        recentProducts: [],
      };
    }
  },
  ["home-data-v1"], // Ensure cache key tag is updated
  { revalidate: 120 },
);
