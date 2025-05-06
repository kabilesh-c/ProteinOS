
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FacultyCardProps {
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  className?: string;
}

const FacultyCard: React.FC<FacultyCardProps> = ({
  name,
  title,
  bio,
  photoUrl,
  className
}) => {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        "border border-secondary/20 bg-card/30 backdrop-blur-lg",
        "shadow-[0_0_15px_rgba(56,189,248,0.3)]",
        "hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]",
        className
      )}
    >
      {/* Glow effect overlay */}
      <div className="absolute inset-0 -z-10 bg-glow-conic opacity-20 blur-xl" />
      
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Photo section - right on mobile, left on desktop */}
          <div className="flex-shrink-0 order-1 md:order-2 flex items-center justify-center mx-auto md:mx-0 w-full md:w-1/3 max-w-[280px]">
            <div className="relative group w-full aspect-square rounded-xl overflow-hidden">
              <img 
                src={photoUrl} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 border-2 border-secondary rounded-xl shadow-[0_0_10px_rgba(56,189,248,0.6)]"></div>
            </div>
          </div>
          
          {/* Text section - left on mobile, right on desktop */}
          <div className="order-2 md:order-1 md:w-2/3">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-6 w-6 text-secondary" />
              <h3 className="text-2xl font-bold text-white">{name}</h3>
            </div>
            <h4 className="text-lg font-medium text-secondary mb-4">{title}</h4>
            <p className="text-muted-foreground leading-relaxed">
              {bio}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacultyCard;
