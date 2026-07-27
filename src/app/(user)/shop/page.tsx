// src/app/(user)/shop/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import { fetchShopData } from "./ShopData";
import { ShopClient } from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop All Furniture on Cash on delivery | Royal Furniture",
  description:
    "Browse our full range of sofas, beds, dining sets, and wardrobes. Cash on Delivery available, next-day UK delivery on all orders.",
  alternates: {
    canonical: "/shop",
  },
};

export default async function ShopPage() {
  const { products, categories } = await fetchShopData();
  return (
    <Suspense fallback={/* unchanged */ null}>
      <ShopClient initialProducts={products} initialCategories={categories} />
    </Suspense>
  );
}