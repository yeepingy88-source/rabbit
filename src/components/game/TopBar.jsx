import React from 'react';
import { Map as MapIcon, Volume2, VolumeX, Zap, Trophy, RotateCcw } from 'lucide-react';
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
}) {
  const { t, lang, toggle } = useLang();
  return (
    <div className="absolute top-0 inset-x-0 p-3 sm:p-4 flex flex-col gap-2 pointer-events-none">
      <div className="flex items-center justify-between gap-2">
        <div className={`${panel} rounded-2xl px-4 py-2 pointer-events-auto`}>
          <div className="text-[10px] tracking-[0.25em] text-[#f7a45c] font-semibold">{t.level(level)}</div>
          <div className="text-[#fff4e0] font-bold text-base leading-tight">{levelName}</div>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <button onClick={toggle} className={`${panel} h-11 px-3 rounded-2xl flex items-center justify-center text-[#fff4e0] text-xs font-bold active:scale-90 transition`}>
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
          <button onClick={onToggleMute} className={`${panel} w-11 h-11 rounded-2xl flex items-center justify-center text-[#fff4e0] active:scale-90 transition`} title="Mute">
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button onClick={onRestartLevel} className={`${panel} w-11 h-11 rounded-2xl flex items-center justify-center text-[#f7a45c] active:scale-90 transition`} title={t.replay}>
            <RotateCcw className="w-5 h-5" />
          </button>
          <button onClick={onOpenLeaderboard} className={`${panel} w-11 h-11 rounded-2xl flex items-center justify-center text-[#ffd166] active:scale-90 transition`} title="Leaderboard">
            <Trophy className="w-5 h-5" />
          </button>
          <button onClick={onOpenMap} className={`${panel} relative w-12 h-12 rounded-2xl flex items-center justify-center text-[#fff4e0] active:scale-90 transition`} title="Map">
            <MapIcon className="w-6 h-6" />
            <span className={`absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 rounded-full text-[11px] font-bold flex items-center justify-center border-2 border-[#2a1a10] ${freeViews > 0 ? 'bg-[#7fb35a] text-white' : 'bg-[#f08a3c] text-white'}`}>
              {freeViews > 0 ? freeViews : 'AD'}
            </span>
          </button>
        </div>
      </div>
      <div className={`${panel} rounded-2xl px-3 py-2 flex items-center gap-2 max-w-md w-full`}>
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
