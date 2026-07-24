// src/services/relatedProductsService.ts
import { Product } from "../types";
import { productApi } from "./productApi";

class RelatedProductsService {
  // Get related products based on product data
  async getRelatedProducts(
    currentProduct: Product,
    limit: number = 4,
  ): Promise<Product[]> {
    try {
      // Get all products
      const allProducts = await productApi.getAll();

      // Filter out the current product
      const otherProducts = allProducts.filter(
        (p) => p.id !== currentProduct.id,
      );

      // Score each product based on relevance
      const scoredProducts = otherProducts.map((product) => ({
        product,
        score: this.calculateRelevanceScore(currentProduct, product),
      }));

      // Sort by score (highest first) and get top results
      const sorted = scoredProducts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item) => item.product);

      // If we don't have enough related products, fill with random products
      if (sorted.length < limit) {
        const remaining = otherProducts
          .filter((p) => !sorted.some((s) => s.id === p.id))
          .slice(0, limit - sorted.length);
        return [...sorted, ...remaining];
      }

      return sorted;
    } catch (error) {
      console.error("Error fetching related products:", error);
      return [];
    }
  }

  // Calculate relevance score between two products
  private calculateRelevanceScore(current: Product, other: Product): number {
    let score = 0;

    // 1. Same category (highest weight)
    if (current.category === other.category) {
      score += 30;
    }

    // 2. Shared tags
    if (current.tags && other.tags) {
      const sharedTags = current.tags.filter((tag) =>
        other.tags?.includes(tag),
      );
      score += sharedTags.length * 10;
    }

    // 3. Same seater count
    if (current.seaterCount && other.seaterCount) {
      const sharedSeaters = current.seaterCount.filter((seater) =>
        other.seaterCount?.includes(seater),
      );
      score += sharedSeaters.length * 5;
    }

    // 4. Same colors
    if (current.colors && other.colors) {
      const sharedColors = current.colors.filter((color) =>
        other.colors?.includes(color),
      );
      score += sharedColors.length * 3;
    }

    // 5. Price similarity (closer prices get higher score)
    const priceDiff = Math.abs(current.price - other.price);
    const maxPrice = Math.max(current.price, other.price);
    const priceSimilarity = 1 - priceDiff / maxPrice;
    score += priceSimilarity * 5;

    // 6. Both are featured
    if (current.featured && other.featured) {
      score += 5;
    }

    return score;
  }

  // Get products by category (simple fallback)
  async getProductsByCategory(
    category: string,
    limit: number = 4,
  ): Promise<Product[]> {
    try {
      const allProducts = await productApi.getAll();
      return allProducts.filter((p) => p.category === category).slice(0, limit);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  }

  // Get random products (fallback)
  async getRandomProducts(
    limit: number = 4,
    excludeId?: string,
  ): Promise<Product[]> {
    try {
      const allProducts = await productApi.getAll();
      const filtered = excludeId
        ? allProducts.filter((p) => p.id !== excludeId)
        : allProducts;
      const shuffled = filtered.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error("Error fetching random products:", error);
      return [];
    }
  }
}

export const relatedProductsService = new RelatedProductsService();
