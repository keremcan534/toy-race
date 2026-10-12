import { useEffect, useState, useRef } from 'react';
import { useGameStore, Screen } from './store';
import { MainMenu } from './components/MainMenu';
import { Shop } from './components/Shop';
import { MyGarage } from './components/MyGarage';
import { RaceSelection } from './components/RaceSelection';
import { Settings } from './components/Settings';
import { Crates } from './components/Crates';
import { ModeSelection } from './components/ModeSelection';
import { Game } from './game/Game';
import { AnimatePresence, motion } from 'motion/react';
import { initBackNavigation, minimizeApp } from './platform';

const screenVariants = {
  initial: { opacity: 0, scale: 1.02 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 }
};

const screenTransition = {
  duration: 0.25,
  ease: "circOut"
} as const;

export default function App() {
  const currentScreen = useGameStore((state) => state.currentScreen);
  const [renderedScreen, setRenderedScreen] = useState<Screen>(currentScreen);
  const [loadingProgress, setLoadingProgress] = useState<number>(100);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const lastScreenRef = useRef<Screen>(currentScreen);

  // Android back button: open dialogs and screens handle it first (useBackHandler); otherwise
  // go back to the main menu, and from the main menu send the app to the background.
  useEffect(() => {
    initBackNavigation(() => {
      const { currentScreen: screen, setScreen } = useGameStore.getState();
      if (screen === 'MAIN_MENU') minimizeApp();
      else setScreen('MAIN_MENU');
    });
  }, []);

  useEffect(() => {
    if (currentScreen !== lastScreenRef.current) {
      const prevScreen = lastScreenRef.current;
      lastScreenRef.current = currentScreen;

      // Start loading transition
      setIsLoading(true);
      setLoadingProgress(0);

      let progress = 0;
      const interval = setInterval(() => {
        // Fast fill (approx 350-500ms total transition time)
        progress += Math.random() * 20 + 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setLoadingProgress(100);
          setRenderedScreen(currentScreen);

          // Short delay before fading out loading screen
          setTimeout(() => {
            setIsLoading(false);
          }, 120);
        } else {
          setLoadingProgress(progress);
        }
      }, 40);

      return () => clearInterval(interval);
    }
  }, [currentScreen]);

  return (
    <div className="fixed inset-0 w-full h-full h-[100dvh] overflow-hidden bg-zinc-950 text-white font-sans select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={renderedScreen}
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={screenTransition}
          className="w-full h-full"
        >
          {renderedScreen === 'MAIN_MENU' && <MainMenu />}
          {renderedScreen === 'SHOP' && <Shop />}
          {renderedScreen === 'MY_GARAGE' && <MyGarage />}
          {renderedScreen === 'RACE_SELECTION' && <RaceSelection />}
          {renderedScreen === 'MODE_SELECTION' && <ModeSelection />}
          {renderedScreen === 'SETTINGS' && <Settings />}
          {renderedScreen === 'CRATES' && <Crates />}
          {renderedScreen === 'GAME' && <Game />}
        </motion.div>
      </AnimatePresence>

      {/* Universal Loading Overlay with Neon Progress Bar */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950"
          >
            <div className="flex flex-col items-center max-w-xs w-full px-6 text-center">
              {/* Spinning stylized tire loader */}
              <div className="relative w-12 h-12 mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
                <div className="absolute inset-0 rounded-full border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent animate-spin duration-700" />
              </div>

              {/* Text */}
              <h2 className="text-xs font-black italic tracking-widest text-red-500 uppercase mb-2">
                {useGameStore.getState().language === 'tr' ? 'YÜKLENİYOR' : 'LOADING'}
              </h2>

              {/* Progress Bar Background */}
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden relative">
                {/* Progress fill */}
                <motion.div
                  style={{ width: `${loadingProgress}%` }}
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full"
                />
              </div>

              {/* Percentage */}
              <span className="font-mono text-[9px] text-zinc-500 font-bold mt-1.5">
                {Math.floor(loadingProgress)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
