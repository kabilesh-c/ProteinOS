
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

interface GooeyButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const GooeyButton: React.FC<GooeyButtonProps> = ({
  onClick,
  className,
  children,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add ripple effect
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = 'ripple';
    
    // Remove existing ripples
    const existingRipples = button.getElementsByClassName('ripple');
    while(existingRipples.length > 0) {
      existingRipples[0].remove();
    }
    
    button.appendChild(ripple);
    
    // Trigger the custom onClick handler
    if (onClick) onClick();
    
    // Remove ripple after animation completes
    setTimeout(() => {
      if (ripple.parentNode === button) {
        button.removeChild(ripple);
      }
    }, 600);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden px-8 py-4 rounded-xl',
        'bg-gradient-to-r from-blue-500 to-violet-600',
        'text-white font-bold font-poppins',
        'shadow-[0_0_15px_rgba(56,189,248,0.5)]',
        'border border-blue-400/20',
        'transform transition-all duration-300',
        'hover:shadow-[0_0_25px_rgba(124,58,237,0.7)]',
        'hover:scale-[1.02] active:scale-95',
        'flex items-center justify-center gap-2',
        'group animate-pulse-glow',
        className
      )}
    >
      <span className="flex items-center justify-center bg-white/10 rounded-full p-1.5 
        transform transition-all duration-300 group-hover:bg-white/20">
        <Play className="h-4 w-4" />
      </span>
      <span className="tracking-wide">{children}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-transparent to-violet-600/30 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
    </button>
  );
};

export default GooeyButton;
