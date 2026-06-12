// src/lib/firestore.ts
"use client";
import { collection, getDocs, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Generic helper to fetch a collection from Firestore.
 * If `db` is null (e.g., during SSR or when Firebase hasn't loaded),
 * the provided `fallback` array is returned.
 */
export async function fetchCollection<T>(name: string, fallback: T[]): Promise<T[]> {
  if (!db) {
    console.warn(`[firestore] db is null – returning fallback data for ${name}`);
    return fallback;
  }
  try {
    const colRef = collection(db, name);
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(colRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) }));
    if (data.length === 0) {
      console.info(`[firestore] ${name} empty – using fallback`);
      return fallback;
    }
    return data as T[];
  } catch (error) {
    console.error(`[firestore] error fetching ${name}:`, error);
    return fallback;
  }
}
