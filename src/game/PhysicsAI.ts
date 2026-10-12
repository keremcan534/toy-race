import { AICar, Particle, SkidMark } from './PhysicsTypes';
import { calculateSlipstream, DraftTargetCar, lerp, getDistanceToTrack } from './PhysicsUtils';

// Helper: Check if a straight-line path between two points stays safely on the asphalt track
function isPathClearOnTrack(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  trackPath: { x: number, y: number }[],
  maxAllowedDist: number
): boolean {
  for (const t of [0.25, 0.5, 0.75]) {
    const px = x1 + (x2 - x1) * t;
    const py = y1 + (y2 - y1) * t;
    if (getDistanceToTrack(px, py, trackPath) > maxAllowedDist) {
      return false;
    }
  }
  return true;
}

export function updateAICar(
  aiCar: AICar, 
  trackPath: { x: number, y: number }[], 
  dt: number, 
  particles: Particle[], 
  skidMarks: SkidMark[],
  totalLaps: number,
  allCars: any[],
  finishOrder: any[],
  raceTimeMs: number,
  isStraightTrackForFinish: boolean,
  difficulty: 'Kolay' | 'Orta' | 'Zor' | 'Çok Zor',
  playerProgress: number,
  trackWidth: number = 120,
  trackId?: string
) {
  if (aiCar.blinkTime > 0) {
    aiCar.blinkTime -= dt;
  }

  if (aiCar.finished) {
    const DRAG = 2.0 * dt;
    aiCar.velocity.x -= aiCar.velocity.x * DRAG;
    aiCar.velocity.y -= aiCar.velocity.y * DRAG;
    aiCar.x += aiCar.velocity.x * dt;
    aiCar.y += aiCar.velocity.y * dt;
    aiCar.lastSkidX = undefined;
    aiCar.lastSkidY = undefined;
    return;
  }

  const aiProgress = aiCar.lap * trackPath.length + aiCar.targetIndex;
  const progressDiff = playerProgress - aiProgress;
  
  // --- Dynamic Difficulty (Rubber Banding) ---
  let rubberBandMultiplier = 1.0;
  
  const difficultyFactor = 
    difficulty === 'Kolay' ? 1.2 : 
    difficulty === 'Orta' ? 1.0 : 
    difficulty === 'Zor' ? 0.4 : 0.2;

  if (progressDiff > 2) {
    const speedUpIntensity = Math.min((progressDiff - 2) * 0.04, 0.6);
    rubberBandMultiplier = 1.0 + speedUpIntensity;
  } else if (progressDiff < -12) {
    const aiAheadDist = Math.abs(progressDiff);
    const slowDownIntensity = Math.min((aiAheadDist - 12) * 0.01 * difficultyFactor, 0.1);
    rubberBandMultiplier = 1.0 - slowDownIntensity;
  }

  // --- Difficulty Speed Multiplier ---
  const difficultySpeedMultiplier = 
    difficulty === 'Kolay' ? 0.95 : 
    difficulty === 'Orta' ? 1.0 : 
    difficulty === 'Zor' ? 1.05 : 1.1;

  // --- Intelligent Racing Line & Lookahead Shortcut (En İyi ve En Kolay Rota) ---
  // The AI does not need to rigidly follow the road centerline!
  // If it can see a further node (lookahead +1 or +2) and the straight line to it
  // stays safely on the asphalt tarmac, it takes the shortcut / straightest racing line!
  const effectiveTrackWidth = trackWidth || 120;
  const safeAsphaltRadius = (effectiveTrackWidth / 2) * 0.82;
  const isFinishNode = isStraightTrackForFinish ? (aiCar.targetIndex === trackPath.length - 1) : (aiCar.targetIndex === 0);

  const nextTargetIndex = (aiCar.targetIndex + 1) % trackPath.length;
  const nextNextTargetIndex = (aiCar.targetIndex + 2) % trackPath.length;

  let chosenNode = trackPath[aiCar.targetIndex];

  // We can shortcut as long as we are not crossing the finish line node prematurely
  const canShortcutToNext = !isFinishNode && aiCar.targetIndex !== trackPath.length - 1;
  const canShortcutToNext2 = canShortcutToNext && nextTargetIndex !== 0 && nextTargetIndex !== trackPath.length - 1;

  if (canShortcutToNext2 && isPathClearOnTrack(aiCar.x, aiCar.y, trackPath[nextNextTargetIndex].x, trackPath[nextNextTargetIndex].y, trackPath, safeAsphaltRadius)) {
    // 2-node direct shortcut (straight-lining chicanes / open straights)
    chosenNode = trackPath[nextNextTargetIndex];
    aiCar.targetIndex = nextNextTargetIndex;
  } else if (canShortcutToNext && isPathClearOnTrack(aiCar.x, aiCar.y, trackPath[nextTargetIndex].x, trackPath[nextTargetIndex].y, trackPath, safeAsphaltRadius)) {
    const distToCurr = Math.hypot(trackPath[aiCar.targetIndex].x - aiCar.x, trackPath[aiCar.targetIndex].y - aiCar.y);
    const distToNext = Math.hypot(trackPath[nextTargetIndex].x - aiCar.x, trackPath[nextTargetIndex].y - aiCar.y);
    // If next node is reachable and closer or comparable distance, head directly to next node!
    if (distToNext < distToCurr * 1.35) {
      chosenNode = trackPath[nextTargetIndex];
      aiCar.targetIndex = nextTargetIndex;
    }
  }

  // --- Corner Apex Cutting (İç Hattı Kesme) ---
  // Widens cornering radius so cars don't make harsh turns
  const prevIdx = (aiCar.targetIndex - 1 + trackPath.length) % trackPath.length;
  const nextIdx = (aiCar.targetIndex + 1) % trackPath.length;
  const pPrev = trackPath[prevIdx];
  const pNext = trackPath[nextIdx];

  const midX = (pPrev.x + pNext.x) * 0.5;
  const midY = (pPrev.y + pNext.y) * 0.5;
  const apexDx = midX - chosenNode.x;
  const apexDy = midY - chosenNode.y;
  const apexDist = Math.hypot(apexDx, apexDy);

  let apexCutX = 0;
  let apexCutY = 0;
  if (apexDist > 20) {
    // Shift target toward inside apex by up to 35% of road half-width
    const cutAmount = Math.min(apexDist * 0.4, (effectiveTrackWidth / 2) * 0.35);
    apexCutX = (apexDx / apexDist) * cutAmount;
    apexCutY = (apexDy / apexDist) * cutAmount;
  }

  const targetPoint = {
    x: chosenNode.x + apexCutX,
    y: chosenNode.y + apexCutY
  };
  
  // --- Overtaking / Avoidance Logic ---
  let avoidanceX = 0;
  let avoidanceY = 0;
  let overtakingOffset = 0;
  
  allCars.forEach(other => {
    if (other.id === aiCar.id) return;
    
    const dx = other.x - aiCar.x;
    const dy = other.y - aiCar.y;
    const dist = Math.hypot(dx, dy);
    
    if (dist < 160) {
      const forwardX = Math.cos(aiCar.angle);
      const forwardY = Math.sin(aiCar.angle);
      const dot = dx * forwardX + dy * forwardY;
      
      if (dot > 0) {
        const cross = dx * forwardY - dy * forwardX;
        const steerDir = cross > 0 ? -1 : 1;
        const strength = (160 - dist) / 160; 
        
        avoidanceX += -Math.sin(aiCar.angle) * steerDir * strength * 45;
        avoidanceY += Math.cos(aiCar.angle) * steerDir * strength * 45;

        if (dist < 90) {
          overtakingOffset = steerDir * 35 * strength;
        }
      }
    }
  });

  const targetX = targetPoint.x + avoidanceX;
  const targetY = targetPoint.y + avoidanceY;

  // --- Natural AI Behavior ---
  const time = Date.now() / 1000;
  const idHash = aiCar.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const focus = aiCar.driverFocus || 1.0; 

  let pressureJitterX = 0;
  let pressureJitterY = 0;
  let defensiveOffsetX = 0;
  let defensiveOffsetY = 0;

  const playerCar = allCars.find(c => c.id === 'player');
  if (playerCar) {
    const dxPlayer = playerCar.x - aiCar.x;
    const dyPlayer = playerCar.y - aiCar.y;
    const distPlayer = Math.hypot(dxPlayer, dyPlayer);

    if (distPlayer < 150) {
      const pressureIntensity = (1 - (distPlayer / 150)) * Math.max(0, (1.2 - focus)); 
      pressureJitterX = (Math.random() - 0.5) * 30 * pressureIntensity;
      pressureJitterY = (Math.random() - 0.5) * 30 * pressureIntensity;

      const forwardX = Math.cos(aiCar.angle);
      const forwardY = Math.sin(aiCar.angle);
      const dotPlayer = dxPlayer * forwardX + dyPlayer * forwardY;
      
      if (dotPlayer < 20 && dotPlayer > -100) {
        const crossPlayer = dxPlayer * forwardY - dyPlayer * forwardX;
        const blockStrength = (1 - (distPlayer / 150)) * focus;
        const blockDir = crossPlayer > 0 ? 1 : -1;
        
        const perpX = -Math.sin(aiCar.angle);
        const perpY = Math.cos(aiCar.angle);
        
        defensiveOffsetX = perpX * blockDir * 25 * blockStrength;
        defensiveOffsetY = perpY * blockDir * 25 * blockStrength;
      }
    }
  }

  // Calculate base target with track width scaling
  const handlingRatio = (aiCar.carStats.handling || 30) / 100;
  const baseAngle = Math.atan2(targetY - aiCar.y, targetX - aiCar.x);
  const perpX = -Math.sin(baseAngle);
  const perpY = Math.cos(baseAngle);
  
  const laneScale = Math.min(2.0, effectiveTrackWidth / 120);
  const uniqueLanePreference = ((idHash % 10) - 4.5) * 8 * laneScale; 
  const maxDynamicOffset = (15 + ((1 - handlingRatio) * 20)) * laneScale;
  const dynamicOffset = Math.sin(time * (0.3 / focus) + idHash) * maxDynamicOffset * (1.2 - focus);
  
  const totalOffset = uniqueLanePreference + dynamicOffset + (overtakingOffset || 0);
  
  const finalTargetX = targetX + perpX * totalOffset + pressureJitterX + defensiveOffsetX;
  const finalTargetY = targetY + perpY * totalOffset + pressureJitterY + defensiveOffsetY;

  const dx = finalTargetX - aiCar.x;
  const dy = finalTargetY - aiCar.y;

  const distToTrackNode = Math.hypot(targetPoint.x - aiCar.x, targetPoint.y - aiCar.y);
  const currentSpeed = Math.hypot(aiCar.velocity.x, aiCar.velocity.y);
  
  // Focus affects braking point (threshold) with track width scaling
  const baseThreshold = isFinishNode ? 80 : 50; 
  const trackWidthBonus = (effectiveTrackWidth - 120) * 0.35;
  const speedLookahead = Math.min(currentSpeed * 0.2, 80); 
  const handlingThresholdAdjustment = (handlingRatio - 0.5) * 120; 
  const focusAdjustment = (1.0 - focus) * 40; 
  
  const threshold = Math.max(70, baseThreshold + trackWidthBonus + speedLookahead + handlingThresholdAdjustment + focusAdjustment);

  // Check if the car has passed the node using dot product (projection)
  const prevTargetIndex = (aiCar.targetIndex - 1 + trackPath.length) % trackPath.length;
  const prevNode = trackPath[prevTargetIndex];
  
  const abX = chosenNode.x - prevNode.x;
  const abY = chosenNode.y - prevNode.y;
  const acX = aiCar.x - prevNode.x;
  const acY = aiCar.y - prevNode.y;
  
  const dotProduct = acX * abX + acY * abY;
  const abLengthSq = abX * abX + abY * abY;
  
  const crossProduct = acX * abY - acY * abX;
  const distToLine = Math.abs(crossProduct) / Math.sqrt(abLengthSq || 1);
  
  const isPastNode = distToLine < (effectiveTrackWidth * 0.75) && distToTrackNode < 450 && dotProduct > abLengthSq;
  
  const distToNext = Math.hypot(pNext.x - aiCar.x, pNext.y - aiCar.y);
  const isCloserToNext = !isFinishNode && distToNext < distToTrackNode && dotProduct > abLengthSq * 0.4;

  if (distToTrackNode < threshold || isPastNode || isCloserToNext) {
    aiCar.targetIndex = (aiCar.targetIndex + 1) % trackPath.length;
    
    if (isFinishNode) {
      aiCar.lap++;
      if (aiCar.lap > totalLaps) {
        aiCar.finished = true;
        if (!finishOrder.find((f: any) => f.id === aiCar.id)) {
          finishOrder.push({
            id: aiCar.id,
            name: aiCar.name || 'AI',
            carName: aiCar.carStats.name,
            time: raceTimeMs
          });
        }
        return;
      }
    }
  }

  // Steering
  const isDriftArenaTrack = trackPath.length === 36;
  const driftAngleOffset = isDriftArenaTrack ? 0.38 * Math.sin(time * 1.8 + idHash) : 0;
  const steeringNoise = Math.sin(time * 1.2 + idHash) * 0.03 * (1.2 - focus);
  const targetAngle = Math.atan2(dy, dx) + steeringNoise + driftAngleOffset;
  
  let angleDiff = targetAngle - aiCar.angle;
  while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
  while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

  const TURN_SPEED = 1.8 + ((aiCar.carStats.handling || 30) * 0.03) * focus; // Increased from 1.5/0.025
  
  if (Math.abs(angleDiff) > 0.01) {
    const targetAngularVelocity = Math.min(Math.pow(Math.abs(angleDiff), 0.8) * 4.5, TURN_SPEED) * Math.sign(angleDiff); // Increased from 4.0
    const rotationResponsiveness = 6.0 + ((aiCar.carStats.handling || 30) * 0.06); // Increased from 5.0/0.05
    const lerpFactor = Math.min(1.0, dt * rotationResponsiveness);
    aiCar.angularVelocity = aiCar.angularVelocity * (1 - lerpFactor) + targetAngularVelocity * lerpFactor;
    aiCar.angle += aiCar.angularVelocity * dt;
  } else {
    const lerpFactor = Math.min(1.0, dt * 10);
    aiCar.angularVelocity *= (1 - lerpFactor);
    aiCar.angle += aiCar.angularVelocity * dt;
  }

  // Throttle & Braking
  const speedRatio = Math.min(currentSpeed / (40 + (aiCar.carStats.maxSpeed || 30) * 5.0), 1.0);

  const lookaheadIdx = (aiCar.targetIndex + 1) % trackPath.length;
  const nextTargetPoint = trackPath[lookaheadIdx];
  const angleToNext = Math.atan2(nextTargetPoint.y - aiCar.y, nextTargetPoint.x - aiCar.x);
  let nextAngleDiff = angleToNext - aiCar.angle;
  while (nextAngleDiff > Math.PI) nextAngleDiff -= Math.PI * 2;
  while (nextAngleDiff < -Math.PI) nextAngleDiff += Math.PI * 2;
  
  const distanceFactor = Math.max(0, 1 - (distToTrackNode / 150)); 
  const effectiveAngleDiff = Math.max(Math.abs(angleDiff), Math.abs(nextAngleDiff) * distanceFactor);

  let throttle = 1.0;
  const throttleNoise = (Math.sin(time * 2.5 + idHash) * 0.03) + 0.97; 
  
  // AI, yol tutuşu arttıkça virajı daha dar ve hız kaybetmeden dönsün, 
  // yol tutuşu düştükçe daha genişten dönsün hız kesmeden.
  throttle = 1.0 * throttleNoise;

  // Braking logic: AI should slow down for sharp turns if going too fast
  // This helps them stay on the racing line instead of drifting wide
  if (Math.abs(angleDiff) > 0.45 && currentSpeed > 200) { // Increased thresholds for less braking
    const brakeIntensity = Math.min(0.6, (Math.abs(angleDiff) - 0.45) * 1.2); // Reduced max brake intensity
    throttle *= (1 - brakeIntensity);
  }
  
  // Humanized Throttle in corners (İnsancıllaştırılmış Gaz Tepkileri)
  if (Math.abs(angleDiff) > 0.2) { // Increased threshold
    // Humanized fluctuation: Ideal_Speed * Random(0.98, 1.02)
    throttle *= (0.98 + Math.random() * 0.04);
  }

  const isDirtTrack = trackId === 'track-redoun';
  const isOffRoadVehicle = aiCar.carStats.type === 'pickup' || aiCar.carStats.type === 'suv';

  if (aiCar.burnoutTime === 0 && aiCar.burnoutCooldown <= 0 && currentSpeed < 10 && throttle > 0.1 && !aiCar.finished) {
    // Shorter burnout time for AI for quicker standing starts, extended on dirt for non-offroad cars
    const baseBurnout = Math.max(0.1, 0.5 - ((aiCar.carStats.acceleration || 20) * 0.005));
    aiCar.burnoutTime = (isDirtTrack && !isOffRoadVehicle) ? baseBurnout + 0.45 : baseBurnout;
  }

  let engineForceMultiplier = 1.0;

  if (aiCar.burnoutTime > 0) {
    aiCar.burnoutTime -= dt;
    if (aiCar.burnoutTime <= 0) {
      aiCar.burnoutTime = 0;
      aiCar.burnoutCooldown = 2.0;
    }
    
    engineForceMultiplier = (isDirtTrack && !isOffRoadVehicle) ? 0.22 : 0.45; // Reduced launch traction on dirt for sports/hyper cars

    const rearX = aiCar.x - Math.cos(aiCar.angle) * 20;
    const rearY = aiCar.y - Math.sin(aiCar.angle) * 20;
    const particleColor = isDirtTrack 
      ? `rgba(${175 + Math.random() * 35}, ${105 + Math.random() * 25}, ${42 + Math.random() * 20}, ${0.5 + Math.random() * 0.3})`
      : `rgba(${200 + Math.random()*55}, ${200 + Math.random()*55}, ${200 + Math.random()*55}, ${0.3 + Math.random() * 0.2})`;
    
    particles.push({
      x: rearX + Math.cos(aiCar.angle - Math.PI/2) * 10 + (Math.random() - 0.5) * 3,
      y: rearY + Math.sin(aiCar.angle - Math.PI/2) * 10 + (Math.random() - 0.5) * 3,
      vx: (Math.random() - 0.5) * 20 - Math.cos(aiCar.angle) * 10,
      vy: (Math.random() - 0.5) * 20 - Math.sin(aiCar.angle) * 10,
      life: 0.6 + Math.random() * 0.4,
      color: particleColor,
      size: Math.random() * 4 + 3
    });
    
    particles.push({
      x: rearX + Math.cos(aiCar.angle + Math.PI/2) * 10 + (Math.random() - 0.5) * 3,
      y: rearY + Math.sin(aiCar.angle + Math.PI/2) * 10 + (Math.random() - 0.5) * 3,
      vx: (Math.random() - 0.5) * 20 - Math.cos(aiCar.angle) * 10,
      vy: (Math.random() - 0.5) * 20 - Math.sin(aiCar.angle) * 10,
      life: 0.6 + Math.random() * 0.4,
      color: particleColor,
      size: Math.random() * 4 + 3
    });
  } else if (aiCar.burnoutCooldown > 0) {
    aiCar.burnoutCooldown -= dt;
  }

  // Non-offroad AI vehicles struggle on dirt during low speed acceleration
  if (isDirtTrack && !isOffRoadVehicle && currentSpeed < 45 && throttle > 0.1 && !aiCar.finished) {
    engineForceMultiplier *= 0.60;
  }

  // --- AI Nitro Boost Logic (AI araçları dengeli sıklıkta ve kısa süreliğine nitro kullanır) ---
  if (aiCar.nitroCooldown === undefined) aiCar.nitroCooldown = 6 + Math.random() * 8;
  if (aiCar.nitroDuration === undefined) aiCar.nitroDuration = 0;

  if (aiCar.nitroDuration > 0) {
    aiCar.nitroDuration -= dt;
    aiCar.isNitroActive = true;
    if (aiCar.nitroDuration <= 0) {
      aiCar.nitroDuration = 0;
      aiCar.isNitroActive = false;
      aiCar.nitroCooldown = 10 + Math.random() * 12; // Moderate 10-22s cooldown (bir tık arttırılmış sıklık)
    }
  } else {
    aiCar.isNitroActive = false;
    if (aiCar.nitroCooldown > 0) {
      aiCar.nitroCooldown -= dt;
    } else if (currentSpeed > 55 && throttle > 0.80 && Math.abs(angleDiff) < 0.32 && !aiCar.finished) {
      // Opportunistic trigger on straightaways and overtaking opportunities
      if (Math.random() < dt * 0.85) {
        aiCar.nitroDuration = 1.5 + Math.random() * 0.8; // Short punchy burst: 1.5 - 2.3 seconds
        aiCar.isNitroActive = true;
      }
    }
  }

  // Spawn AI Nitro Exhaust Particles when active
  if (aiCar.isNitroActive) {
    const rearDist = 20;
    const rearX = aiCar.x - Math.cos(aiCar.angle) * rearDist;
    const rearY = aiCar.y - Math.sin(aiCar.angle) * rearDist;
    const perpCos = Math.cos(aiCar.angle + Math.PI / 2);
    const perpSin = Math.sin(aiCar.angle + Math.PI / 2);

    for (let p = 0; p < 2; p++) {
      const sideOffset = (p === 0 ? -6 : 6);
      const px = rearX + perpCos * sideOffset;
      const py = rearY + perpSin * sideOffset;
      const flameSpeed = 75 + Math.random() * 45;

      particles.push({
        x: px + (Math.random() - 0.5) * 3,
        y: py + (Math.random() - 0.5) * 3,
        vx: -Math.cos(aiCar.angle) * flameSpeed + (Math.random() - 0.5) * 16,
        vy: -Math.sin(aiCar.angle) * flameSpeed + (Math.random() - 0.5) * 16,
        life: 0.20 + Math.random() * 0.10,
        color: Math.random() > 0.35 
          ? `rgba(56, 189, 248, ${0.75 + Math.random() * 0.25})`
          : `rgba(255, 255, 255, ${0.85 + Math.random() * 0.15})`,
        size: Math.random() * 4 + 2.5
      });
    }
  }

  // --- AI Slipstream / Draft System ---
  const aiDraftTargets: DraftTargetCar[] = allCars
    .filter((c: any) => c.id !== aiCar.id)
    .map((c: any) => ({
      id: c.id,
      x: c.x,
      y: c.y,
      angle: c.angle,
      velocity: c.velocity
    }));

  const aiDraft = calculateSlipstream(
    { id: aiCar.id, x: aiCar.x, y: aiCar.y, angle: aiCar.angle, velocity: aiCar.velocity },
    aiDraftTargets
  );

  const targetAIDraftIntensity = aiDraft.inDraft ? aiDraft.intensity : 0;
  aiCar.draftIntensity = lerp(aiCar.draftIntensity || 0, targetAIDraftIntensity, dt * 4.2);
  aiCar.isDrafting = (aiCar.draftIntensity || 0) > 0.08;

  // AI Curb Visual Height
  const aiDistToCenter = getDistanceToTrack(aiCar.x, aiCar.y, trackPath);
  const aiIsOnCurb = Math.abs(aiDistToCenter - (effectiveTrackWidth / 2)) < 14;
  aiCar.visualScale = lerp(aiCar.visualScale || 1.0, aiIsOnCurb ? 1.02 : 1.0, dt * 8.0);

  // Slipstream contribution for AI (balanced alongside player)
  const aiDraftBonusSpeed = 1.0 + (aiCar.draftIntensity || 0) * 0.12;
  const aiDraftBonusAccel = 1.0 + (aiCar.draftIntensity || 0) * 0.25;

  let MAX_SPEED = (130 + ((aiCar.carStats.maxSpeed || 30) * 3.2)) * rubberBandMultiplier * difficultySpeedMultiplier * aiDraftBonusSpeed;
  // Boosted AI acceleration force (bir tık hızlandırılmış ivmelenme)
  let ACCEL_FORCE = (85 + ((aiCar.carStats.acceleration || 20) * 1.42)) * rubberBandMultiplier * difficultySpeedMultiplier * aiDraftBonusAccel;

  if (isDirtTrack && !isOffRoadVehicle) {
    ACCEL_FORCE *= 0.70; // Reduced acceleration for sports/hyper AI on dirt
    MAX_SPEED *= 0.88;
  }

  if (aiCar.isNitroActive) {
    MAX_SPEED = (130 + ((aiCar.carStats.maxSpeed || 30) * 3.2)) * rubberBandMultiplier * difficultySpeedMultiplier * Math.min(1.42, 1.35 + (aiCar.draftIntensity || 0) * 0.04);
    ACCEL_FORCE *= 1.80;
  }
  const GRIP = isDriftArenaTrack ? 0.958 : Math.max(0.05, 0.75 - ((aiCar.carStats.handling || 30) * 0.006));

  const forceMagnitude = throttle * ACCEL_FORCE * engineForceMultiplier;
  const forceX = Math.cos(aiCar.angle) * forceMagnitude;
  const forceY = Math.sin(aiCar.angle) * forceMagnitude;

  aiCar.velocity.x += forceX * dt;
  aiCar.velocity.y += forceY * dt;

  // Aerodynamic drag naturally counterbalances acceleration at top speed
  const dragCoeff = ACCEL_FORCE / MAX_SPEED;
  const DRAG = dragCoeff * dt;
  aiCar.velocity.x -= aiCar.velocity.x * DRAG;
  aiCar.velocity.y -= aiCar.velocity.y * DRAG;

  const cos = Math.cos(aiCar.angle);
  const sin = Math.sin(aiCar.angle);
  const forwardVelocity = aiCar.velocity.x * cos + aiCar.velocity.y * sin;
  const rightVelocity = aiCar.velocity.x * -sin + aiCar.velocity.y * cos;
  
  const lateralFriction = 1 - Math.pow(GRIP, dt * 60);
  const newRightVelocity = rightVelocity * (1 - lateralFriction);
  
  aiCar.velocity.x = forwardVelocity * cos - newRightVelocity * sin;
  aiCar.velocity.y = forwardVelocity * sin + newRightVelocity * cos;

  const newSpeed = Math.hypot(aiCar.velocity.x, aiCar.velocity.y);
  if (newSpeed > MAX_SPEED) {
    const scale = MAX_SPEED / newSpeed;
    aiCar.velocity.x *= scale;
    aiCar.velocity.y *= scale;
  }

  aiCar.x += aiCar.velocity.x * dt;
  aiCar.y += aiCar.velocity.y * dt;

  // Gear Shifting and Exhaust Fire for AI
  if (!aiCar.carStats.isElectric) {
    const maxSpeed = 140 + ((aiCar.carStats.maxSpeed || 30) * 2.8);
    const numGears = 6;
    const speedPerGear = maxSpeed / numGears;
    const currentGear = Math.max(1, Math.min(numGears, Math.ceil(currentSpeed / speedPerGear)));
    
    aiCar.currentGear = currentGear;
  }

  const isSkidding = aiCar.burnoutTime > 0 || Math.abs(rightVelocity) > 50;
  if (isSkidding) {
    const rearX = aiCar.x - Math.cos(aiCar.angle) * 15;
    const rearY = aiCar.y - Math.sin(aiCar.angle) * 15;
    
    if (aiCar.lastSkidX !== undefined && aiCar.lastSkidY !== undefined) {
      const isDirt = trackId === 'track-redoun';
      const skidColor = isDirt ? 'rgba(52, 24, 7, 0.95)' : undefined;
      const skidOpacity = isDirt ? 0.65 : 0.4;
      const lx1 = aiCar.lastSkidX + Math.cos(aiCar.angle - Math.PI/2) * 10;
      const ly1 = aiCar.lastSkidY + Math.sin(aiCar.angle - Math.PI/2) * 10;
      const lx2 = rearX + Math.cos(aiCar.angle - Math.PI/2) * 10;
      const ly2 = rearY + Math.sin(aiCar.angle - Math.PI/2) * 10;
      skidMarks.push({ x1: lx1, y1: ly1, x2: lx2, y2: ly2, opacity: skidOpacity, life: 5, color: skidColor });
      
      const rx1 = aiCar.lastSkidX + Math.cos(aiCar.angle + Math.PI/2) * 10;
      const ry1 = aiCar.lastSkidY + Math.sin(aiCar.angle + Math.PI/2) * 10;
      const rx2 = rearX + Math.cos(aiCar.angle + Math.PI/2) * 10;
      const ry2 = rearY + Math.sin(aiCar.angle + Math.PI/2) * 10;
      skidMarks.push({ x1: rx1, y1: ry1, x2: rx2, y2: ry2, opacity: skidOpacity, life: 5, color: skidColor });
    }
    aiCar.lastSkidX = rearX;
    aiCar.lastSkidY = rearY;
  } else {
    aiCar.lastSkidX = undefined;
    aiCar.lastSkidY = undefined;
  }

  if (Math.abs(rightVelocity) > 50) {
    const rearX = aiCar.x - Math.cos(aiCar.angle) * 20;
    const rearY = aiCar.y - Math.sin(aiCar.angle) * 20;
    
    particles.push({
      x: rearX + Math.cos(aiCar.angle - Math.PI/2) * 10,
      y: rearY + Math.sin(aiCar.angle - Math.PI/2) * 10,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20,
      life: 0.5,
      color: 'rgba(200, 200, 200, 0.3)',
      size: Math.random() * 3 + 2
    });
  }
}
