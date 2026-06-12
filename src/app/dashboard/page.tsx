// src/app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../../context/AuthProvider";
import Link from "next/link";
import { fetchCollection } from "../../lib/firestore";

interface Session {
  id: string;
  title: string;
  speaker: string;
  time: string;
  tag: string;
  iconSrc: string;
}

const SAMPLE_SESSIONS: Session[] = [
  {
    id: "s1",
    title: "AI가 바꾸는 미래 교육 트렌드와 방향성",
    speaker: "김민우 박사 (미래교육연구소 소장)",
    time: "2026. 9. 17 | 10:00 AM - 11:15 AM",
    tag: "Keynote Speech",
    iconSrc: "/file.svg",
  },
  {
    id: "s2",
    title: "메타버스와 교육 게이미피케이션의 실제 융합 사례",
    speaker: "이혜린 팀장 (EduGame Studio)",
    time: "2026. 9. 17 | 11:30 AM - 12:45 PM",
    tag: "Interactive Workshop",
    iconSrc: "/globe.svg",
  },
  {
    id: "s3",
    title: "빅데이터 기반 맞춤형 학습 진단 및 대시보드 시스템 구축",
    speaker: "박지훈 교수 (한국대학교 컴퓨터공학과)",
    time: "2026. 9. 18 | 01:30 PM - 02:45 PM",
    tag: "Data Analytics",
    iconSrc: "/file.svg",
  },
  {
    id: "s4",
    title: "글로벌 에듀테크 시장 진출 성공 전략 및 투자 유치 가이드",
    speaker: "Sarah Johnson (Global EdTech Capital 대표)",
    time: "2026. 9. 18 | 03:00 PM - 04:30 PM",
    tag: "Panel Talk",
    iconSrc: "/globe.svg",
  },
];

interface Lead {
  name: string;
  organization: string;
  role: string;
  interest: string;
  date: string;
}

const MOCK_LEADS: Lead[] = [
  { name: "김*우", organization: "서울초등학교", role: "초등 교사", interest: "[웅진씽크빅] AI 디지털 스마트올 교과서 도입 문의", date: "2026-06-12" },
  { name: "박*준", organization: "(주)에듀넷아시아", role: "에듀테크 바이어/투자자", interest: "[웅진씽크빅] 글로벌 교육 콘텐츠 퍼블리싱 파트너십", date: "2026-06-12" },
  { name: "최*영", organization: "경기외국어고등학교", role: "초등/중등 교사", interest: "[엘리스그룹] 엘리스 코딩 가상실습 LXP 단체 계약", date: "2026-06-11" },
  { name: "이*민", organization: "에듀파트너스 VC", role: "에듀테크 바이어/투자자", interest: "[클라썸] 클라썸 시리즈 B 투자 유치 상담 메일", date: "2026-06-11" },
];

const INITIAL_REVIEWS: Record<string, any[]> = {
  "웅진씽크빅": [
    { rating: 5 },
    { rating: 4 }
  ],
  "아이스크림에듀": [
    { rating: 5 }
  ],
  "엘리스그룹": [
    { rating: 5 }
  ],
  "클라썸": [
    { rating: 5 }
  ]
};

export default function DashboardPage() {
  const { user, signOutUser } = useAuth();
  const [bookmarkedSessions, setBookmarkedSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<"attendee" | "b2b">("attendee");

  // Interactive Target Marketing Role states
  const [userRole, setUserRole] = useState<string | null>(null);

  // Dynamic B2B states
  const [customLeads, setCustomLeads] = useState<Lead[]>([]);
  const [avgRating, setAvgRating] = useState<string>("4.8");

  useEffect(() => {
    const load = async () => {
      // 1. Load bookmarked sessions
      const allSessions = await fetchCollection<Session>("sessions", SAMPLE_SESSIONS);
      const saved = localStorage.getItem("myAgendaSessions");
      if (saved) {
        const ids = JSON.parse(saved);
        const filtered = allSessions.filter(s => ids.includes(s.id));
        setBookmarkedSessions(filtered);
      }

      // 2. Load selected user role
      const savedRole = localStorage.getItem("userRole");
      if (savedRole) {
        setUserRole(savedRole);
      }

      // 3. Load B2B leads from localStorage
      const savedLeads = localStorage.getItem("b2b_leads");
      if (savedLeads) {
        setCustomLeads(JSON.parse(savedLeads));
      }

      // 4. Calculate dynamic average reviews score
      const companyIds = ["웅진씽크빅", "아이스크림에듀", "엘리스그룹", "클라썸", "팀스파르타", "알럭스"];
      let totalRating = 0;
      let totalCount = 0;
      companyIds.forEach(id => {
        const savedRev = localStorage.getItem(`reviews_${id}`);
        if (savedRev) {
          const parsed = JSON.parse(savedRev);
          parsed.forEach((r: any) => {
            totalRating += Number(r.rating);
            totalCount += 1;
          });
        } else {
          const init = INITIAL_REVIEWS[id] || [];
          init.forEach((r: any) => {
            totalRating += r.rating;
            totalCount += 1;
          });
        }
      });
      if (totalCount > 0) {
        setAvgRating((totalRating / totalCount).toFixed(1));
      }
    };
    load();
  }, []);

  const handleRoleSelect = (role: string) => {
    setUserRole(role);
    localStorage.setItem("userRole", role);
  };

  const resetRole = () => {
    setUserRole(null);
    localStorage.removeItem("userRole");
  };

  const removeBookmark = (sessionId: string) => {
    const saved = localStorage.getItem("myAgendaSessions");
    if (saved) {
      const ids: string[] = JSON.parse(saved);
      const updated = ids.filter(id => id !== sessionId);
      localStorage.setItem("myAgendaSessions", JSON.stringify(updated));
      setBookmarkedSessions(prev => prev.filter(s => s.id !== sessionId));
    }
  };

  // Combine custom leads from form submissions with mock leads
  const allLeads = [...customLeads, ...MOCK_LEADS];

  return (
    <ProtectedRoute>
      <main className="p-6 md:p-12 min-h-screen max-w-6xl mx-auto space-y-10 relative z-10 font-sans">
        
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="bg-brand-cyan/25 text-brand-cyan text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full uppercase">
            MY PORTAL & B2B ROI
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
            주최/주관 & 나의 아젠다
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            사전등록 관람 티켓 및 즐겨찾기한 세션 일정을 관리하고, 주최자용 B2B ROI 통계 리포트를 조회해 보세요.
          </p>
        </div>

        {/* Dashboard Tab Selector */}
        <div className="flex items-center justify-center space-x-4 border-b border-white/5 pb-2 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("attendee")}
            className={`flex-1 py-3 text-xs md:text-sm font-black transition-all duration-300 border-b-2 ${
              activeTab === "attendee"
                ? "border-brand-cyan text-brand-cyan"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            🎫 참관객 티켓 & 아젠다
          </button>
          <button
            onClick={() => setActiveTab("b2b")}
            className={`flex-1 py-3 text-xs md:text-sm font-black transition-all duration-300 border-b-2 ${
              activeTab === "b2b"
                ? "border-brand-cyan text-brand-cyan"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            📊 B2B 주최/기업 ROI 통계
          </button>
        </div>

        {/* Attendee Portal View */}
        {activeTab === "attendee" && (
          <div className="space-y-8">
            
            {/* Targeted Marketing Personalization Selector (핵심기능 3: 참가자 타깃 마케팅 실제 기능화) */}
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-brand-cyan/20 shadow-[0_0_20px_rgba(45,212,191,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-2xl"></div>
              
              {!userRole ? (
                <div className="space-y-4 relative z-10 text-center max-w-2xl mx-auto">
                  <h3 className="text-sm font-black text-brand-cyan uppercase tracking-wider">🎯 개인 맞춤 큐레이션 서비스</h3>
                  <p className="text-xs md:text-sm text-white font-bold leading-relaxed">
                    귀하의 참관 그룹을 선택하시면 박람회에서 놓치지 말아야 할 맞춤형 추천 세션과 부스를 제공해 드립니다.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => handleRoleSelect("교사")}
                      className="px-5 py-2.5 bg-slate-900 border border-white/10 hover:border-brand-cyan/35 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition-all"
                    >
                      🏫 미래교육 실천 (교사)
                    </button>
                    <button
                      onClick={() => handleRoleSelect("투자자")}
                      className="px-5 py-2.5 bg-slate-900 border border-white/10 hover:border-brand-cyan/35 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition-all"
                    >
                      💼 비즈니스/투자 (바이어)
                    </button>
                    <button
                      onClick={() => handleRoleSelect("일반")}
                      className="px-5 py-2.5 bg-slate-900 border border-white/10 hover:border-brand-cyan/35 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition-all"
                    >
                      🔍 트렌드 체험 (일반 관람객)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="flex items-center space-x-3">
                      <span className="w-2.5 h-2.5 bg-brand-cyan rounded-full animate-pulse"></span>
                      <span className="text-xs font-black text-brand-cyan bg-brand-cyan/10 px-3 py-1 rounded-full">
                        {userRole === "교사" ? "🏫 미래교육 실천 그룹 (교사)" : userRole === "투자자" ? "💼 비즈니스/파트너십 그룹 (바이어)" : "🔍 트렌드 체험 그룹 (일반 참관객)"}
                      </span>
                    </div>
                    <button
                      onClick={resetRole}
                      className="text-[10px] text-slate-500 hover:text-white font-bold border border-white/5 hover:border-white/20 px-3 py-1 rounded-lg transition-colors"
                    >
                      그룹 변경
                    </button>
                  </div>

                  {/* Curated Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recommended Companies */}
                    <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 space-y-3">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        💡 추천 참가 부스
                      </h4>
                      <div className="space-y-2">
                        {userRole === "교사" && (
                          <>
                            <Link href="/companies/웅진씽크빅" className="block p-3 bg-slate-900/60 hover:bg-slate-900 border border-white/5 rounded-xl text-left transition-colors">
                              <span className="text-xs font-bold text-white block">웅진씽크빅 (A-120 부스)</span>
                              <span className="text-[10px] text-slate-400 font-medium">AI 맞춤형 학습 솔루션 '웅진스마트올' 교사용 대시보드 시연</span>
                            </Link>
                            <Link href="/companies/아이스크림에듀" className="block p-3 bg-slate-900/60 hover:bg-slate-900 border border-white/5 rounded-xl text-left transition-colors">
                              <span className="text-xs font-bold text-white block">아이스크림에듀 (A-240 부스)</span>
                              <span className="text-[10px] text-slate-400 font-medium">1,600만 빅데이터 기반 공교육 연계 'AI 생활기록부' 체험</span>
                            </Link>
                          </>
                        )}
                        {userRole === "투자자" && (
                          <>
                            <Link href="/companies/엘리스그룹" className="block p-3 bg-slate-900/60 hover:bg-slate-900 border border-white/5 rounded-xl text-left transition-colors">
                              <span className="text-xs font-bold text-white block">엘리스그룹 (B-210 부스)</span>
                              <span className="text-[10px] text-slate-400 font-medium">클라우드 가상 컴퓨터 코딩 교육 인프라 및 대기업 교육 실적 설명</span>
                            </Link>
                            <Link href="/companies/클라썸" className="block p-3 bg-slate-900/60 hover:bg-slate-900 border border-white/5 rounded-xl text-left transition-colors">
                              <span className="text-xs font-bold text-white block">클라썸 (A-310 부스)</span>
                              <span className="text-[10px] text-slate-400 font-medium">질문 소셜 소통 플랫폼 및 AI DOT 질문 비서 B2B 계약 상담</span>
                            </Link>
                          </>
                        )}
                        {userRole === "일반" && (
                          <>
                            <Link href="/companies/알럭스" className="block p-3 bg-slate-900/60 hover:bg-slate-900 border border-white/5 rounded-xl text-left transition-colors">
                              <span className="text-xs font-bold text-white block">알럭스 (B-405 부스)</span>
                              <span className="text-[10px] text-slate-400 font-medium">로봇 조립 및 알고리즘 코딩 교구재 현장 메이킹 체험 공간</span>
                            </Link>
                            <Link href="/companies/팀스파르타" className="block p-3 bg-slate-900/60 hover:bg-slate-900 border border-white/5 rounded-xl text-left transition-colors">
                              <span className="text-xs font-bold text-white block">팀스파르타 (B-105 부스)</span>
                              <span className="text-[10px] text-slate-400 font-medium">스파르타코딩클럽 실무형 코딩 교육 및 게이미피케이션 커리큘럼 소개</span>
                            </Link>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Recommended Sessions */}
                    <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 space-y-3">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        📅 추천 부대 세션
                      </h4>
                      <div className="space-y-2">
                        {userRole === "교사" && (
                          <>
                            <Link href="/sessions/s1" className="block p-3 bg-slate-900/60 hover:bg-slate-900 border border-white/5 rounded-xl text-left transition-colors">
                              <span className="text-xs font-bold text-white block">AI가 바꾸는 미래 교육 트렌드</span>
                              <span className="text-[10px] text-brand-cyan font-bold">Keynote Speech | 9. 17 10:00 AM</span>
                            </Link>
                            <Link href="/sessions/s3" className="block p-3 bg-slate-900/60 hover:bg-slate-900 border border-white/5 rounded-xl text-left transition-colors">
                              <span className="text-xs font-bold text-white block">빅데이터 기반 맞춤형 학습 진단 시스템</span>
                              <span className="text-[10px] text-brand-cyan font-bold">Data Analytics | 9. 18 01:30 PM</span>
                            </Link>
                          </>
                        )}
                        {userRole === "투자자" && (
                          <>
                            <Link href="/sessions/s4" className="block p-3 bg-slate-900/60 hover:bg-slate-900 border border-white/5 rounded-xl text-left transition-colors">
                              <span className="text-xs font-bold text-white block">글로벌 에듀테크 시장 진출 & 투자 가이드</span>
                              <span className="text-[10px] text-brand-cyan font-bold">Panel Talk | 9. 18 03:00 PM</span>
                            </Link>
                          </>
                        )}
                        {userRole === "일반" && (
                          <>
                            <Link href="/sessions/s2" className="block p-3 bg-slate-900/60 hover:bg-slate-900 border border-white/5 rounded-xl text-left transition-colors">
                              <span className="text-xs font-bold text-white block">메타버스와 교육 게이미피케이션 실제 융합</span>
                              <span className="text-[10px] text-brand-cyan font-bold">Interactive Workshop | 9. 17 11:30 AM</span>
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              
              {/* Left: Attendee Ticket Pass Card */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-lg font-bold text-white pl-1 border-l-2 border-brand-cyan">나의 참관 입장권</h3>
                
                {user && (
                  <div className="glass-card rounded-3xl p-6 space-y-6 border border-white/5 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-cyan to-transparent animate-pulse-slow"></div>

                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-brand-cyan tracking-widest uppercase bg-brand-cyan/10 px-2.5 py-1 rounded-md">
                          ATTENDEE PASS
                        </span>
                        <p className="text-xs font-semibold text-slate-400 mt-2">사전등록 번호</p>
                        <p className="text-md font-black text-white tracking-widest">ED2026-98745</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20">
                          CONFIRMED
                        </span>
                      </div>
                    </div>

                    {/* Simulated QR Code / Barcode styling */}
                    <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 shadow-inner">
                      <div className="w-full h-12 flex items-center justify-between px-2 bg-slate-950 rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 flex justify-around items-stretch py-2 opacity-95">
                          <div className="w-[3px] bg-white"></div>
                          <div className="w-[1px] bg-white"></div>
                          <div className="w-[5px] bg-white"></div>
                          <div className="w-[2px] bg-white"></div>
                          <div className="w-[4px] bg-white"></div>
                          <div className="w-[1px] bg-white"></div>
                          <div className="w-[3px] bg-white"></div>
                          <div className="w-[2px] bg-white"></div>
                          <div className="w-[5px] bg-white"></div>
                          <div className="w-[1px] bg-white"></div>
                          <div className="w-[3px] bg-white"></div>
                          <div className="w-[4px] bg-white"></div>
                          <div className="w-[1px] bg-white"></div>
                          <div className="w-[2px] bg-white"></div>
                          <div className="w-[5px] bg-white"></div>
                          <div className="w-[1px] bg-white"></div>
                          <div className="w-[3px] bg-white"></div>
                          <div className="w-[2px] bg-white"></div>
                          <div className="w-[4px] bg-white"></div>
                          <div className="w-[1px] bg-white"></div>
                          <div className="w-[3px] bg-white"></div>
                          <div className="w-[5px] bg-white"></div>
                          <div className="w-[2px] bg-white"></div>
                          <div className="w-[4px] bg-white"></div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-800 font-black tracking-widest uppercase">
                        EDTECH KOREA FAIR 2026
                      </span>
                    </div>

                    {/* Ticket Info Section */}
                    <div className="space-y-4 border-t border-white/5 pt-6 text-xs font-semibold">
                      <div className="flex justify-between">
                        <span className="text-slate-400">등록 계정</span>
                        <span className="text-white">{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">행사 기간</span>
                        <span className="text-white">2026. 9. 17(목) - 19(토)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">전시 장소</span>
                        <span className="text-brand-cyan">서울 코엑스 A홀</span>
                      </div>
                    </div>

                    {/* Logout button */}
                    <button
                      onClick={signOutUser}
                      className="w-full py-3 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-white/10 transition-all duration-200"
                    >
                      로그아웃
                    </button>

                  </div>
                )}
              </div>

              {/* Right: Bookmarked Sessions List */}
              <div className="lg:col-span-3 space-y-6">
                <h3 className="text-lg font-bold text-white pl-1 border-l-2 border-brand-cyan">나의 관심 세션 (My Agenda)</h3>

                {bookmarkedSessions.length > 0 ? (
                  <div className="space-y-4">
                    {bookmarkedSessions.map((s) => (
                      <div 
                        key={s.id} 
                        className="glass-card rounded-2xl p-5 border border-white/5 hover:border-brand-cyan/20 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300"
                      >
                        <div className="space-y-2">
                          <span className="bg-brand-cyan/15 text-brand-cyan text-[10px] font-black tracking-widest px-2.5 py-1 rounded">
                            {s.tag}
                          </span>
                          <h4 className="text-md font-bold text-white pt-1">{s.title}</h4>
                          <p className="text-xs text-slate-400">발표자: {s.speaker} | {s.time}</p>
                        </div>
                        
                        <div className="flex items-center space-x-3 mt-2 md:mt-0">
                          <Link 
                            href={`/sessions/${s.id}`}
                            className="bg-brand-cyan text-slate-950 px-4 py-2 rounded-xl text-xs font-black hover:bg-brand-cyan-light shadow-lg transition-colors"
                          >
                            상세보기
                          </Link>
                          <button
                            onClick={() => removeBookmark(s.id)}
                            className="p-2 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded-xl text-xs font-bold transition-colors"
                            title="아젠다에서 삭제"
                          >
                            제거
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card rounded-3xl p-10 text-center border border-white/5 space-y-4">
                    <p className="text-slate-400 text-xs md:text-sm font-medium">
                      아직 즐겨찾기에 추가한 관심 세션이 없습니다. <br className="hidden sm:inline" />
                      컨퍼런스 일정을 둘러보고 관심 있는 아젠다를 추가해 보세요!
                    </p>
                    <Link
                      href="/sessions"
                      className="inline-block bg-brand-cyan text-slate-950 px-6 py-2.5 rounded-full text-xs font-black hover:bg-brand-cyan-light shadow-lg transition-all duration-200 btn-glow-cyan"
                    >
                      컨퍼런스 세션 보러가기
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* B2B Sponsor & Exhibitor ROI Analytics View (핵심기능 3: 모객 및 애프터 서비스 실제 기능화) */}
        {activeTab === "b2b" && (
          <div className="space-y-8">
            
            {/* ROI Key metrics layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Metric 1 */}
              <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  🎯 총 획득 바이어 리드 수 (Lead Captures)
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-white">{1420 + customLeads.length}</span>
                  <span className="text-xs text-emerald-400 font-bold">▲ 14.5% 전년비</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">B2B 상담 신청 및 QR 리드 스캔 누계 (실시간 반영)</p>
              </div>

              {/* Metric 2 */}
              <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  ⭐ 평균 부스 만족도 평점 (Reviews Average)
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-brand-cyan">{avgRating}</span>
                  <span className="text-xs text-slate-400 font-bold">/ 5.0</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">관람객이 남긴 평판 만족도 (실시간 집계)</p>
              </div>

              {/* Metric 3 */}
              <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  💼 비즈니스 계약 상담 전환율 (Conversion Rate)
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-white">18.5%</span>
                  <span className="text-xs text-brand-cyan font-bold">목표 초과 달성</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">상담 신청 바이어 중 계약 조율 진행비</p>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Booth Visit Analytics (부스별 방문자 통계 - CSS Bar Chart) */}
              <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
                <h4 className="text-sm font-bold text-white pl-1 border-l-2 border-brand-cyan">
                  📈 인기 부스별 누적 방문 데이터 (Top Booth Visits)
                </h4>
                
                <div className="space-y-4 pt-2">
                  {/* Item 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">엘리스그룹 (B-210)</span>
                      <span className="text-white">610명</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-brand-cyan h-full rounded-full" style={{ width: "95%" }}></div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">아이스크림에듀 (A-240)</span>
                      <span className="text-white">520명</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-brand-cyan h-full rounded-full" style={{ width: "82%" }}></div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">웅진씽크빅 (A-120)</span>
                      <span className="text-white">480명</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-brand-cyan h-full rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">클라썸 (A-310)</span>
                      <span className="text-white">420명</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-brand-cyan h-full rounded-full" style={{ width: "66%" }}></div>
                    </div>
                  </div>

                  {/* Item 5 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">팀스파르타 (B-105)</span>
                      <span className="text-white">380명</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-brand-cyan/65 h-full rounded-full" style={{ width: "58%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Attendance & Content Preference */}
              <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
                
                {/* Section 1 */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white pl-1 border-l-2 border-brand-cyan">
                    💡 세션 참여율 (Attendance Rates)
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                      <span className="text-slate-400 text-[10px]">Keynote Speech</span>
                      <p className="text-sm font-bold text-white mt-1">94% (Full)</p>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                      <span className="text-slate-400 text-[10px]">Workshop</span>
                      <p className="text-sm font-bold text-white mt-1">85%</p>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                      <span className="text-slate-400 text-[10px]">Panel Talk</span>
                      <p className="text-sm font-bold text-white mt-1">88%</p>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                      <span className="text-slate-400 text-[10px]">Data Analytics</span>
                      <p className="text-sm font-bold text-white mt-1">72%</p>
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white pl-1 border-l-2 border-brand-cyan">
                    🎯 선호 교육 분야 (Content Preferences)
                  </h4>
                  <div className="space-y-2 text-xs font-semibold">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">인공지능 교육 (AI/ML)</span>
                      <span className="text-brand-cyan">45%</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">게이미피케이션 (Gamification)</span>
                      <span className="text-slate-400">25%</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">소셜 학습관리 (LXP/LMS)</span>
                      <span className="text-slate-400">20%</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Lead Management Database (실시간 획득 리드 데이터 관리 - CRM DB) */}
              <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
                <h4 className="text-sm font-bold text-white pl-1 border-l-2 border-brand-cyan">
                  🗃️ B2B 리드 획득 정보 관리 (Lead CRM DB)
                </h4>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {allLeads.map((l, i) => (
                    <div key={i} className="p-3 bg-slate-900/60 rounded-xl border border-white/5 space-y-1.5 text-left transition-all duration-300 hover:border-brand-cyan/20">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-white">{l.name} ({l.role})</span>
                        <span className="text-[10px] text-slate-500">{l.date}</span>
                      </div>
                      <p className="text-[10px] text-brand-cyan font-bold leading-none">{l.organization}</p>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{l.interest}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>
    </ProtectedRoute>
  );
}
