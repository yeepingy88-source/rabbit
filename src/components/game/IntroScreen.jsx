import React from 'react';
import { motion } from 'framer-motion';
import { Carrot, Play, MapPin, Zap, Clock } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function IntroScreen({
  globalStamina = 100,
  secondsToNextStamina = 120,
  onStart,
  onOpenLevelSelect,
  onOpenStaminaModal,
}) {
  const { t, lang, toggle } = useLang();
  const isZh = lang === 'zh';

  const mins = Math.floor(secondsToNextStamina / 60);
  const secs = String(secondsToNextStamina % 60).padStart(2, '0');

  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#7fb35a] via-[#5a331b] to-[#1a0f08]">
      {/* Top Status Bar: Global Stamina & Language Toggle */}
      <div className="absolute top-4 left-4 z-10">
        <button
          type="button"
          onClick={onOpenStaminaModal}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3d2417]/90 hover:bg-[#4d2d1d] border border-amber-400/50 text-white shadow-lg active:scale-95 transition cursor-pointer"
          title={isZh ? "點擊查看體力或補給" : "Click to view stamina"}
        >
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-black tracking-wide">
            {globalStamina}
            <span className="text-[11px] text-amber-200/70 font-semibold ml-0.5">/ 100</span>
          </span>
          {globalStamina < 100 && (
            <span className="text-[10px] text-amber-300 font-bold bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-600/40 tabular-nums">
              +{1} ({mins}:{secs})
            </span>
          )}
        </button>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggle}
          className="px-3.5 py-1.5 rounded-full bg-black/35 hover:bg-black/50 border border-[#fff4e0]/25 text-[#fff4e0] text-xs font-black tracking-wider active:scale-95 transition cursor-pointer shadow"
        >
          {lang === 'zh' ? 'EN' : '中文'}
        </button>
      </div>

      <div className="min-h-full flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-center">
        {/* Center Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-24 h-24 rounded-[30px] bg-[#FFF8EB] flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        >
          <Carrot className="w-12 h-12 text-[#f08a3c]" strokeWidth={2.2} />
          <div className="absolute inset-0 rounded-[30px] ring-8 ring-[#fff4e0]/20 animate-pulse" />
        </motion.div>

        {/* Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <p className="mt-6 text-xs tracking-[0.4em] text-[#fff4e0]/80 font-bold uppercase">{t.tagline}</p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-black text-[#fff4e0] leading-tight">{t.title}</h1>
          <p className="mt-1.5 text-base sm:text-lg text-[#ffd1a3] font-bold">{t.subtitle}</p>
        </motion.div>

        {/* Minimalist Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col gap-3 w-full max-w-xs"
        >
          {/* Main Button: Start Digging */}
          <button
            onClick={() => onStart()}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-[0_12px_36px_rgba(249,115,22,0.45)] ring-2 ring-orange-300/40 active:scale-95 transition cursor-pointer hover:brightness-105"
          >
            <Play className="w-6 h-6 fill-white text-white" />
            <span>{t.start}</span>
          </button>

          {/* Secondary Button: Select Level */}
          <button
            onClick={onOpenLevelSelect}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#FFF8EB] hover:bg-white text-amber-950 font-black text-sm sm:text-base shadow-md active:scale-95 transition border-2 border-amber-300 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-orange-600" />
            <span>{t.selectLevelBtn}</span>
          </button>
        </motion.div>

        {/* Minimalist Controls Guide at Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-10 grid grid-cols-3 gap-2.5 max-w-sm w-full text-[11px] text-[#fff4e0]/80 font-bold"
        >
          <div className="rounded-xl bg-black/30 p-2.5 whitespace-pre-line border border-white/10 shadow-sm leading-tight">
            {t.tipMove}
          </div>
          <div className="rounded-xl bg-black/30 p-2.5 whitespace-pre-line border border-white/10 shadow-sm leading-tight">
            {t.tipDig}
          </div>
          <div className="rounded-xl bg-black/30 p-2.5 whitespace-pre-line border border-white/10 shadow-sm leading-tight">
            {t.tipMap}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
