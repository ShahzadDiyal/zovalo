// src/app/(user)/shop/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import { fetchShopData } from "./ShopData";
import { ShopClient } from "./ShopClient";

const SITE_URL = "https://royalfurnitures.store";

export const metadata: Metadata = {
  title: "Shop All Furniture on Cash on delivery | Royal Furniture",
  description:
    "Browse our full range of sofas, beds, dining sets, and wardrobes. Cash on Delivery available, next-day UK delivery on all orders.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop All Furniture on Cash on delivery | Royal Furniture",
    description:
      "Browse our full range of sofas, beds, dining sets, and wardrobes. Cash on Delivery available, next-day UK delivery on all orders.",
    url: `${SITE_URL}/shop`,
    type: "website",
    siteName: "Royal Furniture",
    locale: "en_GB",
    images: [
      {
        url: `${SITE_URL}/sofa-bad-design-hero.jpg`,
        width: 1200,
        height: 630,
        alt: "Royal Furniture - Shop All Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop All Furniture on Cash on delivery | Royal Furniture",
    description:
      "Browse our full range of sofas, beds, dining sets, and wardrobes. Cash on Delivery available, next-day UK delivery on all orders.",
    images: [`${SITE_URL}/sofa-bad-design-hero.jpg`],
  },
};

export default async function ShopPage() {
  const { products, categories } = await fetchShopData();
  return (
    <Suspense fallback={null}>
      <ShopClient initialProducts={products} initialCategories={categories} />
    </Suspense>
  );
}
