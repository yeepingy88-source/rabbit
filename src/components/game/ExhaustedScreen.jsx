import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw, Sparkles, Home } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function ExhaustedScreen({ reason, level, inv, onRevive, onReplay, onRestartGame }) {
  const { t } = useLang();
  const hasBrew = (inv.brew || 0) > 0;
  const isBeetle = reason === 'beetle';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 bg-[#120a05]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#2a1710] to-[#1c0e08] border-2 border-[#ef4444]/40 shadow-[0_20px_50px_rgba(239,68,68,0.25)] p-6 text-center text-[#fff4e0]"
      >
        {/* Warning Icon Badge */}
        <div className="mx-auto w-20 h-20 rounded-full bg-[#ef4444]/20 border-2 border-[#ef4444]/60 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)]">
          <AlertTriangle className="w-10 h-10 text-[#ef4444] animate-pulse" />
        </div>

        {/* Level & Title */}
        <div className="mt-4 text-[11px] font-bold tracking-[0.25em] text-[#f87171] uppercase">
          {t.level(level)}
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-[#fff4e0]">
          {t.exhaustedTitle}
        </h2>

        {/* Story / Description */}
        <p className="mt-2 text-xs sm:text-sm text-[#fca5a5] leading-relaxed">
          {isBeetle ? t.exhaustedByBeetleStory : t.exhaustedStory}
        </p>

        {/* Tactical Tip */}
        <div className="mt-4 rounded-2xl bg-[#3f1d18]/60 border border-[#f87171]/25 p-3 text-left">
          <div className="text-[11px] text-[#fed7aa] font-semibold leading-relaxed">
            {t.beetleEvadeTip}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          {hasBrew && (
            <button
              onClick={onRevive}
              className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-black text-sm shadow-[0_8px_20px_rgba(16,185,129,0.35)] active:scale-95 transition flex items-center justify-center gap-2 hover:brightness-110"
            >
              <Sparkles className="w-4 h-4 text-[#a7f3d0]" />
              <span>{t.reviveWithBrew(inv.brew)}</span>
            </button>
          )}

          <button
            onClick={onReplay}
            className="w-full py-3.5 px-4 rounded-full bg-gradient-to-b from-[#f7a45c] to-[#e0702a] text-white font-bold text-sm shadow-[0_8px_20px_rgba(240,138,60,0.35)] active:scale-95 transition flex items-center justify-center gap-2 hover:brightness-105"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.retryLevel}</span>
          </button>

          <button
            onClick={onRestartGame}
            className="w-full py-2.5 px-4 rounded-full bg-[#3d2417] text-[#fed7aa] font-semibold text-xs active:scale-95 transition hover:bg-[#4d2d1d] flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t.restartGame}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
