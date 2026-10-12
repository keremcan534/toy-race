import { useGameStore } from '../store';
import { Trophy, Zap, Ghost, ChevronUp, ChevronDown, Check, Flame } from 'lucide-react';
import { audioManager } from '../game/AudioManager';
import { RaceSetupLayout } from './RaceSetupLayout';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { t, Language } from '../i18n';

type ModeType = 'NORMAL' | 'RANDOM' | 'GHOST' | 'DRIFT';
const MODES: ModeType[] = ['NORMAL', 'RANDOM', 'GHOST', 'DRIFT'];

export const ModeSelection = () => {
  const { setScreen, setRandomMode, setGhostMode, setDriftMode, raceConfig, language } = useGameStore();

  const initialMode: ModeType = raceConfig.isDriftMode
    ? 'DRIFT'
    : raceConfig.isGhostMode 
      ? 'GHOST' 
      : raceConfig.isRandomMode 
        ? 'RANDOM' 
        : 'NORMAL';
        
  const [selectedMode, setSelectedMode] = useState<ModeType>(initialMode);

  const currentIndex = MODES.indexOf(selectedMode);
  const nextIndex = (currentIndex + 1) % MODES.length;

  const activeModeDetails = getModeDetails(MODES[currentIndex], language);
  const nextModeDetails = getModeDetails(MODES[nextIndex], language);

  const handlePrevMode = () => {
    audioManager.playUIClick();
    const prevIndex = (currentIndex - 1 + MODES.length) % MODES.length;
    setSelectedMode(MODES[prevIndex]);
  };

  const handleNextMode = () => {
    audioManager.playUIClick();
    setSelectedMode(MODES[nextIndex]);
  };

  const handleNextScreen = () => {
    setRandomMode(selectedMode === 'RANDOM');
    setGhostMode(selectedMode === 'GHOST');
    setDriftMode?.(selectedMode === 'DRIFT');
    setScreen('RACE_SELECTION');
  };

  return (
    <RaceSetupLayout
      currentStep="MODE"
      onBack={() => setScreen('MAIN_MENU')}
      summary={{
        mode: activeModeDetails.title
      }}
      ctaText={t('next', language)}
      ctaDisabled={false}
      onCtaClick={handleNextScreen}
    >
      <div className="flex flex-col h-full min-h-0 justify-start">
        {/* Title Header */}
        <div className="mb-3 sm:mb-5 shrink-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black italic uppercase tracking-tighter text-white mb-0.5 leading-tight">
            {t('raceModeTitle', language)}
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-medium">{t('raceModeSubtitle', language)}</p>
        </div>

        {/* Main Interactive Single-Slot Mode Container with Arrow Stepper */}
        <div className="flex items-start gap-3 sm:gap-5 max-w-2xl w-full">
          
          {/* Active Card Slot & Next Mode Preview Slot */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            
            {/* 1. ACTIVE MODE SLOT */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModeDetails.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="relative flex items-center p-3 sm:p-4 lg:p-5 w-full text-left rounded-2xl bg-gradient-to-r from-red-950/80 via-zinc-900/95 to-zinc-950 border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.35)] overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.9)]" />

                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mr-3.5 sm:mr-4 bg-red-600/30 text-red-400 border border-red-500/50 shadow-md shrink-0">
                    {activeModeDetails.icon}
                  </div>

                  <div className="flex-1 min-w-0 pr-3">
                    <h3 className="font-black italic uppercase text-base sm:text-lg lg:text-xl tracking-wide text-white drop-shadow">
                      {activeModeDetails.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-600 text-white shadow-lg shadow-red-900/60 shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 2. NEXT MODE PREVIEW SLOT (No top preview header text, no description) */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.button
                  key={nextModeDetails.id}
                  onClick={handleNextMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="relative flex items-center p-3 sm:p-4 w-full text-left rounded-xl bg-zinc-950/80 border border-white/10 blur-[2px] opacity-40 hover:blur-none hover:opacity-80 hover:scale-[0.99] transition-all duration-300 group cursor-pointer overflow-hidden"
                >
                  <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg mr-3 bg-white/5 text-zinc-400 group-hover:text-white transition-colors shrink-0">
                    {nextModeDetails.icon}
                  </div>

                  <div className="flex-1 min-w-0 pr-3">
                    <h4 className="font-bold italic uppercase text-sm sm:text-base tracking-wide text-zinc-300 group-hover:text-white transition-colors">
                      {nextModeDetails.title}
                    </h4>
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/10 group-hover:border-red-500 flex items-center justify-center text-zinc-400 group-hover:text-red-400 transition-colors shrink-0">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </motion.button>
              </AnimatePresence>
            </div>

          </div>

          {/* Up & Down Arrow Controls Column */}
          <div className="flex flex-col items-center justify-center gap-2.5 shrink-0 py-2 bg-black/50 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl border border-white/15 shadow-2xl self-center">
            <button
              onClick={handlePrevMode}
              title={language === 'tr' ? 'Önceki Mod' : 'Previous Mode'}
              className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-zinc-900 hover:bg-red-600 border border-white/20 hover:border-red-500 text-white flex items-center justify-center transition-all shadow-lg active:scale-95 group cursor-pointer"
            >
              <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform text-zinc-300 group-hover:text-white" />
            </button>

            <div className="flex flex-col items-center justify-center py-1.5 px-2 bg-zinc-950/80 rounded-lg border border-white/10">
              <span className="font-mono font-black text-sm sm:text-base text-red-500 drop-shadow">{currentIndex + 1}</span>
              <div className="w-4 h-px bg-white/20 my-0.5" />
              <span className="font-mono text-xs text-zinc-400">{MODES.length}</span>
            </div>

            <button
              onClick={handleNextMode}
              title={language === 'tr' ? 'Sıradaki Mod' : 'Next Mode'}
              className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-zinc-900 hover:bg-red-600 border border-white/20 hover:border-red-500 text-white flex items-center justify-center transition-all shadow-lg active:scale-95 group cursor-pointer"
            >
              <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform text-zinc-300 group-hover:text-white" />
            </button>
          </div>

        </div>
      </div>
    </RaceSetupLayout>
  );
};

const getModeDetails = (mode: ModeType, lang: Language) => {
  switch (mode) {
    case 'NORMAL':
      return {
        id: 'NORMAL',
        title: t('normalRace', lang),
        icon: <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />,
      };
    case 'RANDOM':
      return {
        id: 'RANDOM',
        title: t('randomCar', lang),
        icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
      };
    case 'GHOST':
      return {
        id: 'GHOST',
        title: t('ghostMode', lang),
        icon: <Ghost className="w-5 h-5 sm:w-6 sm:h-6" />,
      };
    case 'DRIFT':
      return {
        id: 'DRIFT',
        title: lang === 'tr' ? 'DRİFT MODU' : 'DRIFT MODE',
        icon: <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 fill-red-500" />,
      };
  }
};
