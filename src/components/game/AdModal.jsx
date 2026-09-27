import React from 'react';
import { motion } from 'framer-motion';
import { Eye, BookOpen, Map as MapIcon } from 'lucide-react';

const Option = ({ icon: Icon, title, desc, tag, onClick, accent }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left transition active:scale-[0.98] ${accent}`}>
    <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
    <div className="flex-1">
      <div className="font-bold">{title}</div>
      <div className="text-xs opacity-80">{desc}</div>
    </div>
    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-black/20">{tag}</span>
  </button>
);

export default function AdModal({ onChoose, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 bg-[#120a05]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <motion.div initial={{ y: 40 }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 24 }} className="w-full max-w-sm rounded-[28px] bg-[#fff4e0] p-6 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#f6e7c8] flex items-center justify-center text-[#a0643a] mb-3"><MapIcon className="w-7 h-7" /></div>
        <h3 className="text-center text-xl font-bold text-[#4a2c18]">今日免費地圖已用完</h3>
        <p className="text-center text-sm text-[#8a6a50] mt-1 mb-5">看一段廣告，就能再看一次地下全圖</p>
        <div className="space-y-3">
          <Option icon={Eye} title="快速偷看（8 秒）" desc="看 5 秒短廣告，地圖顯示 8 秒" tag="5s 廣告" onClick={() => onChoose('quick')} accent="bg-gradient-to-r from-[#f7a45c] to-[#e0702a] text-white" />
          <Option icon={BookOpen} title="完整研究" desc="看 30 秒廣告，地圖開到你手動關閉" tag="30s 廣告" onClick={() => onChoose('full')} accent="bg-gradient-to-r from-[#7fb35a] to-[#5c9e3f] text-white" />
        </div>
        <button onClick={onCancel} className="w-full mt-4 py-3 rounded-2xl text-[#8a6a50] font-semibold hover:bg-[#f6e7c8] transition">取消</button>
      </motion.div>
    </motion.div>
  );
}