// src/app/(user)/category/CategoryData.ts
import { productApi } from "../../../services/productApi";
import { categoryApi } from "../../../services/categoryApi";
import { Product, Category } from "../../../types";

export interface CategoryPageData {
  products: Product[];
  categories: Category[];
  currentCategory?: Category;
}

export async function fetchCategoryData(
  slug?: string,
): Promise<CategoryPageData> {
  const [productsData, categoriesData] = await Promise.all([
    productApi.getAll(),
    categoryApi.getAllCategories(),
  ]);

  if (!slug) {
    return { products: productsData, categories: categoriesData };
  }

  const currentCategory = categoriesData.find((c) => c.slug === slug);

  // Product.category actually stores the category NAME (see admin edit/create
  // product forms: <option value={c.name}>), not the category id.
  const products = currentCategory
    ? productsData.filter(
        (p) =>
          p.category?.trim().toLowerCase() ===
          currentCategory.name.trim().toLowerCase(),
      )
    : [];

  return { products, categories: categoriesData, currentCategory };
}
