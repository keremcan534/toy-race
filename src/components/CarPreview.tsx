import { useEffect, useRef } from 'react';
import { Car } from '../store';
import { drawCar } from '../game/RenderCar';

interface CarPreviewProps {
  car: Car;
  className?: string;
  scale?: number;
  transparent?: boolean;
  canvasWidth?: number;
  canvasHeight?: number;
}

export const CarPreview = ({ 
  car, 
  className = '', 
  scale = 1.5,
  transparent = false,
  canvasWidth = 300,
  canvasHeight = 300
}: CarPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Center the car
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      
      // Draw car in 2D
      drawCar(
        ctx,
        car,
        x,
        y,
        0, // Facing right (0 radians)
        scale,
        false, // isNight
        0, // speed
        false, // isBraking
        0, // blinkTime
        undefined, // scenery
        false, // isNitro
        false // draw vectors directly: stays sharp at preview sizes
      );
    };

    render();
  }, [car, scale, canvasWidth, canvasHeight]);

  const baseStyle = transparent
    ? `w-full h-full flex items-center justify-center overflow-hidden ${className}`
    : `w-full h-full flex items-center justify-center bg-zinc-900/50 rounded-xl border border-white/10 overflow-hidden ${className}`;

  return (
    <div className={baseStyle}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};
