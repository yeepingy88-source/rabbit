import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Carrot, Tv, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function AdPlayer({ type = 'rewarded', onDone }) {
  const { lang } = useLang();
  const isZh = lang === 'zh';
  const total = 2; // 2-second mock ad player
  const [left, setLeft] = useState(total);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatically trigger completion after 2 seconds
  useEffect(() => {
    if (completed) {
      const autoTimeout = setTimeout(() => {
        onDone();
      }, 500);
      return () => clearTimeout(autoTimeout);
    }
  }, [completed, onDone]);

  const isRewarded = type === 'rewarded' || type === 'stamina' || type === 'craft' || type === 'carrots';

  return (
    <div className="fixed inset-0 z-[200] bg-[#120a05]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-[#fff4e0] select-none">
      {/* Top Banner */}
      <div className="absolute top-5 left-5 flex items-center gap-2">
        <span className="text-[11px] tracking-wider px-2.5 py-1 rounded-full bg-white/10 font-bold border border-white/15 flex items-center gap-1.5">
          <Tv className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {isRewarded
              ? (isZh ? '📺 激勵影音廣告 (2秒)' : '📺 Rewarded Video (2s)')
              : (isZh ? '📢 精彩插頁廣告 (2秒)' : '📢 Interstitial Ad (2s)')}
          </span>
        </span>
      </div>

      <div className="absolute top-5 right-5 flex items-center gap-2">
        <span className="px-3 py-1.5 rounded-full bg-white/15 text-xs font-bold tabular-nums border border-white/20">
          {completed ? (isZh ? '已完成' : 'Completed') : `${left} 秒`}
        </span>
        {completed && (
          <button
            type="button"
            onClick={onDone}
            className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow active:scale-95 transition cursor-pointer"
          >
            {isZh ? '領取獎勵 ✕' : 'Claim ✕'}
          </button>
        )}
      </div>

      {/* Main Ad Creative Mockup */}
      <motion.div
        animate={{ rotate: [0, -6, 6, 0], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="relative w-32 h-32 rounded-[36px] bg-gradient-to-br from-[#f7a45c] to-[#e0702a] flex items-center justify-center shadow-[0_20px_60px_rgba(240,138,60,0.5)] border-4 border-amber-300"
      >
        <Carrot className="w-16 h-16 text-white" strokeWidth={2.2} />
        <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-amber-200 animate-pulse" />
      </motion.div>

      <h2 className="mt-7 text-2xl sm:text-3xl font-black text-amber-100 text-center">
        {isZh ? '🥕 森林鮮榨特級胡蘿蔔飲' : '🥕 Forest Fresh Carrot Energy'}
      </h2>
      <p className="mt-2 text-sm text-amber-200/80 text-center max-w-xs font-medium">
        {isZh
          ? '深淵冒險者的能量首選 · 滿滿元氣一飲而盡！'
          : 'The ultimate energy booster for underground bunnies!'}
      </p>

      {/* 2-second Progress Bar */}
      <div className="mt-8 w-full max-w-xs h-2 rounded-full bg-white/15 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'linear' }}
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
        />
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-300/80 font-bold">
        {completed ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300">{isZh ? '廣告播放完畢，正在發放獎勵...' : 'Ad complete, granting reward...'}</span>
          </>
        ) : (
          <span>{isZh ? '廣告播放結束後將立即兌現獎勵' : 'Reward will be granted upon completion'}</span>
        )}
      </div>
    </div>
  );
}
