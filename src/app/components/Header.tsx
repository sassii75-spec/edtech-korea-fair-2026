"use client";
// src/app/components/Header.tsx
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthProvider";

export default function Header() {
  const { user, signOutUser } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Helper to determine if a route is active
  const isActive = (path: string) => pathname === path;

  const toggleMobileOpen = () => setMobileOpen(!mobileOpen);
  const closeMobileMenu = () => setMobileOpen(false);

  const navLinks = [
    { href: "/", label: "홈" },
    { href: "/overview", label: "행사개요" },
    { href: "/sessions", label: "부대행사" },
    { href: "/dashboard", label: "주최/주관" },
    { href: "/map", label: "부스 지도" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/45 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo matching the reference image */}
        <Link href="/" onClick={closeMobileMenu} className="flex items-center space-x-3 group">
          <div className="relative w-9 h-9 bg-brand-cyan rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-transform duration-300 group-hover:scale-110">
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

        {/* Desktop Navigation Items */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors duration-200 py-1.5 px-3 rounded-lg ${
                isActive(link.href)
                  ? "bg-slate-900/80 text-brand-cyan shadow-sm border border-white/5"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons (Desktop Auth & Mobile Menu Toggle) */}
        <div className="flex items-center space-x-4">
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-400 font-medium">
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
                  className="text-slate-300 hover:text-white text-sm font-semibold transition-colors duration-200"
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

          {/* Mobile Menu Button (Hamburger) */}
          <button
            onClick={toggleMobileOpen}
            className="md:hidden flex items-center justify-center p-2 w-10 h-10 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-brand-cyan/40 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <span className="text-xl font-bold">✕</span>
            ) : (
              <span className="text-xl">☰</span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer / Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bottom-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-white/5 flex flex-col p-6 space-y-6 justify-between overflow-y-auto animate-fade-in">
          
          <nav className="flex flex-col space-y-3 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`py-4 px-4 rounded-2xl text-base font-bold border transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan shadow-lg"
                    : "bg-slate-900/40 border-white/5 text-slate-300 hover:text-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{link.label}</span>
                  <span className="text-xs opacity-50">➔</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Mobile Auth actions */}
          <div className="border-t border-white/5 pt-6 pb-8 space-y-3">
            {user ? (
              <div className="space-y-3 text-center">
                <p className="text-xs text-slate-400 font-medium">로그인 계정: {user.email}</p>
                <button
                  onClick={() => {
                    signOutUser();
                    closeMobileMenu();
                  }}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl border border-white/10 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/signin"
                  onClick={closeMobileMenu}
                  className="w-full text-center py-3 bg-slate-900 border border-white/10 text-white font-bold text-sm rounded-xl transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/signin"
                  onClick={closeMobileMenu}
                  className="w-full text-center py-3 bg-brand-cyan hover:bg-brand-cyan-light text-slate-950 font-black text-sm rounded-xl transition-colors text-center"
                >
                  사전등록하기
                </Link>
              </div>
            )}
          </div>

        </div>
      )}
    </header>
  );
}
