import { Car } from '../store';
import { SceneryObject } from './Scenery';
import { TransformationZone } from './TrackData';
import { GhostFrame } from './ghosts';

export interface AICar {
  id: string;
  name: string;
  x: number;
  y: number;
  angle: number;
  velocity: { x: number, y: number };
  angularVelocity: number;
  carStats: Car;
  targetIndex: number;
  lap: number;
  finished: boolean;
  burnoutTime: number;
  burnoutCooldown: number;
  blinkTime: number;
  lastZoneIndex: number;
  currentGear: number;
  lastSkidX?: number;
  lastSkidY?: number;
  driverFocus?: number;
  nitro?: number;
  isNitroActive?: boolean;
  nitroCooldown?: number;
  nitroDuration?: number;
  draftIntensity?: number;
  isDrafting?: boolean;
  visualScale?: number;
}

export interface SkidMark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
  life: number; // For fading out
  baseOpacity?: number; // Opacity before the final fade
  color?: string;
}

export interface GameState {
  car: {
    x: number;
    y: number;
    angle: number; // radians
    velocity: { x: number, y: number };
    angularVelocity: number;
    carStats: Car;
    lastZoneIndex: number;
    lastSkidX?: number; // Last position for skid mark segment
    lastSkidY?: number;
    draftIntensity?: number;
    isDrafting?: boolean;
    visualScale?: number;
  };
  camera: {
    x: number;
    y: number;
    zoom: number;
  };
  aiCars: AICar[];
  ghostCar?: {
    x: number;
    y: number;
    angle: number;
    carStats: Car;
    finished: boolean;
    lap: number;
  };
  currentGhostData: GhostFrame[];
  replayGhostData?: GhostFrame[];
  controls: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    brake: boolean;
    nitro: boolean;
  };
  controlValues: {
    throttle: number; // 0 to 1
    brake: number; // 0 to 1
    steering: number; // -1 to 1
  };
  nitro: number; // 0 to 100
  isNitroActive: boolean;
  particles: Particle[];
  skidMarks: SkidMark[];
  scenery: SceneryObject[];
  lap: number;
  totalLaps: number;
  checkpointsPassed: number;
  finished: boolean;
  isRandomMode: boolean;
  transformationZones: TransformationZone[];
  trackId?: string;
  /** Set (to 0) when the race starts; null during intro/countdown. */
  startTime: number | null;
  /** Game-time ms since the start. Advances only while the simulation runs, so pauses don't count. */
  raceTime: number;
  /** raceTime at which the player finished. */
  finishTime: number | null;
  burnoutTime: number; // Time remaining for burnout
  burnoutCooldown: number; // Cooldown before next burnout
  blinkTime: number; // Time remaining for blinking effect (after teleport)
  finishOrder: { id: string, name: string, carName: string, time: number }[];
  isDrifting?: boolean;
  driftScore?: number;
  driftScrapEarned?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}
