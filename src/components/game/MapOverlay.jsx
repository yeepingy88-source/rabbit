import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { drawMiniMap } from '@/lib/game/minimap';
import MapLegend from './MapLegend';

const LABELS = { free: '測試全圖檢視（無限制）', quick: '測試全圖檢視（無限制）', full: '測試完整地圖（無限次數）' };

export default function MapOverlay({ stateRef, mode, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current, ctx = c.getContext('2d');
    let raf;
    const loop = (now) => {
      const dpr = window.devicePixelRatio || 1, w = c.clientWidth, h = c.clientHeight;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawMiniMap(ctx, stateRef.current, w, h, now / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [stateRef]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="absolute inset-0 z-30 bg-[#120a05]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg h-full max-h-[760px] flex flex-col rounded-[28px] bg-[#f6e7c8] border-4 border-[#c99461] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] tracking-[0.2em] text-[#a0643a] font-bold uppercase">
                {LABELS[mode] || '地下全圖（測試無限制）'}
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black">
                TESTING ∞
              </span>
            </div>
            <div className="text-xl font-bold text-[#4a2c18]">地下全圖</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full bg-[#4a2c18] text-[#fff4e0] flex items-center justify-center active:scale-90 transition hover:bg-[#5a361e] shadow"
              title="Close Map"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 mx-4 rounded-2xl bg-[#e8d3a8]/60 overflow-hidden shadow-inner">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
        <MapLegend />
      </motion.div>
    </motion.div>
  );
}