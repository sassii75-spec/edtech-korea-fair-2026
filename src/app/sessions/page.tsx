// src/app/sessions/page.tsx
"use client";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Link from "next/link";
import { fetchCollection } from "../../lib/firestore";

interface Session {
  id: string;
  title: string;
  speaker: string;
  time: string;
  tag: string;
  iconSrc: string;
  hasVod?: boolean;
}

const SAMPLE_SESSIONS: Session[] = [
  {
    id: "s1",
    title: "AI가 바꾸는 미래 교육 트렌드와 방향성",
    speaker: "김민우 박사 (미래교육연구소 소장)",
    time: "2026. 9. 17 | 10:00 AM - 11:15 AM",
    tag: "Keynote Speech",
    iconSrc: "/file.svg",
    hasVod: true,
  },
  {
    id: "s2",
    title: "메타버스와 교육 게이미피케이션의 실제 융합 사례",
    speaker: "이혜린 팀장 (EduGame Studio)",
    time: "2026. 9. 17 | 11:30 AM - 12:45 PM",
    tag: "Interactive Workshop",
    iconSrc: "/globe.svg",
    hasVod: true,
  },
  {
    id: "s3",
    title: "빅데이터 기반 맞춤형 학습 진단 및 대시보드 시스템 구축",
    speaker: "박지훈 교수 (한국대학교 컴퓨터공학과)",
    time: "2026. 9. 18 | 01:30 PM - 02:45 PM",
    tag: "Data Analytics",
    iconSrc: "/file.svg",
    hasVod: false,
  },
  {
    id: "s4",
    title: "글로벌 에듀테크 시장 진출 성공 전략 및 투자 유치 가이드",
    speaker: "Sarah Johnson (Global EdTech Capital 대표)",
    time: "2026. 9. 18 | 03:00 PM - 04:30 PM",
    tag: "Panel Talk",
    iconSrc: "/globe.svg",
    hasVod: true,
  },
];

const CATEGORIES = ["전체", "Keynote Speech", "Interactive Workshop", "Data Analytics", "Panel Talk"];

const TRENDS = [
  {
    id: "ALL",
    title: "🔍 전체 일정",
    desc: "모든 부대행사 및 스페셜 컨퍼런스 세션을 한눈에 조회합니다.",
    tags: []
  },
  {
    id: "AX",
    title: "🤖 AX 교육 혁신",
    desc: "인공지능 교사, 맞춤형 학습 대시보드 및 AI 공교육 융합 관련 핵심 세션",
    tags: ["Keynote Speech", "Data Analytics"]
  },
  {
    id: "GAME",
    title: "🎮 교육 게이미피케이션",
    desc: "메타버스 3D 가상 학습실 및 몰입도 높은 교육 게임 디자인 실전 세션",
    tags: ["Interactive Workshop"]
  },
  {
    id: "GLOBAL",
    title: "💼 글로벌 비즈니스 & 투자",
    desc: "해외 에듀테크 유니콘 벤치마킹, VC 피칭 및 글로벌 교육 유통 전략 세션",
    tags: ["Panel Talk"]
  }
];

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedTrend, setSelectedTrend] = useState("ALL");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [playingVod, setPlayingVod] = useState<Session | null>(null);

  useEffect(() => {
    fetchCollection<Session>("sessions", SAMPLE_SESSIONS).then(setSessions);
    // Load bookmarks from localStorage
    const saved = localStorage.getItem("myAgendaSessions");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  // Handle Bookmarking
  const toggleBookmark = (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault(); // Prevent navigating to detail page
    e.stopPropagation();
    let updated: string[];
    if (bookmarks.includes(sessionId)) {
      updated = bookmarks.filter(id => id !== sessionId);
    } else {
      updated = [...bookmarks, sessionId];
    }
    setBookmarks(updated);
    localStorage.setItem("myAgendaSessions", JSON.stringify(updated));
  };

  // Trigger VOD playback modal
  const playReplay = (e: React.MouseEvent, session: Session) => {
    e.preventDefault();
    e.stopPropagation();
    setPlayingVod(session);
  };

  // Handle Trend card selection
  const handleTrendSelect = (trendId: string) => {
    setSelectedTrend(trendId);
    setSelectedCategory("전체"); // Reset category filter to prevent conflicts
  };

  // Filtering Logic
  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Trend filters
    const activeTrendObj = TRENDS.find(t => t.id === selectedTrend);
    const matchesTrend = !activeTrendObj || activeTrendObj.id === "ALL" || activeTrendObj.tags.includes(s.tag);

    // Category filters
    const matchesCategory = selectedCategory === "전체" || s.tag === selectedCategory;

    return matchesSearch && matchesTrend && matchesCategory;
  });

  return (
    <main className="p-8 min-h-screen relative max-w-7xl mx-auto space-y-12">
      {/* Background glow overlay decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[250px] h-[250px] rounded-full bg-brand-cyan/5 blur-[90px]"></div>
      </div>

      <div className="text-center space-y-3 z-10 relative">
        <span className="bg-brand-cyan/25 text-brand-cyan text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full uppercase">
          CONFERENCE AGENDA
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
          부대행사 & 컨퍼런스 세션
        </h1>
        <p className="text-sm text-slate-400 font-medium">
          각 분야 최고의 전문가들이 전하는 미래 교육 테크놀로지 트렌드 세션을 검색, 북마크, 예약하고 다시보기해 보세요.
        </p>
      </div>

      {/* Content Trend Curation Section (Slide 3 콘텐츠 트렌드 큐레이션 실제 기능화) */}
      <div className="space-y-4 z-10 relative">
        <h3 className="text-md font-bold text-white pl-2 border-l-2 border-brand-cyan">
          🎯 주요 교육 콘텐츠 트렌드 큐레이션
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRENDS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTrendSelect(t.id)}
              className={`text-left p-5 rounded-2xl transition-all duration-300 border flex flex-col justify-between h-36 ${
                selectedTrend === t.id
                  ? "bg-brand-cyan/15 border-brand-cyan shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                  : "bg-slate-900/40 border-white/5 hover:border-brand-cyan/20"
              }`}
            >
              <div className="space-y-1.5">
                <h4 className={`text-xs font-black uppercase ${selectedTrend === t.id ? "text-brand-cyan" : "text-white"}`}>
                  {t.title}
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  {t.desc}
                </p>
              </div>
              <span className="text-[9px] font-black text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded self-start mt-2">
                {t.id === "ALL" ? "모든 세션" : `${t.tags.length}개 분야 추천`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-card rounded-3xl p-6 space-y-4 max-w-4xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search bar */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="세션 제목 또는 발표자 이름으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
            />
          </div>
          {/* Category drop down on mobile */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:hidden bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan font-bold"
            >
              {CATEGORIES.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category tags row */}
        <div className="hidden md:flex flex-wrap gap-2 pt-2">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-brand-cyan text-slate-950 shadow-[0_0_10px_rgba(45,212,191,0.25)]"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 z-10 relative">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((s) => {
            const isBookmarked = bookmarks.includes(s.id);
            return (
              <Link href={`/sessions/${s.id}`} key={s.id} className="block h-full relative group">
                {/* Card wrapper */}
                <Card
                  title={s.title}
                  description={`발표자: ${s.speaker}`}
                  imageSrc={s.iconSrc}
                  alt={s.title + " icon"}
                  date={s.time}
                  tag={s.tag}
                />

                {/* Bookmark & VOD absolute floating buttons */}
                <div className="absolute top-4 right-4 z-20 flex space-x-2">
                  {s.hasVod && (
                    <button
                      onClick={(e) => playReplay(e, s)}
                      className="p-2 bg-slate-950/80 hover:bg-brand-cyan border border-white/10 rounded-full text-brand-cyan hover:text-slate-950 transition-all duration-200 shadow-lg"
                      title="세션 다시보기 VOD"
                    >
                      ▶️
                    </button>
                  )}
                  <button
                    onClick={(e) => toggleBookmark(e, s.id)}
                    className={`p-2 bg-slate-950/80 border border-white/10 rounded-full transition-all duration-200 shadow-lg text-sm ${
                      isBookmarked ? "text-yellow-400 border-yellow-500/40" : "text-slate-400 hover:text-yellow-400"
                    }`}
                    title={isBookmarked ? "즐겨찾기 취소" : "관심 세션 추가 (즐겨찾기)"}
                  >
                    ⭐
                  </button>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-slate-500 text-sm font-medium">
            조건에 부합하는 세션이 존재하지 않습니다.
          </div>
        )}
      </div>

      {/* Replay VOD Lightbox Modal */}
      {playingVod && (
        <div
          onClick={() => setPlayingVod(null)}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl glass-card rounded-3xl p-6 border border-white/10 space-y-4 relative overflow-hidden"
          >
            <button
              onClick={() => setPlayingVod(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold transition-colors"
            >
              ✕
            </button>

            <div className="space-y-1 text-left">
              <span className="bg-brand-cyan/25 text-brand-cyan text-[10px] font-black tracking-widest px-2.5 py-1 rounded">
                VOD REPLAY
              </span>
              <h3 className="text-md md:text-lg font-black text-white pt-2">{playingVod.title}</h3>
              <p className="text-xs text-slate-400">발표자: {playingVod.speaker}</p>
            </div>

            {/* Video mockup player using an educational placeholder */}
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
