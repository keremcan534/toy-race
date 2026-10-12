import { useCallback, useEffect, useRef, useState } from 'react';
import { useGameStore, INITIAL_CARS, Car, maxOutCar } from '../store';
import { GameState, updatePhysics, TRACKS, AICar, TRANSFORMATION_ZONES } from './Physics2D';
import { lerp } from './PhysicsUtils';
import { renderGame, resetRenderer, resetRaceVisuals, prewarmCarSprites } from './Renderer2D';
import { audioManager } from './AudioManager';
import { generateScenery } from './Scenery';
import { GameUI, GamePhase, RaceRewards } from './GameUI';
import { emitGameFrame } from './frameBus';
import { ghostKey, loadGhost, saveGhost, bestGhostTime } from './ghosts';
import { useBackHandler } from '../platform';

type RaceConfig = ReturnType<typeof useGameStore.getState>['raceConfig'];
type ControlKey = keyof GameState['controls'];

const DRIFT_ARENA = { id: 'track-drift-arena', color: '#ef4444', isNight: true };
const DRIFT_SESSION_SECONDS = 120;
const DRIFT_TRANSFER_SECONDS = 15;
const INTRO_SECONDS = 2.5;

const KEY_CONTROLS: Record<string, ControlKey> = {
  w: 'forward', arrowup: 'forward',
  s: 'backward', arrowdown: 'backward',
  a: 'left', arrowleft: 'left',
  d: 'right', arrowright: 'right',
  ' ': 'brake',
  shift: 'nitro',
};

interface RaceSetup {
  raceConfig: RaceConfig;
  selectedCar: Car;
  track: { id: string; color: string; isNight?: boolean };
  trackPath: { x: number; y: number }[];
  ghostKey: string;
  startAngle: number;
  playerStart: { x: number; y: number; angle: number };
}

/** Everything a race needs from the store, read once when the race screen opens. */
function createRaceSetup(): RaceSetup {
  const s = useGameStore.getState();
  const raceConfig = s.raceConfig;
  // The shop selects cars only to preview them; never race one the player doesn't own.
  const selected = s.cars.find(c => c.id === s.selectedCarId);
  const selectedCar = selected && selected.owned ? selected : (s.cars.find(c => c.owned) || s.cars[0]);
  const track = raceConfig.isDriftMode ? DRIFT_ARENA : (s.tracks.find(t => t.id === s.selectedTrackId) || s.tracks[0]);
  const trackPath = TRACKS[track.id] || TRACKS['track-1'];

  const startNode = trackPath[0];
  const nextNode = trackPath[1];
  const startAngle = raceConfig.isDriftMode ? 0 : Math.atan2(nextNode.y - startNode.y, nextNode.x - startNode.x);
  const perpX = -Math.sin(startAngle);
  const perpY = Math.cos(startAngle);
  const playerStart = raceConfig.isDriftMode
    ? { x: 600 + 450, y: 600, angle: Math.PI / 2 }
    : {
        x: startNode.x + perpX * 20 - Math.cos(startAngle) * 20,
        y: startNode.y + perpY * 20 - Math.sin(startAngle) * 20,
        angle: startAngle,
      };

  return { raceConfig, selectedCar, track, trackPath, ghostKey: ghostKey(track.id, raceConfig.laps), startAngle, playerStart };
}

/** A fresh race: used when the screen opens and again for every restart. */
function createRaceState(setup: RaceSetup, cameraZoom: number): GameState {
  const { raceConfig, trackPath, startAngle, playerStart } = setup;
  const startNode = trackPath[0];
  const perpX = -Math.sin(startAngle);
  const perpY = Math.cos(startAngle);
  const hardAi = raceConfig.difficulty === 'Zor' || raceConfig.difficulty === 'Çok Zor';

  const numAICars = raceConfig.isGhostMode ? 0 : (raceConfig.aiCount || 1);
  const aiCars: AICar[] = [];
  for (let i = 0; i < numAICars; i++) {
    // Starting grid: 2 cars per row behind the player
    const row = Math.floor(i / 2) + 1;
    const side = (i % 2 === 0 ? 1 : -1);
    // Exclude Prega (index 0) and pick from faster cars on high difficulty
    const index = hardAi
      ? 1 + Math.floor(Math.random() * (INITIAL_CARS.length - 1))
      : Math.floor(Math.random() * INITIAL_CARS.length);
    const carStats = (raceConfig.isRandomMode || hardAi) ? maxOutCar(INITIAL_CARS[index]) : { ...INITIAL_CARS[index] };

    let x: number, y: number, angle: number;
    if (raceConfig.isDriftMode) {
      const a = (i + 1) * (Math.PI * 2 / (numAICars + 1));
      const dist = 380 + Math.random() * 260;
      x = 600 + Math.cos(a) * dist;
      y = 600 + Math.sin(a) * dist;
      angle = a + Math.PI / 2 + (Math.random() - 0.5) * 0.5;
    } else {
      x = startNode.x + perpX * (side * 30) - Math.cos(startAngle) * (row * 60 + 20);
      y = startNode.y + perpY * (side * 30) - Math.sin(startAngle) * (row * 60 + 20);
      angle = startAngle;
    }

    aiCars.push({
      id: `ai-${i + 1}`,
      name: `Rival ${i + 1}`,
      x, y, angle,
      velocity: { x: 0, y: 0 },
      angularVelocity: 0,
      carStats,
      targetIndex: 1,
      lap: 1,
      finished: false,
      burnoutTime: 0,
      burnoutCooldown: 0,
      blinkTime: 0,
      lastZoneIndex: -1,
      currentGear: 1,
      driverFocus: (raceConfig.difficulty === 'Çok Zor' ? 1.15 :
                    raceConfig.difficulty === 'Zor' ? 1.05 :
                    raceConfig.difficulty === 'Orta' ? 0.95 : 0.85) + Math.random() * 0.15, // Higher focus on higher difficulty
      nitro: 100,
      isNitroActive: false,
      nitroCooldown: 10 + Math.random() * 15,
      nitroDuration: 0
    });
  }

  const ghost = raceConfig.isGhostMode ? loadGhost(setup.ghostKey) : undefined;
  const playerCar = raceConfig.isRandomMode
    ? maxOutCar(INITIAL_CARS[Math.floor(Math.random() * INITIAL_CARS.length)])
    : { ...setup.selectedCar };

  return {
    car: {
      x: playerStart.x,
      y: playerStart.y,
      angle: playerStart.angle,
      velocity: { x: 0, y: 0 },
      angularVelocity: 0,
      carStats: playerCar,
      lastZoneIndex: -1
    },
    camera: { x: playerStart.x, y: playerStart.y, zoom: cameraZoom },
    aiCars,
    ghostCar: ghost && ghost.length > 0 ? {
      x: ghost[0].x,
      y: ghost[0].y,
      angle: ghost[0].angle,
      carStats: { ...setup.selectedCar },
      finished: false,
      lap: 1
    } : undefined,
    currentGhostData: [],
    replayGhostData: ghost,
    controls: { forward: false, backward: false, left: false, right: false, brake: false, nitro: false },
    controlValues: { throttle: 0, brake: 0, steering: 0 },
    nitro: 100,
    isNitroActive: false,
    particles: [],
    skidMarks: [],
    scenery: generateScenery(trackPath, 2000, 2000, setup.track.id),
    lap: 1,
    totalLaps: raceConfig.isDriftMode ? 9999 : raceConfig.laps,
    checkpointsPassed: 0,
    finished: false,
    isRandomMode: raceConfig.isRandomMode,
    transformationZones: TRANSFORMATION_ZONES[setup.track.id] || TRANSFORMATION_ZONES['track-1'] || [],
    trackId: setup.track.id,
    startTime: null,
    raceTime: 0,
    finishTime: null,
    burnoutTime: 0,
    burnoutCooldown: 0,
    blinkTime: 0,
    finishOrder: []
  };
}

const createRaceCounters = (state: GameState) => ({
  introElapsed: 0,
  driftTimeRemaining: DRIFT_SESSION_SECONDS,
  driftTransferTimer: DRIFT_TRANSFER_SECONDS,
  driftAccumulated: 0,  // drift mode: earned, waiting for the next 15 s transfer
  pendingDriftScrap: 0, // other modes: earned, added to the balance when the race ends
  raceDriftScrap: 0,    // everything drifted this race (shown on the rewards screen)
  shownDriftSeconds: DRIFT_SESSION_SECONDS,
  shownTransferSeconds: DRIFT_TRANSFER_SECONDS,
  lastIsElectric: !!state.car.carStats.isElectric,
  resultsHandled: false,
  blurOpacity: 0,
  lapText: '',
});

export const Game = () => {
  const setScreen = useGameStore(s => s.setScreen);

  const setupRef = useRef<RaceSetup | null>(null);
  if (!setupRef.current) setupRef.current = createRaceSetup();
  const setup = setupRef.current;
  const { raceConfig, track, trackPath } = setup;
  const isNight = !!raceConfig.isDriftMode || !!track.isNight || track.id === 'track-night';

  const stateRef = useRef<GameState>(null!);
  if (!stateRef.current) stateRef.current = createRaceState(setup, 1.0);
  const countersRef = useRef<ReturnType<typeof createRaceCounters>>(null!);
  if (!countersRef.current) countersRef.current = createRaceCounters(stateRef.current);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const speedBlurRef = useRef<HTMLDivElement>(null);
  const cameraZoomRef = useRef<number>(1.0);
  const targetZoomRef = useRef<number>(1.0);

  const [gameState, setGameStateValue] = useState<GamePhase>('INTRO');
  const phaseRef = useRef<GamePhase>('INTRO');
  const setPhase = useCallback((phase: GamePhase) => {
    phaseRef.current = phase;
    setGameStateValue(phase);
  }, []);
  const [isPaused, setIsPaused] = useState(false);
  const pausedRef = useRef(false);
  const [isExiting, setIsExiting] = useState(false);
  const [cameraMode, setCameraMode] = useState<'NEAR' | 'DEFAULT'>('DEFAULT');
  const [countdown, setCountdown] = useState(3);
  const [rewards, setRewards] = useState<RaceRewards | null>(null);
  const [driftTransferTimer, setDriftTransferTimer] = useState<number>(DRIFT_TRANSFER_SECONDS);
  const [accumulatedDriftScrap, setAccumulatedDriftScrap] = useState<number>(0);
  const [driftRemainingTime, setDriftRemainingTime] = useState<number>(DRIFT_SESSION_SECONDS);

  // Camera Zoom Targets
  const handleSetCameraMode = useCallback((mode: 'NEAR' | 'DEFAULT') => {
    setCameraMode(mode);
    targetZoomRef.current = mode === 'NEAR' ? 1.35 : 1.0;
  }, []);

  const releaseControls = useCallback(() => {
    const controls = stateRef.current.controls;
    (Object.keys(controls) as ControlKey[]).forEach(key => { controls[key] = false; });
  }, []);

  const setControl = useCallback((key: ControlKey, val: boolean) => {
    if (pausedRef.current && val) return;
    stateRef.current.controls[key] = val;
  }, []);

  // Drift scrap from normal races is banked when the race ends (or is left), not every frame:
  // each balance change is a store update and a save.
  const commitPendingDriftScrap = useCallback(() => {
    const counters = countersRef.current;
    if (counters.pendingDriftScrap > 0) {
      useGameStore.getState().addGp(counters.pendingDriftScrap);
      counters.pendingDriftScrap = 0;
    }
  }, []);

  const transferDriftScrap = useCallback(() => {
    const counters = countersRef.current;
    if (counters.driftAccumulated > 0) {
      const { addGp, recordDriftScrap } = useGameStore.getState();
      addGp(counters.driftAccumulated);
      recordDriftScrap(counters.driftAccumulated);
      counters.driftAccumulated = 0;
      setAccumulatedDriftScrap(0);
    }
  }, []);

  const pause = useCallback(() => {
    const phase = phaseRef.current;
    if (pausedRef.current || phase === 'RESULTS' || phase === 'REWARDS') return;
    pausedRef.current = true;
    setIsPaused(true);
    releaseControls();
    audioManager.stopLoops();
  }, [releaseControls]);

  const resume = useCallback(() => {
    if (!pausedRef.current) return;
    pausedRef.current = false;
    setIsPaused(false);
    const phase = phaseRef.current;
    if (phase === 'RACING' || phase === 'WAITING') {
      audioManager.startEngine(!!stateRef.current.car.carStats.isElectric);
    }
  }, []);

  // Race rewards are granted the moment the race ends, so leaving from the results screen keeps them.
  const grantRewards = useCallback(() => {
    const state = stateRef.current;
    const counters = countersRef.current;
    const { addGp, recordRaceFinish } = useGameStore.getState();

    const playerRank = state.finishOrder.findIndex(f => f.id === 'player') + 1;
    const playerFinishInfo = state.finishOrder[playerRank - 1];
    const totalCars = 1 + state.aiCars.length + (state.ghostCar ? 1 : 0);

    recordRaceFinish(playerRank, !raceConfig.isDriftMode && !raceConfig.isGhostMode);

    // Time taken in seconds
    const timeTaken = playerFinishInfo ? playerFinishInfo.time / 1000 : 0;
    const laps = raceConfig.isDriftMode ? 2 : state.totalLaps;

    // --- GP CALCULATION ---
    // Base GP per lap (reward for just participating)
    const baseGpPerLap = 18000;
    const baseGp = laps * baseGpPerLap;

    // Rank Multiplier (1st gets 3x, 2nd gets 2.2x, 3rd gets 1.6x, others get less)
    let rankMultiplier = 1.0;
    if (playerRank === 1) rankMultiplier = 3.0;
    else if (playerRank === 2) rankMultiplier = 2.2;
    else if (playerRank === 3) rankMultiplier = 1.6;
    else rankMultiplier = Math.max(0.7, (totalCars - playerRank + 1) / totalCars);

    // Time Performance Bonus
    // Assume a "good" lap is 40 seconds. Bonus for being faster, penalty for being slower.
    const targetTime = laps * 40;
    const timeDiff = targetTime - timeTaken;
    const timeBonus = timeDiff * 500; // 500 GP per second saved

    // Calculate total GP
    let gpReward = Math.floor((baseGp * rankMultiplier) + timeBonus);

    // Reduce rewards in Random Car mode
    if (raceConfig.isRandomMode) {
      gpReward = Math.floor(gpReward * 0.7);
    }

    // Ensure it doesn't drop below a minimum participation reward (e.g., 4000 per lap)
    gpReward = Math.max(gpReward, 4000 * laps);

    // Add some randomness (±5%)
    gpReward = Math.floor(gpReward * (0.95 + Math.random() * 0.1));

    // Bank the drift scrap that hasn't been added yet
    transferDriftScrap();
    commitPendingDriftScrap();
    const driftReward = counters.raceDriftScrap;

    addGp(gpReward);
    setRewards({ gp: gpReward, driftGp: driftReward, totalGp: gpReward + driftReward });
  }, [raceConfig, transferDriftScrap, commitPendingDriftScrap]);

  const finishRace = useCallback(() => {
    const state = stateRef.current;
    const counters = countersRef.current;
    if (counters.resultsHandled) return;
    counters.resultsHandled = true;

    // Add remaining cars to finishOrder
    const remainingCars: { id: string, name: string, carName: string, time: number, progress: number }[] = [];
    state.aiCars.forEach(ai => {
      if (!ai.finished) {
        remainingCars.push({
          id: ai.id,
          name: ai.name || 'Rival',
          carName: ai.carStats.name,
          time: Infinity,
          progress: ai.lap * trackPath.length + ai.targetIndex
        });
      }
    });
    if (state.ghostCar && !state.ghostCar.finished) {
      remainingCars.push({
        id: 'ghost',
        name: 'Ghost',
        carName: state.ghostCar.carStats.name,
        time: Infinity,
        progress: 0 // Ghost progress is hard to track, put at the end
      });
    }
    // Sort remaining cars by progress (descending)
    remainingCars.sort((a, b) => b.progress - a.progress);
    remainingCars.forEach(car => {
      if (!state.finishOrder.find(f => f.id === car.id)) {
        state.finishOrder.push({ id: car.id, name: car.name, carName: car.carName, time: car.time });
      }
    });

    grantRewards();
    setPhase('RESULTS');
    audioManager.stopAll();
    audioManager.playRaceFinishSound();
  }, [grantRewards, setPhase, trackPath]);

  // One simulation + render step. Reads everything through refs, so the loop never goes stale.
  const step = (dt: number) => {
    const state = stateRef.current;
    const counters = countersRef.current;
    const phase = phaseRef.current;

    // Update Camera Zoom smoothly
    cameraZoomRef.current = lerp(cameraZoomRef.current, targetZoomRef.current, Math.min(dt * 6, 1));

    if (phase === 'INTRO') {
      counters.introElapsed += dt;
      const progress = Math.min(counters.introElapsed / INTRO_SECONDS, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      const startCamX = state.car.x + (Math.cos(setup.startAngle) * -400);
      const startCamY = state.car.y + (Math.sin(setup.startAngle) * -400);
      state.camera.x = lerp(startCamX, state.car.x, ease);
      state.camera.y = lerp(startCamY, state.car.y, ease);
      state.camera.zoom = lerp(0.6, cameraZoomRef.current, ease);

      if (progress >= 1) {
        setPhase('COUNTDOWN');
        setCountdown(3);
      }
    } else if (phase === 'COUNTDOWN') {
      state.camera.zoom = cameraZoomRef.current;
    } else if (phase === 'RACING' || phase === 'WAITING') {
      state.camera.zoom = cameraZoomRef.current;
      const speed = Math.hypot(state.car.velocity.x, state.car.velocity.y);

      // Engine Sound & Gear Shifting
      const currentCarStats = state.car.carStats;
      const isElectric = !!currentCarStats.isElectric;
      const maxSpeed = 160 + (currentCarStats.maxSpeed * 2);

      // Handle car transformation sound change
      if (isElectric !== counters.lastIsElectric) {
        audioManager.startEngine(isElectric);
        counters.lastIsElectric = isElectric;
      }

      let rpm = 0;
      let currentGear = 1;
      if (isElectric) {
        rpm = Math.min(speed / maxSpeed, 1);
      } else {
        const numGears = 6;
        const speedPerGear = maxSpeed / numGears;
        currentGear = Math.max(1, Math.min(numGears, Math.ceil(speed / speedPerGear)));
        // Calculate RPM (0.3 to 1.0) within the current gear to simulate revving
        const speedInGear = Math.max(0, speed - ((currentGear - 1) * speedPerGear));
        rpm = Math.min(1.0, 0.3 + (0.7 * (speedInGear / speedPerGear)));
        if (speed < 5) rpm = (speed / 5) * 0.3; // Smooth idle transition
      }
      audioManager.updateEngine(rpm, isElectric, currentGear);

      // Tire Squeal Sound (Drifting & Burnout)
      const cos = Math.cos(state.car.angle);
      const sin = Math.sin(state.car.angle);
      const rightVelocity = state.car.velocity.x * -sin + state.car.velocity.y * cos;
      if (state.burnoutTime > 0) {
        audioManager.startTireSqueal(1.0);
      } else if (Math.abs(rightVelocity) > 40 && speed > 50 && !state.finished) {
        audioManager.startTireSqueal(Math.min((Math.abs(rightVelocity) - 40) / 40, 1.0));
      } else {
        audioManager.stopTireSqueal();
      }

      // Brake Sound
      if (state.controlValues.brake > 0.1 && speed > 50) {
        audioManager.startBrake();
      } else {
        audioManager.stopBrake();
      }

      updatePhysics(state, trackPath, dt, raceConfig.difficulty, (isOffRoad) => {
        if (isOffRoad) audioManager.startOffRoad();
        else audioManager.stopOffRoad();
      }, (type) => {
        if (type === 'cone') audioManager.playConeHit();
      });

      const earned = state.driftScrapEarned || 0;
      state.driftScrapEarned = 0;
      counters.raceDriftScrap += earned;

      if (raceConfig.isDriftMode) {
        // Drift Mode 2-minute time limit (120 seconds countdown)
        counters.driftTimeRemaining -= dt;
        const remainingSecs = Math.max(0, Math.ceil(counters.driftTimeRemaining));
        if (remainingSecs !== counters.shownDriftSeconds) {
          counters.shownDriftSeconds = remainingSecs;
          setDriftRemainingTime(remainingSecs);
        }

        if (earned > 0) {
          counters.driftAccumulated += earned;
          setAccumulatedDriftScrap(counters.driftAccumulated);
        }

        if (counters.driftTimeRemaining <= 0 && !state.finished) {
          state.finished = true;
          state.finishTime = state.raceTime;
          transferDriftScrap();
          if (!state.finishOrder.find(f => f.id === 'player')) {
            state.finishOrder.push({
              id: 'player',
              name: 'You',
              carName: state.car.carStats.name,
              time: DRIFT_SESSION_SECONDS * 1000
            });
          }
        }

        // Award Scrap gained from drifting once every 15s
        counters.driftTransferTimer -= dt;
        const displaySecs = Math.max(0, Math.ceil(counters.driftTransferTimer));
        if (displaySecs !== counters.shownTransferSeconds) {
          counters.shownTransferSeconds = displaySecs;
          setDriftTransferTimer(displaySecs);
        }
        if (counters.driftTransferTimer <= 0) {
          if (counters.driftAccumulated > 0) {
            transferDriftScrap();
            // Reset visual score so they can start fresh
            state.driftScore = 0;
          }
          counters.driftTransferTimer = DRIFT_TRANSFER_SECONDS;
        }
      } else {
        counters.pendingDriftScrap += earned;
      }

      // Check for state transitions
      if (phaseRef.current === 'RACING' && state.finished) {
        setPhase('WAITING');
        // Save the ghost if this run beat the stored one for this track and lap count
        const playerResult = state.finishOrder.find(f => f.id === 'player');
        if (!raceConfig.isDriftMode && playerResult && state.currentGhostData.length > 1) {
          const previousBest = bestGhostTime(setup.ghostKey) ?? Infinity;
          if (playerResult.time < previousBest) saveGhost(setup.ghostKey, state.currentGhostData);
        }
      }

      if (phaseRef.current === 'WAITING') {
        const totalCars = 1 + state.aiCars.length + (state.ghostCar ? 1 : 0);
        // Force finish if the player has finished and some time has passed
        const timeSincePlayerFinished = state.raceTime - (state.finishTime ?? state.raceTime);
        const timeoutMs = raceConfig.isDriftMode ? 1200 : 5000;
        if (state.finishOrder.length >= totalCars || timeSincePlayerFinished > timeoutMs) {
          finishRace();
        }
      }

      // Update Nitro Sound
      if (state.isNitroActive && phaseRef.current === 'RACING') {
        audioManager.startNitroSound();
      } else {
        audioManager.stopNitroSound();
      }
    }

    // Render
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (ctx && canvas) {
      renderGame(ctx, state, state.car.carStats, canvas.width, canvas.height, trackPath, track.color, track.id, isNight);
    }

    // Dynamic side speed blur overlay
    if (speedBlurRef.current) {
      const curSpeed = Math.hypot(state.car.velocity.x, state.car.velocity.y);
      const blurAlpha = curSpeed > 40 ? Math.min(1, (curSpeed - 40) / 140) : 0;
      if (Math.abs(blurAlpha - counters.blurOpacity) > 0.01 || (blurAlpha === 0 && counters.blurOpacity !== 0)) {
        counters.blurOpacity = blurAlpha;
        speedBlurRef.current.style.opacity = blurAlpha.toFixed(2);
      }
    }

    emitGameFrame();
  };
  const stepRef = useRef(step);
  stepRef.current = step;

  // Game loop: stops while paused, while leaving, and once the results are up (the canvas keeps the last frame).
  const loopActive = !isPaused && !isExiting && gameState !== 'RESULTS' && gameState !== 'REWARDS';
  useEffect(() => {
    if (!loopActive) return;
    let rafId = 0;
    let lastTime: number | null = null;
    const frame = (time: number) => {
      rafId = requestAnimationFrame(frame);
      // 120 Hz screens: render every other frame. Physics is time-based, so this only saves battery.
      if (lastTime !== null && time - lastTime < 10) return;
      const dt = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      stepRef.current(dt);
    };
    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [loopActive]);

  // Countdown
  useEffect(() => {
    if (gameState !== 'COUNTDOWN' || isPaused || isExiting) return;

    if (countdown > 0) {
      audioManager.playStartingSound();
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    audioManager.playStartRaceSound();
    stateRef.current.startTime = 0;
    setPhase('RACING');
    const isElectric = !!stateRef.current.car.carStats.isElectric;
    countersRef.current.lastIsElectric = isElectric;
    audioManager.startEngine(isElectric);
  }, [countdown, gameState, isPaused, isExiting, setPhase]);

  // Canvas setup, resize, and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // The ground covers the whole canvas every frame, so it can be opaque (cheaper to composite).
    ctxRef.current = canvas.getContext('2d', { alpha: false });
    prewarmCarSprites([stateRef.current.car.carStats, ...stateRef.current.aiCars.map(ai => ai.carStats)], isNight);
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isNight]);

  // Development builds only: lets a browser console (or a test script) inspect and drive the race.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const w = window as unknown as { __race?: unknown };
    w.__race = { stateRef, phaseRef, pausedRef, setup };
    return () => { delete w.__race; };
  }, [setup]);

  useEffect(() => {
    return () => {
      // Leaving mid-race keeps the drift scrap earned so far (as before, when it was added live).
      commitPendingDriftScrap();
      audioManager.stopAll();
      resetRenderer();
    };
  }, [commitPendingDriftScrap]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const control = KEY_CONTROLS[e.key.toLowerCase()];
      if (control) {
        e.preventDefault(); // keep Space/arrows from scrolling or pressing a focused button
        if (!pausedRef.current) stateRef.current.controls[control] = true;
        return;
      }
      if (e.repeat) return;
      switch (e.key.toLowerCase()) {
        case '1': handleSetCameraMode('NEAR'); audioManager.playUIClick(); break;
        case '2': handleSetCameraMode('DEFAULT'); audioManager.playUIClick(); break;
        case 'p': if (pausedRef.current) resume(); else pause(); break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const control = KEY_CONTROLS[e.key.toLowerCase()];
      if (control) {
        e.preventDefault();
        stateRef.current.controls[control] = false;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', releaseControls);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', releaseControls);
    };
  }, [handleSetCameraMode, pause, resume, releaseControls]);

  // Pause when the app goes to the background (home button, incoming call, screen off)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) pause();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [pause]);

  const exitToMenu = useCallback(() => {
    // Freeze the race now; the screen transition takes a moment and the engine shouldn't keep running.
    setIsExiting(true);
    releaseControls();
    audioManager.stopAll();
    setScreen('MAIN_MENU');
  }, [releaseControls, setScreen]);

  // Android back: pause / resume during the race, leave from the results screens
  useBackHandler(() => {
    const phase = phaseRef.current;
    if (phase === 'RESULTS' || phase === 'REWARDS') exitToMenu();
    else if (pausedRef.current) resume();
    else pause();
  });

  const handleRestartRace = useCallback(() => {
    commitPendingDriftScrap();
    audioManager.stopAll();
    resetRaceVisuals();
    stateRef.current = createRaceState(setup, cameraZoomRef.current);
    countersRef.current = createRaceCounters(stateRef.current);
    prewarmCarSprites([stateRef.current.car.carStats, ...stateRef.current.aiCars.map(ai => ai.carStats)], isNight);
    pausedRef.current = false;
    setIsPaused(false);
    setRewards(null);
    setAccumulatedDriftScrap(0);
    setDriftRemainingTime(DRIFT_SESSION_SECONDS);
    setDriftTransferTimer(DRIFT_TRANSFER_SECONDS);
    setCountdown(3);
    setPhase('COUNTDOWN');
  }, [commitPendingDriftScrap, isNight, setPhase, setup]);

  return (
    <div className="w-full h-full relative bg-zinc-900 overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Dynamic Speed Side Blur & Glow Overlay */}
      <div
        ref={speedBlurRef}
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-0"
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-[20vw] max-w-[340px] bg-gradient-to-r from-black/25 to-transparent pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0) 100%)',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-[20vw] max-w-[340px] bg-gradient-to-l from-black/25 to-transparent pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0) 100%)',
          }}
        />
      </div>
      <GameUI
        gameState={gameState}
        countdown={countdown}
        rewards={rewards}
        stateRef={stateRef}
        raceConfig={raceConfig}
        trackPath={trackPath}
        cameraMode={cameraMode}
        setCameraMode={handleSetCameraMode}
        setControl={setControl}
        isPaused={isPaused}
        onPause={pause}
        onResume={resume}
        onExit={exitToMenu}
        onContinue={() => setPhase('REWARDS')}
        onRestartRace={handleRestartRace}
        driftTransferTimer={driftTransferTimer}
        accumulatedDriftScrap={accumulatedDriftScrap}
        driftRemainingTime={driftRemainingTime}
      />
    </div>
  );
};
