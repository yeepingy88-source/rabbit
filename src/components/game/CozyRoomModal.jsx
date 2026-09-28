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
    color: '#d97706',
  },
  {
    id: 'lamp',
    key: 'lamp',
    cost: 8,
    icon: Flame,
    color: '#0891b2',
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
    color: '#db2777',
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md"
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
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-[#FFFDF9] border-2 border-amber-300 shadow-[0_24px_70px_rgba(0,0,0,0.35)] text-amber-950 overflow-hidden"
      >
        {/* Bright Warm Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-200/80 bg-gradient-to-r from-amber-100/90 via-orange-50/90 to-amber-100/90">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏡</span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-amber-950 leading-tight">
                {t.cozyRoomTitle}
              </h3>
              <p className="text-[11px] text-amber-800/80 font-medium mt-0.5">
                {t.cozyRoomSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Carrot Currency Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 border border-orange-300 shadow-sm">
              <Carrot className="w-4 h-4 text-orange-600" />
              <span className="font-black text-sm text-orange-800">{totalCarrots}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-amber-200/60 hover:bg-amber-200 flex items-center justify-center text-amber-900 active:scale-90 transition border border-amber-300 cursor-pointer shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-amber-50/30 to-orange-50/30">
          {/* Purchase Toast */}
          <AnimatePresence>
            {purchaseToast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs text-center shadow-md"
              >
                {purchaseToast}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Room Illustration Window (Animal Crossing Cheerful Room Style) */}
          <div
            onClick={triggerBunnyHappy}
            className="relative w-full h-56 sm:h-64 rounded-2xl bg-[#FAF3E0] border-2 border-amber-300/80 overflow-hidden shadow-inner cursor-pointer select-none group"
            title={isZh ? "點擊雪波撫摸互動" : "Click Snowpaw to pet!"}
          >
            {/* Gentle Warm Sunshine Rays & Honey Room Lighting */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E0] to-[#F5E6CC] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(254,240,138,0.35),transparent_70%)] pointer-events-none" />

            {/* Cheerful Fairy Lights Hanging from Ceiling */}
            <div className="absolute top-2 inset-x-6 flex justify-around pointer-events-none">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-[1px] h-3.5 bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-pulse" />
                </div>
              ))}
            </div>

            {/* Honey Wooden Flooring Line */}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-[#EDD9B6] border-t-2 border-amber-300/60 pointer-events-none flex justify-around">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="w-[1px] h-full bg-amber-400/40" />
              ))}
            </div>

            {/* 3. Carrot Wall Clock (if owned) */}
            {hasClock && (
              <div className="absolute top-7 left-8 flex flex-col items-center pointer-events-none">
                <div className="relative w-9 h-11 rounded-b-full bg-orange-500 border-2 border-orange-600 shadow-md flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center border border-orange-400 shadow-inner">
                    <div className="w-2 h-[1.5px] bg-stone-800 origin-left rotate-45" />
                  </div>
                  <div className="absolute -top-1 w-2.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                {/* Pendulum */}
                <div className="w-[1.5px] h-4 bg-orange-400 origin-top animate-pendulum flex justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-400 self-end shadow" />
                </div>
              </div>
            )}

            {/* 2. Glowing Mushroom Lamp (if owned) */}
            {hasLamp && (
              <div className="absolute bottom-11 right-7 flex flex-col items-center pointer-events-none">
                {/* Spores / Ambient Teal Glow */}
                <div className="w-16 h-16 -mb-10 rounded-full bg-cyan-400/30 blur-md animate-pulse" />
                <div className="relative flex items-center justify-center">
                  <div className="w-11 h-8 rounded-t-full bg-gradient-to-r from-teal-400 to-cyan-400 shadow-[0_0_15px_#2dd4bf] border border-cyan-200 flex items-center justify-around px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    <div className="w-1 h-1 rounded-full bg-white mb-1" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>
                <div className="w-2.5 h-6 bg-stone-300 rounded-b-md shadow" />
                <div className="w-8 h-2 rounded-full bg-stone-500 shadow" />
              </div>
            )}

            {/* 4. Fluffy Petal Rug (if owned) */}
            {hasRug && (
              <div className="absolute bottom-3 inset-x-0 mx-auto w-52 sm:w-60 h-14 rounded-[50%] bg-gradient-to-r from-pink-300/80 via-rose-200/90 to-pink-300/80 border-2 border-pink-400/50 shadow-md flex items-center justify-center pointer-events-none">
                <div className="w-40 sm:w-48 h-9 rounded-[50%] border-2 border-dashed border-pink-400/60" />
              </div>
            )}

            {/* 1. Bed & Snowpaw Bunny */}
            <div className="absolute bottom-4 inset-x-0 mx-auto flex flex-col items-center">
              {hasBed ? (
                /* Cozy Straw Bed */
                <div className="relative flex flex-col items-center">
                  {/* Bed Frame & Fluffy Straw */}
                  <div className="w-38 sm:w-46 h-16 rounded-3xl bg-amber-700 border-2 border-amber-600 shadow-md flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-1 rounded-2xl bg-amber-200 border border-amber-300 flex items-center justify-center">
                      {/* Quilt */}
                      <div className="absolute right-0 inset-y-0 w-22 bg-orange-400 rounded-r-2xl border-l-2 border-orange-300 flex items-center justify-center">
                        <Carrot className="w-5 h-5 text-white/90 rotate-45" />
                      </div>
                    </div>
                  </div>

                  {/* Sleeping Snowpaw inside Bed */}
                  <div className="absolute -top-7 left-6 flex items-center gap-1.5">
                    {/* Pillow */}
                    <div className="w-11 h-8 rounded-2xl bg-white shadow-md border border-amber-200 -mr-3 z-0" />
                    {/* Snowpaw curled up */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-13 h-11 rounded-full bg-white shadow-lg border-2 border-stone-200 flex items-center justify-center relative">
                        {/* Closed happy eyes */}
                        <div className="text-[11px] font-black text-amber-950 tracking-wider">
                          {bunnyReaction ? '≧◡≦' : '- ◡ -'}
                        </div>
                        {/* Pink Cheek */}
                        <div className="absolute bottom-2 left-2.5 w-2 h-1 rounded-full bg-pink-300" />
                        <div className="absolute bottom-2 right-2.5 w-2 h-1 rounded-full bg-pink-300" />
                        {/* Ears laying back */}
                        <div className="absolute -top-3.5 left-1 w-3.5 h-6 rounded-full bg-white border border-stone-200 -rotate-30" />
                        <div className="absolute -top-3.5 right-1 w-3.5 h-6 rounded-full bg-white border border-stone-200 rotate-30" />
                      </div>
                    </div>

                    {/* Floating zZz */}
                    {!bunnyReaction && (
                      <div className="text-orange-500 text-xs font-black animate-float-z ml-1">
                        zZz
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Simple leaf mound & Awake Snowpaw */
                <div className="relative flex flex-col items-center">
                  <div className="w-28 h-8 rounded-full bg-amber-300/80 border-2 border-amber-400 flex items-center justify-center shadow-inner">
                    <div className="w-24 h-5 rounded-full bg-amber-200" />
                  </div>

                  {/* Snowpaw nibbling carrot */}
                  <div className="absolute -top-11 flex flex-col items-center">
                    <div className="relative w-12 h-12 rounded-full bg-white shadow-lg border-2 border-stone-200 flex items-center justify-center">
                      {/* Ears */}
                      <div className="absolute -top-4 left-1.5 w-3 h-6 rounded-full bg-white border border-stone-200 -rotate-12 flex justify-center">
                        <div className="w-1.5 h-3.5 bg-pink-200 rounded-full mt-1" />
                      </div>
                      <div className="absolute -top-4 right-1.5 w-3 h-6 rounded-full bg-white border border-stone-200 rotate-12 flex justify-center">
                        <div className="w-1.5 h-3.5 bg-pink-200 rounded-full mt-1" />
                      </div>
                      {/* Eyes */}
                      <div className="flex gap-2">
                        <div className="w-1.5 h-2 rounded-full bg-amber-950" />
                        <div className="w-1.5 h-2 rounded-full bg-amber-950" />
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
            <div className="absolute bottom-2 right-3 text-[11px] text-amber-800/80 font-bold group-hover:text-amber-950 transition">
              {isZh ? '🐾 輕觸雪波撫摸互動' : '🐾 Tap Snowpaw to pet!'}
            </div>
          </div>

          {/* High-Contrast Light Furniture Workshop Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm sm:text-base text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t.furnitureShopTitle}</span>
              </h4>
              <span className="text-xs text-amber-800 font-black px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300">
                {furniture.length} / {FURNITURE_ITEMS.length} {t.placed}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FURNITURE_ITEMS.map((item) => {
                const isOwned = furniture.includes(item.id);
                const canAfford = totalCarrots >= item.cost;
                const IconComponent = item.icon;
                const info = t.furniture[item.key] || {};

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                      isOwned
                        ? 'bg-amber-50/80 border-amber-200'
                        : canAfford
                        ? 'bg-white hover:bg-amber-50/40 border-amber-200 shadow-sm hover:border-amber-400'
                        : 'bg-white/70 border-stone-200 opacity-90'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-sm"
                        style={{
                          backgroundColor: `${item.color}15`,
                          borderColor: `${item.color}40`,
                          color: item.color,
                        }}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <h5 className="font-black text-sm text-amber-950 truncate">
                            {info.name || item.id}
                          </h5>
                          <div className="flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 shrink-0">
                            <Carrot className="w-3.5 h-3.5 text-orange-600" />
                            <span>{item.cost}</span>
                          </div>
                        </div>
                        <p className="text-xs text-amber-900 font-medium line-clamp-2 mt-1 leading-snug">
                          {info.desc}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    {isOwned ? (
                      <div className="w-full py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm">
                        <Check className="w-4 h-4" />
                        <span>{t.placed}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBuy(item)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm ${
                          canAfford
                            ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md'
                            : 'bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? (
                          <>
                            <Carrot className="w-4 h-4 text-white" />
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
