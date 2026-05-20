import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Order } from "../types";

const COLLECTION_NAME = "orders";

export const orderService = {
  async createOrder(order: Omit<Order, "id" | "createdAt" | "orderStatus">) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...order,
      orderStatus: "pending",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getOrder(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Order;
    }
    return null;
  },

  async getOrdersByUserId(userId: string) {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order);
  },

  async getAllOrders() {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order);
  },

  async updateOrderStatus(id: string, status: Order["orderStatus"]) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const { updateDoc } = await import("firebase/firestore");
    await updateDoc(docRef, { orderStatus: status });
  },
};
