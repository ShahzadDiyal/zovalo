// src/app/(user)/category/CategoryData.ts
import { productApi } from "../../../services/productApi";
import { categoryApi } from "../../../services/categoryApi";
import { Product, Category } from "../../../types";

export interface CategoryPageData {
  products: Product[];
  categories: Category[];
}

export async function fetchCategoryData(): Promise<CategoryPageData> {
  try {
    const [productsData, categoriesData] = await Promise.all([
      productApi.getAll(),
      categoryApi.getAllCategories(),
    ]);

    return {
      products: productsData,
      categories: categoriesData,
    };
  } catch (error) {
    console.error("Error fetching category data:", error);
    return {
      products: [],
      categories: [],
    };
  }
}
