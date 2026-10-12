export function lerp(start: number, end: number, t: number) {
  const clampedT = Math.max(0, Math.min(1, t));
  return start * (1 - clampedT) + end * clampedT;
}

export function getDistanceToTrack(x: number, y: number, trackPath: { x: number, y: number }[]): number {
  let minDistance = Infinity;

  for (let i = 0; i < trackPath.length; i++) {
    const p1 = trackPath[i];
    const p2 = trackPath[(i + 1) % trackPath.length];
    const d = distToSegment({x, y}, p1, p2);
    if (d < minDistance) minDistance = d;
  }
  return minDistance;
}

export function getClosestPointOnTrack(x: number, y: number, trackPath: { x: number, y: number }[]): { x: number, y: number } {
  let minDistance = Infinity;
  let closestPoint = { x: 0, y: 0 };

  for (let i = 0; i < trackPath.length; i++) {
    const p1 = trackPath[i];
    const p2 = trackPath[(i + 1) % trackPath.length];
    const { d, pt } = distToSegmentWithPoint({x, y}, p1, p2);
    if (d < minDistance) {
      minDistance = d;
      closestPoint = pt;
    }
  }
  return closestPoint;
}

export function getTangentAtPoint(pt: { x: number, y: number }, trackPath: { x: number, y: number }[]): { x: number, y: number } | null {
  let minDistance = Infinity;
  let bestP1 = trackPath[0];
  let bestP2 = trackPath[1];

  for (let i = 0; i < trackPath.length; i++) {
    const p1 = trackPath[i];
    const p2 = trackPath[(i + 1) % trackPath.length];
    const { d } = distToSegmentWithPoint(pt, p1, p2);
    if (d < minDistance) {
      minDistance = d;
      bestP1 = p1;
      bestP2 = p2;
    }
  }
  
  const dx = bestP2.x - bestP1.x;
  const dy = bestP2.y - bestP1.y;
  const len = Math.hypot(dx, dy);
  return { x: dx / len, y: dy / len };
}

export function distToSegmentWithPoint(p: {x:number, y:number}, v: {x:number, y:number}, w: {x:number, y:number}) {
  const l2 = (v.x - w.x)**2 + (v.y - w.y)**2;
  if (l2 === 0) return { d: Math.hypot(p.x - v.x, p.y - v.y), pt: v };
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  const pt = { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
  return { d: Math.hypot(p.x - pt.x, p.y - pt.y), pt };
}

export function distToSegment(p: {x:number, y:number}, v: {x:number, y:number}, w: {x:number, y:number}) {
  const l2 = (v.x - w.x)**2 + (v.y - w.y)**2;
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}

export interface DraftTargetCar {
  id: string;
  x: number;
  y: number;
  angle: number;
  velocity: { x: number, y: number };
}

export function calculateSlipstream(
  car: { id: string, x: number, y: number, angle: number, velocity: { x: number, y: number } },
  otherCars: DraftTargetCar[]
): { inDraft: boolean, intensity: number, targetCarId?: string } {
  const currentSpeed = Math.hypot(car.velocity.x, car.velocity.y);
  if (currentSpeed < 30) {
    return { inDraft: false, intensity: 0 };
  }

  const forwardX = Math.cos(car.angle);
  const forwardY = Math.sin(car.angle);
  const perpX = -forwardY;
  const perpY = forwardX;

  let bestIntensity = 0;
  let bestTargetId: string | undefined;

  for (const other of otherCars) {
    if (other.id === car.id) continue;

    const otherSpeed = Math.hypot(other.velocity.x, other.velocity.y);
    if (otherSpeed < 22) continue;

    const dx = other.x - car.x;
    const dy = other.y - car.y;
    const dist = Math.hypot(dx, dy);

    // Draft distance: between 22 and 260 units (refined corridor reach)
    if (dist < 22 || dist > 260) continue;

    const distAlong = dx * forwardX + dy * forwardY;
    if (distAlong <= 0) continue; // Other car must be in front

    const lateralDist = Math.abs(dx * perpX + dy * perpY);
    // Air corridor behind lead car (widened slightly to 28px for smoother slipstream catch)
    if (lateralDist > 28) continue;

    // Heading similarity (both driving in similar direction)
    const otherForwardX = Math.cos(other.angle);
    const otherForwardY = Math.sin(other.angle);
    const headingDot = forwardX * otherForwardX + forwardY * otherForwardY;
    if (headingDot < 0.65) continue;

    // Alignment factor (how directly behind we are)
    const alignment = Math.max(0, 1 - (lateralDist / 28));

    // Distance falloff: optimal at ~45-110px, gentle falloff up to 260px
    let distFactor = 1.0;
    if (dist < 45) {
      distFactor = 0.65 + (dist / 45) * 0.35;
    } else {
      distFactor = Math.max(0, 1 - (dist - 45) / 215);
    }

    const intensity = Math.min(1.0, alignment * distFactor);
    if (intensity > bestIntensity) {
      bestIntensity = intensity;
      bestTargetId = other.id;
    }
  }

  return {
    inDraft: bestIntensity > 0.05,
    intensity: bestIntensity,
    targetCarId: bestTargetId
  };
}
