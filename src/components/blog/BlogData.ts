// src/components/blog/BlogData.ts
import { blogService } from "../../services/blogService";
import { BlogPost } from "../../types";

export interface BlogSectionData {
  posts: BlogPost[];
}

export async function fetchBlogPosts(
  limit: number = 4,
): Promise<BlogSectionData> {
  try {
    const featuredPosts = await blogService.getFeaturedPosts(limit);
    return {
      posts: featuredPosts,
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return {
      posts: [],
    };
  }
}
