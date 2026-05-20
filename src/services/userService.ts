import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { User } from "../types";

const COLLECTION_NAME = "users";

export const userService = {
  async getUserProfile(uid: string) {
    const docRef = doc(db, COLLECTION_NAME, uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { uid: snapshot.id, ...snapshot.data() } as User;
    }
    return null;
  },

  async createUserProfile(user: Omit<User, "createdAt">) {
    const docRef = doc(db, COLLECTION_NAME, user.uid);
    await setDoc(docRef, {
      ...user,
      createdAt: serverTimestamp(),
    });
  },

  async updateUserProfile(uid: string, data: Partial<User>) {
    const docRef = doc(db, COLLECTION_NAME, uid);
    await updateDoc(docRef, data);
  },
};
