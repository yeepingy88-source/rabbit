import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Carrot } from 'lucide-react';

export default function AdPlayer({ type, onDone }) {
  const total = type === 'quick' ? 5 : 30;
  const [left, setLeft] = useState(total);

  useEffect(() => {
    const id = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { if (left <= 0) onDone(); }, [left, onDone]);

  return (
    <div className="absolute inset-0 z-40 bg-[#0d0703] flex flex-col items-center justify-center p-6 text-[#fff4e0]">
      <div className="absolute top-4 left-4 text-[10px] tracking-[0.3em] px-2 py-1 rounded bg-white/10">模擬廣告</div>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="px-3 py-1.5 rounded-full bg-white/10 text-sm font-bold tabular-nums">
          {Math.max(0, left)} 秒
        </span>
        <button
          onClick={onDone}
          className="px-3 py-1.5 rounded-full bg-white/20 text-xs font-bold hover:bg-white/30 active:scale-95 transition"
        >
          跳過
        </button>
      </div>
      <motion.div animate={{ rotate: [0, -8, 8, 0], y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="w-28 h-28 rounded-[32px] bg-gradient-to-br from-[#f7a45c] to-[#e0702a] flex items-center justify-center shadow-[0_20px_60px_rgba(240,138,60,0.4)]">
        <Carrot className="w-14 h-14 text-white" strokeWidth={2} />
      </motion.div>
      <h2 className="mt-8 text-3xl font-bold">森林鮮榨蘿蔔汁</h2>
      <p className="mt-2 text-[#fff4e0]/60 text-center">每一口都是兔兔村的豐收味道</p>
      <div className="mt-10 w-full max-w-xs h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: total, ease: 'linear' }} className="h-full bg-[#f08a3c]" />
      </div>
      <p className="mt-3 text-xs text-[#fff4e0]/50">廣告結束後將自動打開地圖</p>
    </div>
  );
}