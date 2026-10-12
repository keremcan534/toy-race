import { useState } from 'react';
import { useGameStore, countClaimableStarterQuests } from '../store';
import { Button } from './UI/Button';
import { Car, ShoppingBag, Play, Settings as SettingsIcon, Gamepad2, X, Lock, Award } from 'lucide-react';
import { audioManager } from '../game/AudioManager';
import { ScrapIcon } from './UI/ScrapIcon';
import { ShopModal } from './ShopModal';
import { StarterQuestsModal } from './StarterQuestsModal';
import { t } from '../i18n';
import menuBackground from '../assets/menubackgr.webp';
import tokenIcon from '../assets/upgradetoken.webp';

export const MainMenu = () => {
  const { setScreen, gp, upgradeTokens, language, starterProgress, cars } = useGameStore();
  const [showControlsModal, setShowControlsModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showStarterModal, setShowStarterModal] = useState(false);

  // Check if any completed starter quest has an unclaimed reward
  const unclaimedQuestsCount = countClaimableStarterQuests({ cars, starterProgress });

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-zinc-950 text-white p-4 relative overflow-hidden font-sans select-none">
      
      {/* Background Image */}
      <img 
        src={menuBackground} 
        alt="Menu Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0 brightness-110 contrast-105"
      />
      
      {/* Light Ambient Gradient Overlay for Contrast & Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/40 pointer-events-none z-0" />
      
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-5 pointer-events-none" />
      
      {/* Top Left: Controls Button (KİLİTLİ) */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => { audioManager.playWarning(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950/80 border border-zinc-800 rounded-md backdrop-blur-md transition-all shadow-lg text-xs font-bold italic tracking-wide text-zinc-500 cursor-not-allowed select-none group opacity-85 hover:border-zinc-700"
          title={language === 'tr' ? 'Kontroller menüsü kilitli' : 'Controls menu locked'}
        >
          <Lock className="w-3.5 h-3.5 text-zinc-500" />
          <Gamepad2 className="w-4 h-4 text-zinc-600" />
          <span>{t('controls', language)}</span>
          <span className="text-[8.5px] px-1 py-0.5 bg-zinc-800 text-zinc-400 rounded uppercase font-mono ml-0.5 font-bold">
            {language === 'tr' ? 'KİLİTLİ' : 'LOCKED'}
          </span>
        </button>
      </div>

      {/* Top Right Stats (Frosted Glass & Compact Typography) */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col items-end gap-1.5 sm:gap-2 z-20">
        {/* Scrap Balance Display */}
        <div className="flex items-center justify-between min-w-[120px] sm:min-w-[140px] bg-black/35 backdrop-blur-xl px-2.5 sm:px-3 py-1 rounded-lg border border-white/20 shadow-xl shadow-black/50">
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex flex-col items-start">
              <span className="font-mono text-[11px] sm:text-xs text-white font-bold tracking-wider leading-none">
                {gp.toLocaleString('tr-TR')}
              </span>
              <span className="text-[6.5px] sm:text-[7.5px] text-zinc-300 uppercase font-bold tracking-wider mt-0.5">
                {language === 'tr' ? 'HURDA' : 'SCRAP'}
              </span>
            </div>
            <ScrapIcon className="w-5 h-5 shrink-0" />
          </div>
        </div>

        {/* Upgrade Token Balance Display */}
        <button
          onClick={() => { audioManager.playUIClick(); setShowShopModal(true); }}
          className="flex items-center justify-between min-w-[120px] sm:min-w-[140px] bg-black/35 hover:bg-amber-950/40 backdrop-blur-xl px-2.5 sm:px-3 py-1 rounded-lg border border-white/20 hover:border-amber-400/70 shadow-xl shadow-black/50 transition-all cursor-pointer group"
          title={language === 'tr' ? 'Yükseltme Jetonları - Mağaza için tıkla' : 'Upgrade Tokens - Click to open shop'}
        >
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex flex-col items-start">
              <span className="font-mono text-[11px] sm:text-xs text-amber-300 font-bold tracking-wider leading-none">
                {upgradeTokens}
              </span>
              <span className="text-[6.5px] sm:text-[7.5px] text-amber-400/80 uppercase font-bold tracking-wider mt-0.5">
                {language === 'tr' ? 'JETONLAR' : 'TOKENS'}
              </span>
            </div>
            <img 
              src={tokenIcon} 
              alt="Upgrade Token" 
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] group-hover:scale-110 transition-transform shrink-0"
            />
          </div>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-4 w-full z-20 px-8 md:px-20 relative justify-center">
        
        {/* Header Title */}
        <div className="mb-2">
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 uppercase">
            Toy <span className="text-red-600">Race</span>
          </h1>
        </div>

        <div className="flex flex-row flex-wrap items-center gap-3 md:gap-4 w-full max-w-3xl">
          <button 
            className="w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-red-500 via-red-600 to-rose-700 hover:from-red-400 hover:via-red-500 hover:to-rose-600 active:scale-95 text-white shadow-[0_0_35px_rgba(239,68,68,0.5)] border border-red-400/40 skew-x-[-6deg] transition-all duration-300 p-0 rounded-xl inline-flex items-center justify-center cursor-pointer focus:outline-none" 
            onClick={() => { audioManager.playStartRaceSound(); setScreen('MODE_SELECTION'); }}
          >
            <div className="skew-x-[6deg] flex flex-col items-center justify-center h-full w-full gap-2">
              <Play className="h-10 w-10 md:h-12 md:w-12 fill-white transition-colors" /> 
              <span className="font-black italic tracking-tight text-sm md:text-lg text-center leading-tight">
                {language === 'en' ? <>START<br/>RACE</> : <>YARIŞA<br/>BAŞLA</>}
              </span>
            </div>
          </button>
          
          <div className="flex flex-col gap-2 md:gap-3">
            <div className="flex flex-row items-center gap-3 md:gap-4">
              <Button 
                size="md" 
                variant="secondary" 
                className="w-20 h-20 md:w-28 md:h-28 bg-zinc-900 border-b-2 border-zinc-700 skew-x-[-6deg] transition-all p-0" 
                onClick={() => { audioManager.playUIClick(); setScreen('SHOP'); }}
              >
                <div className="skew-x-[6deg] flex flex-col items-center justify-center h-full w-full gap-1 md:gap-2">
                  <ShoppingBag className="h-6 w-6 md:h-8 md:w-8 text-zinc-400 transition-colors" /> 
                  <span className="font-bold italic text-zinc-300 text-[10px] md:text-sm">{t('shop', language)}</span>
                </div>
              </Button>
              
              <Button 
                size="md" 
                variant="secondary" 
                className="w-20 h-20 md:w-28 md:h-28 bg-zinc-900 border-b-2 border-zinc-700 skew-x-[-6deg] transition-all p-0" 
                onClick={() => { audioManager.playUIClick(); setScreen('MY_GARAGE'); }}
              >
                <div className="skew-x-[6deg] flex flex-col items-center justify-center h-full w-full gap-1 md:gap-2">
                  <Car className="h-6 w-6 md:h-8 md:w-8 text-zinc-400 transition-colors" /> 
                  <span className="font-bold italic text-zinc-300 text-[10px] md:text-sm">{t('garage', language)}</span>
                </div>
              </Button>
            </div>

            {/* BAŞLANGIÇ BUTTON - İki buton genişliğinde ve ince uzun */}
            <button
              onClick={() => { audioManager.playUIClick(); setShowStarterModal(true); }}
              className="w-full h-8 md:h-9 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:via-yellow-400 hover:to-amber-400 active:scale-98 text-black font-black italic tracking-wider text-xs md:text-sm uppercase rounded-lg skew-x-[-6deg] shadow-lg shadow-amber-950/60 border border-amber-300/50 transition-all flex items-center justify-center cursor-pointer group"
              title={language === 'tr' ? 'Başlangıç Görevleri' : 'Starter Missions'}
            >
              <div className="skew-x-[6deg] flex items-center justify-center gap-2 w-full px-2">
                <Award className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                <span className="drop-shadow-sm font-black">{language === 'tr' ? 'BAŞLANGIÇ' : 'STARTER'}</span>
                {unclaimedQuestsCount > 0 && (
                  <span className="relative flex h-2 w-2 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                )}
              </div>
            </button>
          </div>

          <Button 
            size="md" 
            variant="outline" 
            className="w-20 h-20 md:w-28 md:h-28 border-zinc-800 bg-zinc-900/50 text-zinc-500 skew-x-[-6deg] transition-all p-0" 
            onClick={() => { audioManager.playUIClick(); setScreen('SETTINGS'); }}
          >
            <div className="skew-x-[6deg] flex flex-col items-center justify-center h-full w-full gap-1 md:gap-2">
              <SettingsIcon className="h-6 w-6 md:h-8 md:w-8 transition-transform duration-500" /> 
              <span className="font-bold italic text-[10px] md:text-sm">{t('settings', language)}</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Shop Modal */}
      <ShopModal isOpen={showShopModal} onClose={() => setShowShopModal(false)} />

      {/* Starter Quests Modal */}
      <StarterQuestsModal isOpen={showStarterModal} onClose={() => setShowStarterModal(false)} />

      {/* Controls Info Modal (Landscape and Mobile Optimized) */}
      {showControlsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-950/95 border border-white/15 rounded-2xl max-w-lg w-full p-3 sm:p-5 shadow-2xl relative max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden">
            <button
              onClick={() => { audioManager.playUIClick(); setShowControlsModal(false); }}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2 shrink-0">
              <Gamepad2 className="w-5 h-5 text-red-500" />
              <h3 className="text-sm sm:text-base font-black italic uppercase tracking-wider text-white">
                {t('controlsTitle', language)}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 landscape:grid-cols-2 gap-2 my-1 overflow-y-auto flex-1 pr-0.5">
              {/* Drive */}
              <div className="p-2 sm:p-2.5 rounded-lg bg-zinc-900/80 border border-white/10 flex items-start gap-2">
                <div className="px-2 py-0.5 bg-red-600/20 text-red-400 font-mono font-bold text-xs rounded border border-red-500/30 shrink-0">
                  WASD
                </div>
                <div className="min-w-0">
                  <div className="text-white font-bold text-xs leading-tight">
                    {t('ctrlDriveTitle', language)}
                  </div>
                  <div className="text-zinc-400 text-[10px] sm:text-[11px] mt-0.5 leading-tight">
                    {t('ctrlDriveDesc', language)}
                  </div>
                </div>
              </div>

              {/* Handbrake */}
              <div className="p-2 sm:p-2.5 rounded-lg bg-zinc-900/80 border border-white/10 flex items-start gap-2">
                <div className="px-2 py-0.5 bg-yellow-600/20 text-yellow-400 font-mono font-bold text-xs rounded border border-yellow-500/30 shrink-0">
                  SPACE
                </div>
                <div className="min-w-0">
                  <div className="text-white font-bold text-xs leading-tight">
                    {t('ctrlHandbrakeTitle', language)}
                  </div>
                  <div className="text-zinc-400 text-[10px] sm:text-[11px] mt-0.5 leading-tight">
                    {t('ctrlHandbrakeDesc', language)}
                  </div>
                </div>
              </div>

              {/* Nitro Boost */}
              <div className="p-2 sm:p-2.5 rounded-lg bg-zinc-900/80 border border-white/10 flex items-start gap-2">
                <div className="px-2 py-0.5 bg-cyan-600/20 text-cyan-400 font-mono font-bold text-xs rounded border border-cyan-500/30 shrink-0">
                  SHIFT
                </div>
                <div className="min-w-0">
                  <div className="text-white font-bold text-xs leading-tight">
                    {t('ctrlNitroTitle', language)}
                  </div>
                  <div className="text-zinc-400 text-[10px] sm:text-[11px] mt-0.5 leading-tight">
                    {t('ctrlNitroDesc', language)}
                  </div>
                </div>
              </div>

              {/* Camera */}
              <div className="p-2 sm:p-2.5 rounded-lg bg-zinc-900/80 border border-white/10 flex items-start gap-2">
                <div className="px-2 py-0.5 bg-blue-600/20 text-blue-400 font-mono font-bold text-xs rounded border border-blue-500/30 shrink-0">
                  1 - 3
                </div>
                <div className="min-w-0">
                  <div className="text-white font-bold text-xs leading-tight">
                    {t('ctrlCameraTitle', language)}
                  </div>
                  <div className="text-zinc-400 text-[10px] sm:text-[11px] mt-0.5 leading-tight">
                    {t('ctrlCameraDesc', language)}
                  </div>
                </div>
              </div>
            </div>

            <Button
              size="sm"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black italic mt-2 py-1.5 text-xs shrink-0"
              onClick={() => { audioManager.playUIClick(); setShowControlsModal(false); }}
            >
              {t('close', language)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
