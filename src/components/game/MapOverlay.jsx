import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { drawMiniMap } from '@/lib/game/minimap';
import MapLegend from './MapLegend';

const LABELS = { free: '免費查看', quick: '快速偷看', full: '完整研究' };

export default function MapOverlay({ stateRef, mode, onClose }) {
  const canvasRef = useRef(null);
  const [left, setLeft] = useState(8);

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

  useEffect(() => {
    if (mode !== 'quick') return;
    const id = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(id);
  }, [mode]);

  useEffect(() => { if (mode === 'quick' && left <= 0) onClose(); }, [left, mode, onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 bg-[#120a05]/85 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', damping: 22 }}
        className="w-full max-w-lg h-full max-h-[760px] flex flex-col rounded-[28px] bg-[#f6e7c8] border-4 border-[#c99461] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-[#a0643a] font-semibold">{LABELS[mode]}</div>
            <div className="text-xl font-bold text-[#4a2c18]">地下全圖</div>
          </div>
          <div className="flex items-center gap-2">
            {mode === 'quick' && (
              <div className="w-11 h-11 rounded-full bg-[#f08a3c] text-white font-bold flex items-center justify-center tabular-nums">{Math.max(0, left)}s</div>
            )}
            <button onClick={onClose} className="w-11 h-11 rounded-full bg-[#4a2c18] text-[#fff4e0] flex items-center justify-center active:scale-90 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 mx-4 rounded-2xl bg-[#e8d3a8]/60">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
        <MapLegend />
      </motion.div>
    </motion.div>
  );
}