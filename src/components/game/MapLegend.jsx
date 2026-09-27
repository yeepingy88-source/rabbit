import React from 'react';

const ITEMS = [
  { label: '雪波', el: <span className="w-3 h-3 rounded-full bg-white ring-2 ring-[#ff6b8b]" /> },
  { label: '洞穴入口', el: <span className="w-3 h-3 rounded-full bg-[#5a331b] ring-2 ring-[#fff4e0]" /> },
  { label: '巨型蘿蔔', el: <span className="w-3 h-3 rotate-45 bg-[#f08a3c]" /> },
  { label: '通道', el: <span className="w-3 h-3 rounded-sm bg-[#ecd3a2] border border-[#c9a776]" /> },
  { label: '軟土捷徑', el: <span className="w-3 h-3 rounded-sm bg-[#d98a45]" /> },
  { label: '石牆', el: <span className="w-3 h-3 rounded-sm bg-[#4a3526]" /> },
];

export default function MapLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 px-4 py-3">
      {ITEMS.map((i) => (
        <div key={i.label} className="flex items-center gap-1.5 text-xs font-semibold text-[#5a331b]">
          {i.el}
          {i.label}
        </div>
      ))}
    </div>
  );
}