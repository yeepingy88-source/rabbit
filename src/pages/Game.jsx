import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createLevel } from '@/lib/game/maze';
import { dig } from '@/lib/game/physics';
import { sfx, isMuted, setMuted } from '@/lib/game/sound';
import { getFreeViews, consumeFreeView } from '@/lib/game/mapViews';
import { addScore } from '@/lib/game/scores';
import useKeyboard from '@/hooks/useKeyboard';
import GameCanvas from '@/components/game/GameCanvas';
import TopBar from '@/components/game/TopBar';
import Joystick from '@/components/game/Joystick';
import DigButton from '@/components/game/DigButton';
import BackpackButton from '@/components/game/BackpackButton';
import BackpackModal from '@/components/game/BackpackModal';
import LeaderboardModal from '@/components/game/LeaderboardModal';
import HintBubble from '@/components/game/HintBubble';
import MapOverlay from '@/components/game/MapOverlay';
import AdModal from '@/components/game/AdModal';
import AdPlayer from '@/components/game/AdPlayer';
import IntroScreen from '@/components/game/IntroScreen';
import MapPreview from '@/components/game/MapPreview';
import VictoryScreen from '@/components/game/VictoryScreen';

const TIER_NAMES = ['小型地洞', '幽深洞窟', '地底深淵', '遠古地脈'];
const CRAFT_TIME = 15000;
const CRAFT_COSTS = { brew: { water: 1, fiber: 1 }, claws: { fiber: 1, clay: 1 } };
const ITEM_NAMES = { brew: '活力甘露', claws: '黃金爪' };
const flash = (text) => ({ text, id: Date.now() });

export default function Game() {
  const stateRef = useRef(null);
  const inputRef = useRef({ x: 0, y: 0 });
  const pausedRef = useRef(true);
  const [phase, setPhase] = useState('intro');
  const [level, setLevel] = useState(1);
  const [stamina, setStamina] = useState(100);
  const [freeViews, setFreeViews] = useState(getFreeViews);
  const [muted, setMutedState] = useState(isMuted);
  const [mapMode, setMapMode] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adType, setAdType] = useState(null);
  const [hint, setHint] = useState(null);
  const [result, setResult] = useState(null);
  const [showBag, setShowBag] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [bagReady, setBagReady] = useState(false);
  const [inv, setInv] = useState({ water: 0, fiber: 0, clay: 0, brew: 0, claws: 0 });
  const [craft, setCraft] = useState(null);

  pausedRef.current = phase !== 'playing' || !!mapMode || showAdModal || !!adType || showBag || showBoard;

  const startLevel = (n) => {
    stateRef.current = createLevel(n);
    inputRef.current = { x: 0, y: 0 };
    setLevel(n); setStamina(100); setPhase('preview');
    sfx.click();
  };

  const handleDig = useCallback(() => {
    if (pausedRef.current) return;
    const r = dig(stateRef.current);
    if (r === 'dug') sfx.dig();
    else if (r === 'stone') { sfx.thud(); setHint(flash('石牆太硬了，挖不動！')); }
    else if (r === 'tired') { sfx.tired(); setHint(flash('體力不足，休息一下或找水滴')); }
    else setHint(flash('面向鬆軟的泥土牆再挖'));
  }, []);
  useKeyboard(inputRef, handleDig);

  const handleCollect = useCallback((type) => {
    if (type === 'water') { setInv((p) => ({ ...p, water: p.water + 1 })); setHint(flash('地下水滴！體力 +20')); }
    if (type === 'fiber') { setInv((p) => ({ ...p, fiber: p.fiber + 1 })); setHint(flash('獲得 草根纖維')); }
    if (type === 'clay') { setInv((p) => ({ ...p, clay: p.clay + 1 })); setHint(flash('獲得 堅韌黏土')); }
  }, []);

  const handleWin = useCallback(() => {
    const s = stateRef.current;
    sfx.win();
    const carrots = s.carrots.filter((c) => c.taken).length;
    const score = Math.max(0, carrots * 100 + s.water * 50 + Math.max(0, Math.round(300 - s.time * 5)) - s.digs * 10);
    const maxScore = s.carrots.length * 100 + s.droplets.length * 50 + 300;
    const stars = score / maxScore >= 0.75 ? 3 : score / maxScore >= 0.5 ? 2 : 1;
    const rank = addScore({ id: Date.now(), score, stars, level: s.level, time: Math.round(s.time), date: new Date().toLocaleDateString('zh-TW') });
    setResult({ time: s.time, digs: s.digs, carrots, water: s.water, score, stars, rank });
    setPhase('won');
  }, []);

  // Asynchronous crafting timer: keeps running while playing
  useEffect(() => {
    if (!craft) return;
    const id = setInterval(() => {
      if (Date.now() < craft.readyAt) return;
      setInv((p) => ({ ...p, [craft.item]: p[craft.item] + 1 }));
      setBagReady(true);
      setHint(flash(`合成完成：${ITEM_NAMES[craft.item]} 可以使用了！`));
      sfx.craftReady();
      setCraft(null);
    }, 250);
    return () => clearInterval(id);
  }, [craft]);

  const handleCraft = (item) => {
    if (craft) return;
    const cost = CRAFT_COSTS[item];
    setInv((p) => ({
      ...p,
      water: p.water - (cost.water || 0),
      fiber: p.fiber - (cost.fiber || 0),
      clay: p.clay - (cost.clay || 0),
    }));
    setCraft({ item, readyAt: Date.now() + CRAFT_TIME });
    sfx.click();
  };

  const handleUse = (item) => {
    if (inv[item] < 1) return;
    setInv((p) => ({ ...p, [item]: p[item] - 1 }));
    if (item === 'brew') { stateRef.current.stamina = 100; setHint(flash('活力甘露！體力全滿')); }
    if (item === 'claws') { stateRef.current.freeDigs = 3; setHint(flash('黃金爪！接下來 3 次挖掘免費')); }
    sfx.pickup();
  };

  const openMap = () => {
    sfx.click();
    if (freeViews > 0) { setFreeViews(consumeFreeView()); setMapMode('free'); }
    else setShowAdModal(true);
  };
  const closeMap = useCallback(() => setMapMode(null), []);
  const finishAd = useCallback(() => { setMapMode(adType); setAdType(null); }, [adType]);
  const toggleMute = () => { setMuted(!muted); setMutedState(!muted); };

  const tier = Math.min(Math.floor((level - 1) / 5), TIER_NAMES.length - 1);
  const usableCount = inv.brew + inv.claws;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#1a0f08] select-none">
      <GameCanvas stateRef={stateRef} inputRef={inputRef} pausedRef={pausedRef} onStamina={setStamina} onWin={handleWin} onCollect={handleCollect} />
      {phase === 'playing' && (
        <>
          <TopBar level={level} levelName={TIER_NAMES[tier]} stamina={stamina}
            freeViews={freeViews} muted={muted} onToggleMute={toggleMute} onOpenMap={openMap} onOpenLeaderboard={() => setShowBoard(true)} />
          <Joystick inputRef={inputRef} />
          <DigButton onDig={handleDig} stamina={stamina} />
          <BackpackButton
            badge={usableCount > 0 ? usableCount : 0}
            highlight={bagReady}
            onOpen={() => { setShowBag(true); setBagReady(false); }}
          />
          <HintBubble hint={hint} />
        </>
      )}
      {phase === 'preview' && <MapPreview stateRef={stateRef} onDone={() => setPhase('playing')} />}
      {showBag && <BackpackModal inv={inv} craft={craft} onCraft={handleCraft} onUse={handleUse} onClose={() => setShowBag(false)} />}
      {showBoard && <LeaderboardModal onClose={() => setShowBoard(false)} />}
      {mapMode && <MapOverlay stateRef={stateRef} mode={mapMode} onClose={closeMap} />}
      {showAdModal && <AdModal onChoose={(t) => { setShowAdModal(false); setAdType(t); }} onCancel={() => setShowAdModal(false)} />}
      {adType && <AdPlayer type={adType} onDone={finishAd} />}
      {phase === 'intro' && <IntroScreen onStart={() => startLevel(1)} />}
      {phase === 'won' && <VictoryScreen level={level} result={result} onNext={() => startLevel(level + 1)} onReplay={() => startLevel(level)} />}
    </div>
  );
}