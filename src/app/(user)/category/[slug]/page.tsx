// src/app/(user)/category/[slug]/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import { fetchCategoryData } from "../CategoryData";
import { CategoryClient } from "../CategoryClient";
import { categoryApi } from "../../../../services/categoryApi";
import { serializeFirestoreData } from "../../../../lib/serialize";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}


export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await categoryApi.getCategoryBySlug(slug);

  const name = category?.name || slug.replace(/-/g, " ");
  const title = `${name} | Shop Online`;
  const description =
    category?.description ||
    `Shop our ${name} collection at Royal Furniture. Quality craftsmanship, Cash on Delivery available across the UK, with fast next-day delivery.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/category/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://royalfurnitures.store/category/${slug}`,
      images: category?.image ? [{ url: category.image }] : undefined,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const { products, categories } = await fetchCategoryData(slug);

  return (
    <Suspense fallback={/* unchanged */ null}>
      <CategoryClient
        initialProducts={products}
        initialCategories={categories}
      />
    </Suspense>
  );
}