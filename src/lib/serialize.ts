// src/lib/serialize.ts
import { Timestamp } from "firebase/firestore";

export function serializeFirestoreData<T>(data: T): T {
  if (!data) return data;

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializeFirestoreData(item)) as T;
  }

  // Handle objects
  if (typeof data === "object" && data !== null) {
    // Handle Firestore Timestamp
    if (data instanceof Timestamp || (data as any)?.toDate) {
      return (data as any).toDate().toISOString() as T;
    }

    const result: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Check if it's a Firestore Timestamp
      if (
        value &&
        typeof value === "object" &&
        "toDate" in value &&
        typeof value.toDate === "function"
      ) {
        result[key] = value.toDate().toISOString();
      } else if (
        value &&
        typeof value === "object" &&
        "seconds" in value &&
        "nanoseconds" in value
      ) {
        // Handle raw timestamp objects
        result[key] = new Date(
          value.seconds * 1000 + value.nanoseconds / 1000000,
        ).toISOString();
      } else {
        result[key] = serializeFirestoreData(value);
      }
    }
    return result;
  }

  return data;
}
