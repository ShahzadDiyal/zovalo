// src/services/cityPageService.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  limit,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { CityPage } from "../types";

class CityPageService {
  // Get all published city pages - SIMPLIFIED (no composite index needed)
  async getPublishedCities(): Promise<CityPage[]> {
    try {
      // Simple query without complex where + orderBy combination
      const q = query(
        collection(db, "cityPages"),
        where("status", "==", "published"),
      );
      const snapshot = await getDocs(q);
      const cities = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as CityPage,
      );

      // Sort client-side by name
      return cities.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error("Error fetching city pages:", error);
      return [];
    }
  }

  // Get featured cities - SIMPLIFIED
  async getFeaturedCities(limitCount: number = 6): Promise<CityPage[]> {
    try {
      const q = query(
        collection(db, "cityPages"),
        where("status", "==", "published"),
        where("featured", "==", true),
      );
      const snapshot = await getDocs(q);
      const cities = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as CityPage,
      );

      // Sort client-side and limit
      const sorted = cities.sort((a, b) => a.name.localeCompare(b.name));
      return sorted.slice(0, limitCount);
    } catch (error) {
      console.error("Error fetching featured cities:", error);
      return [];
    }
  }

  // Get city page by slug
  async getCityBySlug(slug: string): Promise<CityPage | null> {
    try {
      const q = query(
        collection(db, "cityPages"),
        where("slug", "==", slug),
        where("status", "==", "published"),
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as CityPage;
      }
      return null;
    } catch (error) {
      console.error("Error fetching city page:", error);
      return null;
    }
  }

  // Get city page by ID (for admin)
  async getCityById(id: string): Promise<CityPage | null> {
    try {
      const docRef = doc(db, "cityPages", id);
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

  // Increment city page views
  async incrementViews(id: string): Promise<void> {
    try {
      const docRef = doc(db, "cityPages", id);
      await updateDoc(docRef, {
        views: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  }

  // Search cities
  async searchCities(searchTerm: string): Promise<CityPage[]> {
    try {
      const q = query(
        collection(db, "cityPages"),
        where("status", "==", "published"),
      );
      const snapshot = await getDocs(q);
      const allCities = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as CityPage,
      );

      const searchLower = searchTerm.toLowerCase();
      return allCities.filter(
        (city) =>
          city.name.toLowerCase().includes(searchLower) ||
          city.nearbyAreas?.some((area) =>
            area.toLowerCase().includes(searchLower),
          ),
      );
    } catch (error) {
      console.error("Error searching cities:", error);
      return [];
    }
  }
}

export const cityPageService = new CityPageService();
