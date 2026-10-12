import { useState, useEffect, useRef } from 'react';
import { useGameStore, getUpgradeCost, getTokensRequired, applyCarStatUpgrade } from '../store';
import { useBackHandler } from '../platform';
import { audioManager } from '../game/AudioManager';
import { Button } from './UI/Button';
import { ArrowLeft, X, Zap, TrendingUp, Wrench, Loader2 } from 'lucide-react';
import { CarPreview } from './CarPreview';
import { motion, AnimatePresence } from 'motion/react';
import { ScrapIcon } from './UI/ScrapIcon';
import { ShopModal } from './ShopModal';
import { CarName } from './UI/CarName';
import { StatBar } from './UI/StatBar';
import { t } from '../i18n';
import garageBackground from '../assets/garagebackgr.webp';
import tokenIcon from '../assets/upgradetoken.webp';

export const MyGarage = () => {
  const { cars, selectedCarId, selectCar, setScreen, upgradeCar, useUpgradeToken, upgradeTokens, gp, language } = useGameStore();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [upgradedInModal, setUpgradedInModal] = useState(false);
  const [showUpgradeEffect, setShowUpgradeEffect] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeProgress, setUpgradeProgress] = useState(0);
  
  const ownedCars = cars.filter(c => c.owned);
  const selectedCar = ownedCars.find(c => c.id === selectedCarId) || ownedCars[0];

  const tokensRequired = selectedCar ? getTokensRequired(selectedCar) : 1;

  const handleTokenUpgrade = () => {
    if (selectedCar && !isUpgrading && upgradeTokens >= tokensRequired && !isMaxLevel) {
      const success = useUpgradeToken(selectedCar.id);
      if (success) {
        audioManager.playInstantUpgrade();
        setUpgradedInModal(true);
        setShowBurst(true);
        setTimeout(() => setShowBurst(false), 1200);
      }
    } else if (upgradeTokens < tokensRequired) {
      audioManager.playWarning();
    }
  };

  const handleUpgrade = () => {
    if (selectedCar && !isUpgrading && canAfford && !isMaxLevel) {
      setIsUpgrading(true);
      setUpgradeProgress(0);
      audioManager.playUpgrade();

      const startTime = Date.now();
      const duration = 5000; // 5 seconds duration

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
        setUpgradeProgress(progress);

        if (elapsed >= duration) {
          clearInterval(interval);
          upgradeCar(selectedCar.id);
          audioManager.playUpgradeComplete();
          setIsUpgrading(false);
          setUpgradeProgress(0);
          setUpgradedInModal(true);
          setShowBurst(true);
          setTimeout(() => setShowBurst(false), 1200);
        }
      }, 50);
    } else if (!canAfford) {
      audioManager.playWarning();
    }
  };

  const handleCloseModal = () => {
    if (isUpgrading) return; // Prevent closing while upgrading
    setIsUpgradeModalOpen(false);
    if (upgradedInModal) {
      setShowUpgradeEffect(true);
      setTimeout(() => setShowUpgradeEffect(false), 2000);
      setUpgradedInModal(false);
    }
  };

  // Same price the store charges (they used to differ, so some upgrades "finished" without applying).
  const upgradeCost = selectedCar ? getUpgradeCost(selectedCar) : 0;
  const isMaxLevel = selectedCar ? selectedCar.upgradeLevel >= selectedCar.maxUpgradeLevel : true;
  const canAfford = gp >= upgradeCost;

  // What the next upgrade changes, worked out from the real upgrade rule so the list is always right.
  const nextLevelCar = selectedCar && !isMaxLevel ? applyCarStatUpgrade(selectedCar) : null;
  const upgradeEffects = nextLevelCar && selectedCar ? [
    { label: language === 'en' ? 'SPEED' : 'HIZ', value: nextLevelCar.maxSpeed - selectedCar.maxSpeed },
    { label: language === 'en' ? 'ACCEL' : 'HIZLANMA', value: nextLevelCar.acceleration - selectedCar.acceleration },
    { label: language === 'en' ? 'HANDLING' : 'YOL TUTUŞ', value: nextLevelCar.handling - selectedCar.handling },
  ].filter(effect => effect.value !== 0) : [];

  // Android back closes the upgrade dialog (not while an upgrade is running); otherwise the screen goes back.
  useBackHandler(() => {
    if (!isUpgradeModalOpen) return false;
    handleCloseModal();
  });

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 text-white overflow-hidden font-sans select-none relative">
      {/* Background Image - rendered as img and styled background for 100% guarantee */}
      <img 
        src={garageBackground} 
        alt="Garage Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0 brightness-110 contrast-105"
      />
      
      {/* Light Ambient Overlay for Contrast while keeping garage background vividly visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/30 pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <header className="w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 z-30 shrink-0 bg-zinc-950/40 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => { audioManager.playUIClick(); setScreen('MAIN_MENU'); }} 
            className="bg-zinc-900/90 backdrop-blur border-zinc-700 hover:border-red-500 hover:text-red-500 transition-colors h-8 px-2.5 sm:px-3 text-xs"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> {t('back', language)}
          </Button>
          <div className="flex items-center gap-1.5">
            <Wrench className="text-red-500 w-4 h-4" />
            <h1 className="text-sm sm:text-base md:text-lg font-black italic text-white uppercase tracking-wider">
              {t('garage', language)}
            </h1>
          </div>
        </div>

        {/* Scrap Balance, Token Balance & Counter */}
        <div className="flex items-center gap-2">
          {selectedCar && (
            <span className="text-[10px] sm:text-xs font-mono font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 hidden sm:inline">
              {ownedCars.findIndex(c => c.id === selectedCar.id) + 1} / {ownedCars.length}
            </span>
          )}
          {/* Token Counter */}
          <button 
            onClick={() => { audioManager.playUIClick(); setShowShopModal(true); }}
            className="flex items-center gap-1.5 bg-zinc-900/90 hover:bg-amber-950/40 backdrop-blur px-2.5 py-1 rounded-sm border-l-2 border-amber-500 shadow-md transition-colors cursor-pointer"
            title={language === 'tr' ? 'Jeton Mağazası' : 'Token Shop'}
          >
            <span className="font-mono text-xs sm:text-sm text-amber-300 font-bold tracking-wider">{upgradeTokens}</span>
            <img src={tokenIcon} alt="Token" className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain" />
          </button>
          {/* Scrap Counter */}
          <div className="flex items-center gap-1.5 bg-zinc-900/90 backdrop-blur px-2.5 py-1 rounded-sm border-l-2 border-red-600 shadow-md">
            <span className="font-mono text-xs sm:text-sm text-white font-bold tracking-wider">{gp.toLocaleString('tr-TR')}</span>
            <ScrapIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
      </header>

      {/* Main Content Area - Split left/right on landscape & md+ */}
      <div className="flex-1 flex flex-col md:flex-row landscape:flex-row min-h-0 w-full p-2 sm:p-3 md:p-4 gap-2 sm:gap-3 md:gap-4 overflow-hidden relative z-10">
        
        {/* Left Side: Selected Car Stats (Floating Glass Panel, compact for mobile landscape) */}
        <div className="w-full md:w-[38%] landscape:w-[38%] lg:w-[34%] h-full flex flex-col min-h-0 shrink-0">
          <div className="bg-zinc-950/75 backdrop-blur-md border border-white/15 rounded-xl p-2.5 sm:p-3 md:p-4 shadow-2xl flex flex-col h-full min-h-0 justify-between overflow-y-auto">
            {selectedCar ? (
              <div className="flex flex-col h-full justify-between gap-1.5 sm:gap-2">
                
                {/* Car Title Header */}
                <div className="text-center shrink-0">
                  <h2 className="text-base sm:text-lg md:text-xl font-black italic text-white uppercase tracking-tighter truncate">
                    <CarName name={selectedCar.name} />
                  </h2>
                  <div className="h-0.5 w-10 bg-red-600 mx-auto mt-0.5 skew-x-[-12deg]" />
                </div>

                {/* Car Preview Canvas - Scaled nicely to fit mobile landscape without bursting */}
                <div className="w-full flex-1 max-h-[110px] sm:max-h-[130px] md:max-h-[160px] min-h-[75px] rounded-lg flex items-center justify-center shadow-inner bg-zinc-900/60 border border-white/10 relative overflow-hidden group shrink-0">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-60" />
                   
                   {/* Upgrade Glow Effect */}
                   <AnimatePresence>
                     {showUpgradeEffect && (
                       <motion.div
                         initial={{ opacity: 0, scale: 0.8 }}
                         animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1.4] }}
                         transition={{ duration: 1.5 }}
                         className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl z-0"
                       />
                     )}
                   </AnimatePresence>

                   {/* Car Preview */}
                   <motion.div
                     animate={showUpgradeEffect ? {
                       scale: [1, 1.05, 1],
                       filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
                     } : {}}
                     transition={{ duration: 0.5 }}
                     className="relative z-10 flex items-center justify-center w-full h-full"
                   >
                     <CarPreview car={selectedCar} scale={2.8} className="drop-shadow-xl" />
                   </motion.div>
                </div>
                
                {/* Stat Bars - compact layout for mobile landscape */}
                <div className="space-y-1 sm:space-y-1.5 shrink-0" key={selectedCar.id}>
                  <StatBar 
                    label={t('statSpeed', language)} 
                    value={selectedCar.maxSpeed} 
                    statType="speed"
                    carId={selectedCar.id}
                    enableUpgradeEffect={true}
                    triggerEffect={showUpgradeEffect && (selectedCar.id === 'car-siestre' || selectedCar.id === 'car-pnisther-cugan' || selectedCar.id === 'car-marceli-mt' || selectedCar.upgradeAttribute === 'maxSpeed')} 
                    isModalOpen={isUpgradeModalOpen}
                  />
                  <StatBar 
                    label={t('statAccel', language)} 
                    value={selectedCar.acceleration} 
                    statType="accel"
                    carId={selectedCar.id}
                    enableUpgradeEffect={true}
                    triggerEffect={showUpgradeEffect && (selectedCar.id === 'car-siestre' || selectedCar.id === 'car-marceli-mt')} 
                    isModalOpen={isUpgradeModalOpen}
                  />
                  <StatBar 
                    label={t('statHandling', language)} 
                    value={selectedCar.handling} 
                    statType="handling"
                    carId={selectedCar.id}
                    enableUpgradeEffect={true}
                    triggerEffect={showUpgradeEffect && (selectedCar.id === 'car-pnisther-cugan' || selectedCar.upgradeAttribute === 'handling')} 
                    isModalOpen={isUpgradeModalOpen}
                  />
                </div>

                {/* Upgrade Button */}
                <Button 
                  className="w-full mt-1 bg-red-600 hover:bg-red-700 text-white font-black italic py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm skew-x-[-6deg] shadow-[0_0_15px_rgba(220,38,38,0.4)] border-none group transition-all shrink-0"
                  onClick={() => { audioManager.playUIClick(); setIsUpgradeModalOpen(true); }}
                >
                  <div className="skew-x-[6deg] flex items-center justify-center gap-1.5">
                    <Zap className="h-4 w-4 fill-white group-hover:scale-110 transition-transform" /> 
                    <span className="tracking-wider uppercase">{t('upgradeTitle', language)}</span>
                  </div>
                </Button>
              </div>
            ) : (
              <p className="text-zinc-400 text-center font-bold italic py-8 text-xs">{t('noCarsOwned', language)}</p>
            )}
          </div>
        </div>

        {/* Right Side: Owned Cars Grid (Translucent, allowing garage background to shine through) */}
        <div className="flex-1 h-full min-h-0 bg-zinc-950/40 backdrop-blur-xs rounded-xl border border-white/10 p-2 sm:p-3 overflow-y-auto relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5 pb-6">
            {ownedCars.map((car) => (
              <div
                key={car.id}
                onClick={() => { audioManager.playUIClick(); selectCar(car.id); }}
                className={`p-2 rounded-lg cursor-pointer border transition-all relative group duration-200 ${
                  selectedCarId === car.id 
                    ? 'border-red-600 bg-zinc-900/90 shadow-[0_0_15px_rgba(220,38,38,0.35)] scale-[1.02]' 
                    : 'border-white/10 bg-zinc-950/60 hover:bg-zinc-900/80 hover:border-white/25'
                }`}
              >
                <div className="aspect-video rounded-md mb-1.5 flex items-center justify-center relative overflow-hidden bg-black/40 border border-white/5">
                  <div className="w-full h-full flex items-center justify-center">
                    <CarPreview car={car} scale={2.6} />
                  </div>
                </div>
                <h3 className={`font-black text-[10px] sm:text-xs text-center truncate uppercase tracking-wider ${selectedCarId === car.id ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                  <CarName name={car.name} />
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shop Modal */}
      <ShopModal isOpen={showShopModal} onClose={() => setShowShopModal(false)} />

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && selectedCar && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-1.5 sm:p-3">
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-sm rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh]">
            
            {/* Header */}
            <div className="flex justify-between items-center px-3 py-1.5 sm:px-4 sm:py-2 border-b border-zinc-800 bg-zinc-950 shrink-0">
              <h3 className="text-xs sm:text-sm font-black italic text-red-500 flex items-center uppercase tracking-wider">
                <Zap className="mr-1.5 h-3.5 w-3.5 fill-red-500" /> {t('upgradeCenter', language)}
              </h3>
              <button 
                onClick={() => { audioManager.playUIClick(); handleCloseModal(); }}
                className="text-zinc-500 hover:text-white transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-2 sm:p-3 flex flex-col items-center space-y-1.5 sm:space-y-2 overflow-y-auto relative">
              
              <div className="w-full max-w-[180px] sm:max-w-[200px] h-[52px] sm:h-[65px] bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 to-zinc-950 opacity-50" />
                <CarPreview car={selectedCar} scale={2.2} className={`relative z-10 transition-all duration-300 ${isUpgrading ? 'brightness-75 blur-[0.5px] scale-95' : ''}`} />
                
                {/* 5-Second Circular Loading Spinner Ring & Progress */}
                {isUpgrading && (
                  <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/65 backdrop-blur-xs">
                    <div className="relative w-9 h-9 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        {/* Background ring */}
                        <path
                          className="text-zinc-800"
                          strokeWidth="3.2"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        {/* Animated Progress ring */}
                        <path
                          className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)] transition-all duration-75"
                          strokeDasharray={`${upgradeProgress}, 100`}
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Wrench className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                      </div>
                    </div>
                    <span className="text-[8px] font-mono font-bold text-red-300 mt-0.5 tracking-wider drop-shadow">
                      {upgradeProgress}%
                    </span>
                  </div>
                )}

                <AnimatePresence>
                  {showBurst && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                          animate={{
                            x: (Math.random() - 0.5) * 500,
                            y: (Math.random() - 0.5) * 500,
                            scale: Math.random() * 2,
                            opacity: 0,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: ['#ef4444', '#f97316', '#dc2626', '#ffffff', '#fbbf24'][Math.floor(Math.random() * 5)],
                            boxShadow: '0 0 15px rgba(239, 68, 68, 0.9)'
                          }}
                        />
                      ))}
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute w-full h-full rounded-full border-8 border-red-500/50"
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-center relative z-10 shrink-0">
                <h2 className="text-xs sm:text-sm font-black italic text-white uppercase tracking-wider leading-tight">
                  <CarName name={selectedCar.name} />
                </h2>
                <div className="text-zinc-500 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest">
                  {selectedCar.maxUpgradeLevel === 1 
                    ? (language === 'en' ? 'SPECIAL UPGRADE' : 'ÖZEL GÜÇLENDİRME')
                    : `${language === 'en' ? 'Level' : 'Seviye'} ${selectedCar.upgradeLevel} / ${selectedCar.maxUpgradeLevel}`}
                </div>
              </div>

              {/* Stats to Upgrade */}
              <div className="w-full bg-zinc-950/70 rounded-lg p-2 border border-zinc-800 space-y-1 text-xs shrink-0">
                <div className="flex justify-between items-start">
                  <span className="text-zinc-400 font-bold uppercase text-[9px] sm:text-[10px]">{language === 'en' ? 'Upgrade Effect' : 'Yükseltme Etkisi'}</span>
                  <div className="flex flex-col items-end">
                    {upgradeEffects.length > 0 ? upgradeEffects.map(effect => (
                      <span key={effect.label} className="font-mono text-green-400 font-bold flex items-center text-[9px] sm:text-[10px]">
                        <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> {effect.label} {effect.value > 0 ? '+' : ''}{effect.value}
                      </span>
                    )) : (
                      <span className="font-mono text-zinc-500 font-bold text-[9px] sm:text-[10px]">-</span>
                    )}
                  </div>
                </div>

                <div className="h-px bg-zinc-800 w-full my-0.5" />

                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 font-bold uppercase text-[9px] sm:text-[10px]">{t('cost', language)}</span>
                  <span className={`font-mono font-bold flex items-center gap-1 text-[11px] ${canAfford ? 'text-white' : 'text-red-500'}`}>
                    {isMaxLevel ? (
                      (language === 'en' ? 'MAX' : 'MAKSİMUM')
                    ) : (
                      <>
                        <span>{upgradeCost.toLocaleString()}</span>
                        <ScrapIcon className="w-3 h-3 text-yellow-400" />
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-col gap-1.5 shrink-0 pt-0.5">
                {/* Fast Upgrade with Token (if available) */}
                {upgradeTokens >= tokensRequired && !isMaxLevel && !isUpgrading && (
                  <Button
                    size="sm"
                    onClick={handleTokenUpgrade}
                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-black italic text-xs py-1.5 uppercase shadow-md shadow-amber-900/40 border-none"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <img src={tokenIcon} alt="Token" className="w-3.5 h-3.5 object-contain drop-shadow" />
                      <span>{language === 'en' ? `INSTANT UPGRADE (${tokensRequired} TOKEN${tokensRequired > 1 ? 'S' : ''})` : `HIZLI YÜKSELT (${tokensRequired} JETON)`}</span>
                    </div>
                  </Button>
                )}

                {/* Standard Upgrade Button */}
                <Button 
                  className={`w-full py-1.5 sm:py-2 text-xs font-black italic shrink-0 ${
                    isUpgrading
                      ? 'bg-zinc-800 border border-red-500/50 text-red-300 cursor-wait shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                      : isMaxLevel 
                        ? 'bg-zinc-800 cursor-not-allowed text-zinc-500 border border-zinc-700' 
                        : canAfford 
                          ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] border-none' 
                          : 'bg-zinc-900 border border-red-900/50 cursor-not-allowed text-red-500'
                  }`}
                  disabled={isMaxLevel || !canAfford || isUpgrading}
                  onClick={handleUpgrade}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    {isUpgrading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                        <span>{language === 'en' ? 'UPGRADING...' : 'GÜÇLENDİRİLİYOR...'}</span>
                        <span className="font-mono text-[10px] text-red-300">({upgradeProgress}%)</span>
                      </>
                    ) : isMaxLevel ? (
                      t('maxUpgradeReached', language)
                    ) : !canAfford ? (
                      <>
                        <span>{t('insufficientScrap', language).toUpperCase()}</span>
                        <ScrapIcon className="w-3 h-3 text-red-400" />
                      </>
                    ) : (
                      t('upgradeButton', language)
                    )}
                  </div>
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
