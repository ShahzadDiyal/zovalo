// src/app/(user)/HomeData.ts
import { unstable_cache } from 'next/cache';
import { productApi } from '../../../services/productApi';
import { categoryApi } from '../../../services/categoryApi';
import { Category, Product } from '../../../types';

export interface HomePageData {
  categories: Category[];
  featuredProducts: Product[];
  recentProducts: Product[];
}

export const fetchHomeData = unstable_cache(
  async (): Promise<HomePageData> => {
    try {
      const [featuredProductsRaw, recentProducts, categoriesData] = await Promise.all([
        productApi.getFeaturedProducts(4),
        productApi.getRecentProducts(4),
        categoryApi.getAllCategories(),
      ]);

      const featuredProducts =
        featuredProductsRaw.length > 0 ? featuredProductsRaw : recentProducts;

      return {
        categories: categoriesData,
        featuredProducts,
        recentProducts,
      };
    } catch (error) {
      console.error('Error fetching home data:', error);
      return {
        categories: [],
        featuredProducts: [],
        recentProducts: [],
      };
    }
  },
  ['home-data'],
  { revalidate: 120 },
);