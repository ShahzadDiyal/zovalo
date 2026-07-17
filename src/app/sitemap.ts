import type { MetadataRoute } from "next";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";

const SITE_URL = "https://royalfurnitures.store";

// Re-generate this sitemap at most once per hour so newly added
// products/categories show up without needing a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/shipping`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/returns`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const products = await productService.getProducts();
    productRoutes = products.map((product) => ({
      url: `${SITE_URL}/product/${product.id}`,
      lastModified: product.updatedAt?.toDate
        ? product.updatedAt.toDate()
        : product.createdAt?.toDate
          ? product.createdAt.toDate()
          : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("sitemap: failed to load products", error);
  }

  try {
    const categories = await categoryService.getCategories();
    categoryRoutes = categories.map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("sitemap: failed to load categories", error);
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
