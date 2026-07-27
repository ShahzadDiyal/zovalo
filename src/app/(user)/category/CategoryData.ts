// src/app/(user)/category/CategoryData.ts
import { productApi } from "../../../services/productApi";
import { categoryApi } from "../../../services/categoryApi";
import { Product, Category } from "../../../types";

export interface CategoryPageData {
  products: Product[];
  categories: Category[];
}

export async function fetchCategoryData(slug?: string): Promise<CategoryPageData> {
  const [productsData, categoriesData] = await Promise.all([
    productApi.getAll(),
    categoryApi.getAllCategories(),
  ]);
  const products = slug
    ? productsData.filter((p) => p.category?.toLowerCase().replace(/ /g, "-") === slug)
    : productsData;
  return { products, categories: categoriesData };
}