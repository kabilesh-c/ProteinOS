
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionDividerProps {
  className?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ className }) => {
  return (
    <div className={cn('py-12 flex justify-center items-center', className)}>
      <div className="relative h-1 w-20 md:w-32">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary to-transparent animate-pulse-glow"></div>
      </div>
      <div className="mx-4 flex">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></div>
        <div className="w-2 h-2 rounded-full bg-secondary mx-1 animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="relative h-1 w-20 md:w-32">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary to-transparent animate-pulse-glow"></div>
      </div>
    </div>
  );
};

export default SectionDivider;
