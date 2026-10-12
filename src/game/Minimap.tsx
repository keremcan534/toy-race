import { useMemo, useRef, type MutableRefObject } from 'react';
import { GameState } from './Physics2D';
import { useGameFrame } from './frameBus';

interface MinimapProps {
  stateRef: MutableRefObject<GameState>;
  trackPath: { x: number; y: number }[];
}

const SIZE = 96;
const PADDING = 12;

export const Minimap = ({ stateRef, trackPath }: MinimapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useRef(0);

  // The track outline never changes during a race: draw it once and copy it in every frame.
  const map = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    trackPath.forEach(pt => {
      if (pt.x < minX) minX = pt.x;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.y > maxY) maxY = pt.y;
    });
    const trackWidthX = maxX - minX || 1;
    const trackWidthY = maxY - minY || 1;
    // Calculate scale to fit canvas and center the track
    const scale = Math.min((SIZE - PADDING * 2) / trackWidthX, (SIZE - PADDING * 2) / trackWidthY);
    const offsetX = (SIZE - trackWidthX * scale) / 2 - minX * scale;
    const offsetY = (SIZE - trackWidthY * scale) / 2 - minY * scale;
    const mapX = (worldX: number) => worldX * scale + offsetX;
    const mapY = (worldY: number) => worldY * scale + offsetY;

    const background = document.createElement('canvas');
    background.width = SIZE;
    background.height = SIZE;
    const ctx = background.getContext('2d')!;

    // Background card
    ctx.fillStyle = 'rgba(9, 9, 11, 0.85)';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Draw Track Path Outline
    if (trackPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(mapX(trackPath[0].x), mapY(trackPath[0].y));
      for (let i = 1; i < trackPath.length; i++) {
        ctx.lineTo(mapX(trackPath[i].x), mapY(trackPath[i].y));
      }
      ctx.closePath();

      // Outer glow/road
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.stroke();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ef4444';
      ctx.stroke();

      // Draw Start/Finish line tick on minimap
      const fx = mapX(trackPath[0].x);
      const fy = mapY(trackPath[0].y);
      const fAngle = Math.atan2(trackPath[1].y - trackPath[0].y, trackPath[1].x - trackPath[0].x);
      const fPerpX = -Math.sin(fAngle) * 4;
      const fPerpY = Math.cos(fAngle) * 4;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fx - fPerpX, fy - fPerpY);
      ctx.lineTo(fx + fPerpX, fy + fPerpY);
      ctx.stroke();
    }

    return { background, mapX, mapY };
  }, [trackPath]);

  useGameFrame(() => {
    // Dots move a few pixels per second at this size; 30 updates a second is plenty.
    frame.current++;
    if (frame.current % 2 !== 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { background, mapX, mapY } = map;
    const gameState = stateRef.current;

    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.drawImage(background, 0, 0);

    // Draw AI Cars
    if (gameState.aiCars && gameState.aiCars.length > 0) {
      ctx.fillStyle = '#3b82f6'; // Blue for AI
      ctx.beginPath();
      gameState.aiCars.forEach(ai => {
        const x = mapX(ai.x);
        const y = mapY(ai.y);
        ctx.moveTo(x + 2.5, y);
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      });
      ctx.fill();
    }

    // Draw Ghost Car
    if (gameState.ghostCar) {
      ctx.fillStyle = '#a855f7'; // Purple for ghost
      ctx.beginPath();
      ctx.arc(mapX(gameState.ghostCar.x), mapY(gameState.ghostCar.y), 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Player Car
    if (gameState.car) {
      const px = mapX(gameState.car.x);
      const py = mapY(gameState.car.y);

      // Player glow ring
      ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
      ctx.beginPath();
      ctx.arc(px, py, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Player dot (Bright Yellow/White)
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  return (
    <div className="relative rounded-lg overflow-hidden border border-white/20 bg-black/70 shadow-2xl p-0.5">
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        className="w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] block rounded"
      />
    </div>
  );
};
