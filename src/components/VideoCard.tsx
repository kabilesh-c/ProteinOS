
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

interface VideoCardProps {
  title: string;
  channelName: string;
  thumbnailUrl: string;
  videoUrl: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  title,
  channelName,
  thumbnailUrl,
  videoUrl,
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 bg-card/60 backdrop-blur-sm border-primary/20 h-full flex flex-col">
      <div className="relative group">
        <div className="aspect-video overflow-hidden bg-black/20">
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <a 
            href={videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-primary/90 hover:bg-primary text-white p-3 rounded-full transition-transform duration-300 hover:scale-110"
            aria-label={`Play ${title}`}
          >
            <Play className="w-8 h-8" />
          </a>
        </div>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-white line-clamp-2">{title}</h3>
        <p className="text-muted-foreground mt-1">{channelName}</p>
        <a 
          href={videoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-auto pt-3 text-secondary font-medium hover:text-secondary/80 transition-colors"
        >
          Watch Video
        </a>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
