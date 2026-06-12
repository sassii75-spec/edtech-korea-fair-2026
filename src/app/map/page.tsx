"use client";
// src/app/map/page.tsx
import { useState } from "react";

interface Booth {
  id: string;
  companyName: string;
  code: string;
  zone: string;
  status: "Normal" | "Crowded" | "Calm";
  coordinates: { x: string; y: string }; // simulated coordinates
}

const BOOTHS_DATA: Booth[] = [
  { id: "웅진씽크빅", companyName: "웅진씽크빅 (Woongjin Thinkbig)", code: "A-120", zone: "Zone A", status: "Normal", coordinates: { x: "25%", y: "30%" } },
  { id: "아이스크림에듀", companyName: "아이스크림에듀 (i-Scream Edu)", code: "A-240", zone: "Zone A", status: "Crowded", coordinates: { x: "42%", y: "35%" } },
  { id: "클라썸", companyName: "클라썸 (Classum)", code: "A-310", zone: "Zone A", status: "Normal", coordinates: { x: "32%", y: "55%" } },
  { id: "엘리스그룹", companyName: "엘리스그룹 (Elice Group)", code: "B-210", zone: "Zone B", status: "Calm", coordinates: { x: "65%", y: "45%" } },
  { id: "팀스파르타", companyName: "팀스파르타 (Team Sparta)", code: "B-105", zone: "Zone B", status: "Normal", coordinates: { x: "55%", y: "25%" } },
  { id: "알럭스", companyName: "알럭스 (ALUX)", code: "B-405", zone: "Zone B", status: "Normal", coordinates: { x: "78%", y: "52%" } },
];

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [startPoint, setStartPoint] = useState("Entrance");
  const [showPath, setShowPath] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Filter booths based on search query
  const filteredBooths = BOOTHS_DATA.filter(b => 
    b.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSelect = (booth: Booth) => {
    setSelectedBooth(booth);
    setSearchQuery("");
    setShowPath(false);
  };

  const handleFindPath = () => {
    if (selectedBooth) {
      setShowPath(true);
    } else {
      alert("목적지 부스를 먼저 선택해 주세요.");
    }
  };

  const getStatusColor = (status: "Normal" | "Crowded" | "Calm") => {
    switch(status) {
      case "Crowded": return "text-red-400 bg-red-500/10 border-red-500/30";
      case "Calm": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      default: return "text-brand-cyan bg-brand-cyan/10 border-brand-cyan/30";
    }
  };

  return (
    <main className="p-6 md:p-12 min-h-screen max-w-6xl mx-auto space-y-10 relative z-10 font-sans">
      
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="bg-brand-cyan/25 text-brand-cyan text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full uppercase">
          VENUE & FLOOR PLAN
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
          부스 배치도 및 길찾기
        </h1>
        <p className="text-sm text-slate-400 font-medium">
          서울 코엑스 A홀의 부스 위치와 실시간 혼잡도를 확인하고 최적의 동선을 안내받으세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Interactive Controls */}
        <div className="space-y-6">
          
          {/* Booth Search Card */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h3 className="text-md font-bold text-white border-b border-white/5 pb-2">🔍 기업 부스 검색</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="기업명 또는 부스 번호 입력..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
              />
              {searchQuery && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-white/10 rounded-xl max-h-48 overflow-y-auto z-30 shadow-2xl">
                  {filteredBooths.length > 0 ? (
                    filteredBooths.map(b => (
                      <div
                        key={b.id}
                        onClick={() => handleSearchSelect(b)}
                        className="px-4 py-2 text-xs text-slate-300 hover:bg-brand-cyan hover:text-slate-950 cursor-pointer font-bold flex justify-between"
                      >
                        <span>{b.companyName}</span>
                        <span>{b.code}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-xs text-slate-500">일치하는 기업이 없습니다.</div>
                  )}
                </div>
              )}
            </div>

            {selectedBooth && (
              <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl space-y-3">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">선택된 부스</span>
                  <h4 className="text-md font-bold text-white mt-1">{selectedBooth.companyName}</h4>
                  <p className="text-xs text-brand-cyan font-bold">{selectedBooth.code} ({selectedBooth.zone})</p>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-400">실시간 혼잡도</span>
                  <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase ${getStatusColor(selectedBooth.status)}`}>
                    {selectedBooth.status === "Crowded" ? "🔴 혼잡" : selectedBooth.status === "Calm" ? "🟢 여유" : "🔵 보통"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Path Finder Simulator */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h3 className="text-md font-bold text-white border-b border-white/5 pb-2">🧭 최적 동선 시뮬레이션</h3>
            <div className="space-y-3 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-400">출발지 (Starting Point)</label>
                <select
                  value={startPoint}
                  onChange={(e) => setStartPoint(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand-cyan"
                >
                  <option value="Entrance">Main Entrance (정문 입구)</option>
                  <option value="Seminar">Conference Ballroom (세미나실)</option>
                  <option value="Cafe">Exhibition Cafe (카페테리아)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400">목적지 (Destination)</label>
                <input
                  type="text"
                  readOnly
                  value={selectedBooth ? `${selectedBooth.companyName} (${selectedBooth.code})` : "부스를 먼저 선택해 주세요"}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-slate-300 focus:outline-none"
                />
              </div>
              <button
                onClick={handleFindPath}
                className="w-full py-3 bg-brand-cyan hover:bg-brand-cyan-light text-slate-950 font-black text-xs rounded-xl shadow-lg btn-glow-cyan transition-all duration-300"
              >
                동선 길찾기 시작
              </button>
              {showPath && selectedBooth && (
                <div className="bg-brand-cyan/10 border border-brand-cyan/20 p-4 rounded-xl text-slate-300 text-[11px] font-medium space-y-2">
                  <p className="text-white font-bold text-xs">🚀 안내 경로 탐색 완료</p>
                  <p>1. <span className="text-white font-bold">{startPoint}</span>에서 출발합니다.</p>
                  <p>2. A홀 메인 통로를 지나 {selectedBooth.zone} 방향으로 직진합니다.</p>
                  <p>3. 약 25m 이동 후 우측에 위치한 <span className="text-brand-cyan font-bold">{selectedBooth.code} 부스</span>에 도착합니다.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Map Display Area */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-white/5 space-y-4 flex flex-col relative overflow-hidden h-[600px]">
          
          {/* Map Title Controls */}
          <div className="flex items-center justify-between z-10 border-b border-white/5 pb-3">
            <h3 className="text-md font-bold text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-brand-cyan rounded-full animate-ping"></span>
              <span>COEX Hall A - 실시간 부스 배치도</span>
            </h3>
            {/* Zoom Controls */}
            <div className="flex space-x-2 text-xs font-bold">
              <button 
                onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))}
                className="bg-slate-900 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white"
              >
                -
              </button>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(1.8, prev + 0.1))}
                className="bg-slate-900 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white"
              >
                +
              </button>
            </div>
          </div>

          {/* Interactive Map Visual Element */}
          <div className="flex-1 relative border border-white/5 rounded-2xl overflow-auto bg-slate-950 flex items-center justify-center min-h-[400px]">
            
            <div 
              style={{ transform: `scale(${zoomLevel})` }}
              className="w-[95%] h-[95%] transition-transform duration-300 relative min-w-[500px] min-h-[400px]"
            >
              {/* Official 2025 Booth Layout Image from user's URL */}
              <img
                src="https://edtechkorea.or.kr/home/2020/edutech2020/image/boothLayout_2025_eng.jpg"
                alt="EdTech Korea Fair Floor Plan Map Layout"
                className="object-contain w-full h-full opacity-65 select-none"
              />

              {/* Glowing active pins indicating company booths */}
              {BOOTHS_DATA.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooth(b)}
                  style={{ left: b.coordinates.x, top: b.coordinates.y }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-all duration-300 group`}
                >
                  <div className={`relative flex items-center justify-center w-5 h-5 rounded-full ${
                    selectedBooth?.id === b.id 
                      ? "bg-brand-cyan animate-pulse shadow-[0_0_20px_rgba(45,212,191,0.8)] scale-125" 
                      : "bg-slate-800 hover:bg-brand-cyan/60 border border-white/30"
                  }`}>
                    {/* Inner glowing core */}
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      selectedBooth?.id === b.id ? "bg-slate-950" : "bg-brand-cyan"
                    }`}></div>
                    
                    {/* Tooltip Label */}
                    <div className="absolute bottom-full mb-2 bg-slate-900 border border-white/10 px-2 py-1 rounded-md text-[9px] font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                      {b.companyName} ({b.code})
                    </div>
                  </div>
                </div>
              ))}

              {/* Simulated navigation path connection lines */}
              {showPath && selectedBooth && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <line
                    x1="10%" // Entrance coordinates
                    y1="90%"
                    x2={selectedBooth.coordinates.x}
                    y2={selectedBooth.coordinates.y}
                    stroke="#2dd4bf"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    className="animate-pulse-slow"
                  />
                  {/* Entrance starting pin */}
                  <circle cx="10%" cy="90%" r="6" fill="#fff" stroke="#2dd4bf" strokeWidth="2" />
                </svg>
              )}
            </div>

            {/* Path indicator overlay */}
            {showPath && selectedBooth && (
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 border border-brand-cyan/30 p-3 rounded-xl backdrop-blur-md text-xs font-bold text-brand-cyan z-20 flex items-center justify-between">
                <span>📍 안내 시작점 (정문 입구) ➔ 목적지: {selectedBooth.companyName} ({selectedBooth.code})</span>
                <button 
                  onClick={() => setShowPath(false)}
                  className="bg-brand-cyan text-slate-950 px-2 py-1 rounded text-[10px] font-black"
                >
                  초기화
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </main>
  );
}
