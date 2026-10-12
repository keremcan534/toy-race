import { Car } from '../store';
import { changeColorBrightness } from './RenderUtils';

export function drawCarBody1(ctx: CanvasRenderingContext2D, carStats: Car, baseColor: string): boolean {
  if (carStats.id === 'car-prega') {
    // Pick-Up Truck (Enhanced to match image)
    
    // Main Body Shape with flared fenders
    ctx.beginPath();
    ctx.moveTo(28, -8); // Front nose
    ctx.lineTo(28, 8);
    ctx.lineTo(24, 13); // Front left fender flare
    ctx.lineTo(10, 13);
    ctx.lineTo(8, 12); // Middle pinch
    ctx.lineTo(-12, 12);
    ctx.lineTo(-14, 13); // Rear left fender flare
    ctx.lineTo(-26, 13);
    ctx.lineTo(-28, 10); // Rear end
    ctx.lineTo(-28, -10);
    ctx.lineTo(-26, -13);
    ctx.lineTo(-14, -13); // Rear right fender flare
    ctx.lineTo(-12, -12);
    ctx.lineTo(8, -12); // Middle pinch
    ctx.lineTo(10, -13);
    ctx.lineTo(24, -13); // Front right fender flare
    ctx.closePath();
    ctx.fill();

    // Hood Vents
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(16, -5, 4, 1);
    ctx.fillRect(16, 4, 4, 1);
    
    // Windshield
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.moveTo(12, -10);
    ctx.lineTo(14, 0);
    ctx.lineTo(12, 10);
    ctx.lineTo(8, 10);
    ctx.lineTo(10, 0);
    ctx.lineTo(8, -10);
    ctx.closePath();
    ctx.fill();
    
    // Wipers
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(10, -2); ctx.lineTo(13, -6);
    ctx.moveTo(10, 2); ctx.lineTo(13, 6);
    ctx.stroke();

    // Roof
    ctx.fillStyle = baseColor;
    ctx.fillRect(-4, -10, 14, 20);
    
    // Rear Window
    ctx.fillStyle = '#111';
    ctx.fillRect(-6, -9, 2, 18);

    // Truck Bed (Rear)
    ctx.fillStyle = changeColorBrightness(baseColor, -40);
    ctx.fillRect(-26, -10, 18, 20);
    
    // Bed Ridges
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    for (let i = -8; i <= 8; i += 2) {
      ctx.beginPath();
      ctx.moveTo(-24, i);
      ctx.lineTo(-10, i);
      ctx.stroke();
    }
    
    // Side Mirrors
    ctx.fillStyle = baseColor;
    ctx.fillRect(8, -15, 3, 5); // Right
    ctx.fillRect(8, 10, 3, 5);  // Left
    
    // Front Grille/Lights
    ctx.fillStyle = '#222';
    ctx.fillRect(26, -10, 2, 20);
    
    return true;
  } else if (carStats.id === 'car-pnisther-200gt') {
    // Porsche 911 (992) Carrera Coupe (Matching porsche.jpg)
    const porscheWhite = baseColor || '#f8fafc';
    const darkGlass = '#090d16';
    const blackTrim = '#0f172a';
    const chromeAccent = '#e2e8f0';

    // 1. Underbody Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 31, 13.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Sculpted 911 Silhouette (Wide Rear Haunches & Smooth Tapered Nose)
    ctx.fillStyle = porscheWhite;
    ctx.beginPath();
    ctx.moveTo(28.5, 0); // Front nose curve
    ctx.bezierCurveTo(28, -5.5, 25.5, -9.5, 20, -11.0); // Front right fender blister
    ctx.bezierCurveTo(10, -10.5, 2, -10.5, -6, -11.2); // Waist / door pinch
    ctx.bezierCurveTo(-14, -12.5, -21, -13.2, -26.5, -11.5); // Muscular rear right fender
    ctx.bezierCurveTo(-29.5, -9.5, -30.5, -5.5, -30.5, 0); // Rounded rear bumper
    ctx.bezierCurveTo(-30.5, 5.5, -29.5, 9.5, -26.5, 11.5); // Muscular rear left fender
    ctx.bezierCurveTo(-21, 13.2, -14, 12.5, -6, 11.2); // Waist / door pinch
    ctx.bezierCurveTo(2, 10.5, 10, 10.5, 20, 11.0); // Front left fender blister
    ctx.bezierCurveTo(25.5, 9.5, 28, 5.5, 28.5, 0);
    ctx.closePath();
    ctx.fill();

    // Subtle metallic gloss gradient highlight
    const bodyGrd = ctx.createLinearGradient(0, -13, 0, 13);
    bodyGrd.addColorStop(0, 'rgba(255,255,255,0.4)');
    bodyGrd.addColorStop(0.3, 'rgba(255,255,255,0.08)');
    bodyGrd.addColorStop(0.5, 'transparent');
    bodyGrd.addColorStop(0.8, 'rgba(0,0,0,0.12)');
    bodyGrd.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = bodyGrd;
    ctx.fill();

    // 3. Front Frunk Hood Creases & Porsche Crest
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    // Dual front hood creases
    ctx.moveTo(13, -4.5); ctx.lineTo(26, -3.2);
    ctx.moveTo(13, 4.5); ctx.lineTo(26, 3.2);
    ctx.stroke();

    // Gold/Red Porsche Crest on Hood Nose
    ctx.fillStyle = '#eab308';
    ctx.fillRect(26.2, -0.6, 1.2, 1.2);

    // Front Headlight Fender Domes
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath(); ctx.ellipse(22, -8.2, 3.8, 2.5, Math.PI / 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(22, 8.2, 3.8, 2.5, -Math.PI / 10, 0, Math.PI * 2); ctx.fill();

    // 4. Teardrop Greenhouse, Windshield & Panoramic Glass Sunroof
    ctx.fillStyle = darkGlass;
    ctx.beginPath();
    ctx.moveTo(13, -5.5);
    ctx.bezierCurveTo(15.5, -3, 15.5, 3, 13, 5.5); // Curved front windshield
    ctx.lineTo(2, 6.8); // Side window
    ctx.bezierCurveTo(-7, 6.5, -15, 5.5, -20.5, 4.0); // Rear quarter glass
    ctx.lineTo(-20.5, -4.0);
    ctx.bezierCurveTo(-15, -5.5, -7, -6.5, 2, -6.8);
    ctx.closePath();
    ctx.fill();

    // Windshield glass reflection
    const glassGrd = ctx.createLinearGradient(13, -5, -18, 5);
    glassGrd.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    glassGrd.addColorStop(0.3, 'rgba(56, 189, 248, 0.2)');
    glassGrd.addColorStop(0.6, 'transparent');
    ctx.fillStyle = glassGrd;
    ctx.fill();

    // Panoramic Glass Sunroof Section
    ctx.fillStyle = blackTrim;
    ctx.beginPath();
    ctx.roundRect(0.5, -4.8, 8.5, 9.6, 1);
    ctx.fill();
    ctx.strokeStyle = chromeAccent;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // 5. Signature 992 Vertical Engine Grille Slats (Back Deck Lid)
    ctx.fillStyle = blackTrim;
    ctx.beginPath();
    ctx.roundRect(-21, -4.6, 6.5, 9.2, 1);
    ctx.fill();

    // Fine vertical cooling slats
    ctx.fillStyle = '#1e293b';
    for (let gy = -3.8; gy <= 3.8; gy += 0.8) {
      ctx.fillRect(-20.2, gy, 5.0, 0.35);
    }

    // Dual vertical high-mount 3rd brake lights inside engine slats
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-17.5, -1.2, 2.5, 0.6);
    ctx.fillRect(-17.5, 0.6, 2.5, 0.6);

    // 6. Door Sills & Aerodynamic Side Mirrors
    ctx.fillStyle = blackTrim;
    ctx.fillRect(8.5, -10.8, 1.2, 2.2);
    ctx.fillRect(8.5, 8.6, 1.2, 2.2);
    ctx.fillStyle = porscheWhite;
    ctx.beginPath(); ctx.ellipse(8, -13.0, 2.2, 1.2, -Math.PI / 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(8, 13.0, 2.2, 1.2, Math.PI / 6, 0, Math.PI * 2); ctx.fill();

    // Mirror reflective glass
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(7.2, -13.5, 1.6, 0.6);
    ctx.fillRect(7.2, 12.9, 1.6, 0.6);

    // 7. Rear Integrated Aerodynamic Spoiler Lip & Full-Width Lightbar Housing
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-29.2, 0, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Rear Dual Oval Exhaust Tips
    ctx.fillStyle = '#64748b';
    ctx.beginPath(); ctx.arc(-30.0, -4.5, 1.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-30.0, 4.5, 1.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#020617';
    ctx.beginPath(); ctx.arc(-30.0, -4.5, 0.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-30.0, 4.5, 0.6, 0, Math.PI * 2); ctx.fill();

    return true;
  } else if (carStats.id === 'car-pnisther-entrela') {
    // Porsche 928 style (Front-engine, long hood, rounded rear)
    
    // Main Body
    ctx.beginPath();
    ctx.moveTo(30, -7); // Front nose
    ctx.bezierCurveTo(30, -11, 24, -13, 14, -13); // Front right fender
    ctx.lineTo(-10, -13); // Straight side
    ctx.bezierCurveTo(-22, -13, -30, -10, -30, 0); // Rear right corner (rounded)
    ctx.bezierCurveTo(-30, 10, -22, 13, -10, 13); // Rear left corner (rounded)
    ctx.lineTo(14, 13); // Left side
    ctx.bezierCurveTo(24, 13, 30, 11, 30, 7); // Front left fender
    ctx.closePath();
    ctx.fill();

    // Headlights (Round, prominent as in the image)
    ctx.fillStyle = '#475569';
    ctx.beginPath(); ctx.arc(26, -9, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(26, 9, 3.5, 0, Math.PI * 2); ctx.fill();
    // Inner lens detail
    ctx.fillStyle = '#64748b';
    ctx.beginPath(); ctx.arc(26, -9, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(26, 9, 1.5, 0, Math.PI * 2); ctx.fill();
    // Chrome ring
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.arc(26, -9, 3.5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(26, 9, 3.5, 0, Math.PI * 2); ctx.stroke();

    // Side Mirrors
    ctx.fillStyle = baseColor;
    ctx.fillRect(6, -15, 2, 4);
    ctx.fillRect(6, 11, 2, 4);
    ctx.beginPath(); ctx.ellipse(7, -15, 2.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(7, 15, 2.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();

    // Cabin (Windshield, roof, and large rear glass)
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.moveTo(10, -8); // Front windshield
    ctx.bezierCurveTo(14, -4, 14, 4, 10, 8);
    ctx.lineTo(-2, 8); // Side window
    ctx.bezierCurveTo(-14, 8, -24, 7, -28, 0); // Large rear glass curve
    ctx.bezierCurveTo(-24, -7, -14, -8, -2, -8);
    ctx.closePath();
    ctx.fill();

    // Roof (Body color part)
    ctx.fillStyle = baseColor;
    ctx.fillRect(-4, -7, 12, 14);
    
    // Sunroof (Black line/box)
    ctx.fillStyle = '#111';
    ctx.fillRect(-2, -5, 8, 10);

    // Rear Hatch Glass detail (The distinct 928 rear window)
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.moveTo(-6, -7);
    ctx.bezierCurveTo(-15, -7, -24, -6, -27, 0);
    ctx.bezierCurveTo(-24, 6, -15, 7, -6, 7);
    ctx.closePath();
    ctx.fill();

    // Bumper detail (Front)
    ctx.fillStyle = changeColorBrightness(baseColor, -10);
    ctx.fillRect(28, -6, 2, 12);

    return true;
  } else if (carStats.id === 'car-pnisther-cugan') {
    // Porsche Cayenne Coupe / Macan GTS Turbo GT ("Pnisther Cugan") - Matching images.jpg (Royal Amethyst Purple)
    const purpleBody = baseColor || '#581c87';
    const glossBlack = '#090a10';
    const darkGlass = '#090d16';
    const chromeAccent = '#e2e8f0';

    // 1. Underbody Shadow (SUV Wide Stance)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 32, 15.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Muscular Wide SUV Coupe Silhouette (Flared Wheel Arches & Tapered Nose)
    ctx.fillStyle = purpleBody;
    ctx.beginPath();
    ctx.moveTo(29.5, 0); // Front nose apex
    ctx.bezierCurveTo(29.0, -6.5, 26.5, -12.0, 21.0, -13.8); // Front right fender blister
    ctx.bezierCurveTo(12.0, -14.2, 5.0, -13.2, -5.0, -13.5); // Sculpted waist with lower door flare
    ctx.bezierCurveTo(-14.0, -14.8, -21.0, -15.2, -26.5, -13.8); // Muscular rear right quarter fender
    ctx.bezierCurveTo(-29.5, -11.5, -30.5, -6.5, -30.5, 0); // Rounded athletic rear bumper
    ctx.bezierCurveTo(-30.5, 6.5, -29.5, 11.5, -26.5, 13.8); // Muscular rear left quarter fender
    ctx.bezierCurveTo(-21.0, 15.2, -14.0, 14.8, -5.0, 13.5); // Waist
    ctx.bezierCurveTo(5.0, 13.2, 12.0, 14.2, 21.0, 13.8); // Front left fender blister
    ctx.bezierCurveTo(26.5, 12.0, 29.0, 6.5, 29.5, 0);
    ctx.closePath();
    ctx.fill();

    // High-gloss Metallic Amethyst Reflections along the sculpted flanks
    const purpleGrd = ctx.createLinearGradient(0, -15, 0, 15);
    purpleGrd.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
    purpleGrd.addColorStop(0.2, 'rgba(216, 180, 254, 0.25)'); // Light violet metallic sheen
    purpleGrd.addColorStop(0.5, 'transparent');
    purpleGrd.addColorStop(0.8, 'rgba(59, 7, 100, 0.35)'); // Deep dark plum undertone
    purpleGrd.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = purpleGrd;
    ctx.fill();

    // Gloss Black Wheel Arch Aero Flares & Lower Rocker Sills
    ctx.fillStyle = glossBlack;
    // Front right arch
    ctx.beginPath(); ctx.ellipse(17, -13.8, 7.5, 1.6, 0, 0, Math.PI * 2); ctx.fill();
    // Front left arch
    ctx.beginPath(); ctx.ellipse(17, 13.8, 7.5, 1.6, 0, 0, Math.PI * 2); ctx.fill();
    // Rear right arch
    ctx.beginPath(); ctx.ellipse(-20, -14.5, 8.0, 1.8, 0, 0, Math.PI * 2); ctx.fill();
    // Rear left arch
    ctx.beginPath(); ctx.ellipse(-20, 14.5, 8.0, 1.8, 0, 0, Math.PI * 2); ctx.fill();

    // 3. Front Fascia: Triple Porsche Air Intakes & Aerodynamic Front Splitter
    // Center Lower Trapezoidal Air Dam
    ctx.fillStyle = '#050508';
    ctx.beginPath();
    ctx.moveTo(29.0, -5.5);
    ctx.lineTo(29.0, 5.5);
    ctx.lineTo(26.0, 5.0);
    ctx.lineTo(26.0, -5.0);
    ctx.closePath();
    ctx.fill();

    // Dual Side Intercooler Intakes with Active Aero Slats
    [-1, 1].forEach(side => {
      ctx.fillStyle = '#0a0a10';
      ctx.beginPath();
      ctx.moveTo(27.5, side * 6.5);
      ctx.lineTo(26.0, side * 11.5);
      ctx.lineTo(23.5, side * 11.0);
      ctx.lineTo(24.5, side * 6.0);
      ctx.closePath();
      ctx.fill();

      // Horizontal cooling vanes
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(27.0, side * 8.0); ctx.lineTo(24.2, side * 8.0);
      ctx.moveTo(26.5, side * 10.0); ctx.lineTo(23.8, side * 10.0);
      ctx.stroke();
    });

    // Lower Front Gloss Black Chin Splitter
    ctx.fillStyle = glossBlack;
    ctx.fillRect(28.8, -4.5, 1.0, 9.0);

    // 4. Sculpted Hood Power Domes & Porsche Crest Badge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(13, -5.0); ctx.lineTo(27, -3.2); // Right power crease
    ctx.moveTo(13, 5.0); ctx.lineTo(27, 3.2);   // Left power crease
    ctx.stroke();

    // Center Gold/Red Porsche Crest at Hood Nose Tip
    ctx.fillStyle = '#eab308';
    ctx.fillRect(27.5, -0.6, 1.2, 1.2);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(27.8, -0.4, 0.6, 0.8);

    // Raised Fender Domes for Headlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath(); ctx.ellipse(22.5, -9.5, 4.2, 2.8, Math.PI / 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(22.5, 9.5, 4.2, 2.8, -Math.PI / 12, 0, Math.PI * 2); ctx.fill();

    // 5. Coupe-SUV Greenhouse, Windshield & Panoramic Glass Sunroof
    ctx.fillStyle = darkGlass;
    ctx.beginPath();
    ctx.moveTo(13.5, -6.8);
    ctx.bezierCurveTo(16.5, -3.0, 16.5, 3.0, 13.5, 6.8); // Curved aerodynamic windshield
    ctx.lineTo(2.0, 7.8); // Front side window
    ctx.bezierCurveTo(-8.0, 7.8, -17.0, 6.5, -23.0, 4.8); // Coupe tapering rear quarter window
    ctx.lineTo(-23.0, -4.8);
    ctx.bezierCurveTo(-17.0, -6.5, -8.0, -7.8, 2.0, -7.8);
    ctx.closePath();
    ctx.fill();

    // Windshield Glass Blue/White Reflection
    const windGrd = ctx.createLinearGradient(15, -6, 2, 6);
    windGrd.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    windGrd.addColorStop(0.3, 'rgba(56, 189, 248, 0.22)');
    windGrd.addColorStop(0.65, 'transparent');
    ctx.fillStyle = windGrd;
    ctx.beginPath();
    ctx.moveTo(13.2, -6.5);
    ctx.bezierCurveTo(16.0, -2.8, 16.0, 2.8, 13.2, 6.5);
    ctx.lineTo(6.5, 7.0);
    ctx.lineTo(6.5, -7.0);
    ctx.closePath();
    ctx.fill();

    // Dual Windshield Wipers
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(13.0, -1.0); ctx.lineTo(7.5, -4.8);
    ctx.moveTo(11.0, 3.5); ctx.lineTo(6.5, 0.5);
    ctx.stroke();

    // Interior View: Luxury Sport Cockpit Visible Through Glass
    // Bordeaux / Amethyst Sport Leather Bucket Seats
    ctx.fillStyle = '#4a044e'; // Deep velvet plum leather
    ctx.beginPath(); ctx.ellipse(4.5, -3.8, 3.8, 2.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(4.5, 3.8, 3.8, 2.4, 0, 0, Math.PI * 2); ctx.fill();
    // Headrests
    ctx.fillStyle = '#2e0238';
    ctx.beginPath(); ctx.ellipse(2.0, -3.8, 1.4, 1.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(2.0, 3.8, 1.4, 1.4, 0, 0, Math.PI * 2); ctx.fill();
    // Center Console & Touchscreen Display
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(1.5, -1.2, 5.0, 2.4);
    // Sport Steering Wheel
    ctx.strokeStyle = '#09090b'; ctx.lineWidth = 1.0;
    ctx.beginPath(); ctx.ellipse(8.5, -3.8, 1.8, 1.8, 0, 0, Math.PI * 2); ctx.stroke();

    // Tinted Panoramic Glass Roof with Twin Aero Channel Ribs
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-8.5, -6.2, 14.5, 12.4);
    const roofGrd = ctx.createLinearGradient(0, -6, 0, 6);
    roofGrd.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    roofGrd.addColorStop(0.5, 'transparent');
    roofGrd.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
    ctx.fillStyle = roofGrd;
    ctx.fillRect(-8.5, -6.2, 14.5, 12.4);

    // Gloss Black B and C Pillars
    ctx.fillStyle = glossBlack;
    ctx.fillRect(0.5, -7.8, 1.4, 15.6);
    ctx.fillRect(-9.5, -7.5, 1.6, 15.0);

    // Rear Coupe Hatch Glass with Heated Demister Lines
    ctx.fillStyle = '#05070a';
    ctx.beginPath();
    ctx.moveTo(-10.0, -6.0);
    ctx.lineTo(-21.5, -4.5);
    ctx.lineTo(-21.5, 4.5);
    ctx.lineTo(-10.0, 6.0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 0.5;
    for (let r = -12; r >= -19; r -= 2.2) {
      ctx.beginPath();
      ctx.moveTo(r, -4.8); ctx.lineTo(r, 4.8);
      ctx.stroke();
    }

    // 6. Aerodynamic Dual-Level Spoilers: Upper Roof Wing & Tailgate Lip Spoiler
    // Upper Roof Spoiler Overhanging Rear Window
    ctx.fillStyle = purpleBody;
    ctx.beginPath();
    ctx.moveTo(-10.0, -6.8);
    ctx.lineTo(-13.0, -7.2);
    ctx.lineTo(-13.5, 7.2);
    ctx.lineTo(-10.0, 6.8);
    ctx.closePath();
    ctx.fill();
    // Central high-mounted third brake light slot
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(-13.2, -2.5, 0.8, 5.0);

    // Active Lower Tailgate Lip Spoiler
    ctx.fillStyle = glossBlack;
    ctx.beginPath();
    ctx.moveTo(-24.5, -6.5);
    ctx.lineTo(-27.0, -5.5);
    ctx.lineTo(-27.0, 5.5);
    ctx.lineTo(-24.5, 6.5);
    ctx.closePath();
    ctx.fill();

    // 7. Full-Width 3D LED Rear Lightbar Recess (Signature Porsche Strip)
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(-29.8, -10.5, 1.0, 21.0);
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(-30.0, -10.0, 0.6, 20.0);
    // Chrome Porsche / Pnisther Script in Center
    ctx.fillStyle = chromeAccent;
    ctx.fillRect(-29.6, -2.0, 0.5, 4.0);

    // 8. Quad Titanium / Carbon Sport Exhaust Tips & Rear Aero Diffuser
    ctx.fillStyle = glossBlack;
    ctx.beginPath();
    ctx.moveTo(-29.0, -10.0);
    ctx.lineTo(-30.6, -7.5);
    ctx.lineTo(-30.6, 7.5);
    ctx.lineTo(-29.0, 10.0);
    ctx.closePath();
    ctx.fill();

    // Quad Oval Exhaust Outlets (Twin Tips on each side)
    [-1, 1].forEach(side => {
      // Outer Tip
      ctx.fillStyle = '#64748b'; // Polished titanium ring
      ctx.beginPath(); ctx.ellipse(-30.2, side * 7.8, 1.1, 1.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0a0a0f'; // Dark exhaust hole
      ctx.beginPath(); ctx.ellipse(-30.2, side * 7.8, 0.7, 1.0, 0, 0, Math.PI * 2); ctx.fill();

      // Inner Tip
      ctx.fillStyle = '#64748b';
      ctx.beginPath(); ctx.ellipse(-30.2, side * 5.2, 1.1, 1.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0a0a0f';
      ctx.beginPath(); ctx.ellipse(-30.2, side * 5.2, 0.7, 1.0, 0, 0, Math.PI * 2); ctx.fill();
    });

    // Vertical Diffuser Fins
    ctx.fillStyle = '#27272a';
    ctx.fillRect(-30.4, -2.5, 0.8, 0.6);
    ctx.fillRect(-30.4, 1.9, 0.8, 0.6);

    // 9. Aerodynamic Sport Side Mirrors with LED Turn Repeaters
    [-1, 1].forEach(side => {
      // Stalk
      ctx.fillStyle = glossBlack;
      ctx.fillRect(8.0, side * (side > 0 ? 13.8 : 15.2), 2.2, 1.6);
      // Mirror Housing
      ctx.fillStyle = purpleBody;
      ctx.beginPath();
      ctx.ellipse(9.2, side * 15.5, 3.2, 1.8, side * Math.PI / 12, 0, Math.PI * 2);
      ctx.fill();
      // Mirror Glass
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(7.8, side * 15.0 - 0.4, 2.2, 0.8);
      // Amber LED Indicator Strip
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(10.2, side * 15.4 - 0.3, 1.2, 0.6);
    });

    return true;
  } else if (carStats.id === 'car-gfenis') {
    ctx.fillRect(-22, -13, 44, 26);
    ctx.fillStyle = changeColorBrightness(baseColor, -20);
    ctx.fillRect(-10, -11, 28, 22);
    ctx.fillStyle = '#111';
    ctx.fillRect(-10, -12, 28, 2);
    ctx.fillRect(-10, 10, 28, 2);
    ctx.fillStyle = '#222';
    ctx.fillRect(12, -10, 3, 20);
    ctx.fillRect(-8, -10, 2, 20);
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(-22, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(-22, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.shadowBlur = 40;
    ctx.shadowColor = '#ffeb3b';
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(22, -9, 3, 0, Math.PI * 2);
    ctx.arc(22, 9, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#ff9800';
    ctx.fillRect(18, -13, 4, 3);
    ctx.fillRect(18, 10, 4, 3);
    return true;
  } else if (carStats.id === 'car-frestta-tines') {
    // Ferrari LaFerrari (Exact match to ferrari.png)
    const rossoCorsa = baseColor || '#dc2626';
    const neroCarbon = '#0a0a0a';
    const darkMesh = '#18181b';

    // 1. Underbody Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 32, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. F1-Inspired Aerodynamic Sculpted Body (Pontoon Fenders & Wasp Waist)
    ctx.fillStyle = rossoCorsa;
    ctx.beginPath();
    ctx.moveTo(32.5, 0); // Sharp F1 nose cone
    ctx.bezierCurveTo(31.5, -5.5, 26, -11.5, 17, -12.5); // Front right fender
    ctx.bezierCurveTo(8, -12.5, 4, -9.5, -2, -9.5); // Narrow wasp waist
    ctx.bezierCurveTo(-9, -9.5, -16, -14.5, -24.5, -14.5); // Muscular rear right pontoon fender
    ctx.bezierCurveTo(-28.5, -13.5, -30, -9.5, -30.5, -5.5); // Rear right corner
    ctx.lineTo(-30.5, 5.5); // Rear fascia
    ctx.bezierCurveTo(-30, 9.5, -28.5, 13.5, -24.5, 14.5); // Rear left pontoon fender
    ctx.bezierCurveTo(-16, 14.5, -9, 9.5, -2, 9.5); // Narrow wasp waist
    ctx.bezierCurveTo(4, 9.5, 8, 12.5, 17, 12.5); // Front left fender
    ctx.bezierCurveTo(26, 11.5, 31.5, 5.5, 32.5, 0);
    ctx.closePath();
    ctx.fill();

    // High-gloss metallic reflections
    const rossoGrd = ctx.createLinearGradient(0, -14, 0, 14);
    rossoGrd.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    rossoGrd.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
    rossoGrd.addColorStop(0.5, 'transparent');
    rossoGrd.addColorStop(0.8, 'rgba(0, 0, 0, 0.15)');
    rossoGrd.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
    ctx.fillStyle = rossoGrd;
    ctx.fill();

    // 3. F1 Front Nose Cone & Dual Hood Air Extractor Vents (as seen in ferrari.png)
    // Central nose spine
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(32.5, 0); ctx.lineTo(26, -1.2); ctx.lineTo(19, 0); ctx.lineTo(26, 1.2); ctx.closePath();
    ctx.fill();

    // Dual hood radiator outlet ducts
    ctx.fillStyle = neroCarbon;
    ctx.beginPath();
    ctx.moveTo(25, -6.0); ctx.lineTo(25, -2.2); ctx.lineTo(17.5, -1.8); ctx.lineTo(17.5, -6.5); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(25, 6.0); ctx.lineTo(25, 2.2); ctx.lineTo(17.5, 1.8); ctx.lineTo(17.5, 6.5); ctx.closePath();
    ctx.fill();

    // Radiator cooling fans inside ducts
    ctx.fillStyle = darkMesh;
    ctx.beginPath(); ctx.arc(21.2, -4.2, 1.8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(21.2, 4.2, 1.8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(19.4, -4.2); ctx.lineTo(23.0, -4.2);
    ctx.moveTo(19.4, 4.2); ctx.lineTo(23.0, 4.2);
    ctx.stroke();

    // Ferrari Scuderia Shields on Front Fenders
    ctx.fillStyle = '#eab308'; // Canary yellow shield
    ctx.beginPath();
    ctx.moveTo(14, -11.5); ctx.lineTo(16, -11.5); ctx.lineTo(15, -10.0); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(14, 11.5); ctx.lineTo(16, 11.5); ctx.lineTo(15, 10.0); ctx.closePath(); ctx.fill();

    // 4. Gloss Black Carbon Fiber Greenhouse & Windshield (Matching ferrari.png)
    ctx.fillStyle = neroCarbon;
    ctx.beginPath();
    ctx.moveTo(14, 0); // Front center of windshield
    ctx.bezierCurveTo(12, -7.5, 4, -8.0, -3, -7.2); // Right A-pillar and roof
    ctx.bezierCurveTo(-12, -6.8, -19, -5.2, -26.5, -3.2); // Engine cover taper
    ctx.lineTo(-26.5, 3.2);
    ctx.bezierCurveTo(-19, 5.2, -12, 6.8, -3, 7.2); // Left A-pillar and roof
    ctx.bezierCurveTo(4, 8.0, 12, 7.5, 14, 0);
    ctx.closePath();
    ctx.fill();

    // Windshield glass reflection
    const glassGrd = ctx.createLinearGradient(14, -7, -4, 7);
    glassGrd.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    glassGrd.addColorStop(0.25, 'rgba(56, 189, 248, 0.2)');
    glassGrd.addColorStop(0.55, 'transparent');
    ctx.fillStyle = glassGrd;
    ctx.beginPath();
    ctx.moveTo(13.5, 0); ctx.lineTo(5, -6.8); ctx.lineTo(-2, -6.5); ctx.lineTo(-2, 6.5); ctx.lineTo(5, 6.8); ctx.closePath();
    ctx.fill();

    // 5. Transparent Rear Glass Engine Bay (Ferrari 6.3L V12 HY-KERS as seen in ferrari.png)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-6, -4.5); ctx.lineTo(-24, -3.0); ctx.lineTo(-24, 3.0); ctx.lineTo(-6, 4.5); ctx.closePath();
    ctx.fill();

    // Carbon fiber engine surround frame
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 0.6; ctx.stroke();

    // Red Cylinder Head V12 Covers
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-18, -2.5, 9, 1.2);
    ctx.fillRect(-18, 1.3, 9, 1.2);

    // Central Silver Intake Plenum with Chrome Ferrari Prancing Horse
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath(); ctx.ellipse(-14, 0, 4.5, 1.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-14.5, -0.4, 1.2, 0.8);

    // HY-KERS Battery & Hybrid Heat Shield
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-22.5, -1.8, 3.2, 3.6);

    // 6. Signature Extended Carbon Fiber Side Mirror Stalks (as seen in ferrari.png)
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(8.5, -7.8); ctx.lineTo(8.0, -15.2);
    ctx.moveTo(8.5, 7.8); ctx.lineTo(8.0, 15.2);
    ctx.stroke();

    // Aerodynamic Rosso Corsa Mirror Caps
    ctx.fillStyle = rossoCorsa;
    ctx.beginPath(); ctx.ellipse(7.8, -15.5, 2.5, 1.3, -Math.PI / 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(7.8, 15.5, 2.5, 1.3, Math.PI / 10, 0, Math.PI * 2); ctx.fill();
    // Mirror glass
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(6.8, -15.8, 1.5, 0.6);
    ctx.fillRect(6.8, 15.2, 1.5, 0.6);

    // 7. Side Air Intake Channels
    ctx.fillStyle = neroCarbon;
    ctx.beginPath();
    ctx.moveTo(-1, -9.2); ctx.lineTo(-14, -13.5); ctx.lineTo(-8, -9.2); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-1, 9.2); ctx.lineTo(-14, 13.5); ctx.lineTo(-8, 9.2); ctx.closePath(); ctx.fill();

    // 8. Rear Carbon Diffuser & Quad Chrome Exhausts
    ctx.fillStyle = neroCarbon;
    ctx.fillRect(-30, -7, 1.5, 14);

    // Quad Polished Exhausts
    [-1, 1].forEach(side => {
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath(); ctx.arc(-29.8, side * 5.2 - 0.7, 0.85, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(-29.8, side * 5.2 + 0.7, 0.85, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#020617';
      ctx.beginPath(); ctx.arc(-29.8, side * 5.2 - 0.7, 0.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(-29.8, side * 5.2 + 0.7, 0.5, 0, Math.PI * 2); ctx.fill();
    });

    return true;
  } else if (carStats.id === 'car-regali-rx1') {
    // Dodge Viper style (Long nose, muscular, stripes)
    
    // Main Body
    ctx.beginPath();
    ctx.moveTo(30, -5); // Front nose
    ctx.bezierCurveTo(30, -10, 24, -12, 16, -11); // Front right fender
    ctx.bezierCurveTo(10, -10, 4, -9, -2, -10); // Right door
    ctx.bezierCurveTo(-10, -11, -18, -13, -24, -12); // Rear right fender
    ctx.bezierCurveTo(-28, -11, -30, -6, -30, 0); // Rear right corner
    ctx.bezierCurveTo(-30, 6, -28, 11, -24, 12); // Rear left corner
    ctx.bezierCurveTo(-18, 13, -10, 11, -2, 10); // Rear left fender
    ctx.bezierCurveTo(4, 9, 10, 10, 16, 11); // Left door
    ctx.bezierCurveTo(24, 12, 30, 10, 30, 5); // Front left fender
    ctx.closePath();
    ctx.fill();

    // Racing Stripes (Dual)
    const stripeColor = (baseColor.toLowerCase() === '#ffffff' || baseColor.toLowerCase() === 'white') ? '#0044cc' : '#ffffff';
    ctx.fillStyle = stripeColor;
    ctx.fillRect(-30, -4.5, 60, 3.5);
    ctx.fillRect(-30, 1, 60, 3.5);

    // Front Bumper Splitter
    ctx.fillStyle = '#111';
    ctx.fillRect(29, -6, 2, 12);

    // Hood Vents (3 on each side)
    ctx.fillStyle = '#111';
    for (let i = 0; i < 3; i++) {
      const vx = 20 - i * 4;
      // Right vents
      ctx.beginPath();
      ctx.moveTo(vx, -5);
      ctx.lineTo(vx - 3, -9);
      ctx.lineTo(vx - 1.5, -9);
      ctx.lineTo(vx + 1.5, -5);
      ctx.fill();
      // Left vents
      ctx.beginPath();
      ctx.moveTo(vx, 5);
      ctx.lineTo(vx - 3, 9);
      ctx.lineTo(vx - 1.5, 9);
      ctx.lineTo(vx + 1.5, 5);
      ctx.fill();
    }

    // Side Vents (behind front wheels)
    ctx.fillStyle = '#111';
    ctx.fillRect(10, -11.5, 2, 2);
    ctx.fillRect(10, 9.5, 2, 2);

    // Cabin (Windshield and roof)
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.moveTo(6, -6); // Front right windshield
    ctx.bezierCurveTo(10, -4, 10, 4, 6, 6); // Windshield curve
    ctx.lineTo(-4, 6); // Left side window
    ctx.bezierCurveTo(-10, 5, -14, 4, -16, 0); // Rear left window taper
    ctx.bezierCurveTo(-14, -4, -10, -5, -4, -6); // Rear right window taper
    ctx.closePath();
    ctx.fill();

    // Rear Window / Engine Cover (Louvered look)
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-22, -5, 6, 10);
    ctx.fillStyle = '#050505';
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(-21 + i, -4.5, 0.5, 9);
    }

    // Rear Wing (Large)
    ctx.fillStyle = baseColor;
    ctx.fillRect(-28, -11, 3, 22); // Main wing blade
    ctx.fillStyle = '#111';
    ctx.fillRect(-28, -11, 4, 1); // Right endplate
    ctx.fillRect(-28, 10, 4, 1); // Left endplate
    ctx.fillRect(-26, -6, 2, 2); // Right strut
    ctx.fillRect(-26, 4, 2, 2); // Left strut

    // Side Mirrors
    ctx.fillStyle = baseColor;
    ctx.beginPath(); ctx.arc(2, -11, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(2, 11, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#111';
    ctx.fillRect(1, -11, 2, 2);
    ctx.fillRect(1, 9, 2, 2);

    return true;
  } else if (carStats.id === 'car-pagnus-rr') {
    // Pagani Huayra BC Roadster #20 Livery (Exact match to pagnus.jpg)
    const silverBody = baseColor || '#cbd5e1';
    const darkCarbon = '#090d16';
    const redStripe = '#dc2626';
    const whiteStripe = '#ffffff';

    // 1. Underbody Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 33, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Sculpted Aerodynamic Silhouette (Teardrop Waist, Broad Shoulders)
    ctx.fillStyle = silverBody;
    ctx.beginPath();
    ctx.moveTo(33, 0); // Front nose apex
    ctx.bezierCurveTo(31.5, -7.5, 24, -13.0, 15, -13.2); // Front right fender
    ctx.bezierCurveTo(5, -12.5, -2, -10.5, -10, -11.5); // Narrow wasp waist
    ctx.bezierCurveTo(-20, -13.2, -28, -14.0, -32.5, -10.5); // Rear right muscular fender
    ctx.lineTo(-33.0, 0); // Rear diffuser center
    ctx.lineTo(-32.5, 10.5); // Rear left muscular fender
    ctx.bezierCurveTo(-28, 14.0, -20, 13.2, -10, 11.5); // Narrow wasp waist
    ctx.bezierCurveTo(-2, 10.5, 5, 12.5, 15, 13.2); // Front left fender
    ctx.bezierCurveTo(24, 13.0, 31.5, 7.5, 33, 0);
    ctx.closePath();
    ctx.fill();

    // High-gloss metallic reflections on silver flanks
    const silverGrd = ctx.createLinearGradient(0, -14, 0, 14);
    silverGrd.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    silverGrd.addColorStop(0.25, 'rgba(255, 255, 255, 0.08)');
    silverGrd.addColorStop(0.5, 'transparent');
    silverGrd.addColorStop(0.75, 'rgba(0, 0, 0, 0.15)');
    silverGrd.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
    ctx.fillStyle = silverGrd;
    ctx.fill();

    // 3. Central Exposed Carbon Fiber Spine (V-Shaped Nose to Tail as in pagnus.jpg)
    ctx.fillStyle = darkCarbon;
    ctx.beginPath();
    ctx.moveTo(33, 0);
    ctx.lineTo(24, -5.5);
    ctx.lineTo(14, -8.2);
    ctx.lineTo(-8, -8.2);
    ctx.lineTo(-24, -4.5);
    ctx.lineTo(-32.5, -3.0);
    ctx.lineTo(-32.5, 3.0);
    ctx.lineTo(-24, 4.5);
    ctx.lineTo(-8, 8.2);
    ctx.lineTo(14, 8.2);
    ctx.lineTo(24, 5.5);
    ctx.closePath();
    ctx.fill();

    // Carbon fiber weave texture lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let cx = -30; cx <= 30; cx += 2.5) {
      ctx.beginPath();
      ctx.moveTo(cx, -6); ctx.lineTo(cx + 3, 6);
      ctx.stroke();
    }

    // Front Hood Carbon Extractors with Red Edges
    ctx.fillStyle = darkCarbon;
    ctx.beginPath();
    ctx.ellipse(22, -8.2, 4.5, 2.8, -Math.PI / 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.ellipse(22, 8.2, 4.5, 2.8, Math.PI / 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = redStripe; ctx.lineWidth = 0.8;
    ctx.stroke();

    // 4. Iconic Red-White-Red Racing Stripe from Nose to Tail (as in pagnus.jpg)
    // White outer stripes
    ctx.fillStyle = whiteStripe;
    ctx.fillRect(-32.5, -2.2, 65, 4.4);
    // Red central stripe
    ctx.fillStyle = redStripe;
    ctx.fillRect(-32.5, -1.2, 65, 2.4);

    // 5. Number #20 on the Roof Carbon Panel (Matching pagnus.jpg)
    ctx.save();
    ctx.translate(1, 0);
    ctx.rotate(Math.PI / 2); // Orient number correctly for top-down view
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('20', 0, 0);
    ctx.restore();

    // 6. Cockpit & Luxury Saddle Brown Leather Seats (Open Top BC Roadster)
    // Dark cockpit surround
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.ellipse(4, 0, 10, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Saddle Brown Leather Bucket Seats
    ctx.fillStyle = '#92400e'; // Saddle Brown leather
    ctx.beginPath(); ctx.ellipse(2, -4.0, 4.2, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(2, 4.0, 4.2, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    // Central White Seat Accents
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0.5, -4.5, 3.0, 1.0);
    ctx.fillRect(0.5, 3.5, 3.0, 1.0);

    // Carbon dashboard & Titanium Steering Wheel
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8.5, -5.5, 1.5, 11);
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.0;
    ctx.beginPath(); ctx.arc(7.5, 3.8, 1.8, 0, Math.PI * 2); ctx.stroke();

    // 7. Mid-Mounted AMG 6.0L V12 Engine Plaque & Heat Shield
    ctx.fillStyle = '#cbd5e1'; // Silver/Gold plaque
    ctx.beginPath();
    ctx.roundRect(-15, -2.5, 6.5, 5.0, 1);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 0.5; ctx.stroke();
    // Central Pagani crest on engine
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(-11.8, 0, 1.0, 0, Math.PI * 2); ctx.fill();

    // 8. Signature Leaf-Shaped Carbon Mirrors on Extended Stalks
    ctx.strokeStyle = '#090d16'; ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(15, -9.5); ctx.lineTo(21, -16.5);
    ctx.moveTo(15, 9.5); ctx.lineTo(21, 16.5);
    ctx.stroke();

    // Mirror caps (Silver with red inner strip as in pagnus.jpg)
    ctx.fillStyle = silverBody;
    ctx.beginPath(); ctx.ellipse(21.5, -17.0, 3.2, 1.4, -Math.PI / 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(21.5, 17.0, 3.2, 1.4, Math.PI / 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = redStripe;
    ctx.fillRect(20.5, -17.5, 1.2, 0.8);
    ctx.fillRect(20.5, 16.7, 1.2, 0.8);

    // 9. Massive Full-Width Carbon Fiber Rear GT Wing with Red Endplates
    ctx.fillStyle = darkCarbon;
    ctx.fillRect(-32.0, -12.5, 2.5, 25.0);
    // Red wing endplates
    ctx.fillStyle = redStripe;
    ctx.fillRect(-33.0, -13.0, 3.8, 1.2);
    ctx.fillRect(-33.0, 11.8, 3.8, 1.2);
    // Red center stripe continuing through wing
    ctx.fillRect(-32.0, -1.2, 2.5, 2.4);

    // 10. Pagani Quad Titanium Exhaust (Central circular cluster)
    ctx.fillStyle = '#334155';
    ctx.beginPath(); ctx.arc(-32.5, 0, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 0.6; ctx.stroke();
    ctx.fillStyle = '#020617';
    ctx.beginPath(); ctx.arc(-33.2, -0.8, 0.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-33.2, 0.8, 0.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-31.8, -0.8, 0.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-31.8, 0.8, 0.6, 0, Math.PI * 2); ctx.fill();

    return true;
  } else if (carStats.id === 'car-gfenis-gt') {
    // 1954 Mercedes-Benz 300 SL Gullwing style
    
    // Main Body (Silver/Metallic)
    ctx.beginPath();
    ctx.moveTo(32, 0); // Front nose
    ctx.bezierCurveTo(32, -10, 24, -13, 14, -13); // Front right fender
    ctx.lineTo(-10, -13); // Side
    ctx.bezierCurveTo(-24, -13, -32, -10, -32, 0); // Rear curve
    ctx.bezierCurveTo(-32, 10, -24, 13, -10, 13); // Rear left curve
    ctx.lineTo(14, 13); // Left side
    ctx.bezierCurveTo(24, 13, 32, 10, 32, 0); // Front left fender
    ctx.closePath();
    ctx.fill();

    // Hood Ridges (The two prominent lines on the hood)
    ctx.strokeStyle = changeColorBrightness(baseColor, -15);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(28, -5);
    ctx.lineTo(12, -5);
    ctx.moveTo(28, 5);
    ctx.lineTo(12, 5);
    ctx.stroke();

    // Side Vents (Behind front wheels)
    ctx.fillStyle = '#111';
    ctx.fillRect(8, -13.5, 4, 1);
    ctx.fillRect(8, 12.5, 4, 1);
    ctx.fillStyle = '#333';
    ctx.fillRect(8.5, -13.5, 0.5, 1);
    ctx.fillRect(10.5, -13.5, 0.5, 1);
    ctx.fillRect(8.5, 12.5, 0.5, 1);
    ctx.fillRect(10.5, 12.5, 0.5, 1);

    // Chrome Bumpers
    ctx.fillStyle = '#e5e7eb'; // Chrome/Silver
    // Front
    ctx.fillRect(31, -8, 2, 16);
    // Rear
    ctx.beginPath();
    ctx.moveTo(-31, -10);
    ctx.quadraticCurveTo(-33, 0, -31, 10);
    ctx.lineTo(-33, 10);
    ctx.quadraticCurveTo(-35, 0, -33, -10);
    ctx.closePath();
    ctx.fill();

    // Cabin (Windshield and Roof)
    ctx.fillStyle = '#0a0a0a'; // Dark glass
    ctx.beginPath();
    ctx.moveTo(10, -8); // Front windshield
    ctx.bezierCurveTo(14, -4, 14, 4, 10, 8);
    ctx.lineTo(-18, 8); // Rear window
    ctx.bezierCurveTo(-22, 4, -22, -4, -18, -8);
    ctx.closePath();
    ctx.fill();

    // Roof (Silver part over the cabin)
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.moveTo(6, -7);
    ctx.lineTo(-14, -7);
    ctx.bezierCurveTo(-18, -6, -18, 6, -14, 7);
    ctx.lineTo(6, 7);
    ctx.bezierCurveTo(10, 6, 10, -6, 6, -7);
    ctx.closePath();
    ctx.fill();

    // Gullwing Door Lines (On the roof)
    ctx.strokeStyle = changeColorBrightness(baseColor, -20);
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-4, -7);
    ctx.lineTo(-4, 7);
    ctx.moveTo(2, -7);
    ctx.lineTo(2, 7);
    ctx.stroke();

    // Rear Deck details
    ctx.fillStyle = changeColorBrightness(baseColor, -10);
    ctx.beginPath();
    ctx.arc(-24, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // Side Mirrors (Small, chrome, on the fenders)
    ctx.fillStyle = '#f3f4f6';
    ctx.beginPath(); ctx.arc(18, -12, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 12, 1.5, 0, Math.PI * 2); ctx.fill();

    // Headlights (Round, prominent)
    ctx.fillStyle = '#64748b';
    ctx.beginPath(); ctx.arc(28, -9, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(28, 9, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.arc(28, -9, 2.5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(28, 9, 2.5, 0, Math.PI * 2); ctx.stroke();

    return true;
  }
  return false;
}
