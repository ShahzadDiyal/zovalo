// src/app/sitemap.xml/route.ts
import { NextResponse } from "next/server";
import { productApi } from "../../services/productApi";
import { categoryApi } from "@/src/services/categoryApi";
import { blogPostApi } from "../../services/blogPostApi";
import { cityPageService } from "../../services/cityPageService";

interface Product {
  id: string;
  slug: string;
  updatedAt?: string;
}

interface Category {
  slug: string;
}

export async function GET() {
  const baseUrl = "https://royalfurnitures.store";

  // Fetch data with individual error handling
  let blogPosts: any[] = [];
  let cities: any[] = [];
  let products: Product[] = [];
  let categories: Category[] = [];

  // Try to fetch blog posts
  try {
    blogPosts = await blogPostApi.getAll();
    console.log(`✅ Fetched ${blogPosts.length} blog posts for sitemap`);
  } catch (error) {
    console.error("❌ Error fetching blog posts for sitemap:", error);
    // Continue with empty array - build won't fail
  }

  // Try to fetch cities
  try {
    cities = await cityPageService.getPublishedCities();
    console.log(`✅ Fetched ${cities.length} cities for sitemap`);
  } catch (error) {
    console.error("❌ Error fetching cities for sitemap:", error);
    // Continue with empty array
  }

  // Try to fetch products
  try {
    products = await productApi.getAll();
    console.log(`✅ Fetched ${products.length} products for sitemap`);
  } catch (error) {
    console.error("❌ Error fetching products for sitemap:", error);
  }

  // Try to fetch categories
  try {
    categories = await categoryApi.getAllCategories();
    console.log(`✅ Fetched ${categories.length} categories for sitemap`);
  } catch (error) {
    console.error("❌ Error fetching categories for sitemap:", error);
  }

  // Build sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
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

  <!-- Blog Posts (only if fetched successfully) -->
  ${blogPosts.length > 0 ? blogPosts.map((post) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt || post.publishedAt || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join("") : ""}

  <!-- Cities (only if fetched successfully) -->
  ${cities.length > 0 ? cities.map((city) => `
  <url>
    <loc>${baseUrl}/locations/${city.slug}</loc>
    <lastmod>${city.updatedAt || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join("") : ""}

  <!-- Products (only if fetched successfully) -->
  ${products.length > 0 ? products.map((product) => `
  <url>
    <loc>${baseUrl}/product/${product.slug}</loc>
    <lastmod>${product.updatedAt || new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("") : ""}

  <!-- Categories (only if fetched successfully) -->
  ${categories.length > 0 ? categories.map((category) => `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("") : ""}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}