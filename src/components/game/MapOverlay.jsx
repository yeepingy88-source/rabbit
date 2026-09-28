import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Compass, ArrowLeft } from 'lucide-react';
import { drawAncientMap } from '@/lib/game/minimap';
import { drawCarrot, drawBurrow, drawRoots, drawBunny } from '@/lib/game/characters';
import { useLang } from '@/lib/i18n';

export default function MapOverlay({ stateRef, onClose }) {
  const { t, lang } = useLang();
  const isZh = lang === 'zh';
  const mapRef = useRef(null);
  const markRef = useRef(null);

  useEffect(() => {
    let animId;
    const draw = () => {
      const s = stateRef.current, c = mapRef.current, m = markRef.current;
      if (!s || !c || !m) return;
      const dpr = window.devicePixelRatio || 1, w = c.clientWidth, h = c.clientHeight;
      [c, m].forEach((x) => {
        if (x.width !== Math.round(w * dpr) || x.height !== Math.round(h * dpr)) {
          x.width = Math.round(w * dpr); x.height = Math.round(h * dpr);
        }
      });

      // 1. Draw Ancient Treasure Map base corridors & stone walls
      const ctx = c.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      drawAncientMap(ctx, s, w, h);

      // 2. Draw Landmark & Player Position Overlays
      const mk = m.getContext('2d');
      mk.setTransform(dpr, 0, 0, dpr, 0, 0);
      mk.clearRect(0, 0, w, h);
      const ts = Math.min((w - 20) / s.W, (h - 20) / s.H);
      const cx = (x) => (w - ts * s.W) / 2 + (x + 0.5) * ts;
      const cy = (y) => (h - ts * s.H) / 2 + (y + 0.5) * ts;
      const now = performance.now() / 1000;

      const halo = (x, y, rad = ts * 1.6, color = 'rgba(255,250,230,0.95)') => {
        const g = mk.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, color);
        g.addColorStop(1, 'rgba(255,250,230,0)');
        mk.fillStyle = g;
        mk.beginPath();
        mk.arc(x, y, rad, 0, Math.PI * 2);
        mk.fill();
      };

      const label = (x, y, text, isPlayer = false) => {
        mk.font = `bold ${Math.max(10, Math.round(ts * 0.65))}px 'Noto Sans TC', sans-serif`;
        const tw = mk.measureText(text).width;
        mk.fillStyle = isPlayer ? 'rgba(234,88,12,0.92)' : 'rgba(74,44,24,0.85)';
        mk.beginPath();
        if (typeof mk.roundRect === 'function') {
          mk.roundRect(x - tw / 2 - 6, y, tw + 12, 18, 9);
        } else {
          mk.rect(x - tw / 2 - 6, y, tw + 12, 18);
        }
        mk.fill();
        mk.fillStyle = '#ffffff';
        mk.textAlign = 'center';
        mk.fillText(text, x, y + 13);
      };

      // 1. Start Burrow
      halo(cx(s.start.x), cy(s.start.y));
      drawBurrow(mk, cx(s.start.x), cy(s.start.y), ts * 1.5);
      label(cx(s.start.x), cy(s.start.y) - ts * 1.5, t.startCave);

      // 2. Giant Carrot Exit
      halo(cx(s.exit.x), cy(s.exit.y) + ts * 0.3, ts * 1.8, 'rgba(255,235,160,0.95)');
      drawCarrot(mk, cx(s.exit.x), cy(s.exit.y) + ts * 0.3, ts * 2.2, 0, 0);
      label(cx(s.exit.x), cy(s.exit.y) + ts * 1.4, t.giantCarrot);

      // 3. Ancient Root Landmark
      halo(cx(s.landmark.x), cy(s.landmark.y));
      drawRoots(mk, cx(s.landmark.x), cy(s.landmark.y), ts * 1.4);
      label(cx(s.landmark.x), cy(s.landmark.y) + ts * 1.1, t.ancientRoot);

      // 4. Encounters (Hot Spring, Mole Peddler, Chest)
      (s.encounters || []).forEach((enc) => {
        const ex = cx(enc.x), ey = cy(enc.y);
        if (enc.type === 'spring') {
          halo(ex, ey, ts * 1.3, 'rgba(56,189,248,0.85)');
          label(ex, ey - ts * 1.2, isZh ? '♨️ 暖暖溫泉' : '♨️ Hot Spring');
        } else if (enc.type === 'merchant') {
          halo(ex, ey, ts * 1.3, 'rgba(251,146,60,0.85)');
          label(ex, ey - ts * 1.2, isZh ? '🕶️ 鼴鼠商人' : '🕶️ Merchant');
        }
      });

      // 5. Current Bunny Position (🐰 雪波位置) with pulsating beacon
      const px = cx(s.x), py = cy(s.y);
      const pulse = 0.5 + 0.5 * Math.sin(now * 5);
      const pulseRad = ts * (1.2 + 0.6 * pulse);
      halo(px, py, pulseRad, `rgba(255,107,139,${0.65 - 0.25 * pulse})`);
      drawBunny(mk, px, py, ts * 1.4, s.facing, now, false, s.drillActive);
      label(px, py - ts * 1.5, isZh ? '🐰 你在這裡' : '🐰 You Are Here', true);
    };

    draw();
    animId = requestAnimationFrame(function loop() {
      draw();
      animId = requestAnimationFrame(loop);
    });

    window.addEventListener('resize', draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', draw);
    };
  }, [stateRef, t, isZh]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md select-none"
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        transition={{ type: 'spring', damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-[#FFFDF9] border-2 border-amber-300 shadow-[0_24px_70px_rgba(0,0,0,0.4)] text-amber-950 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-200/80 bg-gradient-to-r from-amber-100/90 via-orange-50/90 to-amber-100/90">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🗺️</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-amber-950 leading-tight">
                  {t.previewTitle}
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {isZh ? '隨時免費查閱' : 'Free Inspection'}
                </span>
              </div>
              <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
                {isZh ? '核對完整地圖路線 · 標註兔兔當前位置與神聖巨蘿蔔出口' : 'Check full maze corridors · Shows current position and exit'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-amber-200/60 hover:bg-amber-200 flex items-center justify-center text-amber-900 active:scale-90 transition border border-amber-300 cursor-pointer shadow-sm"
            title={isZh ? '關閉地圖' : 'Close Map'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ancient Treasure Map Canvas Viewport */}
        <div className="flex-1 min-h-[300px] sm:min-h-[380px] p-3 sm:p-4 flex flex-col bg-gradient-to-b from-[#f2e3c0] to-[#e4cc9d]">
          <div className="relative flex-1 w-full rounded-2xl border-4 border-dashed border-[#a0643a]/50 overflow-hidden shadow-[inset_0_4px_16px_rgba(0,0,0,0.25)] bg-[#422a19]">
            <canvas ref={mapRef} className="absolute inset-0 w-full h-full block" />
            <canvas ref={markRef} className="absolute inset-0 w-full h-full pointer-events-none block" />
          </div>
        </div>

        {/* Legend & Close Action Bar */}
        <div className="px-4 py-3 bg-[#FFFDF9] border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1 text-[11px] font-bold text-amber-900">
            <span className="flex items-center gap-1">🐰 {isZh ? '當前位置' : 'You'}</span>
            <span className="flex items-center gap-1">🕳️ {t.startCave}</span>
            <span className="flex items-center gap-1">🥕 {t.giantCarrot}</span>
            <span className="flex items-center gap-1">🌿 {t.ancientRoot}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isZh ? '關閉地圖 (繼續冒險)' : 'Resume Digging'}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
