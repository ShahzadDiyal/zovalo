// src/services/blogPostApi.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
  Timestamp,
  limit,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { BlogPost } from "../types";

const COLLECTION_NAME = "blogPosts";

class BlogPostApiService {
  async getAll(): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
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
      console.error("Error fetching blog posts:", error);
      throw error;
    }
  }

  async getPublished(): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("status", "==", "published"),
        orderBy("publishedAt", "desc"),
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
      console.error("Error fetching published blog posts:", error);
      throw error;
    }
  }

  async getByCategory(categoryId: string): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("category", "==", categoryId),
        where("status", "==", "published"),
        orderBy("publishedAt", "desc"),
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
      console.error("Error fetching blog posts by category:", error);
      throw error;
    }
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("slug", "==", slug),
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as BlogPost;
      }
      return null;
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      throw error;
    }
  }

  async getById(id: string): Promise<BlogPost | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as BlogPost;
      }
      return null;
    } catch (error) {
      console.error("Error fetching blog post:", error);
      throw error;
    }
  }

  async create(
    data: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "views">,
  ): Promise<string> {
    try {
      const postData = {
        ...data,
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt: data.status === "published" ? serverTimestamp() : null,
      };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), postData);
      return docRef.id;
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  }

  async update(id: string, data: Partial<BlogPost>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
        publishedAt: data.status === "published" ? serverTimestamp() : null,
      };
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("Error updating blog post:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting blog post:", error);
      throw error;
    }
  }

  async incrementViews(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        views: (await this.getById(id))?.views || 0 + 1,
      });
    } catch (error) {
      console.error("Error incrementing views:", error);
      throw error;
    }
  }

  async getRelatedPosts(
    categoryId: string,
    postId: string,
    limitCount: number = 3,
  ): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("category", "==", categoryId),
        where("status", "==", "published"),
        orderBy("publishedAt", "desc"),
        limit(limitCount + 1),
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as BlogPost,
      );
      // Filter out the current post
      return posts.filter((post) => post.id !== postId).slice(0, limitCount);
    } catch (error) {
      console.error("Error fetching related posts:", error);
      return [];
    }
  }
}

export const blogPostApi = new BlogPostApiService();
