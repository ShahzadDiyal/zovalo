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

  /** All published reviews (any product), newest first - powers the
   *  site-wide carousel, the reviews badge, and the public /reviews page. */
  async getAllPublished(): Promise<Review[]> {
    // Use a where clause to only fetch published reviews
    const constraints = [where("status", "==", "published")];
    const reviews = await this.getWithConstraints(constraints);
    return reviews.sort((a, b) => {
      const aDate = a.createdAt?.toDate?.() ?? new Date(a.reviewDate ?? 0);
      const bDate = b.createdAt?.toDate?.() ?? new Date(b.reviewDate ?? 0);
      return bDate.getTime() - aDate.getTime();
    });
  }

  /** Latest N published reviews across all products - for the homepage carousel. */
  async getLatest(count: number = 10): Promise<Review[]> {
    const all = await this.getAllPublished();
    return all.slice(0, count);
  }

  /** Site-wide total review count + average rating, e.g. for a small
   *  "★★★★★ 4.8 (236 reviews)" badge anywhere on the site. */
  async getSiteAggregate(): Promise<{ count: number; average: number }> {
    const published = await this.getAllPublished();
    const count = published.length;
    const average =
      count > 0
        ? Number(
            (
              published.reduce((sum, r) => sum + (r.rating || 0), 0) / count
            ).toFixed(1),
          )
        : 0;
    return { count, average };
  }

  /** Published reviews belonging to OTHER products, newest first. Used to
   *  top up a product's review section when it doesn't have (enough)
   *  reviews of its own. */
  async getOtherProductReviews(
    excludeProductId: string,
    count: number,
  ): Promise<Review[]> {
    const all = await this.getAllPublished();
    return all.filter((r) => r.productId !== excludeProductId).slice(0, count);
  }

  /**
   * Reviews to display on a single product page: this product's own
   * published reviews, plus - if it has fewer than `target` - enough
   * reviews from other products to pad the section up to `target` items.
   * The filler reviews are for display only (clearly labelled in the UI by
   * ProductReviews.tsx) and are never included in that product's
   * Product/Review schema - only a product's own reviews are safe to mark
   * up against it (see product page.tsx + Schema.tsx "Product" case).
   */
  async getDisplayReviewsForProduct(
    productId: string,
    target: number = 10,
  ): Promise<{ ownReviews: Review[]; fillerReviews: Review[] }> {
    const ownReviews = await this.getApprovedByProductId(productId);
    const needed = Math.max(0, target - ownReviews.length);
    const fillerReviews =
      needed > 0 ? await this.getOtherProductReviews(productId, needed) : [];
    return { ownReviews, fillerReviews };
  }
}

export const reviewApi = new ReviewApiService();
