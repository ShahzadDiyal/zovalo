// services/productApi.ts
import { query, where, orderBy, limit } from "firebase/firestore";
import { BaseApiService } from "./api";
import { Product } from "../types";

class ProductApiService extends BaseApiService<Product> {
  constructor() {
    super("products");
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const constraints = [
      where("featured", "==", true),
      orderBy("createdAt", "desc"),
    ];
    return this.getWithConstraints(constraints);
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const constraints = [where("slug", "==", slug)];
    const products = await this.getWithConstraints(constraints);
    return products[0] || null;
  }

  async updateStock(productId: string, newStock: number): Promise<void> {
    await this.update(productId, { stock: newStock });
  }
}

export const productApi = new ProductApiService();
