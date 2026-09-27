import React, { useState } from 'react';
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
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-[#1c140d] border-2 border-amber-600/50 shadow-[0_24px_70px_rgba(0,0,0,0.85)] text-[#fff4e0] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#fff4e0]/10 bg-[#291b10]/95">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🕶️</span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#fff4e0] leading-tight">
                {t.moleMerchantTitle}
              </h3>
              <p className="text-[11px] text-amber-200/70 font-semibold mt-0.5">
                {isZh ? '深淵黑市 · 神秘流浪補給站' : 'Abyss Black Market · Wandering Peddler'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Currency balance */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-950/70 border border-orange-500/40 text-xs font-bold text-orange-200">
              <Carrot className="w-3.5 h-3.5 text-orange-400" />
              <span>{totalCarrots}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/70 border border-amber-600/40 text-xs font-bold text-amber-200">
              <span>🧱</span>
              <span>{toughClay}</span>
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {/* Mole Dialogue Banner */}
          <div className="p-3.5 rounded-2xl bg-[#2b1c11] border border-amber-600/30 flex items-center gap-3 shadow-inner">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0 shadow">
              🕶️
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed italic">
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
            <div className="p-3.5 rounded-2xl bg-[#26180e] hover:bg-[#2e1d11] border border-amber-500/30 flex items-center justify-between gap-3 shadow-sm transition">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-white">{t.itemVision}</h4>
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                      15s
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/70 mt-0.5 leading-snug">
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
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-110 text-white shadow'
                    : 'bg-black/30 border border-white/10 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Carrot className="w-3.5 h-3.5" />
                <span>2</span>
                <span className="ml-1">{t.tradeBtn}</span>
              </button>
            </div>

            {/* 2. Rocket Shoes */}
            <div className="p-3.5 rounded-2xl bg-[#26180e] hover:bg-[#2e1d11] border border-amber-500/30 flex items-center justify-between gap-3 shadow-sm transition">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-orange-950/70 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-white">{t.itemRocket}</h4>
                    <span className="text-[10px] font-bold text-orange-300 bg-orange-950 px-1.5 py-0.5 rounded border border-orange-800">
                      +60% · 30s
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/70 mt-0.5 leading-snug">
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
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-110 text-white shadow'
                    : 'bg-black/30 border border-white/10 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Carrot className="w-3.5 h-3.5" />
                <span>3</span>
                <span className="ml-1">{t.tradeBtn}</span>
              </button>
            </div>

            {/* 3. Rock Drill */}
            <div className="p-3.5 rounded-2xl bg-[#26180e] hover:bg-[#2e1d11] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm transition">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-950/70 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Gem className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-white">{t.items.drill}</h4>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">
                      {isZh ? '破壞石牆' : 'Break Stone'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/70 mt-0.5 leading-snug">
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
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-110 text-white shadow'
                      : 'bg-black/30 border border-white/10 text-stone-500 cursor-not-allowed'
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
                      ? 'bg-gradient-to-r from-amber-700 to-stone-600 hover:brightness-110 text-white shadow'
                      : 'bg-black/30 border border-white/10 text-stone-500 cursor-not-allowed'
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
      </motion.div>
    </div>
  );
}
