"use client";
// src/app/auth/signin/page.tsx
import { useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import Link from "next/link";
import Header from "../../components/Header";

export default function SignInPage() {
  const { signIn, signInWithGoogle, loading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (user) return <p className="text-center py-8">이미 로그인되었습니다.</p>;

  return (
    <>
      <Header />
      <main className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-center text-primary">로그인</h2>
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
              로그인
            </button>
          </form>
          <div className="flex items-center justify-center">
            <button
              onClick={handleGoogle}
              className="flex items-center space-x-2 py-2 px-4 bg-secondary text-surface rounded hover:bg-accent transition"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 533.5 544.3"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M533.5 278.4c0-17.6-1.6-35.2-4.9-52.3H272v98.9h146.9c-6.4 34.4-25.9 63.5-55.1 83v68h88.9c52-48 81.8-118.6 81.8-197.6z"
                  fill="#4285F4"
                />
                <path
                  d="M272 544.3c73.9 0 135.9-24.4 181.2-66.1l-88.9-68c-24.5 16.4-55.9 26-92.3 26-71 0-131.3-47.9-152.9-112.3h-90v70.5c45.9 90.5 140.5 149.9 242.9 149.9z"
                  fill="#34A853"
                />
                <path
                  d="M119.1 323.9c-10.7-31.6-10.7-65.8 0-97.4v-70.5h-90c-38 73.5-38 161.3 0 234.9l90-67z"
                  fill="#FBBC05"
                />
                <path
                  d="M272 107.5c39.9-.6 78.5 14.9 107.8 43.1l80.4-80.4C417.9 20.5 345.7-4.2 272 0c-102.4 0-197 59.4-242.9 150l90 67c21.7-64.4 81.9-112.3 152.9-112.3z"
                  fill="#EA4335"
                />
              </svg>
              <span>Google 로그인</span>
            </button>
          </div>
          <p className="text-center text-sm">
            계정이 없으신가요? <Link href="/auth/signup" className="text-accent hover:underline">회원가입</Link>
          </p>
        </div>
      </main>
    </>
  );
}
