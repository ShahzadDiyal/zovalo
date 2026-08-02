// src/app/(user)/blog/[slug]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import { BlogPostClient } from "./BlogPostClient";
import { Schema } from "../../../../components/SEO/Schema";
import { blogService } from "../../../../services/blogService";
import { BlogPost } from "../../../../types";
import { serializeFirestoreData } from "../../../../lib/serialize";

const SITE_URL = "https://royalfurnitures.store";

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await blogService.getPublishedPosts();
    return posts.map((post: BlogPost) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Dynamic metadata for SEO - FIXED
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const post = await blogService.getPostBySlug(slug);

    if (!post) {
      return {
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const serializedPost = serializeFirestoreData(post);

    // Build the full canonical URL
    const canonicalUrl = `${SITE_URL}/blog/${serializedPost.slug}`;

    // Get title
    const rawTitle = serializedPost.seoTitle || serializedPost.title || "";
    const title =
      rawTitle.length > 60 ? `${rawTitle.slice(0, 57).trimEnd()}...` : rawTitle;

    // Get description
    const rawDescription =
      serializedPost.seoDescription ||
      serializedPost.excerpt ||
      (serializedPost.content
        ? serializedPost.content.replace(/<[^>]*>/g, "").slice(0, 300)
        : "");
    const description =
      rawDescription.length > 155
        ? `${rawDescription.slice(0, 152).trimEnd()}...`
        : rawDescription;

    // Get featured image or use default
    const featuredImage =
      serializedPost.featuredImage || `${SITE_URL}/sofa-bad-design-hero.jpg`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl, // Full URL
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl, // Full URL
        siteName: "Royal Furniture",
        type: "article",
        publishedTime: serializedPost.publishedAt || serializedPost.createdAt,
        modifiedTime: serializedPost.updatedAt,
        authors: [serializedPost.author?.name || "Royal Furniture"],
        tags: serializedPost.tags || [],
        images: [
          {
            url: featuredImage,
            width: 1200,
            height: 630,
            alt: serializedPost.title || "Royal Furniture Blog Post",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [featuredImage],
      },
      keywords: serializedPost.seoKeywords || serializedPost.tags || [],
      robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post",
      description: "Read our latest blog post",
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

// Server Component
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;

    // Fetch post data on the server
    const post = await blogService.getPostBySlug(slug);

    if (!post) {
      notFound();
    }

    // Fetch related posts
    let relatedPosts: BlogPost[] = [];
    try {
      const allPosts = await blogService.getPublishedPosts();
      relatedPosts = allPosts
        .filter((p) => p.category === post.category && p.id !== post.id)
        .sort((a, b) => {
          const dateA = a.publishedAt?.toDate?.() || new Date(0);
          const dateB = b.publishedAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 3);
    } catch (error) {
      console.error("Error fetching related posts:", error);
      relatedPosts = [];
    }

    // Serialize ALL data before passing to client component
    const serializedPost = serializeFirestoreData(post);
    const serializedRelatedPosts = serializeFirestoreData(relatedPosts);

    return (
      <>
        <Schema type="Article" data={{ post }} />
        <BlogPostClient
          post={serializedPost}
          relatedPosts={serializedRelatedPosts}
        />
      </>
    );
  } catch (error) {
    console.error("Error in blog post page:", error);
    notFound();
  }
}
