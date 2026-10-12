import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { Language } from './i18n';

export type Screen = 'MAIN_MENU' | 'SHOP' | 'MY_GARAGE' | 'RACE_SELECTION' | 'CAR_SELECTION' | 'SETTINGS' | 'GAME' | 'CRATES' | 'MODE_SELECTION';

export interface Car {
  id: string;
  name: string;
  type: 'pickup' | 'suv' | 'sport' | 'muscle' | 'hyper';
  color: string;
  maxSpeed: number; // 0-100
  acceleration: number; // 0-100
  handling: number; // 0-100
  price: number;
  owned: boolean;
  isElectric?: boolean;
  
  // Upgrade system
  upgradeLevel: number;
  maxUpgradeLevel: number;
  upgradeAttribute: 'maxSpeed' | 'handling' | 'acceleration' | 'special';
  upgradeIncrement: number;
}

export interface Track {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  color: string;
  isNight?: boolean;
  isDirt?: boolean;
}

interface GameState {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;

  language: Language;
  setLanguage: (lang: Language) => void;
  
  mobileButtonScale: number;
  setMobileButtonScale: (scale: number) => void;
  
  gp: number;
  xp: number;
  level: number;
  upgradeTokens: number;
  addGp: (amount: number) => void;
  addXp: (amount: number) => void;
  addUpgradeTokens: (amount: number) => void;
  buyUpgradeTokens: (amount: number, cost: number) => boolean;
  useUpgradeToken: (id: string) => boolean;
  
  cars: Car[];
  selectedCarId: string;
  selectCar: (id: string) => void;
  buyCar: (id: string) => void;
  upgradeCar: (id: string) => void;
  
  tracks: Track[];
  selectedTrackId: string;
  selectTrack: (id: string) => void;
  
  raceConfig: {
    laps: number;
    aiCount: number;
    difficulty: 'Kolay' | 'Orta' | 'Zor' | 'Çok Zor';
    isRandomMode: boolean;
    isGhostMode: boolean;
    isTrafficMode?: boolean;
    isDriftMode?: boolean;
  };
  setLaps: (laps: number) => void;
  setAiCount: (count: number) => void;
  setDifficulty: (difficulty: 'Kolay' | 'Orta' | 'Zor' | 'Çok Zor') => void;
  setRandomMode: (isRandom: boolean) => void;
  setGhostMode: (isGhost: boolean) => void;
  setTrafficMode?: (isTraffic: boolean) => void;
  setDriftMode?: (isDrift: boolean) => void;

  starterProgress: StarterQuestProgress;
  claimStarterQuest: (questId: string) => boolean;
  /** countsForQuest: only races against rivals (not drift, not ghost) count for the top-3 quest. */
  recordRaceFinish: (rank: number, countsForQuest: boolean) => void;
  recordDriftScrap: (amount: number) => void;
}

export const MAX_SCRAP = 24999999;

export interface StarterQuestProgress {
  carsBought: number;
  top3Races: number;
  tokensUsed: number;
  driftScrapEarned: number;
  claimed: Record<string, boolean>;
}

export interface StarterQuestDef {
  id: string;
  titleTr: string;
  titleEn: string;
  target: number;
  rewardType: 'scrap' | 'token';
  rewardAmount: number;
  rewardLabelTr: string;
  rewardLabelEn: string;
}

export const STARTER_QUESTS: StarterQuestDef[] = [
  {
    id: 'buy_car',
    titleTr: 'Mağazadan 1 araç satın al',
    titleEn: 'Buy 1 car from the shop',
    target: 1,
    rewardType: 'scrap',
    rewardAmount: 50000,
    rewardLabelTr: '50.000 Scrap',
    rewardLabelEn: '50,000 Scrap',
  },
  {
    id: 'top3_race',
    titleTr: '1 Normal yarışı ilk üçte bitir',
    titleEn: 'Finish 1 normal race in top 3',
    target: 1,
    rewardType: 'scrap',
    rewardAmount: 100000,
    rewardLabelTr: '100.000 Scrap',
    rewardLabelEn: '100,000 Scrap',
  },
  {
    id: 'max_car',
    titleTr: '1 Adet aracı maksimum seviyeye çıkart',
    titleEn: 'Max out 1 vehicle upgrade level',
    target: 1,
    rewardType: 'token',
    rewardAmount: 2,
    rewardLabelTr: '2 Token',
    rewardLabelEn: '2 Tokens',
  },
  {
    id: 'use_5_tokens',
    titleTr: '5 Adet yükseltme tokeni kullan',
    titleEn: 'Use 5 upgrade tokens',
    target: 5,
    rewardType: 'scrap',
    rewardAmount: 350000,
    rewardLabelTr: '350.000 Scrap',
    rewardLabelEn: '350,000 Scrap',
  },
  {
    id: 'drift_250k',
    titleTr: 'Drift modunda 250.000 Scrap kazan',
    titleEn: 'Earn 250,000 Scrap in drift mode',
    target: 250000,
    rewardType: 'token',
    rewardAmount: 5,
    rewardLabelTr: '5 Token',
    rewardLabelEn: '5 Tokens',
  },
];

export const INITIAL_CARS: Car[] = [
  { 
    id: 'car-prega', 
    name: 'Prega', 
    type: 'pickup',
    color: '#5D4037', 
    maxSpeed: 30, 
    acceleration: 20, 
    handling: 41, 
    price: 500000, 
    owned: true,
    upgradeLevel: 0,
    maxUpgradeLevel: 5,
    upgradeAttribute: 'handling',
    upgradeIncrement: 2
  },
  { 
    id: 'car-gfenis', 
    name: 'Gfenis GRX', 
    type: 'suv',
    color: '#000000', 
    maxSpeed: 33, 
    acceleration: 25, 
    handling: 35, 
    price: 650000, 
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 2,
    upgradeAttribute: 'maxSpeed',
    upgradeIncrement: 2
  },
  { 
    id: 'car-uiner', 
    name: 'Uiner G2', 
    type: 'sport',
    color: '#f8fafc', // Alpine White / Frozen White (BMW M3 style)
    maxSpeed: 36, 
    acceleration: 23, 
    handling: 32, 
    price: 1000000, 
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 5,
    upgradeAttribute: 'handling',
    upgradeIncrement: 2
  },
  { 
    id: 'car-uiner-i6', 
    name: 'Uiner I6', 
    type: 'sport',
    color: '#2563eb', // Protonic Blue Metallic with Frozen Grey & Electric Cyan accents
    maxSpeed: 32, 
    acceleration: 32, 
    handling: 60, 
    price: 1370990, 
    owned: false,
    isElectric: true,
    upgradeLevel: 0,
    maxUpgradeLevel: 1,
    upgradeAttribute: 'maxSpeed',
    upgradeIncrement: 9
  },
  { 
    id: 'car-siestre', 
    name: 'Siestre S', 
    type: 'hyper',
    color: '#7fa192', // Metallic Sage Green
    maxSpeed: 26, 
    acceleration: 82, 
    handling: 19, 
    price: 1660000, 
    owned: false,
    isElectric: true,
    upgradeLevel: 0,
    maxUpgradeLevel: 1,
    upgradeAttribute: 'maxSpeed',
    upgradeIncrement: 5
  },
  { 
    id: 'car-frestta-tines', 
    name: 'Frestta Tines', 
    type: 'sport',
    color: '#dc2626', // Rosso Corsa Red (Ferrari LaFerrari style)
    maxSpeed: 37, 
    acceleration: 32, 
    handling: 43, 
    price: 1360000, 
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 2,
    upgradeAttribute: 'acceleration',
    upgradeIncrement: 1
  },
  { 
    id: 'car-caneli-zx1', 
    name: 'Caneli ZX1', 
    type: 'sport',
    color: '#e35205', 
    maxSpeed: 35, 
    acceleration: 28, 
    handling: 39, 
    price: 1335000, 
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 3,
    upgradeAttribute: 'handling',
    upgradeIncrement: 1
  },
  { 
    id: 'car-condute-cleo', 
    name: 'Condute Cleo', 
    type: 'suv',
    color: '#d6d0c4', // Champagne Pearl / Indus Silver (Range Rover style)
    maxSpeed: 33, 
    acceleration: 18, 
    handling: 72, 
    price: 540000, 
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 5,
    upgradeAttribute: 'acceleration',
    upgradeIncrement: 2
  },
  { 
    id: 'car-regali-rx1', 
    name: 'Regali RX1', 
    type: 'sport',
    color: '#ffffff', // White
    maxSpeed: 52, 
    acceleration: 17, 
    handling: 28, 
    price: 1400500, 
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 5,
    upgradeAttribute: 'handling',
    upgradeIncrement: 1
  },
  { 
    id: 'car-arbier-rr7', 
    name: 'Arbier RR7', 
    type: 'sport', 
    color: '#2042b5', // Ascari / Nogaro Blue Metallic (Audi RS7 Sportback)
    maxSpeed: 32, 
    acceleration: 35, 
    handling: 48, 
    price: 880000, 
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 2,
    upgradeAttribute: 'handling',
    upgradeIncrement: 0 // Handled manually
  },
  { 
    id: 'car-pnisther-cugan', 
    name: 'Pnisther Cugan', 
    type: 'suv', 
    color: '#581c87', // Royal Amethyst Purple (Porsche Cayenne SUV style)
    maxSpeed: 34, 
    acceleration: 31, 
    handling: 69, 
    price: 1450000, 
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 1,
    upgradeAttribute: 'maxSpeed', // Handled manually
    upgradeIncrement: 0 
  },
  { 
    id: 'car-avesta-revo', 
    name: 'Avesta Revo', 
    type: 'sport', 
    color: '#84cc16', // Verde Mantis / Lime Green (Lamborghini Revuelto style)
    maxSpeed: 38, 
    acceleration: 30, 
    handling: 45, 
    price: 1360000, 
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 1,
    upgradeAttribute: 'maxSpeed',
    upgradeIncrement: 6 
  },
  { 
    id: 'car-regali-chasew', 
    name: 'Regali Chasew', 
    type: 'muscle',
    color: '#D35400', // Burnt Orange
    maxSpeed: 36, 
    acceleration: 8, 
    handling: 29, 
    price: 1300000, 
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 3,
    upgradeAttribute: 'maxSpeed',
    upgradeIncrement: 2 
  },
  { 
    id: 'car-marceli-mt', 
    name: 'Marceli MT', 
    type: 'hyper',
    color: '#FF6600', // Orange
    maxSpeed: 39, 
    acceleration: 11, 
    handling: 34, 
    price: 1610000, 
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 1,
    upgradeAttribute: 'special',
    upgradeIncrement: 0
  },
  { 
    id: 'car-br47', 
    name: 'BR-47', 
    type: 'sport',
    color: '#f5b700', // Racing Yellow (Formula 1 Yellow Images Race Team)
    maxSpeed: 34, 
    acceleration: 79, 
    handling: 86, 
    price: 1686900, 
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 2,
    upgradeAttribute: 'handling',
    upgradeIncrement: 1
  },
  { 
    id: 'car-pnisther-200gt', 
    name: 'Pnisther 200GT', 
    type: 'sport',
    color: '#f8fafc', // Carrara White / Chalk Grey (Porsche 911 992 style)
    maxSpeed: 33, 
    acceleration: 35, 
    handling: 63, 
    price: 1345700, 
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 2,
    upgradeAttribute: 'acceleration',
    upgradeIncrement: 1 
  },
  {
    id: 'car-hydra-vyree',
    name: 'Hydra Vyree',
    type: 'hyper',
    color: '#ff4d22',
    maxSpeed: 34,
    acceleration: 40,
    handling: 76,
    price: 1540000,
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 1,
    upgradeAttribute: 'handling',
    upgradeIncrement: 14
  },
  {
    id: 'car-fabid-gt',
    name: 'Fabid GT',
    type: 'hyper',
    color: '#e60000', // Aggressive Red
    maxSpeed: 40,
    acceleration: 15,
    handling: 47,
    price: 1590000,
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 1,
    upgradeAttribute: 'maxSpeed',
    upgradeIncrement: 8
  },
  {
    id: 'car-tetra-rt500',
    name: 'Tetra RT500',
    type: 'sport',
    color: '#f3f4f6', // Clean White
    maxSpeed: 41,
    acceleration: 22,
    handling: 38,
    price: 1449000,
    owned: false,
    isElectric: true,
    upgradeLevel: 0,
    maxUpgradeLevel: 2,
    upgradeAttribute: 'maxSpeed',
    upgradeIncrement: 2
  },
  {
    id: 'car-pagnus-rr',
    name: 'Pagnus RR',
    type: 'hyper',
    color: '#cbd5e1', // Grigio Monza Silver & Exposed Carbon with Red Stripe #20 (Pagani Huayra BC Roadster)
    maxSpeed: 42,
    acceleration: 19,
    handling: 48,
    price: 1720100,
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 7,
    upgradeAttribute: 'maxSpeed',
    upgradeIncrement: 2
  },
  {
    id: 'car-gfenis-gt',
    name: 'Gfenis GT',
    type: 'sport',
    color: '#c0c0c0', // Silver
    maxSpeed: 33,
    acceleration: 19,
    handling: 32,
    price: 1318100,
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 6,
    upgradeAttribute: 'maxSpeed',
    upgradeIncrement: 1
  },
  {
    id: 'car-marceli-spyder',
    name: 'Marceli Spyder',
    type: 'hyper',
    color: '#ea580c', // Papaya Spark Metallic Orange (McLaren 720S Spider style)
    maxSpeed: 44,
    acceleration: 10,
    handling: 33,
    price: 1560000,
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 4,
    upgradeAttribute: 'handling',
    upgradeIncrement: 1
  },
  {
    id: 'car-frestta-v50-89',
    name: "Frestta V50 '89",
    type: 'sport',
    color: '#cc0000', // Slightly darker Red
    maxSpeed: 37,
    acceleration: 22,
    handling: 32,
    price: 1480000,
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 1,
    upgradeAttribute: 'special',
    upgradeIncrement: 0
  },
  {
    id: 'car-hydra-stedring-58',
    name: "Hydra Stedring '58",
    type: 'sport',
    color: '#004225', // British Racing Green
    maxSpeed: 33,
    acceleration: 6,
    handling: 31,
    price: 500000,
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 2,
    upgradeAttribute: 'special',
    upgradeIncrement: 0
  },
  {
    id: 'car-pnisther-entrela',
    name: 'Pnisther Entrela',
    type: 'sport',
    color: '#D4C29F', // Metallic Champagne/Beige
    maxSpeed: 38,
    acceleration: 29,
    handling: 41,
    price: 1549000,
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 3,
    upgradeAttribute: 'maxSpeed',
    upgradeIncrement: 1
  },
  {
    id: 'car-frestta-f10',
    name: 'Frestta F10',
    type: 'sport',
    color: '#d90429', // Scuderia Rosso Corsa
    maxSpeed: 40,
    acceleration: 39,
    handling: 42,
    price: 2450000,
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 2,
    upgradeAttribute: 'acceleration',
    upgradeIncrement: 1
  },
  {
    id: 'car-avesta-ultra',
    name: 'Avesta Ultra',
    type: 'sport',
    color: '#009eb8', // Metallic Cerulean / Blu Uranus
    maxSpeed: 55,
    acceleration: 2,
    handling: 25,
    price: 1900000,
    owned: false,
    isElectric: true,
    upgradeLevel: 0,
    maxUpgradeLevel: 2,
    upgradeAttribute: 'special',
    upgradeIncrement: 0
  },
  {
    id: 'car-elegus-z1',
    name: 'Elegus Z1',
    type: 'hyper',
    color: '#6ba4d9', // Gulf Blue
    maxSpeed: 53,
    acceleration: 10,
    handling: 40,
    price: 2200000,
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 4,
    upgradeAttribute: 'special',
    upgradeIncrement: 0
  },
  {
    id: 'car-elegus-ruara',
    name: 'Elegus Ruara',
    type: 'hyper',
    color: '#94a3b8', // Liquid Metallic Titanium / Huayra Hypercar
    maxSpeed: 58,
    acceleration: 44,
    handling: 10,
    price: 2900000,
    owned: false,
    upgradeLevel: 0,
    maxUpgradeLevel: 2,
    upgradeAttribute: 'handling',
    upgradeIncrement: 2
  },
];

const INITIAL_TRACKS: Track[] = [
  { id: 'track-1', name: 'Oval Circuit', difficulty: 'Easy', color: '#10b981' },
  { id: 'track-drag', name: 'Drag Strip', difficulty: 'Medium', color: '#f59e0b' },
  { id: 'track-night', name: 'Midnight Grand Prix', difficulty: 'Medium', color: '#06b6d4', isNight: true },
  { id: 'track-redoun', name: 'Redoun', difficulty: 'Medium', color: '#d97706', isDirt: true },
];

// Level calculation helper
const calculateLevel = (xp: number): number => {
  if (xp < 2000) return 1;
  let level = 2;
  let threshold = 2000;
  
  while (level < 90) {
    const nextThreshold = threshold * 2.5;
    if (xp < nextThreshold) return level;
    threshold = nextThreshold;
    level++;
  }
  return 90;
};

export const getNextLevelXp = (level: number): number => {
  if (level >= 90) return Infinity;
  if (level === 1) return 2000;
  return Math.floor(2000 * Math.pow(2.5, level - 1));
};

export const applyCarStatUpgrade = (c: Car): Car => {
  if (c.id === 'car-elegus-ruara') {
    return {
      ...c,
      upgradeLevel: c.upgradeLevel + 1,
      handling: c.handling + 2
    };
  }
  if (c.id === 'car-elegus-z1') {
    const isSpeedUpgrade = c.upgradeLevel < 2;
    return {
      ...c,
      upgradeLevel: c.upgradeLevel + 1,
      maxSpeed: isSpeedUpgrade ? c.maxSpeed + 2 : c.maxSpeed,
      handling: !isSpeedUpgrade ? c.handling + 1 : c.handling
    };
  }
  if (c.id === 'car-avesta-ultra') {
    const isFirstLevel = c.upgradeLevel === 0;
    return {
      ...c,
      upgradeLevel: c.upgradeLevel + 1,
      handling: isFirstLevel ? c.handling + 2 : c.handling,
      acceleration: !isFirstLevel ? c.acceleration + 4 : c.acceleration
    };
  }
  if (c.id === 'car-hydra-stedring-58') {
    return {
      ...c,
      upgradeLevel: c.upgradeLevel + 1,
      maxSpeed: c.maxSpeed + 1,
      handling: c.handling + 1
    };
  }
  if (c.id === 'car-frestta-v50-89') {
    return {
      ...c,
      upgradeLevel: c.upgradeLevel + 1,
      maxSpeed: c.maxSpeed + 5,
      acceleration: c.acceleration + 2
    };
  }
  if (c.id === 'car-marceli-mt') {
    return {
      ...c,
      upgradeLevel: c.upgradeLevel + 1,
      maxSpeed: c.maxSpeed + 4,
      acceleration: c.acceleration + 2
    };
  }
  if (c.id === 'car-uiner-i6') {
    return {
      ...c,
      upgradeLevel: c.upgradeLevel + 1,
      maxSpeed: c.maxSpeed + 9
    };
  }
  if (c.id === 'car-siestre') {
    return {
      ...c,
      upgradeLevel: c.upgradeLevel + 1,
      maxSpeed: c.maxSpeed + 13,
      acceleration: c.acceleration + 4
    };
  }
  if (c.id === 'car-br47') {
    return {
      ...c,
      upgradeLevel: c.upgradeLevel + 1,
      handling: c.handling + 1
    };
  }
  if (c.id === 'car-condute-cleo') {
    return {
      ...c,
      upgradeLevel: c.upgradeLevel + 1,
      acceleration: c.acceleration + 2
    };
  }
  if (c.id === 'car-regali-rx1') {
    const isFirstLevel = c.upgradeLevel === 0;
    return {
      ...c,
      upgradeLevel: c.upgradeLevel + 1,
      handling: isFirstLevel ? c.handling + 7 : c.handling,
      maxSpeed: !isFirstLevel ? c.maxSpeed + 1 : c.maxSpeed
    };
  }
  if (c.id === 'car-arbier-rr7') {
    const isFirstLevel = c.upgradeLevel === 0;
    return {
      ...c,
      upgradeLevel: c.upgradeLevel + 1,
      handling: isFirstLevel ? c.handling + 1 : c.handling + 2
    };
  }
  if (c.id === 'car-pnisther-cugan') {
    return {
      ...c,
      upgradeLevel: c.upgradeLevel + 1,
      maxSpeed: c.maxSpeed + 2,
      handling: c.handling + 8
    };
  }
  if (c.id === 'car-fabid-gt') {
    return {
      ...c,
      upgradeLevel: c.upgradeLevel + 1,
      maxSpeed: c.maxSpeed + 8
    };
  }
  if (c.upgradeAttribute === 'special') {
    // Every 'special' car is handled above; never write a NaN stat for a new one.
    return { ...c, upgradeLevel: c.upgradeLevel + 1 };
  }
  return {
    ...c,
    upgradeLevel: c.upgradeLevel + 1,
    [c.upgradeAttribute]: c[c.upgradeAttribute] + c.upgradeIncrement
  };
};

/** A copy of the car with every upgrade applied (random-car mode, transformation zones, hard AI). */
export const maxOutCar = (car: Car): Car => {
  let c = { ...car };
  while (c.upgradeLevel < c.maxUpgradeLevel) c = applyCarStatUpgrade(c);
  return c;
};

/** Scrap cost of the car's next upgrade. The garage shows this and upgradeCar charges it. */
export const getUpgradeCost = (car: Car): number => {
  switch (car.id) {
    case 'car-elegus-ruara': return 200000 + car.upgradeLevel * 50000;
    case 'car-elegus-z1': return 100000 + car.upgradeLevel * 25000;
    case 'car-frestta-f10': return 195000;
    case 'car-fabid-gt': return 180000;
    case 'car-frestta-v50-89': return 155000;
    case 'car-hydra-vyree': return 150000;
    case 'car-avesta-ultra':
    case 'car-avesta-revo':
    case 'car-siestre': return 140000;
    case 'car-uiner-i6': return 110000;
    case 'car-marceli-mt':
    case 'car-pnisther-cugan': return 90000;
    case 'car-pnisther-entrela': return 85000;
    case 'car-hydra-stedring-58': return 60000;
    default: return 40000 + car.upgradeLevel * 15000;
  }
};

/** Tokens an instant upgrade needs: one-off and 'special' upgrades cost 3. */
export const getTokensRequired = (car: Car): number =>
  car.maxUpgradeLevel === 1 || car.upgradeAttribute === 'special' ? 3 : 1;

/** Current progress value of a starter quest (compare with quest.target). */
export const getStarterQuestProgress = (
  state: Pick<GameState, 'cars' | 'starterProgress'>,
  questId: string
): number => {
  const p = state.starterProgress;
  switch (questId) {
    case 'buy_car':
      return Math.max(p.carsBought || 0, state.cars.filter(c => c.owned && c.id !== 'car-prega').length);
    case 'top3_race': return p.top3Races || 0;
    case 'max_car': return state.cars.some(c => c.owned && c.upgradeLevel >= c.maxUpgradeLevel) ? 1 : 0;
    case 'use_5_tokens': return p.tokensUsed || 0;
    case 'drift_250k': return p.driftScrapEarned || 0;
    default: return 0;
  }
};

export const countClaimableStarterQuests = (state: Pick<GameState, 'cars' | 'starterProgress'>): number =>
  STARTER_QUESTS.filter(q => !state.starterProgress.claimed?.[q.id] && getStarterQuestProgress(state, q.id) >= q.target).length;

const getInitialStarterProgress = (): StarterQuestProgress => {
  return {
    carsBought: 0,
    top3Races: 0,
    tokensUsed: 0,
    driftScrapEarned: 0,
    claimed: {},
  };
};

// ---------------------------------------------------------------------------
// Save game (localStorage). Only progress is stored; car stats are rebuilt from
// INITIAL_CARS + upgrade level, so rebalancing a car in an update applies to saves.
// ---------------------------------------------------------------------------

const SAVE_KEY = 'toyrace-save';

interface SavedCar { id: string; owned: boolean; upgradeLevel: number }

type SavedState = Pick<GameState, 'gp' | 'xp' | 'upgradeTokens' | 'selectedCarId' | 'selectedTrackId' | 'raceConfig' | 'starterProgress'> & {
  cars: SavedCar[];
};

const hydrateCars = (saved: unknown): Car[] =>
  INITIAL_CARS.map(base => {
    const entry = Array.isArray(saved)
      ? (saved as Partial<SavedCar>[]).find(s => s && s.id === base.id)
      : undefined;
    let car: Car = { ...base, owned: base.owned || !!entry?.owned };
    const level = Math.max(0, Math.min(base.maxUpgradeLevel, Math.floor(Number(entry?.upgradeLevel) || 0)));
    for (let i = 0; i < level; i++) car = applyCarStatUpgrade(car);
    return car;
  });

const toNumber = (value: unknown, min: number, max: number, fallback: number): number => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, Math.floor(n))) : fallback;
};

const DIFFICULTIES = ['Kolay', 'Orta', 'Zor', 'Çok Zor'] as const;

// Writes are debounced (purchases and settings can fire in bursts) and flushed when the app is hidden,
// which on Android is the last moment that reliably runs before the process may be killed.
const pendingWrites = new Map<string, string>();
let writeTimer: ReturnType<typeof setTimeout> | null = null;
const flushWrites = () => {
  if (writeTimer) { clearTimeout(writeTimer); writeTimer = null; }
  pendingWrites.forEach((value, key) => {
    try { localStorage.setItem(key, value); } catch (e) { console.warn('Save failed:', e); }
  });
  pendingWrites.clear();
};
const saveStorage: StateStorage = {
  getItem: (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  setItem: (key, value) => {
    pendingWrites.set(key, value);
    if (!writeTimer) writeTimer = setTimeout(flushWrites, 400);
  },
  removeItem: (key) => {
    pendingWrites.delete(key);
    try { localStorage.removeItem(key); } catch {}
  },
};
if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => { if (document.hidden) flushWrites(); });
  window.addEventListener('pagehide', flushWrites);
}

export const useGameStore = create<GameState>()(persist((set, get) => ({
  currentScreen: 'MAIN_MENU',
  setScreen: (screen) => set({ currentScreen: screen }),

  // Only English language is selected and locked
  language: 'en',
  setLanguage: (_lang) => {
    // Language is locked to English
    set({ language: 'en' });
  },

  mobileButtonScale: typeof window !== 'undefined' && localStorage.getItem('mobile_button_scale')
    ? Math.max(0.7, Math.min(1.4, parseFloat(localStorage.getItem('mobile_button_scale')!) || 1.0))
    : 1.0,
  setMobileButtonScale: (scale: number) => {
    const clamped = Math.max(0.7, Math.min(1.4, Math.round(scale * 100) / 100));
    if (typeof window !== 'undefined') {
      localStorage.setItem('mobile_button_scale', clamped.toString());
    }
    set({ mobileButtonScale: clamped });
  },
  
  gp: 0, // Starting GP (0), capped at MAX_SCRAP (24,999,999)
  xp: 0,
  level: 1,
  upgradeTokens: 0,
  
  starterProgress: getInitialStarterProgress(),

  claimStarterQuest: (questId) => {
    const state = get();
    const quest = STARTER_QUESTS.find(q => q.id === questId);
    if (!quest) return false;
    if (state.starterProgress.claimed?.[questId]) return false;
    if (getStarterQuestProgress(state, questId) < quest.target) return false;

    const starterProgress = {
      ...state.starterProgress,
      claimed: { ...(state.starterProgress.claimed || {}), [questId]: true }
    };

    if (quest.rewardType === 'scrap') {
      set({
        gp: Math.max(0, Math.min(MAX_SCRAP, state.gp + quest.rewardAmount)),
        starterProgress
      });
    } else {
      set({
        upgradeTokens: state.upgradeTokens + quest.rewardAmount,
        starterProgress
      });
    }
    return true;
  },

  recordRaceFinish: (rank, countsForQuest) => {
    if (countsForQuest && rank >= 1 && rank <= 3) {
      set((state) => ({
        starterProgress: { ...state.starterProgress, top3Races: (state.starterProgress.top3Races || 0) + 1 }
      }));
    }
  },

  recordDriftScrap: (amount) => {
    if (amount <= 0) return;
    set((state) => ({
      starterProgress: { ...state.starterProgress, driftScrapEarned: (state.starterProgress.driftScrapEarned || 0) + amount }
    }));
  },

  addGp: (amount) => set((state) => ({ gp: Math.max(0, Math.min(MAX_SCRAP, state.gp + amount)) })),
  addXp: (amount) => set((state) => {
    const newXp = state.xp + amount;
    return { 
      xp: newXp,
      level: calculateLevel(newXp)
    };
  }),
  addUpgradeTokens: (amount) => set((state) => ({ upgradeTokens: state.upgradeTokens + amount })),
  buyUpgradeTokens: (amount, cost) => {
    const state = get();
    if (state.gp < cost) return false;
    set({
      gp: Math.max(0, state.gp - cost),
      upgradeTokens: state.upgradeTokens + amount
    });
    return true;
  },
  useUpgradeToken: (id) => {
    const state = get();
    const car = state.cars.find(c => c.id === id);
    if (!car || !car.owned || car.upgradeLevel >= car.maxUpgradeLevel) return false;

    const tokensRequired = getTokensRequired(car);
    if (state.upgradeTokens < tokensRequired) return false;

    set({
      upgradeTokens: state.upgradeTokens - tokensRequired,
      cars: state.cars.map(c => c.id === id ? applyCarStatUpgrade(c) : c),
      starterProgress: { ...state.starterProgress, tokensUsed: (state.starterProgress.tokensUsed || 0) + tokensRequired }
    });
    return true;
  },
  
  cars: INITIAL_CARS.map(car => ({ ...car })),
  selectedCarId: 'car-prega',
  selectCar: (id) => set({ selectedCarId: id }),
  buyCar: (id) => set((state) => {
    const car = state.cars.find(c => c.id === id);
    if (!car || car.owned) return state;
    if (state.gp < car.price) return state; // Not enough money

    return {
      gp: Math.max(0, state.gp - car.price),
      cars: state.cars.map(c => c.id === id ? { ...c, owned: true } : c),
      selectedCarId: id, // Auto select bought car
      starterProgress: { ...state.starterProgress, carsBought: (state.starterProgress.carsBought || 0) + 1 }
    };
  }),
  upgradeCar: (id) => set((state) => {
    const car = state.cars.find(c => c.id === id);
    if (!car || !car.owned) return state;
    if (car.upgradeLevel >= car.maxUpgradeLevel) return state;

    const cost = getUpgradeCost(car);
    if (state.gp < cost) return state;

    return {
      gp: Math.max(0, state.gp - cost),
      cars: state.cars.map(c => c.id === id ? applyCarStatUpgrade(c) : c)
    };
  }),
  
  tracks: INITIAL_TRACKS,
  selectedTrackId: 'track-1',
  selectTrack: (id) => set((state) => ({
    selectedTrackId: id,
    raceConfig: { 
      ...state.raceConfig, 
      aiCount: Math.min(state.raceConfig.aiCount, 5) 
    }
  })),
  
  raceConfig: { laps: 1, aiCount: 5, difficulty: 'Orta', isRandomMode: false, isGhostMode: false, isTrafficMode: false, isDriftMode: false },
  setLaps: (laps) => set((state) => ({ raceConfig: { ...state.raceConfig, laps } })),
  setAiCount: (count) => set((state) => ({ raceConfig: { ...state.raceConfig, aiCount: count } })),
  setDifficulty: (difficulty) => set((state) => ({ raceConfig: { ...state.raceConfig, difficulty } })),
  setRandomMode: (isRandomMode) => set((state) => ({ raceConfig: { ...state.raceConfig, isRandomMode } })),
  setGhostMode: (isGhostMode) => set((state) => ({ raceConfig: { ...state.raceConfig, isGhostMode } })),
  setTrafficMode: (isTrafficMode) => set((state) => ({ raceConfig: { ...state.raceConfig, isTrafficMode } })),
  setDriftMode: (isDriftMode) => set((state) => ({ raceConfig: { ...state.raceConfig, isDriftMode } })),
}), {
  name: SAVE_KEY,
  version: 1,
  storage: createJSONStorage(() => saveStorage),
  partialize: (state): SavedState => ({
    gp: state.gp,
    xp: state.xp,
    upgradeTokens: state.upgradeTokens,
    cars: state.cars.map(c => ({ id: c.id, owned: c.owned, upgradeLevel: c.upgradeLevel })),
    selectedCarId: state.selectedCarId,
    selectedTrackId: state.selectedTrackId,
    raceConfig: state.raceConfig,
    starterProgress: state.starterProgress,
  }),
  // Saves come from the device, so every field is checked before it replaces the defaults.
  merge: (persisted, current) => {
    if (!persisted || typeof persisted !== 'object') return current;
    const saved = persisted as Partial<SavedState>;
    const cars = hydrateCars(saved.cars);
    const xp = toNumber(saved.xp, 0, Number.MAX_SAFE_INTEGER, 0);
    const savedConfig = (saved.raceConfig && typeof saved.raceConfig === 'object' ? saved.raceConfig : {}) as Partial<GameState['raceConfig']>;
    const savedProgress = (saved.starterProgress && typeof saved.starterProgress === 'object' ? saved.starterProgress : {}) as Partial<StarterQuestProgress>;
    const selectedCar = cars.find(c => c.id === saved.selectedCarId && c.owned);
    return {
      ...current,
      gp: toNumber(saved.gp, 0, MAX_SCRAP, current.gp),
      xp,
      level: calculateLevel(xp),
      upgradeTokens: toNumber(saved.upgradeTokens, 0, 1_000_000, current.upgradeTokens),
      cars,
      selectedCarId: selectedCar ? selectedCar.id : current.selectedCarId,
      selectedTrackId: current.tracks.some(t => t.id === saved.selectedTrackId) ? saved.selectedTrackId! : current.selectedTrackId,
      raceConfig: {
        ...current.raceConfig,
        laps: [1, 2, 3, 5, 10].includes(savedConfig.laps as number) ? savedConfig.laps! : current.raceConfig.laps,
        aiCount: toNumber(savedConfig.aiCount, 1, 5, current.raceConfig.aiCount),
        difficulty: DIFFICULTIES.includes(savedConfig.difficulty as typeof DIFFICULTIES[number]) ? savedConfig.difficulty! : current.raceConfig.difficulty,
        isRandomMode: !!savedConfig.isRandomMode,
        isGhostMode: !!savedConfig.isGhostMode,
        isTrafficMode: false,
        isDriftMode: !!savedConfig.isDriftMode,
      },
      starterProgress: {
        carsBought: toNumber(savedProgress.carsBought, 0, 1000, 0),
        top3Races: toNumber(savedProgress.top3Races, 0, 1_000_000, 0),
        tokensUsed: toNumber(savedProgress.tokensUsed, 0, 1_000_000, 0),
        driftScrapEarned: toNumber(savedProgress.driftScrapEarned, 0, Number.MAX_SAFE_INTEGER, 0),
        claimed: savedProgress.claimed && typeof savedProgress.claimed === 'object' ? { ...savedProgress.claimed } : {},
      },
    };
  },
}));
