import React from 'react';

// Rating Star helper with specified color ranges:
// 0-20: Sarı
// 21-34: Turuncu
// 35-49: Kırmızı
// 50-70: Mavi
// 71-100: Parlak Mor
export const getScoreTier = (score: number) => {
  if (score <= 20) {
    return {
      starFill: '#FACC15',
      stroke: '#EAB308',
      textColor: 'text-zinc-950 font-black',
      glow: 'drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
    };
  }
  if (score <= 34) {
    return {
      starFill: '#FB923C',
      stroke: '#EA580C',
      textColor: 'text-zinc-950 font-black',
      glow: 'drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]'
    };
  }
  if (score <= 49) {
    return {
      starFill: '#EF4444',
      stroke: '#DC2626',
      textColor: 'text-white font-black',
      glow: 'drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]'
    };
  }
  if (score <= 70) {
    return {
      starFill: '#3B82F6',
      stroke: '#2563EB',
      textColor: 'text-white font-black',
      glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]'
    };
  }
  return {
    starFill: '#C084FC',
    stroke: '#D946EF',
    textColor: 'text-white font-black',
    glow: 'drop-shadow-[0_0_12px_rgba(217,70,239,0.9)]'
  };
};

export const CarRatingStar = ({ 
  car, 
  size = 'md' 
}: { 
  car: { maxSpeed: number; acceleration: number; handling: number }; 
  size?: 'sm' | 'md' 
}) => {
  const avgScore = Math.round((car.maxSpeed + car.acceleration + car.handling) / 3);
  const tier = getScoreTier(avgScore);

  if (size === 'sm') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${tier.glow}`} title={`Ortalama Puan: ${avgScore}`}>
        <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8">
          <path
            fill={tier.starFill}
            stroke={tier.stroke}
            strokeWidth="1.2"
            d="M12 2l2.9 6.26 6.9.99-5.1 4.77 1.35 6.84L12 17.5 5.95 20.86 7.3 14.02 2.2 9.25l6.9-.99L12 2z"
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center font-mono text-[9px] sm:text-[10px] ${tier.textColor} pt-0.5 select-none leading-none`}>
          {avgScore}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${tier.glow}`} title={`Ortalama Puan: ${avgScore}`}>
      <svg viewBox="0 0 24 24" className="w-9 h-9 sm:w-11 sm:h-11">
        <path
          fill={tier.starFill}
          stroke={tier.stroke}
          strokeWidth="1.2"
          d="M12 2l2.9 6.26 6.9.99-5.1 4.77 1.35 6.84L12 17.5 5.95 20.86 7.3 14.02 2.2 9.25l6.9-.99L12 2z"
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center font-mono text-[11px] sm:text-[13px] ${tier.textColor} pt-0.5 select-none leading-none drop-shadow-sm`}>
        {avgScore}
      </span>
    </div>
  );
};
