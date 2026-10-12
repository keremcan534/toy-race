import grassImgSrc from '../assets/grass.webp';
import asphaltImgSrc from '../assets/asphalt5.webp';

// Pattern Caches (kept for the whole session: generating them takes a noticeable moment)
let grassPatternDay: CanvasPattern | null = null;
let grassPatternNight: CanvasPattern | null = null;
let darkGreenGroundPatternDay: CanvasPattern | null = null;
let darkGreenGroundPatternNight: CanvasPattern | null = null;
let asphaltPatternDay: CanvasPattern | null = null;
let asphaltPatternNight: CanvasPattern | null = null;
let grayAsphaltPatternDay: CanvasPattern | null = null;
let grayAsphaltPatternNight: CanvasPattern | null = null;
let midnightAsphaltPatternDay: CanvasPattern | null = null;
let midnightAsphaltPatternNight: CanvasPattern | null = null;
let dirtPatternDay: CanvasPattern | null = null;
let dirtPatternNight: CanvasPattern | null = null;
let dirtTrackPatternDay: CanvasPattern | null = null;
let dirtTrackPatternNight: CanvasPattern | null = null;

// Images
let grassImage: HTMLImageElement | null = null;
let asphaltImage: HTMLImageElement | null = null;

function setupImage(src: string, onLoaded: () => void): HTMLImageElement {
  const img = new Image();
  img.onload = onLoaded;
  img.src = src;
  return img;
}

function initImages() {
  if (typeof window === 'undefined') return;

  if (!grassImage) {
    grassImage = setupImage(grassImgSrc, () => {
      grassPatternDay = null;
      grassPatternNight = null;
    });
  }

  if (!asphaltImage) {
    asphaltImage = setupImage(asphaltImgSrc, () => {
      asphaltPatternDay = null;
      asphaltPatternNight = null;
      grayAsphaltPatternDay = null;
      grayAsphaltPatternNight = null;
      midnightAsphaltPatternDay = null;
      midnightAsphaltPatternNight = null;
    });
  }
}

// Immediately trigger image load
initImages();

export function getGrassPattern(ctx: CanvasRenderingContext2D, isNight: boolean = false): CanvasPattern | null {
  initImages();

  if (isNight && grassPatternNight) return grassPatternNight;
  if (!isNight && grassPatternDay) return grassPatternDay;

  // 1. Use user's uploaded grass.jpg texture if loaded
  if (grassImage && grassImage.complete && grassImage.naturalWidth > 0) {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = grassImage.naturalWidth;
      canvas.height = grassImage.naturalHeight;
      const pCtx = canvas.getContext('2d');
      if (pCtx) {
        pCtx.drawImage(grassImage, 0, 0);
        if (isNight) {
          pCtx.fillStyle = 'rgba(5, 20, 10, 0.65)';
          pCtx.fillRect(0, 0, canvas.width, canvas.height);
          grassPatternNight = ctx.createPattern(canvas, 'repeat');
          return grassPatternNight;
        } else {
          grassPatternDay = ctx.createPattern(canvas, 'repeat');
          return grassPatternDay;
        }
      }
    } catch (e) {
      console.warn('Could not create grass pattern:', e);
    }
  }

  // 2. Fallback to procedural lush green meadow turf
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 256;
  patternCanvas.height = 256;
  const pCtx = patternCanvas.getContext('2d');
  if (!pCtx) return null;

  const baseGrad = pCtx.createLinearGradient(0, 0, 256, 256);
  if (isNight) {
    baseGrad.addColorStop(0, '#0c2214');
    baseGrad.addColorStop(0.5, '#0e2918');
    baseGrad.addColorStop(1, '#091c10');
  } else {
    baseGrad.addColorStop(0, '#2e7d32');
    baseGrad.addColorStop(0.35, '#388e3c');
    baseGrad.addColorStop(0.7, '#2e7d32');
    baseGrad.addColorStop(1, '#1b5e20');
  }
  pCtx.fillStyle = baseGrad;
  pCtx.fillRect(0, 0, 256, 256);

  const pat = ctx.createPattern(patternCanvas, 'repeat');
  if (isNight) grassPatternNight = pat;
  else grassPatternDay = pat;
  return pat;
}

/**
 * Dedicated Dark Green Ground pattern crafted specifically for Drag Strip (track-drag)
 * and Oval Circuit (track-1).
 * Rich, sophisticated deep forest / dark racing green turf with fine mowing stripes,
 * micro-fiber aggregate texture, and seamless tiling. (Darker shade of green as requested).
 */
export function getDarkGreenGroundPattern(ctx: CanvasRenderingContext2D, isNight: boolean = false): CanvasPattern | null {
  initImages();

  if (isNight && darkGreenGroundPatternNight) return darkGreenGroundPatternNight;
  if (!isNight && darkGreenGroundPatternDay) return darkGreenGroundPatternDay;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const pCtx = canvas.getContext('2d');
  if (!pCtx) return null;

  // 1. Rich deep dark green base gradient (distinguishable darker green tone)
  const grad = pCtx.createLinearGradient(0, 0, 512, 512);
  if (isNight) {
    grad.addColorStop(0, '#091c0e');
    grad.addColorStop(0.35, '#0c2413');
    grad.addColorStop(0.7, '#081a0d');
    grad.addColorStop(1, '#0b2111');
  } else {
    // Elegant darker green (not neon/lawn, but deep forest/racing green)
    grad.addColorStop(0, '#153d20');
    grad.addColorStop(0.3, '#194726');
    grad.addColorStop(0.65, '#133a1e');
    grad.addColorStop(1, '#174223');
  }
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, 512, 512);

  // 2. Subtle directional mowing/compaction stripes (darker green bands)
  const stripeW = 64;
  for (let x = 0; x < 512; x += stripeW * 2) {
    pCtx.fillStyle = isNight ? 'rgba(4, 14, 7, 0.28)' : 'rgba(12, 36, 18, 0.22)';
    pCtx.fillRect(x, 0, stripeW, 512);
  }

  // 3. Subtle horizontal roller cross-grain
  for (let y = 0; y < 512; y += 32) {
    pCtx.fillStyle = isNight ? 'rgba(5, 18, 9, 0.15)' : 'rgba(14, 42, 22, 0.12)';
    pCtx.fillRect(0, y, 512, 12);
  }

  // 4. Procedural deep green tactile texture & granular specs
  const speckCount = isNight ? 5000 : 9000;
  for (let i = 0; i < speckCount; i++) {
    const sx = Math.random() * 512;
    const sy = Math.random() * 512;
    const rand = Math.random();
    const len = 1.2 + Math.random() * 2.5;
    const angle = (Math.random() - 0.5) * 0.9 - Math.PI / 2;

    let col = '';
    if (isNight) {
      col = rand > 0.6
        ? 'rgba(14, 40, 20, 0.45)'
        : rand > 0.3
        ? 'rgba(8, 24, 12, 0.55)'
        : 'rgba(20, 55, 28, 0.3)';
    } else {
      col = rand > 0.7
        ? 'rgba(32, 90, 48, 0.45)'  // Dark emerald accent
        : rand > 0.4
        ? 'rgba(22, 65, 34, 0.55)'  // Mid dark-turf fiber
        : rand > 0.15
        ? 'rgba(14, 42, 22, 0.6)'   // Deep shadow fiber
        : 'rgba(38, 102, 54, 0.35)'; // Dark spruce highlight
    }

    pCtx.strokeStyle = col;
    pCtx.lineWidth = Math.random() > 0.75 ? 1.5 : 1;
    pCtx.beginPath();
    pCtx.moveTo(sx, sy);
    pCtx.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
    pCtx.stroke();
  }

  // 5. Fine organic moss & micro-earth flecks for authenticity
  for (let i = 0; i < 900; i++) {
    const fx = Math.random() * 512;
    const fy = Math.random() * 512;
    const r = Math.random();
    pCtx.fillStyle = isNight 
      ? 'rgba(4, 12, 6, 0.4)' 
      : (r > 0.5 ? 'rgba(12, 34, 18, 0.45)' : 'rgba(26, 74, 38, 0.35)');
    pCtx.fillRect(fx, fy, 1.5, 1.5);
  }

  const pat = ctx.createPattern(canvas, 'repeat');
  if (isNight) darkGreenGroundPatternNight = pat;
  else darkGreenGroundPatternDay = pat;
  return pat;
}

export function getAsphaltPattern(ctx: CanvasRenderingContext2D, isNight: boolean = false): CanvasPattern | null {
  initImages();

  if (isNight && asphaltPatternNight) return asphaltPatternNight;
  if (!isNight && asphaltPatternDay) return asphaltPatternDay;

  const targetImg = asphaltImage;

  if (targetImg && targetImg.complete && targetImg.naturalWidth > 0) {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = targetImg.naturalWidth;
      canvas.height = targetImg.naturalHeight;
      const pCtx = canvas.getContext('2d');
      if (pCtx) {
        pCtx.drawImage(targetImg, 0, 0);
        if (isNight) {
          pCtx.fillStyle = 'rgba(30, 35, 45, 0.45)';
          pCtx.fillRect(0, 0, canvas.width, canvas.height);
          asphaltPatternNight = ctx.createPattern(canvas, 'repeat');
          return asphaltPatternNight;
        } else {
          asphaltPatternDay = ctx.createPattern(canvas, 'repeat');
          return asphaltPatternDay;
        }
      }
    } catch (e) {
      console.warn('Could not create asphalt pattern:', e);
    }
  }

  // Fallback procedural asphalt with realistic gray tone
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 256;
  patternCanvas.height = 256;
  const pCtx = patternCanvas.getContext('2d');
  if (!pCtx) return null;

  pCtx.fillStyle = isNight ? '#363b43' : '#4d535e';
  pCtx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const gray = 65 + Math.random() * 45;
    const size = Math.random() > 0.9 ? 2 : 1;
    pCtx.fillStyle = `rgb(${gray}, ${gray + 2}, ${gray + 4})`;
    pCtx.globalAlpha = 0.4 + Math.random() * 0.3;
    pCtx.fillRect(x, y, size, size);
  }

  const pat = ctx.createPattern(patternCanvas, 'repeat');
  if (isNight) asphaltPatternNight = pat;
  else asphaltPatternDay = pat;
  return pat;
}

/**
 * Dedicated clean GRAY asphalt surface pattern crafted for Drag Strip (track-drag)
 * and Oval Circuit (track-1). Realistic stone aggregate gray with micro-granular flecks.
 */
export function getGrayAsphaltPattern(ctx: CanvasRenderingContext2D, isNight: boolean = false): CanvasPattern | null {
  initImages();

  if (isNight && grayAsphaltPatternNight) return grayAsphaltPatternNight;
  if (!isNight && grayAsphaltPatternDay) return grayAsphaltPatternDay;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const pCtx = canvas.getContext('2d');
  if (!pCtx) return null;

  // 1. Base authentic medium-light racetrack gray tone
  const baseGrad = pCtx.createLinearGradient(0, 0, 512, 512);
  if (isNight) {
    baseGrad.addColorStop(0, '#434a54');
    baseGrad.addColorStop(0.3, '#4a525d');
    baseGrad.addColorStop(0.7, '#414852');
    baseGrad.addColorStop(1, '#48505b');
  } else {
    baseGrad.addColorStop(0, '#666e7a');
    baseGrad.addColorStop(0.3, '#6d7582');
    baseGrad.addColorStop(0.7, '#646c77');
    baseGrad.addColorStop(1, '#6b7380');
  }
  pCtx.fillStyle = baseGrad;
  pCtx.fillRect(0, 0, 512, 512);

  // 2. Subtle directional compaction roller stripes
  for (let y = 0; y < 512; y += 18) {
    pCtx.fillStyle = isNight ? 'rgba(30, 35, 42, 0.14)' : 'rgba(75, 82, 92, 0.16)';
    pCtx.fillRect(0, y, 512, 7);
  }

  // 3. Blend asphalt photo texture if available for stone displacement depth
  const photoImg = (asphaltImage && asphaltImage.complete && asphaltImage.naturalWidth > 0) ? asphaltImage : null;

  if (photoImg) {
    pCtx.save();
    pCtx.globalAlpha = 0.25;
    pCtx.drawImage(photoImg, 0, 0, 512, 512);
    pCtx.restore();
  }

  // 4. Crushed granite & mineral aggregate flecks for genuine gray asphalt grain
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const rand = Math.random();
    const size = rand > 0.94 ? 2.2 : (rand > 0.8 ? 1.6 : 1);

    if (rand < 0.38) {
      // Light quartz/granite flecks (distinct crisp light gray accents)
      const lightGray = isNight ? (140 + Math.random() * 35) : (185 + Math.random() * 50);
      pCtx.fillStyle = `rgba(${lightGray}, ${lightGray + 2}, ${lightGray + 4}, 0.55)`;
    } else if (rand < 0.72) {
      // Medium stone aggregate
      const midGray = isNight ? (85 + Math.random() * 25) : (120 + Math.random() * 32);
      pCtx.fillStyle = `rgba(${midGray}, ${midGray}, ${midGray + 2}, 0.5)`;
    } else {
      // Darker bitumen binder specks
      const darkGray = isNight ? (35 + Math.random() * 15) : (55 + Math.random() * 20);
      pCtx.fillStyle = `rgba(${darkGray}, ${darkGray}, ${darkGray}, 0.45)`;
    }
    pCtx.fillRect(x, y, size, size);
  }

  // 5. Subtle racetrack rubber tire wear micro-tracks
  for (let i = 0; i < 350; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    pCtx.fillStyle = isNight ? 'rgba(25, 30, 36, 0.22)' : 'rgba(50, 56, 64, 0.22)';
    pCtx.fillRect(rx, ry, 3.5, 1);
  }

  // 6. Road wash tuned to guarantee vivid gray for Drag/Oval (baked in once instead of a second road stroke every frame)
  pCtx.fillStyle = isNight ? 'rgba(75, 83, 94, 0.35)' : 'rgba(115, 124, 136, 0.38)';
  pCtx.fillRect(0, 0, 512, 512);

  const pat = ctx.createPattern(canvas, 'repeat');
  if (isNight) grayAsphaltPatternNight = pat;
  else grayAsphaltPatternDay = pat;
  return pat;
}

/**
 * Dedicated night grand prix street circuit asphalt pattern crafted for Midnight Grand Prix (track-night).
 * Sleek, cool charcoal slate with illuminated reflective quartz glints and rubber groove lines.
 */
export function getMidnightAsphaltPattern(ctx: CanvasRenderingContext2D, isNight: boolean = true): CanvasPattern | null {
  initImages();

  if (isNight && midnightAsphaltPatternNight) return midnightAsphaltPatternNight;
  if (!isNight && midnightAsphaltPatternDay) return midnightAsphaltPatternDay;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const pCtx = canvas.getContext('2d');
  if (!pCtx) return null;

  // 1. Sleek night street circuit charcoal base
  const baseGrad = pCtx.createLinearGradient(0, 0, 512, 512);
  baseGrad.addColorStop(0, '#22262e');
  baseGrad.addColorStop(0.35, '#282d38');
  baseGrad.addColorStop(0.7, '#20242c');
  baseGrad.addColorStop(1, '#2a303a');
  pCtx.fillStyle = baseGrad;
  pCtx.fillRect(0, 0, 512, 512);

  // 2. High-speed street circuit compaction banding
  for (let y = 0; y < 512; y += 22) {
    pCtx.fillStyle = 'rgba(12, 15, 20, 0.35)';
    pCtx.fillRect(0, y, 512, 7);
  }

  // 3. Photographic micro-relief underlay
  if (asphaltImage && asphaltImage.complete && asphaltImage.naturalWidth > 0) {
    pCtx.save();
    pCtx.globalAlpha = 0.20;
    pCtx.drawImage(asphaltImage, 0, 0, 512, 512);
    pCtx.restore();
  }

  // 4. Midnight circuit specular quartz glints & fine aggregate (illuminated under floodlights)
  for (let i = 0; i < 14000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const rand = Math.random();
    const size = rand > 0.96 ? 2.0 : (rand > 0.84 ? 1.5 : 1);

    if (rand < 0.28) {
      // Quartz / silica light street glints catching floodlight glare
      const glint = 145 + Math.random() * 65;
      pCtx.fillStyle = `rgba(${glint}, ${glint + 8}, ${glint + 20}, 0.52)`;
    } else if (rand < 0.65) {
      // Slate gray aggregate particles
      const mid = 65 + Math.random() * 35;
      pCtx.fillStyle = `rgba(${mid}, ${mid + 4}, ${mid + 10}, 0.45)`;
    } else {
      // Dark bitumen binder matrix
      const dark = 18 + Math.random() * 14;
      pCtx.fillStyle = `rgba(${dark}, ${dark}, ${dark + 2}, 0.5)`;
    }
    pCtx.fillRect(x, y, size, size);
  }

  // 5. Heavy racing line rubber deposits
  pCtx.fillStyle = 'rgba(10, 12, 16, 0.35)';
  for (let x = 0; x < 512; x += 128) {
    pCtx.fillRect(x + 24, 0, 36, 512);
  }

  // 6. Sleek deep tone wash (baked in once instead of a second road stroke every frame)
  pCtx.fillStyle = 'rgba(38, 44, 56, 0.28)';
  pCtx.fillRect(0, 0, 512, 512);

  const pat = ctx.createPattern(canvas, 'repeat');
  if (isNight) midnightAsphaltPatternNight = pat;
  else midnightAsphaltPatternDay = pat;
  return pat;
}

export function getDirtPattern(ctx: CanvasRenderingContext2D, isNight: boolean = false): CanvasPattern | null {
  if (isNight && dirtPatternNight) return dirtPatternNight;
  if (!isNight && dirtPatternDay) return dirtPatternDay;

  // Realistic Procedural Earth / Clay / Dirt Terrain Pattern (Redoun off-track terrain)
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 256;
  patternCanvas.height = 256;
  const pCtx = patternCanvas.getContext('2d');
  if (!pCtx) return null;

  // Base earth tone
  const baseGrad = pCtx.createLinearGradient(0, 0, 256, 256);
  if (isNight) {
    baseGrad.addColorStop(0, '#361706');
    baseGrad.addColorStop(0.5, '#2e1204');
    baseGrad.addColorStop(1, '#230d02');
  } else {
    baseGrad.addColorStop(0, '#854d0e'); // Warm golden-brown earth
    baseGrad.addColorStop(0.35, '#92400e'); // Rich reddish soil
    baseGrad.addColorStop(0.7, '#78350f'); // Dark clay
    baseGrad.addColorStop(1, '#713f12');
  }
  pCtx.fillStyle = baseGrad;
  pCtx.fillRect(0, 0, 256, 256);

  // Soft organic soil patches
  const patchColors = isNight 
    ? ['rgba(60, 25, 8, 0.4)', 'rgba(35, 15, 4, 0.5)', 'rgba(80, 35, 12, 0.25)']
    : ['rgba(161, 98, 7, 0.35)', 'rgba(120, 53, 15, 0.45)', 'rgba(194, 65, 12, 0.25)', 'rgba(69, 26, 3, 0.3)'];

  for (let i = 0; i < 28; i++) {
    const px = Math.random() * 256;
    const py = Math.random() * 256;
    const rad = 14 + Math.random() * 32;
    pCtx.fillStyle = patchColors[i % patchColors.length];
    pCtx.beginPath();
    pCtx.arc(px, py, rad, 0, Math.PI * 2);
    pCtx.fill();
  }

  // Fine soil granules and pebbles
  for (let i = 0; i < 2200; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const isPebble = Math.random() < 0.08;
    const size = isPebble ? (1.5 + Math.random() * 2) : 1;
    
    if (isPebble) {
      pCtx.fillStyle = isNight ? 'rgba(180, 140, 100, 0.35)' : 'rgba(254, 215, 170, 0.55)';
    } else {
      pCtx.fillStyle = Math.random() > 0.5 
        ? (isNight ? 'rgba(120, 60, 20, 0.25)' : 'rgba(217, 119, 6, 0.35)')
        : (isNight ? 'rgba(20, 8, 2, 0.35)' : 'rgba(69, 26, 3, 0.4)');
    }
    pCtx.fillRect(x, y, size, size);
  }

  const pat = ctx.createPattern(patternCanvas, 'repeat');
  if (isNight) dirtPatternNight = pat;
  else dirtPatternDay = pat;
  return pat;
}

export function getDirtTrackPattern(ctx: CanvasRenderingContext2D, isNight: boolean = false): CanvasPattern | null {
  if (isNight && dirtTrackPatternNight) return dirtTrackPatternNight;
  if (!isNight && dirtTrackPatternDay) return dirtTrackPatternDay;

  // Realistic Packed Dirt & Gravel Rally Road Pattern
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 256;
  patternCanvas.height = 256;
  const pCtx = patternCanvas.getContext('2d');
  if (!pCtx) return null;

  // Base packed clay tone
  pCtx.fillStyle = isNight ? '#451a03' : '#a16207';
  pCtx.fillRect(0, 0, 256, 256);

  // Subtle directional tire ruts / grooves
  pCtx.fillStyle = isNight ? 'rgba(30, 10, 2, 0.35)' : 'rgba(113, 63, 18, 0.35)';
  for (let y = 8; y < 256; y += 24) {
    pCtx.fillRect(0, y, 256, 8);
  }

  // Scattered gravel, crushed rock, and clay speckles
  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const isStone = Math.random() < 0.12;
    const size = isStone ? (1.5 + Math.random() * 2) : 1;

    if (isStone) {
      pCtx.fillStyle = isNight ? 'rgba(200, 160, 120, 0.35)' : 'rgba(254, 243, 199, 0.6)';
    } else {
      pCtx.fillStyle = Math.random() > 0.4
        ? (isNight ? 'rgba(69, 26, 3, 0.45)' : 'rgba(146, 64, 14, 0.4)')
        : (isNight ? 'rgba(15, 6, 1, 0.5)' : 'rgba(67, 20, 7, 0.45)');
    }
    pCtx.fillRect(x, y, size, size);
  }

  const pat = ctx.createPattern(patternCanvas, 'repeat');
  if (isNight) dirtTrackPatternNight = pat;
  else dirtTrackPatternDay = pat;
  return pat;
}
