// services/api.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  QueryConstraint,
  DocumentData,
  FirestoreDataConverter,
  WithFieldValue,
  DocumentReference,
} from "firebase/firestore";
import { db } from "../lib/firebase";

// Create a converter to handle type safety
function createConverter<
  T extends { id?: string },
>(): FirestoreDataConverter<T> {
  return {
    toFirestore: (data: WithFieldValue<T>): DocumentData => {
      const { id, ...rest } = data as any;
      return rest;
    },
    fromFirestore: (snapshot: any, options: any): T => {
      const data = snapshot.data(options);
      return { id: snapshot.id, ...data } as T;
    },
  };
}

export class BaseApiService<T extends { id?: string }> {
  protected collectionName: string;
  protected converter: FirestoreDataConverter<T>;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.converter = createConverter<T>();
  }

  protected getCollection() {
    return collection(db, this.collectionName).withConverter(this.converter);
  }

  protected getDocRef(id: string): DocumentReference<T> {
    return doc(db, this.collectionName, id).withConverter(this.converter);
  }

  async getAll(): Promise<T[]> {
    const snapshot = await getDocs(this.getCollection());
    return snapshot.docs.map((doc) => doc.data());
  }

  async getWithConstraints(constraints: QueryConstraint[]): Promise<T[]> {
    const q = query(this.getCollection(), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  }

  async getById(id: string): Promise<T | null> {
    const snapshot = await getDoc(this.getDocRef(id));
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  }

  async create(data: Omit<T, "id">): Promise<string> {
    const docRef = await addDoc(this.getCollection(), {
      ...data,
      createdAt: serverTimestamp(),
    } as any);
    return docRef.id;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    await updateDoc(this.getDocRef(id), data as any);
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(this.getDocRef(id));
  }
}
