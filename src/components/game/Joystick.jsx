import React, { useRef, useState } from 'react';

const R = 36; // Scaled down by ~40% (was 58)
const snap = (v) => (Math.abs(v) < 1e-6 ? 0 : v);

export default function Joystick({ inputRef }) {
  const baseRef = useRef(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [dir, setDir] = useState(null);
  const [isOperating, setIsOperating] = useState(false);
  const active = useRef(false);

  const update = (e) => {
    const r = baseRef.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy), cl = Math.min(d, R);
    setKnob(d ? { x: (dx / d) * cl, y: (dy / d) * cl } : { x: 0, y: 0 });
    if (d < 8) { inputRef.current = { x: 0, y: 0 }; setDir(null); return; }
    const oct = Math.round(Math.atan2(dy, dx) / (Math.PI / 4));
    const a = (oct * Math.PI) / 4;
    inputRef.current = { x: snap(Math.cos(a)), y: snap(Math.sin(a)) };
    setDir((oct + 8) % 8);
  };

  const end = () => {
    active.current = false;
    setIsOperating(false);
    setKnob({ x: 0, y: 0 });
    setDir(null);
    inputRef.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={baseRef}
      className={`absolute bottom-7 right-4 sm:right-8 w-[116px] h-[116px] rounded-full touch-none bg-[#FFF8EB]/90 border-[2.5px] border-[#D97706] shadow-[0_8px_24px_rgba(217,119,6,0.3)] z-20 select-none transition-all duration-200 ${
        isOperating ? 'opacity-90 scale-[1.03]' : 'opacity-60'
      }`}
      onPointerDown={(e) => {
        active.current = true;
        setIsOperating(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e);
      }}
      onPointerMove={(e) => active.current && update(e)}
      onPointerUp={end}
      onPointerCancel={end}
    >
      {/* 8 Directional guide marks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="absolute left-1/2 top-1/2 w-0 h-0" style={{ transform: `rotate(${i * 45}deg)` }}>
          <div
            className={`absolute -top-[4px] left-[44px] w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] transition-colors duration-150 ${
              dir === i ? 'border-l-[#ea580c] scale-125' : 'border-l-[#d97706]/40'
            }`}
          />
        </div>
      ))}

      {/* Center resting ring guide */}
      <div className="absolute left-1/2 top-1/2 -ml-[23px] -mt-[23px] w-[46px] h-[46px] rounded-full border border-dashed border-[#d97706]/35 pointer-events-none" />

      {/* Proportional Thumb Knob with Clear Directional Arrows */}
      <div
        className="absolute left-1/2 top-1/2 w-10 h-10 -ml-5 -mt-5 rounded-full bg-white border-2 border-[#d97706] shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition-transform duration-75 flex items-center justify-center pointer-events-none"
        style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
      >
        <div className="relative w-full h-full flex items-center justify-center select-none font-bold">
          <span className="text-[9px] font-black text-[#b45309] leading-none absolute top-0.5">▲</span>
          <span className="text-[9px] font-black text-[#b45309] leading-none absolute bottom-0.5">▼</span>
          <span className="text-[9px] font-black text-[#b45309] leading-none absolute left-0.5">◀</span>
          <span className="text-[9px] font-black text-[#b45309] leading-none absolute right-0.5">▶</span>
          <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-inner" />
        </div>
      </div>
    </div>
  );
}
