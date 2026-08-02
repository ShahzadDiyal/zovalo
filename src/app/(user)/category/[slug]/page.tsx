// src/app/(user)/category/[slug]/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import { fetchCategoryData } from "../CategoryData";
import { CategoryClient } from "../CategoryClient";
import { categoryApi } from "../../../../services/categoryApi";
import { serializeFirestoreData } from "../../../../lib/serialize";

const SITE_URL = "https://royalfurnitures.store";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await categoryApi.getCategoryBySlug(slug);

  const name = category?.name || slug.replace(/-/g, " ");

  // ✅ FIX 1: Title shortened to under 60 characters
  const title = `${name} | Shop Online | Royal Furniture`;

  // ✅ FIX 2: Description shortened to under 155 characters
  const rawDescription =
    category?.description ||
    `Shop our ${name} collection at Royal Furniture. Quality craftsmanship, Cash on Delivery across the UK.`;
  const description =
    rawDescription.length > 155
      ? `${rawDescription.slice(0, 152).trimEnd()}...`
      : rawDescription;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/category/${slug}`, // ✅ Full URL
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/category/${slug}`, // ✅ Full URL
      type: "website",
      siteName: "Royal Furniture",
      locale: "en_GB",
      images: category?.image
        ? [
            {
              url: category.image,
              width: 1200,
              height: 630,
              alt: `${name} - Royal Furniture`,
            },
          ]
        : [
            {
              url: `${SITE_URL}/dining-tables.jpg`,
              width: 1200,
              height: 630,
              alt: "Royal Furniture",
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Shop Online | Royal Furniture`,
      description: description,
      images: category?.image ? [category.image] : [`${SITE_URL}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
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
