// services/userApi.ts
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { User } from "../types";

class UserApiService {
  private collectionName = "users";

  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const docRef = doc(db, this.collectionName, uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { uid: snapshot.id, ...snapshot.data() } as User;
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  }

  async createUserProfile(user: Omit<User, "createdAt">): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, user.uid);
      await setDoc(docRef, {
        ...user,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }

  async updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, uid);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        console.log("No users found");
        return [];
      }
      return snapshot.docs.map(
        (doc) => ({ uid: doc.id, ...doc.data() }) as User,
      );
    } catch (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
  }

  async getUsersCount(): Promise<number> {
    try {
      const snapshot = await getDocs(collection(db, this.collectionName));
      return snapshot.size;
    } catch (error) {
      console.error("Error getting users count:", error);
      return 0;
    }
  }
}

export const userApi = new UserApiService();
