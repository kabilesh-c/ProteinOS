
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Repeat, ArrowRight } from 'lucide-react';

interface TranscriptionAnimation2DProps {
  isActive?: boolean;
  className?: string;
}

const TranscriptionAnimation2D: React.FC<TranscriptionAnimation2DProps> = ({ 
  isActive = false,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const sceneDuration = 5000; // 5 seconds per scene
  
  // Colors based on the project's color palette
  const colors = {
    dna: {
      backbone1: '#8B5CF6', // Primary color
      backbone2: '#0EA5E9', // Secondary color
      baseA: '#E11D48', // Red
      baseT: '#22C55E', // Green
      baseG: '#F59E0B', // Orange/Amber
      baseC: '#3B82F6', // Blue
    },
    rnaPolymerase: '#10B981', // Accent green
    mrna: '#FFA500', // Orange
    nucleus: '#1E293B', // Dark blue-gray
    cytoplasm: '#0F172A', // Darker blue-gray
    label: '#FFFFFF', // White text
    labelBackground: 'rgba(139, 92, 246, 0.2)', // Semi-transparent primary
  };
  
  // Define the scenes of our animation
  const scenes = [
    {
      id: 'dna-nucleus',
      title: 'DNA – the genetic blueprint',
      description: 'Inside the nucleus of a cell lies DNA, the instruction manual for life.',
    },
    {
      id: 'initiation',
      title: 'Initiation – RNA Polymerase Binds',
      description: 'Transcription begins when RNA polymerase binds to a specific region called the promoter.',
    },
    {
      id: 'elongation',
      title: 'Elongation – mRNA is Synthesized',
      description: 'As it moves, RNA polymerase builds a single strand of mRNA using the DNA template.',
    },
    {
      id: 'termination',
      title: 'Termination – Transcription Ends',
      description: 'When it hits the stop signal, transcription ends. The mRNA is ready to leave the nucleus.',
    },
    {
      id: 'mrna-exit',
      title: 'mRNA Leaves the Nucleus',
      description: 'The mRNA exits the nucleus, heading to a ribosome to begin protein synthesis — the next step: translation.',
    },
  ];
  
  // Auto-advance scenes when playing
  useEffect(() => {
    if (!isActive || !isPlaying || !autoPlayEnabled) return;
    
    const timer = setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene(currentScene + 1);
      } else {
        // Loop back to first scene
        setCurrentScene(0);
      }
    }, sceneDuration);
    
    return () => clearTimeout(timer);
  }, [currentScene, isPlaying, isActive, autoPlayEnabled]);
  
  // Reset to first scene when component becomes active
  useEffect(() => {
    if (isActive) {
      setCurrentScene(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isActive]);
  
  const handlePrevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
    }
  };
  
  const handleNextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
    }
  };
  
  const handleRestart = () => {
    setCurrentScene(0);
    setIsPlaying(true);
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Render different scene content based on current scene
  const renderSceneContent = () => {
    switch (currentScene) {
      case 0:
        return <DNAInNucleusScene colors={colors} />;
      case 1:
        return <InitiationScene colors={colors} />;
      case 2:
        return <ElongationScene colors={colors} />;
      case 3:
        return <TerminationScene colors={colors} />;
      case 4:
        return <MRNAExitScene colors={colors} />;
      default:
        return null;
    }
  };
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Animation canvas */}
      <div className="relative w-full h-full bg-gradient-to-b from-popover to-background rounded-lg overflow-hidden">
        {/* Scene content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentScene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            {renderSceneContent()}
          </motion.div>
        </AnimatePresence>
        
        {/* Scene title and description */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
          <motion.div 
            key={`title-${currentScene}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-1 flex items-center"
          >
            <div className="px-3 py-1 rounded-full bg-primary/20 text-white text-sm font-medium mr-2">
              {currentScene + 1}/{scenes.length}
            </div>
            <h3 className="text-lg text-white font-bold">{scenes[currentScene].title}</h3>
          </motion.div>
          <motion.p 
            key={`desc-${currentScene}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 text-sm md:text-base"
          >
            {scenes[currentScene].description}
          </motion.p>
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-0 right-0 p-4 flex items-center space-x-2 z-10">
        <button 
          onClick={handlePrevScene} 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/30 text-white hover:bg-primary/50 transition-colors"
          disabled={currentScene === 0}
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
        
        <button 
          onClick={togglePlay} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/50 text-white hover:bg-primary/70 transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        
        <button 
          onClick={handleNextScene} 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/30 text-white hover:bg-primary/50 transition-colors"
          disabled={currentScene === scenes.length - 1}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        
        <button 
          onClick={handleRestart} 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/30 text-white hover:bg-primary/50 transition-colors"
        >
          <Repeat className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted/20">
        {isPlaying && (
          <motion.div 
            className="h-full bg-primary/70"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: sceneDuration / 1000, ease: 'linear', repeat: 0 }}
            key={`progress-${currentScene}`}
          />
        )}
      </div>
    </div>
  );
};

// Scene 1: DNA in the Nucleus
const DNAInNucleusScene: React.FC<{ colors: any }> = ({ colors }) => {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Nucleus background */}
      <div className="absolute inset-20 rounded-full bg-background border-4 border-primary/20 opacity-70" />
      
      {/* DNA double helix */}
      <motion.div 
        className="relative h-64 w-32"
        animate={{ rotateY: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {/* DNA strands */}
        {[...Array(10)].map((_, i) => (
          <React.Fragment key={`strand-${i}`}>
            {/* Left strand */}
            <motion.div 
              className="absolute w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: colors.dna.backbone1,
                left: '25%',
                top: `${i * 10}%`,
              }}
              animate={{ 
                left: ['25%', '75%', '25%'],
                top: [`${i * 10}%`, `${i * 10 + 5}%`, `${i * 10 + 10}%`],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut" 
              }}
            />
            
            {/* Right strand */}
            <motion.div 
              className="absolute w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: colors.dna.backbone2,
                left: '75%',
                top: `${i * 10}%`,
              }}
              animate={{ 
                left: ['75%', '25%', '75%'],
                top: [`${i * 10}%`, `${i * 10 + 5}%`, `${i * 10 + 10}%`],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut" 
              }}
            />
            
            {/* Base pairs */}
            <motion.div 
              className="absolute h-0.5 bg-white/70"
              style={{ 
                top: `${i * 10 + 1}%`,
                left: '25%',
                width: '50%'
              }}
              animate={{ 
                rotate: ['0deg', '180deg', '360deg'],
                top: [`${i * 10 + 1}%`, `${i * 10 + 6}%`, `${i * 10 + 11}%`],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut" 
              }}
            />
          </React.Fragment>
        ))}
      </motion.div>
      
      {/* Labels */}
      <motion.div 
        className="absolute top-5 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-primary/20 rounded-full text-white text-sm font-medium"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Nucleus
      </motion.div>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-primary/20 rounded-full text-white text-sm font-medium"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        DNA Double Helix
      </motion.div>
    </div>
  );
};

// Scene 2: Initiation – RNA Polymerase Binds
const InitiationScene: React.FC<{ colors: any }> = ({ colors }) => {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* DNA strand horizontal */}
      <div className="absolute top-1/2 left-6 right-6 h-8 flex items-center">
        {/* DNA backbone */}
        <div className="absolute top-1/3 h-2 w-full bg-gradient-to-r from-purple-500/80 to-blue-500/80 rounded-full" />
        <div className="absolute bottom-1/3 h-2 w-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 rounded-full" />
        
        {/* DNA base pairs */}
        {[...Array(14)].map((_, i) => (
          <div 
            key={`base-${i}`} 
            className="absolute w-1 h-6 bg-white/50"
            style={{ left: `${i * 7 + 3}%` }}
          />
        ))}
        
        {/* Promoter region */}
        <motion.div 
          className="absolute top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-md border-2 border-yellow-400/70 bg-yellow-400/10"
          style={{ left: '20%' }}
          animate={{ 
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 0 rgba(250, 204, 21, 0.4)',
              '0 0 15px rgba(250, 204, 21, 0.6)',
              '0 0 0 rgba(250, 204, 21, 0.4)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-xs text-yellow-400 font-bold">
            TATA
          </div>
        </motion.div>
        
        {/* RNA Polymerase */}
        <motion.div 
          className="absolute top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-2xl bg-green-500/80"
          style={{ boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}
          initial={{ left: '0%', opacity: 0 }}
          animate={{ left: '18%', opacity: 1 }}
          transition={{ duration: 3, type: "spring" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-xs font-bold">RNA Polymerase</div>
          </div>
        </motion.div>
      </div>
      
      {/* Label */}
      <motion.div 
        className="absolute top-8 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-primary/20 rounded-full text-white text-sm font-medium"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Promoter Region
      </motion.div>
    </div>
  );
};

// Scene 3: Elongation – mRNA is Synthesized
const ElongationScene: React.FC<{ colors: any }> = ({ colors }) => {
  const basePairs = [
    { dna: 'A', rna: 'U', dnaColor: colors.dna.baseA, rnaColor: colors.dna.baseT },
    { dna: 'T', rna: 'A', dnaColor: colors.dna.baseT, rnaColor: colors.dna.baseA },
    { dna: 'G', rna: 'C', dnaColor: colors.dna.baseG, rnaColor: colors.dna.baseC },
    { dna: 'C', rna: 'G', dnaColor: colors.dna.baseC, rnaColor: colors.dna.baseG },
    { dna: 'A', rna: 'U', dnaColor: colors.dna.baseA, rnaColor: colors.dna.baseT },
    { dna: 'T', rna: 'A', dnaColor: colors.dna.baseT, rnaColor: colors.dna.baseA },
    { dna: 'G', rna: 'C', dnaColor: colors.dna.baseG, rnaColor: colors.dna.baseC },
    { dna: 'C', rna: 'G', dnaColor: colors.dna.baseC, rnaColor: colors.dna.baseG },
  ];
  
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* DNA strands */}
      <div className="absolute left-0 right-0 h-24 top-1/3">
        {/* DNA template strand (top) */}
        <div className="absolute h-4 left-0 right-0 top-0 bg-primary/70 rounded-full" />
        
        {/* DNA coding strand (bottom) */}
        <div className="absolute h-4 left-0 right-0 bottom-0 bg-secondary/70 rounded-full" />
        
        {/* RNA polymerase */}
        <motion.div 
          className="absolute w-20 h-20 bg-green-500/80 rounded-2xl z-20 flex items-center justify-center transform -translate-y-1/2"
          style={{ boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}
          initial={{ left: '20%' }}
          animate={{ left: '70%' }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "loop" }}
        >
          <div className="text-white text-xs font-bold text-center">
            RNA<br/>Polymerase
          </div>
        </motion.div>
        
        {/* mRNA strand growing behind the polymerase */}
        <div className="absolute h-16 left-0 right-0 top-1/2 transform -translate-y-1/2">
          {basePairs.map((pair, i) => (
            <React.Fragment key={`pair-${i}`}>
              {/* DNA base */}
              <motion.div 
                className="absolute top-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs transform -translate-y-full"
                style={{ 
                  backgroundColor: pair.dnaColor,
                  left: `${20 + i * 7}%`,
                  opacity: 0
                }}
                animate={{ 
                  opacity: 1,
                  y: ['-50%', '-100%']
                }}
                transition={{ 
                  duration: 2, 
                  delay: i * 0.5, 
                }}
              >
                {pair.dna}
              </motion.div>
              
              {/* RNA base (complementary) */}
              <motion.div 
                className="absolute bottom-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs transform translate-y-full"
                style={{ 
                  backgroundColor: pair.rnaColor,
                  left: `${20 + i * 7}%`,
                  opacity: 0
                }}
                animate={{ 
                  opacity: 1,
                  y: ['50%', '100%']
                }}
                transition={{ 
                  duration: 2, 
                  delay: i * 0.5 + 0.2, 
                }}
              >
                {pair.rna}
              </motion.div>
              
              {/* Base pair connection - removed during unwinding */}
              <motion.div 
                className="absolute top-1/2 w-1 h-8 bg-white/50 transform -translate-y-1/2"
                style={{ 
                  left: `${20 + i * 7 + 2.5}%`,
                }}
                animate={{ 
                  opacity: [1, 0],
                  height: ['8rem', '0rem']
                }}
                transition={{ 
                  duration: 1, 
                  delay: i * 0.5, 
                }}
              />
              
              {/* mRNA strand forming */}
              <motion.div 
                className="absolute w-6 h-6 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: colors.mrna,
                  top: '75%',
                  left: `${20 + i * 7}%`,
                  opacity: 0
                }}
                animate={{ 
                  opacity: 1,
                  left: [`${20 + i * 7}%`, `${30 + i * 6}%`],
                }}
                transition={{ 
                  duration: 2, 
                  delay: i * 0.5 + 0.5, 
                }}
              >
                <span className="text-white text-xs font-bold">{pair.rna}</span>
              </motion.div>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Labels */}
      <motion.div 
        className="absolute top-8 left-1/4 px-3 py-1 bg-primary/20 rounded-full text-white text-xs font-medium"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Template DNA
      </motion.div>
      
      <motion.div 
        className="absolute bottom-8 right-1/4 px-3 py-1 bg-orange-500/20 rounded-full text-white text-xs font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        Growing mRNA
      </motion.div>
      
      {/* Base pairing legend */}
      <motion.div 
        className="absolute top-8 right-8 bg-popover/50 backdrop-blur-sm p-2 rounded-lg border border-primary/20"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="text-white/90 text-xs font-medium mb-1">Base Pairing</div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colors.dna.baseA }}></div>
            <span className="text-white/80">A</span>
          </div>
          <div className="flex items-center">
            <span className="text-white/80">→</span>
            <div className="w-3 h-3 rounded-full mx-1" style={{ backgroundColor: colors.dna.baseT }}></div>
            <span className="text-white/80">U</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colors.dna.baseT }}></div>
            <span className="text-white/80">T</span>
          </div>
          <div className="flex items-center">
            <span className="text-white/80">→</span>
            <div className="w-3 h-3 rounded-full mx-1" style={{ backgroundColor: colors.dna.baseA }}></div>
            <span className="text-white/80">A</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colors.dna.baseG }}></div>
            <span className="text-white/80">G</span>
          </div>
          <div className="flex items-center">
            <span className="text-white/80">→</span>
            <div className="w-3 h-3 rounded-full mx-1" style={{ backgroundColor: colors.dna.baseC }}></div>
            <span className="text-white/80">C</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colors.dna.baseC }}></div>
            <span className="text-white/80">C</span>
          </div>
          <div className="flex items-center">
            <span className="text-white/80">→</span>
            <div className="w-3 h-3 rounded-full mx-1" style={{ backgroundColor: colors.dna.baseG }}></div>
            <span className="text-white/80">G</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Scene 4: Termination – Transcription Ends
const TerminationScene: React.FC<{ colors: any }> = ({ colors }) => {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* DNA strands */}
      <div className="absolute left-0 right-0 h-24 top-1/3">
        {/* DNA template strand (top) */}
        <div className="absolute h-4 left-0 right-0 top-0 bg-primary/70 rounded-full" />
        
        {/* DNA coding strand (bottom) */}
        <div className="absolute h-4 left-0 right-0 bottom-0 bg-secondary/70 rounded-full" />
        
        {/* Termination signal */}
        <motion.div 
          className="absolute top-1/2 left-3/4 transform -translate-y-1/2 w-16 h-16 rounded-md border-2 border-red-500/70 bg-red-500/10 flex items-center justify-center"
          animate={{ 
            boxShadow: [
              '0 0 0 rgba(239, 68, 68, 0.4)',
              '0 0 15px rgba(239, 68, 68, 0.6)',
              '0 0 0 rgba(239, 68, 68, 0.4)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-xs text-red-400 font-bold">STOP</div>
        </motion.div>
        
        {/* RNA polymerase */}
        <motion.div 
          className="absolute w-20 h-20 bg-green-500/80 rounded-2xl z-20 flex items-center justify-center transform -translate-y-1/2"
          style={{ boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}
          initial={{ left: '50%' }}
          animate={{ left: '75%' }}
          transition={{ duration: 2, type: "spring" }}
        >
          <div className="text-white text-xs font-bold text-center">
            RNA<br/>Polymerase
          </div>
        </motion.div>
        
        {/* Completed mRNA */}
        <motion.div 
          className="absolute h-6 bg-orange-400/80 rounded-full"
          style={{ top: '80%' }}
          initial={{ width: '35%', left: '15%' }}
          animate={{ 
            width: '60%',
          }}
          transition={{ duration: 1 }}
        >
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xs font-medium">mRNA</div>
        </motion.div>
        
        {/* Polymerase detaching animation */}
        <motion.div
          className="absolute w-20 h-20 bg-green-500/60 rounded-2xl z-10 flex items-center justify-center transform -translate-y-1/2"
          style={{ boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}
          initial={{ left: '75%', opacity: 0 }}
          animate={{ 
            left: '85%', 
            opacity: [0, 0.8, 0],
            top: ['50%', '70%'] 
          }}
          transition={{ 
            duration: 2,
            delay: 2,
            times: [0, 0.5, 1], 
          }}
        />
        
        {/* mRNA floating away animation */}
        <motion.div 
          className="absolute h-6 bg-orange-400/60 rounded-full"
          style={{ top: '80%' }}
          initial={{ width: '60%', left: '15%', opacity: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            top: ['80%', '120%'],
            left: ['15%', '5%']
          }}
          transition={{ 
            duration: 3,
            delay: 3,
            times: [0, 0.5, 1], 
          }}
        />
      </div>
      
      {/* Labels */}
      <motion.div 
        className="absolute top-8 right-1/4 px-3 py-1 bg-red-500/20 rounded-full text-white text-xs font-medium"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Termination Signal
      </motion.div>
      
      <motion.div 
        className="absolute bottom-8 left-1/4 px-3 py-1 bg-orange-500/20 rounded-full text-white text-xs font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        Completed mRNA
      </motion.div>
    </div>
  );
};

// Scene 5: mRNA Leaves the Nucleus
const MRNAExitScene: React.FC<{ colors: any }> = ({ colors }) => {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Cell nucleus */}
      <div className="absolute w-3/4 h-3/4 rounded-full border-4 border-primary/30 bg-background/50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      
      {/* Nuclear pore */}
      <motion.div 
        className="absolute w-16 h-16 bg-transparent border-8 border-secondary/70 rounded-full top-1/2 right-1/4 transform -translate-y-1/2"
        animate={{ 
          boxShadow: [
            '0 0 0 rgba(14, 165, 233, 0.3)',
            '0 0 15px rgba(14, 165, 233, 0.5)',
            '0 0 0 rgba(14, 165, 233, 0.3)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* mRNA strand */}
      <motion.div
        className="absolute h-6 rounded-full bg-orange-400/80 flex items-center"
        style={{ width: '25%' }}
        initial={{ left: '30%', top: '50%' }}
        animate={{ 
          left: ['30%', '65%', '90%'],
          top: ['50%', '50%', '70%'],
          rotate: [0, 0, 15]
        }}
        transition={{ 
          duration: 4,
          times: [0, 0.4, 1],
          ease: "easeInOut",
        }}
      >
        <div className="ml-2 text-white text-xs font-medium">mRNA</div>
      </motion.div>
      
      {/* Ribosome waiting in cytoplasm */}
      <motion.div
        className="absolute w-12 h-8 rounded-xl bg-yellow-500/70 flex items-center justify-center"
        initial={{ right: '5%', top: '70%', opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <div className="text-white text-xs font-bold">Ribosome</div>
      </motion.div>
      
      {/* Labels */}
      <motion.div 
        className="absolute top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-primary/20 rounded-full text-white text-xs font-medium"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Nucleus
      </motion.div>
      
      <motion.div 
        className="absolute top-1/2 right-1/4 transform translate-x-10 -translate-y-1/2 px-3 py-1 bg-secondary/20 rounded-full text-white text-xs font-medium"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 10 }}
        transition={{ delay: 1 }}
      >
        Nuclear Pore
      </motion.div>
      
      <motion.div 
        className="absolute bottom-8 right-1/4 px-3 py-1 bg-yellow-500/20 rounded-full text-white text-xs font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
      >
        Cytoplasm
      </motion.div>
      
      {/* Next step indicator */}
      <motion.div 
        className="absolute bottom-16 right-16 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4 }}
      >
        <div className="text-white/80 text-sm">Next:</div>
        <div className="px-3 py-1 bg-secondary/20 rounded-full text-white text-xs font-medium">
          Translation
        </div>
        <ArrowRight className="w-4 h-4 text-secondary" />
      </motion.div>
    </div>
  );
};

export default TranscriptionAnimation2D;
