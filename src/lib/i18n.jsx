import React, { createContext, useContext, useEffect, useState } from 'react';

const STRINGS = {
  zh: {
    title: '兔兔穿土記',
    subtitle: '終極蘿蔔大冒險',
    tagline: 'BUNNY UNDERGROUND · CARROT DIG',
    story: '翠綠森林的地底，長著傳說中的「奇蹟巨型蘿蔔」。小白兔雪波戴上特製挖泥手套，跳進錯綜複雜的土層迷宮 —— 幫她找到通往蘿蔔的出口，破土而出吧！',
    start: '開始挖掘',
    tipMove: '左下搖桿\n8 方向移動',
    tipDig: '右下挖掘\n打通軟土牆',
    tipMap: '右上地圖\n每日免費 2 次',
    level: (n) => `第 ${n} 關`,
    tiers: ['小型地洞', '幽深洞窟', '地底深淵', '遠古地脈'],
    stone: '石牆太硬了，挖不動！',
    tired: '體力不足！找水滴或蘿蔔補充',
    faceSoft: '面向鬆軟的泥土牆再挖',
    gotWater: '地下水滴！體力 +25',
    gotFiber: '獲得 草根纖維',
    gotClay: '獲得 堅韌黏土',
    craftDone: (name) => `合成完成：${name} 可以使用了！`,
    brewFull: '活力甘露！體力全滿',
    clawsReady: '黃金爪！接下來 3 次挖掘免費',
    items: { brew: '活力甘露', claws: '黃金爪' },
    previewTitle: '古老藏寶圖',
    previewHint: '路線已被歲月模糊⋯⋯認清方向，準備出發！',
    go: '出發！',
    startCave: '起點洞穴',
    giantCarrot: '巨型蘿蔔',
    ancientRoot: '古樹巨根',
    winTitle: '破土而出！',
    winStory: '雪波摸到了巨型蘿蔔的根部，兔兔村今年會大豐收！',
    levelDone: (n) => `第 ${n} 關完成`,
    scoreUnit: '分',
    rank: (n) => `本地面板第 ${n} 名`,
    statTime: '用時',
    statDigs: '挖掘',
    statCarrots: '蘿蔔',
    statWater: '水滴',
    replay: '重玩本關',
    next: '下一關',
    bagTitle: '雪波的背包',
    consumables: '消耗品',
    materials: '原料',
    recipes: '合成配方',
    use: '使用',
    craft: '合成',
    brewing: (s) => `釀造中… ${s}s`,
    bagTip: '合成不必乾等 —— 關掉背包繼續冒險，完成時背包會亮起通知！',
    mat: { water: '地下水滴', fiber: '草根纖維', clay: '堅韌黏土' },
    recipeBrew: '使用後立即恢復 100 體力',
    recipeClaws: '使用後接下來 3 次挖掘不需體力',
  },
  en: {
    title: 'Bunny Dig',
    subtitle: 'Ultimate Carrot Adventure',
    tagline: 'BUNNY UNDERGROUND · CARROT DIG',
    story: 'Deep under the green forest grows the legendary Miracle Carrot. Help little bunny Snowpaw dig through the maze and break through to the surface!',
    start: 'Start Digging',
    tipMove: 'Joystick\n8-way move',
    tipDig: 'Dig button\nBreak soft walls',
    tipMap: 'Map\n2 free views / day',
    level: (n) => `Level ${n}`,
    tiers: ['Small Burrow', 'Deep Cave', 'Abyss', 'Ancient Vein'],
    stone: 'Too hard! Stone wall.',
    tired: 'Out of stamina! Find water or carrots.',
    faceSoft: 'Face a soft dirt wall to dig',
    gotWater: 'Water drop! Stamina +25',
    gotFiber: 'Got root fiber',
    gotClay: 'Got tough clay',
    craftDone: (name) => `Crafted: ${name} is ready!`,
    brewFull: 'Energy brew! Full stamina',
    clawsReady: 'Golden claws! Next 3 digs free',
    items: { brew: 'Energy Brew', claws: 'Golden Claws' },
    previewTitle: 'Ancient Map',
    previewHint: 'The path is faded by time… mark your bearings!',
    go: 'GO!',
    startCave: 'Start',
    giantCarrot: 'Giant Carrot',
    ancientRoot: 'Ancient Roots',
    winTitle: 'Broke Through!',
    winStory: 'Snowpaw reached the giant carrot roots — a bumper harvest for the village!',
    levelDone: (n) => `Level ${n} clear`,
    scoreUnit: 'pts',
    rank: (n) => `Local rank #${n}`,
    statTime: 'Time',
    statDigs: 'Digs',
    statCarrots: 'Carrots',
    statWater: 'Water',
    replay: 'Replay',
    next: 'Next Level',
    bagTitle: "Snowpaw's Pack",
    consumables: 'Items',
    materials: 'Materials',
    recipes: 'Recipes',
    use: 'Use',
    craft: 'Craft',
    brewing: (s) => `Brewing… ${s}s`,
    bagTip: 'Crafting continues while you explore — the pack icon lights up when ready!',
    mat: { water: 'Water', fiber: 'Fiber', clay: 'Clay' },
    recipeBrew: 'Restore 100 stamina instantly',
    recipeClaws: 'Next 3 digs cost no stamina',
  },
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('rabbit_lang') || 'zh'; } catch { return 'zh'; }
  });

  useEffect(() => {
    try { localStorage.setItem('rabbit_lang', lang); } catch {}
  }, [lang]);

  const t = STRINGS[lang] || STRINGS.zh;
  const toggle = () => setLang((l) => (l === 'zh' ? 'en' : 'zh'));

  return (
    <LangContext.Provider value={{ lang, setLang, t, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
