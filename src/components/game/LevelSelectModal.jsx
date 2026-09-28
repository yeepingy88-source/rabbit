import React from 'react';
import { motion } from 'framer-motion';
import { X, Star, Bug, MapPin, Zap } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { getLevelEntryFee, getLevelClearRefund } from '@/lib/game/stamina';

export default function LevelSelectModal({
  currentLevel,
  levelStars = {},
  globalStamina = 100,
  onSelectLevel,
  onClose,
}) {
  const { t, lang } = useLang();
  const isZh = lang === 'zh';

  // Grid dimension formula matching maze.js
  const getGridSize = (lvl) => {
    const dim = Math.min(41, 15 + Math.floor((lvl - 1) / 3) * 2);
    return `${dim}×${dim}${dim === 41 ? ' MAX' : ''}`;
  };

  const getTierName = (lvl) => {
    if (lvl === 50) return isZh ? '傳奇核心 (50關)' : 'Legendary Core (50)';
    if (lvl >= 40) return isZh ? '甲蟲深淵 (41×41)' : 'Beetle Abyss (41×41)';
    if (lvl >= 31) return isZh ? '古老地核脈' : 'Ancient Core';
    if (lvl >= 21) return isZh ? '深層巨網' : 'Deep Network';
    if (lvl >= 11) return isZh ? '蜿蜒迷宮' : 'Winding Maze';
    if (lvl >= 4) return isZh ? '擴展洞穴' : 'Cavern';
    return isZh ? '溫馨起點' : 'Cozy Start';
  };

  const levels = Array.from({ length: 50 }, (_, i) => i + 1);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md select-none"
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
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-[#FFFDF9] border-2 border-amber-300 shadow-[0_24px_70px_rgba(0,0,0,0.35)] text-amber-950 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-200/80 bg-gradient-to-r from-amber-100/90 via-orange-50/90 to-amber-100/90">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-600 shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-amber-950 leading-tight">
                  {t.levelSelectTitle}
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {isZh ? '全 50 關開放測試' : 'All 50 Levels Open'}
                </span>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-sm">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{globalStamina} / 100</span>
                </span>
              </div>
              <p className="text-[11px] text-amber-850 font-bold mt-0.5">
                {isZh ? '全 50 關自由測試與自選 · 自由選擇喜好地圖尺寸' : 'Select from all 50 levels · Freely test any map size'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-amber-200/60 hover:bg-amber-200 text-amber-900 flex items-center justify-center active:scale-90 transition border border-amber-300 cursor-pointer shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Cards Grid (All 50 Levels Clickable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-amber-50/20 to-orange-50/20">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3">
            {levels.map((lvl) => {
              const isCurrent = currentLevel === lvl;
              const stars = levelStars[lvl] || 0;
              const gridSize = getGridSize(lvl);
              const tierName = getTierName(lvl);
              const isBeetle = lvl >= 40;
              const fee = getLevelEntryFee(lvl);
              const refund = getLevelClearRefund(lvl);

              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onSelectLevel(lvl)}
                  className={`relative p-3 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-200 active:scale-95 border-2 cursor-pointer ${
                    isCurrent
                      ? 'bg-gradient-to-b from-amber-100 to-orange-100 border-orange-500 shadow-md ring-2 ring-orange-400/70 scale-[1.02]'
                      : isBeetle
                      ? 'bg-gradient-to-b from-rose-50 to-orange-50 border-rose-300 hover:border-rose-400 shadow-sm'
                      : 'bg-white hover:bg-amber-50/50 border-amber-200 hover:border-amber-400 shadow-sm'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[9px] font-black tracking-wider uppercase shadow">
                      {t.currentLevelBadge}
                    </span>
                  )}

                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xl sm:text-2xl font-black text-amber-950 leading-none">
                      {lvl}
                    </span>
                    {isBeetle && <Bug className="w-3.5 h-3.5 text-rose-500" />}
                  </div>

                  <div className="my-1 w-full">
                    <div className="text-[11px] font-bold text-amber-900 truncate">{tierName}</div>
                    <div className="text-[10px] font-black text-orange-700 bg-orange-100 rounded-md py-0.5 px-1.5 mt-0.5 inline-block border border-orange-200">
                      {gridSize}
                    </div>
                  </div>

                  {/* Entry Fee Badge */}
                  <div className="mb-1 text-[10px] font-extrabold">
                    {fee === 0 ? (
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {isZh ? '🆓 0 體力' : 'Free'}
                      </span>
                    ) : (
                      <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        ⚡ -{fee} <span className="text-[9px] text-emerald-600 font-bold">(返{refund})</span>
                      </span>
                    )}
                  </div>

                  {/* Stars Earned */}
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= stars
                            ? 'text-[#f59e0b] drop-shadow-[0_1px_4px_rgba(245,158,11,0.5)]'
                            : 'text-stone-300'
                        }`}
                        fill={s <= stars ? '#f59e0b' : 'none'}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
