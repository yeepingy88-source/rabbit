import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createLevel } from '@/lib/game/maze';
import { dig } from '@/lib/game/physics';
import { sfx, isMuted, setMuted } from '@/lib/game/sound';
import { getFreeViews, consumeFreeView } from '@/lib/game/mapViews';
import { addScore } from '@/lib/game/scores';
import { useLang } from '@/lib/i18n';
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

const DEFAULT_INV = {
  water: 0,
  fiber: 0,
  clay: 0,
  shard: 0,
  ceramic: 0,
  wheel: 0,
  drill: 0,
  brew: 0,
  claws: 0,
};

const CRAFT_RECIPES = {
  brew: { cost: { water: 2, fiber: 1 }, time: 15000 },
  ceramic: { cost: { clay: 5, water: 2 }, time: 30000 },
  wheel: { cost: { ceramic: 2, fiber: 3 }, time: 45000 },
  drill: { cost: { wheel: 1, shard: 1, clay: 3 }, time: 60000 },
};

const flash = (text) => ({ text, id: Date.now() });

export default function Game() {
  const { t } = useLang();
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
  const [drillArmed, setDrillArmed] = useState(false);

  // Persistent Inventory across levels & sessions
  const [inv, setInv] = useState(() => {
    try {
      const saved = localStorage.getItem('bunny_inventory');
      return saved ? { ...DEFAULT_INV, ...JSON.parse(saved) } : DEFAULT_INV;
    } catch {
      return DEFAULT_INV;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bunny_inventory', JSON.stringify(inv));
    } catch {}
  }, [inv]);

  // Persistent Cumulative Playtime Tracking
  const [playtime, setPlaytime] = useState(() => {
    try {
      return parseInt(localStorage.getItem('bunny_playtime') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [rewardClaimed, setRewardClaimed] = useState(() => {
    try {
      return localStorage.getItem('bunny_reward_300s_claimed') === '1';
    } catch {
      return false;
    }
  });

  // Track playtime every second while in playing phase
  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setInterval(() => {
      setPlaytime((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem('bunny_playtime', String(next));
        } catch {}
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // Crafting state
  const [craft, setCraft] = useState(() => {
    try {
      const saved = localStorage.getItem('bunny_craft');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (craft) localStorage.setItem('bunny_craft', JSON.stringify(craft));
      else localStorage.removeItem('bunny_craft');
    } catch {}
  }, [craft]);

  pausedRef.current = phase !== 'playing' || !!mapMode || showAdModal || !!adType || showBag || showBoard;

  const startLevel = (n) => {
    stateRef.current = createLevel(n);
    inputRef.current = { x: 0, y: 0 };
    setLevel(n);
    setStamina(100);
    setDrillArmed(false);
    setPhase('preview');
    sfx.click();
  };

  const handleDig = useCallback(() => {
    if (pausedRef.current || !stateRef.current) return;
    const r = dig(stateRef.current);
    if (r === 'drillStone') {
      sfx.shatter();
      setDrillArmed(false);
      setHint(flash(t.drillShatter));
    } else if (r === 'dug') {
      sfx.dig();
      if (stateRef.current && !stateRef.current.drillActive) {
        setDrillArmed(false);
      }
    } else if (r === 'stone') {
      sfx.thud();
      setHint(flash(t.stone));
    } else if (r === 'tired') {
      sfx.tired();
      setHint(flash(t.tired));
    } else {
      setHint(flash(t.faceSoft));
    }
  }, [t]);

  useKeyboard(inputRef, handleDig);

  const handleCollect = useCallback(
    (type) => {
      if (type === 'water') {
        setInv((p) => ({ ...p, water: (p.water || 0) + 1 }));
        setHint(flash(t.gotWater));
      } else if (type === 'fiber') {
        setInv((p) => ({ ...p, fiber: (p.fiber || 0) + 1 }));
        setHint(flash(t.gotFiber));
      } else if (type === 'clay') {
        setInv((p) => ({ ...p, clay: (p.clay || 0) + 1 }));
        setHint(flash(t.gotClay));
      } else if (type === 'shard') {
        setInv((p) => ({ ...p, shard: (p.shard || 0) + 1 }));
        setHint(flash(t.gotShard));
        sfx.material();
      }
    },
    [t]
  );

  const handleWin = useCallback(() => {
    const s = stateRef.current;
    sfx.win();
    const carrots = s.carrots.filter((c) => c.taken).length;
    const score = Math.max(
      0,
      carrots * 100 + s.water * 50 + Math.max(0, Math.round(300 - s.time * 5)) - s.digs * 10
    );
    const maxScore = s.carrots.length * 100 + s.droplets.length * 50 + 300;
    const stars = score / maxScore >= 0.75 ? 3 : score / maxScore >= 0.5 ? 2 : 1;
    const rank = addScore({
      id: Date.now(),
      score,
      stars,
      level: s.level,
      time: Math.round(s.time),
      date: new Date().toLocaleDateString(),
    });
    setResult({ time: s.time, digs: s.digs, carrots, water: s.water, score, stars, rank });
    setPhase('won');
  }, []);

  // Crafting Timer resolution
  useEffect(() => {
    if (!craft) return;
    const id = setInterval(() => {
      if (Date.now() < craft.readyAt) return;
      const itemName = craft.item;
      setInv((p) => ({ ...p, [itemName]: (p[itemName] || 0) + 1 }));
      setBagReady(true);
      const displayName = t.items[itemName] || t.mat[itemName] || itemName;
      setHint(flash(t.craftDone(displayName)));
      sfx.craftReady();
      setCraft(null);
    }, 250);
    return () => clearInterval(id);
  }, [craft, t]);

  const handleCraft = (item) => {
    if (craft) return;
    const recipe = CRAFT_RECIPES[item];
    if (!recipe) return;
    const cost = recipe.cost;
    setInv((p) => {
      const next = { ...p };
      for (const [matKey, count] of Object.entries(cost)) {
        next[matKey] = Math.max(0, (next[matKey] || 0) - count);
      }
      return next;
    });
    setCraft({ item, readyAt: Date.now() + recipe.time });
    sfx.click();
  };

  const handleUse = (item) => {
    if ((inv[item] || 0) < 1) return;
    setInv((p) => ({ ...p, [item]: p[item] - 1 }));

    if (item === 'brew') {
      if (stateRef.current) stateRef.current.stamina = 100;
      setStamina(100);
      setHint(flash(t.brewFull));
      sfx.pickup();
    } else if (item === 'drill') {
      if (stateRef.current) stateRef.current.drillActive = true;
      setDrillArmed(true);
      setHint(flash(t.drillReady));
      sfx.pickup();
    } else if (item === 'claws') {
      if (stateRef.current) stateRef.current.freeDigs = 3;
      setHint(flash(t.clawsReady));
      sfx.pickup();
    }
  };

  const handleClaimReward = () => {
    if (rewardClaimed || playtime < 300) return;
    setInv((p) => ({ ...p, drill: (p.drill || 0) + 1 }));
    setRewardClaimed(true);
    try {
      localStorage.setItem('bunny_reward_300s_claimed', '1');
    } catch {}
    sfx.win();
    setHint(flash(t.rewardClaimedHint));
  };

  const openMap = () => {
    sfx.click();
    if (freeViews > 0) {
      setFreeViews(consumeFreeView());
      setMapMode('free');
    } else {
      setShowAdModal(true);
    }
  };

  const closeMap = useCallback(() => setMapMode(null), []);
  const finishAd = useCallback(() => {
    setMapMode(adType);
    setAdType(null);
  }, [adType]);
  const toggleMute = () => {
    setMuted(!muted);
    setMutedState(!muted);
  };

  const tier = Math.min(Math.floor((level - 1) / 5), t.tiers.length - 1);
  const usableCount = (inv.brew || 0) + (inv.claws || 0) + (inv.drill || 0);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#1a0f08] select-none font-sans">
      <GameCanvas
        stateRef={stateRef}
        inputRef={inputRef}
        pausedRef={pausedRef}
        onStamina={setStamina}
        onWin={handleWin}
        onCollect={handleCollect}
      />

      {phase === 'playing' && (
        <>
          <TopBar
            level={level}
            levelName={t.tiers[tier]}
            stamina={stamina}
            freeViews={freeViews}
            muted={muted}
            onToggleMute={toggleMute}
            onOpenMap={openMap}
            onOpenLeaderboard={() => setShowBoard(true)}
          />

          <Joystick inputRef={inputRef} />

          <DigButton onDig={handleDig} stamina={stamina} drillActive={drillArmed} />

          <BackpackButton
            badge={usableCount > 0 ? usableCount : 0}
            highlight={bagReady || (playtime >= 300 && !rewardClaimed)}
            onOpen={() => {
              setShowBag(true);
              setBagReady(false);
            }}
          />

          {/* Desktop Keyboard Controls Keyhint */}
          <div className="hidden sm:flex items-center gap-2 pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#120a05]/75 backdrop-blur-xs text-[11px] font-semibold text-[#ffd199]/90 border border-[#ffd199]/25 shadow-lg z-20">
            <span>{t.desktopHint}</span>
          </div>

          <HintBubble hint={hint} />
        </>
      )}

      {phase === 'preview' && (
        <MapPreview stateRef={stateRef} onDone={() => setPhase('playing')} />
      )}

      {showBag && (
        <BackpackModal
          inv={inv}
          craft={craft}
          onCraft={handleCraft}
          onUse={handleUse}
          onClose={() => setShowBag(false)}
          playtime={playtime}
          rewardClaimed={rewardClaimed}
          onClaimReward={handleClaimReward}
        />
      )}

      {showBoard && <LeaderboardModal onClose={() => setShowBoard(false)} />}
      {mapMode && <MapOverlay stateRef={stateRef} mode={mapMode} onClose={closeMap} />}
      {showAdModal && (
        <AdModal
          onChoose={(tp) => {
            setShowAdModal(false);
            setAdType(tp);
          }}
          onCancel={() => setShowAdModal(false)}
        />
      )}
      {adType && <AdPlayer type={adType} onDone={finishAd} />}
      {phase === 'intro' && <IntroScreen onStart={() => startLevel(1)} />}
      {phase === 'won' && (
        <VictoryScreen
          level={level}
          result={result}
          onNext={() => startLevel(level + 1)}
          onReplay={() => startLevel(level)}
        />
      )}
    </div>
  );
}
