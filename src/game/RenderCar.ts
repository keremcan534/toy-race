import { Car } from '../store';
import { changeColorBrightness } from './RenderUtils';
import { drawCarBody1 } from './RenderCarBody1';
import { drawCarBody2, drawDefaultCarBody } from './RenderCarBody2';
import { drawCarLighting, drawHeadlightBeams } from './RenderCarLighting';
import { SceneryObject } from './Scenery';

// ---------------------------------------------------------------------------
// Car sprites. A car body is hundreds of path commands plus blurred light glows; drawing that
// for every car on every frame was the main cost of a race on phones. Each look of a car
// (car, night, braking) is drawn once into an offscreen canvas and then stamped with drawImage.
// ---------------------------------------------------------------------------

const SPRITE_SCALE = 2; // sprite pixels per world unit (sharp up to the closest camera zoom)
// Car-local area a sprite can cover: the body (about ±38 x ±33) plus room for the light glows.
const AREA = { minX: -84, maxX: 66, minY: -66, maxY: 66 };

interface Sprite {
  canvas: HTMLCanvasElement;
  // Placement in car-local units
  x: number;
  y: number;
  w: number;
  h: number;
}

const carSprites = new Map<string, Sprite>();
const shadowSprites = new Map<string, Sprite>();

// shadowBlur is measured in canvas pixels, not user units, so on a 2x sprite every blur set by the
// drawing code would come out half as wide. Scale it on the sprite context instead.
function scaleShadowBlur(ctx: CanvasRenderingContext2D, factor: number) {
  const desc = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'shadowBlur');
  if (!desc?.get || !desc.set) return;
  const { get, set } = desc;
  Object.defineProperty(ctx, 'shadowBlur', {
    configurable: true,
    get() { return get.call(this) / factor; },
    set(value: number) { set.call(this, value * factor); },
  });
}

/** Renders `draw` (car-local coordinates) into a canvas cropped to what was actually drawn. */
function renderSprite(area: typeof AREA, draw: (ctx: CanvasRenderingContext2D) => void): Sprite {
  const width = Math.ceil((area.maxX - area.minX) * SPRITE_SCALE);
  const height = Math.ceil((area.maxY - area.minY) * SPRITE_SCALE);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  scaleShadowBlur(ctx, SPRITE_SCALE);
  ctx.setTransform(SPRITE_SCALE, 0, 0, SPRITE_SCALE, -area.minX * SPRITE_SCALE, -area.minY * SPRITE_SCALE);
  draw(ctx);

  // Crop transparent margins so each frame blends as few pixels as possible.
  const data = ctx.getImageData(0, 0, width, height).data;
  let left = width, right = -1, top = height, bottom = -1;
  for (let y = 0; y < height; y++) {
    const row = y * width * 4;
    for (let x = 0; x < width; x++) {
      if (data[row + x * 4 + 3] > 1) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  if (right < left) {
    return { canvas, x: 0, y: 0, w: 0, h: 0 };
  }
  left = Math.max(0, left - 1);
  top = Math.max(0, top - 1);
  right = Math.min(width - 1, right + 1);
  bottom = Math.min(height - 1, bottom + 1);
  const cropped = document.createElement('canvas');
  cropped.width = right - left + 1;
  cropped.height = bottom - top + 1;
  cropped.getContext('2d')!.drawImage(canvas, left, top, cropped.width, cropped.height, 0, 0, cropped.width, cropped.height);
  return {
    canvas: cropped,
    x: area.minX + left / SPRITE_SCALE,
    y: area.minY + top / SPRITE_SCALE,
    w: cropped.width / SPRITE_SCALE,
    h: cropped.height / SPRITE_SCALE,
  };
}

const bodyColor = (carStats: Car, isNight: boolean) =>
  isNight ? changeColorBrightness(carStats.color, -15) : carStats.color;

/** Tires, body and lights: everything about a car that doesn't change from frame to frame. */
function drawCarDetails(ctx: CanvasRenderingContext2D, carStats: Car, isNight: boolean, isBraking: boolean, scale: number) {
  // Tires (Skip for dedicated open-wheel race cars that render their own open wheels)
  if (carStats.id !== 'car-frestta-f10' && carStats.id !== 'car-br47') {
    ctx.fillStyle = '#0a0a0a';
    const tireWidth = carStats.type === 'suv' ? 12 : 10;
    const tireHeight = carStats.type === 'suv' ? 7 : 6;

    // Front Tires
    ctx.fillRect(12, -14, tireWidth, tireHeight);
    ctx.fillRect(12, 8, tireWidth, tireHeight);
    // Rear Tires
    ctx.fillRect(-18, -14, tireWidth, tireHeight);
    ctx.fillRect(-18, 8, tireWidth, tireHeight);
  }

  // Main Body
  const baseColor = bodyColor(carStats, isNight);
  ctx.fillStyle = baseColor;

  const handledByBody1 = drawCarBody1(ctx, carStats, baseColor);
  if (!handledByBody1) {
    const handledByBody2 = drawCarBody2(ctx, carStats, baseColor, isBraking);
    if (!handledByBody2) {
      drawDefaultCarBody(ctx, baseColor);
    }
  }

  drawCarLighting(ctx, carStats, scale, isNight, isBraking, baseColor);
}

function getCarSprite(carStats: Car, isNight: boolean, isBraking: boolean): Sprite {
  const key = `${carStats.id}|${carStats.color}|${carStats.type}|${isNight ? 1 : 0}|${isBraking ? 1 : 0}`;
  let sprite = carSprites.get(key);
  if (!sprite) {
    sprite = renderSprite(AREA, ctx => drawCarDetails(ctx, carStats, isNight, isBraking, 1));
    carSprites.set(key, sprite);
  }
  return sprite;
}

const shadowSize = (carStats: Car) => carStats.type === 'suv'
  ? { width: 46, height: 28 }
  : { width: 44, height: 24 };

function drawDropShadow(ctx: CanvasRenderingContext2D, carStats: Car, isNight: boolean, blur: number) {
  const { width, height } = shadowSize(carStats);
  ctx.fillStyle = isNight ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.26)';
  ctx.shadowBlur = blur;
  ctx.shadowColor = isNight ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.38)';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(-width / 2 - 2, -height / 2 - 2, width + 4, height + 4, 6);
  } else {
    ctx.rect(-width / 2 - 2, -height / 2 - 2, width + 4, height + 4);
  }
  ctx.fill();
}

function getShadowSprite(carStats: Car, isNight: boolean): Sprite {
  const key = `${carStats.type === 'suv' ? 'suv' : 'car'}|${isNight ? 1 : 0}`;
  let sprite = shadowSprites.get(key);
  if (!sprite) {
    // A fixed blur in place of the old speed-dependent 10-16 px; the difference isn't visible.
    sprite = renderSprite({ minX: -60, maxX: 60, minY: -50, maxY: 50 }, ctx => drawDropShadow(ctx, carStats, isNight, isNight ? 15 : 12));
    shadowSprites.set(key, sprite);
  }
  return sprite;
}

/** Builds the sprites a race will need before it starts, so the first frames don't stutter. */
export function prewarmCarSprites(cars: Car[], isNight: boolean) {
  if (typeof document === 'undefined') return;
  cars.forEach((car, index) => {
    if (!car) return;
    getShadowSprite(car, isNight);
    getCarSprite(car, isNight, false);
    if (index === 0) getCarSprite(car, isNight, true); // the player's brake lights
  });
}

export function clearCarSprites() {
  carSprites.clear();
  shadowSprites.clear();
}

/**
 * Draws a car centred on (x, y). In races the cached sprites are used; previews in the menus pass
 * `useSprites = false` to draw the vectors directly, which stays sharp at any size.
 */
export function drawCar(ctx: CanvasRenderingContext2D, carStats: Car, x: number, y: number, angle: number, scale: number = 1, isNight: boolean = false, speed: number = 0, isBraking: boolean = false, blinkTime: number = 0, scenery?: SceneryObject[], isNitro: boolean = false, useSprites: boolean = true) {
  if (!carStats) return;
  if (blinkTime > 0) {
    if (Math.floor(blinkTime * 10) % 2 === 0) return;
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  // Dynamic Shadows from Street Lamps (Night tracks)
  if (isNight && scenery) {
    for (const lamp of scenery) {
      if (lamp.type !== 'lamp') continue;
      const dx = lamp.x - x;
      const dy = lamp.y - y;
      const distSq = dx * dx + dy * dy;
      if (distSq >= 122500) continue; // 350 * 350
      const dist = Math.sqrt(distSq);

      // Direction from lamp to car
      const shadowAngleWorld = Math.atan2(dy, dx) + Math.PI;
      const shadowAngleLocal = shadowAngleWorld - angle;

      const shadowLength = Math.min(dist * 0.6, 120);
      const shadowOpacity = Math.max(0, 0.4 * (1 - dist / 350));

      ctx.save();
      ctx.rotate(shadowAngleLocal);
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity})`;

      // Draw a elongated shadow
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(shadowLength, -20);
      ctx.lineTo(shadowLength, 20);
      ctx.lineTo(0, 12);
      ctx.fill();
      ctx.restore();
    }
  }

  // Car Drop Shadow (Unified single-source Directional Sunlight for daytime tracks)
  let shadowX = -3;
  let shadowY = 3;
  if (!isNight) {
    // Fixed world sun direction (+8, +11) in world space mapped to car local coordinates
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    shadowX = 8 * cosA + 11 * sinA;
    shadowY = -8 * sinA + 11 * cosA;
  }

  if (useSprites) {
    const shadow = getShadowSprite(carStats, isNight);
    ctx.drawImage(shadow.canvas, shadowX + shadow.x, shadowY + shadow.y, shadow.w, shadow.h);
    const sprite = getCarSprite(carStats, isNight, isBraking);
    ctx.drawImage(sprite.canvas, sprite.x, sprite.y, sprite.w, sprite.h);
  } else {
    ctx.save();
    ctx.translate(shadowX, shadowY);
    drawDropShadow(ctx, carStats, isNight, isNight ? 15 : 10 + Math.min(speed * 0.04, 6));
    ctx.restore();
    drawCarDetails(ctx, carStats, isNight, isBraking, scale);
  }

  if (isNight) {
    drawHeadlightBeams(ctx, carStats, bodyColor(carStats, isNight));
  }

  // Nitro Flame Exhaust Jets
  if (isNitro) {
    ctx.save();
    const flameLength = 22 + Math.random() * 16;
    const flameWidth = 5 + Math.random() * 2.5;

    [-6, 6].forEach(offsetY => {
      // Outer bright cyan flame plume
      const grad = ctx.createLinearGradient(-22, offsetY, -22 - flameLength, offsetY);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.25, 'rgba(56, 189, 248, 0.9)');
      grad.addColorStop(0.7, 'rgba(37, 99, 235, 0.55)');
      grad.addColorStop(1, 'rgba(37, 99, 235, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-22, offsetY - flameWidth / 2);
      ctx.lineTo(-22 - flameLength, offsetY);
      ctx.lineTo(-22, offsetY + flameWidth / 2);
      ctx.closePath();
      ctx.fill();

      // Inner intense white-hot core
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.moveTo(-22, offsetY - flameWidth * 0.25);
      ctx.lineTo(-22 - flameLength * 0.45, offsetY);
      ctx.lineTo(-22, offsetY + flameWidth * 0.25);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
  }

  ctx.restore();
}
