import React from 'react';
import { Home, Map as MapIcon, Volume2, VolumeX, Zap, Trophy, RotateCcw } from 'lucide-react';
import { useLang } from '@/lib/i18n';

const panel = 'bg-[#2a1a10]/75 backdrop-blur-md border border-[#fff4e0]/10 shadow-[0_8px_24px_rgba(0,0,0,0.35)]';

export default function TopBar({
  level,
  levelName,
  stamina,
  freeViews,
  muted,
  onToggleMute,
  onOpenMap,
  onOpenLeaderboard,
  onRestartLevel,
  onGoHome,
}) {
  const { t, lang, toggle } = useLang();
  return (
    <div className="absolute top-0 inset-x-0 p-2 sm:p-4 flex flex-col gap-2 pointer-events-none z-20">
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={onGoHome}
            className={`${panel} w-9 sm:w-11 h-9 sm:h-11 rounded-2xl flex items-center justify-center text-[#ffd166] active:scale-90 transition hover:bg-[#3d2517]`}
            title={t.home}
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className={`${panel} rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2 shrink-0 max-w-[120px] sm:max-w-none`}>
            <div className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#f7a45c] font-semibold truncate">{t.level(level)}</div>
            <div className="text-[#fff4e0] font-bold text-xs sm:text-base leading-tight truncate">{levelName}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto shrink-0">
          <button onClick={toggle} className={`${panel} h-9 sm:h-11 px-2 sm:px-3 rounded-2xl flex items-center justify-center text-[#fff4e0] text-xs font-bold active:scale-90 transition`}>
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
          <button onClick={onToggleMute} className={`${panel} w-9 sm:w-11 h-9 sm:h-11 rounded-2xl flex items-center justify-center text-[#fff4e0] active:scale-90 transition`} title="Mute">
            {muted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
          <button onClick={onRestartLevel} className={`${panel} w-9 sm:w-11 h-9 sm:h-11 rounded-2xl flex items-center justify-center text-[#f7a45c] active:scale-90 transition`} title={t.replay}>
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button onClick={onOpenLeaderboard} className={`${panel} w-9 sm:w-11 h-9 sm:h-11 rounded-2xl flex items-center justify-center text-[#ffd166] active:scale-90 transition`} title="Leaderboard">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button onClick={onOpenMap} className={`${panel} relative w-10 sm:w-12 h-9 sm:h-11 rounded-2xl flex items-center justify-center text-[#fff4e0] active:scale-90 transition`} title="Map">
            <MapIcon className="w-4 h-4 sm:w-6 sm:h-6" />
            <span className={`absolute -top-1 -right-1 min-w-[18px] sm:min-w-[22px] h-[18px] sm:h-[22px] px-1 rounded-full text-[9px] sm:text-[11px] font-bold flex items-center justify-center border-2 border-[#2a1a10] ${freeViews > 0 ? 'bg-[#7fb35a] text-white' : 'bg-[#f08a3c] text-white'}`}>
              {freeViews > 0 ? freeViews : 'AD'}
            </span>
          </button>
        </div>
      </div>
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
