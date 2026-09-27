import React from 'react';
import { Pickaxe } from 'lucide-react';
import { DIG_COST } from '@/lib/game/physics';

export default function DigButton({ onDig, stamina, drillActive = false }) {
  const ready = drillActive || stamina >= DIG_COST;
  return (
    <button
      onPointerDown={(e) => { e.preventDefault(); onDig(); }}
      className={`absolute bottom-10 left-7 w-24 h-24 rounded-full touch-none flex flex-col items-center justify-center gap-0.5 border-4 transition-all duration-200 active:scale-90 shadow-[0_10px_30px_rgba(0,0,0,0.45)] ${
        drillActive
          ? 'bg-gradient-to-b from-[#06b6d4] to-[#0369a1] border-[#67e8f9] text-white shadow-[0_0_25px_rgba(6,182,212,0.6)] animate-pulse'
          : ready
          ? 'bg-gradient-to-b from-[#f7a45c] to-[#e0702a] border-[#ffd1a3]/60 text-white'
          : 'bg-[#5a4030] border-[#fff4e0]/10 text-[#fff4e0]/50'
      }`}
    >
      <Pickaxe className="w-8 h-8" strokeWidth={2.4} />
      <span className="text-sm font-bold tracking-wider">{drillActive ? '破石' : '挖掘'}</span>
      <span
        className={`absolute -top-1 -right-1 text-[10px] font-bold rounded-full px-1.5 py-0.5 border ${
          drillActive
            ? 'bg-[#083344] text-[#67e8f9] border-[#67e8f9]/60'
            : 'bg-[#2a1a10] text-[#ffd1a3] border-[#fff4e0]/20'
        }`}
      >
        {drillActive ? '💎破石' : `-${DIG_COST}`}
      </span>
    </button>
  );
}