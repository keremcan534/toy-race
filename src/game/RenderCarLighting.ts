import { Car } from '../store';

export function drawCarLighting(ctx: CanvasRenderingContext2D, carStats: Car, scale: number, isNight: boolean, isBraking: boolean, baseColor: string) {
  // Headlights (Physical bulbs / housings)
  const defaultBulbColor = isNight ? '#ffea75' : '#27272a';
  const whiteBulbColor = isNight ? '#ffffff' : '#27272a';
  const warmBulbColor = isNight ? '#ffffe0' : '#3f3f46';
  const cyanBulbColor = isNight ? '#00e5ff' : '#27272a';
  const headlightBlur = isNight ? 10 : 0;

  ctx.fillStyle = defaultBulbColor;
  if (carStats.id === 'car-avesta-revo') {
    // Y-shaped headlights (Lamborghini Revuelto style)
    ctx.fillStyle = whiteBulbColor;
    ctx.shadowBlur = headlightBlur;
    ctx.shadowColor = isNight ? '#fff' : 'transparent';
    
    // Left headlight (Y shape)
    ctx.beginPath();
    ctx.moveTo(26, -5);
    ctx.lineTo(24, -8);
    ctx.lineTo(25, -8);
    ctx.lineTo(27, -5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(26, -5);
    ctx.lineTo(22, -4);
    ctx.lineTo(22, -5);
    ctx.lineTo(26, -6);
    ctx.fill();

    // Right headlight (Y shape)
    ctx.beginPath();
    ctx.moveTo(26, 5);
    ctx.lineTo(24, 8);
    ctx.lineTo(25, 8);
    ctx.lineTo(27, 5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(26, 5);
    ctx.lineTo(22, 4);
    ctx.lineTo(22, 5);
    ctx.lineTo(26, 6);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-uiner') {
    // BMW M3 G80 Laserlight Headlights (Sharp dual C-shaped angular DRLs with Laser Blue accents)
    ctx.fillStyle = isNight ? '#ffffff' : '#f8fafc';
    ctx.shadowBlur = headlightBlur;
    ctx.shadowColor = isNight ? '#38bdf8' : 'transparent';
    
    // Left Laserlight DRL & projectors
    ctx.beginPath();
    ctx.moveTo(27.0, -6.5);
    ctx.lineTo(24.5, -9.5);
    ctx.lineTo(23.5, -8.5);
    ctx.lineTo(25.5, -6.0);
    ctx.closePath();
    ctx.fill();

    // Right Laserlight DRL & projectors
    ctx.beginPath();
    ctx.moveTo(27.0, 6.5);
    ctx.lineTo(24.5, 9.5);
    ctx.lineTo(23.5, 8.5);
    ctx.lineTo(25.5, 6.0);
    ctx.closePath();
    ctx.fill();

    // Ice blue laserlight inner accents
    ctx.fillStyle = isNight ? '#00e5ff' : '#0284c7';
    ctx.fillRect(25.0, -7.8, 1.2, 0.8);
    ctx.fillRect(25.0, 7.0, 1.2, 0.8);
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-elegus-z1') {
    // Ford GT40 Mk I Endurance Racing Projector Headlights
    ctx.fillStyle = isNight ? '#ffffe0' : '#e2e8f0';
    ctx.shadowBlur = headlightBlur;
    ctx.shadowColor = isNight ? '#ffea75' : 'transparent';
    
    // Left headlight pod (twin projector lenses)
    ctx.beginPath();
    ctx.arc(24.5, -8.5, 1.5, 0, Math.PI * 2);
    ctx.arc(22.5, -10.2, 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Right headlight pod (twin projector lenses)
    ctx.beginPath();
    ctx.arc(24.5, 8.5, 1.5, 0, Math.PI * 2);
    ctx.arc(22.5, 10.2, 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Clear acrylic headlight cover glass
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.ellipse(23.5, -9.3, 3.2, 2.4, -Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(23.5, 9.3, 3.2, 2.4, Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();
  } else if (carStats.id === 'car-elegus-ruara') {
    // Pagani Huayra Bi-Xenon Teardrop Headlight Clusters & DRL Halos
    ctx.fillStyle = isNight ? '#e0f2fe' : '#ffffff';
    ctx.shadowBlur = headlightBlur;
    ctx.shadowColor = isNight ? '#38bdf8' : 'transparent';

    // Left teardrop pod projectors (dual stacked gems)
    ctx.beginPath();
    ctx.arc(25.0, -8.2, 1.35, 0, Math.PI * 2);
    ctx.arc(22.8, -10.0, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Right teardrop pod projectors
    ctx.beginPath();
    ctx.arc(25.0, 8.2, 1.35, 0, Math.PI * 2);
    ctx.arc(22.8, 10.0, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Teardrop carbon pod housing & clear lens outline
    ctx.strokeStyle = isNight ? 'rgba(56, 189, 248, 0.7)' : 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.ellipse(23.9, -9.1, 3.2, 2.2, -Math.PI / 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(23.9, 9.1, 3.2, 2.2, Math.PI / 5, 0, Math.PI * 2);
    ctx.stroke();
  } else if (carStats.id === 'car-condute-cleo') {
    // Range Rover Signature Matrix LED Projector Headlights & DRL Signatures
    ctx.fillStyle = isNight ? '#f8fafc' : '#ffffff';
    ctx.shadowBlur = headlightBlur;
    ctx.shadowColor = isNight ? '#38bdf8' : 'transparent';

    // Left LED Projector cluster
    ctx.beginPath();
    ctx.moveTo(27.5, -6.5);
    ctx.lineTo(26.2, -10.5);
    ctx.lineTo(23.8, -11.8);
    ctx.lineTo(24.5, -9.8);
    ctx.lineTo(26.0, -6.5);
    ctx.closePath();
    ctx.fill();

    // Right LED Projector cluster
    ctx.beginPath();
    ctx.moveTo(27.5, 6.5);
    ctx.lineTo(26.2, 10.5);
    ctx.lineTo(23.8, 11.8);
    ctx.lineTo(24.5, 9.8);
    ctx.lineTo(26.0, 6.5);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Outer crystalline DRL LED light tube outline
    ctx.strokeStyle = isNight ? 'rgba(56, 189, 248, 0.9)' : 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(27.5, -6.5); ctx.lineTo(26.2, -10.8); ctx.lineTo(23.5, -12.0);
    ctx.moveTo(27.5, 6.5); ctx.lineTo(26.2, 10.8); ctx.lineTo(23.5, 12.0);
    ctx.stroke();
  } else if (carStats.id === 'car-hydra-vyree') {
    // Aston Martin Valkyrie style headlights
    ctx.fillStyle = whiteBulbColor;
    ctx.shadowBlur = headlightBlur;
    ctx.shadowColor = isNight ? '#fff' : 'transparent';
    
    ctx.beginPath();
    ctx.moveTo(27, -4);
    ctx.lineTo(24, -8);
    ctx.lineTo(26, -4);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(27, 4);
    ctx.lineTo(24, 8);
    ctx.lineTo(26, 4);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-frestta-tines') {
    // Swept-back headlights (LaFerrari style)
    ctx.fillStyle = whiteBulbColor;
    ctx.shadowBlur = headlightBlur;
    ctx.shadowColor = isNight ? '#fff' : 'transparent';
    
    ctx.beginPath();
    ctx.moveTo(29, -3);
    ctx.lineTo(20, -9);
    ctx.lineTo(24, -5);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(29, 3);
    ctx.lineTo(20, 9);
    ctx.lineTo(24, 5);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-regali-rx1') {
    // Aggressive angled headlights
    ctx.fillStyle = whiteBulbColor;
    ctx.shadowBlur = headlightBlur;
    ctx.shadowColor = isNight ? '#fff' : 'transparent';
    
    ctx.beginPath();
    ctx.moveTo(28, -5);
    ctx.lineTo(24, -10);
    ctx.lineTo(26, -5);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(28, 5);
    ctx.lineTo(24, 10);
    ctx.lineTo(26, 5);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-hydra-stedring-58') {
    // Hydra Stedring '58 (Classic round headlights)
    ctx.fillStyle = warmBulbColor;
    ctx.shadowBlur = headlightBlur;
    ctx.shadowColor = isNight ? '#ffffe0' : 'transparent';
    ctx.beginPath();
    ctx.arc(24, -8, 2.5, 0, Math.PI * 2);
    ctx.arc(24, 8, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-uiner-i6') {
    // BMW i8 / i4 LaserLight Headlight Clusters with Blue DRL Halo Eyebrows
    ctx.shadowBlur = isNight ? 22 : 8;
    ctx.shadowColor = isNight ? '#00e5ff' : 'rgba(0, 229, 255, 0.4)';
    ctx.fillStyle = isNight ? '#ffffff' : '#f0f9ff';
    
    // Right Laser Projector Lens
    ctx.beginPath();
    ctx.moveTo(28.2, -5.8);
    ctx.lineTo(25.0, -9.8);
    ctx.lineTo(22.8, -8.2);
    ctx.lineTo(26.5, -4.8);
    ctx.closePath();
    ctx.fill();

    // Left Laser Projector Lens
    ctx.beginPath();
    ctx.moveTo(28.2, 5.8);
    ctx.lineTo(25.0, 9.8);
    ctx.lineTo(22.8, 8.2);
    ctx.lineTo(26.5, 4.8);
    ctx.closePath();
    ctx.fill();

    // Blue Laser Light Halo Eyebrows
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(28.5, -6.0); ctx.lineTo(24.5, -10.2);
    ctx.moveTo(28.5, 6.0); ctx.lineTo(24.5, 10.2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-regali-chasew') {
    // Headlights (Round, dual)
    ctx.fillStyle = whiteBulbColor;
    ctx.shadowBlur = headlightBlur;
    ctx.shadowColor = isNight ? '#fff' : 'transparent';
    ctx.beginPath();
    ctx.arc(23, -6, 1.5, 0, Math.PI * 2);
    ctx.arc(23, -4, 1.5, 0, Math.PI * 2);
    ctx.arc(23, 4, 1.5, 0, Math.PI * 2);
    ctx.arc(23, 6, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-pnisther-200gt') {
    // Porsche 911 (992) Four-Point Matrix LED Projector Headlights
    ctx.shadowBlur = headlightBlur;
    ctx.shadowColor = isNight ? '#e0f2fe' : 'transparent';
    [-1, 1].forEach(side => {
      // Outer halo ring
      ctx.strokeStyle = isNight ? '#ffffff' : '#94a3b8';
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(20.5, side * 9.0, 2.8, 0, Math.PI * 2); ctx.stroke();
      // 4 Matrix LED diamond dots
      ctx.fillStyle = isNight ? '#f8fafc' : '#ffffff';
      [-0.8, 0.8].forEach(dx => {
        [-0.8, 0.8].forEach(dy => {
          ctx.beginPath(); ctx.arc(20.5 + dx, side * 9.0 + dy, 0.6, 0, Math.PI * 2); ctx.fill();
        });
      });
    });
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-pnisther-cugan') {
    // Porsche Cayenne Coupe / Macan Four-Point Matrix LED Clusters (Pnisther Cugan)
    ctx.shadowBlur = isNight ? 22 : 6;
    ctx.shadowColor = isNight ? '#bae6fd' : 'rgba(186, 230, 253, 0.4)';
    [-1, 1].forEach(side => {
      // Teardrop aerodynamic lens outline
      ctx.strokeStyle = isNight ? '#e0f2fe' : 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(22.8, side * 9.5, 3.8, 2.2, side * Math.PI / 12, 0, Math.PI * 2);
      ctx.stroke();

      // 4-Point Signature Ice-Blue / Crisp White Matrix LEDs
      ctx.fillStyle = isNight ? '#ffffff' : '#f8fafc';
      const cx = 22.8;
      const cy = side * 9.5;
      ctx.beginPath();
      ctx.arc(cx - 1.2, cy - 0.9, 0.7, 0, Math.PI * 2);
      ctx.arc(cx + 1.2, cy - 0.7, 0.7, 0, Math.PI * 2);
      ctx.arc(cx - 1.0, cy + 0.9, 0.7, 0, Math.PI * 2);
      ctx.arc(cx + 1.4, cy + 0.7, 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Central high-beam laser projector
      ctx.fillStyle = isNight ? '#38bdf8' : '#e2e8f0';
      ctx.beginPath(); ctx.arc(cx + 0.2, cy, 0.9, 0, Math.PI * 2); ctx.fill();
    });
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-prega') {
    // Prega headlights
    ctx.fillStyle = warmBulbColor;
    ctx.shadowBlur = headlightBlur;
    ctx.shadowColor = isNight ? '#ffffe0' : 'transparent';
    ctx.beginPath();
    ctx.arc(23, -8, 2, 0, Math.PI * 2);
    ctx.arc(23, 8, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-marceli-spyder') {
    // McLaren 720S Spider Eye-Socket Boomerang LED Strips & Projectors (marceli.jpg)
    ctx.shadowBlur = isNight ? 24 : 8;
    ctx.shadowColor = isNight ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
    [-1, 1].forEach(side => {
      // Signature Boomerang DRL LED eyebrow ribbon
      ctx.strokeStyle = isNight ? '#ffffff' : '#f8fafc';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(26.2, side * 4.2);
      ctx.lineTo(24.0, side * 9.6);
      ctx.stroke();

      // Dual High-Intensity Projector Bulbs inside socket
      ctx.fillStyle = isNight ? '#f8fafc' : '#ffffff';
      ctx.beginPath();
      ctx.arc(23.5, side * 7.5, 1.3, 0, Math.PI * 2);
      ctx.arc(22.0, side * 6.0, 1.0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-arbier-rr7') {
    // Audi RS7 Matrix LED Laser Headlights & Crystalline DRLs (Matches audi1.png)
    ctx.fillStyle = isNight ? '#e0f2fe' : '#ffffff';
    ctx.shadowBlur = headlightBlur;
    ctx.shadowColor = isNight ? '#38bdf8' : 'transparent';
    
    // Left headlight cluster
    ctx.beginPath();
    ctx.moveTo(27.8, -6.0);
    ctx.lineTo(24.5, -11.0);
    ctx.lineTo(23.5, -9.5);
    ctx.lineTo(26.5, -5.5);
    ctx.closePath();
    ctx.fill();

    // Right headlight cluster
    ctx.beginPath();
    ctx.moveTo(27.8, 6.0);
    ctx.lineTo(24.5, 11.0);
    ctx.lineTo(23.5, 9.5);
    ctx.lineTo(26.5, 5.5);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Outer Matrix DRL light tube
    ctx.strokeStyle = isNight ? 'rgba(56, 189, 248, 0.9)' : 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(27.8, -6.0); ctx.lineTo(24.2, -11.2);
    ctx.moveTo(27.8, 6.0); ctx.lineTo(24.2, 11.2);
    ctx.stroke();
  } else if (carStats.id === 'car-caneli-zx1') {
    // Corvette C8 Angular LED Projector Headlights & Cyan Laser Accents (Matches corvette.png)
    ctx.fillStyle = isNight ? '#e0f2fe' : '#ffffff';
    ctx.shadowBlur = headlightBlur;
    ctx.shadowColor = isNight ? '#38bdf8' : 'transparent';

    // Left C8 Headlamp
    ctx.beginPath();
    ctx.moveTo(27.5, -5.5);
    ctx.lineTo(23.5, -11.5);
    ctx.lineTo(22.0, -9.5);
    ctx.lineTo(25.5, -5.0);
    ctx.closePath();
    ctx.fill();

    // Right C8 Headlamp
    ctx.beginPath();
    ctx.moveTo(27.5, 5.5);
    ctx.lineTo(23.5, 11.5);
    ctx.lineTo(22.0, 9.5);
    ctx.lineTo(25.5, 5.0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Cyan projector laser accents
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(25.0, -8.0, 1.2, 1.0);
    ctx.fillRect(25.0, 7.0, 1.2, 1.0);
  } else if (carStats.id === 'car-br47') {
    // Formula 1 Nose Tip LED Safety Strobe
    ctx.fillStyle = isNight ? '#ffffff' : '#fef08a';
    ctx.shadowBlur = isNight ? 12 : 0;
    ctx.shadowColor = '#ffffff';
    ctx.fillRect(34.2, -0.6, 0.8, 1.2);
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-siestre') {
    // Rimac Nevera R Matrix LED Projectors & Crystalline DRL Eyebrows
    ctx.fillStyle = isNight ? '#e0f2fe' : '#ffffff';
    ctx.shadowBlur = headlightBlur;
    ctx.shadowColor = isNight ? '#38bdf8' : 'transparent';
    
    // Left multi-projector cluster
    ctx.beginPath();
    ctx.moveTo(27.8, -6.8);
    ctx.lineTo(22.0, -10.8);
    ctx.lineTo(21.2, -8.2);
    ctx.lineTo(25.5, -6.0);
    ctx.closePath();
    ctx.fill();

    // Right multi-projector cluster
    ctx.beginPath();
    ctx.moveTo(27.8, 6.8);
    ctx.lineTo(22.0, 10.8);
    ctx.lineTo(21.2, 8.2);
    ctx.lineTo(25.5, 6.0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Crystalline DRL Eyebrow light guides
    ctx.strokeStyle = isNight ? 'rgba(56, 189, 248, 0.9)' : 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(28.0, -6.8); ctx.lineTo(21.8, -11.0);
    ctx.moveTo(28.0, 6.8); ctx.lineTo(21.8, 11.0);
    ctx.stroke();
  } else if (carStats.id === 'car-frestta-f10') {
    // Formula 1 aerodynamic nose & front wing LED projectors
    ctx.fillStyle = whiteBulbColor;
    ctx.shadowBlur = isNight ? 15 : 0;
    ctx.shadowColor = isNight ? '#fff' : 'transparent';
    ctx.fillRect(32, -3, 2, 1.5);
    ctx.fillRect(32, 1.5, 2, 1.5);
    ctx.fillRect(34, -14, 1.5, 1.5);
    ctx.fillRect(34, 12.5, 1.5, 1.5);
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-avesta-ultra') {
    // Lamborghini Sián Y-shaped DRL headlights (Crisp white-cyan LEDs)
    ctx.fillStyle = isNight ? '#e0f2fe' : '#38bdf8';
    ctx.shadowBlur = isNight ? 20 : 0;
    ctx.shadowColor = isNight ? '#38bdf8' : 'transparent';
    // Left Y-light
    ctx.beginPath();
    ctx.moveTo(31, -7);
    ctx.lineTo(25, -12);
    ctx.lineTo(26, -12);
    ctx.lineTo(32, -7);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(31, -7);
    ctx.lineTo(24, -6);
    ctx.lineTo(24, -7);
    ctx.lineTo(31, -8);
    ctx.fill();
    // Right Y-light
    ctx.beginPath();
    ctx.moveTo(31, 7);
    ctx.lineTo(25, 12);
    ctx.lineTo(26, 12);
    ctx.lineTo(32, 7);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(31, 7);
    ctx.lineTo(24, 6);
    ctx.lineTo(24, 7);
    ctx.lineTo(31, 8);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (carStats.type === 'suv') {
    ctx.fillStyle = defaultBulbColor;
    ctx.fillRect(18, -10, 4, 4);
    ctx.fillRect(18, 6, 4, 4);
  } else if (carStats.type === 'sport' || carStats.type === 'hyper') {
    ctx.fillStyle = defaultBulbColor;
    ctx.beginPath();
    ctx.moveTo(18, -6);
    ctx.lineTo(21, -8);
    ctx.lineTo(20, -4);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(18, 6);
    ctx.lineTo(21, 8);
    ctx.lineTo(20, 4);
    ctx.fill();
  } else {
    ctx.fillStyle = defaultBulbColor;
    ctx.beginPath();
    ctx.arc(18, -6, 2, 0, Math.PI*2);
    ctx.arc(18, 6, 2, 0, Math.PI*2);
    ctx.fill();
  }

  // Taillights
  ctx.fillStyle = isBraking ? '#ff0000' : '#cc0000';
  ctx.save();
  ctx.shadowBlur = isBraking ? 40 : 15;
  ctx.shadowColor = isBraking ? 'rgba(255, 50, 50, 1.0)' : 'rgba(255, 0, 0, 0.6)';

  if (carStats.id === 'car-hydra-vyree') {
    // Aston Martin Valkyrie style taillights (thin LED strips)
    ctx.shadowBlur = isBraking ? 25 : 10;
    ctx.fillRect(-28, -10, 1, 4);
    ctx.fillRect(-28, 6, 1, 4);
  } else if (carStats.id === 'car-hydra-stedring-58') {
    // Hydra Stedring '58 (Classic round taillights)
    ctx.shadowBlur = isBraking ? 25 : 10;
    ctx.beginPath();
    ctx.arc(-32, -7, 2, 0, Math.PI * 2);
    ctx.arc(-32, 7, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (carStats.id === 'car-avesta-revo') {
    // Y-shaped taillights (Lamborghini Revuelto style)
    ctx.shadowBlur = isBraking ? 25 : 10;
    
    // Left taillight (Y shape)
    ctx.beginPath();
    ctx.moveTo(-28, -5);
    ctx.lineTo(-26, -8);
    ctx.lineTo(-27, -8);
    ctx.lineTo(-29, -5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-28, -5);
    ctx.lineTo(-24, -4);
    ctx.lineTo(-24, -5);
    ctx.lineTo(-28, -6);
    ctx.fill();

    // Right taillight (Y shape)
    ctx.beginPath();
    ctx.moveTo(-28, 5);
    ctx.lineTo(-26, 8);
    ctx.lineTo(-27, 8);
    ctx.lineTo(-29, 5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-28, 5);
    ctx.lineTo(-24, 4);
    ctx.lineTo(-24, 5);
    ctx.lineTo(-28, 6);
    ctx.fill();
  } else if (carStats.id === 'car-frestta-tines') {
    // Round taillights (LaFerrari style)
    ctx.shadowBlur = isBraking ? 25 : 10;
    
    ctx.beginPath();
    ctx.arc(-28, -7, 2.5, 0, Math.PI*2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(-28, 7, 2.5, 0, Math.PI*2);
    ctx.fill();
  } else if (carStats.id === 'car-regali-rx1') {
    // Wide taillights
    ctx.shadowBlur = isBraking ? 25 : 10;
    ctx.fillRect(-29, -10, 1, 6);
    ctx.fillRect(-29, 4, 1, 6);
  } else if (carStats.id === 'car-regali-chasew') {
    // Taillights (Wide flat line)
    ctx.shadowBlur = isBraking ? 20 : 10;
    ctx.fillRect(-24, -8, 1, 16);
  } else if (carStats.id === 'car-pnisther-200gt') {
    // Porsche 911 (992) Continuous Three-Dimensional Red OLED Light Strip
    ctx.shadowBlur = isBraking ? 25 : 12;
    ctx.shadowColor = '#ff0033';
    ctx.strokeStyle = isBraking ? '#ff0022' : '#dc2626';
    ctx.lineWidth = isBraking ? 2.2 : 1.5;
    ctx.beginPath();
    ctx.moveTo(-29.5, -9.5);
    ctx.quadraticCurveTo(-31.2, 0, -29.5, 9.5);
    ctx.stroke();

    // Central Glowing Porsche script
    if (isBraking) {
      ctx.fillStyle = '#ff3344';
      ctx.fillRect(-30.8, -2.5, 1.0, 5.0);
    }
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-pnisther-cugan') {
    // Porsche Cayenne Coupe / Macan Full-Width 3D Lightbar & Roof Brake Lamp (Pnisther Cugan)
    ctx.shadowBlur = isBraking ? 28 : 12;
    ctx.shadowColor = '#ff0033';
    ctx.strokeStyle = isBraking ? '#ff0022' : '#dc2626';
    ctx.lineWidth = isBraking ? 2.5 : 1.8;
    
    // Continuous 3D lightbar across full width of tailgate
    ctx.beginPath();
    ctx.moveTo(-29.6, -10.5);
    ctx.lineTo(-30.2, -6.5);
    ctx.lineTo(-30.4, 0);
    ctx.lineTo(-30.2, 6.5);
    ctx.lineTo(-29.6, 10.5);
    ctx.stroke();

    // Outer brake light clusters
    if (isBraking) {
      ctx.fillStyle = '#ff0022';
      ctx.fillRect(-29.8, -10.8, 1.2, 3.5);
      ctx.fillRect(-29.8, 7.3, 1.2, 3.5);

      // Upper roof spoiler third brake light
      ctx.fillStyle = '#ff0033';
      ctx.fillRect(-13.2, -2.5, 1.0, 5.0);
    }
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-gfenis') {
    // Star shaped taillights
    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };
    drawStar(-21, -8, 5, 3, 1.5);
    drawStar(-21, 8, 5, 3, 1.5);
  } else if (carStats.id === 'car-uiner-i6') {
    // BMW i8 / i4 Floating C-Pillar Boomerang 3D LED Light Blade Taillights
    ctx.shadowBlur = isBraking ? 25 : 12;
    ctx.shadowColor = '#ff0033';
    ctx.strokeStyle = isBraking ? '#ff0022' : '#dc2626';
    ctx.lineWidth = isBraking ? 2.5 : 1.8;
    
    // Right Boomerang LED Blade
    ctx.beginPath();
    ctx.moveTo(-23.0, -8.5);
    ctx.lineTo(-28.5, -8.0);
    ctx.bezierCurveTo(-30.0, -6.5, -29.8, -4.5, -28.0, -4.0);
    ctx.stroke();
    
    // Left Boomerang LED Blade
    ctx.beginPath();
    ctx.moveTo(-23.0, 8.5);
    ctx.lineTo(-28.5, 8.0);
    ctx.bezierCurveTo(-30.0, 6.5, -29.8, 4.5, -28.0, 4.0);
    ctx.stroke();

    // Central Glass Canopy Third High-Mounted Brake Light
    if (isBraking) {
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(-22.5, -2.5, 1.2, 5.0);
    }
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-marceli-spyder') {
    // McLaren 720S Spider Curved Horizontal LED Blade Taillights & Active Airbrake Glow
    ctx.shadowBlur = isBraking ? 32 : 14;
    ctx.shadowColor = '#ff0033';
    ctx.strokeStyle = isBraking ? '#ff0022' : '#dc2626';
    ctx.lineWidth = isBraking ? 2.4 : 1.6;
    
    // Right curved LED ribbon
    ctx.beginPath();
    ctx.moveTo(-31.5, -4.5);
    ctx.lineTo(-30.5, -8.5);
    ctx.bezierCurveTo(-29.5, -11.5, -28.0, -12.5, -27.0, -13.0);
    ctx.stroke();

    // Left curved LED ribbon
    ctx.beginPath();
    ctx.moveTo(-31.5, 4.5);
    ctx.lineTo(-30.5, 8.5);
    ctx.bezierCurveTo(-29.5, 11.5, -28.0, 12.5, -27.0, 13.0);
    ctx.stroke();
    
    if (isBraking) {
      // Central high-mounted third brake light strip integrated into airbrake wing
      ctx.fillStyle = '#ff0022';
      ctx.fillRect(-32.5, -2.5, 1.2, 5.0);

      // Glowing red exhaust vent reflection under braking heat
      ctx.fillStyle = 'rgba(255, 68, 0, 0.45)';
      ctx.beginPath(); ctx.ellipse(-28.2, 0, 2.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-arbier-rr7') {
    // Audi RS7 Continuous Thin OLED Lightbar Across Tailgate (Matches audi1.png)
    ctx.shadowBlur = isBraking ? 25 : 12;
    ctx.shadowColor = '#ff0000';
    ctx.fillStyle = isBraking ? '#ff1e1e' : '#dc2626';
    ctx.fillRect(-28.6, -11.5, 0.8, 23.0);
    
    // Outer animated light clusters
    ctx.fillRect(-28.8, -12.5, 1.0, 2.5);
    ctx.fillRect(-28.8, 10.0, 1.0, 2.5);

    if (isBraking) {
      ctx.fillStyle = '#ff2222';
      ctx.fillRect(-18.0, -2.5, 0.8, 5.0); // High-mounted brake light strip
    }
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-caneli-zx1') {
    // Corvette C8 Dual Angular LED Chevrons & 3rd Brake Light (Matches corvette.png)
    ctx.shadowBlur = isBraking ? 25 : 12;
    ctx.shadowColor = '#ff0000';
    ctx.fillStyle = isBraking ? '#ff1e1e' : '#dc2626';

    // Left C8 dual-segment chevron taillights
    ctx.beginPath();
    ctx.moveTo(-29.2, -10.5); ctx.lineTo(-27.5, -11.5); ctx.lineTo(-27.5, -10.2); ctx.lineTo(-29.0, -9.5); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-29.0, -8.5); ctx.lineTo(-27.5, -9.0); ctx.lineTo(-27.5, -7.8); ctx.lineTo(-29.0, -7.2); ctx.fill();

    // Right C8 dual-segment chevron taillights
    ctx.beginPath();
    ctx.moveTo(-29.2, 10.5); ctx.lineTo(-27.5, 11.5); ctx.lineTo(-27.5, 10.2); ctx.lineTo(-29.0, 9.5); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-29.0, 8.5); ctx.lineTo(-27.5, 9.0); ctx.lineTo(-27.5, 7.8); ctx.lineTo(-29.0, 7.2); ctx.fill();

    if (isBraking) {
      ctx.fillStyle = '#ff2222';
      ctx.fillRect(-28.5, -2.5, 0.8, 5.0); // Central spoiler brake light
    }
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-br47') {
    // Formula 1 Central FIA Rain & Safety LED + Rear Wing Endplate Strobes (Matches f1.png)
    ctx.shadowBlur = isBraking ? 35 : 15;
    ctx.shadowColor = '#ff0000';
    ctx.fillStyle = isBraking ? '#ff0000' : '#dc2626';

    // Central FIA crash-structure rain light
    ctx.fillRect(-27.8, -1.0, 1.5, 2.0);

    // Rear wing endplate vertical LED indicators
    ctx.fillRect(-29.0, -13.5, 0.8, 2.5);
    ctx.fillRect(-29.0, 11.0, 0.8, 2.5);

    if (isBraking) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-27.2, -0.5, 0.8, 1.0); // Intense white core
    }
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-siestre') {
    // Rimac Nevera R Laser-Red Full-Width LED Lightbar & Boomerang Claws
    ctx.shadowBlur = isBraking ? 25 : 12;
    ctx.shadowColor = '#ff0000';
    ctx.fillStyle = isBraking ? '#ff1e1e' : '#dc2626';
    
    // Main Continuous Center Lightbar
    ctx.fillRect(-29.2, -12.5, 1.2, 25.0);
    
    // Aggressive Outer Boomerang Claws (Hooking forward onto rear fenders)
    ctx.beginPath();
    ctx.moveTo(-29.2, -12.5);
    ctx.lineTo(-26.5, -13.6);
    ctx.lineTo(-27.2, -12.2);
    ctx.lineTo(-29.2, -11.0);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-29.2, 12.5);
    ctx.lineTo(-26.5, 13.6);
    ctx.lineTo(-27.2, 12.2);
    ctx.lineTo(-29.2, 11.0);
    ctx.closePath();
    ctx.fill();
    
    // Central High-Mounted 3rd Brake Light on Braking
    if (isBraking) {
      ctx.fillStyle = '#ff3333';
      ctx.fillRect(-26.2, -1.8, 1.0, 3.6);
    }
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-frestta-f10') {
    // Formula 1 Central FIA Rain & Brake LED + Wing Endplate Strobes
    ctx.shadowBlur = isBraking ? 35 : 15;
    ctx.fillStyle = isBraking ? '#ff0000' : '#dc2626';
    // Central FIA flashing/safety light
    ctx.fillRect(-35, -1.5, 2.5, 3);
    // Rear wing endplate vertical LED indicators
    ctx.fillRect(-36, -14.8, 1.2, 3);
    ctx.fillRect(-36, 11.8, 1.2, 3);
    if (isBraking) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-34.5, -0.75, 1.5, 1.5); // Intense bright center core
    }
  } else if (carStats.id === 'car-avesta-ultra') {
    // Triple hexagonal 3D LED taillight clusters on left and right
    ctx.shadowBlur = isBraking ? 30 : 15;
    ctx.fillStyle = isBraking ? '#ff1e1e' : '#dc2626';
    // Left 3 hex taillights
    ctx.fillRect(-32, -11.5, 2.5, 1.8);
    ctx.fillRect(-32, -8.5, 2.5, 1.8);
    ctx.fillRect(-32, -5.5, 2.5, 1.8);
    // Right 3 hex taillights
    ctx.fillRect(-32, 3.7, 2.5, 1.8);
    ctx.fillRect(-32, 6.7, 2.5, 1.8);
    ctx.fillRect(-32, 9.7, 2.5, 1.8);
    if (isBraking) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-31.5, -8.5, 1.2, 1.2);
      ctx.fillRect(-31.5, 6.7, 1.2, 1.2);
    }
  } else if (carStats.id === 'car-uiner') {
    // BMW M3 G80 3D Smoked L-shaped LED Taillights
    ctx.fillStyle = isBraking ? '#ff0000' : (isNight ? '#ef4444' : '#b91c1c');
    ctx.shadowBlur = isBraking ? 14 : (isNight ? 8 : 0);
    ctx.shadowColor = '#ff0000';
    
    // Left L-shaped lightbar
    ctx.beginPath();
    ctx.moveTo(-25.2, -7.0);
    ctx.lineTo(-26.2, -7.0);
    ctx.lineTo(-26.2, -10.5);
    ctx.lineTo(-24.5, -11.2);
    ctx.lineTo(-24.5, -10.0);
    ctx.lineTo(-25.2, -9.5);
    ctx.closePath();
    ctx.fill();

    // Right L-shaped lightbar
    ctx.beginPath();
    ctx.moveTo(-25.2, 7.0);
    ctx.lineTo(-26.2, 7.0);
    ctx.lineTo(-26.2, 10.5);
    ctx.lineTo(-24.5, 11.2);
    ctx.lineTo(-24.5, 10.0);
    ctx.lineTo(-25.2, 9.5);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-elegus-z1') {
    // Twin Classic Round GT40 Taillights on rear corners
    ctx.fillStyle = isBraking ? '#ff0000' : (isNight ? '#dc2626' : '#991b1b');
    ctx.shadowBlur = isBraking ? 14 : (isNight ? 7 : 0);
    ctx.shadowColor = '#ff0000';
    
    ctx.beginPath();
    ctx.arc(-27, -8.8, isBraking ? 1.9 : 1.5, 0, Math.PI * 2);
    ctx.arc(-27, -11.2, isBraking ? 1.9 : 1.5, 0, Math.PI * 2);
    ctx.arc(-27, 8.8, isBraking ? 1.9 : 1.5, 0, Math.PI * 2);
    ctx.arc(-27, 11.2, isBraking ? 1.9 : 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (carStats.id === 'car-elegus-ruara') {
    // Triple Round LED Jewel Taillight Clusters (Pagani Signature Triad)
    ctx.fillStyle = isBraking ? '#ff1e1e' : (isNight ? '#ef4444' : '#991b1b');
    ctx.shadowBlur = isBraking ? 14 : (isNight ? 6 : 0);
    ctx.shadowColor = '#ff0000';

    // Left Triad Taillights
    ctx.beginPath();
    ctx.arc(-27.2, -8.0, isBraking ? 1.7 : 1.3, 0, Math.PI * 2);
    ctx.arc(-27.2, -10.2, isBraking ? 1.7 : 1.3, 0, Math.PI * 2);
    ctx.arc(-25.5, -9.1, isBraking ? 1.7 : 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Right Triad Taillights
    ctx.beginPath();
    ctx.arc(-27.2, 8.0, isBraking ? 1.7 : 1.3, 0, Math.PI * 2);
    ctx.arc(-27.2, 10.2, isBraking ? 1.7 : 1.3, 0, Math.PI * 2);
    ctx.arc(-25.5, 9.1, isBraking ? 1.7 : 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (carStats.id === 'car-condute-cleo') {
    // Range Rover Signature Horizontal Wraparound LED Taillights & 3rd Brake Light
    ctx.fillStyle = isBraking ? '#ff0000' : (isNight ? '#ef4444' : '#991b1b');
    ctx.shadowBlur = isBraking ? 14 : (isNight ? 6 : 0);
    ctx.shadowColor = '#ff0000';

    // Left Wraparound Taillight Strip
    ctx.beginPath();
    ctx.moveTo(-27.4, -7.5);
    ctx.lineTo(-27.4, -12.0);
    ctx.lineTo(-24.5, -12.8);
    ctx.lineTo(-24.5, -11.6);
    ctx.lineTo(-26.2, -11.0);
    ctx.lineTo(-26.2, -7.5);
    ctx.closePath();
    ctx.fill();

    // Right Wraparound Taillight Strip
    ctx.beginPath();
    ctx.moveTo(-27.4, 7.5);
    ctx.lineTo(-27.4, 12.0);
    ctx.lineTo(-24.5, 12.8);
    ctx.lineTo(-24.5, 11.6);
    ctx.lineTo(-26.2, 11.0);
    ctx.lineTo(-26.2, 7.5);
    ctx.closePath();
    ctx.fill();

    // Center High-Mount 3rd Brake Light (Top Spoiler) on Braking
    if (isBraking) {
      ctx.fillStyle = '#ff2222';
      ctx.fillRect(-25.2, -2.5, 1.0, 5.0);
    }
    ctx.shadowBlur = 0;
  } else if (carStats.type === 'suv') {
    ctx.fillRect(-22, -10, 3, 4);
    ctx.fillRect(-22, 6, 3, 4);
  } else if (carStats.type === 'sport' || carStats.type === 'hyper') {
    ctx.fillRect(-22, -8, 2, 4);
    ctx.fillRect(-22, 4, 2, 4);
  } else {
    ctx.beginPath();
    ctx.arc(-20, -6, 2, 0, Math.PI*2);
    ctx.arc(-20, 6, 2, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

// Gradients are in car-local coordinates, so each car colour needs them built only once.
const beamGradients = new WeakMap<CanvasRenderingContext2D, Map<string, CanvasGradient[]>>();

function getBeamGradients(ctx: CanvasRenderingContext2D, carStats: Car, baseColor: string): CanvasGradient[] {
  let byKey = beamGradients.get(ctx);
  if (!byKey) {
    byKey = new Map();
    beamGradients.set(ctx, byKey);
  }
  const isPrega = carStats.id === 'car-prega';
  const key = `${isPrega ? 'p' : 'n'}|${baseColor}`;
  let grads = byKey.get(key);
  if (grads) return grads;

  const alpha = 0.12;
  const length = 300;

  // 1. Ground Illumination (Light hitting the road directly in front)
  const groundGrad = ctx.createRadialGradient(40, 0, 5, 40, 0, 80);
  const groundColor = isPrega ? '255, 255, 150' : '255, 255, 200';
  groundGrad.addColorStop(0, `rgba(${groundColor}, 0.15)`); // Warmer, lower alpha
  groundGrad.addColorStop(0.6, `rgba(${groundColor}, 0.03)`);
  groundGrad.addColorStop(1, `rgba(${groundColor}, 0)`);

  // 2. Atmospheric Beams (The "fog" or "dust" in the air)
  const beamGrad = ctx.createLinearGradient(20, 0, 20 + length, 0);
  const beamColor = isPrega ? '255, 255, 180' : '255, 255, 240';
  beamGrad.addColorStop(0, `rgba(${beamColor}, ${alpha})`);
  beamGrad.addColorStop(0.5, `rgba(${beamColor}, ${alpha * 0.3})`);
  beamGrad.addColorStop(1, `rgba(${beamColor}, 0)`);

  // 3. Lens Flare / Bulb Glow (Very subtle)
  const bulbGlow = ctx.createRadialGradient(25, 0, 1, 25, 0, 5);
  bulbGlow.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  bulbGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

  // 4. Soft Body Glow (Ambient light from car)
  const bodyGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, 50);
  let r = 255, g = 255, b = 255;
  if (baseColor.startsWith('#') && baseColor.length === 7) {
    r = parseInt(baseColor.slice(1, 3), 16);
    g = parseInt(baseColor.slice(3, 5), 16);
    b = parseInt(baseColor.slice(5, 7), 16);
  }
  bodyGlow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.08)`);
  bodyGlow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

  grads = [groundGrad, beamGrad, bulbGlow, bodyGlow];
  byKey.set(key, grads);
  return grads;
}

/** Night Mode / Headlight Beams (Bloom & Ground Illumination), in car-local coordinates. */
export function drawHeadlightBeams(ctx: CanvasRenderingContext2D, carStats: Car, baseColor: string) {
  const [groundGrad, beamGrad, bulbGlow, bodyGlow] = getBeamGradients(ctx, carStats, baseColor);
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const length = 300; // Further reduced
  const width = 60;  // Further reduced

  ctx.fillStyle = groundGrad;
  ctx.beginPath();
  ctx.ellipse(40, 0, 60, 35, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = beamGrad;

  // Left headlight beam (Conical)
  ctx.beginPath();
  ctx.moveTo(22, -7);
  ctx.lineTo(22 + length, -width);
  ctx.lineTo(22 + length, width * 0.05);
  ctx.closePath();
  ctx.fill();

  // Right headlight beam (Conical)
  ctx.beginPath();
  ctx.moveTo(22, 7);
  ctx.lineTo(22 + length, width);
  ctx.lineTo(22 + length, -width * 0.05);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = bulbGlow;
  ctx.beginPath();
  ctx.arc(25, -7, 4, 0, Math.PI * 2);
  ctx.arc(25, 7, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = bodyGlow;
  ctx.fillRect(-50, -50, 100, 100);

  ctx.restore();
}
