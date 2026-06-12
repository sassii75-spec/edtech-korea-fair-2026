// src/app/companies/page.tsx
"use client";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Link from "next/link";
import { fetchCollection } from "../../lib/firestore";

interface Company {
  id: string;
  name: string;
  logo: string; // path in public folder
  description: string;
  tag: string;
  booth: string;
}

const SAMPLE_COMPANIES: Company[] = [
  {
    id: "웅진씽크빅",
    name: "웅진씽크빅 (Woongjin Thinkbig)",
    logo: "/file.svg",
    description: "AI 맞춤형 전과목 학습 솔루션 '웅진스마트올' 등 독자적인 에듀테크 콘텐츠 개발 및 자기주도 학습 서비스를 제공합니다.",
    tag: "AI / 학습 콘텐츠",
    booth: "A-120",
  },
  {
    id: "아이스크림에듀",
    name: "아이스크림에듀 (i-Scream Edu)",
    logo: "/globe.svg",
    description: "초중등 스마트 홈러닝 대표 브랜드 '아이스크림 홈런'과 AI 인공지능 기반 일대일 맞춤 분석 솔루션 'AI 생활기록부'를 선보입니다.",
    tag: "AI 평가 / 스마트 러닝",
    booth: "A-240",
  },
  {
    id: "엘리스그룹",
    name: "엘리스그룹 (Elice Group)",
    logo: "/file.svg",
    description: "학교 및 기업용 AI 코딩 실습 플랫폼 '엘리스 LXP'를 비롯해 교육용 가상 클라우드 컴퓨팅 실습 인프라를 제공합니다.",
    tag: "AI LXP / 코딩 교육",
    booth: "B-210",
  },
  {
    id: "클라썸",
    name: "클라썸 (Classum)",
    logo: "/globe.svg",
    description: "질문 중심의 소셜 교육 소통 플랫폼으로, 인공지능 질문 도우미(AI DOT)를 탑재해 구성원 간 학습 지식 공유를 극대화합니다.",
    tag: "소통 플랫폼 / SaaS",
    booth: "A-310",
  },
  {
    id: "팀스파르타",
    name: "팀스파르타 (Team Sparta)",
    logo: "/file.svg",
    description: "실무 중심 코딩 플랫폼 '스파르타코딩클럽'과 직무 지향 B2B 디지털 전환(DX) 교육, 교육생 매칭을 성공적으로 운영하고 있습니다.",
    tag: "SW 코딩 교육 / B2B",
    booth: "B-105",
  },
  {
    id: "알럭스",
    name: "알럭스 (ALUX)",
    logo: "/globe.svg",
    description: "로봇 조립 및 알고리즘 코딩 교구재 개발부터 아동 지향 맞춤 디지털 역량 학습 교재, 전문 강사 양성 생태계를 지원합니다.",
    tag: "로봇 코딩 / 교구",
    booth: "B-405",
  },
];

const CATEGORIES = [
  "전체",
  "AI / 학습 콘텐츠",
  "AI 평가 / 스마트 러닝",
  "AI LXP / 코딩 교육",
  "소통 플랫폼 / SaaS",
  "SW 코딩 교육 / B2B",
  "로봇 코딩 / 교구"
];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  useEffect(() => {
    // Fetch from Firestore, fallback to static sample data.
    fetchCollection<Company>("companies", SAMPLE_COMPANIES).then(setCompanies);
  }, []);

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.booth.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || c.tag === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="p-8 min-h-screen relative max-w-7xl mx-auto space-y-12">
      {/* Background glow overlay decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[250px] h-[250px] rounded-full bg-brand-cyan/5 blur-[90px]"></div>
      </div>

      <div className="text-center space-y-3 z-10 relative">
        <span className="bg-brand-cyan/25 text-brand-cyan text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full uppercase">
          EXHIBITORS LIST
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
          참가 기업 라인업 (2025/2026)
        </h1>
        <p className="text-sm text-slate-400 font-medium">
          EdTech Korea Fair에 참여하는 국내외 최고의 에듀테크 리딩 기업들의 부스 위치와 솔루션을 확인해보세요.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="glass-card rounded-3xl p-6 space-y-4 max-w-4xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search bar */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="기업명, 설명, 부스 번호로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
            />
          </div>
          {/* Category Dropdown (mobile) */}
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

        {/* Category tags row (desktop) */}
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

      {/* Results grid */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 z-10 relative">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((c) => (
            <Link href={`/companies/${c.id}`} key={c.id} className="block h-full">
              <Card
                title={c.name}
                description={c.description}
                imageSrc={c.logo}
                alt={c.name + " logo"}
                tag={c.tag}
                date={`부스 번호: ${c.booth}`}
              />
            </Link>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-slate-500 text-sm font-medium">
            조건에 부합하는 기업이 존재하지 않습니다.
          </div>
        )}
      </div>
    </main>
  );
}
