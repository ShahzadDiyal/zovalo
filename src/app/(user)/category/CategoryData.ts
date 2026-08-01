// src/app/(user)/category/CategoryData.ts
import { unstable_cache } from "next/cache";
import { productApi } from "../../../services/productApi";
import { categoryApi } from "../../../services/categoryApi";
import { Product, Category } from "../../../types";

export interface CategoryPageData {
  products: Product[];
  categories: Category[];
  currentCategory?: Category;
}

async function fetchCategoryDataUncached(
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

export async function fetchCategoryData(
  slug?: string,
): Promise<CategoryPageData> {
  const cached = unstable_cache(
    () => fetchCategoryDataUncached(slug),
    ["category-data", slug || "all"],
    { revalidate: 120 },
  );
  return cached();
}