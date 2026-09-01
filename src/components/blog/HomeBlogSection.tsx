import { fetchBlogPosts } from "./BlogData";
import { BlogSectionClient } from "./BlogSectionClient";
import { serializeFirestoreData } from "../../lib/serialize";

interface HomeBlogSectionProps {
  limit?: number;
  title?: string;
  subtitle?: string;
}

export async function HomeBlogSection({
  limit = 3,
  title = "Latest from Our Blog",
  subtitle = "Discover expert tips, design inspiration, and furniture care guides",
}: HomeBlogSectionProps) {
  const { posts } = await fetchBlogPosts(limit);

  if (posts.length === 0) {
    return null;
  }

  const serializedPosts = serializeFirestoreData(posts);

  return (
    <BlogSectionClient
      initialPosts={serializedPosts}
      limit={limit}
      title={title}
      subtitle={subtitle}
    />
  );
}