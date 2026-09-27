import React from 'react';
import { motion } from 'framer-motion';
import { Carrot, Play } from 'lucide-react';

export default function IntroScreen({ onStart }) {
  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#7fb35a] via-[#5a331b] to-[#1a0f08]">
      <div className="min-h-full flex flex-col items-center justify-center px-6 py-12 text-center">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}
          className="relative w-24 h-24 rounded-[30px] bg-[#fff4e0] flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <Carrot className="w-12 h-12 text-[#f08a3c]" strokeWidth={2.2} />
          <div className="absolute inset-0 rounded-[30px] ring-8 ring-[#fff4e0]/20 animate-pulse" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}>
          <p className="mt-8 text-xs tracking-[0.4em] text-[#fff4e0]/70 font-semibold">BUNNY UNDERGROUND · CARROT DIG</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-[#fff4e0] leading-tight">兔兔穿土記</h1>
          <p className="mt-2 text-lg text-[#ffd1a3] font-semibold">終極蘿蔔大冒險</p>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.8 }}
          className="mt-8 max-w-sm text-[15px] leading-relaxed text-[#fff4e0]/80">
          翠綠森林的地底，長著傳說中的「奇蹟巨型蘿蔔」。小白兔雪波戴上特製挖泥手套，跳進錯綜複雜的土層迷宮 —— 幫她找到通往蘿蔔的出口，破土而出吧！
        </motion.p>
        <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55 }}
          onClick={onStart}
          className="mt-10 flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-b from-[#f7a45c] to-[#e0702a] text-white text-lg font-bold shadow-[0_14px_40px_rgba(240,138,60,0.45)] active:scale-95 transition">
          <Play className="w-5 h-5" fill="white" /> 開始挖掘
        </motion.button>
        <div className="mt-10 grid grid-cols-3 gap-3 max-w-sm w-full text-[11px] text-[#fff4e0]/60">
          <div className="rounded-2xl bg-black/20 p-3">左下搖桿<br />8 方向移動</div>
          <div className="rounded-2xl bg-black/20 p-3">右下挖掘<br />打通軟土牆</div>
          <div className="rounded-2xl bg-black/20 p-3">右上地圖<br />每日免費 2 次</div>
        </div>
      </div>
    </div>
  );
}