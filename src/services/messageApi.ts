// services/messageApi.ts
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
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { ContactMessage } from "../types";

const COLLECTION_NAME = "contact_messages";

class MessageApiService {
  async getAllMessages(): Promise<ContactMessage[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as ContactMessage,
    );
  }

  async getUnreadCount(): Promise<number> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("status", "==", "unread"),
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  }

  async getMessageById(id: string): Promise<ContactMessage | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as ContactMessage;
    }
    return null;
  }

  async createMessage(
    message: Omit<ContactMessage, "id" | "createdAt" | "status">,
  ): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...message,
      status: "unread",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async markAsRead(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status: "read" });
  }

  async markAsReplied(id: string, replyMessage: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      status: "replied",
      repliedAt: serverTimestamp(),
      replyMessage: replyMessage,
    });
  }

  async deleteMessage(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }

  async getMessagesByStatus(status: string): Promise<ContactMessage[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("status", "==", status),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as ContactMessage,
    );
  }
}

export const messageApi = new MessageApiService();
