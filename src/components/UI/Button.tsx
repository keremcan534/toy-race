import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', onClick, ...props }, ref) => {
    const variants = {
      primary: 'bg-white text-black border-transparent active:bg-gray-300 active:opacity-80 active:scale-95',
      secondary: 'bg-gray-800 text-white border-transparent active:bg-gray-600 active:opacity-80 active:scale-95',
      danger: 'bg-red-600 text-white border-transparent active:bg-red-800 active:opacity-80 active:scale-95',
      outline: 'bg-transparent border-2 border-white text-white active:bg-white/20 active:opacity-80 active:scale-95',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg font-bold',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        onClick={onClick}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
