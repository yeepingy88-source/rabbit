import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Carrot, RotateCcw, Sparkles, Star } from 'lucide-react';

const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

export default function VictoryScreen({ level, result, onNext, onReplay }) {
  const stats = [['用時', fmt(result.time)], ['挖掘', result.digs], ['蘿蔔', result.carrots], ['水滴', result.water]];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 bg-gradient-to-b from-[#bfe3a0] via-[#fff4e0] to-[#f6e7c8] flex flex-col items-center justify-center px-6 text-center">
      <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 10, delay: 0.1 }}
        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#f7a45c] to-[#e0702a] flex items-center justify-center shadow-[0_24px_60px_rgba(224,112,42,0.4)]">
        <Carrot className="w-16 h-16 text-white" />
        <Sparkles className="absolute -top-2 -right-3 w-8 h-8 text-[#ffd166]" />
        <Sparkles className="absolute -bottom-1 -left-4 w-6 h-6 text-[#7fb35a]" />
      </motion.div>
      <p className="mt-8 text-xs tracking-[0.4em] text-[#a0643a] font-semibold">第 {level} 關完成</p>
      <h2 className="mt-2 text-4xl font-bold text-[#4a2c18]">破土而出！</h2>
      <p className="mt-3 max-w-xs text-[#8a6a50]">雪波摸到了巨型蘿蔔的根部，兔兔村今年會大豐收！</p>
      <div className="mt-5 flex items-center gap-4">
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <Star key={i} className={`w-9 h-9 ${i <= result.stars ? 'text-[#ffd166]' : 'text-[#d9c9a8]'}`} fill={i <= result.stars ? '#ffd166' : 'none'} />
          ))}
        </div>
        <div className="text-left">
          <div className="text-3xl font-bold text-[#4a2c18] tabular-nums leading-none">{result.score}<span className="text-sm ml-1">分</span></div>
          {result.rank <= 10 && <div className="text-xs text-[#a0643a] font-semibold mt-1">本地面板第 {result.rank} 名</div>}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-4 gap-2 w-full max-w-sm">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-white/70 py-4">
            <div className="text-2xl font-bold text-[#4a2c18] tabular-nums">{v}</div>
            <div className="text-xs text-[#a0643a] mt-1">{k}</div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button onClick={onReplay} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full bg-white text-[#5a331b] font-bold active:scale-95 transition">
          <RotateCcw className="w-4 h-4" /> 重玩本關
        </button>
        <button onClick={onNext} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full bg-gradient-to-b from-[#f7a45c] to-[#e0702a] text-white font-bold shadow-lg active:scale-95 transition">
          下一關 <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}