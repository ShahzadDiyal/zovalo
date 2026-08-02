// src/app/(user)/category/CategoryData.ts
import { productApi } from "../../../services/productApi";
import { categoryApi } from "../../../services/categoryApi";
import { Product, Category } from "../../../types";

export interface CategoryPageData {
  products: Product[];
  categories: Category[];
  currentCategory?: Category;
}

// ✅ Remove unstable_cache - fetch fresh every time
export async function fetchCategoryData(
  slug?: string,
): Promise<CategoryPageData> {
  try {
    const [productsData, categoriesData] = await Promise.all([
      productApi.getAll(),
      categoryApi.getAllCategories(),
    ]);

    if (!slug) {
      return { products: productsData, categories: categoriesData };
    }

    const currentCategory = categoriesData.find((c) => c.slug === slug);

    // Product.category stores the category NAME
    const products = currentCategory
      ? productsData.filter(
          (p) =>
            p.category?.trim().toLowerCase() ===
            currentCategory.name.trim().toLowerCase(),
        )
      : [];

    return { products, categories: categoriesData, currentCategory };
  } catch (error) {
    console.error("Error fetching category data:", error);
    return { products: [], categories: [], currentCategory: undefined };
  }
}