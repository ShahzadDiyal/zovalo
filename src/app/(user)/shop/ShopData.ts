// src/app/(user)/shop/ShopData.ts
import { productApi } from "../../../services/productApi";
import { categoryApi } from "../../../services/categoryApi";
import { Product, Category } from "../../../types";

export interface ShopData {
  products: Product[];
  categories: Category[];
}

export async function fetchShopData(): Promise<ShopData> {
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
    console.error("Error fetching shop data:", error);
    return {
      products: [],
      categories: [],
    };
  }
}
