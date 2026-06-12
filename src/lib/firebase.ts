// src/lib/firebase.ts
import { initializeApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Environment variables injected by Vercel (NEXT_PUBLIC_ prefix)
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
};

// Initialize only on the client side to avoid server‑side auth errors.
let app;
if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);
}

export const auth = typeof window !== "undefined" ? getAuth(app!) : null;
export const db = typeof window !== "undefined" ? getFirestore(app!) : null;
