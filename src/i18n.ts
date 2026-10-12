export type Language = 'tr' | 'en';

export const translations = {
  tr: {
    // General
    back: 'Geri',
    next: 'Ä°leri',
    close: 'Kapat',
    select: 'SeÃ§',
    selected: 'SeÃ§ildi',
    locked: 'Kilitli',
    owned: 'Sahip Olundu',
    level: 'Seviye',
    xp: 'TP',
    scrap: 'ParÃ§a',
    insufficientScrap: 'Yetersiz',
    cancel: 'Ä°ptal',
    confirm: 'Onayla',

    // Controls
    controls: 'KONTROLLER',
    controlsTitle: 'OYUN KONTROLLERÄ°',
    ctrlDriveTitle: 'WASD / YÃ¶n TuÅŸlarÄ±',
    ctrlDriveDesc: 'Kontrol (ArabanÄ±n baktÄ±ÄŸÄ± yÃ¶ne gÃ¶re)',
    ctrlHandbrakeTitle: 'Space (BoÅŸluk)',
    ctrlHandbrakeDesc: 'El freni',
    ctrlNitroTitle: 'Shift (Nitro Boost)',
    ctrlNitroDesc: 'GeÃ§ici maksimum hÄ±z ve sÃ¼per ivmelenme',
    ctrlCameraTitle: '1 - 3 TuÅŸlarÄ±',
    ctrlCameraDesc: 'Kamera (1: YakÄ±n, 2: VarsayÄ±lan, 3: Uzak)',
    cameraToggle: 'Kamera',
    cameraNear: 'YakÄ±n',
    cameraDefault: 'VarsayÄ±lan',
    cameraFar: 'Uzak',

    // Main Menu
    menuTitle: 'TOY RACE',
    play: 'OYNA',
    garage: 'GARAJ',
    shop: 'MAÄAZA',
    crates: 'SANDIKLAR',
    settings: 'AYARLAR',
    profile: 'PROFÄ°L',
    maxLevel: 'MAX SEVÄ°YE',

    // Settings
    settingsTitle: 'AYARLAR',
    language: 'DÄ°L',
    languageDesc: 'Oyunun arayÃ¼z dilini deÄŸiÅŸtir.',
    turkish: 'TÃ¼rkÃ§e',
    english: 'Ä°ngilizce',
    mobileControlsSize: 'MOBÄ°L TUÅ BOYUTU',
    mobileControlsSizeDesc: 'YarÄ±ÅŸtaki dokunmatik tuÅŸlarÄ±n boyutunu ayarla.',
    scrapReward: 'SCRAP HEDÄ°YESÄ°',
    scrapRewardDesc: 'AnÄ±nda 2.745.899 parÃ§a (scrap) hesabÄ±na yÃ¼klenir.',
    claimScrap: 'Al',
    scrapClaimed: '+2.745.899 Scrap Eklendi!',
    soundEffects: 'SES EFEKTLERÄ°',
    engineSound: 'MOTOR SESÄ°',
    musicSound: 'MÃœZÄ°K',

    // Race Setup / Modes
    raceModeTitle: 'YARIÅ MODU',
    raceModeSubtitle: 'NasÄ±l yarÄ±ÅŸmak istediÄŸini seÃ§.',
    normalRace: 'NORMAL YARIÅ',
    normalRaceDesc: 'Klasik yarÄ±ÅŸ. AraÃ§, pist ve yarÄ±ÅŸ ayarlarÄ±nÄ± sen seÃ§ersin.',
    randomCar: 'RASTGELE ARAÃ‡',
    randomCarDesc: 'YarÄ±ÅŸ aracÄ±n baÅŸlangÄ±Ã§ta rastgele belirlenir.',
    ghostMode: 'HAYALET MODU',
    ghostModeDesc: 'Kendi en iyi zamanÄ±na karÅŸÄ± yarÄ±ÅŸ.',
    
    raceSettingsTitle: 'YARIÅ AYARLARI',
    raceSettingsSubtitle: 'Pisti ve yarÄ±ÅŸ formatÄ±nÄ± belirle.',
    trackSelectTitle: 'PÄ°ST SEÃ‡Ä°MÄ°',
    trackSelectSubtitle: 'YarÄ±ÅŸmak istediÄŸin pisti belirle.',
    carSelectTitle: 'ARAÃ‡ SEÃ‡Ä°MÄ°',
    carSelectSubtitle: 'Kullanmak istediÄŸin aracÄ± belirle.',

    stepMode: 'MOD',
    stepSettings: 'AYARLAR',
    stepCar: 'ARAÃ‡',

    raceSummary: 'YARIÅ Ã–ZETÄ°',
    summaryMode: 'MOD',
    summaryTrack: 'PÄ°ST',
    summaryOpponents: 'RAKÄ°P',
    summaryLaps: 'TUR',
    summaryCar: 'ARAÃ‡',
    startRace: 'YARIÅI BAÅLAT',
    track: 'PÄ°ST',
    opponentCount: 'RAKÄ°P SAYISI',
    lapCount: 'TUR SAYISI',
    bestTime: 'En Ä°yi',
    obtainFromShop: 'Bu aracÄ± maÄŸazadan elde edebilirsin.',
    averageScore: 'Ortalama Puan',

    // Garage
    garageTitle: 'GARAJIM',
    garageSubtitle: 'Sahip olduÄŸun araÃ§larÄ± gÃ¶rÃ¼ntÃ¼le ve gÃ¼Ã§lendir.',
    upgradeCenter: 'YÃœKSELTME MERKEZÄ°',
    upgradeTitle: 'YÃœKSELTME',
    upgradeProgress: 'GÃœÃ‡LENDÄ°RME SEVÄ°YESÄ°',
    currentLevel: 'MEVCUT SEVÄ°YE',
    maxUpgradeReached: 'MAKSÄ°MUM SEVÄ°YEYE ULAÅILDI',
    cost: 'Maliyet',
    upgradeButton: 'YÃœKSELT',
    insufficientToUpgrade: 'Yetersiz',
    noCarsOwned: 'HenÃ¼z sahip olunan araÃ§ yok.',
    statSpeed: 'HÄ±z',
    statAccel: 'HÄ±zlanma',
    statHandling: 'Yol TutuÅŸu',
    statSpecial: 'Ã–zel GÃ¼Ã§lendirme',

    // Shop
    shopTitle: 'ARAÃ‡ MAÄAZASI',
    shopSubtitle: 'Yeni araÃ§lar satÄ±n al ve koleksiyonunu geniÅŸlet.',
    buy: 'SATIN AL',
    price: 'Fiyat',
    ownedBadge: 'SAHÄ°PSÄ°N',
    purchaseSuccess: 'AraÃ§ garajÄ±na eklendi!',
    
    // Crates
    cratesTitle: 'GÄ°ZEMLÄ° SANDIKLAR',
    cratesSubtitle: 'SandÄ±k aÃ§arak parÃ§a ve deneyim puanÄ± kazan.',
    bronzeCrate: 'BRONZ SANDIK',
    silverCrate: 'GÃœMÃœÅ SANDIK',
    goldCrate: 'ALTIN SANDIK',
    diamondCrate: 'ELMAS SANDIK',
    openCrate: 'AÃ‡',
    congratulations: 'TEBRÄ°KLER!',
    receivedReward: 'KazanÄ±lan Ã–dÃ¼l',
    collect: 'TOPLA',

    // In Game / HUD
    lap: 'TUR',
    pos: 'SIRA',
    speedKmh: 'KM/S',
    paused: 'DURAKLATILDI',
    resume: 'DEVAM ET',
    restart: 'YENÄ°DEN BAÅLAT',
    quitToMenu: 'ANA MENÃœ',
    raceFinished: 'YARIÅ BÄ°TTÄ°',
    winner: 'BÄ°RÄ°NCÄ° OLDUN!',
    second: 'Ä°KÄ°NCÄ° OLDUN!',
    third: 'ÃœÃ‡ÃœNCÃœ OLDUN!',
    finishedRank: 'SÄ±ralaman',
    rewardsEarned: 'KAZANILAN Ã–DÃœLLER',
    xpGained: 'KazanÄ±lan TP',
    scrapGained: 'KazanÄ±lan ParÃ§a',
    totalTime: 'Toplam SÃ¼re',
    bestLap: 'En Ä°yi Tur',
    backToMenu: 'ANA MENÃœ',
    playAgain: 'TEKRAR YARIÅ',

    // Car types
    pickup: 'Kamyonet',
    suv: 'SUV',
    sport: 'Spor',
    muscle: 'KaslÄ±',
    hyper: 'Hiper'
  },
  en: {
    // General
    back: 'Back',
    next: 'Next',
    close: 'Close',
    select: 'Select',
    selected: 'Selected',
    locked: 'Locked',
    owned: 'Owned',
    level: 'Level',
    xp: 'XP',
    scrap: 'Scrap',
    insufficientScrap: 'Insufficient',
    cancel: 'Cancel',
    confirm: 'Confirm',

    // Controls
    controls: 'CONTROLS',
    controlsTitle: 'GAME CONTROLS',
    ctrlDriveTitle: 'WASD / Arrow Keys',
    ctrlDriveDesc: 'Drive / Steering (Relative to car orientation)',
    ctrlHandbrakeTitle: 'Space',
    ctrlHandbrakeDesc: 'Handbrake',
    ctrlNitroTitle: 'Shift (Nitro Boost)',
    ctrlNitroDesc: 'Temporary maximum speed increase & acceleration boost',
    ctrlCameraTitle: '1 - 3 Keys',
    ctrlCameraDesc: 'Camera (1: Close, 2: Default, 3: Far)',
    cameraToggle: 'Camera',
    cameraNear: 'Near',
    cameraDefault: 'Default',
    cameraFar: 'Far',

    // Main Menu
    menuTitle: 'TOY RACE',
    play: 'PLAY',
    garage: 'GARAGE',
    shop: 'SHOP',
    crates: 'CRATES',
    settings: 'SETTINGS',
    profile: 'PROFILE',
    maxLevel: 'MAX LEVEL',

    // Settings
    settingsTitle: 'SETTINGS',
    language: 'LANGUAGE',
    languageDesc: 'Change the game interface language.',
    turkish: 'Turkish',
    english: 'English',
    mobileControlsSize: 'MOBILE BUTTON SIZE',
    mobileControlsSizeDesc: 'Adjust the size of in-race touch buttons.',
    scrapReward: 'SCRAP GIFT',
    scrapRewardDesc: 'Instantly add 2,745,899 scrap to your balance.',
    claimScrap: 'Claim',
    scrapClaimed: '+2,745,899 Scrap Added!',
    soundEffects: 'SOUND EFFECTS',
    engineSound: 'ENGINE SOUND',
    musicSound: 'MUSIC',

    // Race Setup / Modes
    raceModeTitle: 'RACE MODE',
    raceModeSubtitle: 'Choose how you want to race.',
    normalRace: 'NORMAL RACE',
    normalRaceDesc: 'Classic racing. Choose your car, track, and settings.',
    randomCar: 'RANDOM CAR',
    randomCarDesc: 'Your race car is randomly selected.',
    ghostMode: 'GHOST MODE',
    ghostModeDesc: 'Race against your personal best time record.',
    
    raceSettingsTitle: 'RACE SETTINGS',
    raceSettingsSubtitle: 'Configure track and format.',
    trackSelectTitle: 'TRACK SELECTION',
    trackSelectSubtitle: 'Select the circuit you want to race on.',
    carSelectTitle: 'CAR SELECTION',
    carSelectSubtitle: 'Choose your vehicle.',

    stepMode: 'MODE',
    stepSettings: 'SETTINGS',
    stepCar: 'CAR',

    raceSummary: 'RACE SUMMARY',
    summaryMode: 'MODE',
    summaryTrack: 'TRACK',
    summaryOpponents: 'OPPONENTS',
    summaryLaps: 'LAPS',
    summaryCar: 'CAR',
    startRace: 'START RACE',
    track: 'TRACK',
    opponentCount: 'OPPONENT COUNT',
    lapCount: 'LAP COUNT',
    bestTime: 'Best',
    obtainFromShop: 'You can purchase this car from the Shop.',
    averageScore: 'Average Rating',

    // Garage
    garageTitle: 'MY GARAGE',
    garageSubtitle: 'View and upgrade your owned vehicles.',
    upgradeCenter: 'UPGRADE CENTER',
    upgradeTitle: 'UPGRADE',
    upgradeProgress: 'UPGRADE LEVEL',
    currentLevel: 'CURRENT LEVEL',
    maxUpgradeReached: 'MAX LEVEL REACHED',
    cost: 'Cost',
    upgradeButton: 'UPGRADE',
    insufficientToUpgrade: 'Insufficient',
    noCarsOwned: 'No vehicles owned yet.',
    statSpeed: 'Speed',
    statAccel: 'Acceleration',
    statHandling: 'Handling',
    statSpecial: 'Special Upgrade',

    // Shop
    shopTitle: 'CAR SHOP',
    shopSubtitle: 'Purchase new cars and expand your collection.',
    buy: 'BUY',
    price: 'Price',
    ownedBadge: 'OWNED',
    purchaseSuccess: 'Car added to your garage!',
    
    // Crates
    cratesTitle: 'MYSTERY CRATES',
    cratesSubtitle: 'Open crates to earn scrap and experience points.',
    bronzeCrate: 'BRONZE CRATE',
    silverCrate: 'SILVER CRATE',
    goldCrate: 'GOLD CRATE',
    diamondCrate: 'DIAMOND CRATE',
    openCrate: 'OPEN',
    congratulations: 'CONGRATULATIONS!',
    receivedReward: 'Reward Received',
    collect: 'COLLECT',

    // In Game / HUD
    lap: 'LAP',
    pos: 'POS',
    speedKmh: 'KM/H',
    paused: 'PAUSED',
    resume: 'RESUME',
    restart: 'RESTART',
    quitToMenu: 'MAIN MENU',
    raceFinished: 'RACE FINISHED',
    winner: 'YOU WON 1ST PLACE!',
    second: 'YOU FINISHED 2ND!',
    third: 'YOU FINISHED 3RD!',
    finishedRank: 'Finished Rank',
    rewardsEarned: 'REWARDS EARNED',
    xpGained: 'XP Gained',
    scrapGained: 'Scrap Gained',
    totalTime: 'Total Time',
    bestLap: 'Best Lap',
    backToMenu: 'MAIN MENU',
    playAgain: 'PLAY AGAIN',

    // Car types
    pickup: 'Pickup',
    suv: 'SUV',
    sport: 'Sport',
    muscle: 'Muscle',
    hyper: 'Hyper'
  }
};

export type TranslationKey = keyof typeof translations.tr;

export const t = (key: TranslationKey, lang: Language = 'tr'): string => {
  return translations[lang]?.[key] ?? translations.tr[key] ?? key;
};

export function getTrackName(trackId: string, lang: Language = 'tr'): string {
  if (trackId === 'track-drag' || trackId === 'track-2' || trackId === 'track-3') {
    return lang === 'en' ? 'Drag Strip' : 'Drag Pisti';
  }
  if (trackId === 'track-1') {
    return lang === 'en' ? 'Oval Circuit' : 'Oval Pist';
  }
  if (trackId === 'track-night') {
    return lang === 'en' ? 'Midnight Grand Prix' : 'Gece Åehir Pisti';
  }
  if (trackId === 'track-redoun') {
    return lang === 'en' ? 'Redoun Rally' : 'Redoun (Toprak)';
  }
  return trackId;
}

export function getTrackDifficulty(diff?: string, lang: Language = 'tr'): string {
  if (!diff) return '';
  if (lang === 'tr') {
    if (diff === 'Easy') return 'Kolay';
    if (diff === 'Medium') return 'Orta';
    if (diff === 'Hard') return 'Zor';
  } else {
    if (diff === 'Kolay') return 'Easy';
    if (diff === 'Orta') return 'Medium';
    if (diff === 'Zor') return 'Hard';
  }
  return diff;
}
