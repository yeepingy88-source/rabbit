import React, { useEffect, useRef } from 'react';
import { step } from '@/lib/game/physics';
import { render } from '@/lib/game/render';
import { sfx } from '@/lib/game/sound';

export default function GameCanvas({ stateRef, inputRef, pausedRef, onStamina, onWin, onCollect }) {
  const canvasRef = useRef(null);
  const cb = useRef({ onStamina, onWin, onCollect });
  cb.current = { onStamina, onWin, onCollect };

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const fog = document.createElement('canvas');
    let raf, last = performance.now(), lastSt = -1;
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = stateRef.current;
      const dpr = window.devicePixelRatio || 1;
      const w = c.clientWidth || 300;
      const h = c.clientHeight || 300;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      if (s) {
        if (!pausedRef.current) {
          const ev = [];
          step(s, inputRef.current, dt, ev);
          ev.forEach((e) => {
            if (e === 'pickup') {
              sfx.pickup();
              cb.current.onCollect('pickup');
            } else if (e === 'water') {
              sfx.water();
              cb.current.onCollect('water');
            } else if (e === 'fiber' || e === 'clay' || e === 'shard') {
              sfx.material();
              cb.current.onCollect(e);
            } else if (e === 'win') {
              cb.current.onWin();
            } else if (e === 'beetleBite') {
              sfx.bite();
              cb.current.onCollect('beetleBite');
            } else if (e === 'exhaustedByBeetle') {
              cb.current.onCollect('exhaustedByBeetle');
            } else {
              cb.current.onCollect(e);
            }
          });
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        render(ctx, fog, s, w, h, now / 1000, dpr);
        const st = Math.round(s.stamina);
        if (st !== lastSt) { lastSt = st; cb.current.onStamina(st); }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [stateRef, inputRef, pausedRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />;
}