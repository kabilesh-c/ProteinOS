
import React from 'react';

interface GooeyBlobProps {
  className?: string;
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay?: number;
  opacity?: number;
  blur?: string;
  animate?: boolean;
}

const GooeyBlob: React.FC<GooeyBlobProps> = ({
  className = '',
  color = 'bg-primary',
  size = 300,
  top,
  left,
  right,
  bottom,
  delay = 0,
  opacity = 0.7,
  blur = 'xl',
  animate = true,
}) => {
  const animationStyle = {
    animationDelay: `${delay}s`,
    width: `${size}px`,
    height: `${size}px`,
    top,
    left,
    right,
    bottom,
    opacity,
  };

  // Add a subtle gradient effect to the blob
  const gradientStyle = {
    background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
    ...animationStyle,
  };

  return (
    <div
      className={`absolute rounded-full filter blur-${blur} ${animate ? 'animate-blob' : ''} ${className}`}
      style={{...gradientStyle, mixBlendMode: 'screen'}}
    ></div>
  );
};

export default GooeyBlob;
