export function changeColorBrightness(hex: string, percent: number) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

// Gradients only depend on their own coordinates, so ones that look the same every frame are built once.
const gradientCache = new WeakMap<CanvasRenderingContext2D, Map<string, CanvasGradient>>();

export function cachedGradient(ctx: CanvasRenderingContext2D, key: string, create: () => CanvasGradient): CanvasGradient {
  let byKey = gradientCache.get(ctx);
  if (!byKey) {
    byKey = new Map();
    gradientCache.set(ctx, byKey);
  }
  let gradient = byKey.get(key);
  if (!gradient) {
    gradient = create();
    byKey.set(key, gradient);
  }
  return gradient;
}

/** Full-screen vignette for the final post-processing pass (screen coordinates). */
export function getScreenVignette(ctx: CanvasRenderingContext2D, width: number, height: number) {
  return cachedGradient(ctx, `vignette|${width}|${height}`, () => {
    const g = ctx.createRadialGradient(width / 2, height / 2, Math.max(width, height) * 0.3, width / 2, height / 2, Math.max(width, height) * 0.9);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.6)');
    return g;
  });
}

export function drawLighting(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, isNight: boolean) {
  ctx.save();
  ctx.translate(x, y);

  if (isNight) {
    // Lighter night blue overlay (more transparent)
    ctx.fillStyle = 'rgba(2, 6, 23, 0.35)';
    ctx.fillRect(-width, -height, width * 2, height * 2);

    // Subtle atmospheric haze
    ctx.fillStyle = cachedGradient(ctx, `haze|${width}|${height}`, () => {
      const haze = ctx.createRadialGradient(0, 0, 50, 0, 0, Math.max(width, height));
      haze.addColorStop(0, 'rgba(15, 23, 42, 0)');
      haze.addColorStop(0.5, 'rgba(15, 23, 42, 0.05)');
      haze.addColorStop(1, 'rgba(15, 23, 42, 0.2)');
      return haze;
    });
    ctx.fillRect(-width, -height, width * 2, height * 2);
  }

  // Vignette / Focus shadow (Softer)
  ctx.fillStyle = cachedGradient(ctx, `focus|${width}|${height}|${isNight ? 1 : 0}`, () => {
    const gradient = ctx.createRadialGradient(0, 0, 200, 0, 0, Math.max(width, height) * 1.0);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.4, isNight ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.02)');
    gradient.addColorStop(1, isNight ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)');
    return gradient;
  });
  ctx.fillRect(-width, -height, width * 2, height * 2);

  ctx.restore();
}
