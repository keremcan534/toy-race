import { useRef, useState, type CSSProperties, type MutableRefObject, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Ghost, Camera, Zap, Timer, Pause, Play, RotateCcw, Home } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { ScrapIcon } from '../components/UI/ScrapIcon';
import { CarName } from '../components/UI/CarName';
import { GameState } from './Physics2D';
import { audioManager } from './AudioManager';
import { Minimap } from './Minimap';
import { Speedometer } from './Speedometer';
import { useGameFrame } from './frameBus';
import { t } from '../i18n';
import { useGameStore } from '../store';

export type GamePhase = 'INTRO' | 'COUNTDOWN' | 'RACING' | 'WAITING' | 'RESULTS' | 'REWARDS';
export interface RaceRewards { xp?: number; gp: number; driftGp?: number; totalGp?: number }
type ControlKey = keyof GameState['controls'];

interface GameUIProps {
  gameState: GamePhase;
  countdown: number;
  rewards: RaceRewards | null;
  stateRef: MutableRefObject<GameState>;
  raceConfig: ReturnType<typeof useGameStore.getState>['raceConfig'];
  trackPath: { x: number; y: number }[];
  cameraMode: 'NEAR' | 'DEFAULT';
  setCameraMode: (mode: 'NEAR' | 'DEFAULT') => void;
  setControl: (key: ControlKey, val: boolean) => void;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onExit: () => void;
  onContinue: () => void;
  onRestartRace: () => void;
  driftTransferTimer?: number;
  accumulatedDriftScrap?: number;
  driftRemainingTime?: number;
}

// Keeps the HUD clear of notches and rounded corners when the app draws edge to edge.
const SAFE_AREA = {
  top: 'env(safe-area-inset-top, 0px)',
  right: 'env(safe-area-inset-right, 0px)',
  bottom: 'env(safe-area-inset-bottom, 0px)',
  left: 'env(safe-area-inset-left, 0px)',
};

const formatTime = (ms: number) => (Number.isFinite(ms) ? `${(ms / 1000).toFixed(2)}s` : 'DNF');

/** Lap counter text, updated from the race loop without re-rendering the HUD. */
const LapCounter = ({ stateRef }: { stateRef: MutableRefObject<GameState> }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const lastText = useRef('');
  useGameFrame(() => {
    const state = stateRef.current;
    const text = `${Math.min(state.lap, state.totalLaps)}/${state.totalLaps}`;
    if (text !== lastText.current && ref.current) {
      lastText.current = text;
      ref.current.textContent = text;
    }
  });
  const state = stateRef.current;
  return (
    <span ref={ref} className="text-xs sm:text-sm font-black text-white italic">
      {Math.min(state.lap, state.totalLaps)}/{state.totalLaps}
    </span>
  );
};

/** Live drift badge: re-renders at most every 100 ms, and only while something changes. */
const DriftBadge = ({ stateRef, isDriftMode }: { stateRef: MutableRefObject<GameState>; isDriftMode: boolean }) => {
  const [drift, setDrift] = useState<{ active: boolean; score: number }>({ active: false, score: 0 });
  const lastUpdate = useRef(0);
  useGameFrame(() => {
    const state = stateRef.current;
    const active = !!state.isDrifting;
    const score = state.driftScore || 0;
    const now = performance.now();
    if (active !== drift.active || (active && score !== drift.score && now - lastUpdate.current > 100)) {
      lastUpdate.current = now;
      setDrift({ active, score });
    }
  });
  if (!drift.active) return null;

  if (!isDriftMode) {
    // Non-drift modes: Tiny, plain and moved to the very top
    return (
      <div className="absolute top-2 sm:top-2.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="bg-zinc-950/85 border border-white/10 px-2 sm:px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-amber-400 uppercase">DRIFT</span>
          <div className="flex items-center gap-0.5 text-yellow-300 font-mono font-bold text-[10px] sm:text-[11px]">
            +{drift.score.toLocaleString('tr-TR')}
            <ScrapIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400" />
          </div>
        </div>
      </div>
    );
  }

  // Drift Mode: standard drift arena indicator
  return (
    <div className="absolute top-12 sm:top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
      <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black px-3.5 py-1 rounded-full border border-white/60 shadow-lg flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 fill-black" />
        <span className="font-black italic text-xs tracking-wider uppercase">DRIFT!</span>
        <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-full text-yellow-300 font-mono font-bold text-xs">
          +{drift.score.toLocaleString('tr-TR')}
          <ScrapIcon className="w-3.5 h-3.5 text-yellow-400" />
        </div>
      </div>
    </div>
  );
};

/**
 * A touch button that holds a control while any finger is on it. Pointer capture keeps the
 * press alive when the finger slides, and cancel/lost-capture (system gestures, alerts) always
 * release it, so a control can't get stuck "on".
 */
const HoldButton = ({ control, setControl, className, style, children, title }: {
  control: ControlKey;
  setControl: (key: ControlKey, val: boolean) => void;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
  title?: string;
}) => {
  const pointers = useRef(new Set<number>());
  const press = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    pointers.current.add(e.pointerId);
    setControl(control, true);
  };
  const release = (e: ReactPointerEvent<HTMLButtonElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) setControl(control, false);
  };
  return (
    <button
      type="button"
      title={title}
      className={className}
      style={{ touchAction: 'none', ...style }}
      onPointerDown={press}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
};

type NitroMode = 'active' | 'ready' | 'charging';

const NitroButton = ({ stateRef, setControl }: { stateRef: MutableRefObject<GameState>; setControl: (key: ControlKey, val: boolean) => void }) => {
  const [mode, setMode] = useState<NitroMode>('ready');
  useGameFrame(() => {
    const state = stateRef.current;
    const next: NitroMode = state.isNitroActive ? 'active' : (state.nitro || 0) > 50 ? 'ready' : 'charging';
    if (next !== mode) setMode(next);
  });
  return (
    <HoldButton
      control="nitro"
      setControl={setControl}
      title="Nitro Boost (Shift)"
      className={`w-14 sm:w-16 h-14 sm:h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-colors select-none active:scale-95 shadow-xl ${
        mode === 'active'
          ? 'bg-cyan-500/50 border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.8)] text-cyan-100 scale-105'
          : mode === 'ready'
            ? 'bg-gradient-to-t from-blue-900/70 to-cyan-600/50 border-cyan-400/70 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
            : 'bg-zinc-900/80 border-zinc-700/50 text-zinc-500 opacity-60'
      }`}
    >
      <Zap className={`w-5 h-5 sm:w-6 sm:h-6 ${mode === 'active' ? 'text-cyan-200 fill-cyan-200 animate-pulse' : 'text-cyan-400'}`} />
      <span className="font-black italic text-[9px] sm:text-[10px] tracking-wider leading-none mt-0.5">NITRO</span>
      <span className="text-[7px] text-cyan-300/80 font-mono hidden sm:inline leading-none">SHIFT</span>
    </HoldButton>
  );
};

export const GameUI = ({
  gameState,
  countdown,
  rewards,
  stateRef,
  raceConfig,
  trackPath,
  cameraMode,
  setCameraMode,
  setControl,
  isPaused,
  onPause,
  onResume,
  onExit,
  onContinue,
  onRestartRace,
  driftTransferTimer = 15,
  accumulatedDriftScrap = 0,
  driftRemainingTime = 120
}: GameUIProps) => {
  const language = useGameStore(s => s.language);
  const mobileButtonScale = useGameStore(s => s.mobileButtonScale) || 1.0;
  const isRacing = gameState === 'RACING' || gameState === 'WAITING';
  const showResults = gameState === 'RESULTS' || gameState === 'REWARDS';

  return (
    <>
      <div className="absolute z-20 pointer-events-none" style={SAFE_AREA}>
        {/* Top Left: Pause & Lap / Time Counter */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-2 sm:gap-4 pointer-events-auto">
          {showResults ? (
            <Button variant="secondary" size="sm" onClick={() => { audioManager.playUIClick(); onExit(); }} className="bg-zinc-950/85 border border-white/15 hover:border-red-500 text-xs py-1 px-2.5">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> {language === 'en' ? 'Exit Race' : 'Yarıştan Çık'}
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => { audioManager.playUIClick(); onPause(); }} className="bg-zinc-950/85 border border-white/15 hover:border-red-500 text-xs py-1 px-2.5" aria-label={t('paused', language)}>
              <Pause className="mr-1.5 h-3.5 w-3.5" /> {language === 'en' ? 'Pause' : 'Duraklat'}
            </Button>
          )}
          {isRacing && !raceConfig.isDriftMode && (
            <div className="flex gap-2">
              <div className="bg-zinc-950/85 border border-white/15 px-3 py-1 rounded-md flex items-center shadow-lg">
                <span className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest mr-1.5">{t('lap', language)}</span>
                <LapCounter stateRef={stateRef} />
              </div>
              {raceConfig.isGhostMode && (
                <div className="bg-purple-950/85 border border-purple-800/60 px-3 py-1 rounded-md flex items-center shadow-lg">
                  <Ghost className="h-3.5 w-3.5 text-purple-400 mr-1.5" />
                  <span className="text-[10px] sm:text-xs font-bold text-purple-200 uppercase tracking-widest">{t('ghostMode', language)}</span>
                </div>
              )}
            </div>
          )}
          {isRacing && raceConfig.isDriftMode && (
            <div className="bg-black/65 border border-white/20 px-3 py-1 rounded-lg flex items-center shadow-lg gap-2">
              <Timer className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold text-zinc-300 uppercase tracking-widest">
                {language === 'tr' ? 'SÜRE' : 'TIME'}:
              </span>
              <span className="text-xs sm:text-sm font-black font-mono text-amber-300 italic">
                {Math.floor(driftRemainingTime / 60)}:{(driftRemainingTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {/* DRIFT MODE SCRAP TRANSFER HUD */}
        {raceConfig.isDriftMode && isRacing && (
          <div className="absolute top-14 sm:top-16 left-3 sm:left-4 flex flex-col gap-1 bg-black/65 border border-white/20 px-3.5 py-2 rounded-xl shadow-2xl">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                {language === 'tr' ? 'BİRİKEN SCRAP' : 'ACCUMULATED SCRAP'}
              </span>
              <div className="flex items-center gap-0.5 text-yellow-400 font-mono font-bold text-xs">
                +{(accumulatedDriftScrap || 0).toLocaleString('tr-TR')}
                <ScrapIcon className="w-3.5 h-3.5 text-yellow-400" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] font-medium text-zinc-400">
                {language === 'tr' ? `${driftTransferTimer} sn içinde aktarılacak` : `Transfer in ${driftTransferTimer}s`}
              </span>
            </div>
          </div>
        )}

        {/* DRIFT ACTIVE BADGE & LIVE SCRAP REWARD */}
        {isRacing && <DriftBadge stateRef={stateRef} isDriftMode={!!raceConfig.isDriftMode} />}

        {/* Top Right: Camera Selector & Minimap */}
        {(isRacing || gameState === 'COUNTDOWN') && (
          <div className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 flex flex-col items-end gap-2 pointer-events-auto">
            {/* Camera Buttons */}
            <div className="flex items-center bg-zinc-950/85 border border-white/15 rounded-lg p-1 shadow-xl gap-1">
              <Camera className="w-3.5 h-3.5 text-zinc-400 ml-1.5 mr-0.5 hidden sm:inline" />
              <button
                onClick={() => { audioManager.playUIClick(); setCameraMode('NEAR'); }}
                className={`px-2 py-1 text-[10px] sm:text-xs font-black italic rounded transition-colors ${
                  cameraMode === 'NEAR'
                    ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                title="1: Near Camera"
              >
                1: {t('cameraNear', language)}
              </button>
              <button
                onClick={() => { audioManager.playUIClick(); setCameraMode('DEFAULT'); }}
                className={`px-2 py-1 text-[10px] sm:text-xs font-black italic rounded transition-colors ${
                  cameraMode === 'DEFAULT'
                    ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                title="2: Default Camera"
              >
                2: {t('cameraDefault', language)}
              </button>
            </div>

            {/* HUD Minimap (Hidden in Drift Mode per user request) */}
            {!raceConfig.isDriftMode && <Minimap stateRef={stateRef} trackPath={trackPath} />}
          </div>
        )}

        {/* Touch Screen Controls & Speedometer for Mobile / Race HUD */}
        {!showResults && (
          <>
            {/* Centered Dynamic Speedometer */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
              <Speedometer stateRef={stateRef} />
            </div>

            <div
              className="absolute bottom-4 left-4 flex gap-2 origin-bottom-left pointer-events-auto"
              style={{ transform: `scale(${mobileButtonScale})` }}
            >
              <HoldButton
                control="left"
                setControl={setControl}
                className="w-16 h-16 bg-white/15 rounded-full border-2 border-white/30 active:bg-white/30 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </HoldButton>
              <HoldButton
                control="right"
                setControl={setControl}
                className="w-16 h-16 bg-white/15 rounded-full border-2 border-white/30 active:bg-white/30 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white rotate-180" />
              </HoldButton>
            </div>

            <div
              className="absolute bottom-4 right-4 flex gap-2.5 items-end origin-bottom-right pointer-events-auto"
              style={{ transform: `scale(${mobileButtonScale})` }}
            >
              {/* Nitro Boost Button */}
              <NitroButton stateRef={stateRef} setControl={setControl} />

              <HoldButton
                control="backward"
                setControl={setControl}
                className="w-14 h-14 bg-red-500/25 rounded-xl border-2 border-red-500/50 active:bg-red-500/40 flex items-center justify-center transition-colors mb-0"
              >
                <span className="font-bold text-white text-[10px]">{language === 'en' ? 'BRAKE' : 'FREN'}</span>
              </HoldButton>
              <HoldButton
                control="forward"
                setControl={setControl}
                className="w-16 h-24 bg-green-500/25 rounded-xl border-2 border-green-500/50 active:bg-green-500/40 flex items-center justify-center transition-colors"
              >
                <span className="font-bold text-white text-xs">{language === 'en' ? 'GAS' : 'GAZ'}</span>
              </HoldButton>
            </div>
          </>
        )}
      </div>

      {/* Countdown Overlay */}
      <AnimatePresence>
        {gameState === 'COUNTDOWN' && !isPaused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2 }}
            key={countdown}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <span className="text-9xl font-black text-white drop-shadow-[0_0_20px_rgba(255,0,0,0.8)] italic">
              {countdown > 0 ? countdown : (language === 'en' ? 'GO!' : 'BAŞLA!')}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause Menu */}
      {isPaused && !showResults && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-xl max-w-xs w-full flex flex-col items-center gap-3 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-black italic text-white uppercase tracking-wider mb-1">
              {t('paused', language)}
            </h2>
            <Button
              size="md"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black italic py-2 sm:py-3 text-sm"
              onClick={() => { audioManager.playUIClick(); onResume(); }}
            >
              <Play className="mr-2 h-4 w-4 fill-white" /> {t('resume', language)}
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full border-zinc-700 text-zinc-200 font-bold italic py-2 text-sm"
              onClick={() => { audioManager.playUIClick(); onRestartRace(); }}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> {t('restart', language)}
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full border-zinc-700 text-zinc-300 font-bold italic py-2 text-sm"
              onClick={() => { audioManager.playUIClick(); onExit(); }}
            >
              <Home className="mr-2 h-4 w-4" /> {t('quitToMenu', language)}
            </Button>
          </div>
        </div>
      )}

      {/* Results Overlay - Responsive for Mobile Landscape */}
      <AnimatePresence>
        {gameState === 'RESULTS' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/85 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto"
          >
            <div className="bg-zinc-900 border border-zinc-800 p-3 sm:p-6 md:p-8 rounded-xl max-w-lg w-full flex flex-col items-center max-h-[96vh] my-auto overflow-hidden shadow-2xl">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-2 sm:mb-4 uppercase tracking-wider shrink-0">
                {language === 'en' ? 'RACE RESULTS' : 'YARIŞ SONUÇLARI'}
              </h2>

              <div className="w-full flex flex-col gap-1.5 sm:gap-2 mb-3 sm:mb-6 overflow-y-auto pr-1 flex-1 min-h-0">
                {stateRef.current.finishOrder.map((result, idx) => {
                  const isPlayer = result.id === 'player';
                  return (
                    <div
                      key={result.id}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border ${
                        isPlayer
                          ? 'bg-red-600/20 border-red-500/50'
                          : 'bg-zinc-800/40 border-zinc-700/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className={`font-black italic text-sm sm:text-lg ${
                          idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-zinc-300' : idx === 2 ? 'text-amber-600' : 'text-zinc-500'
                        }`}>
                          #{idx + 1}
                        </span>
                        <div>
                          <div className={`font-bold text-xs sm:text-base ${isPlayer ? 'text-white' : 'text-zinc-300'}`}>
                            {result.name}
                          </div>
                          <div className="text-[10px] sm:text-xs text-zinc-400">
                            <CarName name={result.carName} />
                          </div>
                        </div>
                      </div>

                      <div className="font-mono text-xs sm:text-sm font-bold text-zinc-300">
                        {formatTime(result.time)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                size="md"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black italic shrink-0 py-2 sm:py-3 text-xs sm:text-base"
                onClick={() => {
                  audioManager.playUIClick();
                  onContinue();
                }}
              >
                {language === 'en' ? 'CONTINUE' : 'DEVAM ET'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rewards Overlay - Responsive for Mobile Landscape */}
      <AnimatePresence>
        {gameState === 'REWARDS' && rewards && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/85 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto"
          >
            <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-6 md:p-8 rounded-xl max-w-sm w-full flex flex-col items-center text-center max-h-[96vh] my-auto overflow-hidden shadow-2xl">
              <h2 className="text-lg sm:text-2xl font-black italic text-white mb-1 sm:mb-2 uppercase shrink-0">
                {t('rewardsEarned', language)}
              </h2>
              <div className="h-0.5 w-12 sm:w-16 bg-red-600 mb-3 sm:mb-6 shrink-0" />

              <div className="w-full flex flex-col gap-2 sm:gap-2.5 mb-3 sm:mb-5 flex-1 min-h-0 overflow-y-auto">
                {/* Race Reward */}
                <div className="bg-zinc-800/60 border border-zinc-700/60 p-2.5 sm:p-3.5 rounded-xl flex items-center justify-between shadow-md">
                  <div className="flex flex-col text-left">
                    <span className="text-zinc-400 font-bold uppercase text-[10px] sm:text-xs tracking-wider">
                      {language === 'tr' ? 'YARIŞ ÖDÜLÜ' : 'RACE REWARD'}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-medium">
                      {language === 'tr' ? 'Sıralama ve zaman bonusu' : 'Position & lap bonus'}
                    </span>
                  </div>
                  <span className="text-base sm:text-xl font-black italic text-yellow-400 flex items-center gap-1.5 font-mono">
                    +{rewards.gp.toLocaleString('tr-TR')} <ScrapIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </div>

                {/* Drift Reward */}
                <div className="bg-zinc-800/60 border border-zinc-700/60 p-2.5 sm:p-3.5 rounded-xl flex items-center justify-between shadow-md">
                  <div className="flex flex-col text-left">
                    <span className="text-amber-400 font-bold uppercase text-[10px] sm:text-xs tracking-wider flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {language === 'tr' ? 'DRİFT ÖDÜLÜ' : 'DRIFT REWARD'}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-medium">
                      {language === 'tr' ? 'Driftlerden kazanılan hurda' : 'Scrap earned from drifts'}
                    </span>
                  </div>
                  <span className="text-base sm:text-xl font-black italic text-amber-400 flex items-center gap-1.5 font-mono">
                    +{(rewards.driftGp || 0).toLocaleString('tr-TR')} <ScrapIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 w-full shrink-0">
                <Button
                  variant="outline"
                  className="flex-1 border-zinc-700 text-zinc-300 py-1.5 sm:py-2 text-xs sm:text-sm"
                  onClick={() => {
                    audioManager.playUIClick();
                    onExit();
                  }}
                >
                  {t('backToMenu', language)}
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold italic py-1.5 sm:py-2 text-xs sm:text-sm"
                  onClick={() => {
                    audioManager.playUIClick();
                    onRestartRace();
                  }}
                >
                  {t('playAgain', language)}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
