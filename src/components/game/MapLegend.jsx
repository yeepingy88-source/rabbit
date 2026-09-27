import React from 'react';
import { useLang } from '@/lib/i18n';

export default function MapLegend() {
  const { lang } = useLang();
  const isZh = lang === 'zh';

  const items = [
    { label: isZh ? '雪波' : 'Snowpaw', el: <span className="w-3 h-3 rounded-full bg-white ring-2 ring-[#ff6b8b]" /> },
    { label: isZh ? '洞穴入口' : 'Start', el: <span className="w-3 h-3 rounded-full bg-[#5a331b] ring-2 ring-[#fff4e0]" /> },
    { label: isZh ? '巨型蘿蔔' : 'Giant Carrot', el: <span className="w-3 h-3 rotate-45 bg-[#f08a3c]" /> },
    { label: isZh ? '巡邏甲蟲' : 'Cave Beetle', el: <span className="w-3 h-3 rounded-full bg-[#1c1917] ring-2 ring-[#ef4444]" /> },
    { label: isZh ? '通道' : 'Path', el: <span className="w-3 h-3 rounded-sm bg-[#ecd3a2] border border-[#c9a776]" /> },
    { label: isZh ? '軟土' : 'Soft Dirt', el: <span className="w-3 h-3 rounded-sm bg-[#d98a45]" /> },
    { label: isZh ? '石牆' : 'Stone', el: <span className="w-3 h-3 rounded-sm bg-[#4a3526]" /> },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 px-4 py-3">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-1.5 text-xs font-semibold text-[#5a331b]">
          {i.el}
          {i.label}
        </div>
      ))}
    </div>
  );
}
