// src/app/(user)/blog/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import { fetchBlogData } from "./BlogData";
import { BlogClient } from "./BlogClient";

interface BlogPageProps {
  searchParams: {
    category?: string;
    search?: string;
  };
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const categorySlug = searchParams?.category || null;

  let title = "Furniture Blog | Royal Furniture";
  let description =
    "Discover expert tips, design inspiration, and furniture care guides from Royal Furniture.";

  if (categorySlug) {
    const { categories } = await fetchBlogData(categorySlug, null);
    const category = categories.find((c) => c.slug === categorySlug);
    if (category) {
      title = `${category.name} Articles | Royal Furniture Blog`;
      description = `Explore our ${category.name.toLowerCase()} articles and insights from Royal Furniture experts.`;
    }
  }

  return {
    title,
    description,
    // Category-filtered views canonicalize back to /blog since they're
    // query-string variants of the same listing, not distinct pages.
    alternates: {
      canonical: "/blog",
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://royalfurnitures.store/blog",
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const categorySlug = searchParams?.category || null;
  const searchQuery = searchParams?.search || null;

  const { posts, categories, totalPosts } = await fetchBlogData(
    categorySlug,
    searchQuery,
  );

  // Get category name for display
  let selectedCategoryName = "";
  if (categorySlug) {
    const category = categories.find((c) => c.slug === categorySlug);
    if (category) {
      selectedCategoryName = category.name;
    }
  }

  return (
    <Suspense
      fallback={
        <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-amber-600">
              Loading Blog...
            </p>
          </div>
        </div>
      }
    >
      <BlogClient
        initialPosts={posts}
        initialCategories={categories}
        categorySlug={categorySlug}
        searchQuery={searchQuery}
        selectedCategoryName={selectedCategoryName}
        totalPosts={totalPosts}
      />
    </Suspense>
  );
}
