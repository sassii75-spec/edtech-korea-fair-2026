"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRedirectResult } from "firebase/auth";
import { auth } from "../../../lib/firebase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      if (!auth) return;
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          // Successful sign‑in, navigate to home or dashboard
          router.push("/");
        } else {
          // No user – go back to sign‑in
          router.push("/auth/signin");
        }
      } catch (err) {
        console.error("Google sign‑in redirect error (callback):", err);
        router.push("/auth/signin");
      }
    };
    handleRedirect();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <p className="text-center">Google 인증을 처리 중입니다…</p>
    </div>
  );
}
