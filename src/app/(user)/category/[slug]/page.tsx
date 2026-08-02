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
  const title = `${name} | Shop Online | Cash On Delivery in UK`;
  const rawDescription =
    category?.description ||
    `Shop our ${name} collection at Royal Furniture. Quality craftsmanship, Cash on Delivery available across the UK, with fast next-day delivery.`;
  const description =
    rawDescription.length > 155
      ? `${rawDescription.slice(0, 152).trimEnd()}...`
      : rawDescription;

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
  const { products, categories, currentCategory } =
    await fetchCategoryData(slug);

  // Serialize data for client
  const serializedProducts = serializeFirestoreData(products);
  const serializedCategories = serializeFirestoreData(categories);
  const serializedCurrentCategory = currentCategory
    ? serializeFirestoreData(currentCategory)
    : undefined;

  return (
    <Suspense fallback={null}>
      <CategoryClient
        initialProducts={serializedProducts}
        initialCategories={serializedCategories}
        currentCategory={serializedCurrentCategory}
      />
    </Suspense>
  );
}
