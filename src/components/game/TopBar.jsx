import React from 'react';
import { Home, Backpack, Volume2, VolumeX, Zap, RotateCcw } from 'lucide-react';
import { useLang } from '@/lib/i18n';

const panel = 'bg-[#2a1a10]/75 backdrop-blur-md border border-[#fff4e0]/10 shadow-[0_8px_24px_rgba(0,0,0,0.35)]';

export default function TopBar({
  level,
  levelName,
  stamina,
  muted,
  onToggleMute,
  onOpenMap,
  onRestartLevel,
  onGoHome,
  onOpenLevelSelect,
  onOpenBackpack,
  bagBadge = 0,
  bagHighlight = false,
}) {
  const { t, lang, toggle } = useLang();
  return (
    <div className="absolute top-0 inset-x-0 p-2 sm:p-4 flex flex-col gap-2 pointer-events-none z-20">
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left Side: 【首頁 🏠】、【背包 🎒】、【關卡標籤】 */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* 1. 【首頁 🏠】 */}
          <button
            onClick={onGoHome}
            className={`${panel} w-9 sm:w-11 h-9 sm:h-11 rounded-2xl flex items-center justify-center text-[#ffd166] active:scale-90 transition hover:bg-[#3d2517] cursor-pointer`}
            title={t.home}
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* 2. 【背包 🎒】 */}
          <button
            onClick={onOpenBackpack}
            className={`${panel} relative w-9 sm:w-11 h-9 sm:h-11 rounded-2xl flex items-center justify-center text-[#ffd166] active:scale-90 transition hover:bg-[#3d2517] cursor-pointer ${
              bagHighlight ? 'border-amber-400 ring-2 ring-amber-400/50 animate-bounce' : ''
            }`}
            title={t.bagTitle}
          >
            <Backpack className="w-4 h-4 sm:w-5 sm:h-5" />
            {bagBadge > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1 rounded-full bg-[#f08a3c] text-white text-[10px] font-bold flex items-center justify-center border border-[#2a1a10]">
                {bagBadge}
              </span>
            )}
          </button>

          {/* 3. 【關卡標籤】 */}
          <button
            onClick={onOpenLevelSelect}
            className={`${panel} rounded-2xl px-2.5 sm:px-3 py-1 sm:py-1.5 shrink-0 max-w-[130px] sm:max-w-[160px] text-left active:scale-95 transition hover:bg-[#3d2517] cursor-pointer`}
            title={t.selectLevel}
          >
            <div className="text-[9px] sm:text-[10px] tracking-[0.1em] text-[#f7a45c] font-semibold truncate leading-tight">
              {t.level(level)}
            </div>
            <div className="text-[#fff4e0] font-bold text-xs sm:text-sm leading-tight truncate">
              {levelName}
            </div>
          </button>
        </div>

        {/* Right Side: 【語言】、【音效】、【地圖 🗺️】、【重玩 🔄】 */}
        <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto shrink-0">
          {/* 4. 【語言】 */}
          <button
            onClick={toggle}
            className={`${panel} h-9 sm:h-11 px-2.5 sm:px-3 rounded-2xl flex items-center justify-center text-[#fff4e0] text-xs font-bold active:scale-90 transition hover:bg-[#3d2517] cursor-pointer`}
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>

          {/* 5. 【音效】 */}
          <button
            onClick={onToggleMute}
            className={`${panel} w-9 sm:w-11 h-9 sm:h-11 rounded-2xl flex items-center justify-center text-[#fff4e0] active:scale-90 transition hover:bg-[#3d2517] cursor-pointer`}
            title="Mute"
          >
            {muted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* 6. 【地圖 🗺️】 */}
          <button
            onClick={onOpenMap}
            className={`${panel} h-9 sm:h-11 px-2.5 sm:px-3.5 rounded-2xl flex items-center gap-1.5 text-amber-200 font-extrabold text-xs sm:text-sm active:scale-90 transition hover:bg-[#3d2517] border-amber-500/50 shadow-md cursor-pointer`}
            title={lang === 'zh' ? '查看古老藏寶圖 (隨時免費查閱)' : 'View Ancient Treasure Map (Free)'}
          >
            <span className="text-base sm:text-lg leading-none">🗺️</span>
            <span className="leading-none">{lang === 'zh' ? '地圖' : 'Map'}</span>
          </button>

          {/* 7. 【重玩 🔄】 */}
          <button
            onClick={onRestartLevel}
            className={`${panel} w-9 sm:w-11 h-9 sm:h-11 rounded-2xl flex items-center justify-center text-[#f7a45c] active:scale-90 transition hover:bg-[#3d2517] cursor-pointer`}
            title={t.replay}
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Stamina Bar */}
      <div className={`${panel} rounded-2xl px-3 py-1.5 sm:py-2 flex items-center gap-2 max-w-md w-full`}>
        <Zap className="w-4 h-4 text-[#ffd166] shrink-0" fill="#ffd166" />
        <div className="flex-1 h-3 rounded-full bg-black/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#f08a3c] to-[#ffd166] transition-[width] duration-200"
            style={{ width: `${Math.max(0, Math.min(100, stamina))}%` }}
          />
        </div>
        <span className="text-xs font-bold text-[#fff4e0] w-8 text-right tabular-nums">{Math.round(stamina)}</span>
      </div>
    </div>
  );
}
