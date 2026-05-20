// services/categoryApi.ts
import { query, orderBy } from "firebase/firestore";
import { BaseApiService } from "./api";
import { Category } from "../types";

class CategoryApiService extends BaseApiService<Category> {
  constructor() {
    super("categories");
  }

  async getAllCategories(): Promise<Category[]> {
    const constraints = [orderBy("name", "asc")];
    return this.getWithConstraints(constraints);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const categories = await this.getAllCategories();
    return categories.find((cat) => cat.slug === slug) || null;
  }
}

export const categoryApi = new CategoryApiService();
