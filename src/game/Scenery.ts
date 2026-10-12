import { getTrackWidth } from './TrackData';
import { getDistanceToTrack } from './PhysicsUtils';

export interface SceneryObject {
  x: number;
  y: number;
  type: 'tree' | 'rock' | 'bush' | 'grandstand' | 'cone' | 'palm' | 'lamp' | 'building' | 'tire_stack' | 'barrier' | 'billboard' | 'grass' | 'spectator_crowd';
  scale: number;
  rotation: number;
  variant?: number;
}

export function generateScenery(
  trackPath: { x: number, y: number }[],
  width: number,
  height: number,
  trackId?: string
): SceneryObject[] {
  const scenery: SceneryObject[] = [];
  const trackW = getTrackWidth(trackId);

  // =========================================================================
  // NIGHT GRAND PRIX (track-night): Dense Spectator Crowds, Grandstands & Night Floodlights
  // =========================================================================
  if (trackId === 'track-night') {
    for (let i = 0; i < trackPath.length; i++) {
      const p1 = trackPath[i];
      const p2 = trackPath[(i + 1) % trackPath.length];
      const segmentLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

      // Place spectators at regular, optimized spacing (~130px)
      const steps = Math.max(1, Math.floor(segmentLen / 130));

      for (let j = 0; j < steps; j++) {
        const t = (j + 0.5) / steps;
        const baseX = p1.x + (p2.x - p1.x) * t;
        const baseY = p1.y + (p2.y - p1.y) * t;

        [-1, 1].forEach(side => {
          // Safe margin outside the wide curb (260/2 + 32 = 162)
          const dist = trackW / 2 + 32;
          const perpAngle = angle + (side > 0 ? Math.PI / 2 : -Math.PI / 2);
          const px = baseX + Math.cos(perpAngle) * dist;
          const py = baseY + Math.sin(perpAngle) * dist;

          // Rotation facing toward the track
          const faceTrackAngle = perpAngle + Math.PI;

          // Alternate between cheering spectator crowd fences and tiered grandstand bleachers
          const isGrandstand = (i * 3 + j) % 5 === 0;

          if (isGrandstand) {
            scenery.push({
              x: px + Math.cos(perpAngle) * 16,
              y: py + Math.sin(perpAngle) * 16,
              type: 'grandstand',
              scale: 0.95,
              rotation: faceTrackAngle,
            });
          } else {
            scenery.push({
              x: px,
              y: py,
              type: 'spectator_crowd',
              scale: 0.92,
              rotation: faceTrackAngle,
            });
          }

          // Floodlight / night lamp posts at regular intervals
          if (j % 2 === 0) {
            scenery.push({
              x: px + Math.cos(perpAngle) * 36,
              y: py + Math.sin(perpAngle) * 36,
              type: 'lamp',
              scale: 1.25,
              rotation: faceTrackAngle,
            });
          }
        });
      }
    }

    return scenery;
  }

  // =========================================================================
  // DRIFT ARENA (track-drift-arena): Spectator Crowds & Floodlights around circular arena
  // =========================================================================
  if (trackId === 'track-drift-arena') {
    const center = { x: 600, y: 600 };
    const outerR = 860;
    const innerR = 340;

    // 1. Spectator crowds on outer perimeter
    for (let a = 0; a < Math.PI * 2; a += 0.12) {
      const cx = center.x + Math.cos(a) * outerR;
      const cy = center.y + Math.sin(a) * outerR;
      scenery.push({
        x: cx,
        y: cy,
        type: 'spectator_crowd',
        scale: 1.0,
        rotation: a + Math.PI / 2,
      });
    }

    // 3. Floodlights / Lamp poles around arena
    for (let a = 0; a < Math.PI * 2; a += 0.38) {
      const cx = center.x + Math.cos(a) * (outerR + 25);
      const cy = center.y + Math.sin(a) * (outerR + 25);
      scenery.push({
        x: cx,
        y: cy,
        type: 'lamp',
        scale: 1.25,
        rotation: a,
      });
    }

    return scenery;
  }

  // =========================================================================
  // DRAG STRIP (track-drag): Clean professional dragway with staging cones & bleachers
  // =========================================================================
  if (trackId === 'track-drag' || trackId === 'track-2' || trackId === 'track-3') {
    // 1. Staging cones near the start line
    for (let i = 0; i < Math.min(8, trackPath.length); i++) {
      const p1 = trackPath[i];
      const p2 = trackPath[(i + 1) % trackPath.length];
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      [-1, 1].forEach(side => {
        scenery.push({
          x: p1.x + Math.cos(angle + Math.PI / 2) * (trackW / 2 + 16) * side,
          y: p1.y + Math.sin(angle + Math.PI / 2) * (trackW / 2 + 16) * side,
          type: 'cone',
          scale: 1.05,
          rotation: 0
        });
      });
    }

    // 2. Spectator grandstands and lamp posts along the straightaways
    if (trackPath.length >= 6) {
      for (let i = 2; i < Math.min(12, trackPath.length - 2); i += 3) {
        const p1 = trackPath[i];
        const p2 = trackPath[(i + 1) % trackPath.length];
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        [-1, 1].forEach(side => {
          scenery.push({
            x: p1.x + Math.cos(angle + Math.PI / 2) * (trackW / 2 + 58) * side,
            y: p1.y + Math.sin(angle + Math.PI / 2) * (trackW / 2 + 58) * side,
            type: 'grandstand',
            scale: 1.15,
            rotation: angle + (side < 0 ? Math.PI : 0)
          });
          scenery.push({
            x: p1.x + Math.cos(angle + Math.PI / 2) * (trackW / 2 + 88) * side,
            y: p1.y + Math.sin(angle + Math.PI / 2) * (trackW / 2 + 88) * side,
            type: 'lamp',
            scale: 1.2,
            rotation: angle + (side < 0 ? Math.PI : 0)
          });
        });
      }
    }
    return scenery;
  }

  // =========================================================================
  // REDOUN (track-redoun): Off-road rally rocks, boulders, arid bushes & rally spectators
  // =========================================================================
  if (trackId === 'track-redoun') {
    for (let i = 0; i < trackPath.length; i++) {
      const p1 = trackPath[i];
      const p2 = trackPath[(i + 1) % trackPath.length];
      const segmentLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const perpX = Math.cos(angle + Math.PI / 2);
      const perpY = Math.sin(angle + Math.PI / 2);

      const steps = Math.max(1, Math.floor(segmentLen / 85));

      for (let j = 0; j < steps; j++) {
        const t = (j + 0.5) / steps;
        const baseX = p1.x + (p2.x - p1.x) * t;
        const baseY = p1.y + (p2.y - p1.y) * t;

        [-1, 1].forEach(side => {
          const rand = (Math.sin(i * 137.5 + j * 43.1 + (side > 0 ? 19 : 73)) + 1) * 0.5;
          const distFromCenter = trackW / 2 + 28 + (rand * 45);

          if (rand < 0.32) {
            // Natural canyon rocks & boulders
            scenery.push({
              x: baseX + perpX * distFromCenter * side,
              y: baseY + perpY * distFromCenter * side,
              type: 'rock',
              scale: 0.85 + (rand * 0.6),
              rotation: rand * Math.PI * 2,
              variant: Math.floor(rand * 5) % 2
            });
          } else if (rand < 0.58) {
            // Arid desert scrub bushes
            scenery.push({
              x: baseX + perpX * distFromCenter * side,
              y: baseY + perpY * distFromCenter * side,
              type: 'bush',
              scale: 0.8 + (rand * 0.5),
              rotation: rand * Math.PI * 2,
              variant: Math.floor(rand * 5) % 3
            });
          } else if (rand < 0.72) {
            // Rally barriers / hay bales along berms
            scenery.push({
              x: baseX + perpX * (trackW / 2 + 20) * side,
              y: baseY + perpY * (trackW / 2 + 20) * side,
              type: 'barrier',
              scale: 0.95,
              rotation: angle,
              variant: 1
            });
          } else if (rand > 0.88) {
            // Cheering rally spectators along safe crests
            scenery.push({
              x: baseX + perpX * (trackW / 2 + 55) * side,
              y: baseY + perpY * (trackW / 2 + 55) * side,
              type: 'spectator_crowd',
              scale: 0.9,
              rotation: angle + (side > 0 ? -Math.PI / 2 : Math.PI / 2),
            });
          }
        });
      }
    }
    return scenery;
  }

  // --- Trackside Perimeter Props (Safe Margin Outside Curb: 20px - 45px) ---
  for (let i = 0; i < trackPath.length; i++) {
    const p1 = trackPath[i];
    const p2 = trackPath[(i + 1) % trackPath.length];
    const segmentLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const perpX = Math.cos(angle + Math.PI / 2);
    const perpY = Math.sin(angle + Math.PI / 2);

    const steps = Math.max(1, Math.floor(segmentLen / 90));

    for (let j = 0; j < steps; j++) {
      const t = (j + 0.5) / steps;
      const baseX = p1.x + (p2.x - p1.x) * t;
      const baseY = p1.y + (p2.y - p1.y) * t;

      // Both left and right track margins
      [-1, 1].forEach(side => {
        const rand = (Math.sin(i * 137.5 + j * 43.1 + (side > 0 ? 17 : 71)) + 1) * 0.5;

        // 1. Barriers along straight sections
        if (rand < 0.22) {
          const offset = (trackW / 2 + 22) * side;
          scenery.push({
            x: baseX + perpX * offset,
            y: baseY + perpY * offset,
            type: 'barrier',
            scale: 0.95 + (rand * 0.2),
            rotation: angle,
            variant: Math.floor(rand * 10) % 2
          });
        }
        // 2. Tire stacks near turns
        else if (rand > 0.22 && rand < 0.38) {
          const offset = (trackW / 2 + 26) * side;
          scenery.push({
            x: baseX + perpX * offset,
            y: baseY + perpY * offset,
            type: 'tire_stack',
            scale: 0.9 + (rand * 0.2),
            rotation: angle,
            variant: Math.floor(rand * 10) % 3
          });
        }
        // 3. Cones
        else if (rand > 0.38 && rand < 0.48) {
          const offset = (trackW / 2 + 14) * side;
          scenery.push({
            x: baseX + perpX * offset,
            y: baseY + perpY * offset,
            type: 'cone',
            scale: 1.0,
            rotation: 0
          });
        }
        // 4. Billboards along outer straights
        else if (rand > 0.88 && side > 0) {
          const offset = (trackW / 2 + 42) * side;
          scenery.push({
            x: baseX + perpX * offset,
            y: baseY + perpY * offset,
            type: 'billboard',
            scale: 1.1,
            rotation: angle,
            variant: (i + j) % 3
          });
        }
      });
    }
  }

  // --- Grandstands along main straight ---
  if (trackPath.length >= 2) {
    const startP1 = trackPath[0];
    const startP2 = trackPath[1];
    const mainAngle = Math.atan2(startP2.y - startP1.y, startP2.x - startP1.x);
    const mainPerpX = Math.cos(mainAngle + Math.PI / 2);
    const mainPerpY = Math.sin(mainAngle + Math.PI / 2);

    [-1, 1].forEach(side => {
      const gsOffset = (trackW / 2 + 65) * side;
      scenery.push({
        x: startP1.x + (startP2.x - startP1.x) * 0.5 + mainPerpX * gsOffset,
        y: startP1.y + (startP2.y - startP1.y) * 0.5 + mainPerpY * gsOffset,
        type: 'grandstand',
        scale: 1.25,
        rotation: mainAngle + (side < 0 ? Math.PI : 0)
      });
    });
  }

  // --- Nature & Environment (Trees, Bushes, Rocks, Grass Tufts in Infield & Outfield) ---
  // Find track bounding box
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const pt of trackPath) {
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  }

  const margin = 350;
  const gridStep = 100;
  let seed = 42;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let gx = minX - margin; gx <= maxX + margin; gx += gridStep) {
    for (let gy = minY - margin; gy <= maxY + margin; gy += gridStep) {
      const jitterX = (pseudoRandom() - 0.5) * (gridStep * 0.85);
      const jitterY = (pseudoRandom() - 0.5) * (gridStep * 0.85);
      const posX = gx + jitterX;
      const posY = gy + jitterY;

      // Keep strictly away from the track road corridor
      const distToTrack = getDistanceToTrack(posX, posY, trackPath);
      if (distToTrack < trackW / 2 + 48) {
        continue;
      }

      const typeRoll = pseudoRandom();
      const scaleVariation = 0.85 + pseudoRandom() * 0.35;
      const rot = pseudoRandom() * Math.PI * 2;

      if (typeRoll < 0.42) {
        scenery.push({
          x: posX,
          y: posY,
          type: 'tree',
          scale: scaleVariation * 1.1,
          rotation: rot,
          variant: Math.floor(pseudoRandom() * 3)
        });
      } else if (typeRoll < 0.68) {
        scenery.push({
          x: posX,
          y: posY,
          type: 'bush',
          scale: scaleVariation * 0.95,
          rotation: rot
        });
      } else if (typeRoll < 0.84) {
        // Remove scattered grass tufts on Oval and Drag tracks as requested
        if (trackId === 'track-1' || trackId === 'track-drag' || trackId === 'track-2' || trackId === 'track-3') {
          scenery.push({
            x: posX,
            y: posY,
            type: 'bush',
            scale: scaleVariation * 0.9,
            rotation: rot
          });
        } else {
          scenery.push({
            x: posX,
            y: posY,
            type: 'grass',
            scale: scaleVariation * 0.9,
            rotation: rot
          });
        }
      } else if (typeRoll < 0.94) {
        scenery.push({
          x: posX,
          y: posY,
          type: 'rock',
          scale: scaleVariation * 0.9,
          rotation: rot
        });
      } else {
        scenery.push({
          x: posX,
          y: posY,
          type: 'lamp',
          scale: 1.0,
          rotation: rot
        });
      }
    }
  }

  return scenery;
}
