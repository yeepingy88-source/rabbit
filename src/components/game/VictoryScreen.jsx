import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Carrot, RotateCcw, Sparkles, Star, Trophy, Crown, Zap, Home, MapPin, Tv, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/lib/i18n';

const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

export default function VictoryScreen({
  level,
  result,
  clearRefund = 0,
  carrotsDoubled = false,
  onDoubleCarrots,
  onNext,
  onReplay,
  onRestartGame,
  onGoHome,
  onOpenLevelSelect,
}) {
  const { t, lang } = useLang();
  const isZh = lang === 'zh';
  const isFinal = level >= 50;

  const currentCarrots = carrotsDoubled ? (result.carrots * 2) : result.carrots;

  const stats = [
    [t.statTime, fmt(result.time)],
    [t.statDigs, result.digs],
    [t.statCarrots, currentCarrots],
    [t.statWater, result.water],
    [isZh ? '📦 素材' : '📦 Mat', result.materials || 0],
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
          {isFinal ? (isZh ? '🌟 終極第 50 關達成 · 傳奇通關' : '🌟 FINALE · LEVEL 50 CONQUERED') : t.levelDone(level)}
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

      <p className="mt-3 max-w-sm text-sm text-[#8a6a50] leading-relaxed font-medium">
        {isFinal ? t.grandWinStory : t.winStory}
      </p>

      {/* Stamina Refund Banner */}
      {clearRefund > 0 && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100/90 border border-emerald-300 text-xs font-black text-emerald-900 shadow-sm">
          <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
          <span>
            {isZh
              ? `⚡ 通關成功！已退還 +${clearRefund} 全域體力`
              : `⚡ Victory! Refunded +${clearRefund} Stamina`}
          </span>
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

      {/* Dynamic Star Rating Details */}
      <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-bold text-amber-900 bg-white/70 py-1.5 px-3 rounded-xl border border-amber-200/80 max-w-sm">
        <span className={result.stars >= 1 ? 'text-amber-700' : 'text-stone-400'}>⭐ {isZh ? '通關' : 'Exit'}</span>
        <span>•</span>
        <span className={result.stars >= 2 ? 'text-amber-700' : 'text-stone-400'}>
          ⭐⭐ {isZh ? `步行 ≤${result.target2 || 25}s` : `Walk ≤${result.target2 || 25}s`}
        </span>
        <span>•</span>
        <span className={result.stars >= 3 ? 'text-amber-700' : 'text-stone-400'}>
          ⭐⭐⭐ {isZh ? `捷徑 ≤${result.target3 || 15}s` : `Speed ≤${result.target3 || 15}s`}
        </span>
      </div>

      {/* Level Stats (5 items: Time, Digs, Carrots, Water, Materials) */}
      <div className="mt-5 grid grid-cols-5 gap-1.5 sm:gap-2 w-full max-w-sm sm:max-w-md">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-white/80 backdrop-blur-sm py-3 px-1 shadow-sm border border-[#e5cfac]/40">
            <div className="text-lg sm:text-2xl font-black text-[#4a2c18] tabular-nums">{v}</div>
            <div className="text-[10px] sm:text-xs text-[#a0643a] font-semibold mt-0.5 truncate">{k}</div>
          </div>
        ))}
      </div>

      {/* Monetization: Rewarded Ad Carrot Doubler Button */}
      <div className="mt-6 w-full max-w-sm">
        {carrotsDoubled ? (
          <div className="py-2.5 px-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black flex items-center justify-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isZh ? `已獲得雙倍胡蘿蔔！(+${result.carrots} 🥕)` : `Carrots Doubled! (+${result.carrots} 🥕)`}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onDoubleCarrots}
            disabled={!result.carrots || result.carrots <= 0}
            className={`w-full py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition cursor-pointer ${
              result.carrots > 0
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-white ring-2 ring-orange-300/50'
                : 'bg-stone-200 text-stone-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>
              {isZh
                ? `📺 看廣告 蘿蔔×2 (額外獲贈 +${result.carrots || 0} 🥕)`
                : `📺 Watch Ad: 2× Carrots (+${result.carrots || 0} 🥕)`}
            </span>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex flex-col gap-2.5 w-full max-w-sm">
        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg shadow-lg ring-2 ring-orange-300/50 active:scale-95 transition hover:brightness-105 cursor-pointer"
        >
          <span>{t.next}</span> <ArrowRight className="w-5 h-5" strokeWidth={2.8} />
        </button>

        <div className="flex gap-2.5 w-full">
          <button
            onClick={onReplay}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/95 text-[#5a331b] font-bold text-sm shadow active:scale-95 transition hover:bg-white border border-[#5a331b]/15 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> <span>{level >= 50 ? t.replayFinal : t.replay}</span>
          </button>
          {onOpenLevelSelect && (
            <button
              onClick={onOpenLevelSelect}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FFF8EB] border-2 border-[#ea580c]/30 text-[#9a3412] font-extrabold text-sm shadow active:scale-95 transition hover:bg-white cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#ea580c]" />
              <span>{t.selectLevel}</span>
            </button>
          )}
        </div>

        <button
          onClick={onGoHome || onRestartGame}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-black/5 hover:bg-black/10 text-[#5a331b]/80 font-semibold text-xs active:scale-95 transition cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>{t.home}</span>
        </button>
      </div>
    </motion.div>
  );
}
