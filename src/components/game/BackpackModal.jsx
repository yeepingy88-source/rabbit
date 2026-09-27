import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Droplet,
  Sprout,
  Gem,
  FlaskConical,
  PawPrint,
  X,
  Hammer,
  Sparkles,
  Gift,
  Disc,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';

function BrewTimer({ readyAt, label }) {
  const [left, setLeft] = useState(Math.max(0, Math.ceil((readyAt - Date.now()) / 1000)));
  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, Math.ceil((readyAt - Date.now()) / 1000))), 250);
    return () => clearInterval(id);
  }, [readyAt]);
  return <span className="text-xs font-bold text-[#f08a3c] tabular-nums shrink-0">{label(left)}</span>;
}

export default function BackpackModal({
  inv,
  craft,
  onCraft,
  onUse,
  onClose,
  playtime = 0,
  rewardClaimed = false,
  onClaimReward,
}) {
  const { t } = useLang();

  const MAT = {
    water: { name: t.mat.water, icon: Droplet, color: 'text-[#4db2ff]' },
    fiber: { name: t.mat.fiber, icon: Sprout, color: 'text-[#7fb35a]' },
    clay: { name: t.mat.clay, icon: Gem, color: 'text-[#b08a5f]' },
    shard: { name: t.mat.shard, icon: Sparkles, color: 'text-[#ff2a6d]' },
    ceramic: { name: t.mat.ceramic, icon: ShieldCheck, color: 'text-[#ea580c]' },
    wheel: { name: t.mat.wheel, icon: Disc, color: 'text-[#0284c7]' },
  };

  const RECIPES = [
    {
      id: 'brew',
      tag: 'BASIC',
      name: t.items.brew,
      desc: t.recipeBrew,
      icon: FlaskConical,
      time: 15,
      cost: { water: 2, fiber: 1 },
      tagColor: 'bg-[#ffedd5] text-[#c2410c] border-[#fdba74]',
    },
    {
      id: 'ceramic',
      tag: 'TIER 1',
      name: t.mat.ceramic,
      desc: t.recipeCeramic,
      icon: ShieldCheck,
      time: 30,
      cost: { clay: 5, water: 2 },
      tagColor: 'bg-[#fed7aa] text-[#9a3412] border-[#f97316]',
    },
    {
      id: 'wheel',
      tag: 'TIER 2',
      name: t.mat.wheel,
      desc: t.recipeWheel,
      icon: Disc,
      time: 45,
      cost: { ceramic: 2, fiber: 3 },
      tagColor: 'bg-[#bae6fd] text-[#0369a1] border-[#38bdf8]',
    },
    {
      id: 'drill',
      tag: 'TIER 3',
      name: t.items.drill,
      desc: t.recipeDrill,
      icon: Sparkles,
      time: 60,
      cost: { wheel: 1, shard: 1, clay: 3 },
      tagColor: 'bg-[#fbcfe8] text-[#9d174d] border-[#f472b6]',
    },
  ];

  const GOODS = [
    {
      id: 'drill',
      name: t.items.drill,
      icon: Sparkles,
      desc: t.recipeDrill,
      iconColor: 'text-[#06b6d4]',
      glow: 'shadow-[0_0_12px_rgba(6,182,212,0.35)] border-[#06b6d4]/40',
    },
    {
      id: 'brew',
      name: t.items.brew,
      icon: FlaskConical,
      desc: t.recipeBrew,
      iconColor: 'text-[#e0702a]',
      glow: '',
    },
    ...(inv.claws > 0
      ? [
          {
            id: 'claws',
            name: t.items.claws,
            icon: PawPrint,
            desc: t.recipeClaws,
            iconColor: 'text-[#eab308]',
            glow: '',
          },
        ]
      : []),
  ];

  const canAfford = (cost) => Object.entries(cost).every(([k, n]) => (inv[k] || 0) >= n);

  const isRewardReady = playtime >= 300 && !rewardClaimed;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-30 bg-[#120a05]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4"
    >
      <motion.div
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 24 }}
        className="w-full max-w-md rounded-[28px] bg-[#fff4e0] p-5 max-h-[88%] overflow-y-auto shadow-2xl border-2 border-[#5a331b]/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-[#4a2c18]">{t.bagTitle}</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f6e7c8] text-[#8a6a50]">
              v2.0 Hardcore
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#4a2c18] text-[#fff4e0] flex items-center justify-center active:scale-90 transition hover:bg-[#5a331b]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Milestone Playtime Reward Box */}
        {rewardClaimed ? (
          <div className="mb-4 rounded-2xl bg-[#ecfdf5] p-3 border border-[#a7f3d0] flex items-center gap-2 text-xs font-bold text-[#065f46]">
            <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
            <span className="leading-tight">{t.rewardClaimed}</span>
          </div>
        ) : isRewardReady ? (
          <div className="mb-4 rounded-2xl bg-gradient-to-r from-[#ffe4e6] via-[#fef3c7] to-[#e0f2fe] p-3.5 border-2 border-[#f43f5e] shadow-lg animate-pulse">
            <div className="flex items-center gap-2 mb-1.5">
              <Gift className="w-5 h-5 text-[#e11d48]" />
              <span className="text-xs font-black text-[#881337] tracking-wider uppercase">
                {t.rewardBoxTitle}
              </span>
              <span className="ml-auto text-[10px] font-black px-2 py-0.5 rounded-full bg-[#e11d48] text-white animate-bounce">
                CLAIMABLE
              </span>
            </div>
            <p className="text-[11px] text-[#4a2c18] mb-2.5 leading-snug">
              累計探險已滿 5 分鐘！長老贈送了珍貴的破石金剛鑽，助你開闢捷徑！
            </p>
            <button
              onClick={onClaimReward}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f97316] text-white font-extrabold text-xs shadow-md hover:brightness-105 active:scale-95 transition"
            >
              <span>{t.claimRewardBtn}</span>
            </button>
          </div>
        ) : (
          <div className="mb-4 rounded-2xl bg-[#f6e7c8] p-3 border border-[#deb887]/80">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-[#e0702a]" />
                <span className="text-xs font-bold text-[#4a2c18]">{t.rewardBoxTitle}</span>
              </div>
              <span className="text-[11px] font-bold text-[#a0643a] tabular-nums">
                {Math.floor(playtime / 60)}:{(playtime % 60).toString().padStart(2, '0')} / 5:00
              </span>
            </div>
            <div className="w-full bg-[#e5cfac] h-2 rounded-full overflow-hidden mb-1.5">
              <div
                className="bg-gradient-to-r from-[#f97316] to-[#e11d48] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (playtime / 300) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-[#8a6a50] leading-snug">
              {t.rewardProgress(playtime, Math.max(0, 300 - playtime))}
            </div>
          </div>
        )}

        {/* Consumables */}
        <h4 className="text-xs font-black tracking-widest text-[#a0643a] mb-2">{t.consumables}</h4>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {GOODS.map((g) => {
            const count = inv[g.id] || 0;
            return (
              <div
                key={g.id}
                className={`flex items-center gap-2 rounded-2xl bg-[#f6e7c8] p-3 border border-[#e5cfac] ${g.glow}`}
              >
                <g.icon className={`w-7 h-7 ${g.iconColor} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#4a2c18] truncate leading-tight">
                    {g.name} <span className="text-[#a0643a] tabular-nums">×{count}</span>
                  </div>
                  <button
                    onClick={() => onUse(g.id)}
                    disabled={count < 1}
                    className="mt-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#7fb35a] text-white disabled:opacity-40 active:scale-95 transition hover:brightness-105"
                  >
                    {t.use}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Materials */}
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-black tracking-widest text-[#a0643a]">{t.materials}</h4>
          <span className="text-[10px] text-[#8a6a50]">跨關卡保存</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {Object.entries(MAT).map(([k, m]) => (
            <div
              key={k}
              className="flex flex-col items-center rounded-2xl bg-[#f6e7c8] p-2.5 border border-[#e5cfac] text-center"
            >
              <m.icon className={`w-5 h-5 ${m.color}`} />
              <span className="text-sm font-black text-[#4a2c18] mt-1 tabular-nums">
                ×{inv[k] || 0}
              </span>
              <span className="text-[10px] text-[#8a6a50] leading-tight truncate max-w-full">
                {m.name}
              </span>
            </div>
          ))}
        </div>

        {/* 3-Tier Hardcore Crafting Tree */}
        <h4 className="text-xs font-black tracking-widest text-[#a0643a] mb-2">{t.recipes}</h4>
        <div className="space-y-2 mb-3">
          {RECIPES.map((r) => {
            const isBrewingThis = craft?.item === r.id;
            const affordable = canAfford(r.cost);
            return (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-2xl bg-[#f6e7c8] p-3 border border-[#e5cfac]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#ffd166]/60 flex items-center justify-center shrink-0 shadow-inner">
                  <r.icon className="w-5 h-5 text-[#5a331b]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${r.tagColor}`}
                    >
                      {r.tag}
                    </span>
                    <span className="text-sm font-bold text-[#4a2c18] leading-tight truncate">
                      {r.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8a6a50] leading-tight">{r.desc}</div>
                  <div className="text-[11px] text-[#a0643a] mt-1 flex flex-wrap gap-x-2 gap-y-0.5 font-medium">
                    {Object.entries(r.cost).map(([k, n]) => {
                      const hasEnough = (inv[k] || 0) >= n;
                      return (
                        <span
                          key={k}
                          className={hasEnough ? 'text-[#5a331b]' : 'text-[#dc2626] font-bold'}
                        >
                          {MAT[k]?.name} ×{n}
                        </span>
                      );
                    })}
                  </div>
                </div>
                {isBrewingThis ? (
                  <BrewTimer readyAt={craft.readyAt} label={t.brewing} />
                ) : (
                  <button
                    onClick={() => onCraft(r.id, r.time)}
                    disabled={!!craft || !affordable}
                    className="flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-b from-[#f7a45c] to-[#e0702a] text-white text-xs font-bold disabled:opacity-40 active:scale-95 transition shrink-0 shadow"
                  >
                    <Hammer className="w-3.5 h-3.5" /> {t.craft}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-center text-[11px] text-[#8a6a50] mt-3">{t.bagTip}</p>
      </motion.div>
    </motion.div>
  );
}
