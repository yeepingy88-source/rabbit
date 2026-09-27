import React, { useRef, useState } from 'react';

const R = 58;
const snap = (v) => (Math.abs(v) < 1e-6 ? 0 : v);

export default function Joystick({ inputRef }) {
  const baseRef = useRef(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [dir, setDir] = useState(null);
  const active = useRef(false);

  const update = (e) => {
    const r = baseRef.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy), cl = Math.min(d, R);
    setKnob(d ? { x: (dx / d) * cl, y: (dy / d) * cl } : { x: 0, y: 0 });
    if (d < 12) { inputRef.current = { x: 0, y: 0 }; setDir(null); return; }
    const oct = Math.round(Math.atan2(dy, dx) / (Math.PI / 4));
    const a = (oct * Math.PI) / 4;
    inputRef.current = { x: snap(Math.cos(a)), y: snap(Math.sin(a)) };
    setDir((oct + 8) % 8);
  };
  const end = () => { active.current = false; setKnob({ x: 0, y: 0 }); setDir(null); inputRef.current = { x: 0, y: 0 }; };

  return (
    <div
      ref={baseRef}
      className="absolute bottom-8 right-5 sm:right-9 w-[180px] h-[180px] rounded-full touch-none bg-[#FFF8EB] border-[3px] border-[#D97706] shadow-[0_12px_36px_rgba(217,119,6,0.35)] z-20 select-none"
      onPointerDown={(e) => { active.current = true; e.currentTarget.setPointerCapture(e.pointerId); update(e); }}
      onPointerMove={(e) => active.current && update(e)}
      onPointerUp={end}
      onPointerCancel={end}
    >
      {/* 8 Directional guide marks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="absolute left-1/2 top-1/2 w-0 h-0" style={{ transform: `rotate(${i * 45}deg)` }}>
          <div
            className={`absolute -top-[6px] left-[68px] w-0 h-0 border-y-[6px] border-y-transparent border-l-[9px] transition-colors duration-150 ${
              dir === i ? 'border-l-[#ea580c] scale-125' : 'border-l-[#d97706]/40'
            }`}
          />
        </div>
      ))}

      {/* Center resting ring guide */}
      <div className="absolute left-1/2 top-1/2 -ml-9 -mt-9 w-[72px] h-[72px] rounded-full border border-dashed border-[#d97706]/35 pointer-events-none" />

      {/* High-Contrast White Thumb Knob with Clear Directional Arrows */}
      <div
        className="absolute left-1/2 top-1/2 w-16 h-16 -ml-8 -mt-8 rounded-full bg-white border-[2.5px] border-[#d97706] shadow-[0_8px_20px_rgba(0,0,0,0.28)] transition-transform duration-75 flex items-center justify-center pointer-events-none"
        style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
      >
        <div className="relative w-full h-full flex items-center justify-center select-none font-bold">
          <span className="text-[12px] font-black text-[#b45309] leading-none absolute top-1.5">▲</span>
          <span className="text-[12px] font-black text-[#b45309] leading-none absolute bottom-1.5">▼</span>
          <span className="text-[12px] font-black text-[#b45309] leading-none absolute left-1.5">◀</span>
          <span className="text-[12px] font-black text-[#b45309] leading-none absolute right-1.5">▶</span>
          <div className="w-3.5 h-3.5 rounded-full bg-[#f59e0b] shadow-inner" />
        </div>
      </div>
    </div>
  );
}
