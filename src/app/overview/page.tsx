"use client";
// src/app/overview/page.tsx
import { useState } from "react";
import Link from "next/link";

export default function OverviewPage() {
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string; desc: string } | null>(null);

  const archivePhotos = [
    {
      url: "https://www.kefa.or.kr/smart_editor/upload/20251001105246680736715.jpg",
      title: "개막식 테이프 커팅식",
      desc: "교육부, 산업통상자원부 등 주요 부처 및 협회 귀빈이 참석한 가운데 화려하게 개막한 2025 에듀테크 코리아 페어 현장입니다.",
    },
    {
      url: "https://www.kefa.or.kr/smart_editor/upload/202510011056561133467994.jpg",
      title: "K-디지털 클래스룸 가상 시연",
      desc: "현직 교사 및 학생들이 참여하여 미래형 디지털 교실 모델인 K-디지털 클래스룸의 실시간 양방향 수업을 시연하고 있습니다.",
    },
    {
      url: "https://www.kefa.or.kr/smart_editor/upload/20251001105445150474950.jpg",
      title: "AI 미래교육 포럼 기조 연설",
      desc: "글로벌 에듀테크 리더들이 참여하여 생성형 AI 기술과 맞춤형 공교육 융합 로드맵을 의논하고 강연을 제공하였습니다.",
    },
    {
      url: "https://www.kefa.or.kr/smart_editor/upload/20251001105731330619023.jpg",
      title: "코엑스(COEX) A홀 행사장 전경",
      desc: "수많은 바이어, 교사, 에듀테크 유관기관 및 일반 참관객들이 모여 최신 솔루션을 탐색하고 비즈니스 논의를 가졌습니다.",
    },
    {
      url: "https://www.kefa.or.kr/smart_editor/upload/20251001105839343099050.jpg",
      title: "부스 체험 및 파트너십 상담",
      desc: "교육 혁신을 주도하는 참가 기업 부스에서 관람객들이 직접 AI 및 게이미피케이션 탑재 소프트웨어를 구동해보고 있습니다.",
    },
    {
      url: "https://www.kefa.or.kr/smart_editor/upload/20251001110003874895841.jpg",
      title: "글로벌 VIP 초청 부스 투어",
      desc: "미주개발은행(IDB) 교육 사절단과 아시아권 교육계 리더들이 한국의 우수한 디지털 교육 테크놀로지를 시찰하는 모습입니다.",
    },
  ];

  return (
    <main className="p-6 md:p-12 min-h-screen max-w-6xl mx-auto space-y-16 relative z-10 font-sans">
      
      {/* Page Title & Vision */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="bg-brand-cyan/25 text-brand-cyan text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full uppercase">
          ABOUT THE EVENT
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
          2026 에듀테크 코리아 페어 개요
        </h1>
        <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed">
          대한민국 대표 에듀테크 비즈니스 전시회, <br className="hidden sm:inline" />
          AX(인공지능 경험)로 미래 교육의 새로운 지평을 열어갑니다.
        </p>
      </div>

      {/* Event Details Summary Grid */}
      <div className="glass-card rounded-3xl p-8 border border-white/5 max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-white pl-2 border-l-2 border-brand-cyan">
          행사 기본 정보
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-medium">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <span className="text-brand-cyan font-bold w-20 flex-shrink-0">행사명</span>
              <span className="text-slate-300">2026 에듀테크 코리아 페어 (EdTech Korea Fair 2026)</span>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-brand-cyan font-bold w-20 flex-shrink-0">기간</span>
              <span className="text-slate-300">2026년 9월 17일(목) ~ 9월 19일(토) [3일간]</span>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-brand-cyan font-bold w-20 flex-shrink-0">장소</span>
              <span className="text-slate-300">서울 코엑스(COEX) 1층 A홀</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <span className="text-brand-cyan font-bold w-20 flex-shrink-0">슬로건</span>
              <span className="text-slate-300">AX로 에듀테크의 지평을 넓히다 : 혁신 그 이상을 향해</span>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-brand-cyan font-bold w-20 flex-shrink-0">행사 규모</span>
              <span className="text-slate-300">국내외 에듀테크 기업 200개사, 500부스 규모</span>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-brand-cyan font-bold w-20 flex-shrink-0">주요 구성</span>
              <span className="text-slate-300">에듀테크 전시회, AI 코딩 특별관, 에듀테크 국제 컨퍼런스 등</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Hosts & Organizers Grid (from KEFA official website announcement) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Hosts */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
          <h3 className="text-md md:text-lg font-black text-brand-cyan uppercase tracking-widest border-b border-white/5 pb-2">
            주최 (HOSTS)
          </h3>
          <div className="flex flex-wrap gap-2 text-xs md:text-sm font-semibold text-slate-300">
            <span className="bg-slate-900 px-3 py-2 rounded-xl">대한민국 교육부</span>
            <span className="bg-slate-900 px-3 py-2 rounded-xl">산업통상자원부</span>
            <span className="bg-slate-900 px-3 py-2 rounded-xl">(사)한국디지털교육협회 (KEFA)</span>
            <span className="bg-slate-900 px-3 py-2 rounded-xl">한국에듀테크산업협회</span>
          </div>
        </div>

        {/* Organizers */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
          <h3 className="text-md md:text-lg font-black text-brand-cyan uppercase tracking-widest border-b border-white/5 pb-2">
            주관 (ORGANIZERS)
          </h3>
          <div className="flex flex-wrap gap-2 text-xs md:text-sm font-semibold text-slate-300">
            <span className="bg-slate-900 px-3 py-2 rounded-xl">정보통신산업진흥원 (NIPA)</span>
            <span className="bg-slate-900 px-3 py-2 rounded-xl">대한무역투자진흥공사 (KOTRA)</span>
            <span className="bg-slate-900 px-3 py-2 rounded-xl">(사)한국디지털교육협회</span>
            <span className="bg-slate-900 px-3 py-2 rounded-xl">한국에듀테크산업협회</span>
          </div>
        </div>
      </div>

      {/* 2025 에듀테크 코리아 페어 현장 사진 아카이브 */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-brand-cyan text-xs font-black tracking-widest uppercase">
            LIVE PHOTO ARCHIVE
          </span>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
            지난 2025 페어 현장 아카이브
          </h2>
          <p className="text-xs md:text-sm text-slate-400 font-medium">
            사진을 클릭하면 확대해서 상세한 현장 스케치를 볼 수 있습니다.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {archivePhotos.map((photo, i) => (
            <div
              key={i}
              onClick={() => setSelectedImage(photo)}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-brand-cyan/35 transition-all duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors duration-300"></div>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="text-sm font-bold text-white group-hover:text-brand-cyan transition-colors duration-200">
                  {photo.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-medium line-clamp-1">
                  {photo.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for Gallery */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl glass-card rounded-3xl p-6 border border-white/10 space-y-4 relative overflow-hidden"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold transition-colors"
            >
              ✕
            </button>

            <div className="relative w-full max-h-[60vh] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-h-[60vh] object-contain w-full"
              />
            </div>

            <div className="space-y-2 pt-2 text-left">
              <h3 className="text-lg font-black text-white">{selectedImage.title}</h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                {selectedImage.desc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6 border-t border-white/5">
        <Link
          href="/companies"
          className="w-full sm:w-auto text-center bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-8 py-4 rounded-full border border-white/10 transition-all duration-300"
        >
          참가 기업 라인업 확인하기
        </Link>
        <Link
          href="/sessions"
          className="w-full sm:w-auto text-center bg-brand-cyan hover:bg-brand-cyan-light text-slate-950 font-black text-sm px-8 py-4 rounded-full transition-all duration-300 btn-glow-cyan"
        >
          컨퍼런스 일정 및 예약하기
        </Link>
      </div>

    </main>
  );
}
