// services/orderApi.ts
import {
  query,
  where,
  orderBy,
  limit,
  getDocs,
  collection,
} from "firebase/firestore";
import { BaseApiService } from "./api";
import { Order } from "../types";
import { db } from "../lib/firebase";

class OrderApiService extends BaseApiService<Order> {
  constructor() {
    super("orders");
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      // First try with ordering (uses index)
      const constraints = [
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
      ];
      return await this.getWithConstraints(constraints);
    } catch (error: any) {
      // If index error (building or not ready), fetch without orderBy
      if (
        error.code === "failed-precondition" ||
        error.message?.includes("index")
      ) {
        console.log("Index building, fetching unsorted orders...");
        const q = query(
          collection(db, "orders"),
          where("userId", "==", userId),
        );
        const snapshot = await getDocs(q);
        const orders = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Order,
        );
        // Sort client-side
        return orders.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
      }
      throw error;
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      const constraints = [orderBy("createdAt", "desc")];
      return await this.getWithConstraints(constraints);
    } catch (error: any) {
      if (
        error.code === "failed-precondition" ||
        error.message?.includes("index")
      ) {
        console.log("Index building, fetching unsorted orders...");
        const snapshot = await getDocs(collection(db, "orders"));
        const orders = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Order,
        );
        return orders.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
      }
      throw error;
    }
  }

  async getOrdersByStatus(status: Order["orderStatus"]): Promise<Order[]> {
    try {
      const constraints = [
        where("orderStatus", "==", status),
        orderBy("createdAt", "desc"),
      ];
      return await this.getWithConstraints(constraints);
    } catch (error: any) {
      if (
        error.code === "failed-precondition" ||
        error.message?.includes("index")
      ) {
        console.log("Index building, fetching unsorted orders by status...");
        const q = query(
          collection(db, "orders"),
          where("orderStatus", "==", status),
        );
        const snapshot = await getDocs(q);
        const orders = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Order,
        );
        return orders.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
      }
      throw error;
    }
  }

  async updateOrderStatus(
    orderId: string,
    status: Order["orderStatus"],
  ): Promise<void> {
    await this.update(orderId, { orderStatus: status });
  }

  async getRecentOrders(limitCount: number = 5): Promise<Order[]> {
    try {
      const constraints = [orderBy("createdAt", "desc"), limit(limitCount)];
      return await this.getWithConstraints(constraints);
    } catch (error: any) {
      if (
        error.code === "failed-precondition" ||
        error.message?.includes("index")
      ) {
        console.log("Index building, fetching recent orders client-side...");
        const snapshot = await getDocs(collection(db, "orders"));
        const orders = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Order,
        );
        return orders
          .sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(0);
            const dateB = b.createdAt?.toDate?.() || new Date(0);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, limitCount);
      }
      throw error;
    }
  }
}

export const orderApi = new OrderApiService();
