import React, { useEffect, useRef, useState } from 'react';

export type StatType = 'speed' | 'accel' | 'handling' | 'custom';

interface StatBarProps {
  label: string;
  value: number;
  statType?: 'speed' | 'accel' | 'handling';
  carId?: string;
  enableUpgradeEffect?: boolean;
  customColor?: string;
  customGlow?: string;
  triggerEffect?: boolean;
  isModalOpen?: boolean;
  className?: string;
  barHeight?: string;
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  statType,
  carId,
  enableUpgradeEffect = false,
  customColor,
  customGlow,
  triggerEffect,
  isModalOpen,
  className = '',
  barHeight = 'h-1 sm:h-1.5',
}) => {
  const [showIncrement, setShowIncrement] = useState(false);
  const [incrementValue, setIncrementValue] = useState(0);
  const prevValueRef = useRef(value);
  const prevCarIdRef = useRef(carId);

  useEffect(() => {
    // If upgrade effects are disabled for this bar (e.g. in Shop or RaceSelection), never show upgrade effect
    if (!enableUpgradeEffect) {
      prevCarIdRef.current = carId;
      prevValueRef.current = value;
      setShowIncrement(false);
      return;
    }

    // If car changed, this is car switching, NOT an upgrade!
    if (carId !== undefined && prevCarIdRef.current !== carId) {
      prevCarIdRef.current = carId;
      prevValueRef.current = value;
      setShowIncrement(false);
      return;
    }

    if (!isModalOpen) {
      if (value > prevValueRef.current) {
        setIncrementValue(value - prevValueRef.current);
        setShowIncrement(true);
        const timer = setTimeout(() => setShowIncrement(false), 2000);
        prevValueRef.current = value;
        return () => clearTimeout(timer);
      }
      prevValueRef.current = value;
    }
  }, [value, carId, isModalOpen, enableUpgradeEffect]);

  const isActive = (enableUpgradeEffect && showIncrement) || triggerEffect;

  // Colors as specified:
  // Hız (Speed) = Kırmızı (Red)
  // Hızlanma (Accel) = Mavi (Blue)
  // Yol Tutuşu (Handling) = Gri (Gray)
  let baseColor = '#ef4444';
  let glowColor = 'rgba(239, 68, 68, 0.85)';
  let textColor = 'text-red-400';

  if (statType === 'accel' || label.toLowerCase().includes('hızlan') || label.toLowerCase().includes('accel')) {
    baseColor = '#3b82f6'; // Blue
    glowColor = 'rgba(59, 130, 246, 0.85)';
    textColor = 'text-blue-400';
  } else if (statType === 'handling' || label.toLowerCase().includes('tutuş') || label.toLowerCase().includes('handling')) {
    baseColor = '#9ca3af'; // Gray
    glowColor = 'rgba(156, 163, 175, 0.85)';
    textColor = 'text-zinc-300';
  } else if (statType === 'speed' || label.toLowerCase().includes('hız') || label.toLowerCase().includes('speed')) {
    baseColor = '#ef4444'; // Red
    glowColor = 'rgba(239, 68, 68, 0.85)';
    textColor = 'text-red-400';
  } else if (customColor) {
    baseColor = customColor;
    glowColor = customGlow || customColor;
  }

  const activeColor = '#22c55e'; // Green when upgraded
  const activeGlow = 'rgba(34, 197, 94, 0.9)';
  const currentFillColor = isActive ? activeColor : baseColor;
  const currentGlow = isActive ? activeGlow : glowColor;

  return (
    <div className={`relative ${className}`}>
      <div className="flex justify-between text-[10px] sm:text-xs mb-0.5 sm:mb-1 text-zinc-400 font-bold uppercase tracking-wider">
        <span className={textColor}>{label}</span>
        <div className="flex items-center">
          {showIncrement && (
            <span className="text-green-400 font-bold mr-1.5 animate-bounce">
              +{incrementValue}
            </span>
          )}
          <span className={isActive ? "text-green-400 font-bold transition-colors duration-300" : `transition-colors duration-300 font-mono ${textColor}`}>
            {value}%
          </span>
        </div>
      </div>

      {/* Slanted outer container */}
      <div className={`${barHeight} w-full bg-zinc-950/90 rounded-sm overflow-hidden border border-white/15 skew-x-[-14deg] shadow-inner`}>
        <div
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            backgroundImage: `repeating-linear-gradient(
              -60deg,
              ${currentFillColor} 0px,
              ${currentFillColor} 4px,
              rgba(0, 0, 0, 0.55) 4px,
              rgba(0, 0, 0, 0.55) 6px
            )`,
            boxShadow: `0 0 10px ${currentGlow}, inset 0 0 4px rgba(255,255,255,0.4)`,
          }}
          className="h-full transition-all duration-500 rounded-xs"
        />
      </div>
    </div>
  );
};
