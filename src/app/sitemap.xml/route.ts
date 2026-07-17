import { NextResponse } from 'next/server';
import { productApi } from '../../services/productApi';
import { categoryApi } from '@/src/services/categoryApi';

interface Product {
  id: string;
  updatedAt?: string;
}

interface Category {
  slug: string;
}

export async function GET() {
  const baseUrl = 'https://royalfurnitures.store';
  
  let products: Product[] = [];
  let categories: Category[] = [];
  
  try {
    products = await productApi.getAll();
    categories = await categoryApi.getAllCategories();
  } catch (error) {
    console.error('Error fetching data for sitemap:', error);
  }

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
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
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
  ${products.map((product: Product) => `
  <url>
    <loc>${baseUrl}/product/${product.id}</loc>
    <lastmod>${product.updatedAt || new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}
  ${categories.map((category: Category) => `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `).join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}