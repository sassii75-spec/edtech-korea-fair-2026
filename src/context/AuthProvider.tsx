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
} from "firebase/auth";

interface AuthContextProps {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Load mock user from localStorage if it exists (allows testing bypass)
    if (typeof window !== "undefined") {
      const savedMockUser = localStorage.getItem("mock_user");
      if (savedMockUser) {
        setUser(JSON.parse(savedMockUser));
        setLoading(false);
        return;
      }
    }

    if (!auth) {
      console.warn('Firebase auth not initialized – check NEXT_PUBLIC_FIREBASE_* env vars');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // 2. Only override state with Firebase user if mock user isn't active
      const savedMockUser = localStorage.getItem("mock_user");
      if (!savedMockUser) {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      // Fallback: No Firebase client -> Mock login
      const mockUser = { email, uid: `mock-${email.split("@")[0]}` };
      localStorage.setItem("mock_user", JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.removeItem("mock_user");
    } catch (err: any) {
      // Fallback: Firebase Console hasn't enabled Email/Password sign‑in
      if (
        err.code === "auth/configuration-not-found" ||
        err.code === "auth/invalid-api-key" ||
        err.message.includes("configuration-not-found") ||
        err.message.includes("invalid-api-key")
      ) {
        console.warn("Firebase Auth config missing. Falling back to local mock authentication.");
        const mockUser = { email, uid: `mock-${email.split("@")[0]}` };
        localStorage.setItem("mock_user", JSON.stringify(mockUser));
        setUser(mockUser);
      } else {
        throw err;
      }
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!auth) {
      // Fallback: Mock registration
      const mockUser = { email, uid: `mock-${email.split("@")[0]}` };
      localStorage.setItem("mock_user", JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      localStorage.removeItem("mock_user");
    } catch (err: any) {
      // Fallback: Firebase Console config missing
      if (
        err.code === "auth/configuration-not-found" ||
        err.code === "auth/invalid-api-key" ||
        err.message.includes("configuration-not-found") ||
        err.message.includes("invalid-api-key")
      ) {
        console.warn("Firebase Auth config missing. Falling back to local mock registration.");
        const mockUser = { email, uid: `mock-${email.split("@")[0]}` };
        localStorage.setItem("mock_user", JSON.stringify(mockUser));
        setUser(mockUser);
      } else {
        throw err;
      }
    }
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
          localStorage.removeItem("mock_user");
          setUser(result.user);
        }
      } catch (err) {
        console.error('Google sign‑in redirect error:', err);
      }
    };
    handleRedirect();
  }, []);

  const signOutUser = async () => {
    localStorage.removeItem("mock_user");
    setUser(null);
    if (auth) {
      await signOut(auth);
    }
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
