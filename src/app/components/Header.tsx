"use client";
// src/app/components/Header.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthProvider";

export default function Header() {
  const { user, signOutUser } = useAuth();
  const pathname = usePathname();

  // Helper to determine if a route is active
  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/45 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo matching the reference image */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-9 h-9 bg-brand-cyan rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-transform duration-300 group-hover:scale-110">
            {/* Custom rounded square icon shape */}
            <div className="w-4 h-4 bg-slate-950 rounded-md"></div>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-black tracking-wider text-white leading-none">
              EDTECH KOREA
            </span>
            <span className="text-[10px] font-semibold text-slate-400 tracking-widest leading-none mt-1">
              FAIR 2026
            </span>
          </div>
        </Link>

        {/* Navigation Items (Korean menu labels matching reference image) */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
          <Link
            href="/"
            className={`transition-colors duration-200 py-1.5 px-3 rounded-lg ${
              isActive("/")
                ? "bg-slate-900/80 text-brand-cyan shadow-sm border border-white/5"
                : "text-slate-300 hover:text-white"
            }`}
          >
            홈
          </Link>
          <Link
            href="/overview"
            className={`transition-colors duration-200 py-1.5 px-3 rounded-lg ${
              isActive("/overview")
                ? "bg-slate-900/80 text-brand-cyan shadow-sm border border-white/5"
                : "text-slate-300 hover:text-white"
            }`}
          >
            행사개요
          </Link>
          <Link
            href="/sessions"
            className={`transition-colors duration-200 py-1.5 px-3 rounded-lg ${
              isActive("/sessions")
                ? "bg-slate-900/80 text-brand-cyan shadow-sm border border-white/5"
                : "text-slate-300 hover:text-white"
            }`}
          >
            부대행사
          </Link>
          <Link
            href="/dashboard"
            className={`transition-colors duration-200 py-1.5 px-3 rounded-lg ${
              isActive("/dashboard")
                ? "bg-slate-900/80 text-brand-cyan shadow-sm border border-white/5"
                : "text-slate-300 hover:text-white"
            }`}
          >
            주최/주관
          </Link>
          <Link
            href="/map"
            className={`transition-colors duration-200 py-1.5 px-3 rounded-lg ${
              isActive("/map")
                ? "bg-slate-900/80 text-brand-cyan shadow-sm border border-white/5"
                : "text-slate-300 hover:text-white"
            }`}
          >
            부스 지도
          </Link>
        </nav>

        {/* Action Buttons (Registration & Authentication) */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline text-xs text-slate-400 font-medium">
                {user.email}
              </span>
              <button
                onClick={signOutUser}
                className="text-xs bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-full border border-white/10 transition-all duration-200"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/auth/signin"
                className="hidden sm:inline text-slate-300 hover:text-white text-sm font-semibold transition-colors duration-200"
              >
                로그인
              </Link>
              <Link
                href="/auth/signin"
                className="bg-brand-cyan hover:bg-brand-cyan-light text-slate-950 text-xs font-black tracking-wide uppercase px-5 py-2.5 rounded-full btn-glow-cyan transition-all duration-300"
              >
                사전등록
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
