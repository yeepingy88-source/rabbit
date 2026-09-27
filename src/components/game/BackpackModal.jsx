import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Sprout, Gem, FlaskConical, PawPrint, X, Hammer } from 'lucide-react';
import { useLang } from '@/lib/i18n';

function BrewTimer({ readyAt, label }) {
  const [left, setLeft] = useState(Math.max(0, Math.ceil((readyAt - Date.now()) / 1000)));
  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, Math.ceil((readyAt - Date.now()) / 1000))), 250);
    return () => clearInterval(id);
  }, [readyAt]);
  return <span className="text-xs font-bold text-[#f08a3c] tabular-nums shrink-0">{label(left)}</span>;
}

export default function BackpackModal({ inv, craft, onCraft, onUse, onClose }) {
  const { t } = useLang();
  const MAT = {
    water: { name: t.mat.water, icon: Droplet, color: 'text-[#4db2ff]' },
    fiber: { name: t.mat.fiber, icon: Sprout, color: 'text-[#7fb35a]' },
    clay: { name: t.mat.clay, icon: Gem, color: 'text-[#b08a5f]' },
  };
  const RECIPES = [
    { id: 'brew', name: t.items.brew, desc: t.recipeBrew, icon: FlaskConical, cost: { water: 1, fiber: 1 } },
    { id: 'claws', name: t.items.claws, desc: t.recipeClaws, icon: PawPrint, cost: { fiber: 1, clay: 1 } },
  ];
  const GOODS = [
    { id: 'brew', name: t.items.brew, icon: FlaskConical },
    { id: 'claws', name: t.items.claws, icon: PawPrint },
  ];
  const canAfford = (cost) => Object.entries(cost).every(([k, n]) => inv[k] >= n);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 bg-[#120a05]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <motion.div initial={{ y: 40 }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 24 }} className="w-full max-w-sm rounded-[28px] bg-[#fff4e0] p-5 max-h-[85%] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#4a2c18]">{t.bagTitle}</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#4a2c18] text-[#fff4e0] flex items-center justify-center active:scale-90 transition"><X className="w-5 h-5" /></button>
        </div>

        <h4 className="text-xs font-bold tracking-widest text-[#a0643a] mb-2">{t.consumables}</h4>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {GOODS.map((g) => (
            <div key={g.id} className="flex items-center gap-2 rounded-2xl bg-[#f6e7c8] p-3">
              <g.icon className="w-7 h-7 text-[#e0702a] shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#4a2c18] leading-tight">{g.name} <span className="text-[#a0643a] tabular-nums">×{inv[g.id]}</span></div>
                <button onClick={() => onUse(g.id)} disabled={inv[g.id] < 1}
                  className="mt-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#7fb35a] text-white disabled:opacity-40 active:scale-95 transition">{t.use}</button>
              </div>
            </div>
          ))}
        </div>

        <h4 className="text-xs font-bold tracking-widest text-[#a0643a] mb-2">{t.materials}</h4>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {Object.entries(MAT).map(([k, m]) => (
            <div key={k} className="flex flex-col items-center rounded-2xl bg-[#f6e7c8] p-3">
              <m.icon className={`w-6 h-6 ${m.color}`} />
              <span className="text-sm font-bold text-[#4a2c18] mt-1 tabular-nums">×{inv[k]}</span>
              <span className="text-[10px] text-[#8a6a50]">{m.name}</span>
            </div>
          ))}
        </div>

        <h4 className="text-xs font-bold tracking-widest text-[#a0643a] mb-2">{t.recipes}</h4>
        <div className="space-y-2">
          {RECIPES.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-2xl bg-[#f6e7c8] p-3">
              <div className="w-10 h-10 rounded-xl bg-[#ffd166]/60 flex items-center justify-center shrink-0"><r.icon className="w-5 h-5 text-[#5a331b]" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#4a2c18] leading-tight">{r.name}</div>
                <div className="text-[11px] text-[#8a6a50]">{r.desc}</div>
                <div className="text-[11px] text-[#a0643a] mt-0.5">
                  {Object.entries(r.cost).map(([k, n]) => `${MAT[k].name} ×${n}`).join(' + ')}
                </div>
              </div>
              {craft?.item === r.id ? (
                <BrewTimer readyAt={craft.readyAt} label={t.brewing} />
              ) : (
                <button onClick={() => onCraft(r.id)} disabled={!!craft || !canAfford(r.cost)}
                  className="flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-b from-[#f7a45c] to-[#e0702a] text-white text-xs font-bold disabled:opacity-40 active:scale-95 transition shrink-0">
                  <Hammer className="w-3.5 h-3.5" /> {t.craft}
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-[11px] text-[#8a6a50] mt-4">{t.bagTip}</p>
      </motion.div>
    </motion.div>
  );
}
