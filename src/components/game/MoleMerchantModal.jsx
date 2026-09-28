import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Carrot, Eye, Zap, Sparkles, Check, Gem } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { sfx } from '@/lib/game/sound';

export default function MoleMerchantModal({
  totalCarrots,
  onUpdateCarrots,
  inv,
  onUpdateInv,
  onApplyVisionBuff,
  onApplySpeedBuff,
  onArmDrill,
  onClose,
}) {
  const { t, lang } = useLang();
  const isZh = lang === 'zh';
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toughClay = inv.clay || 0;

  const showToast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2500);
  };

  const handleBuyVision = () => {
    if (totalCarrots < 2) {
      sfx.tired();
      showToast(t.insufficientMat);
      return;
    }
    sfx.buy();
    sfx.powerup();
    onUpdateCarrots(totalCarrots - 2);
    onApplyVisionBuff(15);
    showToast(t.tradeSuccess(t.itemVision));
  };

  const handleBuyRocket = () => {
    if (totalCarrots < 3) {
      sfx.tired();
      showToast(t.insufficientMat);
      return;
    }
    sfx.buy();
    sfx.powerup();
    onUpdateCarrots(totalCarrots - 3);
    onApplySpeedBuff(30);
    showToast(t.tradeSuccess(t.itemRocket));
  };

  const handleBuyDrill = (paymentMethod) => {
    if (paymentMethod === 'clay') {
      if (toughClay < 5) {
        sfx.tired();
        showToast(t.insufficientMat);
        return;
      }
      sfx.buy();
      sfx.craftReady();
      onUpdateInv({ ...inv, clay: toughClay - 5, drill: (inv.drill || 0) + 1 });
      onArmDrill();
      showToast(t.tradeSuccess(t.items.drill));
    } else {
      if (totalCarrots < 5) {
        sfx.tired();
        showToast(t.insufficientMat);
        return;
      }
      sfx.buy();
      sfx.craftReady();
      onUpdateCarrots(totalCarrots - 5);
      onUpdateInv({ ...inv, drill: (inv.drill || 0) + 1 });
      onArmDrill();
      showToast(t.tradeSuccess(t.items.drill));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
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
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-[#FFFDF9] border-2 border-amber-300 shadow-[0_24px_70px_rgba(0,0,0,0.25)] text-amber-950 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-200/80 bg-gradient-to-r from-amber-100/90 via-orange-50/90 to-amber-100/90">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🕶️</span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-amber-950 leading-tight">
                {t.moleMerchantTitle}
              </h3>
              <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
                {isZh ? '深淵黑市 · 神秘流浪補給站' : 'Abyss Black Market · Wandering Peddler'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Currency balance */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 border border-orange-300 text-xs font-bold text-orange-800">
              <Carrot className="w-3.5 h-3.5 text-orange-600" />
              <span>{totalCarrots}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-xs font-bold text-amber-800">
              <span>🧱</span>
              <span>{toughClay}</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-10 h-10 rounded-full bg-amber-200/80 hover:bg-amber-300 active:bg-amber-400 flex items-center justify-center text-amber-950 active:scale-90 transition border border-amber-400 cursor-pointer shadow-sm touch-manipulation"
              title={isZh ? "關閉" : "Close"}
              aria-label="Close"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-gradient-to-b from-amber-50/30 to-orange-50/30">
          {/* Mole Dialogue Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shrink-0 shadow-sm">
              🕶️
            </div>
            <p className="text-xs text-amber-900 leading-relaxed italic font-medium">
              {t.moleMerchantGreeting}
            </p>
          </div>

          {/* Toast Notification */}
          <AnimatePresence>
            {notice && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs text-center shadow"
              >
                {notice}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Deal Cards */}
          <div className="space-y-2.5">
            {/* 1. Vision Lens */}
            <div className="p-3.5 rounded-2xl bg-white border-2 border-amber-200 flex items-center justify-between gap-3 shadow-sm transition hover:border-amber-300">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-300 flex items-center justify-center text-cyan-600 shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-amber-950">{t.itemVision}</h4>
                    <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100 px-1.5 py-0.5 rounded border border-cyan-300">
                      15s
                    </span>
                  </div>
                  <p className="text-xs text-amber-800/80 mt-0.5 leading-snug">
                    {t.itemVisionDesc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBuyVision}
                disabled={totalCarrots < 2}
                className={`py-2 px-3.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shrink-0 transition active:scale-95 cursor-pointer ${
                  totalCarrots >= 2
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-105 text-white shadow'
                    : 'bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <Carrot className="w-3.5 h-3.5" />
                <span>2</span>
                <span className="ml-1">{t.tradeBtn}</span>
              </button>
            </div>

            {/* 2. Rocket Shoes */}
            <div className="p-3.5 rounded-2xl bg-white border-2 border-amber-200 flex items-center justify-between gap-3 shadow-sm transition hover:border-amber-300">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-300 flex items-center justify-center text-orange-600 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-amber-950">{t.itemRocket}</h4>
                    <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded border border-orange-300">
                      +60% · 30s
                    </span>
                  </div>
                  <p className="text-xs text-amber-800/80 mt-0.5 leading-snug">
                    {t.itemRocketDesc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBuyRocket}
                disabled={totalCarrots < 3}
                className={`py-2 px-3.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shrink-0 transition active:scale-95 cursor-pointer ${
                  totalCarrots >= 3
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow'
                    : 'bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <Carrot className="w-3.5 h-3.5" />
                <span>3</span>
                <span className="ml-1">{t.tradeBtn}</span>
              </button>
            </div>

            {/* 3. Rock Drill */}
            <div className="p-3.5 rounded-2xl bg-white border-2 border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm transition hover:border-amber-300">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-pink-50 border border-pink-300 flex items-center justify-center text-pink-600 shrink-0">
                  <Gem className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-amber-950">{t.items.drill}</h4>
                    <span className="text-[10px] font-bold text-pink-800 bg-pink-100 px-1.5 py-0.5 rounded border border-pink-300">
                      {isZh ? '破壞石牆' : 'Break Stone'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-800/80 mt-0.5 leading-snug">
                    {t.itemDrillDesc}
                  </p>
                </div>
              </div>

              {/* Two alternative payment options */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleBuyDrill('carrot')}
                  disabled={totalCarrots < 5}
                  className={`py-2 px-3 rounded-xl font-extrabold text-xs flex items-center gap-1 transition active:scale-95 cursor-pointer ${
                    totalCarrots >= 5
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow'
                      : 'bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                  title={isZh ? "用 5 根胡蘿蔔兌換" : "Trade for 5 Carrots"}
                >
                  <Carrot className="w-3.5 h-3.5" />
                  <span>5</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBuyDrill('clay')}
                  disabled={toughClay < 5}
                  className={`py-2 px-3 rounded-xl font-extrabold text-xs flex items-center gap-1 transition active:scale-95 cursor-pointer ${
                    toughClay >= 5
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow'
                      : 'bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                  title={isZh ? "用 5 塊堅韌黏土兌換" : "Trade for 5 Tough Clay"}
                >
                  <span>🧱</span>
                  <span>5</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Big Easy-to-Tap Close / Leave Button */}
        <div className="p-3 sm:p-4 border-t border-amber-200/80 bg-amber-50/70 flex items-center justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-200 to-orange-200 hover:from-amber-300 hover:to-orange-300 active:scale-95 text-amber-950 font-black text-sm transition border border-amber-300 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
          >
            <span>{isZh ? '離開補給站' : 'Leave Market'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
