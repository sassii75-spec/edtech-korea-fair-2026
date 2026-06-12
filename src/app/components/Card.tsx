// src/app/components/Card.tsx
"use client";
import Image from "next/image";

interface CardProps {
  title: string;
  description: string;
  imageSrc: string; // relative path in public folder
  alt?: string;
  date?: string; // Optional date field for sessions
  tag?: string;  // Optional category/tag
}

export default function Card({ title, description, imageSrc, alt = "", date, tag }: CardProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-2xl flex flex-col group h-full">
      {/* Image container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-900 border-b border-white/5">
        <Image 
          src={imageSrc} 
          alt={alt} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        {tag && (
          <span className="absolute top-4 left-4 bg-brand-cyan/90 backdrop-blur-md text-slate-950 text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase shadow-[0_4px_10px_rgba(45,212,191,0.25)]">
            {tag}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1 space-y-3 justify-between">
        <div className="space-y-2">
          {date && (
            <p className="text-xs text-brand-cyan font-bold tracking-wider uppercase">
              {date}
            </p>
          )}
          <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-brand-cyan transition-colors duration-300 leading-snug">
            {title}
          </h3>
          <p className="text-sm text-slate-400 font-medium line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Read More link/arrow indicator */}
        <div className="pt-4 flex items-center justify-between border-t border-white/5 text-xs font-bold text-slate-400 group-hover:text-brand-cyan transition-colors duration-300">
          <span>상세 정보 보기</span>
          <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
        </div>
      </div>
    </div>
  );
}
