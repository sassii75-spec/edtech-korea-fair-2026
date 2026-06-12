// src/app/components/ProtectedRoute.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthProvider";

/**
 * Wrapper that redirects unauthenticated users to the sign‑in page.
 * Usage: wrap any protected page component with <ProtectedRoute>{children}</ProtectedRoute>
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/auth/signin");
    }
  }, [user, router]);

  // Render children only when a user is present.
  return <>{user ? children : null}</>;
}
