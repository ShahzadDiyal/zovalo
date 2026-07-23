// src/services/blogCategoryApi.ts
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
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { BlogCategory } from "../types";

const COLLECTION_NAME = "blogCategories";

class BlogCategoryApiService {
  async getAll(): Promise<BlogCategory[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("name", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as BlogCategory,
      );
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      throw error;
    }
  }

  async getById(id: string): Promise<BlogCategory | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as BlogCategory;
      }
      return null;
    } catch (error) {
      console.error("Error fetching blog category:", error);
      throw error;
    }
  }

  async getBySlug(slug: string): Promise<BlogCategory | null> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("slug", "==", slug),
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as BlogCategory;
      }
      return null;
    } catch (error) {
      console.error("Error fetching blog category by slug:", error);
      throw error;
    }
  }

  async create(
    data: Omit<BlogCategory, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating blog category:", error);
      throw error;
    }
  }

  async update(id: string, data: Partial<BlogCategory>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating blog category:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting blog category:", error);
      throw error;
    }
  }
}

export const blogCategoryApi = new BlogCategoryApiService();
