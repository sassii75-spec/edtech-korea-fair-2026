"use client";
// src/app/auth/signup/page.tsx
import { useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import Link from "next/link";
import Header from "../../components/Header";

export default function SignUpPage() {
  const { signUp, loading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signUp(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (user) return <p className="text-center py-8">이미 로그인되었습니다.</p>;

  return (
    <>
      <Header />
      <main className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-center text-primary">회원가입</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="w-full py-2 bg-primary text-surface rounded hover:bg-accent transition"
            >
              회원가입
            </button>
          </form>
          <p className="text-center text-sm">
            이미 계정이 있으신가요? <Link href="/auth/signin" className="text-accent hover:underline">로그인</Link>
          </p>
        </div>
      </main>
    </>
  );
}
