"use client";
// src/app/sessions/[id]/page.tsx
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { fetchCollection } from "../../../lib/firestore";

interface Session {
  id: string;
  title: string;
  speaker: string;
  time: string;
  tag: string;
  iconSrc: string;
  location?: string;
  description?: string;
  speakerBio?: string;
  hasVod?: boolean;
}

const SAMPLE_SESSIONS: Session[] = [
  {
    id: "s1",
    title: "AI가 바꾸는 미래 교육 트렌드와 방향성",
    speaker: "김민우 박사",
    time: "2026. 9. 17 | 10:00 AM - 11:15 AM",
    tag: "Keynote Speech",
    iconSrc: "/file.svg",
    location: "그랜드 볼룸 A홀",
    description: "생성형 AI와 교육공학의 융합이 가져오는 근본적인 교실 혁신에 대해 이야기합니다. 인공지능 보조 교사, 개별화 학습 설계 패러다임 변화, 미래 지식 평가 모델의 방향성을 제시합니다.",
    speakerBio: "미래교육연구소 소장. 교육공학 박사. 다수의 글로벌 AI 컨퍼런스에서 교육 트렌드 기조연설을 맡아오며 디지털 교과서 모델 표준화를 이끌고 있습니다.",
    hasVod: true,
  },
  {
    id: "s2",
    title: "메타버스와 교육 게이미피케이션의 실제 융합 사례",
    speaker: "이혜린 팀장",
    time: "2026. 9. 17 | 11:30 AM - 12:45 PM",
    tag: "Interactive Workshop",
    iconSrc: "/globe.svg",
    location: "세미나실 201호",
    description: "몰입도 높은 3D 메타버스 가상 학습 환경에서 게이미피케이션 요소를 도입하여 학생들의 자발적 과제 수행 능력을 극대화한 구체적인 파일럿 프로젝트 사례와 실천 가이드를 전달합니다.",
    speakerBio: "EduGame Studio 크리에이티브 팀장. 에듀테크 게임 디자인 및 기획 전문가로, 15개 이상의 모바일 학습 게임을 성공적으로 런칭하였습니다.",
    hasVod: true,
  },
  {
    id: "s3",
    title: "빅데이터 기반 맞춤형 학습 진단 및 대시보드 시스템 구축",
    speaker: "박지훈 교수",
    time: "2026. 9. 18 | 01:30 PM - 02:45 PM",
    tag: "Data Analytics",
    iconSrc: "/file.svg",
    location: "그랜드 볼룸 B홀",
    description: "빅데이터 로그 분석을 활용해 학습자의 주의집중 이탈 시점과 취약 개념을 실시간 정밀 추적하고 학습자용/교사용 맞춤 인사이트 대시보드를 구축하는 정밀 기술 메커니즘을 상세 공개합니다.",
    speakerBio: "한국대학교 컴퓨터공학과 교수. 빅데이터 머신러닝 연구소 소장. 한국 지능형 교육 시스템 표준화 위원회 상임 이사를 맡고 있습니다.",
    hasVod: false,
  },
  {
    id: "s4",
    title: "글로벌 에듀테크 시장 진출 성공 전략 및 투자 유치 가이드",
    speaker: "Sarah Johnson",
    time: "2026. 9. 18 | 03:00 PM - 04:30 PM",
    tag: "Panel Talk",
    iconSrc: "/globe.svg",
    location: "컨퍼런스홀 304호",
    description: "해외 에듀테크 유니콘들의 성장 전략을 벤치마킹하고 실리콘밸리 및 글로벌 벤처캐피털(VC) 대상 투자 설명회(IR) 시 핵심 설득 전략과 핵심 트렌드 지표에 대해 심층 패널 토론을 진행합니다.",
    speakerBio: "Global EdTech Capital 대표. 전 실리콘밸리 EdTech 액셀러레이터 파트너로, 글로벌 30여 개 에듀테크 스타트업 투자를 집행한 전문가입니다.",
    hasVod: true,
  },
];

export default function SessionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [bookingSubmitted, setBookingSubmitted] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [playingVod, setPlayingVod] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      const data = await fetchCollection<Session>("sessions", SAMPLE_SESSIONS);
      const found = data.find((s) => s.id === id);
      setSession(found || null);

      // Check bookmark state
      const saved = localStorage.getItem("myAgendaSessions");
      if (saved && found) {
        const bookmarks = JSON.parse(saved);
        setIsBookmarked(bookmarks.includes(found.id));
      }
    };
    load();
  }, [id]);

  const handleToggleBookmark = () => {
    if (!session) return;
    const saved = localStorage.getItem("myAgendaSessions");
    let bookmarks: string[] = saved ? JSON.parse(saved) : [];
    
    if (bookmarks.includes(session.id)) {
      bookmarks = bookmarks.filter((bid) => bid !== session.id);
      setIsBookmarked(false);
    } else {
      bookmarks.push(session.id);
      setIsBookmarked(true);
    }
    localStorage.setItem("myAgendaSessions", JSON.stringify(bookmarks));
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">세션 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
  };

  return (
    <main className="p-6 md:p-12 min-h-screen max-w-5xl mx-auto space-y-8 relative z-10">
      
      {/* Back button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200 font-semibold text-sm"
      >
        <span>←</span>
        <span>일정 목록으로 돌아가기</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Session Info */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="space-y-1">
              <span className="bg-brand-cyan/20 text-brand-cyan text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                {session.tag}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white pt-2 leading-tight">{session.title}</h1>
            </div>
          </div>

          {/* Time & Place Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/60 border border-white/5 p-5 rounded-2xl">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold">일시</span>
              <p className="text-sm font-bold text-white">📅 {session.time}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold">장소</span>
              <p className="text-sm font-bold text-brand-cyan">📍 {session.location || "미정"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2">세션 소개</h2>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base font-medium">
              {session.description}
            </p>
          </div>

          {session.speakerBio && (
            <div className="space-y-4 bg-slate-900/40 p-6 rounded-2xl border border-white/5">
              <h3 className="text-md font-bold text-white">강연자 정보</h3>
              <p className="text-sm text-brand-cyan font-bold">{session.speaker}</p>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                {session.speakerBio}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Pre-booking Form & Actions */}
        <div className="space-y-6">
          
          {/* Quick Action Widget (Bookmark / VOD Replay) */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h3 className="text-md font-bold text-white border-b border-white/5 pb-2">⚡ 퀵 액션</h3>
            <div className="flex flex-col gap-3">
              {/* Bookmark Button */}
              <button
                onClick={handleToggleBookmark}
                className={`w-full py-3 rounded-xl font-bold text-xs border transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isBookmarked 
                    ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/20" 
                    : "bg-slate-900 border-white/10 text-slate-300 hover:text-white"
                }`}
              >
                <span>⭐</span>
                <span>{isBookmarked ? "My Agenda에 저장됨" : "관심 세션 즐겨찾기"}</span>
              </button>

              {/* VOD Replay Button */}
              {session.hasVod && (
                <button
                  onClick={() => setPlayingVod(true)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800/80 text-brand-cyan border border-brand-cyan/35 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_4px_10px_rgba(45,212,191,0.1)]"
                >
                  <span>▶️</span>
                  <span>세션 리플레이 다시보기 VOD</span>
                </button>
              )}
            </div>
          </div>

          {/* Pre-booking Form */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h3 className="text-md font-bold text-white border-b border-white/5 pb-3">🎟️ 세션 사전 예약</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              좌석이 한정되어 있으니 관심 있는 세션을 미리 예약해 좌석을 확보해 보세요.
            </p>
            {bookingSubmitted ? (
              <div className="bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan p-5 rounded-2xl text-center space-y-2">
                <p className="text-sm font-bold">세션 예약 성공!</p>
                <p className="text-xs text-slate-300">입장 바코드 및 안내장이 기재된 예약 정보 메일이 발송되었습니다.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="예약자명" 
                  required 
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                />
                <input 
                  type="email" 
                  placeholder="안내받을 이메일" 
                  required 
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                />
                <button 
                  type="submit" 
                  className="w-full py-3 bg-brand-cyan hover:bg-brand-cyan-light text-slate-950 font-black text-xs rounded-xl shadow-lg btn-glow-cyan transition-all duration-300"
                >
                  사전 예약 완료하기
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Replay VOD Lightbox Modal */}
      {playingVod && (
        <div
          onClick={() => setPlayingVod(false)}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl glass-card rounded-3xl p-6 border border-white/10 space-y-4 relative overflow-hidden"
          >
            <button
              onClick={() => setPlayingVod(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold transition-colors"
            >
              ✕
            </button>

            <div className="space-y-1 text-left">
              <span className="bg-brand-cyan/25 text-brand-cyan text-[10px] font-black tracking-widest px-2.5 py-1 rounded">
                VOD REPLAY
              </span>
              <h3 className="text-md md:text-lg font-black text-white pt-2">{session.title}</h3>
              <p className="text-xs text-slate-400">발표자: {session.speaker}</p>
            </div>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-white/5 flex items-center justify-center">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Google Edtech VOD Replay Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            <p className="text-[11px] text-slate-500 text-center font-medium">
              * EdTech Korea Fair 공식 리플레이 VOD 스트리밍 서비스가 활성화되었습니다.
            </p>
          </div>
        </div>
      )}

    </main>
  );
}
