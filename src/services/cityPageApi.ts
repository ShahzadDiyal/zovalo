// src/services/cityPageApi.ts
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
  limit,
  increment,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { CityPage } from "../types";

const COLLECTION_NAME = "cityPages";

class CityPageApiService {
  async getAll(): Promise<CityPage[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("name", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as CityPage,
      );
    } catch (error) {
      console.error("Error fetching city pages:", error);
      return [];
    }
  }

  async getPublished(): Promise<CityPage[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("status", "==", "published"),
        orderBy("name", "asc"),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as CityPage,
      );
    } catch (error) {
      console.error("Error fetching published city pages:", error);
      return [];
    }
  }

  async getById(id: string): Promise<CityPage | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as CityPage;
      }
      return null;
    } catch (error) {
      console.error("Error fetching city page:", error);
      return null;
    }
  }

  async getBySlug(slug: string): Promise<CityPage | null> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("slug", "==", slug),
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as CityPage;
      }
      return null;
    } catch (error) {
      console.error("Error fetching city page by slug:", error);
      return null;
    }
  }

  async create(
    data: Omit<
      CityPage,
      "id" | "createdAt" | "updatedAt" | "views" | "orderCount"
    >,
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        views: 0,
        orderCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating city page:", error);
      throw error;
    }
  }

  async update(id: string, data: Partial<CityPage>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating city page:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting city page:", error);
      throw error;
    }
  }

  async incrementViews(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        views: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  }

  async incrementOrders(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        orderCount: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing orders:", error);
    }
  }
}

export const cityPageApi = new CityPageApiService();
