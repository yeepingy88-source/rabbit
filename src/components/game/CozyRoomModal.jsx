import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Carrot, Sparkles, Check, Heart, Clock, Bed, Flame, Flower2 } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { sfx } from '@/lib/game/sound';

export const FURNITURE_ITEMS = [
  {
    id: 'bed',
    key: 'bed',
    cost: 5,
    icon: Bed,
    color: '#f59e0b',
  },
  {
    id: 'lamp',
    key: 'lamp',
    cost: 8,
    icon: Flame,
    color: '#06b6d4',
  },
  {
    id: 'clock',
    key: 'clock',
    cost: 12,
    icon: Clock,
    color: '#ea580c',
  },
  {
    id: 'rug',
    key: 'rug',
    cost: 15,
    icon: Flower2,
    color: '#ec4899',
  },
];

export default function CozyRoomModal({ totalCarrots, onUpdateCarrots, onClose }) {
  const { t, lang } = useLang();
  const isZh = lang === 'zh';

  const [furniture, setFurniture] = useState(() => {
    try {
      const saved = localStorage.getItem('bunny_room_furniture');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bunnyReaction, setBunnyReaction] = useState(false);
  const [purchaseToast, setPurchaseToast] = useState(null);

  const hasBed = furniture.includes('bed');
  const hasLamp = furniture.includes('lamp');
  const hasClock = furniture.includes('clock');
  const hasRug = furniture.includes('rug');

  const handleBuy = (item) => {
    if (furniture.includes(item.id)) return;
    if (totalCarrots < item.cost) {
      sfx.tired();
      return;
    }

    sfx.buy();
    const nextCarrots = totalCarrots - item.cost;
    onUpdateCarrots(nextCarrots);

    const nextFurniture = [...furniture, item.id];
    setFurniture(nextFurniture);
    try {
      localStorage.setItem('bunny_room_furniture', JSON.stringify(nextFurniture));
    } catch {}

    const itemName = t.furniture[item.key]?.name || item.id;
    setPurchaseToast(isZh ? `🎉 成功添置 ${itemName}！` : `🎉 Acquired ${itemName}!`);
    setTimeout(() => setPurchaseToast(null), 2500);

    triggerBunnyHappy();
  };

  const triggerBunnyHappy = () => {
    sfx.pickup();
    setBunnyReaction(true);
    setTimeout(() => setBunnyReaction(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ duration: 0.22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-[#1e120a] border-2 border-orange-500/40 shadow-[0_24px_70px_rgba(0,0,0,0.85)] text-[#fff4e0] overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#fff4e0]/10 bg-[#2b180d]/90">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏡</span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#fff4e0] leading-tight">
                {t.cozyRoomTitle}
              </h3>
              <p className="text-[11px] text-amber-200/75 font-medium mt-0.5">
                {t.cozyRoomSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Carrot Currency Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-950/70 border border-orange-500/50 shadow-inner">
              <Carrot className="w-4 h-4 text-orange-400" />
              <span className="font-black text-sm text-orange-200">{totalCarrots}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#fff4e0] active:scale-90 transition border border-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Purchase Toast */}
          <AnimatePresence>
            {purchaseToast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs text-center shadow-lg"
              >
                {purchaseToast}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Room Illustration Window */}
          <div
            onClick={triggerBunnyHappy}
            className="relative w-full h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-[#2e190e] via-[#3a2012] to-[#25130a] border-2 border-amber-800/60 overflow-hidden shadow-inner cursor-pointer select-none group"
            title={isZh ? "點擊雪波撫摸互動" : "Click Snowpaw to pet!"}
          >
            {/* Atmospheric Background & Cave Arch */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(251,191,36,0.12),transparent_70%)] pointer-events-none" />

            {/* Fairy Lights Hanging from Ceiling */}
            <div className="absolute top-2 inset-x-6 flex justify-around pointer-events-none">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-[1px] h-3 bg-amber-900/60" />
                  <div className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047] animate-pulse" />
                </div>
              ))}
            </div>

            {/* 3. Carrot Wall Clock (if owned) */}
            {hasClock && (
              <div className="absolute top-7 left-8 flex flex-col items-center pointer-events-none animate-bounce-subtle">
                <div className="relative w-9 h-11 rounded-b-full bg-orange-600 border border-amber-300/80 shadow-md flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center border border-orange-800">
                    <div className="w-2 h-[1px] bg-stone-800 origin-left rotate-45" />
                  </div>
                  <div className="absolute -top-1 w-2.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                {/* Pendulum */}
                <div className="w-[1.5px] h-4 bg-amber-400 origin-top animate-pendulum flex justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-300 self-end shadow" />
                </div>
              </div>
            )}

            {/* 2. Glowing Mushroom Lamp (if owned) */}
            {hasLamp && (
              <div className="absolute bottom-12 right-7 flex flex-col items-center pointer-events-none">
                {/* Spores / Ambient Teal Glow */}
                <div className="w-16 h-16 -mb-10 rounded-full bg-cyan-400/25 blur-md animate-pulse" />
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-7 rounded-t-full bg-gradient-to-r from-teal-400 to-cyan-400 shadow-[0_0_15px_#2dd4bf] border border-cyan-200/80 flex items-center justify-around px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                    <div className="w-1 h-1 rounded-full bg-white/70 mb-1" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                  </div>
                </div>
                <div className="w-2.5 h-6 bg-stone-200 rounded-b-md shadow" />
                <div className="w-8 h-2 rounded-full bg-stone-700 shadow" />
              </div>
            )}

            {/* 4. Fluffy Petal Rug (if owned) */}
            {hasRug && (
              <div className="absolute bottom-4 inset-x-0 mx-auto w-48 sm:w-56 h-14 rounded-[50%] bg-gradient-to-r from-pink-400/40 via-rose-300/40 to-pink-400/40 border border-pink-300/40 shadow-md flex items-center justify-center pointer-events-none">
                <div className="w-36 sm:w-44 h-9 rounded-[50%] border-2 border-dashed border-pink-200/50" />
              </div>
            )}

            {/* 1. Bed & Snowpaw Bunny */}
            <div className="absolute bottom-5 inset-x-0 mx-auto flex flex-col items-center">
              {hasBed ? (
                /* Cozy Straw Bed */
                <div className="relative flex flex-col items-center">
                  {/* Bed Frame & Fluffy Straw */}
                  <div className="w-36 sm:w-44 h-16 rounded-3xl bg-amber-800 border-2 border-amber-600/80 shadow-lg flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-1 rounded-2xl bg-amber-300/80 border border-amber-400 flex items-center justify-center">
                      {/* Quilt */}
                      <div className="absolute right-0 inset-y-0 w-20 bg-orange-400/90 rounded-r-2xl border-l border-orange-500/50 flex items-center justify-center">
                        <Carrot className="w-4 h-4 text-orange-200 rotate-45 opacity-70" />
                      </div>
                    </div>
                  </div>

                  {/* Sleeping Snowpaw inside Bed */}
                  <div className="absolute -top-6 left-6 flex items-center gap-1.5">
                    {/* Pillow */}
                    <div className="w-10 h-7 rounded-2xl bg-amber-100 shadow border border-amber-200 -mr-3 z-0" />
                    {/* Snowpaw curled up */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-12 h-10 rounded-full bg-white shadow-md border border-stone-200 flex items-center justify-center relative">
                        {/* Closed happy eyes */}
                        <div className="text-[10px] font-black text-stone-700 tracking-wider">
                          {bunnyReaction ? '≧◡≦' : '- ◡ -'}
                        </div>
                        {/* Pink Cheek */}
                        <div className="absolute bottom-2 left-2 w-2 h-1 rounded-full bg-pink-300" />
                        <div className="absolute bottom-2 right-2 w-2 h-1 rounded-full bg-pink-300" />
                        {/* Ears laying back */}
                        <div className="absolute -top-3.5 left-1 w-3 h-5 rounded-full bg-white border border-stone-200 -rotate-30" />
                        <div className="absolute -top-3.5 right-1 w-3 h-5 rounded-full bg-white border border-stone-200 rotate-30" />
                      </div>
                    </div>

                    {/* Floating zZz */}
                    {!bunnyReaction && (
                      <div className="text-amber-300 text-xs font-black animate-float-z ml-1">
                        zZz
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Simple leaf mound & Awake Snowpaw */
                <div className="relative flex flex-col items-center">
                  {/* Leaf nest */}
                  <div className="w-28 h-8 rounded-full bg-amber-900/80 border border-amber-700 flex items-center justify-center">
                    <div className="w-24 h-6 rounded-full bg-amber-700/60" />
                  </div>

                  {/* Snowpaw nibbling carrot */}
                  <div className="absolute -top-11 flex flex-col items-center">
                    <div className="relative w-12 h-12 rounded-full bg-white shadow-md border border-stone-200 flex items-center justify-center">
                      {/* Ears */}
                      <div className="absolute -top-4 left-1.5 w-3 h-6 rounded-full bg-white border border-stone-200 -rotate-12 flex justify-center">
                        <div className="w-1.5 h-3.5 bg-pink-200 rounded-full mt-1" />
                      </div>
                      <div className="absolute -top-4 right-1.5 w-3 h-6 rounded-full bg-white border border-stone-200 rotate-12 flex justify-center">
                        <div className="w-1.5 h-3.5 bg-pink-200 rounded-full mt-1" />
                      </div>
                      {/* Eyes */}
                      <div className="flex gap-2">
                        <div className="w-1.5 h-2 rounded-full bg-stone-900" />
                        <div className="w-1.5 h-2 rounded-full bg-stone-900" />
                      </div>
                      {/* Tiny carrot held */}
                      <Carrot className="absolute -bottom-1 -right-1 w-5 h-5 text-orange-500 rotate-12" />
                    </div>
                  </div>
                </div>
              )}

              {/* Heart floating on pet / interaction */}
              <AnimatePresence>
                {bunnyReaction && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0, y: 0 }}
                    animate={{ scale: 1.3, opacity: 1, y: -25 }}
                    exit={{ opacity: 0, y: -40 }}
                    className="absolute -top-14 text-rose-500 font-black text-xl flex items-center gap-1 drop-shadow"
                  >
                    <Heart className="w-5 h-5 fill-rose-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tap Hint */}
            <div className="absolute bottom-2 right-3 text-[10px] text-amber-200/50 font-semibold group-hover:text-amber-200/90 transition">
              {isZh ? '🐾 輕觸雪波互動' : '🐾 Tap to pet Snowpaw'}
            </div>
          </div>

          {/* Furniture Workshop Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-[#fff4e0] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t.furnitureShopTitle}</span>
              </h4>
              <span className="text-xs text-amber-200/80 font-bold">
                {furniture.length} / {FURNITURE_ITEMS.length} {t.placed}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {FURNITURE_ITEMS.map((item) => {
                const isOwned = furniture.includes(item.id);
                const canAfford = totalCarrots >= item.cost;
                const IconComponent = item.icon;
                const info = t.furniture[item.key] || {};

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                      isOwned
                        ? 'bg-[#2a170d]/60 border-amber-500/30'
                        : canAfford
                        ? 'bg-[#331c0e] hover:bg-[#3d2212] border-orange-500/40 shadow-sm'
                        : 'bg-[#22130a]/80 border-stone-800 opacity-85'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${item.color}20`,
                          borderColor: `${item.color}40`,
                          color: item.color,
                        }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="font-extrabold text-sm text-white truncate">
                            {info.name || item.id}
                          </h5>
                          <div className="flex items-center gap-1 text-xs font-black text-orange-400 shrink-0">
                            <Carrot className="w-3.5 h-3.5" />
                            <span>{item.cost}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-amber-200/70 line-clamp-2 mt-0.5 leading-snug">
                          {info.desc}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    {isOwned ? (
                      <div className="w-full py-1.5 px-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-extrabold text-xs flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.placed}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBuy(item)}
                        disabled={!canAfford}
                        className={`w-full py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer ${
                          canAfford
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white shadow-md'
                            : 'bg-black/30 border border-white/10 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? (
                          <>
                            <Carrot className="w-3.5 h-3.5 text-white" />
                            <span>{t.buy}</span>
                          </>
                        ) : (
                          <span>{t.needMoreCarrots(item.cost - totalCarrots)}</span>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
