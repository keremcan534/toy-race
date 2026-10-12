import React from 'react';

interface CarNameProps {
  name: string;
  className?: string;
  eventClassName?: string;
}

export const CarName: React.FC<CarNameProps> = ({ 
  name, 
  className = '', 
  eventClassName = 'text-purple-400 font-black drop-shadow-[0_0_8px_rgba(168,85,247,0.7)] ml-1' 
}) => {
  if (!name) return null;
  
  if (name.includes('(Event)')) {
    const parts = name.split('(Event)');
    return (
      <span className={className}>
        <span>{parts[0].trim()}</span>
        <span className={eventClassName}>(Event)</span>
        {parts[1] && <span>{parts[1]}</span>}
      </span>
    );
  }

  return <span className={className}>{name}</span>;
};
