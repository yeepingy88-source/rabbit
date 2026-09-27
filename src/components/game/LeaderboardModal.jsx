import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, X, Star, Crown } from 'lucide-react';
import { getScores } from '@/lib/game/scores';

const RANK_COLOR = ['text-[#e0a12c]', 'text-[#9a8a7a]', 'text-[#b08a5f]'];

export default function LeaderboardModal({ onClose }) {
  const scores = getScores();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 bg-[#120a05]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <motion.div initial={{ y: 40 }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 24 }} className="w-full max-w-sm rounded-[28px] bg-[#fff4e0] p-5 max-h-[85%] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-[#ffd166]/50 flex items-center justify-center"><Trophy className="w-5 h-5 text-[#a0643a]" /></div>
          <h3 className="flex-1 text-xl font-bold text-[#4a2c18]">兔兔村榮譽榜</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#4a2c18] text-[#fff4e0] flex items-center justify-center active:scale-90 transition"><X className="w-5 h-5" /></button>
        </div>
        {scores.length === 0 ? (
          <p className="text-center text-sm text-[#8a6a50] py-10">還沒有任何紀錄 —— 快去完成第一關吧！</p>
        ) : (
          <div className="space-y-1.5">
            {scores.map((e, i) => (
              <div key={e.id} className={`flex items-center gap-3 rounded-2xl p-3 ${i === 0 ? 'bg-[#ffd166]/40' : 'bg-[#f6e7c8]'}`}>
                <div className={`w-8 text-center font-bold text-lg ${RANK_COLOR[i] || 'text-[#8a6a50]'}`}>
                  {i === 0 ? <Crown className="w-6 h-6 mx-auto" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= e.stars ? 'text-[#ffd166]' : 'text-[#d9c9a8]'}`} fill={s <= e.stars ? '#ffd166' : 'none'} />
                    ))}
                  </div>
                  <div className="text-[11px] text-[#8a6a50] mt-0.5">第 {e.level} 關 · {e.date}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-[#4a2c18] tabular-nums leading-none">{e.score}</div>
                  <div className="text-[10px] text-[#a0643a] mt-0.5 tabular-nums">{Math.floor(e.time / 60)}:{String(e.time % 60).padStart(2, '0')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-center text-[11px] text-[#8a6a50] mt-4">本裝置最佳紀錄前 10 名</p>
      </motion.div>
    </motion.div>
  );
}