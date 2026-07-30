// src/app/(user)/collections/page.tsx
import { Metadata } from "next";
import { categoryApi } from "../../../services/categoryApi";
import { productApi } from "../../../services/productApi";
import { Category, Product } from "../../../types";
import { CollectionsClient } from "./CollectionsClient";

export const metadata: Metadata = {
  title: "All Collections | Royal Furniture",
  description: "Explore our complete range of furniture collections including sofas, beds, wardrobes, dining sets and more. Premium quality with Cash on Delivery.",
  alternates: {
    canonical: "/collections",
  },
  openGraph: {
    title: "All Collections | Royal Furniture",
    description: "Explore our complete range of furniture collections including sofas, beds, wardrobes, dining sets and more.",
    url: "https://royalfurnitures.store/collections",
    type: "website",
  },
};

export default async function CollectionsPage() {
  const [categories, products] = await Promise.all([
    categoryApi.getAllCategories(),
    productApi.getAll(),
  ]);

  // Get product count for each category
  const categoriesWithCount = categories.map((category) => ({
    ...category,
    productCount: products.filter((product: Product) => product.category === category.name).length,
  }));

  // Sort categories by product count (most products first)
  const sortedCategories = categoriesWithCount.sort((a, b) => b.productCount - a.productCount);

  // Cast to any to bypass the type check (temporary fix)
  return <CollectionsClient categories={sortedCategories as any} totalProducts={products.length} />;
}