import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Carrot, RotateCcw, Sparkles, Star, Trophy, Crown, Zap, Home } from 'lucide-react';
import { useLang } from '@/lib/i18n';

const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

export default function VictoryScreen({ level, result, onNext, onReplay, onRestartGame, onGoHome }) {
  const { t } = useLang();
  const isFinal = level >= 20;

  const stats = [
    [t.statTime, fmt(result.time)],
    [t.statDigs, result.digs],
    [t.statCarrots, result.carrots],
    [t.statWater, result.water],
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`absolute inset-0 z-50 overflow-y-auto flex flex-col items-center justify-center px-4 py-8 text-center ${
        isFinal
          ? 'bg-gradient-to-b from-[#fef08a] via-[#fff4e0] to-[#fbd38d]'
          : 'bg-gradient-to-b from-[#bfe3a0] via-[#fff4e0] to-[#f6e7c8]'
      }`}
    >
      {/* Visual Badge / Carrot Centerpiece */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10, delay: 0.1 }}
        className={`relative ${
          isFinal ? 'w-36 h-36' : 'w-32 h-32'
        } rounded-full bg-gradient-to-br from-[#f7a45c] to-[#e0702a] flex items-center justify-center shadow-[0_24px_60px_rgba(224,112,42,0.45)] border-4 ${
          isFinal ? 'border-[#ffd700]' : 'border-white/50'
        }`}
      >
        <Carrot className={`${isFinal ? 'w-20 h-20 text-[#fff5eb]' : 'w-16 h-16 text-white'}`} />
        {isFinal ? (
          <>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute -top-6 -right-2 text-[#eab308]"
            >
              <Crown className="w-12 h-12 text-[#eab308] fill-[#facc15] drop-shadow-md" />
            </motion.div>
            <Sparkles className="absolute -top-3 -left-3 w-8 h-8 text-[#ffd700] animate-bounce" />
            <Sparkles className="absolute -bottom-2 -right-3 w-8 h-8 text-[#f97316] animate-pulse" />
          </>
        ) : (
          <>
            <Sparkles className="absolute -top-2 -right-3 w-8 h-8 text-[#ffd166]" />
            <Sparkles className="absolute -bottom-1 -left-4 w-6 h-6 text-[#7fb35a]" />
          </>
        )}
      </motion.div>

      {/* Level Tag & Title */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {isFinal && <Trophy className="w-5 h-5 text-[#eab308]" />}
        <p className="text-xs tracking-[0.35em] text-[#a0643a] font-bold uppercase">
          {isFinal ? '🌟 終極挑戰達成 · FINALE' : t.levelDone(level)}
        </p>
        {isFinal && <Trophy className="w-5 h-5 text-[#eab308]" />}
      </div>

      <h2
        className={`mt-2 font-black text-[#4a2c18] leading-tight ${
          isFinal ? 'text-3xl sm:text-4xl text-[#78350f]' : 'text-3xl sm:text-4xl'
        }`}
      >
        {isFinal ? t.grandWinTitle : t.winTitle}
      </h2>

      <p className="mt-3 max-w-sm text-sm text-[#8a6a50] leading-relaxed">
        {isFinal ? t.grandWinStory : t.winStory}
      </p>

      {/* Stamina Bonus Banner for non-final levels */}
      {!isFinal && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[11px] font-bold text-[#b45309]">
          <Zap className="w-3.5 h-3.5 fill-[#d97706]" />
          <span>體力跨關卡繼承：當前剩餘體力 + 10 勝利獎勵（上限 100）</span>
        </div>
      )}

      {/* Stars & Score */}
      <div className="mt-4 flex items-center gap-4">
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <Star
              key={i}
              className={`w-9 h-9 ${
                i <= result.stars
                  ? 'text-[#ffd166] drop-shadow-[0_2px_8px_rgba(250,204,21,0.5)]'
                  : 'text-[#d9c9a8]'
              }`}
              fill={i <= result.stars ? '#ffd166' : 'none'}
            />
          ))}
        </div>
        <div className="text-left">
          <div className="text-3xl font-black text-[#4a2c18] tabular-nums leading-none">
            {result.score}
            <span className="text-sm font-bold ml-1 text-[#8a6a50]">{t.scoreUnit}</span>
          </div>
          {result.rank <= 10 && (
            <div className="text-xs text-[#a0643a] font-bold mt-1">{t.rank(result.rank)}</div>
          )}
        </div>
      </div>

      {/* Level Stats */}
      <div className="mt-5 grid grid-cols-4 gap-2 w-full max-w-sm">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-white/80 backdrop-blur-sm py-3.5 shadow-sm border border-[#e5cfac]/40">
            <div className="text-xl sm:text-2xl font-black text-[#4a2c18] tabular-nums">{v}</div>
            <div className="text-xs text-[#a0643a] font-semibold mt-0.5">{k}</div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col gap-2.5 w-full max-w-sm">
        <div className="flex gap-2.5 w-full">
          <button
            onClick={onReplay}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-3 rounded-full bg-white/95 text-[#5a331b] font-bold text-sm shadow active:scale-95 transition hover:bg-white"
          >
            <RotateCcw className="w-4 h-4" /> <span>{level === 20 ? t.replayFinal : t.replay}</span>
          </button>
          <button
            onClick={onNext}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-3 rounded-full bg-gradient-to-b from-[#f7a45c] to-[#e0702a] text-white font-extrabold text-sm shadow-lg active:scale-95 transition hover:brightness-105"
          >
            <span>{t.next}</span> <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onGoHome || onRestartGame}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#5a331b]/10 border border-[#5a331b]/20 text-[#5a331b] font-bold text-sm active:scale-95 transition hover:bg-[#5a331b]/20"
        >
          <Home className="w-4 h-4" />
          <span>{t.homeButton}</span>
        </button>
      </div>
    </motion.div>
  );
}
