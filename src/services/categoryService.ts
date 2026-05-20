import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Category } from "../types";

const COLLECTION_NAME = "categories";

export const categoryService = {
  async getCategories() {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Category,
    );
  },

  async createCategory(category: Omit<Category, "id">) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...category,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },
};
