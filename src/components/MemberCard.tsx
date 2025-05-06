
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { Dna, Microscope, Sun, Sparkles } from 'lucide-react';

interface MemberCardProps {
  memberNumber: number;
  name: string;
  quote: string;
  className?: string;
}

// Map member numbers to icons - using only icons that are confirmed to exist
const memberIcons = [
  <Dna className="h-6 w-6 text-primary" />,
  <Sparkles className="h-6 w-6 text-secondary" />,
  <Dna className="h-6 w-6 text-primary" />,
  <Sparkles className="h-6 w-6 text-accent" />,
  <Sun className="h-6 w-6 text-yellow-400" />,
  <Microscope className="h-6 w-6 text-green-400" />,
];

const MemberCard: React.FC<MemberCardProps> = ({ 
  memberNumber, 
  name, 
  quote,
  className
}) => {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:scale-105",
        "border border-primary/20 bg-card/30 backdrop-blur-lg",
        "shadow-[0_0_15px_rgba(139,92,246,0.3)]",
        "hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]",
        "h-full flex flex-col justify-between",
        className
      )}
    >
      {/* Glow effect overlay */}
      <div className="absolute inset-0 -z-10 bg-glow-conic opacity-20 blur-xl" />
      
      <CardContent className="flex flex-col items-center justify-center p-6 h-full">
        <div className="flex items-center justify-center mb-4 mt-2">
          {memberIcons[memberNumber - 1] || <Microscope className="h-6 w-6 text-primary" />}
        </div>
        
        <h3 className="text-xl font-bold text-primary mb-1">
          Member {memberNumber}
        </h3>
        
        <h4 className="text-lg font-medium text-white mb-3">
          {name}
        </h4>
        
        <p className="text-center text-muted-foreground italic">
          "{quote}"
        </p>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
