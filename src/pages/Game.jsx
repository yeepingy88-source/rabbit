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
import AdPlayer from '@/components/game/AdPlayer';
import StaminaModal from '@/components/game/StaminaModal';
import IntroScreen from '@/components/game/IntroScreen';
import MapPreview from '@/components/game/MapPreview';
import VictoryScreen from '@/components/game/VictoryScreen';
import ExhaustedScreen from '@/components/game/ExhaustedScreen';
import LevelSelectModal from '@/components/game/LevelSelectModal';
import CozyRoomModal from '@/components/game/CozyRoomModal';
import MoleMerchantModal from '@/components/game/MoleMerchantModal';
import {
  getLevelEntryFee,
  getLevelClearRefund,
  initGlobalStamina,
  MAX_STAMINA,
} from '@/lib/game/stamina';

const DEFAULT_INV = {
  water: 0,
  fiber: 0,
  clay: 0,
  shard: 0,
  ceramic: 0,
  wheel: 0,
  drill: 0,
  drill2: 0,
  brew: 0,
  brew100: 0,
  brew70: 0,
  claws: 0,
};

const CRAFT_RECIPES = {
  brew: { cost: { water: 2, fiber: 1 } },
  ceramic: { cost: { clay: 5, water: 2 } },
  wheel: { cost: { ceramic: 2, fiber: 3 } },
  drill: { cost: { wheel: 1, shard: 1, clay: 3 } },
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
  const [hint, setHint] = useState(null);
  const [result, setResult] = useState(null);
  const [carrotsDoubled, setCarrotsDoubled] = useState(false);
  const [showBag, setShowBag] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showCozyRoom, setShowCozyRoom] = useState(false);
  const [showMerchant, setShowMerchant] = useState(false);
  const merchantDismissedRef = useRef(false);
  const [bagReady, setBagReady] = useState(false);
  const [drillArmed, setDrillArmed] = useState(false);
  const [exhaustedReason, setExhaustedReason] = useState('tired');

  // Ad Session state for unified showRewardedAd & showInterstitial
  const [adSession, setAdSession] = useState(null);

  // Global Stamina Economy System
  const [globalStamina, setGlobalStamina] = useState(() => initGlobalStamina().stamina);
  const [secondsToNextStamina, setSecondsToNextStamina] = useState(() => initGlobalStamina().nextSec);
  const [showStaminaModal, setShowStaminaModal] = useState(false);
  const [staminaModalTarget, setStaminaModalTarget] = useState({ level: 1, fee: 0 });

  // Interstitial Ad Management (Novice protection lvl 1~5; lvl >= 6 every 5 clears & >= 6 min cooldown with deferred pending)
  const [lastInterstitialTime, setLastInterstitialTime] = useState(() => {
    try {
      return parseInt(localStorage.getItem('rabbit_last_interstitial_time') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [levelsSinceInterstitial, setLevelsSinceInterstitial] = useState(() => {
    try {
      return parseInt(localStorage.getItem('rabbit_levels_since_ad') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [interstitialPending, setInterstitialPending] = useState(() => {
    try {
      return localStorage.getItem('rabbit_interstitial_pending') === '1';
    } catch {
      return false;
    }
  });

  // Persistent Carrot Currency
  const [totalCarrots, setTotalCarrots] = useState(() => {
    try {
      const val = localStorage.getItem('totalCarrots');
      if (val !== null) return Math.max(0, parseInt(val, 10) || 0);
      localStorage.setItem('totalCarrots', '3');
      return 3;
    } catch {
      return 3;
    }
  });

  const handleUpdateCarrots = useCallback((newCount) => {
    const clamped = Math.max(0, newCount);
    setTotalCarrots(clamped);
    try {
      localStorage.setItem('totalCarrots', String(clamped));
    } catch {}
  }, []);

  // Level Stars & Unlocked Level
  const [levelStars, setLevelStars] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rabbit_level_stars') || '{}');
    } catch {
      return {};
    }
  });

  const [unlockedLevel, setUnlockedLevel] = useState(() => {
    try {
      return parseInt(localStorage.getItem('rabbit_unlocked_level') || '1', 10);
    } catch {
      return 1;
    }
  });

  // Persistent Inventory
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

  // Global Stamina Natural Recovery (1 point / 2 mins)
  useEffect(() => {
    const timer = setInterval(() => {
      setGlobalStamina((cur) => {
        if (cur >= MAX_STAMINA) {
          setSecondsToNextStamina(120);
          return MAX_STAMINA;
        }
        setSecondsToNextStamina((sec) => {
          if (sec <= 1) {
            const nextStam = Math.min(MAX_STAMINA, cur + 1);
            try {
              localStorage.setItem('rabbit_global_stamina', String(nextStam));
              localStorage.setItem('rabbit_last_stamina_regen', String(Date.now()));
            } catch {}
            return 120;
          }
          return sec - 1;
        });
        return cur;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Track playtime while in playing phase
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

      const s = stateRef.current;
      if (s?.encounters) {
        const m = s.encounters.find((e) => e.type === 'merchant');
        if (m && Math.hypot(m.x + 0.5 - s.x, m.y + 0.5 - s.y) > 2.2) {
          merchantDismissedRef.current = false;
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // Unified Ad Interfaces
  const showRewardedAd = useCallback((rewardType, onSuccess) => {
    setAdSession({
      type: 'rewarded',
      rewardType,
      onDone: () => {
        setAdSession(null);
        if (onSuccess) onSuccess();
      },
    });
  }, []);

  const showInterstitial = useCallback((onComplete) => {
    setAdSession({
      type: 'interstitial',
      rewardType: 'interstitial',
      onDone: () => {
        setAdSession(null);
        if (onComplete) onComplete();
      },
    });
  }, []);

  pausedRef.current =
    phase !== 'playing' ||
    !!mapMode ||
    !!adSession ||
    showStaminaModal ||
    showBag ||
    showBoard ||
    showLevelSelect ||
    showCozyRoom ||
    showMerchant;

  const startLevel = (n, staminaValue = 100, isReplay = false) => {
    const clampedLevel = Math.max(1, Math.min(50, n));
    stateRef.current = createLevel(clampedLevel, { isReplay });
    stateRef.current.stamina = staminaValue;
    stateRef.current.digCost = 18;
    inputRef.current = { x: 0, y: 0 };
    setLevel(clampedLevel);
    setStamina(staminaValue);
    setDrillArmed(false);
    setResult(null);
    setCarrotsDoubled(false);
    setMapMode(false);
    setShowBag(false);
    setShowBoard(false);
    setShowLevelSelect(false);
    setShowCozyRoom(false);
    setShowMerchant(false);
    setShowStaminaModal(false);
    merchantDismissedRef.current = false;
    setAdSession(null);
    setPhase('preview');
    sfx.click();
    if (isReplay) {
      setHint(flash(t.isZh ? '重玩關卡：本關不再生成水滴與蘿蔔' : 'Replaying: No water or carrots spawn'));
    }
  };

  // Attempt to enter level with Entry Fee deduction
  const attemptStartLevel = (targetLvl, isReplay = false) => {
    const fee = getLevelEntryFee(targetLvl);
    if (globalStamina < fee) {
      setStaminaModalTarget({ level: targetLvl, fee });
      setShowStaminaModal(true);
      return false;
    }

    // Deduct entry fee from global stamina
    setGlobalStamina((prev) => {
      const next = Math.max(0, prev - fee);
      try {
        localStorage.setItem('rabbit_global_stamina', String(next));
      } catch {}
      return next;
    });

    startLevel(targetLvl, 100, isReplay);
    return true;
  };

  const handleSelectLevel = (lvl) => {
    const isReplay = (levelStars[lvl] || 0) > 0;
    setShowLevelSelect(false);
    attemptStartLevel(lvl, isReplay);
  };

  const handleReplayLevel = () => {
    attemptStartLevel(level, true);
  };

  const handleGoHome = () => {
    sfx.click();
    setPhase('intro');
    setResult(null);
    setMapMode(false);
    setShowBag(false);
    setShowBoard(false);
    setShowLevelSelect(false);
    setShowCozyRoom(false);
    setShowMerchant(false);
    setShowStaminaModal(false);
    setAdSession(null);
  };

  const handleRestartGame = () => {
    handleGoHome();
  };

  const handleDig = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    const res = dig(s);
    if (res === 'dug') {
      sfx.dig();
      setStamina(Math.round(s.stamina));
      setHint(null);
    } else if (res === 'drillStone') {
      sfx.drillShatter();
      setHint(flash(t.drillShatter));
      if (!s.drillActive) {
        setDrillArmed(false);
      }
    } else if (res === 'bedrock') {
      sfx.stone();
      setHint(flash(t.bedrock));
    } else if (res === 'borderWall') {
      sfx.stone();
      setHint(flash(t.borderWall));
    } else if (res === 'stone') {
      sfx.stone();
      setHint(flash(t.stone));
    } else if (res === 'tired') {
      sfx.tired();
      setHint(flash(t.tired));
    } else if (res === 'none') {
      sfx.miss();
      setHint(flash(t.faceSoft));
    }
  }, [t]);

  useKeyboard(
    inputRef,
    handleDig,
    useCallback(() => {
      setShowBag((v) => !v);
      setBagReady(false);
    }, []),
    useCallback(() => setMapMode((m) => (m ? null : 'free')), [])
  );

  const handleCollect = useCallback(
    (type) => {
      if (type === 'beetleBite') {
        setHint(flash(t.beetleBiteHint));
      } else if (type === 'exhaustedByBeetle') {
        setExhaustedReason('beetle');
        setPhase('exhausted');
      } else if (type === 'hotSpring') {
        sfx.hotSpring();
        setHint(flash(t.hotSpringHealed));
      } else if (type === 'nearMerchant') {
        if (!merchantDismissedRef.current && !showMerchant) {
          setShowMerchant(true);
        }
      } else if (type && typeof type === 'object' && type.type === 'luckyBox') {
        sfx.chestOpen();
        setInv((p) => ({
          ...p,
          water: (p.water || 0) + 2,
          clay: (p.clay || 0) + 2,
          shard: type.gotShard ? (p.shard || 0) + 1 : (p.shard || 0),
        }));
        setHint(flash(type.gotShard ? t.luckyBoxShard : t.luckyBoxOpened));
      } else if (type === 'fiber' || type === 'clay' || type === 'shard') {
        setInv((p) => ({ ...p, [type]: (p[type] || 0) + 1 }));
        setHint(
          flash(
            type === 'fiber' ? t.gotFiber : type === 'clay' ? t.gotClay : t.gotShard
          )
        );
      } else if (type === 'water') {
        setHint(flash(t.gotWater));
      } else if (type === 'pickup') {
        handleUpdateCarrots(totalCarrots + 1);
        setHint(flash(t.gotCarrot));
      }
    },
    [t, totalCarrots, showMerchant, handleUpdateCarrots]
  );

  const handleApplyVisionBuff = useCallback((sec = 15) => {
    if (stateRef.current) {
      stateRef.current.visionTimer = sec;
    }
    setHint(flash(t.visionLensActive));
  }, [t]);

  const handleApplySpeedBuff = useCallback((sec = 30) => {
    if (stateRef.current) {
      stateRef.current.speedTimer = sec;
    }
    setHint(flash(t.rocketShoesActive));
  }, [t]);

  const handleArmDrill = useCallback((uses = 1) => {
    if (stateRef.current) {
      stateRef.current.drillActive = true;
      stateRef.current.drillUses = uses;
    }
    setDrillArmed(true);
    setHint(flash(uses > 1 ? '💎 強化雙刃金剛鑽就緒！可連續破壞 2 塊石牆' : t.drillReady));
  }, [t]);

  const handleWin = useCallback(() => {
    const s = stateRef.current;
    sfx.win();
    const carrots = s.carrots.filter((c) => c.taken).length;
    const materials = (s.materials || []).filter((m) => m.taken).length;
    const score = Math.max(
      0,
      carrots * 100 + s.water * 50 + materials * 40 + Math.max(0, Math.round(300 - s.time * 5)) - s.digs * 10
    );

    // Dynamic Star Rating based on BFS shortest path
    const bfsShortest = s.bfsPathLen > 0 ? s.bfsPathLen : (s.W || 15);
    const target3 = Math.max(5, Math.round(bfsShortest * 1.3));
    const target2 = Math.max(10, Math.round(bfsShortest * 2.5));
    let stars = 1;
    if (s.time <= target3) {
      stars = 3;
    } else if (s.time <= target2) {
      stars = 2;
    } else {
      stars = 1;
    }

    setLevelStars((prev) => {
      const currentBest = prev[s.level] || 0;
      if (stars > currentBest) {
        const updated = { ...prev, [s.level]: stars };
        try {
          localStorage.setItem('rabbit_level_stars', JSON.stringify(updated));
        } catch {}
        return updated;
      }
      return prev;
    });

    if (s.level >= unlockedLevel && s.level < 50) {
      const nextLvl = s.level + 1;
      setUnlockedLevel(nextLvl);
      try {
        localStorage.setItem('rabbit_unlocked_level', String(nextLvl));
      } catch {}
    }

    // Refund Stamina on level clear
    const refund = getLevelClearRefund(s.level);
    if (refund > 0) {
      setGlobalStamina((prev) => {
        const next = Math.min(MAX_STAMINA, prev + refund);
        try {
          localStorage.setItem('rabbit_global_stamina', String(next));
        } catch {}
        return next;
      });
    }

    // Track completed levels for Interstitial Ads
    const newAdLevelsCount = levelsSinceInterstitial + 1;
    setLevelsSinceInterstitial(newAdLevelsCount);
    try {
      localStorage.setItem('rabbit_levels_since_ad', String(newAdLevelsCount));
    } catch {}

    if (s.level >= 6 && newAdLevelsCount >= 5) {
      setInterstitialPending(true);
      try {
        localStorage.setItem('rabbit_interstitial_pending', '1');
      } catch {}
    }

    const rank = addScore({
      id: Date.now(),
      score,
      stars,
      level: s.level,
      time: Math.round(s.time),
      date: new Date().toLocaleDateString(),
    });

    setResult({
      time: s.time,
      digs: s.digs,
      carrots,
      water: s.water,
      materials,
      score,
      stars,
      rank,
      target2,
      target3,
    });
    setCarrotsDoubled(false);
    setPhase('won');
  }, [unlockedLevel, levelsSinceInterstitial]);

  // Next level action on victory screen with Interstitial Ad & Deferred Cooldown
  const handleNextLevel = () => {
    const nextLvl = level + 1;
    const now = Date.now();
    const elapsedSec = (now - lastInterstitialTime) / 1000;

    // Trigger Interstitial: Level >= 6, completed 5 levels (or pending deferred), interval >= 360s
    const shouldPlayAd =
      level >= 6 &&
      (levelsSinceInterstitial >= 5 || interstitialPending) &&
      elapsedSec >= 360;

    const proceed = () => {
      attemptStartLevel(nextLvl, false);
    };

    if (shouldPlayAd) {
      showInterstitial(() => {
        const triggerTime = Date.now();
        setLastInterstitialTime(triggerTime);
        setLevelsSinceInterstitial(0);
        setInterstitialPending(false);
        try {
          localStorage.setItem('rabbit_last_interstitial_time', String(triggerTime));
          localStorage.setItem('rabbit_levels_since_ad', '0');
          localStorage.setItem('rabbit_interstitial_pending', '0');
        } catch {}
        proceed();
      });
    } else {
      proceed();
    }
  };

  // Rewarded Ad: Double carrots on victory
  const handleDoubleCarrots = () => {
    if (!result || !result.carrots || carrotsDoubled) return;
    showRewardedAd('carrots', () => {
      setCarrotsDoubled(true);
      handleUpdateCarrots(totalCarrots + result.carrots);
      setHint(flash(t.isZh ? `🥕 恭喜！胡蘿蔔已翻倍獲得 +${result.carrots}` : `🥕 Carrots Doubled! +${result.carrots}`));
      sfx.win();
    });
  };

  // Rewarded Ad: Claim +50 Stamina
  const handleWatchAdForStamina = () => {
    showRewardedAd('stamina', () => {
      setGlobalStamina((prev) => {
        const next = Math.min(MAX_STAMINA, prev + 50);
        try {
          localStorage.setItem('rabbit_global_stamina', String(next));
        } catch {}
        return next;
      });
      setShowStaminaModal(false);
      setHint(flash(t.isZh ? '⚡ 成功領取 50 點體力！' : '⚡ Claimed 50 Stamina!'));
      sfx.powerup();
    });
  };

  // 70% Base Craft vs 100% Rewarded Ad Craft
  const handleQuickCraft = (recipeId, variant = '70') => {
    const recipe = CRAFT_RECIPES[recipeId];
    if (!recipe) return;
    const canAfford = Object.entries(recipe.cost).every(([k, n]) => (inv[k] || 0) >= n);
    if (!canAfford) return;

    const executeCraft = (isBoosted = false) => {
      setInv((p) => {
        const next = { ...p };
        // Safely deduct materials
        for (const [matKey, count] of Object.entries(recipe.cost)) {
          next[matKey] = Math.max(0, (next[matKey] || 0) - count);
        }

        if (recipeId === 'brew') {
          if (isBoosted) {
            next.brew100 = (next.brew100 || 0) + 1;
          } else {
            next.brew70 = (next.brew70 || 0) + 1;
          }
        } else if (recipeId === 'drill') {
          if (isBoosted) {
            next.drill2 = (next.drill2 || 0) + 1;
          } else {
            next.drill = (next.drill || 0) + 1;
          }
        } else if (recipeId === 'ceramic') {
          next.ceramic = (next.ceramic || 0) + (isBoosted ? 2 : 1);
        } else if (recipeId === 'wheel') {
          next.wheel = (next.wheel || 0) + (isBoosted ? 2 : 1);
        }
        return next;
      });

      sfx.craftReady();
      const msg = isBoosted
        ? (t.isZh ? '📺 100% 強化版製作完成！' : '100% Boosted item crafted!')
        : (t.isZh ? '⚡ 70% 基準效果製作完成！' : '70% Quick item crafted!');
      setHint(flash(msg));
    };

    if (variant === '100') {
      showRewardedAd('craft', () => {
        executeCraft(true);
      });
    } else {
      executeCraft(false);
    }
  };

  // Consumable items use handler
  const handleUse = (item) => {
    if ((inv[item] || 0) < 1) return;

    if (item === 'brew100' || item === 'brew') {
      const currentStamina = stateRef.current ? stateRef.current.stamina : stamina;
      if (currentStamina >= 100) {
        setHint(flash(t.brewAlreadyFull));
        return;
      }
      setInv((p) => ({ ...p, [item]: p[item] - 1 }));
      if (stateRef.current) stateRef.current.stamina = 100;
      setStamina(100);
      setHint(flash(t.brewFull));
      sfx.pickup();
      return;
    }

    if (item === 'brew70' || item === 'quickBrew') {
      const currentStamina = stateRef.current ? stateRef.current.stamina : stamina;
      if (currentStamina >= 100) {
        setHint(flash(t.brewAlreadyFull));
        return;
      }
      setInv((p) => ({ ...p, [item]: p[item] - 1 }));
      const nextStamina = Math.min(100, currentStamina + 70);
      if (stateRef.current) stateRef.current.stamina = nextStamina;
      setStamina(nextStamina);
      setHint(flash(t.isZh ? '速製活力甘露！體力回復 70 點' : 'Quick Brew! Stamina +70'));
      sfx.pickup();
      return;
    }

    if (item === 'drill') {
      if (stateRef.current?.drillActive || drillArmed) {
        setHint(flash(t.drillAlreadyActive));
        return;
      }
      setInv((p) => ({ ...p, drill: p.drill - 1 }));
      handleArmDrill(1);
      sfx.pickup();
      setShowBag(false);
      return;
    }

    if (item === 'drill2') {
      if (stateRef.current?.drillActive || drillArmed) {
        setHint(flash(t.drillAlreadyActive));
        return;
      }
      setInv((p) => ({ ...p, drill2: p.drill2 - 1 }));
      handleArmDrill(2);
      sfx.pickup();
      setShowBag(false);
      return;
    }

    if (item === 'claws') {
      setInv((p) => ({ ...p, claws: p.claws - 1 }));
      if (stateRef.current) stateRef.current.freeDigs = 3;
      setHint(flash(t.clawsReady));
      sfx.pickup();
    }
  };

  const handleClaimReward = () => {
    if (rewardClaimed || playtime < 300) return;
    setInv((p) => ({ ...p, brew100: (p.brew100 || 0) + 1 }));
    setRewardClaimed(true);
    try {
      localStorage.setItem('bunny_reward_300s_claimed', '1');
    } catch {}
    sfx.win();
    setHint(flash(t.rewardClaimedHint));
  };

  const openMap = () => {
    sfx.click();
    setMapMode('free');
  };

  const closeMap = useCallback(() => setMapMode(null), []);
  const toggleMute = () => {
    setMuted(!muted);
    setMutedState(!muted);
  };

  const handleStaminaChange = useCallback((st) => {
    setStamina(st);
    if (st <= 0 && phase === 'playing') {
      setPhase('exhausted');
    }
  }, [phase]);

  const tier = Math.min(Math.floor((level - 1) / 5), t.tiers.length - 1);
  const levelDisplayName = level >= 40 ? t.beetleTierName : (level === 50 ? t.finalLevelName : t.tiers[tier]);
  const usableCount =
    (inv.brew100 || 0) +
    (inv.brew70 || 0) +
    (inv.brew || 0) +
    (inv.quickBrew || 0) +
    (inv.claws || 0) +
    (inv.drill || 0) +
    (inv.drill2 || 0);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#1a0f08] select-none font-sans">
      <GameCanvas
        stateRef={stateRef}
        inputRef={inputRef}
        pausedRef={pausedRef}
        onStamina={handleStaminaChange}
        onWin={handleWin}
        onCollect={handleCollect}
      />

      {phase === 'playing' && (
        <>
          <TopBar
            level={level}
            levelName={levelDisplayName}
            stamina={stamina}
            muted={muted}
            onToggleMute={toggleMute}
            onOpenMap={openMap}
            onRestartLevel={handleReplayLevel}
            onGoHome={handleGoHome}
            onOpenLevelSelect={() => setShowLevelSelect(true)}
            onOpenBackpack={() => {
              setShowBag(true);
              setBagReady(false);
            }}
            bagBadge={usableCount > 0 ? usableCount : 0}
            bagHighlight={bagReady || (playtime >= 300 && !rewardClaimed)}
          />

          {/* Quick Trade Prompt when near Mole Peddler */}
          {stateRef.current?.encounters?.some(
            (e) => e.type === 'merchant' && Math.hypot(e.x + 0.5 - stateRef.current.x, e.y + 0.5 - stateRef.current.y) < 1.8
          ) && (
            <button
              type="button"
              onClick={() => {
                merchantDismissedRef.current = false;
                setShowMerchant(true);
              }}
              className="absolute top-20 left-4 z-30 flex items-center gap-2 py-2 px-3.5 rounded-2xl bg-gradient-to-r from-amber-700 to-orange-700 border-2 border-amber-400 text-white font-black text-xs shadow-lg active:scale-95 transition cursor-pointer"
            >
              <span className="text-base">🕶️</span>
              <span>{t.moleMerchantTitle}</span>
            </button>
          )}

          <Joystick inputRef={inputRef} />

          <DigButton
            onDig={handleDig}
            stamina={stamina}
            drillActive={drillArmed}
            cost={18}
          />

          <BackpackButton
            badge={usableCount > 0 ? usableCount : 0}
            highlight={bagReady || (playtime >= 300 && !rewardClaimed)}
            onOpen={() => {
              setShowBag(true);
              setBagReady(false);
            }}
          />

          {/* Desktop Keyboard Controls Keyhint */}
          <div className="hidden sm:flex items-center gap-2 pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#120a05]/75 backdrop-blur-sm text-[11px] font-semibold text-[#ffd199]/90 border border-[#ffd199]/25 shadow-lg z-20">
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
          onQuickCraft={handleQuickCraft}
          onUse={handleUse}
          onClose={() => setShowBag(false)}
          playtime={playtime}
          rewardClaimed={rewardClaimed}
          onClaimReward={handleClaimReward}
        />
      )}

      {showBoard && <LeaderboardModal onClose={() => setShowBoard(false)} />}
      {mapMode && <MapOverlay stateRef={stateRef} mode={mapMode} onClose={closeMap} />}

      {/* 2-Second Mock Ad Player (Rewarded Video & Interstitial) */}
      {adSession && (
        <AdPlayer
          type={adSession.type}
          onDone={adSession.onDone}
        />
      )}

      {/* Core Monetization Funnel: Insufficient Stamina Modal */}
      {showStaminaModal && (
        <StaminaModal
          currentStamina={globalStamina}
          entryFee={staminaModalTarget.fee}
          level={staminaModalTarget.level}
          secondsToNext={secondsToNextStamina}
          onWatchAd={handleWatchAdForStamina}
          onPlayFreeLevel={(lvl) => {
            setShowStaminaModal(false);
            attemptStartLevel(lvl, false);
          }}
          onClose={() => setShowStaminaModal(false)}
        />
      )}

      {phase === 'intro' && (
        <IntroScreen
          globalStamina={globalStamina}
          secondsToNextStamina={secondsToNextStamina}
          onStart={() => attemptStartLevel(unlockedLevel || 1, (levelStars[unlockedLevel || 1] || 0) > 0)}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
          onOpenStaminaModal={() => {
            setStaminaModalTarget({ level: unlockedLevel, fee: getLevelEntryFee(unlockedLevel) });
            setShowStaminaModal(true);
          }}
        />
      )}

      {phase === 'exhausted' && (
        <ExhaustedScreen
          reason={exhaustedReason}
          level={level}
          inv={inv}
          onRevive={() => handleUse('brew100')}
          onReplay={handleReplayLevel}
          onRestartGame={handleRestartGame}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
        />
      )}

      {phase === 'won' && (
        <VictoryScreen
          level={level}
          result={result}
          clearRefund={getLevelClearRefund(level)}
          carrotsDoubled={carrotsDoubled}
          onDoubleCarrots={handleDoubleCarrots}
          onNext={handleNextLevel}
          onReplay={handleReplayLevel}
          onRestartGame={handleRestartGame}
          onGoHome={handleGoHome}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
        />
      )}

      {showLevelSelect && (
        <LevelSelectModal
          currentLevel={level}
          levelStars={levelStars}
          globalStamina={globalStamina}
          onSelectLevel={handleSelectLevel}
          onClose={() => setShowLevelSelect(false)}
        />
      )}

      {showCozyRoom && (
        <CozyRoomModal
          totalCarrots={totalCarrots}
          onUpdateCarrots={handleUpdateCarrots}
          onClose={() => setShowCozyRoom(false)}
        />
      )}

      {showMerchant && (
        <MoleMerchantModal
          totalCarrots={totalCarrots}
          onUpdateCarrots={handleUpdateCarrots}
          inv={inv}
          onUpdateInv={setInv}
          onApplyVisionBuff={handleApplyVisionBuff}
          onApplySpeedBuff={handleApplySpeedBuff}
          onArmDrill={() => handleArmDrill(1)}
          onClose={() => {
            setShowMerchant(false);
            merchantDismissedRef.current = true;
          }}
        />
      )}
    </div>
  );
}
