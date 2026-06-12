"use client";
// src/context/AuthProvider.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

interface AuthContextProps {
  user: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!auth) {
        console.warn('Firebase auth not initialized – check NEXT_PUBLIC_FIREBASE_* env vars');
        setLoading(false);
        return;
      }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase auth not initialized');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase auth not initialized');
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase auth not initialized');
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  // Handle redirect result after returning from Google
  useEffect(() => {
    if (!auth) return;
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth!);
        if (result?.user) {
          setUser(result.user);
        }
      } catch (err) {
        console.error('Google sign‑in redirect error:', err);
      }
    };
    handleRedirect();
  }, []);

  const signOutUser = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const value: AuthContextProps = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthProvider;
