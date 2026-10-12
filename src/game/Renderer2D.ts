import { Car } from '../store';
import { GameState } from './PhysicsTypes';
import { TRACK_WIDTH, TRACK_BORDER, getTrackWidth } from './TrackData';
import {
  getGrassPattern,
  getDarkGreenGroundPattern,
  getAsphaltPattern,
  getGrayAsphaltPattern,
  getMidnightAsphaltPattern,
  getDirtPattern,
  getDirtTrackPattern,
} from './RenderPatterns';
import { drawLighting, getScreenVignette } from './RenderUtils';
import { drawSceneryObject } from './RenderScenery';
import { drawCar, prewarmCarSprites, clearCarSprites } from './RenderCar';

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

const trails: Map<string, { left: TrailPoint[], right: TrailPoint[] }> = new Map();

/**
 * Called when the race screen closes. Ground and road patterns are kept: they take a moment
 * to generate and are the same for the next race.
 */
export function resetRenderer() {
  clearCarSprites();
  trails.clear();
}

/** Clears per-race effects (speed trails) when a race restarts. */
export function resetRaceVisuals() {
  trails.clear();
}

export { drawCar, prewarmCarSprites };

/** Builds one path through every point of the track (closed loop). */
function traceTrack(ctx: CanvasRenderingContext2D, trackPath: { x: number, y: number }[], close: boolean) {
  ctx.beginPath();
  ctx.moveTo(trackPath[0].x, trackPath[0].y);
  for (let i = 1; i < trackPath.length; i++) {
    ctx.lineTo(trackPath[i].x, trackPath[i].y);
  }
  if (close) ctx.closePath();
}

export function renderGame(ctx: CanvasRenderingContext2D, state: GameState, carStats: Car, width: number, height: number, trackPath: { x: number, y: number }[], themeColor: string, trackId: string, isNight: boolean = false) {
  const isDarkGreenGround = trackId === 'track-1' || trackId === 'track-drag' || trackId === 'track-2' || trackId === 'track-3';
  const isDriftArena = trackId === 'track-drift-arena';
  const isDirt = trackId === 'track-redoun';
  const isOcean = false; // Drag Strip and Oval Circuit use dark green ground
  
  // Ground background around the track:
  // Drag Strip and Oval Circuit use dedicated dark green ground as requested
  const groundPattern = isDriftArena 
    ? getAsphaltPattern(ctx, isNight)
    : (isDirt 
        ? getDirtPattern(ctx, isNight) 
        : (isDarkGreenGround 
            ? getDarkGreenGroundPattern(ctx, isNight) 
            : getGrassPattern(ctx, isNight)));
  // The patterned ground is drawn in world space below and covers the whole view; a flat fill
  // is only needed while a pattern isn't ready.
  if (!groundPattern) {
    ctx.fillStyle = isDriftArena
      ? (isNight ? '#363a42' : '#4a505b')
      : (isDirt
          ? (isNight ? '#260f03' : '#78350f')
          : (isDarkGreenGround
              ? (isNight ? '#091c0e' : '#153d20')
              : (isNight ? '#0e2b14' : '#26732a')));
    ctx.fillRect(0, 0, width, height);
  }

  ctx.save();
  
  const speed = Math.hypot(state.car.velocity.x, state.car.velocity.y);
  let shakeX = 0;
  let shakeY = 0;
  if (speed > 80) {
    // Yüksek hız ekran titremesi yumuşatıldı ve azaltıldı
    const speedRatio = Math.min(1.0, (speed - 80) / 180);
    const intensity = Math.pow(speedRatio, 1.3) * 1.45;
    const now = performance.now() * 0.001;
    
    const rumbleX = Math.sin(now * 38) * (intensity * 0.4);
    const rumbleY = Math.cos(now * 32) * (intensity * 0.4);
    const jitterX = (Math.random() - 0.5) * (intensity * 0.45);
    const jitterY = (Math.random() - 0.5) * (intensity * 0.45);
    
    shakeX = rumbleX + jitterX;
    shakeY = rumbleY + jitterY;
  }

  // Dynamic Camera Zoom: Widens (zooms out) as speed increases, narrows (zooms in close) when slow
  const maxSpeedForZoom = 260;
  const slowZoom = 1.06; // Narrows in slightly when slowing down / stopped
  const fastZoom = 0.74; // Expands / pulls back moderately at high speed
  const speedRatio = Math.min(speed, maxSpeedForZoom) / maxSpeedForZoom;
  const speedZoom = slowZoom - Math.pow(speedRatio, 0.95) * (slowZoom - fastZoom);
  
  // Combine speed zoom with state zoom (for intro and near/default/far camera modes)
  const finalZoom = speedZoom * (state.camera.zoom || 1);

  ctx.translate(width / 2 + shakeX, height / 2 + shakeY);
  ctx.scale(finalZoom, finalZoom);
  ctx.translate(-state.camera.x, -state.camera.y);

  const viewW = (width / finalZoom) + 800;
  const viewH = (height / finalZoom) + 800;
  const viewX = state.camera.x - viewW / 2;
  const viewY = state.camera.y - viewH / 2;
  // What is actually on screen (plus a small margin for shake and object size)
  const screenHalfW = width / finalZoom / 2 + 40;
  const screenHalfH = height / finalZoom / 2 + 40;
  const isOnScreen = (x: number, y: number, radius: number) =>
    Math.abs(x - state.camera.x) < screenHalfW + radius && Math.abs(y - state.camera.y) < screenHalfH + radius;

  // Render seamless world carpet / ocean around camera viewport
  if (groundPattern) {
    ctx.save();
    if (isOcean && typeof DOMMatrix !== 'undefined') {
      const time = performance.now() * 0.001;
      const waveShiftX = Math.sin(time * 0.6) * 16 + (time * 8) % 512;
      const waveShiftY = Math.cos(time * 0.45) * 12 + (time * 5) % 512;
      const mat = new DOMMatrix();
      mat.translateSelf(waveShiftX, waveShiftY);
      groundPattern.setTransform(mat);
    }
    ctx.fillStyle = groundPattern;
    ctx.fillRect(viewX, viewY, viewW, viewH);
    ctx.restore();
  }

  // Ocean Wave Animations (Gentle swells & shimmering ripples)
  if (isOcean) {
    ctx.save();
    const time = performance.now() * 0.001;
    
    // Wave Layer 1: Gentle rolling swells
    const waveCount = 12;
    const waveSpacing = (viewW + viewH) / waveCount;
    const wavePhase = (time * 26) % waveSpacing;
    const cosW = Math.cos(0.42);
    const sinW = Math.sin(0.42);
    
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    
    for (let i = -2; i < waveCount + 3; i++) {
      const offset = i * waveSpacing - wavePhase;
      const waveAlpha = 0.09 + Math.sin(i * 0.9 + time * 1.3) * 0.04;
      
      ctx.strokeStyle = isNight 
        ? `rgba(130, 195, 255, ${waveAlpha * 0.55})` 
        : `rgba(240, 248, 255, ${waveAlpha})`;
      
      ctx.beginPath();
      const startX = viewX - 200 + offset * cosW;
      const startY = viewY - 200 + offset * sinW;
      
      const waveLength = Math.max(viewW, viewH) * 1.5;
      const steps = 14;
      const stepLen = waveLength / steps;
      
      for (let s = 0; s <= steps; s++) {
        const distAlong = s * stepLen;
        const px = startX - distAlong * sinW;
        const py = startY + distAlong * cosW;
        const ripple = Math.sin(s * 0.75 + time * 2.2 + i * 1.2) * 12;
        const finalX = px + cosW * ripple;
        const finalY = py + sinW * ripple;
        
        if (s === 0) ctx.moveTo(finalX, finalY);
        else ctx.lineTo(finalX, finalY);
      }
      ctx.stroke();
    }

    // Wave Layer 2: Glittering crest highlights
    ctx.lineWidth = 3.5;
    for (let i = -1; i < waveCount + 2; i++) {
      const offset = i * waveSpacing - wavePhase + 12;
      const waveAlpha = 0.15 + Math.cos(i * 1.2 + time * 1.6) * 0.06;
      ctx.strokeStyle = `rgba(255, 255, 255, ${isNight ? waveAlpha * 0.45 : waveAlpha})`;
      
      ctx.beginPath();
      const startX = viewX - 150 + offset * cosW;
      const startY = viewY - 150 + offset * sinW;
      const waveLength = Math.max(viewW, viewH) * 1.4;
      const steps = 10;
      const stepLen = waveLength / steps;
      
      for (let s = 0; s <= steps; s++) {
        const distAlong = s * stepLen;
        const px = startX - distAlong * sinW;
        const py = startY + distAlong * cosW;
        const ripple = Math.sin(s * 0.75 + time * 2.2 + i * 1.2) * 12;
        const finalX = px + cosW * ripple;
        const finalY = py + sinW * ripple;
        
        if (s === 0) ctx.moveTo(finalX, finalY);
        else ctx.lineTo(finalX, finalY);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  const trackWidth = getTrackWidth(trackId);

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (trackId !== 'track-drift-arena') {
    if (trackId === 'track-redoun') {
      // Redoun Dirt Rally Track (Toprak Zemin)
      traceTrack(ctx, trackPath, true);
      // Soft edge: a wider translucent stroke instead of a whole-track shadowBlur (very slow on phones)
      ctx.lineWidth = trackWidth + TRACK_BORDER * 2.2 + 8;
      ctx.strokeStyle = isNight ? 'rgba(30, 10, 2, 0.3)' : 'rgba(120, 53, 15, 0.25)';
      ctx.stroke();
      ctx.lineWidth = trackWidth + TRACK_BORDER * 2.2;
      ctx.strokeStyle = isNight ? '#451a03' : '#78350f'; // Dark packed earth embankment
      ctx.stroke();

      // Inner compacted clay shoulder
      ctx.lineWidth = trackWidth + 14;
      ctx.strokeStyle = isNight ? '#592004' : '#92400e';
      ctx.stroke();

      // Main packed gravel/dirt rally road surface
      ctx.lineWidth = trackWidth;
      const dirtRoad = getDirtTrackPattern(ctx, isNight);
      ctx.strokeStyle = dirtRoad || (isNight ? '#451a03' : '#b45309');
      ctx.stroke();

      // Centerline packed dirt groove / rally driving line
      ctx.lineWidth = trackWidth * 0.42;
      ctx.strokeStyle = isNight ? 'rgba(35, 12, 3, 0.45)' : 'rgba(80, 28, 8, 0.32)';
      ctx.stroke();
    } else {
      // Track Outer Border (Soft off-white border). The soft glow is a wider translucent stroke
      // instead of a whole-track shadowBlur (very slow on phones).
      traceTrack(ctx, trackPath, true);
      ctx.lineWidth = trackWidth + TRACK_BORDER * 2 + 10;
      ctx.strokeStyle = isNight ? 'rgba(220, 220, 225, 0.16)' : 'rgba(200, 200, 210, 0.14)';
      ctx.stroke();

      // Track Inner Border Lines (Soft off-white)
      ctx.lineWidth = trackWidth + TRACK_BORDER * 2;
      ctx.strokeStyle = '#e4e4e7';
      ctx.stroke();

      // Racetrack road texture
      // Drag Strip & Oval Circuit use dedicated clean GRAY asphalt as requested
      // Midnight Grand Prix uses dedicated sleek night street circuit asphalt
      ctx.lineWidth = trackWidth;
      let road: CanvasPattern | null = null;
      if (trackId === 'track-1' || trackId === 'track-drag') {
        road = getGrayAsphaltPattern(ctx, isNight);
      } else if (trackId === 'track-night') {
        road = getMidnightAsphaltPattern(ctx, isNight);
      } else {
        road = getGrayAsphaltPattern(ctx, isNight);
      }

      if (road) {
        ctx.strokeStyle = road;
      } else {
        if (trackId === 'track-1' || trackId === 'track-drag') {
          ctx.strokeStyle = isNight ? '#464d57' : '#666e7a'; // Distinct gray fallback
        } else if (trackId === 'track-night') {
          ctx.strokeStyle = isNight ? '#252932' : '#2e3440'; // Sleek dark slate
        } else {
          ctx.strokeStyle = isNight ? '#363a42' : '#4a505b';
        }
      }
      ctx.stroke();

      // (The road colour wash used to be a second full-width stroke here; it is now baked into the patterns.)

      // Drag Track Center Lane Divider and Speed Trap Markings
      if (trackId === 'track-drag') {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 3.5;
        ctx.setLineDash([30, 25]);
        ctx.beginPath();
        ctx.moveTo(trackPath[0].x, trackPath[0].y);
        for (let i = 1; i < trackPath.length; i++) {
          ctx.lineTo(trackPath[i].x, trackPath[i].y);
        }
        ctx.closePath();
        ctx.stroke();

        // Staging lane lines at start line
        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)'; // Yellow staging lines
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Left lane box line
        ctx.moveTo(300, -55);
        ctx.lineTo(400, -55);
        // Right lane box line
        ctx.moveTo(300, 55);
        ctx.lineTo(400, 55);
        ctx.stroke();

        ctx.restore();
      }
    }
  }

  // Draw Transformation Zones
  if (state.isRandomMode && state.transformationZones) {
    state.transformationZones.forEach(zone => {
      if (!isOnScreen(zone.x, zone.y, Math.max(zone.width, zone.height))) return;
      ctx.save();
      ctx.translate(zone.x, zone.y);
      ctx.rotate(zone.rotation);

      // Glow effect (translucent outline instead of shadowBlur)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 10;
      ctx.strokeRect(-zone.width / 2, -zone.height / 2, zone.width, zone.height);

      // Rectangular area
      const gradient = ctx.createLinearGradient(-zone.width/2, 0, zone.width/2, 0);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

      ctx.fillStyle = gradient;
      ctx.fillRect(-zone.width / 2, -zone.height / 2, zone.width, zone.height);

      // Borders
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.strokeRect(-zone.width / 2, -zone.height / 2, zone.width, zone.height);

      ctx.restore();
    });
  }

  // Draw skid marks: marks that share a colour and opacity go into one path (one stroke instead of hundreds)
  ctx.save();
  const isDirtTrack = trackId === 'track-redoun';
  const defaultSkidColor = isDirtTrack ? 'rgba(52, 24, 7, 0.95)' : 'rgba(0, 0, 0, 1)';
  ctx.lineWidth = isDirtTrack ? 7 : 6;
  ctx.lineCap = 'round';
  let batchColor = '';
  let batchAlpha = -1;
  let batchOpen = false;
  for (const s of state.skidMarks) {
    if (!isOnScreen(s.x1, s.y1, 20)) continue;
    const color = s.color || defaultSkidColor;
    const alpha = Math.round(s.opacity * 50) / 50;
    if (color !== batchColor || alpha !== batchAlpha) {
      if (batchOpen) ctx.stroke();
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      batchColor = color;
      batchAlpha = alpha;
      ctx.beginPath();
      batchOpen = true;
    }
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(s.x2, s.y2);
  }
  if (batchOpen) ctx.stroke();
  ctx.restore();

  // Draw Tire Marks (Permanent/Weathered)
  ctx.save();
  ctx.strokeStyle = trackId === 'track-redoun' ? 'rgba(50, 18, 4, 0.38)' : 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = trackId === 'track-redoun' ? 16 : 12;
  ctx.setLineDash([20, 60]);
  traceTrack(ctx, trackPath, false);
  ctx.stroke();
  ctx.restore();

  // Helper to draw a start/finish line accurately aligned to road segment
  const drawStartFinishLine = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
    ctx.save();
    ctx.translate(p1.x, p1.y);
    
    // Align with the road segment direction
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    ctx.rotate(angle);
    
    const numCols = Math.max(12, Math.round(trackWidth / 10));
    const colWidth = trackWidth / numCols;
    const rowDepth = 8;
    const startY = -trackWidth / 2;

    // Dark base under checkers
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-rowDepth, startY, rowDepth * 2, trackWidth);

    // 2-row checkerboard
    for (let row = 0; row < 2; row++) {
      const rx = -rowDepth + row * rowDepth;
      for (let col = 0; col < numCols; col++) {
        const ry = startY + col * colWidth;
        const isWhite = (row + col) % 2 === 0;
        ctx.fillStyle = isWhite ? '#ffffff' : '#18181b';
        ctx.fillRect(rx, ry, rowDepth, colWidth);
      }
    }

    // Outer finish line borders
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-rowDepth, startY);
    ctx.lineTo(-rowDepth, startY + trackWidth);
    ctx.moveTo(rowDepth, startY);
    ctx.lineTo(rowDepth, startY + trackWidth);
    ctx.stroke();

    ctx.restore();
  };

  // Draw start/finish line at start node aligned with the straight start segment
  if (trackId !== 'track-drift-arena') {
    drawStartFinishLine(trackPath[0], trackPath[1]);
  }

  if (state.scenery) {
    // Only what is on screen (the old margin drew most of a small track every frame)
    for (const obj of state.scenery) {
      if (isOnScreen(obj.x, obj.y, 90 * obj.scale)) {
        drawSceneryObject(ctx, obj);
      }
    }
  }

  ctx.save();
  for (const p of state.particles) {
    if (!isOnScreen(p.x, p.y, p.size)) continue;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Update and draw trails
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.lineCap = 'round';
  ctx.lineWidth = 3;

  const updateAndDrawTrail = (id: string, carX: number, carY: number, carAngle: number, carSpeed: number) => {
    let carTrails = trails.get(id);
    if (!carTrails) {
      carTrails = { left: [], right: [] };
      trails.set(id, carTrails);
    }

    const cos = Math.cos(carAngle);
    const sin = Math.sin(carAngle);
    
    const leftX = carX + (-22 * cos - (-8) * sin);
    const leftY = carY + (-22 * sin + (-8) * cos);
    
    const rightX = carX + (-22 * cos - 6 * sin);
    const rightY = carY + (-22 * sin + 6 * cos);

    if (carSpeed > 100) {
      const trailAlpha = Math.min((carSpeed - 100) / 150, 0.9);
      
      // Check for teleportation (distance > 1000)
      if (carTrails.left.length > 0) {
        const lastP = carTrails.left[carTrails.left.length - 1];
        const dist = Math.hypot(leftX - lastP.x, leftY - lastP.y);
        if (dist > 1000) {
          carTrails.left = [];
          carTrails.right = [];
        }
      }
      
      carTrails.left.push({ x: leftX, y: leftY, alpha: trailAlpha });
      carTrails.right.push({ x: rightX, y: rightY, alpha: trailAlpha });
    }

    // Update alphas and filter
    carTrails.left.forEach(p => p.alpha -= 0.15);
    carTrails.right.forEach(p => p.alpha -= 0.15);
    carTrails.left = carTrails.left.filter(p => p.alpha > 0);
    carTrails.right = carTrails.right.filter(p => p.alpha > 0);

    // Draw left trail
    if (carTrails.left.length > 1) {
      ctx.beginPath();
      ctx.moveTo(carTrails.left[0].x, carTrails.left[0].y);
      for (let i = 1; i < carTrails.left.length - 1; i++) {
        const p1 = carTrails.left[i];
        const p2 = carTrails.left[i + 1];
        const xc = (p1.x + p2.x) / 2;
        const yc = (p1.y + p2.y) / 2;
        ctx.strokeStyle = `rgba(255, 50, 50, ${p1.alpha})`;
        ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(xc, yc);
      }
      // Connect to current position if speed > 100
      if (carSpeed > 100) {
        const lastP = carTrails.left[carTrails.left.length - 1];
        ctx.strokeStyle = `rgba(255, 50, 50, ${lastP.alpha})`;
        ctx.lineTo(leftX, leftY);
        ctx.stroke();
      }
    }

    // Draw right trail
    if (carTrails.right.length > 1) {
      ctx.beginPath();
      ctx.moveTo(carTrails.right[0].x, carTrails.right[0].y);
      for (let i = 1; i < carTrails.right.length - 1; i++) {
        const p1 = carTrails.right[i];
        const p2 = carTrails.right[i + 1];
        const xc = (p1.x + p2.x) / 2;
        const yc = (p1.y + p2.y) / 2;
        ctx.strokeStyle = `rgba(255, 50, 50, ${p1.alpha})`;
        ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(xc, yc);
      }
      // Connect to current position if speed > 100
      if (carSpeed > 100) {
        const lastP = carTrails.right[carTrails.right.length - 1];
        ctx.strokeStyle = `rgba(255, 50, 50, ${lastP.alpha})`;
        ctx.lineTo(rightX, rightY);
        ctx.stroke();
      }
    }
  };

  updateAndDrawTrail('player', state.car.x, state.car.y, state.car.angle, speed);

  if (state.aiCars) {
    for (const aiCar of state.aiCars) {
       const aiSpeed = Math.hypot(aiCar.velocity.x, aiCar.velocity.y);
       updateAndDrawTrail(aiCar.id, aiCar.x, aiCar.y, aiCar.angle, aiSpeed);
    }
  }
  
  ctx.restore(); // Restore from trail drawing settings

  drawLighting(ctx, state.car.x, state.car.y, width, height, isNight);

  if (state.aiCars) {
    const carReach = isNight ? 330 : 70; // headlight beams reach far ahead at night
    for (const aiCar of state.aiCars) {
       if (!isOnScreen(aiCar.x, aiCar.y, carReach)) continue;
       const aiSpeed = Math.hypot(aiCar.velocity.x, aiCar.velocity.y);
       drawCar(ctx, aiCar.carStats, aiCar.x, aiCar.y, aiCar.angle, aiCar.visualScale || 1, isNight, aiSpeed, false, aiCar.blinkTime, state.scenery, aiCar.isNitroActive);
    }
  }

  if (state.ghostCar && !state.ghostCar.finished) {
    ctx.save();
    ctx.globalAlpha = 0.4;
    drawCar(ctx, state.ghostCar.carStats, state.ghostCar.x, state.ghostCar.y, state.ghostCar.angle, 1, isNight, 0, false, 0, state.scenery);
    ctx.restore();
  }

  const isPlayerNitroFiring = !!(state.isNitroActive && (state.nitro || 0) > 0);
  const playerVisualScale = state.car.visualScale || 1.0;
  drawCar(ctx, carStats, state.car.x, state.car.y, state.car.angle, playerVisualScale, isNight, speed, state.controlValues.brake > 0.1, state.blinkTime, state.scenery, isPlayerNitroFiring);
  
  // Aerodynamic Slipstream / Draft Visual Streamlines
  if (state.car.draftIntensity && state.car.draftIntensity > 0.10) {
    ctx.save();
    ctx.translate(state.car.x, state.car.y);
    ctx.rotate(state.car.angle);
    
    const draftAlpha = Math.min(0.55, (state.car.draftIntensity - 0.08) * 0.7);
    const time = performance.now() * 0.02;
    
    ctx.strokeStyle = `rgba(186, 230, 253, ${draftAlpha.toFixed(3)})`;
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    
    // Left and right subtle aerodynamic air streamline streaks
    [-11, 11].forEach((sideY, idx) => {
      const shift = Math.sin(time * 1.8 + idx * 2.5) * 5;
      ctx.beginPath();
      ctx.moveTo(-28 + shift, sideY);
      ctx.lineTo(24, sideY);
      ctx.stroke();
    });
    ctx.restore();
  }
  
  // Dynamic Side Speed Lines & Edge Glow (Glow ve çizgili efekt azaltıldı)
  if (speed > 60) {
    ctx.save();
    ctx.resetTransform();

    const speedRatio = Math.min(1.5, (speed - 60) / 180);
    const alpha = Math.min(1, Math.pow(speedRatio, 1.15));

    // 1. Soft subtle edge glow (belirginliği ve genişliği azaltıldı)
    const glowWidth = Math.min(140, width * 0.10);

    // Left glow
    const leftGlow = ctx.createLinearGradient(0, 0, glowWidth, 0);
    const glowColor = isNight ? 'rgba(96, 165, 250,' : 'rgba(219, 234, 254,';
    leftGlow.addColorStop(0, `${glowColor} ${(alpha * 0.16).toFixed(3)})`);
    leftGlow.addColorStop(0.5, `${glowColor} ${(alpha * 0.06).toFixed(3)})`);
    leftGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = leftGlow;
    ctx.fillRect(0, 0, glowWidth, height);

    // Right glow
    const rightGlow = ctx.createLinearGradient(width, 0, width - glowWidth, 0);
    rightGlow.addColorStop(0, `${glowColor} ${(alpha * 0.16).toFixed(3)})`);
    rightGlow.addColorStop(0.5, `${glowColor} ${(alpha * 0.06).toFixed(3)})`);
    rightGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rightGlow;
    ctx.fillRect(width - glowWidth, 0, glowWidth, height);

    // 2. Translucent speed blur sheen bands along left & right edges
    const sheenWidth = Math.min(180, width * 0.14);
    const leftSheen = ctx.createLinearGradient(0, 0, sheenWidth, 0);
    leftSheen.addColorStop(0, `rgba(255, 255, 255, ${(alpha * 0.16).toFixed(3)})`);
    leftSheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = leftSheen;
    ctx.fillRect(0, 0, sheenWidth, height);

    const rightSheen = ctx.createLinearGradient(width, 0, width - sheenWidth, 0);
    rightSheen.addColorStop(0, `rgba(255, 255, 255, ${(alpha * 0.16).toFixed(3)})`);
    rightSheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = rightSheen;
    ctx.fillRect(width - sheenWidth, 0, sheenWidth, height);

    // 3. Subtle speed streak lines (Çizgili efekt belirgin şekilde azaltıldı)
    const numLines = Math.floor(3 + alpha * 6); // Only 3 to 9 subtle lines
    const maxLineLen = Math.min(width * 0.18, 40 + alpha * 90);

    ctx.lineCap = 'round';

    for (let i = 0; i < numLines; i++) {
      // Left streak
      const yLeft = Math.random() * height;
      const lenLeft = 30 + Math.random() * maxLineLen;
      const startXLeft = Math.random() * (width * 0.02);
      const endXLeft = startXLeft + lenLeft;
      const dyLeft = (height / 2 - yLeft) * 0.02;

      const lineAlphaL = (0.08 + Math.random() * 0.22) * alpha;
      ctx.lineWidth = 0.75 + Math.random() * 1.2;
      ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlphaL.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(startXLeft, yLeft);
      ctx.lineTo(endXLeft, yLeft + dyLeft);
      ctx.stroke();

      // Right streak
      const yRight = Math.random() * height;
      const lenRight = 30 + Math.random() * maxLineLen;
      const startXRight = width - Math.random() * (width * 0.02);
      const endXRight = startXRight - lenRight;
      const dyRight = (height / 2 - yRight) * 0.02;

      const lineAlphaR = (0.08 + Math.random() * 0.22) * alpha;
      ctx.lineWidth = 0.75 + Math.random() * 1.2;
      ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlphaR.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(startXRight, yRight);
      ctx.lineTo(endXRight, yRight + dyRight);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Cinematic Color Grading & Post-Processing
  ctx.save();
  ctx.resetTransform();
  
  // High-contrast cinematic grade
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = isNight ? 'rgba(0, 50, 150, 0.05)' : 'rgba(255, 150, 0, 0.05)';
  ctx.fillRect(0, 0, width, height);
  
  // Subtle blue/teal shadows for cinematic look
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(0, 20, 40, 0.05)';
  ctx.fillRect(0, 0, width, height);
  
  // Vignette (Enhanced)
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = getScreenVignette(ctx, width, height);
  ctx.fillRect(0, 0, width, height);
  
  ctx.restore();

  ctx.restore();
}

