import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Product } from "../types";

const COLLECTION_NAME = "products";

export const productService = {
  async getProducts() {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Product,
    );
  },

  async getFeaturedProducts() {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("featured", "==", true),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Product,
    );
  },

  async getProduct(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Product;
    }
    return null;
  },

  async getProductBySlug(slug: string) {
    const q = query(collection(db, COLLECTION_NAME), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Product;
    }
    return null;
  },

  async createProduct(product: Omit<Product, "id" | "createdAt">) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...product,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, product);
  },

  async deleteProduct(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
