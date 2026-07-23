// src/services/blogService.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  Timestamp,
  updateDoc,
  increment,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { BlogPost, BlogCategory } from "../types";

class BlogService {
  // Get all published posts (simplified - returns array)
  async getPublishedPosts(): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, "blogPosts"),
        where("status", "==", "published"),
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as BlogPost,
      );

      // Sort client-side by published date
      return posts.sort((a, b) => {
        const dateA = a.publishedAt?.toDate?.() || new Date(0);
        const dateB = b.publishedAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error("Error fetching published posts:", error);
      return [];
    }
  }

  // Get posts with pagination
  async getPublishedPostsPaginated(
    pageSize: number = 9,
    lastDoc?: QueryDocumentSnapshot,
  ) {
    try {
      let q = query(
        collection(db, "blogPosts"),
        where("status", "==", "published"),
        orderBy("publishedAt", "desc"),
        limit(pageSize),
      );

      if (lastDoc) {
        q = query(
          collection(db, "blogPosts"),
          where("status", "==", "published"),
          orderBy("publishedAt", "desc"),
          startAfter(lastDoc),
          limit(pageSize),
        );
      }

      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as BlogPost,
      );

      return {
        posts,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: snapshot.docs.length === pageSize,
      };
    } catch (error) {
      console.error("Error fetching paginated posts:", error);
      return {
        posts: [],
        lastDoc: null,
        hasMore: false,
      };
    }
  }

  // Get featured posts
  async getFeaturedPosts(limitCount: number = 3): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, "blogPosts"),
        where("status", "==", "published"),
        limit(limitCount * 2),
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as BlogPost,
      );

      const sorted = posts.sort((a, b) => {
        const dateA = a.publishedAt?.toDate?.() || new Date(0);
        const dateB = b.publishedAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      return sorted.slice(0, limitCount);
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      return [];
    }
  }

  // Get post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const q = query(collection(db, "blogPosts"), where("slug", "==", slug));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        if (data.status === "published") {
          return { id: doc.id, ...data } as BlogPost;
        }
        return null;
      }
      return null;
    } catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  }

  // Get posts by category
  async getPostsByCategory(categoryId: string): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, "blogPosts"),
        where("category", "==", categoryId),
        where("status", "==", "published"),
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as BlogPost,
      );

      return posts.sort((a, b) => {
        const dateA = a.publishedAt?.toDate?.() || new Date(0);
        const dateB = b.publishedAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error("Error fetching posts by category:", error);
      return [];
    }
  }

  // Search posts
  async searchPosts(searchTerm: string): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, "blogPosts"),
        where("status", "==", "published"),
      );
      const snapshot = await getDocs(q);
      const allPosts = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as BlogPost,
      );

      const searchLower = searchTerm.toLowerCase();
      return allPosts
        .filter(
          (post) =>
            post.title.toLowerCase().includes(searchLower) ||
            (post.content &&
              post.content.toLowerCase().includes(searchLower)) ||
            (post.excerpt &&
              post.excerpt.toLowerCase().includes(searchLower)) ||
            post.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
        )
        .slice(0, 12);
    } catch (error) {
      console.error("Error searching posts:", error);
      return [];
    }
  }

  // Get all posts (for admin)
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, "blogPosts"),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as BlogPost,
      );
    } catch (error) {
      console.error("Error fetching all posts:", error);
      return [];
    }
  }

  // Get related posts
  async getRelatedPosts(
    categoryId: string,
    postId: string,
    limitCount: number = 3,
  ): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, "blogPosts"),
        where("category", "==", categoryId),
        where("status", "==", "published"),
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as BlogPost,
      );

      const filtered = posts.filter((post) => post.id !== postId);
      const sorted = filtered.sort((a, b) => {
        const dateA = a.publishedAt?.toDate?.() || new Date(0);
        const dateB = b.publishedAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      return sorted.slice(0, limitCount);
    } catch (error) {
      console.error("Error fetching related posts:", error);
      return [];
    }
  }

  // Increment post views
  async incrementViews(postId: string): Promise<void> {
    try {
      const docRef = doc(db, "blogPosts", postId);
      await updateDoc(docRef, {
        views: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  }

  // Get all categories
  async getAllCategories(): Promise<BlogCategory[]> {
    try {
      const q = query(collection(db, "blogCategories"), orderBy("name", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as BlogCategory,
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }
}

export const blogService = new BlogService();
