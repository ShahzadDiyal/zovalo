// src/app/(user)/HomeData.ts
import { productApi } from '../../../services/productApi';
import { categoryApi } from '../../../services/categoryApi';
import { Product, Category } from '../../../types';

export interface HomePageData {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  recentProducts: Product[];
}

export async function fetchHomeData(): Promise<HomePageData> {
  try {
    const [productsData, categoriesData] = await Promise.all([
      productApi.getAll(),
      categoryApi.getAllCategories(),
    ]);
    
    // Get featured products
    const featured = productsData.filter((p) => p.featured === true);
    const featuredProducts = featured.length > 0 ? featured.slice(0, 4) : productsData.slice(0, 4);
    
    // Get recent products
    const recent = [...productsData].sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    const recentProducts = recent.slice(0, 4);
    
    return {
      products: productsData,
      categories: categoriesData,
      featuredProducts,
      recentProducts,
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      products: [],
      categories: [],
      featuredProducts: [],
      recentProducts: [],
    };
  }
}