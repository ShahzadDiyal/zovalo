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

// Fisher-Yates shuffle function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const fetchHomeData = unstable_cache(
  async (): Promise<HomePageData> => {
    try {
      // Fetch more products than needed for better randomization
      const [featuredProductsRaw, recentProductsRaw, categoriesData] =
        await Promise.all([
          productApi.getFeaturedProducts(10), // Fetch 10 featured products
          productApi.getRecentProducts(10), // Fetch 10 recent products
          categoryApi.getAllCategories(),
        ]);

      // Shuffle and pick 4 random featured products
      const shuffledFeatured = shuffleArray(featuredProductsRaw);
      const featuredProducts = shuffledFeatured.slice(0, 4);

      // Shuffle and pick 4 random recent products
      const shuffledRecent = shuffleArray(recentProductsRaw);
      const recentProducts = shuffledRecent.slice(0, 4);

      // Fallback: If no featured products, use recent products
      const finalFeatured =
        featuredProducts.length > 0
          ? featuredProducts
          : shuffleArray(recentProductsRaw).slice(0, 4);

      // Fallback: If no recent products, use featured products
      const finalRecent =
        recentProducts.length > 0
          ? recentProducts
          : shuffleArray(featuredProductsRaw).slice(0, 4);

      return {
        categories: categoriesData,
        featuredProducts: finalFeatured,
        recentProducts: finalRecent,
      };
    } catch (error) {
      console.error("Error fetching home data:", error);
      return {
        categories: [],
        featuredProducts: [],
        recentProducts: [],
      };
    }
  },
  ["home-data"],
  { revalidate: 120 },
);
