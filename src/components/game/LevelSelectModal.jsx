import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Bug, MapPin, Sparkles, Trophy } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function LevelSelectModal({ currentLevel, levelStars = {}, onSelectLevel, onClose }) {
  const { t, lang } = useLang();
  const isZh = lang === 'zh';

  // Grid sizes mapped to tiers
  const getGridSize = (lvl) => {
    if (lvl >= 21) return '35×35+';
    if (lvl >= 16) return '33×33';
    if (lvl >= 11) return '27×27';
    if (lvl >= 6) return '21×21';
    return '15×15';
  };

  const getTierName = (lvl) => {
    if (lvl === 20) return isZh ? '傳奇巨蘿蔔核心' : 'Legendary Giant Carrot Core';
    const tierIdx = Math.min(Math.floor((lvl - 1) / 5), t.tiers.length - 1);
    return t.tiers[tierIdx];
  };

  const levels = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#201209] border-2 border-[#d97706]/60 shadow-[0_24px_70px_rgba(0,0,0,0.85)] text-[#fff4e0] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#fff4e0]/10 bg-[#2c190d]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#fff4e0] leading-tight">
                {t.levelSelectTitle}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-[#f59e0b] font-semibold mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.allUnlockedHint}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#fff4e0] active:scale-90 transition border border-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3">
            {levels.map((lvl) => {
              const isCurrent = currentLevel === lvl;
              const stars = levelStars[lvl] || 0;
              const gridSize = getGridSize(lvl);
              const tierName = getTierName(lvl);
              const isFinal = lvl === 20;

              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    onSelectLevel(lvl);
                  }}
                  className={`relative p-3 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-200 active:scale-95 border cursor-pointer ${
                    isCurrent
                      ? 'bg-gradient-to-b from-orange-600 to-amber-700 border-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-2 ring-yellow-400/80 scale-[1.03]'
                      : isFinal
                      ? 'bg-gradient-to-b from-[#78350f] to-[#451a03] border-amber-500/60 hover:border-amber-400 shadow-md'
                      : 'bg-[#2b170c]/90 hover:bg-[#381e0f] border-[#d97706]/25 hover:border-[#d97706]/60 shadow'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute -top-2 px-2 py-0.5 rounded-full bg-yellow-400 text-black text-[9px] font-black tracking-wider uppercase shadow">
                      {t.currentLevelBadge}
                    </span>
                  )}

                  <div className="text-xl sm:text-2xl font-black text-white leading-none mt-1">
                    {lvl}
                  </div>

                  <div className="my-1.5 w-full">
                    <div className="text-[11px] font-bold text-amber-200 truncate">{tierName}</div>
                    <div className="text-[10px] font-semibold text-[#ffd1a3]/75 bg-black/30 rounded-md py-0.5 px-1.5 mt-1 inline-block">
                      {gridSize}
                    </div>
                  </div>

                  {/* Stars Earned */}
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-stone-600'}`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Special Test Tier: Level 40 Cave Beetles */}
          <div className="mt-4 pt-4 border-t border-[#fff4e0]/10">
            <button
              type="button"
              onClick={() => {
                onSelectLevel(40);
              }}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#450a0a] via-[#1c0808] to-[#450a0a] border-2 border-red-500/50 hover:border-red-400 flex items-center justify-between text-left shadow-lg active:scale-98 transition group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-red-950 border border-red-500/60 flex items-center justify-center text-red-400 group-hover:scale-110 transition">
                  <Bug className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-white">
                      {isZh ? '第 40 關 · 甲蟲深淵 (巡邏害蟲)' : 'Level 40 · Cave Beetles Abyss'}
                    </span>
                    <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                      35×35
                    </span>
                  </div>
                  <p className="text-xs text-red-200/70 mt-0.5">
                    {isZh ? '測試地底巡邏甲蟲巡邏與規避機制' : 'Test subterranean cave beetle patrol and evasion'}
                  </p>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-extrabold text-xs shadow group-hover:bg-red-500 transition">
                {isZh ? '立即進入' : 'Test Now'}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
