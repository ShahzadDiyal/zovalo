// src/app/(user)/category/[slug]/page.tsx
import { Suspense } from "react";
import { fetchCategoryData } from "../CategoryData";
import { CategoryClient } from "../CategoryClient";
import { serializeFirestoreData } from "../../../../lib/serialize";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { products, categories } = await fetchCategoryData();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      }
    >
      <CategoryClient
        initialProducts={products}
        initialCategories={categories}
      />
    </Suspense>
  );
}
