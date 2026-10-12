import { useGameStore } from '../store';
import { Button } from './UI/Button';
import { ArrowLeft, Globe, Lock, Gamepad2 } from 'lucide-react';
import { audioManager } from '../game/AudioManager';
import { ScrapIcon } from './UI/ScrapIcon';
import { t } from '../i18n';
import menuBackground from '../assets/menubackgr.webp';

export const Settings = () => {
  const { 
    setScreen, 
    language, 
    mobileButtonScale, 
    setMobileButtonScale,
    gp 
  } = useGameStore();

  const handleToggleLanguage = () => {
    // Language is locked to English
    audioManager.playWarning();
  };

  const percentage = Math.round((mobileButtonScale || 1.0) * 100);

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 text-white font-sans select-none relative overflow-hidden">
      {/* Background Image with Fallback */}
      <img 
        src={menuBackground} 
        alt="Menu Background" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0 brightness-110 contrast-105"
      />
      
      {/* Ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/40 pointer-events-none z-0" />

      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between px-3 py-2 sm:px-5 sm:py-3.5 border-b border-white/10 bg-black/40 backdrop-blur-md shrink-0">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => { audioManager.playUIClick(); setScreen('MAIN_MENU'); }} 
          className="bg-black/40 backdrop-blur border-white/10 hover:border-red-500 hover:text-red-500 text-xs sm:text-sm font-bold uppercase tracking-wider py-1 sm:py-1.5 h-auto"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" /> 
          {t('back', language)}
        </Button>

        <div className="flex items-center gap-2">
          <h1 className="text-sm sm:text-lg lg:text-xl font-black italic uppercase tracking-tighter text-white drop-shadow">
            {t('settingsTitle', language)}
          </h1>
        </div>

        {/* Currency balance display */}
        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur border border-white/10 px-2.5 py-1 rounded-full">
          <ScrapIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="font-mono font-bold text-xs sm:text-sm text-yellow-400">
            {gp.toLocaleString('tr-TR')}
          </span>
        </div>
      </div>

      {/* Settings Content Body - Horizontal Mobile Friendly */}
      <div className="relative z-10 flex-1 overflow-y-auto p-2.5 sm:p-4 md:p-6 flex items-center justify-center min-h-0">
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 my-auto">
          
          {/* Card 1: Language Selection (Locked to English) */}
          <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0">
                    <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black italic uppercase text-xs sm:text-sm text-white tracking-wide truncate">
                      {t('language', language)}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate">
                      English Only (Locked)
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[8.5px] sm:text-[9.5px] font-black uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  <Lock className="w-3 h-3 text-amber-500" />
                  LOCKED
                </span>
              </div>

              {/* Language Locked Button */}
              <div 
                onClick={handleToggleLanguage}
                className="mt-2 sm:mt-3 flex items-center justify-between p-2 sm:p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 opacity-90 cursor-not-allowed select-none group shadow-inner"
                title="Language selection is locked to English"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base sm:text-lg">🇬🇧</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs sm:text-sm text-white">
                      English
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-zinc-400">
                      Default & Locked Game Language
                    </span>
                  </div>
                </div>

                {/* Lock indicator */}
                <div 
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0 border border-zinc-700"
                >
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 px-0.5">
                <span className="text-zinc-600 line-through">🇹🇷 TR (Disabled)</span>
                <span className="text-zinc-700">•</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 inline" /> 🇬🇧 EN (Active)
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Mobile UI Controls Size Bar */}
          <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black italic uppercase text-xs sm:text-sm text-white tracking-wide truncate">
                      {t('mobileControlsSize', language)}
                    </h3>
                    <span className="font-mono font-black text-xs sm:text-sm text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      %{percentage}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate">
                    {t('mobileControlsSizeDesc', language)}
                  </p>
                </div>
              </div>
            </div>

            {/* Slider Bar */}
            <div className="mt-2 sm:mt-2.5 flex flex-col gap-2">
              <div className="relative flex items-center w-full">
                <input
                  type="range"
                  min="0.7"
                  max="1.4"
                  step="0.05"
                  value={mobileButtonScale || 1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setMobileButtonScale(val);
                  }}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600 hover:accent-red-500 transition-all border border-white/10"
                />
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: language === 'tr' ? 'Küçük' : 'Small', val: 0.8 },
                  { label: language === 'tr' ? 'Normal' : 'Default', val: 1.0 },
                  { label: language === 'tr' ? 'Büyük' : 'Large', val: 1.25 }
                ].map((preset) => {
                  const isActive = Math.abs((mobileButtonScale || 1.0) - preset.val) < 0.06;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        audioManager.playUIClick();
                        setMobileButtonScale(preset.val);
                      }}
                      className={`py-1 px-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        isActive
                          ? 'bg-red-600/30 border-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                          : 'bg-black/30 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
