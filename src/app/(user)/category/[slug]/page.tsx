// src/app/(user)/category/[slug]/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import { fetchCategoryData } from "../CategoryData";
import { CategoryClient } from "../CategoryClient";
import { categoryApi } from "../../../../services/categoryApi";
import { serializeFirestoreData } from "../../../../lib/serialize";

const SITE_URL = "https://royalfurnitures.store";

// ✅ CRITICAL: Force dynamic rendering - NO STATIC GENERATION
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await categoryApi.getCategoryBySlug(slug);

  const name = category?.name || slug.replace(/-/g, " ");

  const title = `${name} | Shop Online | Royal Furniture`;

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
      canonical: `${SITE_URL}/category/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/category/${slug}`,
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

// Lightweight Loading Skeleton UI for instant feedback during transition
function CategorySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-10"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="border border-warm-beige rounded-lg p-4 space-y-4">
            <div className="bg-gray-200 h-48 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
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
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryClient
        initialProducts={serializedProducts}
        initialCategories={serializedCategories}
        currentCategory={serializedCurrentCategory}
      />
    </Suspense>
  );
}