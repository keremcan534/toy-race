import { SceneryObject } from './Scenery';
import { cachedGradient } from './RenderUtils';

// Fixed single-source Directional Sunlight constants in World Coordinates
// Sun shines from top-left (-X, -Y), casting soft shadows towards (+8, +11) in world space
export const SUN_SHADOW_OFFSET_X = 8;
export const SUN_SHADOW_OFFSET_Y = 11;

export function drawSceneryObject(ctx: CanvasRenderingContext2D, obj: SceneryObject) {
  // 1. Draw Directional Sun Shadow in World Space (aligned across all day tracks)
  ctx.save();
  const cosA = Math.cos(obj.rotation);
  const sinA = Math.sin(obj.rotation);
  
  // Calculate local coordinates for the fixed world shadow offset
  const localShadowX = (SUN_SHADOW_OFFSET_X * cosA + SUN_SHADOW_OFFSET_Y * sinA) * obj.scale;
  const localShadowY = (-SUN_SHADOW_OFFSET_X * sinA + SUN_SHADOW_OFFSET_Y * cosA) * obj.scale;

  ctx.translate(obj.x + localShadowX, obj.y + localShadowY);
  ctx.rotate(obj.rotation);
  ctx.scale(obj.scale, obj.scale);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();

  switch (obj.type) {
    case 'tree':
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'bush':
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'rock':
      ctx.ellipse(0, 0, 12, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'cone':
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'palm':
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'lamp':
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'tire_stack':
      ctx.rect(-18, -9, 36, 18);
      ctx.fill();
      break;
    case 'barrier':
      ctx.rect(-24, -5, 48, 10);
      ctx.fill();
      break;
    case 'billboard':
      ctx.rect(-32, -8, 64, 16);
      ctx.fill();
      break;
    case 'grandstand':
      ctx.rect(-55, -22, 110, 44);
      ctx.fill();
      break;
    case 'grass':
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'building':
      ctx.rect(-20, -20, 40, 40);
      ctx.fill();
      break;
  }
  ctx.restore();

  // 2. Draw the Scenery Object Body
  ctx.save();
  ctx.translate(obj.x, obj.y);
  ctx.rotate(obj.rotation);
  ctx.scale(obj.scale, obj.scale);

  switch (obj.type) {
    case 'tree': {
      // Tree Trunk
      ctx.fillStyle = '#4e342e';
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Tree Foliage with Directional Sun Highlight (lighter top-left, deeper green bottom-right)
      ctx.fillStyle = cachedGradient(ctx, 'tree', () => {
        const grad = ctx.createRadialGradient(-5, -5, 2, 0, 0, 19);
        grad.addColorStop(0, '#4ade80'); // Sunlit green
        grad.addColorStop(0.5, '#22c55e'); // Mid green
        grad.addColorStop(1, '#15803d'); // Deep shadow green
        return grad;
      });
      ctx.beginPath();
      ctx.arc(0, -6, 13, 0, Math.PI * 2);
      ctx.arc(-9, 4, 11, 0, Math.PI * 2);
      ctx.arc(9, 4, 11, 0, Math.PI * 2);
      ctx.fill();

      // Sunlit leaf highlight
      ctx.fillStyle = 'rgba(187, 247, 208, 0.45)';
      ctx.beginPath();
      ctx.arc(-5, -7, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'bush': {
      ctx.fillStyle = cachedGradient(ctx, 'bush', () => {
        const bushGrad = ctx.createRadialGradient(-3, -3, 1, 0, 0, 11);
        bushGrad.addColorStop(0, '#86efac');
        bushGrad.addColorStop(0.6, '#16a34a');
        bushGrad.addColorStop(1, '#166534');
        return bushGrad;
      });
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.arc(-5, 3, 7, 0, Math.PI * 2);
      ctx.arc(5, 3, 7, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'grass': {
      ctx.fillStyle = '#1c5029';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#2e7d44';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-3, 2);
      ctx.lineTo(-5, -6);
      ctx.moveTo(0, 2);
      ctx.lineTo(1, -8);
      ctx.moveTo(3, 2);
      ctx.lineTo(6, -5);
      ctx.stroke();
      break;
    }

    case 'rock': {
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(-5, -8);
      ctx.lineTo(6, -6);
      ctx.lineTo(11, 3);
      ctx.lineTo(3, 9);
      ctx.lineTo(-6, 7);
      ctx.closePath();
      ctx.fill();

      // Top sun highlight facet
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(-5, -8);
      ctx.lineTo(6, -6);
      ctx.lineTo(1, 0);
      ctx.lineTo(-6, -1);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'tire_stack': {
      // Stack of racing barrier tires (e.g. Red & White striped)
      const colors = ['#dc2626', '#ffffff', '#dc2626'];
      const offsets = [-12, 0, 12];

      offsets.forEach((ox, idx) => {
        const col = colors[idx % colors.length];
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(ox, 0, 7.5, 0, Math.PI * 2);
        ctx.fill();

        // Inner rim hole
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(ox, 0, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Sun rim highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ox - 1, -1, 6, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.stroke();
      });
      break;
    }

    case 'barrier': {
      // Armco Guardrail with hazard stripes
      const bWidth = 46;
      const bHeight = 8;
      ctx.fillStyle = '#334155';
      ctx.fillRect(-bWidth / 2, -bHeight / 2, bWidth, bHeight);

      // Red & White hazard markings
      const stripeW = 6;
      for (let sx = -bWidth / 2; sx < bWidth / 2; sx += stripeW * 2) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(sx, -bHeight / 2, stripeW, bHeight);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(sx + stripeW, -bHeight / 2, stripeW, bHeight);
      }

      // Top rail bevel highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(-bWidth / 2, -bHeight / 2, bWidth, 1.5);
      break;
    }

    case 'billboard': {
      // Racing Sponsor Billboard
      const bbW = 58;
      const bbH = 14;

      // Steel frame posts
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-bbW / 2 + 2, -bbH / 2 - 2, 3, bbH + 4);
      ctx.fillRect(bbW / 2 - 5, -bbH / 2 - 2, 3, bbH + 4);

      // Board Face
      const brands = [
        { bg: '#2563eb', text: 'TOY RACE', sub: '#60a5fa' },
        { bg: '#ea580c', text: 'NITRO TURBO', sub: '#fdba74' },
        { bg: '#059669', text: 'APEX RACING', sub: '#6ee7b7' }
      ];
      const brand = brands[(obj.variant || 0) % brands.length];

      ctx.fillStyle = brand.bg;
      ctx.fillRect(-bbW / 2 + 3, -bbH / 2, bbW - 6, bbH);

      // Top light reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(-bbW / 2 + 3, -bbH / 2, bbW - 6, 2);

      // Brand Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(brand.text, 0, 1);
      break;
    }

    case 'grandstand': {
      // Grandstand Bleachers with spectator crowd
      const gsW = 100;
      const gsH = 36;

      // Base concrete structure
      ctx.fillStyle = '#334155';
      ctx.fillRect(-gsW / 2, -gsH / 2, gsW, gsH);

      // Tiered rows
      const rows = 4;
      const rowH = gsH / rows;
      const crowdColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#f8fafc', '#a855f7'];

      for (let r = 0; r < rows; r++) {
        const ry = -gsH / 2 + r * rowH;
        ctx.fillStyle = r % 2 === 0 ? '#475569' : '#334155';
        ctx.fillRect(-gsW / 2, ry, gsW, rowH);

        // Spectator heads/crowd dots
        for (let cx = -gsW / 2 + 4; cx < gsW / 2 - 4; cx += 5) {
          const col = crowdColors[Math.abs(Math.floor(cx * 13 + r * 7)) % crowdColors.length];
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(cx, ry + rowH * 0.5, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Canopy roof over the back
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-gsW / 2 - 2, -gsH / 2 - 4, gsW + 4, 6);
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(-gsW / 2 - 2, -gsH / 2 - 4, gsW + 4, 2);
      break;
    }

    case 'cone': {
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(-5, 5);
      ctx.lineTo(5, 5);
      ctx.lineTo(0, -8);
      ctx.closePath();
      ctx.fill();

      // Base plate
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(-6, 5, 12, 2.5);

      // Reflective white band
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-2.5, 1);
      ctx.lineTo(2.5, 1);
      ctx.lineTo(1.5, -3);
      ctx.lineTo(-1.5, -3);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'palm': {
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#15803d';
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / 6);
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.quadraticCurveTo(14, -12, 18, -6);
        ctx.quadraticCurveTo(12, -2, 0, -4);
        ctx.fill();
        ctx.restore();
      }
      break;
    }

    case 'lamp': {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#475569';
      ctx.fillRect(-1.5, -26, 3, 26);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, -28, 12, 3);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(8, -26, 6, 3);
      break;
    }

    case 'building': {
      ctx.fillStyle = '#334155';
      ctx.fillRect(-20, -20, 40, 40);
      ctx.fillStyle = '#fef08a';
      ctx.globalAlpha = 0.6;
      ctx.fillRect(-12, -12, 6, 6);
      ctx.fillRect(6, -12, 6, 6);
      ctx.fillRect(-12, 6, 6, 6);
      ctx.fillRect(6, 6, 6, 6);
      ctx.globalAlpha = 1.0;
      break;
    }

    case 'spectator_crowd': {
      // Crowd safety fence barrier
      ctx.fillStyle = '#52525b';
      ctx.fillRect(-32, -3, 64, 6);
      ctx.fillStyle = '#a1a1aa';
      ctx.fillRect(-30, -2, 60, 4);

      const shirtColors = ['#ef4444', '#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
      const skinTones = ['#f87171', '#fbbf24', '#fca5a5', '#d97706', '#f59e0b'];
      const timeVal = performance.now() * 0.005;

      // Render row of minik insanlar
      for (let p = 0; p < 8; p++) {
        const px = -25 + p * 7.2;
        const py = -9 + (p % 2 === 0 ? -2 : 1);
        const colorIdx = (Math.abs(Math.floor(obj.x + obj.y + p * 13))) % shirtColors.length;
        const skinIdx = (Math.abs(Math.floor(obj.x * 3 + p * 7))) % skinTones.length;

        // Torso / Shirt
        ctx.fillStyle = shirtColors[colorIdx];
        ctx.beginPath();
        ctx.ellipse(px, py + 2, 3.2, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head / Cap
        ctx.fillStyle = skinTones[skinIdx];
        ctx.beginPath();
        ctx.arc(px, py - 1, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Flashing Phone Camera / Glint in the night (optimized without slow shadowBlur)
        if ((timeVal + p * 1.7 + obj.x * 0.01) % 3.8 < 0.38) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.arc(px + 1, py - 3, 4.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px + 1, py - 3, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
  }

  ctx.restore();
}
