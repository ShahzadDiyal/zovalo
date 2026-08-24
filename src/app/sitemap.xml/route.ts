// src/app/sitemap.xml/route.ts
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { productApi } from "../../services/productApi";
import { categoryApi } from "@/src/services/categoryApi";
import { blogPostApi } from "../../services/blogPostApi";
import { cityPageService } from "../../services/cityPageService";

export const dynamic = "force-dynamic";

interface Product {
  id: string;
  slug: string;
  updatedAt?: any;
}

interface Category {
  slug: string;
}

function formatDate(dateValue: any): string {
  if (!dateValue) return new Date().toISOString();

  if (typeof dateValue?.toDate === "function") {
    return dateValue.toDate().toISOString();
  }

  const seconds = dateValue?._seconds ?? dateValue?.seconds;
  if (typeof seconds === "number") {
    return new Date(seconds * 1000).toISOString();
  }

  const parsed = new Date(dateValue);
  return isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString();
}

const getSitemapData = unstable_cache(
  async () => {
    const [blogPostsRes, citiesRes, productsRes, categoriesRes] =
      await Promise.allSettled([
        blogPostApi.getPublished(),
        cityPageService.getPublishedCities(),
        productApi.getAll(),
        categoryApi.getAllCategories(),
      ]);

    return {
      blogPosts: blogPostsRes.status === "fulfilled" ? blogPostsRes.value : [],
      cities: citiesRes.status === "fulfilled" ? citiesRes.value : [],
      products: productsRes.status === "fulfilled" ? productsRes.value : [],
      categories:
        categoriesRes.status === "fulfilled" ? categoriesRes.value : [],
    };
  },
  ["sitemap-data-clean-v2"],
  { revalidate: 3600 },
);

function escapeXml(value: string): string {
  if (!value) return "";
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function dedupeBySlug<T extends { slug?: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    const slug = item.slug?.trim();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    result.push(item);
  }
  return result;
}

export async function GET() {
  const baseUrl = "https://royalfurnitures.store";
  const {
    blogPosts: rawBlogPosts,
    cities: rawCities,
    products: rawProducts,
    categories: rawCategories,
  } = await getSitemapData();

  const blogPosts = dedupeBySlug(rawBlogPosts);
  const cities = dedupeBySlug(rawCities);
  const products = dedupeBySlug(rawProducts);
  const categories = dedupeBySlug(rawCategories);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/shop</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/collections</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/locations</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/shipping</loc>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/returns</loc>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/reviews</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  ${
    blogPosts.length > 0
      ? blogPosts
          .map(
            (post) => `
  <url>
    <loc>${baseUrl}/blog/${escapeXml(post.slug)}</loc>
    <lastmod>${formatDate(post.updatedAt || post.publishedAt)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`,
          )
          .join("")
      : ""
  }

  ${
    cities.length > 0
      ? cities
          .map(
            (city) => `
  <url>
    <loc>${baseUrl}/locations/${escapeXml(city.slug)}</loc>
    <lastmod>${formatDate(city.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`,
          )
          .join("")
      : ""
  }

  ${
    products.length > 0
      ? products
          .map(
            (product) => `
  <url>
    <loc>${baseUrl}/product/${escapeXml(product.slug)}</loc>
    <lastmod>${formatDate(product.updatedAt)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`,
          )
          .join("")
      : ""
  }

  ${
    categories.length > 0
      ? categories
          .map(
            (category) => `
  <url>
    <loc>${baseUrl}/category/${escapeXml(category.slug)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`,
          )
          .join("")
      : ""
  }
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
