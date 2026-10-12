import { Car, INITIAL_CARS, maxOutCar } from '../store';
import { GameState, AICar, Particle } from './PhysicsTypes';
import { TRACKS, TRACK_WIDTH, TRACK_BORDER, TransformationZone, getTrackWidth } from './TrackData';
import { lerp, getDistanceToTrack, getClosestPointOnTrack, getTangentAtPoint, calculateSlipstream, DraftTargetCar } from './PhysicsUtils';
import { updateAICar } from './PhysicsAI';

export * from './PhysicsTypes';
export * from './TrackData';

function isPointInRotatedRect(px: number, py: number, rect: TransformationZone) {
  const dx = px - rect.x;
  const dy = py - rect.y;
  const cos = Math.cos(-rect.rotation);
  const sin = Math.sin(-rect.rotation);
  const rx = dx * cos - dy * sin;
  const ry = dx * sin + dy * cos;
  return Math.abs(rx) <= rect.width / 2 && Math.abs(ry) <= rect.height / 2;
}

function transformCarStats(carStats: Car) {
  if (!carStats) return;
  const randomCar = INITIAL_CARS[Math.floor(Math.random() * INITIAL_CARS.length)];
  if (!randomCar) return;
  Object.assign(carStats, maxOutCar(randomCar));
  // Object.assign skips keys the new car lacks, so an electric car must not stay electric.
  carStats.isElectric = !!randomCar.isElectric;
}

export function updatePhysics(state: GameState, trackPath: { x: number, y: number }[], dt: number, difficulty: 'Kolay' | 'Orta' | 'Zor' | 'Çok Zor' = 'Orta', onOffRoad?: (isOffRoad: boolean) => void, onCollision?: (type: string) => void) {
  const { car, controls, controlValues } = state;
  const carStats = car.carStats;

  const isStraightTrack = false;
  const isFunTrack = false;
  const isCityTrack = false;
  const trackWidth = getTrackWidth(state.trackId);
  const isDriftArena = state.trackId === 'track-drift-arena';

  if (state.startTime !== null) {
    state.raceTime += dt * 1000;
  }

  if (state.blinkTime > 0) {
    state.blinkTime -= dt;
  }
  
  // Transformation Zones
  if (state.isRandomMode && state.transformationZones) {
    let inAnyZone = false;
    state.transformationZones.forEach((zone, index) => {
      if (isPointInRotatedRect(car.x, car.y, zone)) {
        inAnyZone = true;
        if (car.lastZoneIndex !== index) {
          transformCarStats(car.carStats);
          state.blinkTime = 1.5;
          car.lastZoneIndex = index;
        }
      }
    });
    if (!inAnyZone) car.lastZoneIndex = -1;

    state.aiCars.forEach(ai => {
      let aiInAnyZone = false;
      state.transformationZones.forEach((zone, index) => {
        if (isPointInRotatedRect(ai.x, ai.y, zone)) {
          aiInAnyZone = true;
          if (ai.lastZoneIndex !== index) {
            transformCarStats(ai.carStats);
            ai.blinkTime = 1.5;
            ai.lastZoneIndex = index;
          }
        }
      });
      if (!aiInAnyZone) ai.lastZoneIndex = -1;

      // AI Teleport logic
      const aiDist = getDistanceToTrack(ai.x, ai.y, trackPath);
      if (aiDist > (trackWidth / 2) + 60 && !ai.finished) {
        const closestPoint = getClosestPointOnTrack(ai.x, ai.y, trackPath);
        ai.x = closestPoint.x;
        ai.y = closestPoint.y;
        ai.velocity.x = 0;
        ai.velocity.y = 0;
        const tangent = getTangentAtPoint(closestPoint, trackPath);
        if (tangent) {
          ai.angle = Math.atan2(tangent.y, tangent.x);
        }
        ai.blinkTime = 2.0;
      }
    });
  }

  const allCars = [
    { 
      id: 'player', 
      x: state.car.x, 
      y: state.car.y, 
      velocity: state.car.velocity, 
      angle: state.car.angle, 
      finished: state.finished,
      radius: 12,
      isPlayer: true
    },
    ...state.aiCars.map(ai => ({
      id: ai.id,
      x: ai.x,
      y: ai.y,
      velocity: ai.velocity,
      angle: ai.angle,
      finished: ai.finished,
      radius: 12,
      isPlayer: false
    }))
  ];

  // const collisionOccurred = checkCarCollisions(allCars, state);
  // if (collisionOccurred && onCollision) {
  //   onCollision('car');
  // }

  const isStraightTrackForFinish = false;
  const playerProgress = state.lap * trackPath.length + state.checkpointsPassed;

  if (state.aiCars) {
    state.aiCars.forEach(aiCar => {
      updateAICar(aiCar, trackPath, dt, state.particles, state.skidMarks, state.totalLaps, allCars, state.finishOrder, state.raceTime, isStraightTrackForFinish, difficulty, playerProgress, trackWidth, state.trackId);
      
      if (isDriftArena) {
        const aiDistFromCenter = Math.hypot(aiCar.x - 600, aiCar.y - 600);
        if (aiDistFromCenter > 830) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 300 + Math.random() * 400;
          aiCar.x = 600 + Math.cos(angle) * dist;
          aiCar.y = 600 + Math.sin(angle) * dist;
          aiCar.velocity.x = 0;
          aiCar.velocity.y = 0;
          aiCar.angle = angle + Math.PI / 2 + (Math.random() - 0.5);
          aiCar.blinkTime = 2.0;
        }
      }
    });
  }

  let targetThrottle = controls.forward ? 1 : (controls.backward ? -0.5 : 0);
  let targetSteering = 0;
  let targetBrake = controls.brake ? 1 : 0;

  if (state.finished) {
    targetThrottle = 0;
    targetSteering = 0;
    targetBrake = 1;
  }

  controlValues.throttle = lerp(controlValues.throttle, targetThrottle, dt * 5);

  if (controls.left && !state.finished) targetSteering = -1;
  if (controls.right && !state.finished) targetSteering = 1;
  const steeringResponsiveness = 1.0 + ((carStats.handling || 30) * 0.04);
  controlValues.steering = lerp(controlValues.steering, targetSteering, dt * steeringResponsiveness);

  controlValues.brake = lerp(controlValues.brake, targetBrake, dt * 10);

  const speed = Math.hypot(car.velocity.x, car.velocity.y);

  // Nitro Boost Logic
  if (state.nitro === undefined) state.nitro = 100;
  const wantsNitro = !!state.controls.nitro && !state.finished;

  // Activation rule: %50 ve altı basılamaz, %51 ve üstü basılabilir.
  // Once active, the player can sustain the boost until 0% or until releasing the key.
  let canUseNitro = false;
  if (wantsNitro && (controlValues.throttle > 0.05 || speed > 20)) {
    if (state.isNitroActive) {
      canUseNitro = state.nitro > 0;
    } else {
      canUseNitro = state.nitro > 50; // Requires > 50% (51%+) to trigger
    }
  }

  if (canUseNitro) {
    // Deplete nitro fast (drains 100% in ~2.8 seconds)
    state.nitro = Math.max(0, state.nitro - dt * 36);
    if (state.nitro <= 0) {
      canUseNitro = false;
      state.nitro = 0;
    }
  } else {
    // Slow nitro regeneration when inactive (takes ~22s to recharge 100%, ~4.5% per sec)
    state.nitro = Math.min(100, (state.nitro || 0) + dt * 4.5);
  }

  state.isNitroActive = canUseNitro && state.nitro > 0;

  if (canUseNitro) {
    // Spawn intense glowing blue/cyan nitro exhaust flame particles
    const rearDist = 20;
    const rearX = car.x - Math.cos(car.angle) * rearDist;
    const rearY = car.y - Math.sin(car.angle) * rearDist;
    const perpCos = Math.cos(car.angle + Math.PI / 2);
    const perpSin = Math.sin(car.angle + Math.PI / 2);

    for (let p = 0; p < 2; p++) {
      const sideOffset = (p === 0 ? -6 : 6);
      const px = rearX + perpCos * sideOffset;
      const py = rearY + perpSin * sideOffset;
      const flameSpeed = 80 + Math.random() * 50;

      state.particles.push({
        x: px + (Math.random() - 0.5) * 3,
        y: py + (Math.random() - 0.5) * 3,
        vx: -Math.cos(car.angle) * flameSpeed + (Math.random() - 0.5) * 16,
        vy: -Math.sin(car.angle) * flameSpeed + (Math.random() - 0.5) * 16,
        life: 0.22 + Math.random() * 0.12,
        color: Math.random() > 0.35 
          ? `rgba(56, 189, 248, ${0.75 + Math.random() * 0.25})` // Bright cyan
          : `rgba(255, 255, 255, ${0.85 + Math.random() * 0.15})`, // White core
        size: Math.random() * 4 + 2.5
      });
    }
  }

  // --- Slipstream / Draft System for Player ---
  const draftTargets: DraftTargetCar[] = (state.aiCars || []).map(ai => ({
    id: ai.id,
    x: ai.x,
    y: ai.y,
    angle: ai.angle,
    velocity: ai.velocity
  }));
  if (state.ghostCar && !state.ghostCar.finished) {
    draftTargets.push({
      id: 'ghost',
      x: state.ghostCar.x,
      y: state.ghostCar.y,
      angle: state.ghostCar.angle,
      velocity: { x: 0, y: 0 }
    });
  }

  const playerDraft = calculateSlipstream(
    { id: 'player', x: car.x, y: car.y, angle: car.angle, velocity: car.velocity },
    draftTargets
  );

  // Smooth interpolation for draft intensity (gentle build up and decay)
  const targetDraftIntensity = playerDraft.inDraft ? playerDraft.intensity : 0;
  car.draftIntensity = lerp(car.draftIntensity || 0, targetDraftIntensity, dt * 4.2);
  car.isDrafting = (car.draftIntensity || 0) > 0.08;

  // --- Curb / Kerb Visual Height Detection (Purely visual scale, zero physics changes) ---
  const distFromCenter = getDistanceToTrack(car.x, car.y, trackPath);
  const roadHalfW = trackWidth / 2;
  const isOnCurb = Math.abs(distFromCenter - roadHalfW) < 12;
  car.visualScale = lerp(car.visualScale || 1.0, isOnCurb ? 1.022 : 1.0, dt * 8.0);

  // Updated physics values to make speed differences more noticeable and progressive
  // Slipstream contribution (improved slightly as requested: +14% top speed, +30% accel force)
  const draftBonusSpeed = 1.0 + (car.draftIntensity || 0) * 0.14;
  const draftBonusAccel = 1.0 + (car.draftIntensity || 0) * 0.30;

  const isDirtTrack = state.trackId === 'track-redoun';
  const isOffRoadVehicle = carStats.type === 'pickup' || carStats.type === 'suv';

  let MAX_SPEED = (130 + ((carStats.maxSpeed || 30) * 3.2)) * draftBonusSpeed;
  // Realistic acceleration curve: smoothly builds up across gears (0-100 in ~2.5s, 0-200 in ~5.5s, top speed in ~10s)
  let ACCEL_FORCE = (68 + ((carStats.acceleration || 20) * 1.15)) * draftBonusAccel;

  if (canUseNitro) {
    // Nitro temporarily increases maximum speed by +38% and accelerates with +85% force
    // Total speed with nitro + slipstream is strictly bounded to prevent excessive speed spikes
    MAX_SPEED = (130 + ((carStats.maxSpeed || 30) * 3.2)) * Math.min(1.48, 1.38 + (car.draftIntensity || 0) * 0.07);
    ACCEL_FORCE *= 1.85;
  }

  // Redoun Dirt Track Special Mechanic:
  // Only Pick-Up and SUV vehicles drive normally with full 4WD/AWD traction and torque.
  // Other vehicles (sport, muscle, hyper) struggle when launching and accelerating on loose dirt!
  if (isDirtTrack && !isOffRoadVehicle) {
    ACCEL_FORCE *= 0.70; // Noticeably reduced traction / acceleration force on dirt
    MAX_SPEED *= 0.88;   // Natural loose gravel / dirt rolling resistance
  }
  
  // Reverted to old "inverted" grip logic: higher handling = more sliding (ice-like)
  let SLIPPERINESS = 0.94 + ((carStats.handling || 30) * 0.0005);
  
  // Dirt track sliding mechanic (Redoun):
  // SUV and Pickup vehicles maintain solid 4WD/AWD off-road traction.
  // Other vehicles (sport, muscle, hyper) slide significantly more when turning on dirt!
  if (isDirtTrack && !isOffRoadVehicle) {
    const steerFactor = Math.abs(controlValues.steering);
    SLIPPERINESS = Math.min(0.994, SLIPPERINESS + 0.025 + (steerFactor * 0.035));
  }

  // BR-47 (F1) Special Handling: No drift, absolute grip
  if (carStats.id === 'car-br47') {
    SLIPPERINESS = 0.0; // Perfect grip, no lateral sliding
  }
  
  const TURN_SPEED = 1.0 + ((carStats.handling || 30) * 0.02);

  if (state.burnoutTime === 0 && state.burnoutCooldown <= 0 && speed < 10 && state.controls.forward && !state.finished) {
    let baseBurnout = 0.2;
    if ((carStats.acceleration || 20) <= 30) baseBurnout = 0.95;
    else if ((carStats.acceleration || 20) <= 50) baseBurnout = 0.7;
    else if ((carStats.acceleration || 20) <= 80) baseBurnout = 0.5;

    // Non-offroad cars wheelspin much longer on loose dirt when launching from standstill
    if (isDirtTrack && !isOffRoadVehicle) {
      state.burnoutTime = baseBurnout + 0.65;
    } else {
      state.burnoutTime = baseBurnout;
    }
  }

  let engineForceMultiplier = 1.0;

  if (state.burnoutTime > 0) {
    state.burnoutTime -= dt;
    if (state.burnoutTime <= 0) {
      state.burnoutTime = 0;
      state.burnoutCooldown = 2.0;
    }
    
    // Extra launch penalty for non-offroad cars digging into loose dirt
    engineForceMultiplier = (isDirtTrack && !isOffRoadVehicle) ? 0.09 : 0.15;

    const rearX = car.x - Math.cos(car.angle) * 20;
    const rearY = car.y - Math.sin(car.angle) * 20;

    const particleColor = isDirtTrack 
      ? `rgba(${175 + Math.random() * 35}, ${105 + Math.random() * 25}, ${42 + Math.random() * 20}, ${0.5 + Math.random() * 0.3})`
      : `rgba(${200 + Math.random()*55}, ${200 + Math.random()*55}, ${200 + Math.random()*55}, ${0.3 + Math.random() * 0.2})`;
    
    state.particles.push({
      x: rearX + Math.cos(car.angle - Math.PI/2) * 10 + (Math.random() - 0.5) * 3,
      y: rearY + Math.sin(car.angle - Math.PI/2) * 10 + (Math.random() - 0.5) * 3,
      vx: (Math.random() - 0.5) * 20 - Math.cos(car.angle) * 10,
      vy: (Math.random() - 0.5) * 20 - Math.sin(car.angle) * 10,
      life: 0.6 + Math.random() * 0.4,
      color: particleColor,
      size: Math.random() * 4 + 3
    });
    
    state.particles.push({
      x: rearX + Math.cos(car.angle + Math.PI/2) * 10 + (Math.random() - 0.5) * 3,
      y: rearY + Math.sin(car.angle + Math.PI/2) * 10 + (Math.random() - 0.5) * 3,
      vx: (Math.random() - 0.5) * 20 - Math.cos(car.angle) * 10,
      vy: (Math.random() - 0.5) * 20 - Math.sin(car.angle) * 10,
      life: 0.6 + Math.random() * 0.4,
      color: particleColor,
      size: Math.random() * 4 + 3
    });
  } else if (state.burnoutCooldown > 0) {
    state.burnoutCooldown -= dt;
  }

  // Non-offroad vehicles struggle when getting up to speed on dirt (speed < 45)
  if (isDirtTrack && !isOffRoadVehicle && speed < 45 && state.controls.forward && !state.finished) {
    engineForceMultiplier *= 0.58;
  }

  const speedFactor = Math.min(speed / 100, 1);
  let effectiveTurnSpeed = TURN_SPEED;
  if (isDirtTrack && !isOffRoadVehicle && Math.abs(controlValues.steering) > 0.05) {
    // Non-offroad street tires oversteer and swing tail when cornering on loose dirt
    effectiveTurnSpeed *= 1.3;
  }
  car.angle += controlValues.steering * effectiveTurnSpeed * speedFactor * dt;

  const forceMagnitude = controlValues.throttle * ACCEL_FORCE * engineForceMultiplier;
  const forceX = Math.cos(car.angle) * forceMagnitude;
  const forceY = Math.sin(car.angle) * forceMagnitude;

  car.velocity.x += forceX * dt;
  car.velocity.y += forceY * dt;

  // Aerodynamic drag naturally counterbalances acceleration at top speed
  const dragCoeff = ACCEL_FORCE / MAX_SPEED;
  const DRAG = dragCoeff * dt;
  car.velocity.x -= car.velocity.x * DRAG;
  car.velocity.y -= car.velocity.y * DRAG;

  const cos = Math.cos(car.angle);
  const sin = Math.sin(car.angle);
  const forwardVelocity = car.velocity.x * cos + car.velocity.y * sin;
  const rightVelocity = car.velocity.x * -sin + car.velocity.y * cos;

  // Use SLIPPERINESS correctly: 
  // If SLIPPERINESS is 1.0, lateralFriction is 0, velocity is maintained (ice).
  // If SLIPPERINESS is 0.0, lateralFriction is 1, velocity is killed instantly (rail).
  const lateralFriction = 1 - Math.pow(SLIPPERINESS, dt * 60);
  const newRightVelocity = rightVelocity * (1 - lateralFriction);
  
  const newForwardVelocity = forwardVelocity;

  car.velocity.x = newForwardVelocity * cos - newRightVelocity * sin;
  car.velocity.y = newForwardVelocity * sin + newRightVelocity * cos;

  if (controlValues.brake > 0.1) {
    const brakeFactor = 1 - (controlValues.brake * 2 * dt);
    car.velocity.x *= Math.max(0, brakeFactor);
    car.velocity.y *= Math.max(0, brakeFactor);
  }

  const currentSpeed = Math.hypot(car.velocity.x, car.velocity.y);
  if (currentSpeed > MAX_SPEED) {
    const scale = MAX_SPEED / currentSpeed;
    car.velocity.x *= scale;
    car.velocity.y *= scale;
  }

  car.x += car.velocity.x * dt;
  car.y += car.velocity.y * dt;

  // --- REAL-TIME DRIFT SCORING & SCRAP REWARD ---
  const isDrifting = Math.abs(rightVelocity) > 28 && currentSpeed > 25 && carStats.id !== 'car-br47';
  state.isDrifting = isDrifting;

  if (isDrifting) {
    const driftIntensity = Math.min(1.0, (Math.abs(rightVelocity) - 25) / 65);
    const scrapAward = Math.max(1, Math.floor(dt * 360 * (currentSpeed / 35) * (0.8 + driftIntensity * 0.8)));
    
    state.driftScore = (state.driftScore || 0) + scrapAward;
    state.driftScrapEarned = (state.driftScrapEarned || 0) + scrapAward;
  }

  // Skid marks logic
  const skidThreshold = isDirtTrack && !isOffRoadVehicle ? 28 : 50;
  const isSkidding = (state.burnoutTime > 0 || Math.abs(rightVelocity) > skidThreshold) && carStats.id !== 'car-br47';
  if (isSkidding) {
    const rearX = car.x - Math.cos(car.angle) * 15;
    const rearY = car.y - Math.sin(car.angle) * 15;
    
    if (car.lastSkidX !== undefined && car.lastSkidY !== undefined) {
      const skidColor = isDirtTrack ? 'rgba(52, 24, 7, 0.95)' : undefined;
      const skidOpacity = isDirtTrack ? 0.65 : 0.4;
      // Left wheel
      const lx1 = car.lastSkidX + Math.cos(car.angle - Math.PI/2) * 10;
      const ly1 = car.lastSkidY + Math.sin(car.angle - Math.PI/2) * 10;
      const lx2 = rearX + Math.cos(car.angle - Math.PI/2) * 10;
      const ly2 = rearY + Math.sin(car.angle - Math.PI/2) * 10;
      state.skidMarks.push({ x1: lx1, y1: ly1, x2: lx2, y2: ly2, opacity: skidOpacity, baseOpacity: skidOpacity, life: 5, color: skidColor });

      // Right wheel
      const rx1 = car.lastSkidX + Math.cos(car.angle + Math.PI/2) * 10;
      const ry1 = car.lastSkidY + Math.sin(car.angle + Math.PI/2) * 10;
      const rx2 = rearX + Math.cos(car.angle + Math.PI/2) * 10;
      const ry2 = rearY + Math.sin(car.angle + Math.PI/2) * 10;
      state.skidMarks.push({ x1: rx1, y1: ry1, x2: rx2, y2: ry2, opacity: skidOpacity, baseOpacity: skidOpacity, life: 5, color: skidColor });
    }
    car.lastSkidX = rearX;
    car.lastSkidY = rearY;
  } else {
    car.lastSkidX = undefined;
    car.lastSkidY = undefined;
  }

  // Update skid marks life
  for (let i = state.skidMarks.length - 1; i >= 0; i--) {
    const s = state.skidMarks[i];
    s.life -= dt;
    if (s.life <= 0) {
      state.skidMarks.splice(i, 1);
    } else if (s.life < 1) {
      s.opacity = (s.baseOpacity ?? 0.4) * s.life;
    }
  }

  // Limit skid marks (Highly optimized for mobile performance)
  if (state.skidMarks.length > 350) {
    state.skidMarks.splice(0, state.skidMarks.length - 350);
  }

  if (Math.abs(rightVelocity) > 50 && carStats.id !== 'car-br47') {
    const rearX = car.x - Math.cos(car.angle) * 20;
    const rearY = car.y - Math.sin(car.angle) * 20;
    
    const driftParticleColor = isDirtTrack 
      ? `rgba(${175 + Math.random() * 35}, ${105 + Math.random() * 25}, ${42 + Math.random() * 20}, ${0.35 + Math.random() * 0.25})`
      : 'rgba(200, 200, 200, 0.3)';
    
    state.particles.push({
      x: rearX + Math.cos(car.angle - Math.PI/2) * 10,
      y: rearY + Math.sin(car.angle - Math.PI/2) * 10,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20,
      life: isDirtTrack ? 0.65 : 0.5,
      color: driftParticleColor,
      size: Math.random() * 3 + (isDirtTrack ? 3 : 2)
    });
    
    state.particles.push({
      x: rearX + Math.cos(car.angle + Math.PI/2) * 10,
      y: rearY + Math.sin(car.angle + Math.PI/2) * 10,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20,
      life: isDirtTrack ? 0.65 : 0.5,
      color: driftParticleColor,
      size: Math.random() * 3 + (isDirtTrack ? 3 : 2)
    });
  }

  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    p.size += dt * 5;
    if (p.life <= 0) {
      state.particles.splice(i, 1);
    }
  }

  // Cap particles array size for performance (crucial for mobile!)
  if (state.particles.length > 120) {
    state.particles.splice(0, state.particles.length - 120);
  }

  let isOffRoad = false;
  let dist = 0;

  if (isDriftArena) {
    const distFromCenter = Math.hypot(car.x - 600, car.y - 600);
    isOffRoad = distFromCenter > 800;
    dist = isOffRoad ? (distFromCenter - 800) : 0;

    if (distFromCenter > 830) {
      // Teleport back inside the arena
      const angle = Math.atan2(car.y - 600, car.x - 600);
      car.x = 600 + Math.cos(angle) * 780;
      car.y = 600 + Math.sin(angle) * 780;
      
      car.velocity.x = 0;
      car.velocity.y = 0;
      car.angle = angle + Math.PI; // Face towards the center
      state.blinkTime = 2.0;

      // Snap camera to car immediately on teleport
      state.camera.x = car.x;
      state.camera.y = car.y;
    } else if (isOffRoad) {
      // Gentle speed reduction on track borders / grass
      const offRoadDrag = Math.pow(0.988, dt * 60);
      car.velocity.x *= offRoadDrag;
      car.velocity.y *= offRoadDrag;
    }
  } else {
    dist = getDistanceToTrack(car.x, car.y, trackPath);
    isOffRoad = dist > trackWidth / 2;

    if (dist > (trackWidth / 2) + 30) {
      const closestPoint = getClosestPointOnTrack(car.x, car.y, trackPath);
      
      car.x = closestPoint.x;
      car.y = closestPoint.y;
      
      car.velocity.x = 0;
      car.velocity.y = 0;
      
      const tangent = getTangentAtPoint(closestPoint, trackPath);
      if (tangent) {
        car.angle = Math.atan2(tangent.y, tangent.x);
      }

      state.blinkTime = 2.0;
      
      // Snap camera to car immediately on teleport
      state.camera.x = car.x;
      state.camera.y = car.y;
    } else if (isOffRoad) {
      // Gentle speed reduction on track borders / grass (slow down moderately, not excessively)
      const offRoadDrag = Math.pow(0.988, dt * 60);
      car.velocity.x *= offRoadDrag;
      car.velocity.y *= offRoadDrag;
    }
  }

  if (onOffRoad) {
    const speed = Math.hypot(car.velocity.x, car.velocity.y);
    onOffRoad(isOffRoad && speed > 50);
  }

  if (state.scenery) {
    for (let i = state.scenery.length - 1; i >= 0; i--) {
      const obj = state.scenery[i];
      if (obj && obj.type === 'cone') {
        const dist = Math.hypot(car.x - obj.x, car.y - obj.y);
        if (dist < 20) {
           state.scenery.splice(i, 1);
           
           car.velocity.x *= 0.95;
           car.velocity.y *= 0.95;
           
           if (onCollision) onCollision('cone');
        }
      }
    }
  }

  if (isDriftArena) {
    state.lap = 1;
    state.checkpointsPassed = 0;
  } else {
    const finishPoint = isStraightTrackForFinish ? trackPath[trackPath.length - 1] : trackPath[0];
    const nextFinishPoint = isStraightTrackForFinish ? trackPath[trackPath.length - 2] : trackPath[1];
    const distToFinish = Math.hypot(car.x - finishPoint.x, car.y - finishPoint.y);
    
    // Road-aligned finish line plane crossing (ensures wide tracks like Drag Pisti detect laps reliably)
    const segDx = nextFinishPoint.x - finishPoint.x;
    const segDy = nextFinishPoint.y - finishPoint.y;
    const segLen = Math.hypot(segDx, segDy) || 1;
    const dirX = segDx / segLen;
    const dirY = segDy / segLen;
    const perpX = -dirY;
    const perpY = dirX;
    
    const toCarX = car.x - finishPoint.x;
    const toCarY = car.y - finishPoint.y;
    const distAlongTrack = Math.abs(toCarX * dirX + toCarY * dirY);
    const distAcrossTrack = Math.abs(toCarX * perpX + toCarY * perpY);
    
    const isCrossingFinishLine = (distAcrossTrack <= (trackWidth / 2 + 35) && distAlongTrack < 65) || (distToFinish < (trackWidth / 2 + 10));
    // A lap only counts once the car has worked its way round to the last checkpoints; with the old
    // 35% rule a player could turn back halfway and cross the line again.
    const minCheckpointsRequired = Math.max(1, trackPath.length - 3);

    if (isCrossingFinishLine && state.checkpointsPassed >= minCheckpointsRequired) {
      if (state.lap < state.totalLaps) {
        state.lap++;
        state.checkpointsPassed = 0;
      } else if (!state.finished) {
        state.finished = true;
        state.finishTime = state.raceTime;
        state.currentGhostData.push({ x: car.x, y: car.y, angle: car.angle, time: state.raceTime });

        if (!state.finishOrder.find(f => f.id === 'player')) {
          state.finishOrder.push({
            id: 'player',
            name: 'You',
            carName: carStats.name,
            time: state.raceTime
          });
        }
      }
    }
  }
  
  let closestIdx = -1;
  let minD = Infinity;
  trackPath.forEach((p, i) => {
    const d = Math.hypot(car.x - p.x, car.y - p.y);
    if (d < minD) {
      minD = d;
      closestIdx = i;
    }
  });
  
  if (closestIdx > state.checkpointsPassed && closestIdx <= state.checkpointsPassed + 6) {
    state.checkpointsPassed = closestIdx;
  }

  // Dynamic Camera Logic
  // The camera targets a 'Look-Ahead Offset' based on the car's velocity vector.
  // This shows the player more of the road ahead in the direction they are moving.
  const carSpeed = Math.hypot(car.velocity.x, car.velocity.y);
  const maxSpeed = 160 + (carStats.maxSpeed * 2);
  
  // Look-ahead offset: targets a point ahead of the car proportional to its current velocity
  const lookAheadFactor = 0.28; 
  const targetCamX = car.x + car.velocity.x * lookAheadFactor;
  const targetCamY = car.y + car.velocity.y * lookAheadFactor;
  
  // Dynamic smoothing: the 'rubber band' effect.
  // At high speeds, the smoothing factor decreases, causing the camera to lag behind slightly,
  // creating a sense of mass, momentum, and extreme speed.
  const minSmoothing = 2.2; // Laggy at high speed
  const maxSmoothing = 5.8; // Stiff at low speed
  const speedRatio = Math.min(carSpeed / maxSpeed, 1);
  const dynamicSmoothing = lerp(maxSmoothing, minSmoothing, speedRatio);
  
  // Record Ghost Data
  if (state.startTime !== null && !state.finished) {
    const raceTime = state.raceTime;
    // Record every ~100ms to save memory
    const lastData = state.currentGhostData[state.currentGhostData.length - 1];
    if (!lastData || raceTime - lastData.time > 100) {
      state.currentGhostData.push({
        x: car.x,
        y: car.y,
        angle: car.angle,
        time: raceTime
      });
    }
  }

  // Update Ghost Car
  if (state.ghostCar && state.startTime !== null && state.replayGhostData && state.replayGhostData.length > 0) {
    const raceTime = state.raceTime;
    const replayData = state.replayGhostData;
    
    // Find the two points to interpolate between
    let idx = 0;
    while (idx < replayData.length && replayData[idx].time < raceTime) {
      idx++;
    }
    
    if (idx === 0) {
      state.ghostCar.x = replayData[0].x;
      state.ghostCar.y = replayData[0].y;
      state.ghostCar.angle = replayData[0].angle;
    } else if (idx >= replayData.length) {
      const last = replayData[replayData.length - 1];
      state.ghostCar.x = last.x;
      state.ghostCar.y = last.y;
      state.ghostCar.angle = last.angle;
      if (!state.ghostCar.finished) {
        state.ghostCar.finished = true;
        if (!state.finishOrder.find(f => f.id === 'ghost')) {
          state.finishOrder.push({
            id: 'ghost',
            name: 'Ghost',
            carName: state.ghostCar.carStats.name,
            time: last.time
          });
        }
      }
    } else {
      const p1 = replayData[idx - 1];
      const p2 = replayData[idx];
      const t = (raceTime - p1.time) / (p2.time - p1.time);
      
      state.ghostCar.x = lerp(p1.x, p2.x, t);
      state.ghostCar.y = lerp(p1.y, p2.y, t);
      
      // Interpolate angle carefully (handle wrap-around)
      let diff = p2.angle - p1.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      state.ghostCar.angle = p1.angle + diff * t;
    }
  }

  // Smoothly interpolate camera position using the dynamic smoothing factor
  state.camera.x = lerp(state.camera.x, targetCamX, dt * dynamicSmoothing);
  state.camera.y = lerp(state.camera.y, targetCamY, dt * dynamicSmoothing);
}

function checkCarCollisions(allCars: any[], state: GameState) {
  let collisionOccurred = false;
  for (let i = 0; i < allCars.length; i++) {
    for (let j = i + 1; j < allCars.length; j++) {
      const c1 = allCars[i];
      const c2 = allCars[j];
      
      const dx = c2.x - c1.x;
      const dy = c2.y - c1.y;
      const dist = Math.hypot(dx, dy);
      const minDist = c1.radius + c2.radius;
      
      if (dist < minDist) {
        collisionOccurred = true;
        
        // Push cars apart
        const overlap = minDist - dist;
        const nx = dx / dist;
        const ny = dy / dist;
        
        const pushX = nx * overlap * 0.5;
        const pushY = ny * overlap * 0.5;
        
        // Update positions in the state
        if (c1.id === 'player') {
          state.car.x -= pushX;
          state.car.y -= pushY;
        } else {
          const ai = state.aiCars.find(a => a.id === c1.id);
          if (ai) {
            ai.x -= pushX;
            ai.y -= pushY;
          }
        }
        
        if (c2.id === 'player') {
          state.car.x += pushX;
          state.car.y += pushY;
        } else {
          const ai = state.aiCars.find(a => a.id === c2.id);
          if (ai) {
            ai.x += pushX;
            ai.y += pushY;
          }
        }
        
        // Simple elastic collision response
        const v1 = c1.velocity;
        const v2 = c2.velocity;
        
        const relativeVelX = v2.x - v1.x;
        const relativeVelY = v2.y - v1.y;
        
        const velAlongNormal = relativeVelX * nx + relativeVelY * ny;
        
        if (velAlongNormal < 0) {
          const restitution = 0.5;
          const impulse = -(1 + restitution) * velAlongNormal;
          
          const impulseX = impulse * nx;
          const impulseY = impulse * ny;
          
          if (c1.id === 'player') {
            state.car.velocity.x -= impulseX;
            state.car.velocity.y -= impulseY;
          } else {
            const ai = state.aiCars.find(a => a.id === c1.id);
            if (ai) {
              ai.velocity.x -= impulseX;
              ai.velocity.y -= impulseY;
            }
          }
          
          if (c2.id === 'player') {
            state.car.velocity.x += impulseX;
            state.car.velocity.y += impulseY;
          } else {
            const ai = state.aiCars.find(a => a.id === c2.id);
            if (ai) {
              ai.velocity.x += impulseX;
              ai.velocity.y += impulseY;
            }
          }
          
          // Add collision particles
          const collisionX = c1.x + nx * c1.radius;
          const collisionY = c1.y + ny * c1.radius;
          
          for (let k = 0; k < 5; k++) {
            state.particles.push({
              x: collisionX,
              y: collisionY,
              vx: (Math.random() - 0.5) * 100,
              vy: (Math.random() - 0.5) * 100,
              life: 0.3 + Math.random() * 0.3,
              color: '#ffcc00',
              size: 2 + Math.random() * 2
            });
          }
        }
      }
    }
  }
  return collisionOccurred;
}

