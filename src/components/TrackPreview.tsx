import { useRef, useEffect, useState } from 'react';
import { TRACKS } from '../game/TrackData';

interface TrackPreviewProps {
  trackId: string;
  color: string;
  className?: string;
}

export const TrackPreview = ({ trackId, color, className }: TrackPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(true);

  useEffect(() => {
    setIsRendering(true);
    
    // Use a short timeout to allow the loading state to render and prevent blocking the main thread immediately
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setIsRendering(false);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsRendering(false);
        return;
      }

      const trackPath = TRACKS[trackId];
      if (!trackPath || trackPath.length === 0) {
        setIsRendering(false);
        return;
      }

      // Set canvas size
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      if (rect.width === 0 || rect.height === 0) {
        setIsRendering(false);
        return;
      }

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, rect.width, rect.height);

      // Find bounding box
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      trackPath.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });

      const trackWidth = maxX - minX;
      const trackHeight = maxY - minY;

      // Add padding
      const padding = 20;
      const availableWidth = rect.width - padding * 2;
      const availableHeight = rect.height - padding * 2;

      const scaleX = availableWidth / (trackWidth || 1);
      const scaleY = availableHeight / (trackHeight || 1);
      const scale = Math.min(scaleX, scaleY);

      const centerX = minX + trackWidth / 2;
      const centerY = minY + trackHeight / 2;

      ctx.save();
      ctx.translate(rect.width / 2, rect.height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-centerX, -centerY);

      // Draw track
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Outer glow/border
      ctx.lineWidth = 40;
      ctx.strokeStyle = color + '40'; // 25% opacity
      ctx.beginPath();
      ctx.moveTo(trackPath[0].x, trackPath[0].y);
      for (let i = 1; i < trackPath.length; i++) {
        ctx.lineTo(trackPath[i].x, trackPath[i].y);
      }
      ctx.closePath();
      ctx.stroke();

      // Inner track
      ctx.lineWidth = 20;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(trackPath[0].x, trackPath[0].y);
      for (let i = 1; i < trackPath.length; i++) {
        ctx.lineTo(trackPath[i].x, trackPath[i].y);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.restore();
      
      setIsRendering(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [trackId, color]);

  return (
    <div className={`relative ${className || ''}`}>
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 animate-pulse">
          <div className="w-8 h-8 border-2 border-zinc-700 rounded-full border-t-zinc-400 animate-spin" />
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className={`w-full h-full transition-opacity duration-300 ${isRendering ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};
