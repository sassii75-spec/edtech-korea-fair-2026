"use client";
// src/app/page.tsx
import Link from "next/link";
import { useAuth } from "../context/AuthProvider";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col flex-1 items-center justify-center relative px-6 md:px-12 py-20 overflow-hidden font-sans">
      
      {/* Background glow overlay decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-brand-cyan/10 blur-[120px]"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-brand-cyan-light/10 blur-[120px]"></div>
      </div>

      <main className="w-full max-w-5xl flex flex-col items-center text-center z-10 space-y-12">
        
        {/* Date & Location Capsule matching reference image */}
        <div className="inline-flex items-center space-x-2 bg-slate-950/60 border border-brand-cyan/35 text-brand-cyan text-xs md:text-sm font-bold px-5 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 hover:border-brand-cyan/60 hover:shadow-[0_0_15px_rgba(45,212,191,0.25)]">
          <span className="tracking-wide">2026. 9. 17 - 19</span>
          <span className="text-slate-500">|</span>
          <span className="text-white font-medium">서울 코엑스 A홀</span>
        </div>

        {/* Main Title Headers */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase select-none">
            EDTECH KOREA
          </h1>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-brand-cyan uppercase select-none animate-pulse-slow">
            FAIR 2026
          </h2>
        </div>

        {/* Key Badge Theme "AX EXPERIENCE" */}
        <div className="inline-block">
          <div className="bg-brand-cyan text-slate-950 text-sm md:text-base font-black tracking-widest px-8 py-3 rounded-xl uppercase shadow-[0_0_30px_rgba(45,212,191,0.4)] badge-glow-teal transform hover:scale-105 transition-all duration-300">
            AX EXPERIENCE
          </div>
        </div>

        {/* Short description in Korean */}
        <div className="max-w-2xl space-y-3 px-4">
          <p className="text-base md:text-xl font-semibold text-slate-300 tracking-wide leading-relaxed">
            AX로 에듀테크의 지평을 넓히다 : 혁신 그 이상을 향해
          </p>
          <p className="text-xs md:text-sm text-slate-400 font-medium tracking-wider">
            대한민국 대표 에듀테크 비즈니스 전시회
          </p>
        </div>

        {/* Dynamic CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
          <Link
            href={user ? "/dashboard" : "/auth/signin"}
            className="w-full sm:w-auto text-center bg-slate-950/40 hover:bg-slate-900/60 text-white font-semibold text-sm px-8 py-4 rounded-full border border-white/10 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          >
            참관객 사전등록
          </Link>
          <Link
            href="/companies"
            className="w-full sm:w-auto text-center bg-brand-cyan hover:bg-brand-cyan-light text-slate-950 font-black text-sm px-8 py-4 rounded-full transition-all duration-300 btn-glow-cyan flex items-center justify-center space-x-2"
          >
            <span>부스 참가 안내</span>
            <span className="font-sans font-bold">→</span>
          </Link>
        </div>
      </main>

      {/* Brand watermark on lower left corner */}
      <div className="absolute bottom-6 left-8 hidden lg:flex flex-col items-start select-none opacity-40">
        <span className="text-sm font-black text-white tracking-widest leading-none">
          edtech
        </span>
        <span className="text-[10px] font-bold text-slate-400 tracking-widest leading-none mt-1">
          KOREA FAIR
        </span>
      </div>

    </div>
  );
}
