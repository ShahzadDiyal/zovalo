// src/components/blog/HomeBlogSection.tsx
import { fetchBlogPosts } from "./BlogData";
import { BlogSectionClient } from "./BlogSectionClient";

interface HomeBlogSectionProps {
  limit?: number;
  title?: string;
  subtitle?: string;
}

export async function HomeBlogSection({
  limit = 4,
  title = "Latest from Our Blog",
  subtitle = "Discover expert tips, design inspiration, and furniture care guides",
}: HomeBlogSectionProps) {
  const { posts } = await fetchBlogPosts(limit);

  // If no posts, return null (don't render the section)
  if (posts.length === 0) {
    return null;
  }

  return (
    <BlogSectionClient
      initialPosts={posts}
      limit={limit}
      title={title}
      subtitle={subtitle}
    />
  );
}
