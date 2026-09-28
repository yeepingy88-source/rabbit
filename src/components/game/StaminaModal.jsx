import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Tv, Clock, Play, RotateCcw, X } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function StaminaModal({
  currentStamina,
  entryFee,
  level,
  secondsToNext,
  onWatchAd,
  onPlayFreeLevel,
  onClose,
}) {
  const { lang } = useLang();
  const isZh = lang === 'zh';

  const mins = Math.floor(secondsToNext / 60);
  const secs = String(secondsToNext % 60).padStart(2, '0');

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 16 }}
        transition={{ type: 'spring', damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-[32px] bg-[#FFFDF9] border-2 border-amber-300 shadow-[0_24px_70px_rgba(0,0,0,0.35)] text-amber-950 p-6 text-center overflow-hidden"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center active:scale-90 transition border border-amber-200 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Center Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center shadow-md">
          <Zap className="w-10 h-10 text-amber-600 fill-amber-500 animate-pulse" />
        </div>

        {/* Title */}
        <h3 className="mt-4 text-2xl font-black text-amber-950 leading-tight">
          {isZh ? '體力不足！' : 'Out of Stamina!'}
        </h3>
        <p className="mt-1 text-xs text-amber-800 font-medium">
          {isZh
            ? `進入第 ${level} 關需消耗 ⚡ ${entryFee} 體力`
            : `Level ${level} requires ⚡ ${entryFee} stamina`}
        </p>

        {/* Stamina Stat Card */}
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between">
          <div className="text-left">
            <div className="text-[11px] font-bold text-amber-800/80 uppercase tracking-wider">
              {isZh ? '當前全域體力' : 'Current Stamina'}
            </div>
            <div className="text-2xl font-black text-amber-950 flex items-center gap-1 mt-0.5">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>{currentStamina}</span>
              <span className="text-xs font-bold text-amber-800/60">/ 100</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-bold text-amber-800/80 flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>{isZh ? '下次自然回復' : 'Next +1'}</span>
            </div>
            <div className="text-sm font-black text-amber-900 tabular-nums mt-0.5">
              +{1} ⚡ ({mins}:{secs})
            </div>
            <div className="text-[9px] text-amber-700/80 font-medium">
              {isZh ? '每 2 分鐘回復 1 點' : '1 point / 2 mins'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          {/* Primary: Watch Ad for +50 Stamina */}
          <button
            type="button"
            onClick={onWatchAd}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base shadow-[0_8px_24px_rgba(249,115,22,0.4)] ring-2 ring-orange-300/50 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer hover:brightness-105"
          >
            <Tv className="w-5 h-5" />
            <span>{isZh ? '📺 看廣告領取 +50 體力' : '📺 Watch Ad for +50 Stamina'}</span>
          </button>

          {/* Secondary 1: Play Free Level 1~3 */}
          <button
            type="button"
            onClick={() => onPlayFreeLevel(1)}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-300 font-extrabold text-xs sm:text-sm active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            <span>{isZh ? '🆓 免費暢玩 1~3 關 (入場費 0)' : '🆓 Play Levels 1~3 (Fee: 0)'}</span>
          </button>

          {/* Secondary 2: Wait for natural regen */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-100/70 hover:bg-amber-100 text-amber-900 font-bold text-xs active:scale-95 transition cursor-pointer"
          >
            <span>{isZh ? '⏳ 等待自然回復 (稍後再來)' : '⏳ Wait for natural recovery'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
