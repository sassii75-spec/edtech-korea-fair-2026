"use client";
// src/app/auth/signin/page.tsx
import { useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { signIn, signUp, signInWithGoogle, loading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
      router.push("/dashboard");
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

  // Pre-configured Quick Login for testing
  const handleQuickLogin = async (type: "admin" | "user") => {
    setError(null);
    const testEmail = type === "admin" ? "admin@edtech.com" : "user@edtech.com";
    const testPassword = "testpassword123";

    try {
      // 1. Try to sign in
      await signIn(testEmail, testPassword);
      // 2. Set default role
      localStorage.setItem("userRole", type === "admin" ? "투자자" : "교사");
      router.push("/dashboard");
    } catch (err: any) {
      // 3. Fallback: If account doesn't exist, create it on-the-fly
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential" ||
        err.message.includes("not-found") ||
        err.message.includes("invalid-credential") ||
        err.message.includes("INVALID_LOGIN_CREDENTIALS")
      ) {
        try {
          await signUp(testEmail, testPassword);
          localStorage.setItem("userRole", type === "admin" ? "투자자" : "교사");
          router.push("/dashboard");
        } catch (signupErr: any) {
          setError(`자동 테스트 계정 가입 실패: ${signupErr.message}`);
        }
      } else {
        setError(`테스트 계정 로그인 실패: ${err.message}`);
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
          href="/dashboard" 
          className="text-xs text-brand-cyan hover:underline font-bold"
        >
          마이페이지 대시보드로 이동
        </Link>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 space-y-6 glass-card rounded-3xl shadow-2xl relative z-10 border border-white/5">
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">로그인</h2>
          <p className="text-xs text-slate-400 font-medium">참관객 사전등록 및 조회를 위해 로그인해 주세요.</p>
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
            로그인하기
          </button>
        </form>

        {/* Test Accounts Quick Login Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-[9px] text-slate-500 font-black uppercase tracking-widest">TEST LOGIN</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* Quick Test Accounts buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickLogin("admin")}
              type="button"
              className="py-2.5 px-3 bg-slate-900/60 hover:bg-brand-cyan/20 border border-brand-cyan/35 text-brand-cyan rounded-xl text-xs font-bold transition-all text-center"
            >
              어드민 (B2B/주최자)
              <span className="block text-[9px] text-slate-400 font-medium mt-0.5">admin@edtech.com</span>
            </button>
            <button
              onClick={() => handleQuickLogin("user")}
              type="button"
              className="py-2.5 px-3 bg-slate-900/60 hover:bg-brand-cyan/20 border border-white/10 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all text-center"
            >
              일반 참관객
              <span className="block text-[9px] text-slate-400 font-medium mt-0.5">user@edtech.com</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white rounded-xl border border-white/10 transition-all duration-200 font-bold text-xs"
          >
            <svg
              className="w-4 h-4"
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
            <span>Google 계정으로 로그인 (리디렉션)</span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-400">
          아직 사전등록 계정이 없으신가요?{" "}
          <Link href="/auth/signup" className="text-brand-cyan hover:underline font-bold">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
