"use client";
// src/app/auth/signup/page.tsx
import { useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import Link from "next/link";

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400">인증 상태 확인 중...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="bg-brand-cyan/10 border border-brand-cyan/20 p-6 rounded-2xl text-center max-w-sm">
          <p className="text-white font-bold">이미 로그인되었습니다.</p>
          <p className="text-xs text-slate-400 mt-1">계정: {user.email}</p>
        </div>
        <Link 
          href="/" 
          className="text-xs text-brand-cyan hover:underline font-bold"
        >
          메인 페이지로 이동
        </Link>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 space-y-6 glass-card rounded-3xl shadow-2xl relative z-10 border border-white/5">
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">회원가입</h2>
          <p className="text-xs text-slate-400 font-medium">참관객 사전등록 계정을 새로 만듭니다.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">이메일</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl focus:outline-none focus:border-brand-cyan text-sm text-white placeholder-slate-500 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">비밀번호</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl focus:outline-none focus:border-brand-cyan text-sm text-white placeholder-slate-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-cyan hover:bg-brand-cyan-light text-slate-950 font-black text-sm rounded-xl shadow-lg btn-glow-cyan transition-all duration-300"
          >
            가입하기
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/signin" className="text-brand-cyan hover:underline font-bold">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
