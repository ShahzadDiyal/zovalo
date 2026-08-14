// services/reviewApi.ts
import { where } from "firebase/firestore";
import { BaseApiService } from "./api";
import { Review } from "../types";
import { productApi } from "./productApi";

class ReviewApiService extends BaseApiService<Review> {
  constructor() {
    super("reviews");
  }

  /** All reviews for the admin table, newest first. */
  async getAllReviews(): Promise<Review[]> {
    const reviews = await this.getAll();
    return reviews.sort((a, b) => {
      const aDate = a.createdAt?.toDate?.() ?? new Date(a.reviewDate ?? 0);
      const bDate = b.createdAt?.toDate?.() ?? new Date(b.reviewDate ?? 0);
      return bDate.getTime() - aDate.getTime();
    });
  }

  /** All reviews (any status) for one product - used in the admin panel. */
  async getByProductId(productId: string): Promise<Review[]> {
    const constraints = [where("productId", "==", productId)];
    const reviews = await this.getWithConstraints(constraints);
    return reviews.sort((a, b) => {
      const aDate = a.createdAt?.toDate?.() ?? new Date(a.reviewDate ?? 0);
      const bDate = b.createdAt?.toDate?.() ?? new Date(b.reviewDate ?? 0);
      return bDate.getTime() - aDate.getTime();
    });
  }

  /** Only published reviews for one product - used on the storefront + schema. */
  async getApprovedByProductId(productId: string): Promise<Review[]> {
    const reviews = await this.getByProductId(productId);
    return reviews.filter((r) => r.status === "published");
  }

  async createReview(data: Omit<Review, "id">): Promise<string> {
    const id = await this.create(data);
    await this.recalcProductRating(data.productId);
    return id;
  }

  async updateReview(id: string, data: Partial<Review>): Promise<void> {
    const existing = await this.getById(id);
    await this.update(id, { ...data, updatedAt: new Date() } as any);
    const productId = data.productId || existing?.productId;
    if (productId) await this.recalcProductRating(productId);
  }

  async deleteReview(id: string): Promise<void> {
    const existing = await this.getById(id);
    await this.delete(id);
    if (existing?.productId) await this.recalcProductRating(existing.productId);
  }

  /**
   * Recomputes the average rating + count for a product from its published
   * reviews and writes them onto the product document, so:
   *  - src/components/SEO/Schema.tsx can output an accurate AggregateRating
   *  - ProductCard / storefront can show stars without extra reads
   */
  async recalcProductRating(productId: string): Promise<void> {
    const published = await this.getApprovedByProductId(productId);
    const reviewCount = published.length;
    const rating =
      reviewCount > 0
        ? Number(
            (
              published.reduce((sum, r) => sum + (r.rating || 0), 0) /
              reviewCount
            ).toFixed(1),
          )
        : 0;

    await productApi.update(productId, {
      rating: reviewCount > 0 ? rating : undefined,
      reviewCount,
    } as any);
  }
}

export const reviewApi = new ReviewApiService();
