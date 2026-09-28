import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Droplets, Feather, Box, Hammer, Zap, Tv, FlaskConical, ShieldCheck, Disc } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { sfx } from '@/lib/game/sound';

export default function BackpackModal({
  inv,
  onQuickCraft,
  onUse,
  onClose,
  playtime = 0,
  rewardClaimed = false,
  onClaimReward,
}) {
  const { t, lang } = useLang();
  const isZh = lang === 'zh';
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 2200);
  };

  const MAT = {
    water: { name: t.mat.water, icon: Droplets, color: 'text-sky-500' },
    fiber: { name: t.mat.fiber, icon: Feather, color: 'text-emerald-600' },
    clay: { name: t.mat.clay, icon: Box, color: 'text-amber-700' },
    shard: { name: t.mat.shard, icon: Sparkles, color: 'text-purple-600' },
    ceramic: { name: t.mat.ceramic, icon: ShieldCheck, color: 'text-amber-800' },
    wheel: { name: t.mat.wheel, icon: Disc, color: 'text-indigo-600' },
  };

  const RECIPES = [
    {
      id: 'brew',
      tag: 'ENERGY',
      name: t.items.brew,
      desc: isZh
        ? '一鍵製作得 70% 基準效果 (+70體力)；看廣告升級 100% (+100滿體力)'
        : 'Quick craft yields 70% (+70 STA); Watch ad to boost to 100% (+100 STA)',
      icon: FlaskConical,
      cost: { water: 2, fiber: 1 },
      tagColor: 'bg-orange-100 text-orange-800 border-orange-300',
    },
    {
      id: 'drill',
      tag: 'TOOL',
      name: t.items.drill,
      desc: isZh
        ? '一鍵製作得標準版 (粉碎1塊石牆)；看廣告升級強化雙刃版 (粉碎2塊石牆)'
        : 'Quick craft yields 1 rock break; Watch ad to upgrade to 2 rock breaks',
      icon: Sparkles,
      cost: { wheel: 1, shard: 1, clay: 3 },
      tagColor: 'bg-pink-100 text-pink-900 border-pink-300',
    },
    {
      id: 'ceramic',
      tag: 'TIER 1',
      name: t.mat.ceramic,
      desc: t.recipeCeramic,
      icon: ShieldCheck,
      cost: { clay: 5, water: 2 },
      tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      id: 'wheel',
      tag: 'TIER 2',
      name: t.mat.wheel,
      desc: t.recipeWheel,
      icon: Disc,
      cost: { ceramic: 2, fiber: 3 },
      tagColor: 'bg-sky-100 text-sky-900 border-sky-300',
    },
  ];

  const GOODS = [
    ...(inv.drill2 > 0
      ? [
          {
            id: 'drill2',
            name: isZh ? '強化雙刃金剛鑽' : 'Enhanced Twin Drill',
            icon: Sparkles,
            desc: isZh ? '強化神器！可連續粉碎 2 塊堅固石牆' : 'Break 2 solid stone walls!',
            badge: '破2塊岩 💎×2',
            iconColor: 'text-purple-600',
            glow: 'border-purple-400 bg-purple-50/50 shadow-md',
          },
        ]
      : []),
    ...(inv.drill > 0
      ? [
          {
            id: 'drill',
            name: t.items.drill,
            icon: Sparkles,
            desc: isZh ? '粉碎 1 塊堅固石牆' : 'Break 1 solid stone wall',
            badge: '破1塊岩 💎',
            iconColor: 'text-cyan-600',
            glow: 'border-cyan-300 shadow-sm',
          },
        ]
      : []),
    ...(inv.brew100 > 0 || inv.brew > 0
      ? [
          {
            id: 'brew100',
            name: isZh ? '100% 強化活力甘露' : '100% Energy Brew',
            icon: FlaskConical,
            desc: isZh ? '立即完全回復 100 點體力' : 'Fully restores 100 stamina',
            badge: '+100 ❤️',
            iconColor: 'text-emerald-600',
            glow: 'border-emerald-300 bg-emerald-50/40 shadow-sm',
            count: (inv.brew100 || 0) + (inv.brew || 0),
          },
        ]
      : []),
    ...(inv.brew70 > 0 || inv.quickBrew > 0
      ? [
          {
            id: 'brew70',
            name: isZh ? '70% 速製活力甘露' : '70% Quick Brew',
            icon: Zap,
            desc: isZh ? '基準效果 · 立即回復 70 點體力' : 'Baseline · Restores 70 stamina',
            badge: '+70 ❤️',
            iconColor: 'text-orange-500',
            glow: 'border-orange-300 shadow-sm',
            count: (inv.brew70 || 0) + (inv.quickBrew || 0),
          },
        ]
      : []),
    ...(inv.claws > 0
      ? [
          {
            id: 'claws',
            name: t.items.claws,
            icon: Hammer,
            desc: isZh ? '接下來 3 次挖掘完全不耗體力' : 'Next 3 digs cost 0 stamina',
            badge: '免費3次 🐾',
            iconColor: 'text-amber-600',
            glow: 'border-amber-300 shadow-sm',
            count: inv.claws,
          },
        ]
      : []),
  ];

  const canAfford = (cost) => Object.entries(cost).every(([k, n]) => (inv[k] || 0) >= n);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FFFDF9] border-2 border-amber-300 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)] text-amber-950"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-amber-200">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎒</span>
            <div>
              <h3 className="font-black text-lg text-amber-950 leading-tight">{t.bagTitle}</h3>
              <p className="text-[11px] text-amber-800 font-bold mt-0.5">
                {isZh ? '消耗道具、原料庫存與激勵合成工坊' : 'Consumables, Materials & Crafting'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-amber-200/60 hover:bg-amber-200 text-amber-900 flex items-center justify-center active:scale-90 transition border border-amber-300 cursor-pointer shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Consumable Goods Shelf */}
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-black tracking-widest text-amber-900 uppercase">
            {t.consumables}
          </h4>
          <span className="text-[11px] text-amber-800/80 font-semibold">
            {isZh ? '點擊即可在冒險中使用' : 'Click to use in maze'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
          {GOODS.length === 0 ? (
            <div className="col-span-full py-4 px-3 rounded-2xl bg-amber-50/60 border border-dashed border-amber-200 text-center text-xs text-amber-800/80 font-bold">
              {isZh ? '🎒 背包尚無可用道具，快利用下方材料合成吧！' : 'No items yet. Craft below!'}
            </div>
          ) : (
            GOODS.map((g) => {
              const count = g.count !== undefined ? g.count : (inv[g.id] || 0);
              return (
                <div
                  key={g.id}
                  className={`flex items-center justify-between p-3 rounded-2xl bg-white border-2 ${g.glow} transition hover:shadow-md`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                      <g.icon className={`w-5 h-5 ${g.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-amber-950 truncate">{g.name}</span>
                        <span className="text-[10px] font-black text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full shrink-0">
                          ×{count}
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-800/85 truncate">{g.desc}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUse(g.id)}
                    className="ml-2 py-1.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shrink-0 shadow-sm active:scale-95 transition cursor-pointer"
                  >
                    {t.use}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Materials Inventory */}
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-black tracking-widest text-amber-900 uppercase">
            {t.materials}
          </h4>
          <span className="text-[11px] text-amber-800/70 font-semibold">
            {isZh ? '跨關卡保存' : 'Saved across levels'}
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
          {Object.entries(MAT).map(([k, m]) => (
            <div
              key={k}
              className="flex flex-col items-center rounded-2xl bg-white p-2.5 border border-amber-200 shadow-sm text-center"
            >
              <m.icon className={`w-5 h-5 ${m.color}`} />
              <span className="text-sm font-black text-amber-950 mt-1 tabular-nums">
                ×{inv[k] || 0}
              </span>
              <span className="text-[10px] text-amber-800/90 font-bold leading-tight truncate max-w-full">
                {m.name}
              </span>
            </div>
          ))}
        </div>

        {/* 70% vs 100% Ad Boost Crafting Section */}
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-black tracking-widest text-amber-900 uppercase">
            {isZh ? '激勵合成工坊' : 'Crafting Workshop'}
          </h4>
          <span className="text-[10px] text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
            {isZh ? '⚡70% 基準效果 vs 📺 看廣告 100% 升級' : '⚡70% Base vs 📺 Ad 100% Boost'}
          </span>
        </div>

        {/* In-Modal Toast for Crafting Feedback */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="mb-3 py-2 px-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black text-xs text-center shadow-lg border border-white/20 flex items-center justify-center gap-1.5"
            >
              <span>⚠️</span>
              <span>{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3 mb-3">
          {RECIPES.map((r) => {
            const affordable = canAfford(r.cost);

            const handleCraftClick = (variant) => {
              if (!affordable) {
                sfx.tired();
                showToast(isZh ? '材料不足，無法製作！' : 'Insufficient materials to craft!');
                return;
              }
              onQuickCraft(r.id, variant);
            };

            return (
              <div
                key={r.id}
                className={`rounded-2xl p-3.5 border-2 shadow-sm flex flex-col gap-2.5 transition ${
                  affordable ? 'bg-white border-amber-300' : 'bg-amber-50/40 border-amber-200/70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    affordable ? 'bg-amber-100 border-amber-300' : 'bg-stone-100 border-stone-200 opacity-60'
                  }`}>
                    <r.icon className={`w-5 h-5 ${affordable ? 'text-amber-900' : 'text-stone-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${r.tagColor}`}>
                        {r.tag}
                      </span>
                      <span className="text-sm font-black text-amber-950 leading-tight truncate">
                        {r.name}
                      </span>
                      <span className={`ml-auto text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        affordable
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}>
                        {affordable ? (isZh ? '可製作' : 'Ready') : (isZh ? '材料不足' : 'Lacking')}
                      </span>
                    </div>
                    <div className="text-xs text-amber-800/85 leading-snug">{r.desc}</div>
                    
                    {/* Material Requirements with current/required quantity and color coding */}
                    <div className="text-[11px] text-amber-900 mt-1 flex flex-wrap gap-x-2 gap-y-1 font-bold">
                      {Object.entries(r.cost).map(([k, requiredCount]) => {
                        const currentCount = inv[k] || 0;
                        const hasEnough = currentCount >= requiredCount;
                        return (
                          <span
                            key={k}
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                              hasEnough
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-600 border border-rose-300 font-black'
                            }`}
                          >
                            <span>{MAT[k]?.name}</span>
                            <span className="tabular-nums">
                              {currentCount}/{requiredCount}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 70% vs 100% Craft Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-amber-100">
                  {/* Button 1: 70% Baseline Quick Craft */}
                  <button
                    type="button"
                    onClick={() => handleCraftClick('70')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-black transition shadow-sm touch-manipulation cursor-pointer ${
                      affordable
                        ? 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95'
                        : 'bg-stone-300 text-stone-500 opacity-40 hover:opacity-50'
                    }`}
                    title={
                      !affordable
                        ? (isZh ? '材料不足，無法製作！' : 'Insufficient materials to craft!')
                        : (isZh ? '一鍵製作獲得 70% 基準效果' : 'Instant craft with 70% baseline yield')
                    }
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>
                      {affordable
                        ? (isZh ? '⚡ 一鍵製作 (70% 效果)' : '⚡ Quick (70% Yield)')
                        : (isZh ? '材料不足' : 'Insufficient Materials')}
                    </span>
                  </button>

                  {/* Button 2: 100% Ad Boost Craft */}
                  <button
                    type="button"
                    onClick={() => handleCraftClick('100')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-black transition shadow-sm touch-manipulation cursor-pointer ${
                      affordable
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white active:scale-95'
                        : 'bg-stone-300 text-stone-500 opacity-40 hover:opacity-50'
                    }`}
                    title={
                      !affordable
                        ? (isZh ? '材料不足，無法製作！' : 'Insufficient materials to craft!')
                        : (isZh ? '看廣告提升至 100% 效果' : 'Watch 2s ad to boost to 100% effect')
                    }
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>
                      {affordable
                        ? (isZh ? '📺 看廣告升級 100%' : '📺 Ad Boost (100%)')
                        : (isZh ? '材料不足' : 'Insufficient Materials')}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-amber-800/80 mt-3 font-medium">
          {isZh ? '💡 70% 為數值產出折扣，原料絕不失敗吞噬！' : '70% is numeric output discount, materials are 100% safe!'}
        </p>
      </motion.div>
    </motion.div>
  );
}
