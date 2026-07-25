// src/services/colorApi.ts
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
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Color } from "../types";

const COLLECTION_NAME = "colors";
const FABRIC_COLLECTION = "fabrics";

class ColorApiService {
  async getAll(): Promise<Color[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const snapshot = await getDocs(q);
      const colors = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Color,
      );

      colors.sort((a, b) => {
        if (a.fabric !== b.fabric) {
          return a.fabric.localeCompare(b.fabric);
        }
        return (a.sortOrder || 0) - (b.sortOrder || 0);
      });

      return colors;
    } catch (error) {
      console.error("Error fetching colors:", error);
      return [];
    }
  }

  async getActiveColors(): Promise<Color[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("isActive", "==", true),
      );
      const snapshot = await getDocs(q);
      const colors = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Color,
      );

      colors.sort((a, b) => {
        if (a.fabric !== b.fabric) {
          return a.fabric.localeCompare(b.fabric);
        }
        return (a.sortOrder || 0) - (b.sortOrder || 0);
      });

      return colors;
    } catch (error) {
      console.error("Error fetching active colors:", error);
      return [];
    }
  }

  async getFabrics(): Promise<string[]> {
    try {
      const q = query(
        collection(db, FABRIC_COLLECTION),
        orderBy("name", "asc"),
      );
      const snapshot = await getDocs(q);
      const fabrics = snapshot.docs.map((doc) => doc.data().name as string);

      if (fabrics.length > 0) {
        return fabrics;
      }

      const colors = await this.getAll();
      const uniqueFabrics = [...new Set(colors.map((c) => c.fabric))];
      return uniqueFabrics.sort();
    } catch (error) {
      console.error("Error fetching fabrics:", error);
      return [];
    }
  }

  async fabricExists(name: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, FABRIC_COLLECTION),
        where("name", "==", name),
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error("Error checking fabric existence:", error);
      return false;
    }
  }

  async addFabricIfNotExists(name: string): Promise<void> {
    try {
      const exists = await this.fabricExists(name);
      if (exists) {
        return;
      }

      await addDoc(collection(db, FABRIC_COLLECTION), {
        name: name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("Fabric added:", name);
    } catch (error) {
      console.error("Error adding fabric:", error);
      throw error;
    }
  }

  async ensureFabricExists(fabricName: string): Promise<void> {
    try {
      await this.addFabricIfNotExists(fabricName);
    } catch (error) {
      console.error("Error ensuring fabric exists:", error);
      throw error;
    }
  }

  // Check if color already exists by name and fabric
  async colorExists(name: string, fabric: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("name", "==", name),
        where("fabric", "==", fabric),
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error("Error checking color existence:", error);
      return false;
    }
  }

  // Check if color exists by hex and fabric
  async colorExistsByHex(hex: string, fabric: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("hex", "==", hex),
        where("fabric", "==", fabric),
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error("Error checking color existence:", error);
      return false;
    }
  }

  async getByFabric(fabric: string): Promise<Color[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("fabric", "==", fabric),
        where("isActive", "==", true),
        orderBy("sortOrder", "asc"),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Color,
      );
    } catch (error) {
      console.error("Error fetching colors by fabric:", error);
      return [];
    }
  }

  async getById(id: string): Promise<Color | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Color;
      }
      return null;
    } catch (error) {
      console.error("Error fetching color:", error);
      return null;
    }
  }

  async create(
    data: Omit<Color, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    try {
      // Check if color already exists
      const exists = await this.colorExists(data.name, data.fabric);
      if (exists) {
        throw new Error(
          `Color "${data.name}" already exists in fabric "${data.fabric}"`,
        );
      }

      // Check if color with same hex exists in this fabric
      const existsByHex = await this.colorExistsByHex(data.hex, data.fabric);
      if (existsByHex) {
        throw new Error(
          `Color with hex "${data.hex}" already exists in fabric "${data.fabric}"`,
        );
      }

      await this.ensureFabricExists(data.fabric);

      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating color:", error);
      throw error;
    }
  }

  async bulkCreate(
    colors: Omit<Color, "id" | "createdAt" | "updatedAt">[],
  ): Promise<{
    created: string[];
    skipped: Array<{ name: string; fabric: string; reason: string }>;
  }> {
    try {
      const uniqueFabrics = [...new Set(colors.map((c) => c.fabric))];

      for (const fabric of uniqueFabrics) {
        await this.ensureFabricExists(fabric);
      }

      const batch = writeBatch(db);
      const created: string[] = [];
      const skipped: Array<{ name: string; fabric: string; reason: string }> =
        [];

      for (const color of colors) {
        // Check if color already exists
        const exists = await this.colorExists(color.name, color.fabric);
        if (exists) {
          skipped.push({
            name: color.name,
            fabric: color.fabric,
            reason: "Color already exists in this fabric",
          });
          continue;
        }

        // Check if color with same hex exists in this fabric
        const existsByHex = await this.colorExistsByHex(
          color.hex,
          color.fabric,
        );
        if (existsByHex) {
          skipped.push({
            name: color.name,
            fabric: color.fabric,
            reason: `Color with hex ${color.hex} already exists in this fabric`,
          });
          continue;
        }

        const docRef = doc(collection(db, COLLECTION_NAME));
        created.push(docRef.id);
        batch.set(docRef, {
          ...color,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      if (created.length > 0) {
        await batch.commit();
      }

      console.log(
        `Bulk create: ${created.length} created, ${skipped.length} skipped`,
      );
      return { created, skipped };
    } catch (error) {
      console.error("Error bulk creating colors:", error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Color>): Promise<void> {
    try {
      if (data.fabric) {
        await this.ensureFabricExists(data.fabric);
      }

      // If name is being updated, check for duplicates
      if (data.name && data.fabric) {
        const existingColors = await this.getAll();
        const duplicate = existingColors.find(
          (c) =>
            c.id !== id && c.name === data.name && c.fabric === data.fabric,
        );
        if (duplicate) {
          throw new Error(
            `Color "${data.name}" already exists in fabric "${data.fabric}"`,
          );
        }
      }

      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating color:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting color:", error);
      throw error;
    }
  }
}

export const colorApi = new ColorApiService();
