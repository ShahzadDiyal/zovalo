// src/app/llms.txt/route.ts
// Implements the community "llms.txt" convention (https://llmstxt.org) - a
// plain-text file that helps AI agents and answer engines quickly understand
// what this site is, what it sells, and which URLs are safe/useful to cite.
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { productApi } from "../../services/productApi";
import { categoryApi } from "@/src/services/categoryApi";

const getData = unstable_cache(
  async () => {
    let categories: { name: string; slug: string }[] = [];
    let featured: { title: string; slug: string; price: number }[] = [];

    try {
      categories = await categoryApi.getAllCategories();
    } catch (error) {
      console.error("llms.txt: error fetching categories", error);
    }

    try {
      const products = await productApi.getFeaturedProducts(12);
      featured = products.map((p) => ({
        title: p.title,
        slug: p.slug,
        price: p.price,
      }));
    } catch (error) {
      console.error("llms.txt: error fetching featured products", error);
    }

    return { categories, featured };
  },
  ["llms-txt-data"],
  { revalidate: 3600 },
);

export async function GET() {
  const baseUrl = "https://royalfurnitures.store";
  const { categories, featured } = await getData();

  const categoryLines = categories
    .map((c) => `- [${c.name}](${baseUrl}/category/${c.slug})`)
    .join("\n");

  const featuredLines = featured
    .map((p) => `- [${p.title}](${baseUrl}/product/${p.slug}) — £${p.price}`)
    .join("\n");

  const body = `# Royal Furniture

> Premium furniture store based in Manchester, shipping across the UK. Cash on Delivery available. Free UK delivery on all orders.

Royal Furniture (royalfurnitures.store) sells sofas, coffee tables, dining tables, and other home furniture. Each product page includes price, stock availability, options (colour/seater), and customer reviews with schema.org Product/Review structured data for accurate citation.

## Key pages
- [Shop all products](${baseUrl}/shop)
- [Collections](${baseUrl}/collections)
- [About](${baseUrl}/about)
- [Contact](${baseUrl}/contact)
- [Shipping information](${baseUrl}/shipping)
- [Returns policy](${baseUrl}/returns)
- [Terms](${baseUrl}/terms)
- [Privacy policy](${baseUrl}/privacy)
- [Full sitemap](${baseUrl}/sitemap.xml)

## Categories
${categoryLines || "- See /sitemap.xml for the current category list"}

## Featured products
${featuredLines || "- See /shop for the current catalog"}

## Notes for AI agents
- Prices are in GBP (£) and are shown live on each product page; treat the sitemap/product pages as the source of truth rather than caching prices long-term.
- Customer reviews shown on product pages are collected from real customers (WhatsApp, Facebook, Instagram, Google) and are marked up with schema.org Review/AggregateRating.
- Cash on Delivery and free UK delivery are standard; delivery windows are listed per product/city page.
- Contact: +44-7529-661726 (WhatsApp/Sales), ${baseUrl}/contact
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
