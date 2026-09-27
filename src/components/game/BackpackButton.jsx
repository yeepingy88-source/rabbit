import React from 'react';
import { Backpack } from 'lucide-react';

export default function BackpackButton({ badge, highlight, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className={`absolute bottom-[9.5rem] left-9 sm:left-12 w-12 h-12 rounded-2xl bg-[#2a1a10]/70 backdrop-blur-md border flex items-center justify-center text-[#fff4e0] active:scale-90 transition shadow-[0_8px_20px_rgba(0,0,0,0.4)] z-20 ${highlight ? 'border-[#ffd166] animate-bounce' : 'border-[#fff4e0]/15'}`}
    >
      <Backpack className="w-5 h-5" />
      {badge > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#f08a3c] text-white text-[11px] font-bold flex items-center justify-center border-2 border-[#2a1a10]">
          {badge}
        </span>
      )}
    </button>
  );
}