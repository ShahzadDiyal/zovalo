// src/app/(user)/blog/BlogData.ts
import { blogService } from "../../../services/blogService";
import { BlogPost, BlogCategory } from "../../../types";

export interface BlogPageData {
  posts: BlogPost[];
  categories: BlogCategory[];
  totalPosts: number;
}

export async function fetchBlogData(
  categorySlug?: string | null,
  searchQuery?: string | null,
): Promise<BlogPageData> {
  try {
    const [categoriesData, allPostsData] = await Promise.all([
      blogService.getAllCategories(),
      blogService.getPublishedPosts(),
    ]);

    let filteredPosts = [...allPostsData];
    let categoryName = "";

    // Filter by category if slug is provided
    if (categorySlug) {
      const category = categoriesData.find((c) => c.slug === categorySlug);
      if (category) {
        filteredPosts = filteredPosts.filter((p) => p.category === category.id);
        categoryName = category.name;
      }
    }

    // Filter by search query if provided
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          (post.content && post.content.toLowerCase().includes(searchLower)) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    return {
      posts: filteredPosts,
      categories: categoriesData,
      totalPosts: allPostsData.length,
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return {
      posts: [],
      categories: [],
      totalPosts: 0,
    };
  }
}
