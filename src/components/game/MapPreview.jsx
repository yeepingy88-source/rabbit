import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { drawMiniMap } from '@/lib/game/minimap';
import { drawCarrot, drawBurrow, drawRoots } from '@/lib/game/characters';
import { sfx } from '@/lib/game/sound';
import { useLang } from '@/lib/i18n';

export default function MapPreview({ stateRef, onDone }) {
  const { t } = useLang();
  const mapRef = useRef(null);
  const markRef = useRef(null);
  const [count, setCount] = useState(3);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const draw = () => {
      const s = stateRef.current, c = mapRef.current, m = markRef.current;
      if (!s || !c || !m) return;
      const dpr = window.devicePixelRatio || 1, w = c.clientWidth, h = c.clientHeight;
      [c, m].forEach((x) => {
        if (x.width !== Math.round(w * dpr) || x.height !== Math.round(h * dpr)) {
          x.width = Math.round(w * dpr); x.height = Math.round(h * dpr);
        }
      });
      const ctx = c.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      drawMiniMap(ctx, s, w, h, 0);

      const mk = m.getContext('2d');
      mk.setTransform(dpr, 0, 0, dpr, 0, 0);
      mk.clearRect(0, 0, w, h);
      const ts = Math.min((w - 20) / s.W, (h - 20) / s.H);
      const cx = (x) => (w - ts * s.W) / 2 + (x + 0.5) * ts;
      const cy = (y) => (h - ts * s.H) / 2 + (y + 0.5) * ts;

      const halo = (x, y) => {
        const g = mk.createRadialGradient(x, y, 0, x, y, ts * 1.6);
        g.addColorStop(0, 'rgba(255,250,230,0.95)'); g.addColorStop(1, 'rgba(255,250,230,0)');
        mk.fillStyle = g; mk.beginPath(); mk.arc(x, y, ts * 1.6, 0, Math.PI * 2); mk.fill();
      };
      const label = (x, y, text) => {
        mk.font = `bold ${Math.max(11, Math.round(ts * 0.65))}px 'Noto Sans TC', sans-serif`;
        const tw = mk.measureText(text).width;
        mk.fillStyle = 'rgba(74,44,24,0.85)';
        mk.beginPath(); mk.roundRect(x - tw / 2 - 7, y, tw + 14, 20, 10); mk.fill();
        mk.fillStyle = '#fff4e0'; mk.textAlign = 'center'; mk.fillText(text, x, y + 14);
      };

      halo(cx(s.start.x), cy(s.start.y));
      drawBurrow(mk, cx(s.start.x), cy(s.start.y), ts * 1.6);
      label(cx(s.start.x), cy(s.start.y) - ts * 1.6, t.startCave);

      halo(cx(s.exit.x), cy(s.exit.y) + ts * 0.3);
      drawCarrot(mk, cx(s.exit.x), cy(s.exit.y) + ts * 0.3, ts * 2.4, 0, 0);
      label(cx(s.exit.x), cy(s.exit.y) + ts * 1.4, t.giantCarrot);

      halo(cx(s.landmark.x), cy(s.landmark.y));
      drawRoots(mk, cx(s.landmark.x), cy(s.landmark.y), ts * 1.5);
      label(cx(s.landmark.x), cy(s.landmark.y) + ts * 1.1, t.ancientRoot);
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [stateRef, t]);

  useEffect(() => {
    if (count <= 0) return;
    sfx.tick();
    const timer = setTimeout(() => setCount((c) => c - 1), 900);
    return () => clearTimeout(timer);
  }, [count]);

  useEffect(() => {
    if (count !== 0) return;
    const timer = setTimeout(() => setLeaving(true), 450);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col p-4"
      style={{ background: 'radial-gradient(ellipse at center, #f2e3c0 0%, #dcc194 55%, #b39b6d 100%)' }}
      animate={leaving ? { opacity: 0, scale: 1.18 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      onAnimationComplete={() => leaving && onDone()}
    >
      <div className="text-center shrink-0">
        <div className="text-[10px] tracking-[0.4em] text-[#8a6a50] font-semibold">{t.level(stateRef.current?.level || 1)}</div>
        <h2 className="text-2xl font-bold text-[#4a2c18]">{t.previewTitle}</h2>
        <p className="text-xs text-[#8a6a50] mt-1">{t.previewHint}</p>
      </div>
      <div className="relative flex-1 min-h-0 w-full max-w-lg mx-auto my-3 rounded-3xl border-4 border-dashed border-[#a0643a]/50 overflow-hidden">
        <canvas ref={mapRef} className="absolute inset-0 w-full h-full" style={{ filter: 'blur(6px)' }} />
        <canvas ref={markRef} className="absolute inset-0 w-full h-full" />
      </div>
      <div className="h-24 shrink-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={count}
            initial={{ scale: 1.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            className="text-7xl font-bold text-[#5a331b]"
          >
            {count > 0 ? count : t.go}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
