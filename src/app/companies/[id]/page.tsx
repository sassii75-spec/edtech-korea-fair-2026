"use client";
// src/app/companies/[id]/page.tsx
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { fetchCollection } from "../../../lib/firestore";

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  tag: string;
  boothLocation?: string;
  website?: string;
  contactEmail?: string;
}

const SAMPLE_COMPANIES: Company[] = [
  {
    id: "웅진씽크빅",
    name: "웅진씽크빅 (Woongjin Thinkbig)",
    logo: "/file.svg",
    description: "웅진씽크빅은 40여 년간 쌓아온 양질의 교육 콘텐츠와 업계 최대 수준의 에듀테크 기술력을 융합하여 맞춤형 전과목 스마트 교육 서비스 '웅진스마트올'을 성공적으로 운영하고 있습니다. 독자적인 AI 맞춤 분석 시스템을 적용하여 학습자의 오답 경향과 습관을 정밀 추적하고 맞춤 문제를 즉시 생성하여 학습 완독율을 극대화합니다.",
    tag: "AI / 학습 콘텐츠",
    boothLocation: "A홀 - A-120 부스",
    website: "https://www.wjthinkbig.com",
    contactEmail: "smartall@wjthinkbig.com",
  },
  {
    id: "아이스크림에듀",
    name: "아이스크림에듀 (i-Scream Edu)",
    logo: "/globe.svg",
    description: "아이스크림에듀는 초중등 스마트 홈러닝 브랜드 '아이스크림 홈런'으로 공교육과 홈스쿨링을 잇는 에듀테크 선두 기업입니다. 자체 인공지능 생활기록부 시스템을 탑재하여 일평면 1,600만 건 이상의 학습 빅데이터를 실시간 정밀 분석하고, 학생 개개인에게 매일 최적화된 맞춤 커리큘럼과 올바른 자기주도 학습 습관 형성 리포트를 전달합니다.",
    tag: "AI 평가 / 스마트 러닝",
    boothLocation: "A홀 - A-240 부스",
    website: "https://www.i-screamedu.co.kr",
    contactEmail: "home-run@i-screamedu.co.kr",
  },
  {
    id: "엘리스그룹",
    name: "엘리스그룹 (Elice Group)",
    logo: "/file.svg",
    description: "엘리스그룹은 자체 기술력으로 구축한 교육용 클라우드 환경 및 인공지능 플랫폼 '엘리스 LXP'를 바탕으로 SW/AI 코딩 교육 및 디지털 교과서 생태계를 선도하고 있습니다. 별도의 개발 서버 환경 설정 없이 웹 브라우저 내에서 바로 실행되는 실시간 가상 코딩 실습실과 실시간 자동 코드 채점 시스템을 통해 효과적인 IT 실무 인재를 양성합니다.",
    tag: "AI LXP / 코딩 교육",
    boothLocation: "B홀 - B-210 부스",
    website: "https://elice.io",
    contactEmail: "contact@elice.io",
  },
  {
    id: "클라썸",
    name: "클라썸 (Classum)",
    logo: "/globe.svg",
    description: "클라썸은 질문을 중심으로 구성원 간 자유로운 소통과 지식 공유를 이끄는 SaaS 기반 교육 소통 플랫폼입니다. 질문과 답변, 토론의 장벽을 대폭 낮추고 사내 지식 및 교육 기록을 자동 자산화하여 대학, 학교, 대기업의 업무 생산성과 교육 만족도를 혁신하고 있습니다. 인공지능 보조 기능인 AI DOT가 상주하여 유사 질문에 즉시 지능적으로 응답합니다.",
    tag: "소통 플랫폼 / SaaS",
    boothLocation: "A홀 - A-310 부스",
    website: "https://www.classum.com",
    contactEmail: "support@classum.com",
  },
  {
    id: "팀스파르타",
    name: "팀스파르타 (Team Sparta)",
    logo: "/file.svg",
    description: "팀스파르타는 '누구나 코딩할 수 있는 세상'을 미션으로 실무형 코딩 교육 서비스 '스파르타코딩클럽'과 개발자 양성 부트캠프 '항해99'를 운영하고 있습니다. 나아가 기업고객을 위한 맞춤형 디지털 전환(DX) 교육, 신사업 기획 프로젝트, 사내 AI 빌더 프로그램 설계 등 실용적 테크 지식 내재화 파트너로서 비즈니스 가치를 더합니다.",
    tag: "SW 코딩 교육 / B2B",
    boothLocation: "B홀 - B-105 부스",
    website: "https://spartacodingclub.kr",
    contactEmail: "b2b@spartacodingclub.kr",
  },
  {
    id: "알럭스",
    name: "알럭스 (ALUX)",
    logo: "/globe.svg",
    description: "알럭스는 로봇, 하드웨어 교구재 코딩부터 인공지능 융합 교육에 이르기까지 디지털 교육 생태계를 종합적으로 구축하는 전문 기업입니다. 융합 사고력을 기르는 자체 로봇 조립 교구 키트 및 블록 코딩 알고리즘 학습 교안 개발, 방과 후 학교 강사 교육 네트워크 등을 바탕으로 코딩 교육의 진입 장벽을 낮추는 글로벌 파트너입니다.",
    tag: "로봇 코딩 / 교구",
    boothLocation: "B홀 - B-405 부스",
    website: "https://www.aluxonline.com",
    contactEmail: "alux@aluxonline.com",
  },
];

const INITIAL_REVIEWS: Record<string, Review[]> = {
  "웅진씽크빅": [
    { name: "김*원 (초등 교사)", rating: 5, comment: "아이들이 스마트올 패드로 학습 완독율이 올라가는 이유를 부스 시연을 보고 체감했네요. AI 진단 속도가 놀라울 정도로 빠릅니다.", date: "2026-06-12" },
    { name: "이*수 (바이어)", rating: 4, comment: "콘텐츠 뎁스가 상당해서 동남아 교육 시장 진출 가능성이 엿보입니다. 부스 상담 잘 받았습니다.", date: "2026-06-11" }
  ],
  "아이스크림에듀": [
    { name: "박*아 (학부모)", rating: 5, comment: "홈런 AI 생활기록부 대시보드가 참 직관적이네요. 실시간 밀착 진단 기능이 마음에 듭니다.", date: "2026-06-12" }
  ],
  "엘리스그룹": [
    { name: "정*우 (대학 교수)", rating: 5, comment: "웹 브라우저 상의 서버 가상 가동 및 실습 환경 연동이 매우 매끄럽네요. 대학 코딩 전공 수업에 즉시 도입하고 싶어 문의 드렸습니다.", date: "2026-06-12" }
  ],
  "클라썸": [
    { name: "최*진 (기업 교육담당)", rating: 5, comment: "사내 직무 교육 소통을 위해 기존 메신저 대신 클라썸을 검토 중이었는데, AI DOT 챗봇의 지능적 분류 기능을 직접 해보니 대단합니다.", date: "2026-06-11" }
  ]
};

export default function CompanyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [consultSubmitted, setConsultSubmitted] = useState<boolean>(false);
  const [consultName, setConsultName] = useState("");
  const [consultEmail, setConsultEmail] = useState("");
  const [consultComment, setConsultComment] = useState("");
  
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await fetchCollection<Company>("companies", SAMPLE_COMPANIES);
      const decodedId = decodeURIComponent(id as string);
      const found = data.find((c) => c.id === decodedId);
      setCompany(found || null);

      if (found) {
        // Load existing reviews from state or local storage
        const savedReviews = localStorage.getItem(`reviews_${found.id}`);
        if (savedReviews) {
          setReviews(JSON.parse(savedReviews));
        } else {
          const init = INITIAL_REVIEWS[found.id] || [];
          setReviews(init);
        }
      }
    };
    load();
  }, [id]);

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">기업 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName || !consultEmail || !consultComment) return;

    const savedLeads = localStorage.getItem("b2b_leads");
    const leadsList = savedLeads ? JSON.parse(savedLeads) : [];
    
    const savedRole = localStorage.getItem("userRole") || "바이어";
    const newLead = {
      name: consultName,
      organization: consultEmail.split("@")[0].toUpperCase() + " 에듀",
      role: savedRole === "교사" ? "초등/중등 교사" : savedRole === "투자자" ? "에듀테크 바이어/투자자" : "일반 참관객",
      interest: `[${company.name}] ${consultComment}`,
      date: new Date().toISOString().split("T")[0]
    };

    localStorage.setItem("b2b_leads", JSON.stringify([newLead, ...leadsList]));

    setConsultSubmitted(true);
    setConsultName("");
    setConsultEmail("");
    setConsultComment("");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewComment) return;

    const newRev: Review = {
      name: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString().split("T")[0]
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    localStorage.setItem(`reviews_${company.id}`, JSON.stringify(updated));

    // Reset inputs
    setNewReviewName("");
    setNewReviewRating(5);
    setNewReviewComment("");
  };

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "평가 없음";

  return (
    <main className="p-6 md:p-12 min-h-screen max-w-5xl mx-auto space-y-8 relative z-10">
      
      {/* Back button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200 font-semibold text-sm"
      >
        <span>←</span>
        <span>목록으로 돌아가기</span>
      </button>

      {/* Main card grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Detail card & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Company main info card */}
          <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div className="space-y-1">
                <span className="bg-brand-cyan/20 text-brand-cyan text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                  {company.tag}
                </span>
                <h1 className="text-3xl font-black text-white pt-2">{company.name}</h1>
              </div>
              {company.boothLocation && (
                <div className="bg-slate-900 border border-brand-cyan/30 text-brand-cyan text-xs font-bold px-4 py-2 rounded-xl">
                  📍 {company.boothLocation}
                </div>
              )}
            </div>

            <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/5">
              <Image 
                src={company.logo} 
                alt={company.name} 
                fill 
                className="object-cover" 
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">기업 소개</h2>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base font-medium">
                {company.description}
              </p>
            </div>
          </div>

          {/* Interactive Reviews & Ratings Section (기업 만족도 및 후기 평가) */}
          <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-lg font-bold text-white">⭐ 방문 리뷰 및 만족도 평가</h2>
              <div className="flex items-center space-x-2 bg-brand-cyan/10 px-3.5 py-1.5 rounded-xl border border-brand-cyan/20">
                <span className="text-[10px] font-black text-slate-400">평균 만족도</span>
                <span className="text-sm font-black text-brand-cyan">{avgRating} / 5.0</span>
              </div>
            </div>

            {/* Review Input Form */}
            <form onSubmit={handleReviewSubmit} className="space-y-4 bg-slate-900/40 p-5 rounded-2xl border border-white/5">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">방문 후기 작성하기</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">작성자명 / 직함</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 홍길동 (교사 / 바이어)"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">만족도 점수</label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan font-bold"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5점 - 최고)</option>
                    <option value="4">⭐⭐⭐⭐ (4점 - 우수)</option>
                    <option value="3">⭐⭐⭐ (3점 - 보통)</option>
                    <option value="2">⭐⭐ (2점 - 미흡)</option>
                    <option value="1">⭐ (1점 - 개선 필요)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">후기 내용</label>
                <textarea
                  required
                  placeholder="부스 체험 경험, 솔루션 만족도, 비즈니스 연계 소감 등을 솔직하게 기재해 주세요."
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan transition-colors"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-brand-cyan hover:bg-brand-cyan-light text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all duration-300"
              >
                리뷰 등록하기
              </button>
            </form>

            {/* Reviews list */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((r, i) => (
                  <div key={i} className="p-4 bg-slate-950/20 border border-white/5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{r.name}</span>
                        <span className="text-yellow-400 font-bold">{"⭐".repeat(r.rating)}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{r.date}</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
                      {r.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 text-xs py-4">등록된 리뷰가 없습니다. 첫 리뷰를 작성해보세요!</p>
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Contact & Consulting widget */}
        <div className="space-y-6">
          {/* Info Card */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h3 className="text-md font-bold text-white border-b border-white/5 pb-3">상세 연락처</h3>
            <div className="space-y-3 text-xs md:text-sm font-medium">
              {company.website && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">공식 웹사이트</span>
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-brand-cyan hover:underline"
                  >
                    바로가기 ↗
                  </a>
                </div>
              )}
              {company.contactEmail && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">대표 이메일</span>
                  <span className="text-slate-200">{company.contactEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Consultation Form */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h3 className="text-md font-bold text-white border-b border-white/5 pb-3">💡 1:1 비즈니스 상담 신청</h3>
            {consultSubmitted ? (
              <div className="bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan p-4 rounded-2xl text-center space-y-2">
                <p className="text-sm font-bold">상담 신청 완료!</p>
                <p className="text-xs text-slate-300">기업 담당자가 빠른 시일 내에 이메일로 연락을 드릴 예정입니다.</p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="신청자명" 
                  required 
                  value={consultName}
                  onChange={(e) => setConsultName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                />
                <input 
                  type="email" 
                  placeholder="연락받을 이메일" 
                  required 
                  value={consultEmail}
                  onChange={(e) => setConsultEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                />
                <textarea 
                  placeholder="상담 희망 내용 또는 주요 문의 사항" 
                  rows={3} 
                  required 
                  value={consultComment}
                  onChange={(e) => setConsultComment(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                ></textarea>
                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-brand-cyan hover:bg-brand-cyan-light text-slate-950 font-black text-xs rounded-xl shadow-lg btn-glow-cyan transition-all duration-300"
                >
                  상담 신청하기
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </main>
  );
}
