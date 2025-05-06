
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomVideoPlayerProps {
  videoUrl: string;
  className?: string;
  autoPlay?: boolean;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  videoUrl,
  className = '',
  autoPlay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Process video URL based on source
  const getProperVideoUrl = (url: string): string => {
    // Check if it's a Streamable URL
    if (url.includes('streamable.com')) {
      // Extract the streamable ID
      const streamableId = url.split('/').pop();
      if (streamableId) {
        // Return the direct video URL from streamable
        return `https://streamable.com/e/${streamableId}`;
      }
    }
    
    // If it's a Google Drive URL
    else if (url.includes('drive.google.com')) {
      // Extract the file ID
      const fileIdMatch = url.match(/id=([^&]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        // Direct download link format
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }
    
    return url;
  };

  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Event listeners
    const handleCanPlay = () => setLoading(false);
    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    const handleEnded = () => setIsPlaying(false);

    // Add event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // Set proper video source
    video.src = getProperVideoUrl(videoUrl);

    return () => {
      // Remove event listeners on cleanup
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoUrl]);

  // Handle auto play when component mounts
  useEffect(() => {
    if (autoPlay && videoRef.current && !loading) {
      togglePlay();
    }
  }, [autoPlay, loading]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    const video = videoRef.current;
    
    if (!progressBar || !video) return;
    
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    
    video.currentTime = clickPosition * video.duration;
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error("Error exiting fullscreen:", err);
      });
    } else {
      container.requestFullscreen().catch(err => {
        console.error("Error entering fullscreen:", err);
      });
    }
  };

  // Check if the URL is for Streamable to use iframe instead of video element
  const isStreamable = videoUrl.includes('streamable.com');

  return (
    <div 
      ref={containerRef}
      className={cn('relative w-full h-full rounded-lg overflow-hidden group', className)}
    >
      {isStreamable ? (
        <iframe 
          src={getProperVideoUrl(videoUrl)} 
          className="w-full h-full"
          allowFullScreen
          frameBorder="0"
          title="Streamable video player"
          allow="autoplay; fullscreen"
        />
      ) : (
        <>
          {/* Video */}
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted={isMuted}
            preload="metadata"
            controlsList="nodownload"
          />
          
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader className="w-10 h-10 text-primary animate-spin" />
            </div>
          )}
          
          {/* Controls overlay - appears on hover */}
          <div className="absolute inset-0 transition-opacity opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end">
            {/* Progress bar */}
            <div 
              ref={progressBarRef}
              className="w-full h-2 bg-gray-700/50 cursor-pointer"
              onClick={handleProgressBarClick}
            >
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Controls */}
            <div className="w-full flex items-center justify-between px-4 py-3">
              <button 
                onClick={togglePlay}
                className="rounded-full bg-primary/20 backdrop-blur-md p-2 hover:bg-primary/40 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying 
                  ? <Pause className="w-5 h-5 text-white" /> 
                  : <Play className="w-5 h-5 text-white ml-0.5" />
                }
              </button>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleMute}
                  className="rounded-full bg-primary/20 backdrop-blur-md p-2 hover:bg-primary/40 transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted 
                    ? <VolumeX className="w-5 h-5 text-white" /> 
                    : <Volume2 className="w-5 h-5 text-white" />
                  }
                </button>
                
                <button 
                  onClick={toggleFullscreen}
                  className="rounded-full bg-primary/20 backdrop-blur-md p-2 hover:bg-primary/40 transition-colors"
                  aria-label="Fullscreen"
                >
                  <Maximize className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Play overlay when video is paused */}
          {!isPlaying && !loading && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
              onClick={togglePlay}
            >
              <div className="rounded-full bg-primary/20 backdrop-blur-md p-4 hover:bg-primary/40 transition-transform hover:scale-110">
                <Play className="w-10 h-10 text-white ml-1" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomVideoPlayer;
