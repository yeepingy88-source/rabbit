import React from 'react';
import { motion } from 'framer-motion';
import { Carrot, Play, MapPin } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function IntroScreen({ onStart, onOpenLevelSelect, onOpenCozyRoom, totalCarrots = 0 }) {
  const { t, lang, toggle } = useLang();
  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#7fb35a] via-[#5a331b] to-[#1a0f08]">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenCozyRoom}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3d2417]/80 hover:bg-[#4d2d1d] border border-orange-500/40 text-orange-200 text-xs font-black shadow active:scale-95 transition cursor-pointer"
        >
          <Carrot className="w-3.5 h-3.5 text-orange-400" />
          <span>{totalCarrots}</span>
          <span className="text-[10px] text-amber-300 font-bold ml-0.5">{t.cozyRoom}</span>
        </button>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggle}
          className="px-3 py-1.5 rounded-full bg-black/30 border border-[#fff4e0]/25 text-[#fff4e0] text-xs font-bold tracking-wider active:scale-95 transition"
        >
          {lang === 'zh' ? 'EN' : '中文'}
        </button>
      </div>
      <div className="min-h-full flex flex-col items-center justify-center px-6 py-12 text-center">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}
          className="relative w-24 h-24 rounded-[30px] bg-[#fff4e0] flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <Carrot className="w-12 h-12 text-[#f08a3c]" strokeWidth={2.2} />
          <div className="absolute inset-0 rounded-[30px] ring-8 ring-[#fff4e0]/20 animate-pulse" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}>
          <p className="mt-8 text-xs tracking-[0.4em] text-[#fff4e0]/70 font-semibold">{t.tagline}</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-[#fff4e0] leading-tight">{t.title}</h1>
          <p className="mt-2 text-lg text-[#ffd1a3] font-semibold">{t.subtitle}</p>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.8 }}
          className="mt-8 max-w-sm text-[15px] leading-relaxed text-[#fff4e0]/80 whitespace-pre-line">
          {t.story}
        </motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55 }} className="mt-8 flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => onStart(1)}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg shadow-[0_12px_36px_rgba(249,115,22,0.45)] ring-2 ring-orange-300/40 active:scale-95 transition"
          >
            <Play className="w-6 h-6" fill="white" /> <span>{t.start}</span>
          </button>

          <button
            type="button"
            onClick={onOpenCozyRoom}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-700/90 to-orange-700/90 hover:from-amber-700 hover:to-orange-700 text-amber-100 font-extrabold text-base shadow-md active:scale-95 transition border-2 border-amber-400/50 cursor-pointer"
          >
            <span className="text-lg">🏡</span>
            <span>{t.cozyRoomBtn}</span>
          </button>

          <button
            onClick={onOpenLevelSelect}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#FFF8EB] hover:bg-white text-[#9a3412] font-extrabold text-base shadow-md active:scale-95 transition border-2 border-[#ea580c]/30"
          >
            <MapPin className="w-5 h-5 text-[#ea580c]" />
            <span>{t.selectLevelBtn}</span>
          </button>

          <button
            onClick={() => onStart(40)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-black/40 border border-[#ef4444]/40 text-[#fca5a5] text-xs font-bold shadow-md active:scale-95 transition hover:bg-black/60 hover:text-white"
          >
            <span>{t.startLevel40}</span>
          </button>
        </motion.div>

        <div className="mt-10 grid grid-cols-3 gap-3 max-w-sm w-full text-[11px] text-[#fff4e0]/60">
          <div className="rounded-2xl bg-black/20 p-3 whitespace-pre-line">{t.tipMove}</div>
          <div className="rounded-2xl bg-black/20 p-3 whitespace-pre-line">{t.tipDig}</div>
          <div className="rounded-2xl bg-black/20 p-3 whitespace-pre-line">{t.tipMap}</div>
        </div>
      </div>
    </div>
  );
}

