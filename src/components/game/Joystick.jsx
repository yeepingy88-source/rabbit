import React, { useRef, useState } from 'react';

const R = 50;
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
      className="absolute bottom-7 right-6 w-36 h-36 rounded-full touch-none bg-[#2a1a10]/70 backdrop-blur-md border border-[#fff4e0]/15 shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
      onPointerDown={(e) => { active.current = true; e.currentTarget.setPointerCapture(e.pointerId); update(e); }}
      onPointerMove={(e) => active.current && update(e)}
      onPointerUp={end}
      onPointerCancel={end}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="absolute left-1/2 top-1/2 w-0 h-0" style={{ transform: `rotate(${i * 45}deg)` }}>
          <div className={`absolute -top-[5px] left-[54px] w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] transition-colors duration-150 ${dir === i ? 'border-l-[#f08a3c]' : 'border-l-[#fff4e0]/30'}`} />
        </div>
      ))}
      <div
        className="absolute left-1/2 top-1/2 w-14 h-14 -ml-7 -mt-7 rounded-full bg-gradient-to-b from-[#fff4e0] to-[#e8d3b0] shadow-[0_6px_14px_rgba(0,0,0,0.4)] transition-transform duration-75"
        style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
      />
    </div>
  );
}