// Best-lap ghosts, one per track and lap count, each in its own localStorage key so a large
// recording can never push the main save over the storage quota.

export interface GhostFrame {
  x: number;
  y: number;
  angle: number;
  time: number; // ms since the start of the race (game time)
}

const PREFIX = 'toyrace-ghost:';
const cache = new Map<string, GhostFrame[] | null>();

export const ghostKey = (trackId: string, laps: number) => `${trackId}:${laps}`;

export function loadGhost(key: string): GhostFrame[] | undefined {
  if (!cache.has(key)) {
    let frames: GhostFrame[] | null = null;
    try {
      const flat = JSON.parse(localStorage.getItem(PREFIX + key) || 'null');
      if (Array.isArray(flat) && flat.length >= 4) {
        frames = [];
        for (let i = 0; i + 3 < flat.length; i += 4) {
          frames.push({ x: flat[i], y: flat[i + 1], angle: flat[i + 2], time: flat[i + 3] });
        }
      }
    } catch {
      frames = null;
    }
    cache.set(key, frames);
  }
  return cache.get(key) ?? undefined;
}

export function saveGhost(key: string, frames: GhostFrame[]) {
  if (frames.length === 0) return;
  cache.set(key, frames);
  // Flat [x, y, angle, time, ...] with rounding keeps a 10-lap recording in the tens of kilobytes.
  const flat: number[] = [];
  for (const f of frames) {
    flat.push(Math.round(f.x), Math.round(f.y), Math.round(f.angle * 100) / 100, Math.round(f.time));
  }
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(flat));
  } catch (e) {
    console.warn('Could not save ghost:', e);
  }
}

/** Finish time (ms) of the stored ghost, if there is one. */
export function bestGhostTime(key: string): number | undefined {
  const ghost = loadGhost(key);
  return ghost && ghost.length > 0 ? ghost[ghost.length - 1].time : undefined;
}
