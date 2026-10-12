import { Car } from '../store';
import { changeColorBrightness } from './RenderUtils';

export function drawCarBody2(ctx: CanvasRenderingContext2D, carStats: Car, baseColor: string, isBraking: boolean): boolean {
  if (carStats.id === 'car-avesta-revo') {
    // Lamborghini Revuelto V12 Hybrid (Exact match to lambo.jpg)
    const limeGreen = baseColor || '#84cc16';
    const neroCarbon = '#090d16';
    const darkMesh = '#1e293b';

    // 1. Underbody Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 33, 14.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Extreme Stealth-Fighter Faceted Silhouette (Matching lambo.jpg)
    ctx.fillStyle = limeGreen;
    ctx.beginPath();
    ctx.moveTo(31.5, 0); // Sharp nose apex
    ctx.lineTo(27.5, -6.5); // Front bumper edge
    ctx.lineTo(25.0, -12.5); // Front sharp fender
    ctx.lineTo(13.0, -11.5); // Fender side
    ctx.lineTo(3.0, -9.5); // Door pinch
    ctx.lineTo(-7.0, -14.5); // Massive rear intake flare
    ctx.lineTo(-24.5, -14.2); // Rear wide wheel arch
    ctx.lineTo(-29.5, -10.5); // Rear corner
    ctx.lineTo(-29.0, -4.5); // High-mount exhaust deck
    ctx.lineTo(-29.0, 4.5);
    ctx.lineTo(-29.5, 10.5);
    ctx.lineTo(-24.5, 14.2);
    ctx.lineTo(-7.0, 14.5);
    ctx.lineTo(3.0, 9.5);
    ctx.lineTo(13.0, 11.5);
    ctx.lineTo(25.0, 12.5);
    ctx.lineTo(27.5, 6.5);
    ctx.closePath();
    ctx.fill();

    // High-gloss electric green reflections
    const limeGrd = ctx.createLinearGradient(0, -14.5, 0, 14.5);
    limeGrd.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    limeGrd.addColorStop(0.25, 'rgba(255, 255, 255, 0.08)');
    limeGrd.addColorStop(0.5, 'transparent');
    limeGrd.addColorStop(0.75, 'rgba(0, 0, 0, 0.15)');
    limeGrd.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
    ctx.fillStyle = limeGrd;
    ctx.fill();

    // 3. Front Angular Hood Recesses & Y-Channel (as seen in lambo.jpg)
    ctx.fillStyle = neroCarbon;
    // Dual front hood extractor vents
    ctx.beginPath();
    ctx.moveTo(23, -8.0); ctx.lineTo(18, -9.5); ctx.lineTo(14, -5.5); ctx.lineTo(18, -4.5); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(23, 8.0); ctx.lineTo(18, 9.5); ctx.lineTo(14, 5.5); ctx.lineTo(18, 4.5); ctx.closePath();
    ctx.fill();

    // Front Y-Shaped Nose Crease Lines
    ctx.strokeStyle = '#4d7c0f'; ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(31.5, 0); ctx.lineTo(20, -3.5);
    ctx.moveTo(31.5, 0); ctx.lineTo(20, 3.5);
    ctx.stroke();

    // 4. Cockpit Canopy & Visible Tan/Leather Interior (Matching lambo.jpg)
    ctx.fillStyle = neroCarbon;
    ctx.beginPath();
    ctx.moveTo(12.5, 0); // Windshield top
    ctx.lineTo(9.5, -7.5); // A-pillar
    ctx.lineTo(-2.0, -8.0); // B-pillar
    ctx.lineTo(-14.0, -5.0); // Engine channel
    ctx.lineTo(-14.0, 5.0);
    ctx.lineTo(-2.0, 8.0);
    ctx.lineTo(9.5, 7.5);
    ctx.closePath();
    ctx.fill();

    // Curved front windshield glass
    const glassGrd = ctx.createLinearGradient(12, -7, -2, 7);
    glassGrd.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    glassGrd.addColorStop(0.3, 'rgba(56, 189, 248, 0.2)');
    glassGrd.addColorStop(0.6, 'transparent');
    ctx.fillStyle = glassGrd;
    ctx.beginPath();
    ctx.moveTo(12, 0); ctx.lineTo(9, -7); ctx.lineTo(-1, -7.5); ctx.lineTo(-1, 7.5); ctx.lineTo(9, 7); ctx.closePath();
    ctx.fill();

    // Visible Tan Sports Bucket Seats (Matching lambo.jpg interior!)
    ctx.fillStyle = '#b45309'; // Warm amber/tan leather seats visible in lambo.jpg
    ctx.beginPath(); ctx.ellipse(4, -3.8, 3.5, 2.2, -Math.PI / 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(4, 3.8, 3.5, 2.2, Math.PI / 12, 0, Math.PI * 2); ctx.fill();

    // Central Single Windshield Wiper
    ctx.strokeStyle = '#020617'; ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(11, -1.5); ctx.lineTo(1.5, 0); ctx.stroke();

    // 5. Dual-Bubble Roof & Channeled Mid-Engine Bay (as seen in lambo.jpg)
    // Lime green roof channel spine
    ctx.fillStyle = limeGreen;
    ctx.beginPath();
    ctx.moveTo(-1.0, -3.5); ctx.lineTo(-1.0, 3.5); ctx.lineTo(-9.0, 2.5); ctx.lineTo(-9.0, -2.5); ctx.closePath();
    ctx.fill();

    // 6. Exposed V12 Engine Bay with Hexagonal Mesh & Carbon X-Brace (Matching lambo.jpg)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-9.5, -4.5); ctx.lineTo(-25.5, -6.5); ctx.lineTo(-25.5, 6.5); ctx.lineTo(-9.5, 4.5); ctx.closePath();
    ctx.fill();

    // Hexagonal engine cooling louvers
    ctx.fillStyle = darkMesh;
    ctx.fillRect(-14, -5.5, 11, 11);

    // Carbon X-Brace over engine
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-11, -4.5); ctx.lineTo(-23, 4.5);
    ctx.moveTo(-11, 4.5); ctx.lineTo(-23, -4.5);
    ctx.stroke();

    // 6.5L V12 Engine Block Detail
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath(); ctx.arc(-17, 0, 1.8, 0, Math.PI * 2); ctx.fill();

    // 7. High-Mounted Dual Hexagonal Exhaust Outlets (Revuelto signature top exits)
    [-1, 1].forEach(side => {
      ctx.fillStyle = '#94a3b8'; // Hexagonal exhaust frame
      ctx.beginPath();
      const ex = -27.5;
      const ey = side * 2.5;
      ctx.moveTo(ex + 1.2, ey);
      ctx.lineTo(ex + 0.6, ey - 1.2);
      ctx.lineTo(ex - 0.6, ey - 1.2);
      ctx.lineTo(ex - 1.2, ey);
      ctx.lineTo(ex - 0.6, ey + 1.2);
      ctx.lineTo(ex + 0.6, ey + 1.2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#020617'; // Inner exhaust hole
      ctx.beginPath(); ctx.arc(ex, ey, 0.7, 0, Math.PI * 2); ctx.fill();
    });

    // 8. Sharp Aerodynamic Mirrors
    ctx.fillStyle = limeGreen;
    ctx.beginPath(); ctx.moveTo(7, -8); ctx.lineTo(10, -14.5); ctx.lineTo(7, -15.2); ctx.lineTo(5, -8.5); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(7, 8); ctx.lineTo(10, 14.5); ctx.lineTo(7, 15.2); ctx.lineTo(5, 8.5); ctx.closePath(); ctx.fill();

    // 9. Rear Aggressive Diffuser & Floating Aero Blades
    ctx.fillStyle = neroCarbon;
    ctx.fillRect(-29.5, -9.5, 1.5, 19.0);
    // Vertical diffuser fins
    [-6.5, -3.5, 3.5, 6.5].forEach(dy => {
      ctx.fillRect(-30.2, dy - 0.4, 1.5, 0.8);
    });

    return true;
  } else if (carStats.id === 'car-uiner') {
    // BMW M3 G80 Competition (Conceptual Art style - Alpine White, Carbon Roof, Dual Hood Louvers)
    const alpineWhite = '#f8fafc';
    const glossBlack = '#09090b';
    const carbonGray = '#2e2e33';
    const shadowWhite = '#e2e8f0';

    // 1. Muscular Performance Sedan Body Silhouette (Flared widebody fenders, aggressive stance)
    ctx.fillStyle = alpineWhite;
    ctx.beginPath();
    ctx.moveTo(28.5, -3.5); // Nose front-left
    ctx.quadraticCurveTo(29, 0, 28.5, 3.5); // Nose center
    ctx.lineTo(27, 8.5); // Front bumper right corner
    ctx.quadraticCurveTo(25, 12.8, 17, 13.5); // Front flared right wheel arch
    ctx.lineTo(10, 12.5); // Front fender back
    ctx.lineTo(3, 11.5); // Waistline
    ctx.lineTo(-6, 12.0); // Rear waistline
    ctx.quadraticCurveTo(-14, 14.0, -19, 13.8); // Wide flared rear right haunch
    ctx.lineTo(-24.5, 12.2); // Rear right corner
    ctx.quadraticCurveTo(-26.5, 10.5, -26.5, 7.5); // Rear bumper edge
    ctx.lineTo(-26.5, -7.5); // Rear bumper center
    ctx.quadraticCurveTo(-26.5, -10.5, -24.5, -12.2);
    ctx.lineTo(-19, -13.8); // Wide flared rear left haunch
    ctx.quadraticCurveTo(-14, -14.0, -6, -12.0);
    ctx.lineTo(3, -11.5);
    ctx.lineTo(10, -12.5);
    ctx.quadraticCurveTo(25, -12.8, 27, -8.5); // Front bumper left corner
    ctx.closePath();
    ctx.fill();

    // Subtle 3D Body Surface Creases / Ambient Shading
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // 2. Front Bumper Aero Canards / Splitter Winglets (Gloss Black)
    ctx.fillStyle = glossBlack;
    // Front corner flics / canards
    ctx.beginPath();
    ctx.moveTo(27, -9.5);
    ctx.lineTo(29, -11.5);
    ctx.lineTo(27.5, -12.5);
    ctx.lineTo(25.5, -10.5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(27, 9.5);
    ctx.lineTo(29, 11.5);
    ctx.lineTo(27.5, 12.5);
    ctx.lineTo(25.5, 10.5);
    ctx.closePath();
    ctx.fill();

    // Lower Front Splitter lip
    ctx.fillRect(28, -5.5, 1.2, 11);

    // Front Bumper Side Intakes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(27.2, -5.5);
    ctx.lineTo(25.5, -9.2);
    ctx.lineTo(23.8, -8.5);
    ctx.lineTo(25.2, -5.0);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(27.2, 5.5);
    ctx.lineTo(25.5, 9.2);
    ctx.lineTo(23.8, 8.5);
    ctx.lineTo(25.2, 5.0);
    ctx.closePath();
    ctx.fill();

    // 3. Giant Vertical Frameless Twin Kidney Grilles (Gloss Black with horizontal slats)
    // Left Kidney
    ctx.fillStyle = glossBlack;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(26.2, -3.2, 3.2, 2.7, 0.8);
    } else {
      ctx.rect(26.2, -3.2, 3.2, 2.7);
    }
    ctx.fill();

    // Right Kidney
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(26.2, 0.5, 3.2, 2.7, 0.8);
    } else {
      ctx.rect(26.2, 0.5, 3.2, 2.7);
    }
    ctx.fill();

    // Horizontal grille slats inside kidneys
    ctx.fillStyle = '#1e293b';
    [-2.4, -1.3].forEach(sy => {
      ctx.fillRect(26.5, sy, 2.6, 0.5);
    });
    [1.3, 2.4].forEach(sy => {
      ctx.fillRect(26.5, sy, 2.6, 0.5);
    });

    // M3 Badge on right kidney grille slat (Tiny red/sky-blue/silver dot)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(28.2, 0.8, 0.5, 0.5);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(28.2, 1.3, 0.5, 0.5);

    // Center Vertical Body Divider between grilles
    ctx.fillStyle = alpineWhite;
    ctx.fillRect(26.0, -0.4, 3.5, 0.8);

    // 4. BMW Roundel Badge (Centered above grilles on nose)
    ctx.fillStyle = '#09090b'; // Outer ring
    ctx.beginPath(); ctx.arc(26.8, 0, 1.25, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e2e8f0'; // Chrome border
    ctx.beginPath(); ctx.arc(26.8, 0, 1.05, 0, Math.PI * 2); ctx.fill();
    // 4 alternating blue and white quadrants
    ctx.fillStyle = '#0066b1'; // BMW Blue
    ctx.beginPath(); ctx.moveTo(26.8, 0); ctx.arc(26.8, 0, 0.85, 0, Math.PI * 0.5); ctx.fill();
    ctx.beginPath(); ctx.moveTo(26.8, 0); ctx.arc(26.8, 0, 0.85, Math.PI, Math.PI * 1.5); ctx.fill();
    ctx.fillStyle = '#ffffff'; // White
    ctx.beginPath(); ctx.moveTo(26.8, 0); ctx.arc(26.8, 0, 0.85, Math.PI * 0.5, Math.PI); ctx.fill();
    ctx.beginPath(); ctx.moveTo(26.8, 0); ctx.arc(26.8, 0, 0.85, Math.PI * 1.5, Math.PI * 2); ctx.fill();

    // 5. Sculpted Power Dome Creases & Vents on Hood
    // Dual front indentations behind grilles
    ctx.fillStyle = shadowWhite;
    ctx.beginPath();
    ctx.moveTo(25.5, -2.8);
    ctx.lineTo(21.5, -2.2);
    ctx.lineTo(21.5, -1.4);
    ctx.lineTo(25.5, -1.8);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(25.5, 2.8);
    ctx.lineTo(21.5, 2.2);
    ctx.lineTo(21.5, 1.4);
    ctx.lineTo(25.5, 1.8);
    ctx.closePath();
    ctx.fill();

    // Power dome ridge lines
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(25.5, -2.8);
    ctx.lineTo(13.5, -2.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(25.5, 2.8);
    ctx.lineTo(13.5, 2.2);
    ctx.stroke();

    // 6. Signature Dual Black Carbon Hood Louvers / Heat Extractor Vents
    [-7.8, 7.8].forEach(vy => {
      const isLeft = vy < 0;
      // Trapezoidal black louver housing
      ctx.fillStyle = glossBlack;
      ctx.beginPath();
      ctx.moveTo(19.8, isLeft ? -6.2 : 6.2);
      ctx.lineTo(14.5, isLeft ? -7.0 : 7.0);
      ctx.lineTo(14.0, isLeft ? -9.8 : 9.8);
      ctx.lineTo(19.2, isLeft ? -9.0 : 9.0);
      ctx.closePath();
      ctx.fill();

      // 3 Recessed horizontal cooling louvers/slats
      ctx.fillStyle = '#27272a';
      [15.2, 16.7, 18.2].forEach(lx => {
        ctx.fillRect(lx, isLeft ? -9.2 : 6.8, 1.0, 2.4);
      });
      ctx.fillStyle = '#09090b';
      [15.2, 16.7, 18.2].forEach(lx => {
        ctx.fillRect(lx + 0.6, isLeft ? -9.2 : 6.8, 0.4, 2.4);
      });
    });

    // 7. M Front Fender Gills / Air Breathers (Gloss Black)
    ctx.fillStyle = glossBlack;
    ctx.fillRect(10.5, -12.4, 3.2, 0.8);
    ctx.fillRect(10.5, 11.6, 3.2, 0.8);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(11.2, -12.2, 0.5, 0.4);
    ctx.fillRect(11.2, 11.8, 0.5, 0.4);

    // 8. Windshield & Cockpit Interior (M Carbon Bucket Seats, Dashboard, Steering Wheel)
    // Windshield Base Glass
    const m3GlassGrad = ctx.createLinearGradient(10, 0, -2, 0);
    m3GlassGrad.addColorStop(0, '#0f172a');
    m3GlassGrad.addColorStop(0.4, '#1e293b');
    m3GlassGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = m3GlassGrad;
    ctx.beginPath();
    ctx.moveTo(9.5, -8.2);
    ctx.quadraticCurveTo(11.5, 0, 9.5, 8.2);
    ctx.lineTo(-1.8, 7.8);
    ctx.lineTo(-1.8, -7.8);
    ctx.closePath();
    ctx.fill();

    // Visible Interior: Dashboard & M Carbon Bucket Seats
    // Dashboard arc
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(8.5, 0, 6.5, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.fill();

    // M Sport Steering Wheel (Left side of cockpit)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(5.2, -3.2, 1.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(5.0, -3.4, 0.4, 0.4);

    // Dual M Carbon Bucket Seats (Sage Green/Teal-Grey bolsters as seen in photo)
    ctx.fillStyle = '#334155'; // Dark headrest
    ctx.fillRect(1.5, -4.0, 1.5, 2.0);
    ctx.fillRect(1.5, 2.0, 1.5, 2.0);
    ctx.fillStyle = '#475569'; // Seat bolsters
    ctx.beginPath(); if (typeof ctx.roundRect === 'function') ctx.roundRect(-1.2, -4.6, 2.4, 3.2, 0.8); else ctx.rect(-1.2, -4.6, 2.4, 3.2); ctx.fill();
    ctx.beginPath(); if (typeof ctx.roundRect === 'function') ctx.roundRect(-1.2, 1.4, 2.4, 3.2, 0.8); else ctx.rect(-1.2, 1.4, 2.4, 3.2); ctx.fill();
    ctx.fillStyle = '#38bdf8'; // Subtle cyan interior ambient light
    ctx.fillRect(0.2, -3.2, 0.6, 0.4);
    ctx.fillRect(0.2, 2.8, 0.6, 0.4);

    // Specular windshield reflection
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(4, -2, 6, -Math.PI * 0.35, 0);
    ctx.stroke();

    // Single / dual wipers parked at base
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(9.0, -4.5);
    ctx.lineTo(4.5, -1.0);
    ctx.stroke();

    // 9. Full Lightweight Carbon Fiber Roof (with central aerodynamic channel & shark fin)
    ctx.fillStyle = carbonGray;
    ctx.beginPath();
    ctx.moveTo(-1.8, -6.8);
    ctx.lineTo(-1.8, 6.8);
    ctx.lineTo(-13.2, 6.5);
    ctx.lineTo(-13.2, -6.5);
    ctx.closePath();
    ctx.fill();

    // Carbon roof aerodynamic double-bubble center depression
    ctx.fillStyle = '#222226';
    ctx.fillRect(-13.2, -2.5, 11.4, 5.0);

    // Shark Fin Antenna (Gloss Black, centered on rear of roof)
    ctx.fillStyle = glossBlack;
    ctx.beginPath();
    ctx.moveTo(-9.5, 0);
    ctx.lineTo(-12.2, -0.6);
    ctx.lineTo(-12.8, 0);
    ctx.lineTo(-12.2, 0.6);
    ctx.closePath();
    ctx.fill();

    // White Roof Rails / Framing
    ctx.fillStyle = alpineWhite;
    ctx.fillRect(-1.8, -7.8, 11.4, 1.0);
    ctx.fillRect(-1.8, 6.8, 11.4, 1.0);

    // 10. M Aerodynamic Twin-Stalk Side Mirrors (Gloss Black / Carbon)
    [-12.8, 12.8].forEach(my => {
      const isLeft = my < 0;
      // Twin stalks
      ctx.fillStyle = glossBlack;
      ctx.fillRect(6.8, isLeft ? -11.8 : 10.8, 1.0, 1.8);
      ctx.fillRect(5.5, isLeft ? -11.5 : 10.5, 0.8, 1.5);
      // Aerodynamic mirror housing with top aero blade
      ctx.beginPath();
      ctx.ellipse(6.5, my, 2.6, 1.3, isLeft ? -Math.PI / 8 : Math.PI / 8, 0, Math.PI * 2);
      ctx.fill();
      // Mirror glass reflection
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(6.2, isLeft ? my - 0.7 : my + 0.2, 0.6, 1.0);
    });

    // 11. Rear Windshield Glass & High-Mount Third Brake Light
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-13.2, -6.4);
    ctx.lineTo(-13.2, 6.4);
    ctx.lineTo(-18.5, 5.4);
    ctx.lineTo(-18.5, -5.4);
    ctx.closePath();
    ctx.fill();

    // High-mount third brake light
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-13.6, -1.8, 0.6, 3.6);

    // 12. White Trunk Lid & Gloss Black / Carbon M Ducktail Spoiler Lip
    // Trunk lid
    ctx.fillStyle = alpineWhite;
    ctx.beginPath();
    ctx.moveTo(-18.5, -5.4);
    ctx.lineTo(-18.5, 5.4);
    ctx.lineTo(-25.2, 7.5);
    ctx.lineTo(-25.2, -7.5);
    ctx.closePath();
    ctx.fill();

    // Carbon M Rear Spoiler Lip (Spanning across trunk edge)
    ctx.fillStyle = glossBlack;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(-26.2, -8.2, 1.5, 16.4, 0.6);
    } else {
      ctx.rect(-26.2, -8.2, 1.5, 16.4);
    }
    ctx.fill();
    ctx.fillStyle = '#334155';
    ctx.fillRect(-25.8, -7.8, 0.5, 15.6);

    // 13. Rear Quad Exhausts & Carbon Diffuser
    // Carbon Diffuser
    ctx.fillStyle = glossBlack;
    ctx.fillRect(-26.8, -6.5, 0.8, 13);

    // Quad Exhaust Tips (2 Left, 2 Right)
    [-4.5, -2.8, 2.8, 4.5].forEach(ey => {
      ctx.fillStyle = '#475569'; // Outer chrome/black ring
      ctx.beginPath(); ctx.arc(-26.8, ey, 1.1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#020617'; // Dark inner tailpipe
      ctx.beginPath(); ctx.arc(-26.8, ey, 0.65, 0, Math.PI * 2); ctx.fill();
    });

    return true;
  } else if (carStats.id === 'car-uiner-i6') {
    // BMW i8 / i4 M Performance Electric Hyper-Sport
    const uinerColor = carStats.color && carStats.color !== '#000000' ? carStats.color : '#2563eb'; // Protonic Blue Metallic
    const frozenGrey = '#94a3b8'; // Satin Frozen Grey contrast trim
    const iCyan = '#00e5ff'; // Electric i-Cyan accent
    const iCyanGlow = 'rgba(0, 229, 255, 0.4)';
    const darkCarbon = '#090d16'; // Deep gloss carbon
    const darkGlass = '#020617'; // Tinted panoramic canopy glass

    // 1. Lower Aerodynamic Shadow & Ground Effect Glow
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 31, 13.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Electric Underbody Aero Glow
    ctx.fillStyle = iCyanGlow;
    ctx.beginPath();
    ctx.ellipse(0, 0, 29, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Base Sculpted Body Silhouette (Wide Hips, Sweeping Nose)
    ctx.fillStyle = uinerColor;
    ctx.beginPath();
    ctx.moveTo(29, 0); // Front nose tip
    ctx.bezierCurveTo(28, -6, 23, -11, 14, -11.8); // Front right fender
    ctx.bezierCurveTo(4, -12, -8, -12, -18, -11.5); // Right waistline
    ctx.bezierCurveTo(-24, -11, -28, -8.5, -29.5, -4); // Rear right shoulder
    ctx.lineTo(-29.5, 4); // Rear tail edge
    ctx.bezierCurveTo(-28, 8.5, -24, 11, -18, 11.5); // Left rear shoulder
    ctx.bezierCurveTo(-8, 12, 4, 12, 14, 11.8); // Left waistline
    ctx.bezierCurveTo(23, 11, 28, 6, 29, 0); // Front left fender
    ctx.closePath();
    ctx.fill();

    // High-gloss Metallic Body Highlight
    const bodyGrd = ctx.createLinearGradient(0, -12, 0, 12);
    bodyGrd.addColorStop(0, 'rgba(255,255,255,0.3)');
    bodyGrd.addColorStop(0.3, 'rgba(255,255,255,0.05)');
    bodyGrd.addColorStop(0.5, 'transparent');
    bodyGrd.addColorStop(0.7, 'rgba(0,0,0,0.2)');
    bodyGrd.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = bodyGrd;
    ctx.fill();

    // 3. Frozen Grey Satin Aero Side Skirts & Inset Rocker Panel
    ctx.fillStyle = frozenGrey;
    // Right Rocker
    ctx.beginPath();
    ctx.moveTo(12, -11.8);
    ctx.lineTo(-16, -11.5);
    ctx.lineTo(-18, -12.5);
    ctx.lineTo(10, -12.8);
    ctx.closePath();
    ctx.fill();
    // Left Rocker
    ctx.beginPath();
    ctx.moveTo(12, 11.8);
    ctx.lineTo(-16, 11.5);
    ctx.lineTo(-18, 12.5);
    ctx.lineTo(10, 12.8);
    ctx.closePath();
    ctx.fill();

    // Electric i-Cyan Accent Strips along Side Skirts
    ctx.fillStyle = iCyan;
    ctx.fillRect(-15, -12.3, 22, 0.8);
    ctx.fillRect(-15, 11.5, 22, 0.8);

    // 4. Iconic BMW Kidney Grille Nose & Front Apron Inlets
    ctx.fillStyle = darkCarbon;
    // Twin Kidney Grille Sockets
    ctx.beginPath();
    ctx.roundRect(26.5, -5.2, 2.5, 4.2, [1, 2, 2, 1]);
    ctx.roundRect(26.5, 1.0, 2.5, 4.2, [1, 2, 2, 1]);
    ctx.fill();

    // Kidney Grille Blue i-Accents
    ctx.strokeStyle = iCyan;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(26.5, -5.2, 2.5, 4.2);
    ctx.strokeRect(26.5, 1.0, 2.5, 4.2);

    // Kidney Mesh Slats
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(27.2, -4.5, 1, 2.8);
    ctx.fillRect(27.2, 1.7, 1, 2.8);

    // Front Lower Air Curtain Vents
    ctx.fillStyle = darkCarbon;
    ctx.beginPath();
    ctx.moveTo(27, -8.5); ctx.lineTo(24, -10.5); ctx.lineTo(23, -8); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(27, 8.5); ctx.lineTo(24, 10.5); ctx.lineTo(23, 8); ctx.closePath(); ctx.fill();

    // 5. Hood Black V-Shaped Air Outlet Channel (Signature i8 Hood Scoop)
    ctx.fillStyle = darkCarbon;
    ctx.beginPath();
    ctx.moveTo(25, -2.5);
    ctx.lineTo(25, 2.5);
    ctx.lineTo(18, 4.2);
    ctx.lineTo(10, 3.2);
    ctx.lineTo(10, -3.2);
    ctx.lineTo(18, -4.2);
    ctx.closePath();
    ctx.fill();

    // Hood Air Vent Slat Lines
    ctx.fillStyle = '#334155';
    ctx.fillRect(12, -2.5, 1, 5);
    ctx.fillRect(15, -3.0, 1, 6);

    // 6. Central Panoramic Glass Canopy & Interior Cockpit
    ctx.fillStyle = darkGlass;
    ctx.beginPath();
    ctx.moveTo(11, -5.5);
    ctx.bezierCurveTo(15, -3, 15, 3, 11, 5.5); // Windshield front curve
    ctx.lineTo(-6, 7.5); // Side window right
    ctx.bezierCurveTo(-14, 7, -20, 5, -23, 3); // Rear Glass curve right
    ctx.lineTo(-23, -3); // Rear Glass edge
    ctx.bezierCurveTo(-20, -5, -14, -7, -6, -7.5); // Left Side Window
    ctx.closePath();
    ctx.fill();

    // Windshield Reflection Accent
    const glassGrd = ctx.createLinearGradient(12, -6, -20, 6);
    glassGrd.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    glassGrd.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)');
    glassGrd.addColorStop(0.6, 'transparent');
    ctx.fillStyle = glassGrd;
    ctx.fill();

    // Interior Cockpit Elements (Visible through glass)
    // White/Cognac Sport Seats
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath(); ctx.ellipse(1, -3.5, 3.2, 2.2, 0, 0, Math.PI * 2); ctx.fill(); // Driver seat
    ctx.beginPath(); ctx.ellipse(1, 3.5, 3.2, 2.2, 0, 0, Math.PI * 2); ctx.fill(); // Passenger seat
    // Seat Headrests
    ctx.fillStyle = '#020617';
    ctx.beginPath(); ctx.arc(3.5, -3.5, 1.0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(3.5, 3.5, 1.0, 0, Math.PI * 2); ctx.fill();
    // Curved Widescreen Display & Steering Wheel
    ctx.fillStyle = iCyan;
    ctx.fillRect(7.5, -4.0, 1.2, 8.0); // Widescreen display
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(5.8, -3.5, 1.6, Math.PI * 0.2, Math.PI * 1.8); ctx.stroke(); // M Steering Wheel

    // 7. Signature Floating C-Pillars / Flying Buttresses (Wings over rear shoulders)
    ctx.fillStyle = uinerColor;
    // Right Flying Buttress
    ctx.beginPath();
    ctx.moveTo(-5, -7.5);
    ctx.bezierCurveTo(-14, -11, -22, -11.5, -28.5, -7.5);
    ctx.lineTo(-28.5, -5.0);
    ctx.bezierCurveTo(-22, -6.5, -14, -6.0, -5, -6.0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fill();

    // Left Flying Buttress
    ctx.fillStyle = uinerColor;
    ctx.beginPath();
    ctx.moveTo(-5, 7.5);
    ctx.bezierCurveTo(-14, 11, -22, 11.5, -28.5, 7.5);
    ctx.lineTo(-28.5, 5.0);
    ctx.bezierCurveTo(-22, 6.5, -14, 6.0, -5, 6.0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fill();

    // 8. Rear Deck Motor Cover & Battery Vents
    ctx.fillStyle = darkCarbon;
    ctx.beginPath();
    ctx.moveTo(-7, -4.5);
    ctx.lineTo(-7, 4.5);
    ctx.lineTo(-23, 3.5);
    ctx.lineTo(-23, -3.5);
    ctx.closePath();
    ctx.fill();

    // Rear Engine Cover Cooling Slats
    ctx.fillStyle = '#1e293b';
    [-11, -15, -19].forEach(rx => {
      ctx.fillRect(rx, -3, 1.2, 6);
    });

    // 9. Aerodynamic Mirrors
    ctx.fillStyle = darkCarbon;
    // Mirror stalks
    ctx.fillRect(4, -10.5, 1.2, 3.0);
    ctx.fillRect(4, 7.5, 1.2, 3.0);
    // Mirror caps (Body color with blue stripe)
    ctx.fillStyle = uinerColor;
    ctx.beginPath(); ctx.ellipse(3.5, -13.5, 2.5, 1.2, -Math.PI / 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(3.5, 13.5, 2.5, 1.2, Math.PI / 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = iCyan;
    ctx.fillRect(2.5, -14.2, 2.0, 0.6);
    ctx.fillRect(2.5, 13.6, 2.0, 0.6);

    // 10. Rear Aerodynamic Diffuser & Electric Bumper Trim
    ctx.fillStyle = darkCarbon;
    ctx.beginPath();
    ctx.moveTo(-23, -8);
    ctx.lineTo(-29.5, -6.5);
    ctx.lineTo(-29.5, 6.5);
    ctx.lineTo(-23, 8);
    ctx.closePath();
    ctx.fill();

    // Electric Bumper i-Cyan Aerofoil Fins
    ctx.fillStyle = iCyan;
    ctx.fillRect(-29.5, -5.2, 1.5, 1.0);
    ctx.fillRect(-29.5, 4.2, 1.5, 1.0);

    // Satin Silver Lower Skid Plate
    ctx.fillStyle = frozenGrey;
    ctx.fillRect(-29.2, -2.5, 0.8, 5.0);

    return true;
  } else if (carStats.id === 'car-marceli-spyder') {
    // McLaren 720S / 765LT Spider ("Marceli Spyder") - Exact Match to marceli.jpg (Papaya Spark Metallic Orange)
    const papayaOrange = baseColor || '#ea580c';
    const glossCarbon = '#090a10';
    const darkMesh = '#18181b';
    const chromeAccent = '#e2e8f0';

    // 1. Underbody Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 32.5, 14.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Shrink-Wrapped Organic Teardrop Aerodynamic Silhouette (Matching marceli.jpg)
    ctx.fillStyle = papayaOrange;
    ctx.beginPath();
    ctx.moveTo(31.5, 0); // Low, predatory nose tip
    ctx.bezierCurveTo(30.0, -5.5, 25.5, -11.5, 17.0, -12.8); // Front right fender curve
    ctx.bezierCurveTo(8.0, -12.5, 3.0, -9.5, -4.0, -9.8); // Narrow dihedral door waist
    ctx.bezierCurveTo(-12.0, -10.5, -18.0, -14.8, -25.5, -14.5); // Muscular rear right fender
    ctx.bezierCurveTo(-29.5, -13.2, -31.5, -9.0, -32.0, -4.0); // Rear right wing deck
    ctx.lineTo(-32.0, 4.0);
    ctx.bezierCurveTo(-31.5, 9.0, -29.5, 13.2, -25.5, 14.5); // Muscular rear left fender
    ctx.bezierCurveTo(-18.0, 14.8, -12.0, 10.5, -4.0, 9.8); // Narrow waist
    ctx.bezierCurveTo(3.0, 9.5, 8.0, 12.5, 17.0, 12.8); // Front left fender curve
    ctx.bezierCurveTo(25.5, 11.5, 30.0, 5.5, 31.5, 0);
    ctx.closePath();
    ctx.fill();

    // High-gloss Papaya Spark Metallic Reflections along the bodywork
    const papayaGrd = ctx.createLinearGradient(0, -14.5, 0, 14.5);
    papayaGrd.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    papayaGrd.addColorStop(0.2, 'rgba(253, 186, 116, 0.28)'); // Luminous gold-orange pearl
    papayaGrd.addColorStop(0.5, 'transparent');
    papayaGrd.addColorStop(0.8, 'rgba(154, 52, 18, 0.35)'); // Deep burnt copper shadow
    papayaGrd.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = papayaGrd;
    ctx.fill();

    // 3. Iconic McLaren "Eye-Socket" Headlight Aero Cavities & Air Ducts (Signature 720S feature)
    [-1, 1].forEach(side => {
      // Deep sculpted aero cavity that guides air through to radiators
      ctx.fillStyle = glossCarbon;
      ctx.beginPath();
      ctx.moveTo(27.0, side * 4.0);
      ctx.lineTo(24.0, side * 9.8);
      ctx.lineTo(19.0, side * 10.5);
      ctx.lineTo(21.5, side * 4.5);
      ctx.closePath();
      ctx.fill();

      // Lower duct opening
      ctx.fillStyle = '#050508';
      ctx.beginPath();
      ctx.moveTo(25.5, side * 5.2);
      ctx.lineTo(21.0, side * 9.0);
      ctx.lineTo(22.5, side * 4.8);
      ctx.closePath();
      ctx.fill();

      // Projector headlight inside the socket
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(23.5, side * 7.5, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Boomerang LED DRL eyebrow strip
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(25.8, side * 4.5);
      ctx.lineTo(23.5, side * 9.2);
      ctx.stroke();
    });

    // Front Exposed Carbon Splitter & Center Nose Speedmark
    ctx.fillStyle = glossCarbon;
    ctx.beginPath();
    ctx.moveTo(32.0, 0);
    ctx.lineTo(29.0, -5.5);
    ctx.lineTo(28.0, -11.5);
    ctx.lineTo(26.0, -11.5);
    ctx.lineTo(27.5, -5.0);
    ctx.lineTo(30.0, 0);
    ctx.lineTo(27.5, 5.0);
    ctx.lineTo(26.0, 11.5);
    ctx.lineTo(28.0, 11.5);
    ctx.lineTo(29.0, 5.5);
    ctx.closePath();
    ctx.fill();

    // McLaren Kiwi / Speedmark Logo on Nose Tip
    ctx.fillStyle = '#ea580c';
    ctx.beginPath(); ctx.ellipse(29.2, 0, 1.0, 0.6, 0, 0, Math.PI * 2); ctx.fill();

    // Front Luggage Bay Dual Hood Air Extractor Ducts
    [-1, 1].forEach(side => {
      ctx.fillStyle = glossCarbon;
      ctx.beginPath();
      ctx.moveTo(20.0, side * 2.2);
      ctx.lineTo(15.0, side * 4.2);
      ctx.lineTo(15.5, side * 2.2);
      ctx.closePath();
      ctx.fill();

      // Sharp hood crease line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(29.0, side * 1.5);
      ctx.lineTo(14.0, side * 5.0);
      ctx.stroke();
    });

    // 4. Dihedral Double-Skin Door Aero Channels (Air channeling into side radiators)
    [-1, 1].forEach(side => {
      ctx.fillStyle = '#0a0a0f';
      ctx.beginPath();
      ctx.moveTo(11.0, side * 11.5);
      ctx.lineTo(-4.0, side * 8.5);
      ctx.lineTo(-12.0, side * 13.5);
      ctx.lineTo(-7.0, side * 13.8);
      ctx.lineTo(2.0, side * 10.8);
      ctx.closePath();
      ctx.fill();

      // Gloss carbon aero side skirts
      ctx.fillStyle = glossCarbon;
      ctx.fillRect(-6.0, side > 0 ? 12.0 : -13.0, 16.0, 1.0);
    });

    // 5. Open-Top Spider Cockpit (Wraparound Windshield & Alcantara Interior)
    // Windshield frame with carbon A-pillars
    ctx.fillStyle = glossCarbon;
    ctx.beginPath();
    ctx.moveTo(12.5, 0);
    ctx.lineTo(10.0, -7.8);
    ctx.lineTo(8.5, -8.2);
    ctx.lineTo(8.5, 8.2);
    ctx.lineTo(10.0, 7.8);
    ctx.closePath();
    ctx.fill();

    // Curved front windshield glass
    const windGrd = ctx.createLinearGradient(12, -7, 5, 7);
    windGrd.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
    windGrd.addColorStop(0.35, 'rgba(56, 189, 248, 0.25)');
    windGrd.addColorStop(0.7, 'transparent');
    ctx.fillStyle = windGrd;
    ctx.beginPath();
    ctx.moveTo(12.2, 0);
    ctx.bezierCurveTo(11.5, -4.5, 9.8, -7.5, 8.5, -7.8);
    ctx.lineTo(8.5, 7.8);
    ctx.bezierCurveTo(9.8, 7.5, 11.5, 4.5, 12.2, 0);
    ctx.closePath();
    ctx.fill();

    // Central Single Aerodynamic Windshield Wiper
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(11.5, -0.8);
    ctx.lineTo(4.5, -3.5);
    ctx.stroke();

    // Open Cockpit Tub (Visible lightweight carbon monocell)
    ctx.fillStyle = '#090a10';
    ctx.fillRect(-4.5, -7.0, 13.0, 14.0);

    // Lightweight Carbon Racing Bucket Seats (Black Alcantara + Papaya Orange Accents)
    [-1, 1].forEach(side => {
      // Seat cushion
      ctx.fillStyle = '#1c1917';
      ctx.beginPath(); ctx.ellipse(1.5, side * 3.8, 3.8, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      // Papaya orange center race stripe
      ctx.fillStyle = '#f97316';
      ctx.fillRect(0.2, side * 3.8 - 0.5, 3.0, 1.0);
      // Embossed Headrests
      ctx.fillStyle = '#0f0e17';
      ctx.beginPath(); ctx.ellipse(-2.5, side * 3.8, 1.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(-2.8, side * 3.8 - 0.4, 0.8, 0.8);
    });

    // Center Console, Portrait Touchscreen & Drive Mode Switches
    ctx.fillStyle = '#18181b';
    ctx.fillRect(-1.0, -1.2, 5.5, 2.4);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0.5, -0.7, 2.2, 1.4);

    // McLaren Carbon 3-Spoke Steering Wheel with Papaya 12 o'clock marker
    ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.0;
    ctx.beginPath(); ctx.ellipse(6.2, -3.8, 1.8, 1.8, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#f97316';
    ctx.fillRect(7.8, -4.1, 0.6, 0.6);

    // 6. Spider Tonneau Cover Deck with Aerodynamic Rollover Nacelles / Speedster Humps
    ctx.fillStyle = papayaOrange;
    ctx.beginPath();
    ctx.moveTo(-4.0, -7.5);
    ctx.lineTo(-4.0, 7.5);
    ctx.lineTo(-12.0, 6.8);
    ctx.lineTo(-12.0, -6.8);
    ctx.closePath();
    ctx.fill();

    // Sculpted Dual Rollover Nacelles (Streamlined Cowls behind headrests)
    [-1, 1].forEach(side => {
      ctx.fillStyle = changeColorBrightness(papayaOrange, 15);
      ctx.beginPath();
      ctx.ellipse(-6.5, side * 3.8, 3.5, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Chrome rollover hoop core inside
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.ellipse(-4.2, side * 3.8, 0.8, 1.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Signature Glazed Flying Buttresses (Dark-tinted aerodynamic glass pillars)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
      ctx.beginPath();
      ctx.moveTo(-6.5, side * 5.5);
      ctx.lineTo(-16.0, side * 4.2);
      ctx.lineTo(-15.5, side * 2.8);
      ctx.lineTo(-6.5, side * 4.2);
      ctx.closePath();
      ctx.fill();

      // Glass highlight edge
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(-6.5, side * 5.5);
      ctx.lineTo(-16.0, side * 4.2);
      ctx.stroke();
    });

    // 7. Mid-Mounted 4.0L Twin-Turbo V8 Engine Bay Deck with Heat Extraction Louvers
    ctx.fillStyle = darkMesh;
    ctx.beginPath();
    ctx.moveTo(-12.0, -4.5);
    ctx.lineTo(-24.5, -5.5);
    ctx.lineTo(-24.5, 5.5);
    ctx.lineTo(-12.0, 4.5);
    ctx.closePath();
    ctx.fill();

    // Louvered cooling slats
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 0.7;
    for (let l = -13.5; l >= -22.5; l -= 2.0) {
      ctx.beginPath();
      ctx.moveTo(l, -3.8); ctx.lineTo(l, 3.8);
      ctx.stroke();
    }

    // 8. High-Mounted Center Twin Exhaust Pipes (Signature 720S high-exit dual tips)
    [-1, 1].forEach(side => {
      const ex = -28.2;
      const ey = side * 2.2;
      // Titanium exhaust surround
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath(); ctx.ellipse(ex, ey, 1.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
      // Heat-treated burnt blue/purple titanium inner rim
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath(); ctx.ellipse(ex, ey, 1.1, 1.1, 0, 0, Math.PI * 2); ctx.fill();
      // Hollow dark exhaust hole
      ctx.fillStyle = '#020617';
      ctx.beginPath(); ctx.ellipse(ex, ey, 0.8, 0.8, 0, 0, Math.PI * 2); ctx.fill();
    });

    // 9. Active Aero Carbon Fiber Rear Wing / Airbrake (Deployed high-downforce wing)
    ctx.fillStyle = glossCarbon;
    ctx.beginPath();
    ctx.moveTo(-28.0, -13.5);
    ctx.bezierCurveTo(-31.5, -12.0, -32.5, -6.5, -32.5, 0);
    ctx.bezierCurveTo(-32.5, 6.5, -31.5, 12.0, -28.0, 13.5);
    ctx.lineTo(-30.5, 13.8);
    ctx.bezierCurveTo(-34.0, 11.5, -35.0, 6.0, -35.0, 0);
    ctx.bezierCurveTo(-35.0, -6.0, -34.0, -11.5, -30.5, -13.8);
    ctx.closePath();
    ctx.fill();

    // Wing Endplates & High Gloss Top Carbon Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(-31.0, -13.5, 2.5, 1.2);
    ctx.fillRect(-31.0, 12.3, 2.5, 1.2);

    // 10. Aggressive Exposed Carbon Rear Diffuser with Ground-Effect Strakes
    ctx.fillStyle = '#050508';
    ctx.beginPath();
    ctx.moveTo(-30.0, -9.5);
    ctx.lineTo(-33.5, -7.0);
    ctx.lineTo(-33.5, 7.0);
    ctx.lineTo(-30.0, 9.5);
    ctx.closePath();
    ctx.fill();

    // 4 Vertical Diffuser Strakes
    ctx.fillStyle = glossCarbon;
    [-5.0, -2.0, 2.0, 5.0].forEach(yPos => {
      ctx.fillRect(-33.5, yPos - 0.3, 2.8, 0.6);
    });

    // 11. Sculpted Door-Mounted Aero Stalk Side Mirrors
    [-1, 1].forEach(side => {
      // Carbon mounting stalk
      ctx.fillStyle = glossCarbon;
      ctx.fillRect(8.0, side * (side > 0 ? 11.5 : 13.0), 2.2, 1.5);
      // Aerodynamic papaya mirror casing
      ctx.fillStyle = papayaOrange;
      ctx.beginPath();
      ctx.ellipse(9.2, side * 13.8, 3.0, 1.6, side * Math.PI / 10, 0, Math.PI * 2);
      ctx.fill();
      // Mirror glass reflection
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(7.8, side * 13.4 - 0.4, 2.2, 0.8);
    });

    return true;
  } else if (carStats.id === 'car-arbier-rr7') {
    // Audi RS7 Sportback ("Arbier RR7") - Exact Match to audi1.png
    const ascariBlue = baseColor || '#2042b5';
    const glossBlack = '#090a0f';
    const darkGlass = '#0a0d14';
    const chromeAccent = '#e2e8f0';

    // 1. Sleek Executive Sportback Widebody Silhouette (Muscular RS flared wheel arches)
    ctx.fillStyle = ascariBlue;
    ctx.beginPath();
    ctx.moveTo(29.5, -4.5);
    ctx.quadraticCurveTo(30.0, 0, 29.5, 4.5); // Nose apex
    ctx.lineTo(27.8, 9.2); // Front right corner
    ctx.quadraticCurveTo(24.5, 13.5, 16.5, 13.5); // Front right flared wheel arch
    ctx.lineTo(9.5, 12.8);
    ctx.lineTo(3.0, 12.2); // Front waistline
    ctx.lineTo(-7.0, 12.2); // Rear waistline
    ctx.quadraticCurveTo(-14.5, 13.8, -19.0, 13.8); // Muscular RS flared rear haunch
    ctx.lineTo(-24.5, 12.8);
    ctx.quadraticCurveTo(-28.0, 10.5, -29.0, 6.5); // Rear bumper corner
    ctx.lineTo(-29.0, -6.5); // Rear tailgate
    ctx.quadraticCurveTo(-28.0, -10.5, -24.5, -12.8);
    ctx.lineTo(-19.0, -13.8); // Muscular RS flared left haunch
    ctx.quadraticCurveTo(-14.5, -13.8, -7.0, -12.2);
    ctx.lineTo(3.0, -12.2);
    ctx.lineTo(9.5, -12.8);
    ctx.quadraticCurveTo(24.5, -13.5, 27.8, -9.2);
    ctx.closePath();
    ctx.fill();

    // 3D Surface Creases & Ambient Highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // 2. Dual Razor-Sharp Center Hood Power Creases (Audi RS signature)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(27.0, -3.5); ctx.lineTo(12.5, -5.5);
    ctx.moveTo(27.0, 3.5); ctx.lineTo(12.5, 5.5);
    ctx.stroke();

    // Outer Hood Shoulder Creases
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(25.0, -8.5); ctx.lineTo(12.0, -10.5);
    ctx.moveTo(25.0, 8.5); ctx.lineTo(12.0, 10.5);
    ctx.stroke();

    // Audi Singleframe Hexagonal Grille & Honeycomb Mesh
    ctx.fillStyle = glossBlack;
    ctx.beginPath();
    ctx.moveTo(29.8, -4.5);
    ctx.lineTo(29.8, 4.5);
    ctx.lineTo(28.0, 5.5);
    ctx.lineTo(27.0, 5.5);
    ctx.lineTo(27.0, -5.5);
    ctx.lineTo(28.0, -5.5);
    ctx.closePath();
    ctx.fill();

    // Audi Rings Emblem at Nose
    ctx.strokeStyle = chromeAccent;
    ctx.lineWidth = 0.4;
    [-1.2, -0.4, 0.4, 1.2].forEach(ox => {
      ctx.beginPath();
      ctx.arc(28.8, ox, 0.7, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 3. Dark Tinted Windshield & Interior Cockpit
    const wsGrad = ctx.createLinearGradient(12.0, 0, 4.0, 0);
    wsGrad.addColorStop(0, '#040711');
    wsGrad.addColorStop(0.6, '#0f172a');
    wsGrad.addColorStop(1, '#040711');
    ctx.fillStyle = wsGrad;

    ctx.beginPath();
    ctx.moveTo(11.5, -9.2);
    ctx.quadraticCurveTo(12.5, 0, 11.5, 9.2);
    ctx.lineTo(4.2, 8.6);
    ctx.lineTo(4.2, -8.6);
    ctx.closePath();
    ctx.fill();

    // Windshield Reflection Arc
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(10.5, -7.0); ctx.lineTo(5.5, -4.0);
    ctx.stroke();

    // Interior Virtual Cockpit Display Glow & Steering Wheel
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8.0, -5.5, 2.5, 3.2);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(8.2, -0.8, 1.6, 1.6); // Center MMI Touchscreen

    // 4. Gloss Black Pillar Surround & Tinted Sportback Side Glass
    ctx.fillStyle = darkGlass;
    ctx.fillRect(-22.0, -9.6, 25.5, 1.4);
    ctx.fillRect(-22.0, 8.2, 25.5, 1.4);

    // Gloss Black A, B, C Pillars
    ctx.fillStyle = glossBlack;
    ctx.fillRect(-3.0, -9.8, 1.4, 1.8);
    ctx.fillRect(-3.0, 8.0, 1.4, 1.8);
    ctx.fillRect(-12.5, -9.8, 1.4, 1.8);
    ctx.fillRect(-12.5, 8.0, 1.4, 1.8);

    // 5. Roof Panel with Dark Panoramic Sunroof Section (Matches audi1.png)
    ctx.fillStyle = ascariBlue;
    ctx.fillRect(-17.5, -8.2, 21.5, 16.4);

    // Panoramic Rear Glass Sunroof (Tinted dark glass in roof)
    const sunroofGrad = ctx.createLinearGradient(-4.0, 0, -14.0, 0);
    sunroofGrad.addColorStop(0, '#060912');
    sunroofGrad.addColorStop(0.5, '#111827');
    sunroofGrad.addColorStop(1, '#060912');
    ctx.fillStyle = sunroofGrad;

    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(-15.0, -6.5, 9.5, 13.0, [1.0, 1.0, 1.0, 1.0]);
    } else {
      ctx.rect(-15.0, -6.5, 9.5, 13.0);
    }
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 0.4;
    ctx.stroke();

    // Sunroof Glass Sheen
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-6.5, -4.5); ctx.lineTo(-12.5, -1.5);
    ctx.stroke();

    // Blue/Black Shark-Fin Antenna
    ctx.fillStyle = glossBlack;
    ctx.beginPath();
    ctx.moveTo(-3.5, 0);
    ctx.lineTo(-6.5, -0.6);
    ctx.lineTo(-7.0, 0);
    ctx.lineTo(-6.5, 0.6);
    ctx.closePath();
    ctx.fill();

    // 6. Aerodynamic Door-Mounted Side Mirrors & Flush Handles
    [-1, 1].forEach(dir => {
      // Black stalk
      ctx.fillStyle = glossBlack;
      ctx.fillRect(5.5, dir * 12.0 - (dir > 0 ? 0 : 2.0), 1.4, 2.0);

      // Body-color mirror cap
      ctx.fillStyle = ascariBlue;
      ctx.beginPath();
      ctx.ellipse(6.2, dir * 14.5, 2.8, 1.4, dir * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = glossBlack;
      ctx.lineWidth = 0.4;
      ctx.stroke();

      // Mirror glass
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(5.5, dir * 14.5 - 0.5, 1.0, 1.0);

      // Flush door handles
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(1.5, dir * 12.0 - 0.3, 3.2, 0.6);
      ctx.fillRect(-7.5, dir * 12.0 - 0.3, 3.2, 0.6);
    });

    // 7. Sloping Sportback Liftback Rear Window & Active Spoiler
    ctx.fillStyle = darkGlass;
    ctx.beginPath();
    ctx.moveTo(-17.5, -8.0);
    ctx.lineTo(-17.5, 8.0);
    ctx.lineTo(-25.5, 6.8);
    ctx.lineTo(-25.5, -6.8);
    ctx.closePath();
    ctx.fill();

    // High-Mounted Third Brake Light Strip
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-18.0, -2.5, 0.6, 5.0);

    // Rear Liftback Deck & Integrated RS Spoiler Lip
    ctx.fillStyle = ascariBlue;
    ctx.fillRect(-27.5, -7.5, 2.0, 15.0);
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(-27.5, -7.5, 2.0, 15.0);

    // Rear Bumper Diffuser & Dual RS Oval Exhaust Tips
    ctx.fillStyle = glossBlack;
    ctx.fillRect(-28.8, -7.0, 0.8, 14.0);

    // Dual RS Oval Exhaust Tips
    [-1, 1].forEach(dir => {
      ctx.fillStyle = chromeAccent;
      ctx.beginPath();
      ctx.ellipse(-28.8, dir * 5.2, 0.8, 1.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.ellipse(-28.8, dir * 5.2, 0.5, 1.0, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    return true;
  } else if (carStats.id === 'car-regali-chasew') {
    // Dodge Challenger style (Muscle Car)
    // Boxy, wide, flat front and rear, metallic orange with black stripes
    
    // Main Body (Boxy muscle car)
    ctx.beginPath();
    ctx.moveTo(28, -11); // Front right
    ctx.lineTo(28, 11);  // Front left
    ctx.lineTo(24, 13);  // Fender flare
    ctx.lineTo(-24, 13); // Rear fender
    ctx.lineTo(-28, 11); // Rear left
    ctx.lineTo(-28, -11); // Rear right
    ctx.lineTo(-24, -13); // Rear fender
    ctx.lineTo(24, -13);  // Front fender
    ctx.closePath();
    ctx.fill();

    // Racing Stripes (Two wide black stripes)
    ctx.fillStyle = '#1a1a1a';
    // Left stripe
    ctx.fillRect(-28, 1, 56, 4);
    // Right stripe
    ctx.fillRect(-28, -5, 56, 4);
    
    // Hood Scoop (Central)
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.moveTo(22, -3);
    ctx.lineTo(22, 3);
    ctx.lineTo(14, 4);
    ctx.lineTo(14, -4);
    ctx.closePath();
    ctx.fill();
    // Scoop opening
    ctx.fillStyle = '#050505';
    ctx.fillRect(21, -2.5, 1, 5);

    // Side Hood Vents
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(16, -9, 4, 3);
    ctx.fillRect(16, 6, 4, 3);
    // Vent mesh detail
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(17, -9); ctx.lineTo(17, -6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(18, -9); ctx.lineTo(18, -6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(19, -9); ctx.lineTo(19, -6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(17, 6); ctx.lineTo(17, 9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(18, 6); ctx.lineTo(18, 9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(19, 6); ctx.lineTo(19, 9); ctx.stroke();

    // Windows / Canopy
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(10, -10); // Windshield base
    ctx.lineTo(10, 10);
    ctx.lineTo(6, 11);   // A-pillar
    ctx.lineTo(-14, 11); // C-pillar
    ctx.lineTo(-18, 10); // Rear window base
    ctx.lineTo(-18, -10);
    ctx.lineTo(-14, -11);
    ctx.lineTo(6, -11);
    ctx.closePath();
    ctx.fill();

    // Rear Spoiler (Lip spoiler)
    ctx.fillStyle = '#111';
    ctx.fillRect(-29, -11, 2, 22);

    // Side Mirrors (Orange)
    ctx.fillStyle = '#111'; // Stalk
    ctx.fillRect(8, -14, 1, 2);
    ctx.fillRect(8, 12, 1, 2);
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.ellipse(9, -15, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(9, 15, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fuel Cap (On rear left fender - top view right)
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(-20, 10, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Front Grille detail
    ctx.fillStyle = '#050505';
    ctx.fillRect(27, -10, 1, 20);

    return true;
  } else if (carStats.id === 'car-fabid-gt') {
    // Ford GT style - "Fabid GT"
    // Teardrop cockpit, flying buttresses, aggressive aerodynamics, integrated spoiler
    
    // Main Body (Teardrop base)
    ctx.beginPath();
    ctx.moveTo(32, 0); // Nose tip
    ctx.bezierCurveTo(30, -10, 20, -13, 10, -13); // Front right fender
    ctx.lineTo(-10, -13); // Side
    ctx.bezierCurveTo(-22, -13, -32, -10, -32, 0); // Rear curve
    ctx.bezierCurveTo(-32, 10, -22, 13, -10, 13); // Left rear curve
    ctx.lineTo(10, 13); // Left side
    ctx.bezierCurveTo(20, 13, 30, 10, 32, 0); // Front left fender
    ctx.closePath();
    ctx.fill();

    // Central Livery Stripes (Two wide white stripes)
    ctx.fillStyle = '#ffffff'; 
    // Left stripe
    ctx.fillRect(-32, -4.5, 64, 3.5);
    // Right stripe
    ctx.fillRect(-32, 1, 64, 3.5);

    // Number "1" Circle on Hood
    ctx.save();
    ctx.translate(20, 0);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 7px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('1', 0, 0);
    ctx.restore();

    // Door Details (Seam lines)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 0.5;
    // Main door cut
    ctx.beginPath();
    ctx.moveTo(10, -13);
    ctx.lineTo(0, -11);
    ctx.lineTo(-10, -12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(10, 13);
    ctx.lineTo(0, 11);
    ctx.lineTo(-10, 12);
    ctx.stroke();
    // Vertical door seam
    ctx.beginPath();
    ctx.moveTo(2, -12);
    ctx.lineTo(2, -8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(2, 12);
    ctx.lineTo(2, 8);
    ctx.stroke();

    // Central Teardrop Cockpit (Glass)
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.moveTo(14, 0); // Windshield top
    ctx.bezierCurveTo(10, -8, 2, -8, -6, -7); // Right side
    ctx.bezierCurveTo(-16, -6, -24, -4, -28, 0); // Tapering rear
    ctx.bezierCurveTo(-24, 4, -16, 6, -6, 7); // Left side
    ctx.bezierCurveTo(2, 8, 10, 8, 14, 0); // Back to windshield
    ctx.closePath();
    ctx.fill();

    // Flying Buttresses (Arches connecting roof to rear fenders)
    ctx.fillStyle = baseColor;
    // Right buttress
    ctx.beginPath();
    ctx.moveTo(-4, -8); // Start at roof
    ctx.bezierCurveTo(-12, -10, -20, -12, -28, -11); // Arch out to fender
    ctx.lineTo(-28, -8); // Fender inner edge
    ctx.bezierCurveTo(-20, -9, -12, -8, -4, -7); // Back to roof
    ctx.closePath();
    ctx.fill();
    // Left buttress
    ctx.beginPath();
    ctx.moveTo(-4, 8);
    ctx.bezierCurveTo(-12, 10, -20, 12, -28, 11);
    ctx.lineTo(-28, 8);
    ctx.bezierCurveTo(-20, 9, -12, 8, -4, 7);
    ctx.closePath();
    ctx.fill();

    // Engine Window (Visible engine through glass)
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-22, -4, 10, 8);
    ctx.fillStyle = '#333';
    ctx.fillRect(-20, -2, 6, 1);
    ctx.fillRect(-20, 1, 6, 1);

    // Side Mirrors (Silver/Grey)
    ctx.fillStyle = '#c0c0c0';
    ctx.beginPath(); ctx.arc(8, -13, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(8, 13, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#111';
    ctx.fillRect(7, -13, 2, 2);
    ctx.fillRect(7, 11, 2, 2);

    // Integrated Spoiler (Lip)
    ctx.fillStyle = changeColorBrightness(baseColor, -15);
    ctx.fillRect(-32, -10, 2, 20);

    // Headlights (Modern sleek dark housing)
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.moveTo(28, -8);
    ctx.lineTo(24, -10);
    ctx.lineTo(26, -6);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(28, 8);
    ctx.lineTo(24, 10);
    ctx.lineTo(26, 6);
    ctx.closePath();
    ctx.fill();

    return true;
  } else if (carStats.id === 'car-tetra-rt500') {
    // Tesla Roadster style
    // Sleek, smooth, large continuous glass roof
    
    // Main Body
    ctx.beginPath();
    ctx.moveTo(30, -4); // Front nose
    ctx.bezierCurveTo(30, -10, 22, -12, 14, -12); // Front right fender
    ctx.lineTo(-12, -12); // Right door
    ctx.bezierCurveTo(-22, -12, -28, -13, -30, -10); // Rear right fender
    ctx.bezierCurveTo(-32, -8, -32, -4, -32, 0); // Rear right corner
    ctx.bezierCurveTo(-32, 4, -32, 8, -30, 10); // Rear left corner
    ctx.bezierCurveTo(-28, 13, -22, 12, -12, 12); // Rear left fender
    ctx.lineTo(14, 12); // Left door
    ctx.bezierCurveTo(22, 12, 30, 10, 30, 4); // Front left fender
    ctx.closePath();
    ctx.fill();

    // Hood crease lines
    ctx.strokeStyle = changeColorBrightness(baseColor, -15);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(26, -5);
    ctx.lineTo(16, -8);
    ctx.moveTo(26, 5);
    ctx.lineTo(16, 8);
    ctx.stroke();

    // Continuous Glass Roof (Windshield to Rear)
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.moveTo(16, -7); // Front right windshield
    ctx.bezierCurveTo(20, -4, 20, 4, 16, 7); // Front windshield curve
    ctx.lineTo(-22, 7); // Left side of glass roof
    ctx.bezierCurveTo(-26, 5, -26, -5, -22, -7); // Rear glass curve
    ctx.closePath();
    ctx.fill();

    // Roof crossbars (Targa/glass roof structure)
    ctx.fillStyle = '#111';
    ctx.fillRect(-2, -7, 2, 14); // Middle bar
    ctx.fillRect(-14, -7, 2, 14); // Rear bar

    // Side Mirrors (Thin stalks)
    ctx.fillStyle = '#111';
    ctx.fillRect(10, -14, 2, 3);
    ctx.fillRect(10, 11, 2, 3);
    ctx.fillStyle = baseColor;
    ctx.beginPath(); ctx.moveTo(11, -14); ctx.lineTo(9, -15); ctx.lineTo(12, -15); ctx.fill();
    ctx.beginPath(); ctx.moveTo(11, 14); ctx.lineTo(9, 15); ctx.lineTo(12, 15); ctx.fill();

    // Front headlights (sleek dark slits)
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.moveTo(28, -8);
    ctx.lineTo(25, -10);
    ctx.lineTo(29, -5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(28, 8);
    ctx.lineTo(25, 10);
    ctx.lineTo(29, 5);
    ctx.fill();

    // Rear taillights (sleek red line)
    ctx.fillStyle = '#ff0000';
    ctx.save();
    ctx.shadowBlur = isBraking ? 15 : 5;
    ctx.shadowColor = '#ff0000';
    ctx.fillRect(-32, -9, 1, 18);
    ctx.restore();

    return true;
  }
  if (carStats.id === 'car-hydra-vyree') {
    // Aston Martin Valkyrie style
    // Teardrop canopy, large open aerodynamic channels, front splitter, rear wing
    
    // Base chassis (dark carbon fiber / empty space)
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.moveTo(26, -6);
    ctx.lineTo(22, -11);
    ctx.lineTo(-22, -12);
    ctx.lineTo(-28, -8);
    ctx.lineTo(-28, 8);
    ctx.lineTo(-22, 12);
    ctx.lineTo(22, 11);
    ctx.lineTo(26, 6);
    ctx.closePath();
    ctx.fill();

    // Body panels (colored)
    ctx.fillStyle = baseColor;
    
    // Front nose and central body
    ctx.beginPath();
    ctx.moveTo(28, -3);
    ctx.lineTo(28, 3);
    ctx.bezierCurveTo(20, 4, 10, 6, 0, 6);
    ctx.bezierCurveTo(-10, 6, -20, 4, -26, 2);
    ctx.lineTo(-26, -2);
    ctx.bezierCurveTo(-20, -4, -10, -6, 0, -6);
    ctx.bezierCurveTo(10, -6, 20, -4, 28, -3);
    ctx.closePath();
    ctx.fill();

    // Front fenders
    ctx.beginPath();
    ctx.moveTo(24, -4);
    ctx.lineTo(24, -10);
    ctx.bezierCurveTo(18, -12, 12, -10, 8, -6);
    ctx.lineTo(12, -4);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(24, 4);
    ctx.lineTo(24, 10);
    ctx.bezierCurveTo(18, 12, 12, 10, 8, 6);
    ctx.lineTo(12, 4);
    ctx.closePath();
    ctx.fill();

    // Rear fenders
    ctx.beginPath();
    ctx.moveTo(-5, -6);
    ctx.bezierCurveTo(-10, -12, -20, -13, -26, -10);
    ctx.lineTo(-26, -4);
    ctx.bezierCurveTo(-20, -6, -10, -5, -5, -6);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-5, 6);
    ctx.bezierCurveTo(-10, 12, -20, 13, -26, 10);
    ctx.lineTo(-26, 4);
    ctx.bezierCurveTo(-20, 6, -10, 5, -5, 6);
    ctx.closePath();
    ctx.fill();

    // Central canopy (glass)
    ctx.fillStyle = '#151515';
    ctx.beginPath();
    ctx.moveTo(10, -4);
    ctx.bezierCurveTo(0, -6, -10, -5, -15, -3);
    ctx.lineTo(-18, 0);
    ctx.lineTo(-15, 3);
    ctx.bezierCurveTo(-10, 5, 0, 6, 10, 4);
    ctx.bezierCurveTo(14, 2, 14, -2, 10, -4);
    ctx.closePath();
    ctx.fill();

    // Roof scoop / engine cover detail
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.moveTo(2, -2);
    ctx.lineTo(-12, -3);
    ctx.lineTo(-12, 3);
    ctx.lineTo(2, 2);
    ctx.closePath();
    ctx.fill();
    
    // Engine cover silver accent
    ctx.fillStyle = '#ddd';
    ctx.beginPath();
    ctx.moveTo(-12, -2);
    ctx.lineTo(-18, -3);
    ctx.lineTo(-18, 3);
    ctx.lineTo(-12, 2);
    ctx.closePath();
    ctx.fill();

    // Front splitter
    ctx.fillStyle = '#111';
    ctx.fillRect(26, -10, 2, 20);

    // Rear wing
    ctx.fillStyle = '#111';
    ctx.fillRect(-29, -12, 4, 24);
    ctx.fillStyle = '#222';
    ctx.fillRect(-28, -12, 2, 24); // Wing accent

    // Suspension arms / open channels (visible carbon)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(16, -5);
    ctx.lineTo(20, -9);
    ctx.moveTo(16, 5);
    ctx.lineTo(20, 9);
    ctx.moveTo(-10, -5);
    ctx.lineTo(-18, -11);
    ctx.moveTo(-10, 5);
    ctx.lineTo(-18, 11);
    ctx.stroke();

    return true;
  }
  if (carStats.id === 'car-hydra-stedring-58') {
    // Hydra Stedring '58 (Inspired by Aston Martin DBR1)
    // Classic 1950s open-top racer, British Racing Green, white roundels
    
    // Main Body (Curvy, aerodynamic 50s shape)
    ctx.beginPath();
    ctx.moveTo(32, 0); // Nose tip
    ctx.bezierCurveTo(30, -10, 20, -13, 10, -13); // Front right fender
    ctx.lineTo(-15, -12); // Side
    ctx.bezierCurveTo(-26, -11, -32, -8, -34, 0); // Rear curve
    ctx.bezierCurveTo(-32, 8, -26, 11, -15, 12); // Rear left curve
    ctx.lineTo(10, 13); // Left side
    ctx.bezierCurveTo(20, 13, 30, 10, 32, 0); // Front left fender
    ctx.closePath();
    ctx.fill();

    // White Roundels (Circles for racing numbers)
    ctx.fillStyle = '#ffffff';
    // Hood roundel
    ctx.beginPath();
    ctx.ellipse(20, 0, 7, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Side roundels (slightly visible from top)
    ctx.beginPath();
    ctx.ellipse(-10, -11, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-10, 11, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Front Grille (Mouth-like opening)
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.moveTo(32, -4);
    ctx.lineTo(32, 4);
    ctx.lineTo(28, 6);
    ctx.lineTo(28, -6);
    ctx.closePath();
    ctx.fill();
    // Grille mesh
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = -5; i <= 5; i += 2) {
      ctx.beginPath(); ctx.moveTo(28, i); ctx.lineTo(32, i); ctx.stroke();
    }

    // Side Vents (3 slats on the front fender)
    ctx.fillStyle = '#0a0a0a';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(12 + i * 3, -11, 1.5, 4);
      ctx.fillRect(12 + i * 3, 7, 1.5, 4);
    }

    // Open Cockpit
    ctx.fillStyle = '#1a1a1a'; // Dark interior
    ctx.beginPath();
    ctx.moveTo(6, -8);
    ctx.bezierCurveTo(8, -4, 8, 4, 6, 8); // Windshield base
    ctx.lineTo(-8, 7);
    ctx.bezierCurveTo(-12, 4, -12, -4, -8, -7);
    ctx.closePath();
    ctx.fill();

    // Seats (Light gray/beige as in the image)
    ctx.fillStyle = '#d2b48c'; // Tan/Beige
    ctx.beginPath();
    ctx.ellipse(-2, -4, 5, 3.5, Math.PI / 2, 0, Math.PI * 2); // Right seat
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-2, 4, 5, 3.5, Math.PI / 2, 0, Math.PI * 2);  // Left seat
    ctx.fill();
    
    // Headrest (Aerodynamic hump behind driver)
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.moveTo(-8, -7);
    ctx.bezierCurveTo(-14, -8, -22, -6, -24, -3);
    ctx.lineTo(-24, 0);
    ctx.lineTo(-8, 0);
    ctx.closePath();
    ctx.fill();

    // Small Windshield (Glass)
    ctx.fillStyle = 'rgba(200, 230, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(8, -8);
    ctx.bezierCurveTo(11, -4, 11, 4, 8, 8);
    ctx.lineTo(6, 8);
    ctx.bezierCurveTo(9, 4, 9, -4, 6, -8);
    ctx.closePath();
    ctx.fill();

    // Side Exhaust (Silver pipe on the side)
    ctx.fillStyle = '#aaa';
    ctx.fillRect(-5, 11.5, 15, 1.5);
    ctx.fillStyle = '#888';
    ctx.fillRect(10, 11.5, 2, 1.5); // Exhaust tip detail

    // Fuel Cap (Rear left)
    ctx.fillStyle = '#ccc';
    ctx.beginPath();
    ctx.arc(-22, -8, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Spoke Wheels (Visual detail)
    // This is usually handled by drawWheel, but I can add some hubcaps or center caps
    ctx.fillStyle = '#eee';
    ctx.beginPath(); ctx.arc(18, -10, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 10, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-18, -10, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-18, 10, 1.5, 0, Math.PI * 2); ctx.fill();

    return true;
  }
  if (carStats.id === 'car-frestta-v50-89') {
    // Frestta V50 '89 (Ferrari F40 inspired)
    // Red body, large rear wing, transparent engine cover, NACA ducts
    
    // Main Body (Red)
    ctx.beginPath();
    ctx.moveTo(32, -6); // Front nose
    ctx.lineTo(32, 6);
    ctx.bezierCurveTo(30, 12, 20, 14, 10, 14); // Front left fender
    ctx.lineTo(-20, 14); // Left side
    ctx.bezierCurveTo(-28, 14, -32, 10, -32, 0); // Rear left corner
    ctx.bezierCurveTo(-32, -10, -28, -14, -20, -14); // Rear right corner
    ctx.lineTo(10, -14); // Right side
    ctx.bezierCurveTo(20, -14, 30, -12, 32, -6); // Front right fender
    ctx.closePath();
    ctx.fill();

    // Front Splitter (Black)
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.moveTo(32, -6);
    ctx.lineTo(34, -4);
    ctx.lineTo(34, 4);
    ctx.lineTo(32, 6);
    ctx.closePath();
    ctx.fill();

    // NACA Ducts on Hood (Two small triangles)
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.moveTo(22, -6);
    ctx.lineTo(18, -4);
    ctx.lineTo(22, -2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(22, 6);
    ctx.lineTo(18, 4);
    ctx.lineTo(22, 2);
    ctx.closePath();
    ctx.fill();

    // Large Central NACA Duct on Hood
    ctx.beginPath();
    ctx.moveTo(20, -3);
    ctx.lineTo(12, 0);
    ctx.lineTo(20, 3);
    ctx.closePath();
    ctx.fill();

    // Cockpit / Windshield (Black)
    ctx.fillStyle = '#050505';
    ctx.beginPath();
    ctx.moveTo(12, -9);
    ctx.bezierCurveTo(16, -6, 16, 6, 12, 9); // Windshield
    ctx.lineTo(2, 10);
    ctx.lineTo(2, -10);
    ctx.closePath();
    ctx.fill();

    // Roof (Red)
    ctx.fillStyle = baseColor;
    ctx.fillRect(-8, -10, 10, 20);

    // Transparent Engine Cover (Glass)
    ctx.fillStyle = 'rgba(20, 20, 20, 0.4)';
    ctx.beginPath();
    ctx.moveTo(-8, -9);
    ctx.lineTo(-26, -9);
    ctx.lineTo(-26, 9);
    ctx.lineTo(-8, 9);
    ctx.closePath();
    ctx.fill();

    // Engine Details (Silver/Grey)
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    // Intercoolers (Two rectangles)
    ctx.fillStyle = '#777';
    ctx.fillRect(-12, -6, 6, 4);
    ctx.fillRect(-12, 2, 6, 4);
    // Engine block / pipes
    ctx.beginPath();
    ctx.moveTo(-18, -7);
    ctx.lineTo(-24, 0);
    ctx.lineTo(-18, 7);
    ctx.stroke();
    ctx.fillStyle = '#444';
    ctx.fillRect(-22, -2, 4, 4);

    // Rear Wing (Large, black)
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(-34, -15, 4, 30); // Main wing blade
    // Wing supports
    ctx.fillRect(-30, -14, 4, 2);
    ctx.fillRect(-30, 12, 4, 2);

    // NACA Ducts on Rear Fenders
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.moveTo(-10, -14);
    ctx.lineTo(-16, -12);
    ctx.lineTo(-10, -10);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-10, 14);
    ctx.lineTo(-16, 12);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.fill();

    // Round Fuel Caps (Silver)
    ctx.fillStyle = '#aaa';
    ctx.beginPath(); ctx.arc(-10, -8, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-10, 8, 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.arc(-10, -8, 2, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(-10, 8, 2, 0, Math.PI * 2); ctx.stroke();

    // Pop-up Headlight Lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.strokeRect(24, -10, 6, 4);
    ctx.strokeRect(24, 6, 6, 4);

    return true;
  }
  if (carStats.id === 'car-marceli-mt') {
    // Marceli MT (Hypercar inspired by the provided image)
    // Orange body, black central stripe, large spoiler, aggressive aero
    
    // Main Body (Orange)
    ctx.beginPath();
    ctx.moveTo(34, 0); // Nose tip
    ctx.bezierCurveTo(32, -10, 22, -13, 12, -13); // Front right fender
    ctx.lineTo(-15, -13); // Side
    ctx.bezierCurveTo(-26, -13, -33, -10, -33, 0); // Rear curve
    ctx.bezierCurveTo(-33, 10, -26, 13, -15, 13); // Rear left curve
    ctx.lineTo(12, 13); // Left side
    ctx.bezierCurveTo(22, 13, 32, 10, 34, 0); // Front left fender
    ctx.closePath();
    ctx.fill();

    // Black Central Section (Nose to Tail)
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.moveTo(34, 0);
    ctx.lineTo(24, -4);
    ctx.lineTo(12, -8); // Widens at windshield
    ctx.lineTo(-15, -9); // Side of roof/engine cover
    ctx.lineTo(-33, -5); // Rear
    ctx.lineTo(-33, 5);
    ctx.lineTo(-15, 9);
    ctx.lineTo(12, 8);
    ctx.lineTo(24, 4);
    ctx.closePath();
    ctx.fill();

    // Front Fender Vents (Black - 3 slats)
    ctx.fillStyle = '#111';
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(18 + i * 3, -11, 2, 3);
        ctx.fillRect(18 + i * 3, 8, 2, 3);
    }

    // Side Intakes (Black)
    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.lineTo(-12, -10);
    ctx.lineTo(-6, -10);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 13);
    ctx.lineTo(-12, 10);
    ctx.lineTo(-6, 10);
    ctx.closePath();
    ctx.fill();

    // Cockpit / Windshield (Glossy Black)
    ctx.fillStyle = '#050505';
    ctx.beginPath();
    ctx.moveTo(14, -7);
    ctx.bezierCurveTo(18, -4, 18, 4, 14, 7); // Windshield
    ctx.lineTo(6, 8);
    ctx.lineTo(6, -7);
    ctx.closePath();
    ctx.fill();

    // Engine Cover Details (Vents)
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-5 - i * 4, -6);
        ctx.lineTo(-5 - i * 4, 6);
        ctx.stroke();
    }
    
    // Large Rear Wing (Spoiler)
    ctx.fillStyle = '#050505';
    // Main blade (Slightly curved)
    ctx.beginPath();
    ctx.moveTo(-30, -16);
    ctx.lineTo(-36, -16);
    ctx.lineTo(-38, 0);
    ctx.lineTo(-36, 16);
    ctx.lineTo(-30, 16);
    ctx.lineTo(-32, 0);
    ctx.closePath();
    ctx.fill();
    
    // Side plates
    ctx.fillRect(-38, -16, 10, 1.5);
    ctx.fillRect(-38, 14.5, 10, 1.5);
    
    // Wing struts (Central)
    ctx.fillStyle = '#111';
    ctx.fillRect(-32, -2, 4, 4);

    // Side Mirrors (Black on stalks)
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(10, -15, 1, 3); // Stalk
    ctx.fillRect(10, 12, 1, 3);  // Stalk
    ctx.beginPath(); ctx.ellipse(11, -16, 4, 2, -Math.PI/6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(11, 16, 4, 2, Math.PI/6, 0, Math.PI * 2); ctx.fill();

    return true;
  }
  if (carStats.id === 'car-frestta-f10') {
    // Frestta F10 (Scuderia Ferrari F10 Formula 1 inspired single-seater)
    // Iconic scarlet red livery, open cockpit, aerodynamic shark fin, multi-element white front & rear wings
    const redColor = baseColor || '#d90429';

    // 1. Carbon Fiber Floor & Underbody Undertray
    ctx.fillStyle = '#0f0f11';
    ctx.beginPath();
    ctx.moveTo(10, -14);
    ctx.lineTo(-24, -14);
    ctx.lineTo(-32, -10);
    ctx.lineTo(-36, -8);
    ctx.lineTo(-36, 8);
    ctx.lineTo(-32, 10);
    ctx.lineTo(-24, 14);
    ctx.lineTo(10, 14);
    ctx.closePath();
    ctx.fill();

    // Rear Diffuser strakes
    ctx.fillStyle = '#050505';
    for (let dy = -7; dy <= 7; dy += 3.5) {
      ctx.fillRect(-36, dy - 0.75, 5, 1.5);
    }

    // 2. Front Suspension Wishbones (Carbon Fiber Double Wishbones & Pushrods)
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1.2;
    // Front Left Wishbones
    ctx.beginPath(); ctx.moveTo(16, -4); ctx.lineTo(13, -13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(11, -5); ctx.lineTo(17, -13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14, -4); ctx.lineTo(15, -13); ctx.stroke(); // Pushrod
    // Front Right Wishbones
    ctx.beginPath(); ctx.moveTo(16, 4); ctx.lineTo(13, 13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(11, 5); ctx.lineTo(17, 13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14, 4); ctx.lineTo(15, 13); ctx.stroke(); // Pushrod

    // 3. Rear Suspension Wishbones
    // Rear Left
    ctx.beginPath(); ctx.moveTo(-13, -6); ctx.lineTo(-17, -13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-21, -6); ctx.lineTo(-19, -13); ctx.stroke();
    // Rear Right
    ctx.beginPath(); ctx.moveTo(-13, 6); ctx.lineTo(-17, 13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-21, 6); ctx.lineTo(-19, 13); ctx.stroke();

    // 4. Main Monocoque & Nosecone (Aerodynamic Scarlet Red Body)
    ctx.fillStyle = redColor;
    ctx.beginPath();
    ctx.moveTo(35, 0); // High nose tip
    ctx.lineTo(34, -2.5);
    ctx.lineTo(24, -4.5);
    ctx.lineTo(12, -5.5); // Monocoque
    ctx.lineTo(6, -13);   // Left Sidepod entry
    ctx.bezierCurveTo(-4, -14, -16, -13, -22, -8); // Sidepod undercut "coke-bottle" taper
    ctx.lineTo(-27, -5);  // Gearbox shroud
    ctx.lineTo(-33, -3);  // Rear crash structure
    ctx.lineTo(-33, 3);
    ctx.lineTo(-27, 5);
    ctx.lineTo(-22, 8);   // Right sidepod undercut
    ctx.bezierCurveTo(-16, 13, -4, 14, 6, 13);
    ctx.lineTo(12, 5.5);
    ctx.lineTo(24, 4.5);
    ctx.lineTo(34, 2.5);
    ctx.closePath();
    ctx.fill();

    // 5. White Santander Nose Cone Tip & Accents
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(35, 0);
    ctx.lineTo(31, -2.2);
    ctx.lineTo(29, 0);
    ctx.lineTo(31, 2.2);
    ctx.closePath();
    ctx.fill();

    // Scuderia Yellow Badge / Tricolore on Nose
    ctx.fillStyle = '#eab308';
    ctx.fillRect(26, -1, 2, 2);
    ctx.fillStyle = '#059669';
    ctx.fillRect(24, -1.2, 0.8, 2.4);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(24.8, -1.2, 0.8, 2.4);

    // Front Camera Pods (Black & White)
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(29, -4.5, 3, 1.2);
    ctx.fillRect(29, 3.3, 3, 1.2);

    // 6. Aerodynamic Turning Vanes & Bargeboards
    ctx.fillStyle = '#18181b';
    ctx.fillRect(8, -13.5, 1.5, 3);
    ctx.fillRect(8, 10.5, 1.5, 3);
    ctx.fillRect(5, -14.5, 1.2, 4);
    ctx.fillRect(5, 10.5, 1.2, 4);

    // 7. Sidepod Radiator Air Intakes (Gloss Black Cavities)
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.moveTo(8, -6.5);
    ctx.lineTo(6, -12.5);
    ctx.lineTo(3, -12);
    ctx.lineTo(4, -6.5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(8, 6.5);
    ctx.lineTo(6, 12.5);
    ctx.lineTo(3, 12);
    ctx.lineTo(4, 6.5);
    ctx.closePath();
    ctx.fill();

    // White Santander Livery Stripes on Sidepods
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(2, -12.5);
    ctx.lineTo(-8, -12);
    ctx.lineTo(-12, -9);
    ctx.lineTo(-8, -9);
    ctx.lineTo(0, -11.5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(2, 12.5);
    ctx.lineTo(-8, 12);
    ctx.lineTo(-12, 9);
    ctx.lineTo(-8, 9);
    ctx.lineTo(0, 11.5);
    ctx.closePath();
    ctx.fill();

    // Sidepod Cooling Louvers (Engine heat exhaust gills)
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(-6 - i * 2.5, -10.5); ctx.lineTo(-8 - i * 2.5, -8.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-6 - i * 2.5, 10.5); ctx.lineTo(-8 - i * 2.5, 8.5); ctx.stroke();
    }

    // 8. Open Cockpit Monocoque Aperture & Driver
    // Cockpit opening (Dark carbon)
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.moveTo(11, -3);
    ctx.lineTo(11, 3);
    ctx.lineTo(-3, 3.5);
    ctx.lineTo(-3, -3.5);
    ctx.closePath();
    ctx.fill();

    // Red safety headrest cockpit surround
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-2, -3.2, 5, 6.4);
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-1, -2.5, 4, 5);

    // F1 Steering Wheel with Shift Lights
    ctx.fillStyle = '#27272a';
    ctx.fillRect(7, -2.2, 1.8, 4.4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(7.5, -1.5, 0.8, 0.8);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(7.5, -0.4, 0.8, 0.8);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(7.5, 0.7, 0.8, 0.8);

    // Driver's Helmet (Alonso Scarlet & Cyan/Yellow Top)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(2, 0, 2.7, 0, Math.PI * 2);
    ctx.fill();
    // Helmet Visor (Dark Chrome Tint)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(2.8, -1.6, 1.4, 3.2);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(3.2, -1.4, 1.0, 2.8);
    // Helmet Crown Accent
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(1.5, 0, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // 9. Engine Airbox & Roll Hoop Intake
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(-3, -2.2);
    ctx.lineTo(-5.5, -1.8);
    ctx.lineTo(-5.5, 1.8);
    ctx.lineTo(-3, 2.2);
    ctx.closePath();
    ctx.fill();

    // White T-Cam / Broadcast Camera Pod on Roll Hoop
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-4.5, -1, 2.5, 2);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-3, -0.6, 1, 1.2);

    // 10. Iconic F10 Shark Fin (Pinna di Squalo) Dorsal Engine Cover
    // Red dorsal fin stretching from airbox (-4) to rear wing (-33)
    ctx.fillStyle = redColor;
    ctx.beginPath();
    ctx.moveTo(-5, -0.8);
    ctx.lineTo(-33, -0.8);
    ctx.lineTo(-33, 0.8);
    ctx.lineTo(-5, 0.8);
    ctx.closePath();
    ctx.fill();

    // White Barcode / Santander Racing Livery on Shark Fin
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-10, -0.8, 12, 1.6);
    ctx.fillStyle = '#dc2626';
    for (let b = 0; b < 6; b++) {
      ctx.fillRect(-1 + b * 1.8, -0.8, 0.8, 1.6);
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-22, -0.8, 8, 1.6);

    // 11. Front Wing Assembly (Multi-Element with Red Endplates & White Aerofoils)
    // Mainplane (Red)
    ctx.fillStyle = redColor;
    ctx.beginPath();
    ctx.moveTo(36, -16);
    ctx.lineTo(31, -16);
    ctx.lineTo(29, -5);
    ctx.lineTo(29, 5);
    ctx.lineTo(31, 16);
    ctx.lineTo(36, 16);
    ctx.lineTo(33, 5);
    ctx.lineTo(33, -5);
    ctx.closePath();
    ctx.fill();

    // White Aerofoil Flaps
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(35, -15);
    ctx.lineTo(32, -15);
    ctx.lineTo(30, -5);
    ctx.lineTo(30, -4);
    ctx.lineTo(33, -4);
    ctx.lineTo(35, -13);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(35, 15);
    ctx.lineTo(32, 15);
    ctx.lineTo(30, 5);
    ctx.lineTo(30, 4);
    ctx.lineTo(33, 4);
    ctx.lineTo(35, 13);
    ctx.closePath();
    ctx.fill();

    // Front Wing Endplates (Red with outer black cascades)
    ctx.fillStyle = redColor;
    ctx.fillRect(29, -17, 7, 1.6);
    ctx.fillRect(29, 15.4, 7, 1.6);
    ctx.fillStyle = '#09090b';
    ctx.fillRect(28, -17.5, 6, 0.8);
    ctx.fillRect(28, 16.7, 6, 0.8);

    // Wing Pylon Mounts (Underside of Nose)
    ctx.fillStyle = '#18181b';
    ctx.fillRect(30, -1.8, 4, 0.8);
    ctx.fillRect(30, 1.0, 4, 0.8);

    // 12. Aerodynamic Stalk Side Mirrors
    ctx.fillStyle = '#09090b';
    ctx.fillRect(6, -11, 1, 3.5); // Left stalk
    ctx.fillRect(6, 7.5, 1, 3.5);  // Right stalk
    ctx.fillStyle = redColor;
    ctx.beginPath(); ctx.ellipse(7, -11.5, 2.5, 1.5, -Math.PI / 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(7, 11.5, 2.5, 1.5, Math.PI / 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#38bdf8'; // Mirror glass
    ctx.fillRect(6.2, -12.2, 0.8, 1.6);
    ctx.fillRect(6.2, 10.6, 0.8, 1.6);

    // 13. Rear Wing Assembly (Multi-Element High Downforce)
    // Red Mainplane & Beam
    ctx.fillStyle = redColor;
    ctx.fillRect(-34, -14, 4, 28);

    // White Santander Top Flap
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-32, -13.5, 2.2, 27);

    // Rear Wing Endplates (Red with Santander livery accents)
    ctx.fillStyle = redColor;
    ctx.fillRect(-36, -15, 7, 1.8);
    ctx.fillRect(-36, 13.2, 7, 1.8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-35, -15, 4, 0.8);
    ctx.fillRect(-35, 14.2, 4, 0.8);

    // Central DRS Actuator / Shark Fin Pylon
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-34, -1.5, 4, 3);

    // 14. Exposed F1 Wheel Rims Detailing (BBS Gold & Polished Center Hubs)
    ctx.fillStyle = '#d97706'; // BBS Gold rim centers
    ctx.beginPath(); ctx.arc(17, -11, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(17, 11, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-13, -11, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-13, 11, 2, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#f8fafc'; // Center lock nut
    ctx.beginPath(); ctx.arc(17, -11, 0.9, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(17, 11, 0.9, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-13, -11, 0.9, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-13, 11, 0.9, 0, Math.PI * 2); ctx.fill();

    return true;
  }
  if (carStats.id === 'car-avesta-ultra') {
    // Avesta Ultra (Lamborghini SiÃ¡n Roadster inspired open-top hypercar in Blu Uranus)
    // Metallic Cerulean Cyan, exposed cockpit with luxury white/black seats & bronze console,
    // aerodynamic rear buttresses, central copper spine pinstripe, and triple hexagonal taillights
    const cyanColor = baseColor || '#009eb8';

    // 1. Carbon Fiber Front Splitter & Underbody Aerodynamic Tray
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.moveTo(35, 0);
    ctx.lineTo(31, -14);
    ctx.lineTo(26, -14);
    ctx.lineTo(-24, -14);
    ctx.lineTo(-33, -13);
    ctx.lineTo(-35, -9);
    ctx.lineTo(-35, 9);
    ctx.lineTo(-33, 13);
    ctx.lineTo(-24, 14);
    ctx.lineTo(26, 14);
    ctx.lineTo(31, 14);
    ctx.closePath();
    ctx.fill();

    // Front Splitter Side Winglets (Uprights)
    ctx.fillStyle = '#006d80';
    ctx.fillRect(28, -14.5, 3, 1.2);
    ctx.fillRect(28, 13.3, 3, 1.2);

    // Rear Diffuser Multi-Fins
    ctx.fillStyle = '#050505';
    for (let dy = -10; dy <= 10; dy += 4) {
      ctx.fillRect(-35, dy - 0.7, 5, 1.4);
    }

    // 2. Main Sculpted Bodywork (Metallic Electric Cyan)
    ctx.fillStyle = cyanColor;
    ctx.beginPath();
    ctx.moveTo(34, 0); // Sharp wedge nose
    ctx.lineTo(30, -7);
    ctx.lineTo(24, -13); // Front fender
    ctx.lineTo(10, -13);
    ctx.lineTo(5, -14);  // Side intake flare
    ctx.lineTo(-12, -14);
    ctx.lineTo(-26, -13); // Rear muscular haunch
    ctx.lineTo(-33, -9);  // Rear corner
    ctx.lineTo(-31, -5);  // Hexagonal rear clip recess
    ctx.lineTo(-31, 5);
    ctx.lineTo(-33, 9);
    ctx.lineTo(-26, 13);
    ctx.lineTo(-12, 14);
    ctx.lineTo(5, 14);
    ctx.lineTo(10, 13);
    ctx.lineTo(24, 13);
    ctx.lineTo(30, 7);
    ctx.closePath();
    ctx.fill();

    // 3. Front Hood Sculpting & Y-Shaped Creases (Carbon Inserts)
    // Dark carbon hood vents / aerodynamic air exit channels
    ctx.fillStyle = '#0a0a0c';
    ctx.beginPath();
    ctx.moveTo(25, -2);
    ctx.lineTo(20, -5);
    ctx.lineTo(17, -5);
    ctx.lineTo(20, -1.5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(25, 2);
    ctx.lineTo(20, 5);
    ctx.lineTo(17, 5);
    ctx.lineTo(20, 1.5);
    ctx.closePath();
    ctx.fill();

    // Front nose Lamborghini shield logo (Gold badge)
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(31, 0);
    ctx.lineTo(29.5, -1);
    ctx.lineTo(29.5, 1);
    ctx.closePath();
    ctx.fill();

    // Metallic body highlight lines on front fenders
    ctx.strokeStyle = '#38d9f5';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(29, -6); ctx.lineTo(20, -11); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(29, 6); ctx.lineTo(20, 11); ctx.stroke();

    // 4. Exposed Open-Top Roadster Cockpit
    // Deep black carbon tub & surround
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.moveTo(14, -9);
    ctx.bezierCurveTo(16, -4, 16, 4, 14, 9); // Curved windshield base
    ctx.lineTo(-5, 9);
    ctx.lineTo(-5, -9);
    ctx.closePath();
    ctx.fill();

    // Curved Tinted Windshield Top Rail
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.moveTo(14, -8.5);
    ctx.bezierCurveTo(16, -4, 16, 4, 14, 8.5);
    ctx.lineTo(11, 8);
    ctx.bezierCurveTo(13, 4, 13, -4, 11, -8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#00d2f0'; // Windshield edge reflection
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(14, -8.5);
    ctx.bezierCurveTo(16, -4, 16, 4, 14, 8.5);
    ctx.stroke();

    // Alcantara Dark Dash & Cowling
    ctx.fillStyle = '#18181b';
    ctx.fillRect(7, -8, 4, 16);

    // Left: Driver's Hexagonal Steering Wheel with Gold Crest
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(5.5, -6.5, 3.5, 3.5);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(7, -5, 0.8, 0.8);

    // Center Console: Signature Bronze / Copper Bridge & Screen
    ctx.fillStyle = '#c2410c'; // Bronze/Copper
    ctx.fillRect(-2, -1.2, 9, 2.4);
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, -0.7, 4, 1.4); // Screen
    ctx.fillStyle = '#f97316';
    ctx.fillRect(4.5, -0.6, 1.2, 1.2); // Start button cover

    // Luxury Sport Bucket Seats (Driver on left, Passenger on right)
    // Driver Seat (left: y = -5)
    ctx.fillStyle = '#0f172a'; // Carbon seat frame
    ctx.fillRect(-3.5, -7.5, 7, 5);
    ctx.fillStyle = '#f8fafc'; // White/cream leather center cushion
    ctx.fillRect(-3, -6.8, 5.8, 3.6);
    ctx.fillStyle = '#09090b'; // Center harness insert & headrest detail
    ctx.fillRect(-1.5, -5.3, 3, 0.6);
    ctx.fillStyle = '#f8fafc'; // Headrest
    ctx.fillRect(-3.2, -6.2, 1.5, 2.4);

    // Passenger Seat (right: y = 5)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-3.5, 2.5, 7, 5);
    ctx.fillStyle = '#f8fafc'; // White/cream leather center cushion
    ctx.fillRect(-3, 3.2, 5.8, 3.6);
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-1.5, 4.7, 3, 0.6);
    ctx.fillStyle = '#f8fafc'; // Headrest
    ctx.fillRect(-3.2, 3.8, 1.5, 2.4);

    // 5. Dual Aerodynamic Rear Buttresses / Nacelles (Behind seats)
    // Left Nacelle
    ctx.fillStyle = cyanColor;
    ctx.beginPath();
    ctx.moveTo(-4, -8);
    ctx.lineTo(-12, -7.5);
    ctx.lineTo(-15, -4);
    ctx.lineTo(-5, -4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#09090b'; // Gloss black inner rollover cowl
    ctx.fillRect(-6, -7, 4, 2.6);

    // Right Nacelle
    ctx.fillStyle = cyanColor;
    ctx.beginPath();
    ctx.moveTo(-4, 8);
    ctx.lineTo(-12, 7.5);
    ctx.lineTo(-15, 4);
    ctx.lineTo(-5, 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-6, 4.4, 4, 2.6);

    // 6. Rear Engine Deck & Signature Copper/Bronze Center Spine
    // Dark glass / carbon periscopio engine cover slats
    ctx.fillStyle = '#0b0f19';
    ctx.beginPath();
    ctx.moveTo(-5, -4);
    ctx.lineTo(-27, -4.5);
    ctx.lineTo(-27, 4.5);
    ctx.lineTo(-5, 4);
    ctx.closePath();
    ctx.fill();

    // Carbon engine cooling louvers
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = -8; x >= -24; x -= 3.5) {
      ctx.beginPath(); ctx.moveTo(x, -3.5); ctx.lineTo(x, 3.5); ctx.stroke();
    }

    // SIGNATURE SIÃN COPPER / BRONZE CENTER SPINE (Pinstripe running down center)
    ctx.fillStyle = '#ea580c'; // Vibrant metallic copper
    ctx.fillRect(-28, -0.6, 24, 1.2);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-28, -0.25, 24, 0.5);

    // Rear Quarter Panel Side Air Intakes & Aero Fins
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.moveTo(3, -13.5);
    ctx.lineTo(-8, -13);
    ctx.lineTo(-8, -10.5);
    ctx.lineTo(0, -11.5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(3, 13.5);
    ctx.lineTo(-8, 13);
    ctx.lineTo(-8, 10.5);
    ctx.lineTo(0, 11.5);
    ctx.closePath();
    ctx.fill();

    // Side badge / Italian Tricolore accent stripe on left & right shoulders
    ctx.fillStyle = '#059669'; ctx.fillRect(-10, -13.6, 1, 1);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(-10, -12.6, 1, 1);
    ctx.fillStyle = '#dc2626'; ctx.fillRect(-10, -11.6, 1, 1);

    ctx.fillStyle = '#059669'; ctx.fillRect(-10, 10.6, 1, 1);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(-10, 11.6, 1, 1);
    ctx.fillStyle = '#dc2626'; ctx.fillRect(-10, 12.6, 1, 1);

    // 7. Triple Hexagonal 3D Rear Taillights (3 on left, 3 on right)
    ctx.fillStyle = '#7f1d1d'; // Dark red housings
    // Left side 3 hex lights
    ctx.fillRect(-31, -11.5, 2.5, 1.8);
    ctx.fillRect(-31, -8.5, 2.5, 1.8);
    ctx.fillRect(-31, -5.5, 2.5, 1.8);
    // Right side 3 hex lights
    ctx.fillRect(-31, 3.7, 2.5, 1.8);
    ctx.fillRect(-31, 6.7, 2.5, 1.8);
    ctx.fillRect(-31, 9.7, 2.5, 1.8);

    // Glowing Red Hexagonal Cores
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-31.5, -11.2, 1.8, 1.2);
    ctx.fillRect(-31.5, -8.2, 1.8, 1.2);
    ctx.fillRect(-31.5, -5.2, 1.8, 1.2);
    ctx.fillRect(-31.5, 4.0, 1.8, 1.2);
    ctx.fillRect(-31.5, 7.0, 1.8, 1.2);
    ctx.fillRect(-31.5, 10.0, 1.8, 1.2);

    // Rear Dual Bronze Hexagonal Exhaust Tips
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-33, -2.8, 3, 2);
    ctx.fillRect(-33, 0.8, 3, 2);
    ctx.fillStyle = '#050505';
    ctx.fillRect(-33.5, -2.4, 1.5, 1.2);
    ctx.fillRect(-33.5, 1.2, 1.5, 1.2);

    // 8. Aerodynamic Stalk Side Mirrors (Cyan caps with mirror glass)
    ctx.fillStyle = '#09090b';
    ctx.fillRect(8, -13, 1, 3);
    ctx.fillRect(8, 10, 1, 3);
    ctx.fillStyle = cyanColor;
    ctx.beginPath(); ctx.ellipse(9, -13.5, 3, 1.6, -Math.PI / 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(9, 13.5, 3, 1.6, Math.PI / 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(8.2, -14.2, 0.9, 1.8);
    ctx.fillRect(8.2, 12.4, 0.9, 1.8);

    // 9. Wheel Rims (Carbon & Bronze accents)
    ctx.fillStyle = '#c2410c'; // Bronze center nut
    ctx.beginPath(); ctx.arc(17, -11, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(17, 11, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-13, -11, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-13, 11, 1.5, 0, Math.PI * 2); ctx.fill();

    return true;
  }

  if (carStats.id === 'car-elegus-z1') {
    // Ford GT40 Mk I / Gulf Livery Endurance Legend ("Elegus Z1")
    const gulfBlue = '#6ea7d8';
    const gulfOrange = '#f9570c';
    const stripeBorder = '#090d16';

    // 1. Aerodynamic Vintage Endurance Silhouette (Long low nose, wide curvy haunches, ducktail)
    ctx.fillStyle = gulfBlue;
    ctx.beginPath();
    ctx.moveTo(28.5, -4.5); // Nose front-left
    ctx.quadraticCurveTo(29, 0, 28.5, 4.5); // Nose rounded tip
    ctx.lineTo(26.5, 9); // Front right fender curve
    ctx.quadraticCurveTo(23, 13.5, 17, 13.5); // Front right wheel arch
    ctx.lineTo(10, 12.5); // Fender back
    ctx.lineTo(4, 11.8); // Side door sill
    ctx.lineTo(-4, 12.2); // Mid waist
    ctx.quadraticCurveTo(-11, 14.2, -18, 14.2); // Wide muscular rear right haunch
    ctx.lineTo(-24.5, 13.8); // Rear fender corner
    ctx.quadraticCurveTo(-27.2, 13.2, -27.5, 10); // Rear ducktail corner
    ctx.lineTo(-27.5, -10); // Rear Kamm-tail spoiler lip
    ctx.quadraticCurveTo(-27.2, -13.2, -24.5, -13.8);
    ctx.lineTo(-18, -14.2); // Wide muscular rear left haunch
    ctx.quadraticCurveTo(-11, -14.2, -4, -12.2);
    ctx.lineTo(4, -11.8);
    ctx.lineTo(10, -12.5);
    ctx.quadraticCurveTo(23, -13.5, 26.5, -9);
    ctx.closePath();
    ctx.fill();

    // 2. Front Curved Orange Nose Lip
    ctx.fillStyle = gulfOrange;
    ctx.beginPath();
    ctx.moveTo(28.5, -4.5);
    ctx.quadraticCurveTo(29, 0, 28.5, 4.5);
    ctx.lineTo(26, 7.5);
    ctx.quadraticCurveTo(24, 0, 26, -7.5);
    ctx.closePath();
    ctx.fill();

    // Front License Plate / Tag ("PX66 HWE")
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(27.2, -2.8, 1.4, 5.6);
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 0.4;
    ctx.strokeRect(27.2, -2.8, 1.4, 5.6);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(27.4, -2.2, 0.9, 4.4);

    // 3. Iconic Center Gulf Orange Racing Stripe with Black Pinstripes
    // Dark pinstripe border
    ctx.fillStyle = stripeBorder;
    ctx.fillRect(-27.5, -3.2, 56, 6.4);
    // Vibrant Gulf Orange stripe
    ctx.fillStyle = gulfOrange;
    ctx.fillRect(-27.5, -2.6, 56, 5.2);

    // 4. Deep Front Radiator Hood Scoop / Heat Extractor Duct
    ctx.fillStyle = '#070b14';
    ctx.beginPath();
    ctx.moveTo(22.5, -4.8);
    ctx.lineTo(22.5, 4.8);
    ctx.lineTo(14.5, 4.2);
    ctx.lineTo(14.5, -4.2);
    ctx.closePath();
    ctx.fill();

    // Hood scoop inner walls & radiator core gradient
    const scoopGrad = ctx.createLinearGradient(22, 0, 15, 0);
    scoopGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
    scoopGrad.addColorStop(0.6, 'rgba(30, 41, 59, 0.8)');
    scoopGrad.addColorStop(1, 'rgba(15, 23, 42, 1)');
    ctx.fillStyle = scoopGrad;
    ctx.fillRect(15, -4, 7, 8);

    // Stripe continues through center of the scoop with metallic divider
    ctx.fillStyle = stripeBorder;
    ctx.fillRect(14.5, -2.2, 8, 4.4);
    ctx.fillStyle = gulfOrange;
    ctx.fillRect(14.5, -1.8, 8, 3.6);

    // Center aerodynamic dive vane / intake divider
    ctx.fillStyle = '#090d16';
    ctx.fillRect(17, -0.4, 4.5, 0.8);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(17.2, -0.2, 4.1, 0.4);

    // Scoop outer chrome / black rim trim
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(14.5, -4.5, 8, 9);

    // 5. Dual Round Chrome Racing Fuel Filler Caps on Front Fenders
    [-10.8, 10.8].forEach(yPos => {
      // Silver filler cap bezel
      ctx.fillStyle = '#475569';
      ctx.beginPath(); ctx.arc(10, yPos, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath(); ctx.arc(10, yPos, 1.8, 0, Math.PI * 2); ctx.fill();
      // Polished inner cap with latch tab
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath(); ctx.arc(10, yPos, 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.fillRect(8.6, yPos - 0.4, 0.8, 0.8);
    });

    // 6. Cockpit & Wraparound Bubble Windshield
    // Glass Base
    const glassGrad = ctx.createLinearGradient(10, 0, -2, 0);
    glassGrad.addColorStop(0, '#0c1929');
    glassGrad.addColorStop(0.5, '#162b44');
    glassGrad.addColorStop(1, '#0b1624');
    ctx.fillStyle = glassGrad;
    ctx.beginPath();
    ctx.moveTo(9.5, -8.5);
    ctx.quadraticCurveTo(11.5, 0, 9.5, 8.5);
    ctx.lineTo(0, 8.8);
    ctx.lineTo(-2, 7.8);
    ctx.lineTo(-2, -7.8);
    ctx.lineTo(0, -8.8);
    ctx.closePath();
    ctx.fill();

    // Windshield specular reflections
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(4, -3, 6, -Math.PI * 0.4, 0);
    ctx.stroke();

    // Single Center Wiper
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(4, -0.6);
    ctx.lineTo(9.2, -1.2);
    ctx.stroke();

    // 7. Roof & Signature GT40 Roof-Cutout Doors
    ctx.fillStyle = gulfBlue;
    ctx.beginPath();
    ctx.moveTo(-1.5, -6.5);
    ctx.lineTo(-1.5, 6.5);
    ctx.lineTo(-9.5, 6.5);
    ctx.lineTo(-9.5, -6.5);
    ctx.closePath();
    ctx.fill();

    // Center stripe on roof
    ctx.fillStyle = stripeBorder;
    ctx.fillRect(-9.5, -3.2, 8, 6.4);
    ctx.fillStyle = gulfOrange;
    ctx.fillRect(-9.5, -2.6, 8, 5.2);

    // GT40 Roof-Door Cutouts (Doors cut into the roof for driver helmet entry)
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 0.6;
    // Left roof-door cutout shutline
    ctx.beginPath();
    ctx.moveTo(-1.5, -6.5);
    ctx.lineTo(-2.2, -3.4);
    ctx.lineTo(-8.5, -3.4);
    ctx.lineTo(-9.5, -6.5);
    ctx.stroke();
    // Right roof-door cutout shutline
    ctx.beginPath();
    ctx.moveTo(-1.5, 6.5);
    ctx.lineTo(-2.2, 3.4);
    ctx.lineTo(-8.5, 3.4);
    ctx.lineTo(-9.5, 6.5);
    ctx.stroke();

    // Side quarter window glass & intakes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-2, -9.8, 7, 1.8);
    ctx.fillRect(-2, 8, 7, 1.8);

    // Side Aerodynamic Stalk Mirrors
    ctx.fillStyle = '#090d16';
    ctx.fillRect(6.5, -12.5, 1.2, 2.5);
    ctx.fillRect(6.5, 10, 1.2, 2.5);
    ctx.beginPath(); ctx.ellipse(7.5, -13.2, 2.5, 1.2, -Math.PI / 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(7.5, 13.2, 2.5, 1.2, Math.PI / 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(7, -13.8, 0.8, 1.2);
    ctx.fillRect(7, 12.6, 0.8, 1.2);

    // 8. Rear Clamshell Engine Bay Glass & V8 Engine
    const engineGlassGrad = ctx.createLinearGradient(-9.5, 0, -19.5, 0);
    engineGlassGrad.addColorStop(0, 'rgba(12, 25, 41, 0.95)');
    engineGlassGrad.addColorStop(0.5, 'rgba(20, 36, 56, 0.85)');
    engineGlassGrad.addColorStop(1, 'rgba(12, 25, 41, 0.95)');
    ctx.fillStyle = engineGlassGrad;
    ctx.beginPath();
    ctx.moveTo(-9.5, -6.8);
    ctx.lineTo(-9.5, 6.8);
    ctx.lineTo(-19.5, 5.8);
    ctx.lineTo(-19.5, -5.8);
    ctx.closePath();
    ctx.fill();

    // V8 Engine Block & Velocity Stacks / Chrome Trumpets visible through glass
    ctx.fillStyle = '#334155'; // Engine casting block
    ctx.fillRect(-18, -4.2, 7.5, 8.4);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-17.5, -3.8, 6.5, 7.6);

    // 8 Polished Chrome Velocity Stacks (2 rows of 4)
    [-1.8, 1.8].forEach(rowY => {
      [-12.2, -13.8, -15.4, -17.0].forEach(stackX => {
        // Outer chrome flare
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath(); ctx.arc(stackX, rowY, 1.15, 0, Math.PI * 2); ctx.fill();
        // Inner funnel shadow
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(stackX, rowY, 0.65, 0, Math.PI * 2); ctx.fill();
      });
    });

    // Glass framing border
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.6;
    ctx.strokeRect(-19.5, -6.5, 10, 13);

    // 9. Rear Louver / Aluminum Cooling Ventilation Plate
    ctx.fillStyle = '#cbd5e1'; // Aluminum plate
    ctx.fillRect(-24.5, -3.8, 4.2, 7.6);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 0.4;
    ctx.strokeRect(-24.5, -3.8, 4.2, 7.6);

    // 2x4 Grid of dark cooling vent ovals
    ctx.fillStyle = '#0f172a';
    [-23.8, -22.4, -21.0].forEach(vx => {
      [-2.4, -0.8, 0.8, 2.4].forEach(vy => {
        ctx.beginPath();
        ctx.ellipse(vx, vy, 0.55, 0.9, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // Center orange stripe continues through the rear deck
    ctx.fillStyle = stripeBorder;
    ctx.fillRect(-27.5, -3.2, 3, 6.4);
    ctx.fillStyle = gulfOrange;
    ctx.fillRect(-27.5, -2.6, 3, 5.2);

    // 10. Rear "S.E.V. MARCHAL" Racing Sponsor Decals on Rear Fenders
    [-12.4, 12.4].forEach(dy => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-22.5, dy, 3.2, 1.3, dy > 0 ? 0.1 : -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-24.5, dy - 0.5, 4.2, 1.0);
    });

    // 11. Rear Ducktail / Kamm-tail Spoiler Lip & Dual Polished Exhausts
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-27.8, -11, 0.8, 22);
    ctx.fillStyle = '#334155';
    ctx.fillRect(-27.4, -10.5, 0.4, 21);

    // Dual Polished Exhaust Tips
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath(); ctx.arc(-27.8, -2.2, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-27.8, 2.2, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#020617';
    ctx.beginPath(); ctx.arc(-27.8, -2.2, 0.7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-27.8, 2.2, 0.7, 0, Math.PI * 2); ctx.fill();

    return true;
  }

  if (carStats.id === 'car-elegus-ruara') {
    // Pagani Huayra / Huayra BC Inspired Hypercar ("Elegus Ruara")
    const titanSilver = baseColor || '#94a3b8';
    const glossCarbon = '#18181b';
    const deepCarbon = '#09090b';
    const goldAccent = '#f59e0b';

    // 1. Extreme Hypercar Teardrop Fuselage & Sculpted Widebody
    ctx.fillStyle = titanSilver;
    ctx.beginPath();
    ctx.moveTo(29.5, 0); // Sharp pointed shark nose
    ctx.lineTo(27.5, -4.8); // Front left nose contour
    ctx.quadraticCurveTo(24, -10.8, 16.5, -13.2); // Front left flared wheel arch
    ctx.lineTo(9.5, -12.5); // Front fender back
    ctx.lineTo(4, -10.5); // Dramatic wasp-waist pinch
    ctx.lineTo(-4, -10.8); // Mid waist
    ctx.quadraticCurveTo(-11, -14.2, -18.5, -14.2); // Muscular flared rear left haunch
    ctx.lineTo(-24.5, -13.5); // Rear fender corner
    ctx.quadraticCurveTo(-28.0, -11.5, -28.5, -6.5); // Rear left bumper diffuser winglet
    ctx.lineTo(-28.5, 6.5); // Rear center Kamm line
    ctx.quadraticCurveTo(-28.0, 11.5, -24.5, 13.5);
    ctx.lineTo(-18.5, 14.2); // Muscular flared rear right haunch
    ctx.quadraticCurveTo(-11, 14.2, -4, 10.8);
    ctx.lineTo(4, 10.5); // Dramatic wasp-waist pinch
    ctx.lineTo(9.5, 12.5);
    ctx.quadraticCurveTo(24, 10.8, 27.5, 4.8);
    ctx.closePath();
    ctx.fill();

    // 2. Front Carbon Splitter, Dive Canards & Active Aero Front Flaps
    // Front Extended Carbon Splitter
    ctx.fillStyle = deepCarbon;
    ctx.beginPath();
    ctx.moveTo(31.5, 0);
    ctx.lineTo(28.5, -7.5);
    ctx.lineTo(27, -8);
    ctx.lineTo(27.5, -4);
    ctx.lineTo(29.8, 0);
    ctx.lineTo(27.5, 4);
    ctx.lineTo(27, 8);
    ctx.lineTo(28.5, 7.5);
    ctx.closePath();
    ctx.fill();

    // Front Corner Dive Planes / Canards
    [-1, 1].forEach(dir => {
      ctx.fillStyle = glossCarbon;
      ctx.beginPath();
      ctx.moveTo(25.5, dir * 9.5);
      ctx.lineTo(27.8, dir * 12.2);
      ctx.lineTo(26.2, dir * 12.8);
      ctx.lineTo(24.0, dir * 10.2);
      ctx.closePath();
      ctx.fill();
    });

    // Front Center Carbon Radiator Mouth
    ctx.fillStyle = '#05070a';
    ctx.beginPath();
    ctx.moveTo(28.5, 0);
    ctx.lineTo(24.5, -4.5);
    ctx.lineTo(22.5, 0);
    ctx.lineTo(24.5, 4.5);
    ctx.closePath();
    ctx.fill();

    // 3. Central Exposed Carbon Fiber Weave Spine with Gold Pinstripe
    // Exposed gloss carbon section running nose to tail
    ctx.fillStyle = glossCarbon;
    ctx.beginPath();
    ctx.moveTo(28.5, 0);
    ctx.lineTo(21, -3.8);
    ctx.lineTo(10, -3.2);
    ctx.lineTo(-2, -3.4);
    ctx.lineTo(-10, -3.8);
    ctx.lineTo(-20, -3.2);
    ctx.lineTo(-28.5, -3.0);
    ctx.lineTo(-28.5, 3.0);
    ctx.lineTo(-20, 3.2);
    ctx.lineTo(-10, 3.8);
    ctx.lineTo(-2, 3.4);
    ctx.lineTo(10, 3.2);
    ctx.lineTo(21, 3.8);
    ctx.closePath();
    ctx.fill();

    // Center Gold Accent Pinstripe
    ctx.fillStyle = goldAccent;
    ctx.fillRect(-28.5, -0.4, 57, 0.8);

    // Dual Active Front Hood Flaps (Huayra active aerodynamics)
    [-1, 1].forEach(dir => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(14, dir * 3.8 - 1.2, 5.5, 2.4);
      ctx.strokeStyle = goldAccent;
      ctx.lineWidth = 0.4;
      ctx.strokeRect(14, dir * 3.8 - 1.2, 5.5, 2.4);
    });

    // 4. Teardrop Cockpit Canopy & Curved Windshield
    const canopyGrad = ctx.createLinearGradient(12, 0, -5, 0);
    canopyGrad.addColorStop(0, '#09101d');
    canopyGrad.addColorStop(0.5, '#162235');
    canopyGrad.addColorStop(1, '#0b1320');
    ctx.fillStyle = canopyGrad;

    ctx.beginPath();
    ctx.moveTo(11.5, 0); // Windshield top apex
    ctx.quadraticCurveTo(10.5, -7.5, 3, -7.8);
    ctx.lineTo(-5, -7.2);
    ctx.quadraticCurveTo(-9.5, -5.5, -10.5, 0);
    ctx.quadraticCurveTo(-9.5, 5.5, -5, 7.2);
    ctx.lineTo(3, 7.8);
    ctx.quadraticCurveTo(10.5, 7.5, 11.5, 0);
    ctx.closePath();
    ctx.fill();

    // Windshield reflection curve
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.arc(4.5, -1.5, 6, -Math.PI * 0.4, 0);
    ctx.stroke();

    // Carbon Roof Spine dividing the canopy
    ctx.fillStyle = glossCarbon;
    ctx.beginPath();
    ctx.moveTo(6.5, -1.8);
    ctx.lineTo(-10.5, -2.4);
    ctx.lineTo(-10.5, 2.4);
    ctx.lineTo(6.5, 1.8);
    ctx.closePath();
    ctx.fill();

    // Gold center roof stripe
    ctx.fillStyle = goldAccent;
    ctx.fillRect(-10.5, -0.4, 17, 0.8);

    // 5. Signature Leaf-Shaped Stalk Side Mirrors (Extending from front wings)
    [-1, 1].forEach(dir => {
      // Slender curved carbon stalk
      ctx.strokeStyle = deepCarbon;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(14, dir * 7.5);
      ctx.quadraticCurveTo(13, dir * 14.5, 8.5, dir * 14.8);
      ctx.stroke();

      // Delicate leaf-shaped aerodynamic mirror housing
      ctx.fillStyle = titanSilver;
      ctx.beginPath();
      ctx.ellipse(8.5, dir * 14.8, 2.8, 1.3, dir * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = deepCarbon;
      ctx.lineWidth = 0.4;
      ctx.stroke();

      // Mirror reflective glass
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(8.0, dir * 14.8 - 0.5, 1.2, 1.0);
    });

    // 6. Side NACA Ducts & Sculpted Carbon Side Skirts
    [-1, 1].forEach(dir => {
      // Carbon side skirt with aero winglet
      ctx.fillStyle = deepCarbon;
      ctx.fillRect(-12, dir * 11.8 - (dir > 0 ? 0 : 1.2), 20, 1.2);
      ctx.fillRect(7, dir * 12.2 - (dir > 0 ? 0 : 1.8), 2.5, 1.8); // Side winglet

      // Deep intake duct
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.moveTo(1, dir * 9.8);
      ctx.lineTo(-7, dir * 11.2);
      ctx.lineTo(-7, dir * 8.2);
      ctx.closePath();
      ctx.fill();
    });

    // 7. Transparent Twin Engine Bay Glass & Mercedes-AMG 6.0L Twin-Turbo V12
    const engineGlass = ctx.createLinearGradient(-10.5, 0, -21.5, 0);
    engineGlass.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
    engineGlass.addColorStop(0.5, 'rgba(30, 41, 59, 0.8)');
    engineGlass.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
    ctx.fillStyle = engineGlass;

    // Left engine glass portal
    ctx.beginPath();
    ctx.moveTo(-11, -3.0);
    ctx.lineTo(-11, -6.8);
    ctx.lineTo(-20.5, -6.0);
    ctx.lineTo(-20.5, -3.0);
    ctx.closePath();
    ctx.fill();

    // Right engine glass portal
    ctx.beginPath();
    ctx.moveTo(-11, 3.0);
    ctx.lineTo(-11, 6.8);
    ctx.lineTo(-20.5, 6.0);
    ctx.lineTo(-20.5, 3.0);
    ctx.closePath();
    ctx.fill();

    // V12 Engine Carbon Plenums & Gold Heat Shielding
    [-1, 1].forEach(dir => {
      // Gold heat shielding foil
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-19.5, dir * 4.8 - 0.9, 7.5, 1.8);
      // Carbon intake runner plenum
      ctx.fillStyle = '#334155';
      ctx.fillRect(-18.5, dir * 4.8 - 0.7, 6.0, 1.4);
      // Silver intake trumpets
      ctx.fillStyle = '#e2e8f0';
      [-17.5, -15.5, -13.5].forEach(tx => {
        ctx.beginPath();
        ctx.arc(tx, dir * 4.8, 0.7, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // 8. Huayra BC Carbon Fiber Rear GT Wing & Active Elevators
    // Carbon wing main plane
    ctx.fillStyle = glossCarbon;
    ctx.beginPath();
    ctx.moveTo(-25.5, -14.5);
    ctx.lineTo(-28.0, -14.5);
    ctx.lineTo(-28.0, 14.5);
    ctx.lineTo(-25.5, 14.5);
    ctx.closePath();
    ctx.fill();

    // Gold trim on rear wing edge
    ctx.fillStyle = goldAccent;
    ctx.fillRect(-28.0, -14.5, 0.6, 29);

    // Wing endplates
    ctx.fillStyle = deepCarbon;
    ctx.fillRect(-29.0, -15.2, 4.5, 1.2);
    ctx.fillRect(-29.0, 14.0, 4.5, 1.2);

    // Twin Carbon Wing Mount Pylons
    [-4.5, 4.5].forEach(wy => {
      ctx.fillStyle = deepCarbon;
      ctx.fillRect(-26.5, wy - 0.6, 3.5, 1.2);
    });

    // Dual Rear Active Aerodynamic Flaps
    [-1, 1].forEach(dir => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-24.5, dir * 4.5 - 1.2, 3.2, 2.4);
      ctx.strokeStyle = goldAccent;
      ctx.lineWidth = 0.4;
      ctx.strokeRect(-24.5, dir * 4.5 - 1.2, 3.2, 2.4);
    });

    // 9. Signature Pagani Central Quad Exhaust in Circular Titanium Bezel
    // Circular titanium heat shield bezel
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(-27.2, 0, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Titanium heat bluing ring
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(-27.2, 0, 2.6, 0, Math.PI * 2);
    ctx.stroke();

    // 4 Clustered Exhaust Tips (2 over 2)
    ctx.fillStyle = '#0f172a';
    [-0.9, 0.9].forEach(exY => {
      [-26.5, -27.9].forEach(exX => {
        ctx.beginPath();
        ctx.arc(exX, exY, 0.65, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 0.3;
        ctx.stroke();
      });
    });

    // 10. Rear Massive Multi-Channel Carbon Diffuser
    ctx.fillStyle = deepCarbon;
    ctx.fillRect(-28.8, -8, 1.2, 16);
    // Vertical diffuser fins
    [-6.5, -3.5, 3.5, 6.5].forEach(dy => {
      ctx.fillRect(-29.4, dy - 0.3, 1.6, 0.6);
    });

    return true;
  }

  if (carStats.id === 'car-condute-cleo') {
    // Luxury Range Rover Style SUV ("Condute Cleo") - Exact Image Match
    const champagneSilver = baseColor || '#d6d0c4';
    const glossBlack = '#09090b';
    const darkGlass = '#0f172a';
    const chromeTrim = '#f1f5f9';
    const cowlDark = '#1e293b';
    const mochaLeather = '#4a3728';

    // 1. Commanding Luxury SUV Widebody Silhouette (Clamshell hood, muscular haunches)
    ctx.fillStyle = champagneSilver;
    ctx.beginPath();
    ctx.moveTo(28.5, -5.5); // Front bumper center-left
    ctx.quadraticCurveTo(29.0, 0, 28.5, 5.5); // Rounded front nose apex
    ctx.lineTo(27.5, 9.5); // Front bumper right corner
    ctx.quadraticCurveTo(25.5, 13.5, 17.5, 13.8); // Front right flared wheel arch
    ctx.lineTo(10.0, 13.0); // Fender back
    ctx.lineTo(3.5, 12.5); // Front door waistline
    ctx.lineTo(-6.5, 12.5); // Rear door waistline
    ctx.quadraticCurveTo(-14.5, 13.8, -19.0, 13.8); // Muscular rear right haunch
    ctx.lineTo(-24.0, 13.0); // Rear quarter corner
    ctx.quadraticCurveTo(-27.0, 11.5, -27.5, 7.5); // Rear bumper curve
    ctx.lineTo(-27.5, -7.5); // Rear tailgate
    ctx.quadraticCurveTo(-27.0, -11.5, -24.0, -13.0);
    ctx.lineTo(-19.0, -13.8); // Muscular rear left haunch
    ctx.quadraticCurveTo(-14.5, -13.8, -6.5, -12.5);
    ctx.lineTo(3.5, -12.5);
    ctx.lineTo(10.0, -13.0);
    ctx.quadraticCurveTo(25.5, -13.5, 27.5, -9.5); // Front bumper left corner
    ctx.closePath();
    ctx.fill();

    // Subtle 3D Body Surface Creases / Ambient Shading
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // 2. Front Clamshell Hood Lines & Honeycomb Grille
    // Hood Shutline (Clamshell wrapping down the sides)
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(11.5, -12.0);
    ctx.lineTo(26.5, -10.5);
    ctx.lineTo(28.2, -5.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(11.5, 12.0);
    ctx.lineTo(26.5, 10.5);
    ctx.lineTo(28.2, 5.5);
    ctx.stroke();

    // Front Upper Honeycomb / Slat Grille (Range Rover signature)
    ctx.fillStyle = glossBlack;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(27.2, -5.2, 1.4, 10.4, 0.6);
    } else {
      ctx.rect(27.2, -5.2, 1.4, 10.4);
    }
    ctx.fill();
    ctx.strokeStyle = chromeTrim;
    ctx.lineWidth = 0.4;
    ctx.stroke();

    // Grille mesh texture details
    ctx.fillStyle = '#64748b';
    [-3.8, -1.9, 0, 1.9, 3.8].forEach(gy => {
      ctx.fillRect(27.5, gy - 0.5, 0.8, 1.0);
    });

    // Lower Bumper Skid Plate / Chin Spoiler
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(28.2, -3.5, 0.6, 7.0);

    // Hood Recessed Center Power Bulge Lines
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(26.0, -5.0);
    ctx.lineTo(13.0, -4.5);
    ctx.moveTo(26.0, 5.0);
    ctx.lineTo(13.0, 4.5);
    ctx.stroke();

    // 3. Dual Cowl / Hood Vents at Base of Windshield
    [-1, 1].forEach(dir => {
      // Dark textured vent housing
      ctx.fillStyle = cowlDark;
      ctx.fillRect(11.2, dir * 8.5 - 1.4, 3.2, 2.8);
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 0.4;
      ctx.strokeRect(11.2, dir * 8.5 - 1.4, 3.2, 2.8);
      // Fine horizontal slats
      ctx.fillStyle = '#64748b';
      ctx.fillRect(11.6, dir * 8.5 - 0.9, 2.4, 0.4);
      ctx.fillRect(11.6, dir * 8.5 - 0.2, 2.4, 0.4);
      ctx.fillRect(11.6, dir * 8.5 + 0.5, 2.4, 0.4);
    });

    // Dark Cowl Strip between Hood and Windshield
    ctx.fillStyle = cowlDark;
    ctx.fillRect(10.5, -9.2, 1.5, 18.4);

    // Dual Windshield Wipers
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(10.8, -6.5); ctx.lineTo(8.0, -1.0);
    ctx.moveTo(10.8, 1.0); ctx.lineTo(8.0, 6.5);
    ctx.stroke();

    // 4. Tinted Windshield & Luxury Mocha Leather Interior
    const wsGrad = ctx.createLinearGradient(11.0, 0, 3.0, 0);
    wsGrad.addColorStop(0, '#0c1626');
    wsGrad.addColorStop(0.6, '#18273d');
    wsGrad.addColorStop(1, '#0c1626');
    ctx.fillStyle = wsGrad;

    ctx.beginPath();
    ctx.moveTo(10.5, -9.0);
    ctx.quadraticCurveTo(11.2, 0, 10.5, 9.0);
    ctx.lineTo(3.2, 8.5);
    ctx.lineTo(3.2, -8.5);
    ctx.closePath();
    ctx.fill();

    // Visible Luxury Mocha Leather Dashboard Top & Touchscreen Binnacle
    ctx.fillStyle = mochaLeather;
    ctx.beginPath();
    ctx.moveTo(9.5, -7.5);
    ctx.lineTo(9.5, 7.5);
    ctx.lineTo(6.5, 7.0);
    ctx.lineTo(6.5, -7.0);
    ctx.closePath();
    ctx.fill();

    // Instrument Cluster Hood (Driver's side)
    ctx.fillStyle = '#291e17';
    ctx.fillRect(7.0, -5.5, 2.2, 3.2);

    // Center Infotainment Touchscreen
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(7.2, -0.9, 1.6, 1.8);

    // Top-Center Rearview Mirror
    ctx.fillStyle = '#020617';
    ctx.fillRect(3.4, -1.0, 1.0, 2.0);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(3.2, -0.8, 0.3, 1.6);

    // Windshield Reflection Highlighting
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(9.8, -7.0);
    ctx.lineTo(4.5, -4.0);
    ctx.stroke();

    // 5. Floating Roof Dark Greenhouse Canopy (Seamless tinted side & rear glass)
    ctx.fillStyle = darkGlass;
    // Left side glass
    ctx.fillRect(-22.0, -9.5, 25.5, 1.6);
    // Right side glass
    ctx.fillRect(-22.0, 7.9, 25.5, 1.6);

    // Gloss Black A, B, C, D Pillars
    ctx.fillStyle = glossBlack;
    // A-Pillars
    ctx.beginPath();
    ctx.moveTo(10.5, -9.2); ctx.lineTo(3.2, -8.8); ctx.lineTo(3.2, -9.8); ctx.lineTo(10.5, -10.2); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(10.5, 9.2); ctx.lineTo(3.2, 8.8); ctx.lineTo(3.2, 9.8); ctx.lineTo(10.5, 10.2); ctx.closePath(); ctx.fill();
    // B-Pillars
    ctx.fillRect(-4.2, -9.8, 1.4, 2.0);
    ctx.fillRect(-4.2, 7.8, 1.4, 2.0);
    // C-Pillars
    ctx.fillRect(-13.5, -9.8, 1.4, 2.0);
    ctx.fillRect(-13.5, 7.8, 1.4, 2.0);
    // D-Pillars
    ctx.fillRect(-22.5, -9.8, 1.4, 2.0);
    ctx.fillRect(-22.5, 7.8, 1.4, 2.0);

    // Chrome Window Beltline Trim
    ctx.strokeStyle = chromeTrim;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(10.0, -10.2); ctx.lineTo(-22.5, -10.2);
    ctx.moveTo(10.0, 10.2); ctx.lineTo(-22.5, 10.2);
    ctx.stroke();

    // 6. Front Panoramic Sunroof & Champagne Floating Roof Panel
    // Front Panoramic Sunroof Glass
    const sunroofGrad = ctx.createLinearGradient(3.0, 0, -2.5, 0);
    sunroofGrad.addColorStop(0, '#020617');
    sunroofGrad.addColorStop(0.5, '#0f172a');
    sunroofGrad.addColorStop(1, '#020617');
    ctx.fillStyle = sunroofGrad;

    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(-2.2, -7.2, 5.2, 14.4, [1.5, 1.5, 0.5, 0.5]);
    } else {
      ctx.rect(-2.2, -7.2, 5.2, 14.4);
    }
    ctx.fill();

    // Sunroof Chrome Inner Bezel
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Sunroof Glass Sheen Reflection
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(2.2, -5.5);
    ctx.lineTo(-1.2, -2.5);
    ctx.stroke();

    // Main Floating Painted Roof Section (Behind Sunroof)
    ctx.fillStyle = champagneSilver;
    ctx.fillRect(-22.5, -7.8, 20.3, 15.6);

    // Subtle Roof Center Aerodynamic Recess Lines
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-3.0, -3.8); ctx.lineTo(-19.5, -3.8);
    ctx.moveTo(-3.0, 3.8); ctx.lineTo(-19.5, 3.8);
    ctx.stroke();

    // Center Gloss Black Shark-Fin Antenna
    ctx.fillStyle = glossBlack;
    ctx.beginPath();
    ctx.moveTo(-10.0, 0);
    ctx.lineTo(-13.5, -0.7);
    ctx.lineTo(-14.2, 0);
    ctx.lineTo(-13.5, 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.3;
    ctx.stroke();

    // 7. Full-Length Silver & Black Roof Rails
    [-1, 1].forEach(dir => {
      // Black mounting feet
      ctx.fillStyle = glossBlack;
      ctx.fillRect(-21.5, dir * 8.6 - 0.4, 23.5, 0.8);
      // Brushed silver rail top
      ctx.fillStyle = chromeTrim;
      ctx.fillRect(-21.0, dir * 8.6 - 0.25, 22.5, 0.5);
    });

    // 8. Flush Chrome Door Handles & Fuel Filler Door
    // 4 Flush Handles
    [-1, 1].forEach(dir => {
      // Front door handle
      ctx.fillStyle = glossBlack;
      ctx.fillRect(1.5, dir * 12.0 - 0.5, 3.5, 1.0);
      ctx.fillStyle = chromeTrim;
      ctx.fillRect(1.8, dir * 12.0 - 0.3, 2.9, 0.6);

      // Rear door handle
      ctx.fillStyle = glossBlack;
      ctx.fillRect(-7.5, dir * 12.0 - 0.5, 3.5, 1.0);
      ctx.fillStyle = chromeTrim;
      ctx.fillRect(-7.2, dir * 12.0 - 0.3, 2.9, 0.6);
    });

    // Fuel Filler Cap on Rear-Left Quarter
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.5)';
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(-18.5, -12.4, 4.2, 1.4, 0.5);
    } else {
      ctx.rect(-18.5, -12.4, 4.2, 1.4);
    }
    ctx.stroke();

    // 9. Aerodynamic Door-Mounted Side Mirrors
    [-1, 1].forEach(dir => {
      // Gloss black mounting stalk
      ctx.fillStyle = glossBlack;
      ctx.fillRect(6.0, dir * 12.2 - (dir > 0 ? 0 : 2.5), 1.6, 2.5);

      // Mirror Housing (Champagne silver shell with black base)
      ctx.fillStyle = champagneSilver;
      ctx.beginPath();
      ctx.ellipse(6.8, dir * 15.2, 2.6, 1.5, dir * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = glossBlack;
      ctx.lineWidth = 0.4;
      ctx.stroke();

      // Mirror Reflective Glass
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(6.0, dir * 15.2 - 0.6, 1.2, 1.2);
    });

    // 10. Rear Tinted Window, Integrated Roof Spoiler & Tailgate
    // Rear Tinted Window
    ctx.fillStyle = darkGlass;
    ctx.beginPath();
    ctx.moveTo(-22.5, -8.2);
    ctx.lineTo(-22.5, 8.2);
    ctx.lineTo(-26.0, 7.2);
    ctx.lineTo(-26.0, -7.2);
    ctx.closePath();
    ctx.fill();

    // Rear Window Wiper
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-24.5, 0);
    ctx.lineTo(-23.0, 4.5);
    ctx.stroke();

    // Integrated Rear Roof Spoiler (Overhanging the rear glass)
    ctx.fillStyle = champagneSilver;
    ctx.fillRect(-24.5, -8.4, 3.2, 16.8);
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(-24.5, -8.4, 3.2, 16.8);

    // Center High-Mount LED Third Brake Light (White/Red LED strip in spoiler)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-25.2, -2.5, 0.8, 5.0);
    ctx.fillStyle = chromeTrim;
    ctx.fillRect(-25.0, -2.0, 0.4, 4.0);

    // Rear Tailgate Chrome Accent Strip & Bumper Valance
    ctx.fillStyle = chromeTrim;
    ctx.fillRect(-27.2, -6.5, 0.5, 13.0);

    // Rear Lower Bumper Dark Diffuser / Valance
    ctx.fillStyle = glossBlack;
    ctx.fillRect(-27.6, -7.0, 0.8, 14.0);

    // Dual Integrated Chrome Exhaust Finishers
    [-1, 1].forEach(dir => {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-27.7, dir * 5.0 - 0.8, 0.6, 1.6);
      ctx.fillStyle = '#020617';
      ctx.fillRect(-27.8, dir * 5.0 - 0.6, 0.5, 1.2);
    });

    return true;
  }

  if (carStats.id === 'car-siestre') {
    // Rimac Nevera R Electric Hypercar ("Siestre S") - Precision Hypercar Masterpiece
    const sageGreen = baseColor || '#7fa192';
    const deepCarbon = '#090a0d';
    const glossCarbon = '#181920';
    const carbonAccent = '#272935';
    const electricCyan = '#22d3ee';
    const darkGlass = '#080d16';

    // 1. Extreme Electric Hypercar Low-Drag Silhouette (Sculpted fenders, narrow canopy, muscular haunches)
    ctx.fillStyle = sageGreen;
    ctx.beginPath();
    ctx.moveTo(30.0, 0); // Front nose apex
    ctx.lineTo(28.0, -4.5); // Nose front-left
    ctx.quadraticCurveTo(24.5, -10.5, 16.5, -13.2); // Front left flared wheel arch
    ctx.lineTo(10.0, -12.5); // Front fender back
    ctx.lineTo(4.0, -10.2); // Pinched door waistline
    ctx.lineTo(-4.0, -10.5); // Mid waist
    ctx.quadraticCurveTo(-11.5, -14.2, -18.5, -14.2); // Broad muscular rear left haunch
    ctx.lineTo(-25.0, -13.5); // Rear fender corner
    ctx.quadraticCurveTo(-28.5, -11.0, -29.0, -6.5); // Rear diffuser winglet
    ctx.lineTo(-29.0, 6.5); // Rear center Kamm line
    ctx.quadraticCurveTo(-28.5, 11.0, -25.0, 13.5);
    ctx.lineTo(-18.5, 14.2); // Broad muscular rear right haunch
    ctx.quadraticCurveTo(-11.5, 14.2, -4.0, 10.5);
    ctx.lineTo(4.0, 10.2);
    ctx.lineTo(10.0, 12.5);
    ctx.quadraticCurveTo(24.5, 10.5, 28.0, 4.5);
    ctx.closePath();
    ctx.fill();

    // 3D Body Surface Creases / Ambient Shading
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // 2. Multi-Plane Carbon Fiber Front Splitter & Corner Aero Flics
    ctx.fillStyle = deepCarbon;
    ctx.beginPath();
    ctx.moveTo(31.5, 0);
    ctx.lineTo(29.0, -8.5);
    ctx.lineTo(27.5, -12.5); // Left corner flic
    ctx.lineTo(25.5, -11.5);
    ctx.lineTo(27.5, -4.5);
    ctx.lineTo(29.8, 0);
    ctx.lineTo(27.5, 4.5);
    ctx.lineTo(25.5, 11.5);
    ctx.lineTo(27.5, 12.5); // Right corner flic
    ctx.lineTo(29.0, 8.5);
    ctx.closePath();
    ctx.fill();

    // Electric Cyan Accent Line on Front Splitter Edge
    ctx.strokeStyle = electricCyan;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(29.0, -8.5); ctx.lineTo(31.5, 0); ctx.lineTo(29.0, 8.5);
    ctx.stroke();

    // Front Center Radiator Air Mouth
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.moveTo(29.0, 0);
    ctx.lineTo(25.0, -4.5);
    ctx.lineTo(23.5, 0);
    ctx.lineTo(25.0, 4.5);
    ctx.closePath();
    ctx.fill();

    // 3. Iconic Rimac S-Duct Hood Extraction System
    // Dual Carbon Aero Channels on Hood
    ctx.fillStyle = glossCarbon;
    ctx.beginPath();
    ctx.moveTo(24.5, -4.2);
    ctx.lineTo(24.5, 4.2);
    ctx.lineTo(13.0, 3.5);
    ctx.lineTo(13.0, -3.5);
    ctx.closePath();
    ctx.fill();

    // Inner Extraction Vents / Aerodynamic Louvers
    ctx.fillStyle = '#020617';
    [-1, 1].forEach(dir => {
      ctx.fillRect(15.0, dir * 2.2 - 0.8, 6.5, 1.6);
      // Fine air deflection slats
      ctx.fillStyle = carbonAccent;
      [16.5, 18.0, 19.5].forEach(lx => {
        ctx.fillRect(lx, dir * 2.2 - 0.8, 0.4, 1.6);
      });
    });

    // Front Wheel-Arch Air Pressure Relief Louvers (4 slots on each fender)
    ctx.fillStyle = deepCarbon;
    [-1, 1].forEach(dir => {
      [17.0, 18.5, 20.0, 21.5].forEach(vx => {
        ctx.fillRect(vx, dir * 10.8 - 0.3, 1.0, 0.6);
      });
    });

    // 4. Cockpit Canopy & Windshield
    const wsGrad = ctx.createLinearGradient(12.0, 0, 3.0, 0);
    wsGrad.addColorStop(0, '#040812');
    wsGrad.addColorStop(0.5, '#0f172a');
    wsGrad.addColorStop(1, '#040812');
    ctx.fillStyle = wsGrad;

    ctx.beginPath();
    ctx.moveTo(11.5, 0); // Windshield apex
    ctx.quadraticCurveTo(11.0, -7.5, 3.5, -8.0);
    ctx.lineTo(-4.5, -7.5);
    ctx.quadraticCurveTo(-9.0, -5.5, -10.0, 0);
    ctx.quadraticCurveTo(-9.0, 5.5, -4.5, 7.5);
    ctx.lineTo(3.5, 8.0);
    ctx.quadraticCurveTo(11.0, 7.5, 11.5, 0);
    ctx.closePath();
    ctx.fill();

    // Windshield Specular Reflection Arc
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.arc(4.0, -2.0, 6.0, -Math.PI * 0.45, 0);
    ctx.stroke();

    // Exposed Carbon Roof Backbone & Central Wiper
    ctx.fillStyle = glossCarbon;
    ctx.beginPath();
    ctx.moveTo(6.0, -1.8);
    ctx.lineTo(-10.0, -2.4);
    ctx.lineTo(-10.0, 2.4);
    ctx.lineTo(6.0, 1.8);
    ctx.closePath();
    ctx.fill();

    // Single Aerodynamic Center Wiper
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(4.5, -0.4); ctx.lineTo(10.5, -1.2);
    ctx.stroke();

    // Interior Cockpit Highlights
    ctx.fillStyle = '#06b6d4'; // Cyan cockpit ambient glow / instrument screen
    ctx.fillRect(5.5, -4.2, 1.8, 2.2);

    // 5. Signature Rimac "Cravat" (Tie) Aerodynamic Flank Graphics
    // Croatian Tie Motif: sweeps from behind front wheel, along the sill, up into rear intake
    [-1, 1].forEach(dir => {
      // Carbon sill channel
      ctx.fillStyle = deepCarbon;
      ctx.beginPath();
      ctx.moveTo(11.0, dir * 11.8);
      ctx.lineTo(1.0, dir * 9.5);
      ctx.lineTo(-8.0, dir * 10.2);
      ctx.lineTo(-14.0, dir * 13.8); // Sweeping up into rear quarter
      ctx.lineTo(-12.0, dir * 14.5);
      ctx.lineTo(-6.0, dir * 11.8);
      ctx.lineTo(2.0, dir * 11.2);
      ctx.lineTo(10.0, dir * 13.0);
      ctx.closePath();
      ctx.fill();

      // Deep intake throat
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.moveTo(-1.0, dir * 9.8);
      ctx.lineTo(-7.5, dir * 10.8);
      ctx.lineTo(-7.5, dir * 8.5);
      ctx.closePath();
      ctx.fill();

      // Cyan accent trim on the Cravat aero edge
      ctx.strokeStyle = electricCyan;
      ctx.lineWidth = 0.4;
      ctx.beginPath();
      ctx.moveTo(8.0, dir * 12.2);
      ctx.lineTo(1.0, dir * 9.6);
      ctx.lineTo(-7.0, dir * 10.4);
      ctx.stroke();

      // Aero Side Skirt Winglet
      ctx.fillStyle = glossCarbon;
      ctx.fillRect(-2.5, dir * 12.2 - (dir > 0 ? 0 : 1.2), 5.0, 1.2);
    });

    // 6. Aerodynamic Door Mirrors on Carbon Stalks
    [-1, 1].forEach(dir => {
      // Carbon stalk
      ctx.fillStyle = deepCarbon;
      ctx.fillRect(7.0, dir * 11.5 - (dir > 0 ? 0 : 3.0), 1.2, 3.0);

      // Mirror Housing (Sage Green cap with carbon base)
      ctx.fillStyle = sageGreen;
      ctx.beginPath();
      ctx.ellipse(7.5, dir * 14.8, 2.5, 1.3, dir * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = deepCarbon;
      ctx.lineWidth = 0.4;
      ctx.stroke();

      // Reflective Glass
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(7.0, dir * 14.8 - 0.5, 1.0, 1.0);
    });

    // 7. Rear Powertrain / Battery Inverter Deck (Gloss Carbon)
    const deckGrad = ctx.createLinearGradient(-10.0, 0, -22.0, 0);
    deckGrad.addColorStop(0, '#090a0f');
    deckGrad.addColorStop(0.5, '#181922');
    deckGrad.addColorStop(1, '#090a0f');
    ctx.fillStyle = deckGrad;

    ctx.beginPath();
    ctx.moveTo(-10.0, -3.5);
    ctx.lineTo(-10.0, 3.5);
    ctx.lineTo(-22.0, 6.0);
    ctx.lineTo(-25.5, 4.5);
    ctx.lineTo(-25.5, -4.5);
    ctx.lineTo(-22.0, -6.0);
    ctx.closePath();
    ctx.fill();

    // Inverter Deck Longitudinal Cooling Slats
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 0.5;
    [-2.2, -1.1, 0, 1.1, 2.2].forEach(ly => {
      ctx.beginPath();
      ctx.moveTo(-11.5, ly); ctx.lineTo(-23.5, ly);
      ctx.stroke();
    });

    // Dual Rear NACA Cooling Ducts
    [-1, 1].forEach(dir => {
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.moveTo(-16.0, dir * 9.5);
      ctx.lineTo(-20.5, dir * 10.5);
      ctx.lineTo(-20.5, dir * 8.8);
      ctx.closePath();
      ctx.fill();
    });

    // 8. Nevera R High-Downforce Carbon Fiber Rear GT Wing
    // Main Wing Foil
    ctx.fillStyle = deepCarbon;
    ctx.beginPath();
    ctx.moveTo(-27.0, -14.5);
    ctx.lineTo(-30.5, -14.5);
    ctx.lineTo(-30.5, 14.5);
    ctx.lineTo(-27.0, 14.5);
    ctx.closePath();
    ctx.fill();

    // Cyan Trailing Edge Stripe on Wing
    ctx.fillStyle = electricCyan;
    ctx.fillRect(-30.5, -14.5, 0.5, 29.0);

    // Car name lettering on the rear wing (a fictional name: no real brand marks in a store release)
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 3.0px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(-28.6, 0);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('S I E S T R E', 0, 0);
    ctx.restore();

    // Carbon Wing Endplates with Aero Relief Cutouts
    [-1, 1].forEach(dir => {
      ctx.fillStyle = glossCarbon;
      ctx.fillRect(-31.5, dir * 15.0 - (dir > 0 ? 0 : 1.2), 5.5, 1.2);
      ctx.fillStyle = electricCyan;
      ctx.fillRect(-31.5, dir * 15.0 - (dir > 0 ? 0 : 0.4), 5.5, 0.4);
    });

    // Dual Swan-Neck Carbon Wing Mount Pylons
    [-4.5, 4.5].forEach(wy => {
      ctx.fillStyle = glossCarbon;
      ctx.fillRect(-28.0, wy - 0.6, 4.0, 1.2);
    });

    // Center Third LED Brake Light on Rear Deck
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-26.2, -1.8, 0.6, 3.6);

    // 9. Rear Multi-Tunnel Carbon Diffuser & Vertical Vortex Strakes
    ctx.fillStyle = deepCarbon;
    ctx.fillRect(-29.5, -8.5, 1.5, 17.0);

    // 4 Vertical Diffuser Strakes
    [-6.5, -2.5, 2.5, 6.5].forEach(dy => {
      ctx.fillStyle = glossCarbon;
      ctx.fillRect(-30.8, dy - 0.35, 1.8, 0.7);
      ctx.fillStyle = electricCyan;
      ctx.fillRect(-30.8, dy - 0.15, 0.4, 0.3); // Cyan strake tip
    });

    return true;
  }

  if (carStats.id === 'car-caneli-zx1') {
    // Chevrolet Corvette C8 Stingray ("Caneli ZX1") - Exact Match to corvette.png
    const sebringOrange = baseColor || '#ea580c';
    const glossBlack = '#090a0f';
    const darkCarbon = '#181920';
    const darkGlass = '#080d16';
    const interiorGrey = '#e2e8f0';

    // 1. Angular Mid-Engine American Supercar Silhouette (Pointed beak nose, sharp haunches)
    ctx.fillStyle = sebringOrange;
    ctx.beginPath();
    ctx.moveTo(31.0, 0); // Sharp nose apex
    ctx.lineTo(28.0, -4.5); // Nose left facet
    ctx.lineTo(26.0, -9.5); // Front bumper corner
    ctx.quadraticCurveTo(23.0, -13.5, 15.5, -13.5); // Front flared wheel arch
    ctx.lineTo(8.5, -12.5); // Fender back
    ctx.lineTo(3.5, -10.8); // Pinched door entry
    ctx.lineTo(-4.0, -11.2); // Door waistline
    ctx.quadraticCurveTo(-11.5, -14.2, -18.0, -14.2); // Broad muscular rear left haunch
    ctx.lineTo(-26.5, -13.5); // Rear corner
    ctx.quadraticCurveTo(-29.5, -11.5, -29.5, -6.5); // Rear bumper edge
    ctx.lineTo(-29.5, 6.5); // Rear center ducktail
    ctx.quadraticCurveTo(-29.5, 11.5, -26.5, 13.5);
    ctx.lineTo(-18.0, 14.2); // Broad muscular rear right haunch
    ctx.quadraticCurveTo(-11.5, 14.2, -4.0, 11.2);
    ctx.lineTo(3.5, 10.8);
    ctx.lineTo(8.5, 12.5);
    ctx.quadraticCurveTo(23.0, 13.5, 26.0, 9.5);
    ctx.lineTo(28.0, 4.5);
    ctx.closePath();
    ctx.fill();

    // 3D Creases & Surface Facets
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // 2. Pointed Nose Crossed-Flags Corvette Emblem & Dual Hood Creases
    // Crossed-flags badge at nose tip
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(29.8, 0);
    ctx.lineTo(28.2, -1.0);
    ctx.lineTo(28.5, 0);
    ctx.lineTo(28.2, 1.0);
    ctx.closePath();
    ctx.fill();

    // Dual Sharp Hood Power Creases (converging to nose)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(28.5, 0); ctx.lineTo(13.0, -5.5);
    ctx.moveTo(28.5, 0); ctx.lineTo(13.0, 5.5);
    ctx.stroke();

    // Front Bumper Splitter & Corner Intakes
    ctx.fillStyle = glossBlack;
    ctx.beginPath();
    ctx.moveTo(31.5, 0);
    ctx.lineTo(28.5, -6.0);
    ctx.lineTo(27.0, -9.5);
    ctx.lineTo(25.5, -8.0);
    ctx.lineTo(28.0, 0);
    ctx.lineTo(25.5, 8.0);
    ctx.lineTo(27.0, 9.5);
    ctx.lineTo(28.5, 6.0);
    ctx.closePath();
    ctx.fill();

    // 3. Gloss Black / Carbon Targa Roof & Windshield (Matches corvette.png)
    // Dark Tinted Windshield
    const wsGrad = ctx.createLinearGradient(12.5, 0, 4.0, 0);
    wsGrad.addColorStop(0, '#040711');
    wsGrad.addColorStop(0.5, '#0f172a');
    wsGrad.addColorStop(1, '#040711');
    ctx.fillStyle = wsGrad;

    ctx.beginPath();
    ctx.moveTo(12.0, -8.8);
    ctx.quadraticCurveTo(13.0, 0, 12.0, 8.8);
    ctx.lineTo(4.5, 8.2);
    ctx.lineTo(4.5, -8.2);
    ctx.closePath();
    ctx.fill();

    // Windshield Reflection Arc
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(11.0, -6.5); ctx.lineTo(5.5, -3.5);
    ctx.stroke();

    // Interior Cockpit - Light Grey GT2 Bucket Seats (Matches corvette.png)
    ctx.fillStyle = interiorGrey;
    ctx.beginPath();
    // Driver seat (right side)
    ctx.fillRect(5.5, -6.2, 5.0, 4.5);
    // Passenger seat (left side)
    ctx.fillRect(5.5, 1.7, 5.0, 4.5);
    // Center cockpit divider bridge ("The Great Wall" of buttons)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(5.0, -0.8, 6.0, 1.6);

    // Gloss Black A-Pillars & Targa Roof Panel
    ctx.fillStyle = glossBlack;
    // A-pillars
    ctx.beginPath();
    ctx.moveTo(12.0, -8.8); ctx.lineTo(4.5, -8.2); ctx.lineTo(4.5, -9.4); ctx.lineTo(12.0, -9.8); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(12.0, 8.8); ctx.lineTo(4.5, 8.2); ctx.lineTo(4.5, 9.4); ctx.lineTo(12.0, 9.8); ctx.closePath(); ctx.fill();

    // Gloss Black Targa Roof Center Section
    ctx.fillStyle = glossBlack;
    ctx.beginPath();
    ctx.moveTo(4.5, -8.2);
    ctx.lineTo(-4.0, -7.5);
    ctx.lineTo(-4.0, 7.5);
    ctx.lineTo(4.5, 8.2);
    ctx.closePath();
    ctx.fill();

    // Subtle Targa Panel Shutlines
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // 4. Iconic Corvette C8 Boomerang (Wishbone) Side Air Intake Blades
    [-1, 1].forEach(dir => {
      // Black sculpted air scoop throat
      ctx.fillStyle = glossBlack;
      ctx.beginPath();
      ctx.moveTo(3.0, dir * 10.6);
      ctx.lineTo(-7.5, dir * 11.8);
      ctx.lineTo(-7.5, dir * 9.2);
      ctx.closePath();
      ctx.fill();

      // Sharp Boomerang Accent Blade
      ctx.fillStyle = sebringOrange;
      ctx.beginPath();
      ctx.moveTo(3.5, dir * 10.8);
      ctx.lineTo(-8.5, dir * 12.5);
      ctx.lineTo(-7.0, dir * 13.2);
      ctx.lineTo(2.0, dir * 11.5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = glossBlack;
      ctx.lineWidth = 0.4;
      ctx.stroke();
    });

    // 5. Aerodynamic Door Mirrors on Stalks
    [-1, 1].forEach(dir => {
      // Black stalk
      ctx.fillStyle = glossBlack;
      ctx.fillRect(7.0, dir * 11.2 - (dir > 0 ? 0 : 2.5), 1.2, 2.5);

      // Orange mirror cap with black underside
      ctx.fillStyle = sebringOrange;
      ctx.beginPath();
      ctx.ellipse(7.5, dir * 14.5, 2.6, 1.3, dir * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = glossBlack;
      ctx.lineWidth = 0.4;
      ctx.stroke();

      // Mirror glass
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(7.0, dir * 14.5 - 0.5, 1.0, 1.0);
    });

    // 6. Mid-Engine Rear Deck & Flying Buttresses with V8 Glass Hatch
    // Orange Rear Flying Buttresses flanking the engine cover
    ctx.fillStyle = sebringOrange;
    // Left buttress
    ctx.beginPath();
    ctx.moveTo(-4.0, -7.5);
    ctx.lineTo(-13.0, -8.5);
    ctx.lineTo(-13.0, -4.8);
    ctx.lineTo(-4.0, -4.5);
    ctx.closePath();
    ctx.fill();
    // Right buttress
    ctx.beginPath();
    ctx.moveTo(-4.0, 7.5);
    ctx.lineTo(-13.0, 8.5);
    ctx.lineTo(-13.0, 4.8);
    ctx.lineTo(-4.0, 4.5);
    ctx.closePath();
    ctx.fill();

    // Central Engine Bay Glass Window (Showing 6.2L LT2 V8)
    const engGrad = ctx.createLinearGradient(-4.0, 0, -18.0, 0);
    engGrad.addColorStop(0, '#040711');
    engGrad.addColorStop(0.5, '#1e293b');
    engGrad.addColorStop(1, '#040711');
    ctx.fillStyle = engGrad;

    ctx.beginPath();
    ctx.moveTo(-4.5, -4.2);
    ctx.lineTo(-17.5, -4.2);
    ctx.lineTo(-17.5, 4.2);
    ctx.lineTo(-4.5, 4.2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.4;
    ctx.stroke();

    // Red V8 Engine Valve Covers / Intake Runner visible through glass
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-14.5, -2.8, 7.0, 1.2);
    ctx.fillRect(-14.5, 1.6, 7.0, 1.2);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-14.0, -1.2, 6.0, 2.4);

    // Black Cooling Heat Extraction Vents beside Engine Hatch (Matches corvette.png)
    ctx.fillStyle = glossBlack;
    ctx.fillRect(-13.5, -9.2, 9.5, 2.2);
    ctx.fillRect(-13.5, 7.0, 9.5, 2.2);
    // Vent louver slats
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.4;
    [-12.0, -10.0, -8.0, -6.0].forEach(vx => {
      ctx.beginPath();
      ctx.moveTo(vx, -9.2); ctx.lineTo(vx, -7.0);
      ctx.moveTo(vx, 7.0); ctx.lineTo(vx, 9.2);
      ctx.stroke();
    });

    // 7. Rear Decklid, Center Spine & Integrated Ducktail Spoiler
    ctx.fillStyle = sebringOrange;
    ctx.beginPath();
    ctx.moveTo(-17.5, -8.5);
    ctx.lineTo(-28.5, -6.5);
    ctx.lineTo(-28.5, 6.5);
    ctx.lineTo(-17.5, 8.5);
    ctx.closePath();
    ctx.fill();

    // Center Spine Stingray Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(-18.0, 0); ctx.lineTo(-28.5, 0);
    ctx.stroke();

    // Integrated Rear Ducktail Lip Spoiler (Black & Orange)
    ctx.fillStyle = glossBlack;
    ctx.fillRect(-28.8, -10.5, 1.0, 21.0);
    ctx.fillStyle = sebringOrange;
    ctx.fillRect(-28.5, -9.5, 0.6, 19.0);

    // Quad Square Exhaust Finishers & Rear Diffuser
    ctx.fillStyle = glossBlack;
    ctx.fillRect(-29.6, -7.5, 1.2, 15.0);

    // Quad Exhaust Tips (2 on each side)
    [-1, 1].forEach(dir => {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-29.8, dir * 5.5 - 1.2, 0.6, 1.1);
      ctx.fillRect(-29.8, dir * 5.5 + 0.1, 0.6, 1.1);
      ctx.fillStyle = '#020617';
      ctx.fillRect(-29.9, dir * 5.5 - 1.0, 0.5, 0.8);
      ctx.fillRect(-29.9, dir * 5.5 + 0.3, 0.5, 0.8);
    });

    return true;
  }

  if (carStats.id === 'car-br47') {
    // Modern Formula 1 Ground Effect Car ("BR-47") - Yellow Images Race Team (Exact Match to f1.png)
    const f1Yellow = baseColor || '#f5b700';
    const glossBlack = '#090a0f';
    const carbonGray = '#181920';
    const whiteDecal = '#ffffff';

    // 1. Aerodynamic Stepped Nose Cone (Matches f1.png)
    ctx.fillStyle = f1Yellow;
    ctx.beginPath();
    ctx.moveTo(35.0, 0); // Nose tip
    ctx.lineTo(34.0, -1.8);
    ctx.lineTo(24.0, -2.4);
    ctx.lineTo(13.0, -3.8); // Cockpit bulkhead
    ctx.lineTo(13.0, 3.8);
    ctx.lineTo(24.0, 2.4);
    ctx.lineTo(34.0, 1.8);
    ctx.closePath();
    ctx.fill();

    // Black Nose Tip Sensor Block
    ctx.fillStyle = glossBlack;
    ctx.fillRect(34.2, -1.2, 1.0, 2.4);

    // "YELLOW IMAGES RACE TEAM" Nose Livery Typography (Matches f1.png)
    ctx.save();
    ctx.fillStyle = '#0a0d14';
    ctx.font = 'bold 1.6px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(22.0, 0);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('YELLOW IMAGES RACE TEAM', 0, 0);
    ctx.restore();

    // Sponsor Roundel at Nose
    ctx.fillStyle = '#0a0d14';
    ctx.beginPath();
    ctx.arc(31.5, 0, 1.0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Multi-Element Swept Front Wing & Black Endplates
    // Main Yellow Swept Wing Flaps
    ctx.fillStyle = f1Yellow;
    // Left Wing Blade
    ctx.beginPath();
    ctx.moveTo(35.0, 0);
    ctx.lineTo(33.0, -14.5);
    ctx.lineTo(29.0, -15.5);
    ctx.lineTo(30.0, -2.4);
    ctx.closePath();
    ctx.fill();
    // Right Wing Blade
    ctx.beginPath();
    ctx.moveTo(35.0, 0);
    ctx.lineTo(33.0, 14.5);
    ctx.lineTo(29.0, 15.5);
    ctx.lineTo(30.0, 2.4);
    ctx.closePath();
    ctx.fill();

    // Wing Cascade Slat Shadows
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(33.5, -2.0); ctx.lineTo(31.5, -14.8);
    ctx.moveTo(32.0, -2.2); ctx.lineTo(30.0, -15.0);
    ctx.moveTo(33.5, 2.0); ctx.lineTo(31.5, 14.8);
    ctx.moveTo(32.0, 2.2); ctx.lineTo(30.0, 15.0);
    ctx.stroke();

    // "YELLOW IMAGES" on Front Wing Flaps (Matches f1.png)
    ctx.save();
    ctx.fillStyle = '#090a0f';
    ctx.font = 'bold 2.2px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Left wing text
    ctx.translate(31.5, -8.5);
    ctx.rotate(Math.PI / 2 - 0.2);
    ctx.fillText('YELLOW IMAGES', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#090a0f';
    ctx.font = 'bold 2.2px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Right wing text
    ctx.translate(31.5, 8.5);
    ctx.rotate(-Math.PI / 2 + 0.2);
    ctx.fillText('YELLOW IMAGES', 0, 0);
    ctx.restore();

    // Wing Carbon Endplates
    ctx.fillStyle = glossBlack;
    ctx.fillRect(28.0, -16.0, 6.0, 1.2);
    ctx.fillRect(28.0, 14.8, 6.0, 1.2);

    // 3. Exposed Open-Wheel Suspension Wishbones (Carbon Struts)
    ctx.strokeStyle = carbonGray;
    ctx.lineWidth = 1.0;
    // Front Left Suspension Wishbones
    ctx.beginPath();
    ctx.moveTo(22.0, -2.2); ctx.lineTo(19.0, -14.0);
    ctx.moveTo(14.0, -3.5); ctx.lineTo(19.0, -14.0);
    ctx.moveTo(17.5, -3.0); ctx.lineTo(19.0, -14.0); // Track rod
    ctx.stroke();
    // Front Right Suspension Wishbones
    ctx.beginPath();
    ctx.moveTo(22.0, 2.2); ctx.lineTo(19.0, 14.0);
    ctx.moveTo(14.0, 3.5); ctx.lineTo(19.0, 14.0);
    ctx.moveTo(17.5, 3.0); ctx.lineTo(19.0, 14.0);
    ctx.stroke();

    // 4. Exposed Racing Slick Tires (Front & Rear)
    ctx.fillStyle = '#0a0d14';
    // Front Tires
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(14.0, -18.2, 10.0, 6.5, 1.5);
      ctx.roundRect(14.0, 11.7, 10.0, 6.5, 1.5);
      // Rear Tires (Wider slick tires)
      ctx.roundRect(-21.0, -19.5, 12.0, 8.0, 2.0);
      ctx.roundRect(-21.0, 11.5, 12.0, 8.0, 2.0);
    } else {
      ctx.rect(14.0, -18.2, 10.0, 6.5);
      ctx.rect(14.0, 11.7, 10.0, 6.5);
      ctx.rect(-21.0, -19.5, 12.0, 8.0);
      ctx.rect(-21.0, 11.5, 12.0, 8.0);
    }
    ctx.fill();

    // Tire tread center shine / Pirelli texture
    ctx.strokeStyle = '#272935';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // 5. Wide Black Carbon Ground Effect Floor (Venturi tunnel edges)
    ctx.fillStyle = glossBlack;
    ctx.beginPath();
    ctx.moveTo(13.0, -5.0);
    ctx.lineTo(11.0, -12.5);
    ctx.lineTo(-18.5, -12.5);
    ctx.lineTo(-22.0, -5.0);
    ctx.lineTo(-22.0, 5.0);
    ctx.lineTo(-18.5, 12.5);
    ctx.lineTo(11.0, 12.5);
    ctx.lineTo(13.0, 5.0);
    ctx.closePath();
    ctx.fill();

    // Floor Edge Strakes / Louver Fences
    ctx.fillStyle = f1Yellow;
    ctx.fillRect(8.0, -12.8, 3.5, 0.8);
    ctx.fillRect(8.0, 12.0, 3.5, 0.8);

    // 6. Sculpted Yellow Downwash Sidepods & Radiator Air Inlets
    ctx.fillStyle = f1Yellow;
    // Left Sidepod
    ctx.beginPath();
    ctx.moveTo(11.0, -4.5);
    ctx.lineTo(10.0, -11.5);
    ctx.quadraticCurveTo(-2.0, -11.5, -10.0, -9.5);
    ctx.lineTo(-18.0, -4.5);
    ctx.lineTo(-18.0, -2.5);
    ctx.lineTo(11.0, -2.5);
    ctx.closePath();
    ctx.fill();

    // Right Sidepod
    ctx.beginPath();
    ctx.moveTo(11.0, 4.5);
    ctx.lineTo(10.0, 11.5);
    ctx.quadraticCurveTo(-2.0, 11.5, -10.0, 9.5);
    ctx.lineTo(-18.0, 4.5);
    ctx.lineTo(-18.0, 2.5);
    ctx.lineTo(11.0, 2.5);
    ctx.closePath();
    ctx.fill();

    // Black Radiator Intake Mouths
    ctx.fillStyle = '#020617';
    ctx.fillRect(8.5, -11.0, 2.5, 5.0);
    ctx.fillRect(8.5, 6.0, 2.5, 5.0);

    // "Yellow Images" Cursive / Script Graphics on Sidepods (Matches f1.png)
    ctx.save();
    ctx.fillStyle = whiteDecal;
    ctx.font = 'italic bold 3.2px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Left sidepod script
    ctx.translate(-2.0, -7.5);
    ctx.rotate(Math.PI / 2 - 0.1);
    ctx.fillText('Yellow Images', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = whiteDecal;
    ctx.font = 'italic bold 3.2px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Right sidepod script
    ctx.translate(-2.0, 7.5);
    ctx.rotate(-Math.PI / 2 + 0.1);
    ctx.fillText('Yellow Images', 0, 0);
    ctx.restore();

    // 7. Cockpit, Driver Helmet & Yellow Safety HALO Structure
    // Black Cockpit Opening
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.ellipse(3.0, 0, 6.0, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Driver Helmet (Dark Visor & Yellow/Black Cap)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(2.0, 0, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#38bdf8'; // Blue iridium visor
    ctx.fillRect(2.2, -1.0, 1.0, 2.0);

    // Yellow Safety HALO Hoop (Matches f1.png)
    ctx.strokeStyle = f1Yellow;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(8.0, 0); // Front center mounting pillar
    ctx.quadraticCurveTo(5.5, -3.8, 0.5, -3.6); // Left hoop arm
    ctx.moveTo(8.0, 0);
    ctx.quadraticCurveTo(5.5, 3.8, 0.5, 3.6); // Right hoop arm
    ctx.stroke();

    // Black Center HALO Pillar
    ctx.fillStyle = glossBlack;
    ctx.fillRect(7.2, -0.6, 1.8, 1.2);

    // Black T-Cam Camera Pod above Airbox
    ctx.fillStyle = glossBlack;
    ctx.fillRect(-2.5, -1.5, 1.2, 3.0);
    ctx.fillRect(-2.8, -0.6, 1.8, 1.2);

    // 8. Engine Cover & Central Dorsal Shark Fin (Matches f1.png)
    ctx.fillStyle = f1Yellow;
    ctx.beginPath();
    ctx.moveTo(-2.5, 0);
    ctx.lineTo(-24.5, -0.5);
    ctx.lineTo(-24.5, 0.5);
    ctx.closePath();
    ctx.fill();

    // Thin Black Dorsal Fin Ridge
    ctx.strokeStyle = glossBlack;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(-2.5, 0); ctx.lineTo(-24.5, 0);
    ctx.stroke();

    // 9. Rear Suspension Wishbones
    ctx.strokeStyle = carbonGray;
    ctx.lineWidth = 1.0;
    // Rear Left Wishbones
    ctx.beginPath();
    ctx.moveTo(-18.0, -2.5); ctx.lineTo(-15.0, -12.0);
    ctx.moveTo(-24.0, -2.0); ctx.lineTo(-15.0, -12.0);
    ctx.stroke();
    // Rear Right Wishbones
    ctx.beginPath();
    ctx.moveTo(-18.0, 2.5); ctx.lineTo(-15.0, 12.0);
    ctx.moveTo(-24.0, 2.0); ctx.lineTo(-15.0, 12.0);
    ctx.stroke();

    // 10. Yellow Rear Wing Assembly & Black Endplates with "YELLOW IMAGES"
    // Rear Wing Main Flap (Yellow)
    ctx.fillStyle = f1Yellow;
    ctx.fillRect(-27.0, -12.5, 4.5, 25.0);

    // Black Wing DRS Slot Gap
    ctx.fillStyle = glossBlack;
    ctx.fillRect(-25.2, -12.0, 0.6, 24.0);

    // "YELLOW IMAGES" Typography on Rear Wing (Matches f1.png)
    ctx.save();
    ctx.fillStyle = '#090a0f';
    ctx.font = 'bold 2.4px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(-24.5, 0);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('YELLOW IMAGES', 0, 0);
    ctx.restore();

    // Black Wing Endplates
    ctx.fillStyle = glossBlack;
    ctx.fillRect(-29.0, -13.5, 7.5, 1.2);
    ctx.fillRect(-29.0, 12.3, 7.5, 1.2);

    // Center Twin Swan-Neck Wing Mount Pylons
    ctx.fillStyle = carbonGray;
    ctx.fillRect(-26.0, -0.6, 4.0, 1.2);

    // Central FIA Rain & Safety Light
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-27.5, -0.8, 1.0, 1.6);

    return true;
  }
  return false;
}

export function drawDefaultCarBody(ctx: CanvasRenderingContext2D, baseColor: string) {
    ctx.beginPath();
    ctx.moveTo(22, -6);
    ctx.lineTo(22, 6);
    ctx.lineTo(10, 11);
    ctx.lineTo(-20, 11);
    ctx.lineTo(-22, 8);
    ctx.lineTo(-22, -8);
    ctx.lineTo(-20, -11);
    ctx.lineTo(10, -11);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.moveTo(5, -7);
    ctx.lineTo(5, 7);
    ctx.lineTo(-10, 6);
    ctx.lineTo(-10, -6);
    ctx.fill();
    ctx.fillStyle = changeColorBrightness(baseColor, -40);
    ctx.fillRect(-24, -10, 4, 20);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(12, -4, 6, 8);
}
