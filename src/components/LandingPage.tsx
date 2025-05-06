import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import GooeyBlob from './GooeyBlob';
import GooeyButton from './GooeyButton';
import AOS from 'aos';

interface LandingPageProps {
  onStartLearning: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartLearning }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out',
    });
  }, []);

  return (
    <section className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/95 to-background/90"></div>
      
      {/* Colorful gooey blobs for visual interest */}
      <GooeyBlob 
        color="bg-purple-500/30" 
        size={500} 
        top="-10%" 
        left="-5%" 
        delay={0}
        blur="2xl"
      />
      <GooeyBlob 
        color="bg-cyan-500/30" 
        size={400} 
        bottom="-5%" 
        right="-5%" 
        delay={1.5}
        blur="2xl"
      />
      <GooeyBlob 
        color="bg-pink-500/30" 
        size={250} 
        top="30%" 
        right="10%" 
        delay={2.2}
        blur="2xl"
        opacity={0.5}
      />
      
      {/* Floating DNA particles */}
      <div className="particle-container absolute inset-0 -z-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="particle absolute rounded-full"
            style={{
              width: `${Math.random() * 8 + 3}px`,
              height: `${Math.random() * 8 + 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.3,
              background: `hsl(${Math.random() * 60 + 220}, 80%, 70%)`, // Blue-purple range
            }}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i + 20}
            className="dna-helix absolute"
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 40 + 20}px`,
              borderRadius: '40%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 15}s linear infinite, pulse-glow 3s infinite alternate`,
              animationDelay: `${Math.random() * 7}s`,
              opacity: Math.random() * 0.4 + 0.2,
              background: `linear-gradient(135deg, hsla(${Math.random() * 60 + 220}, 80%, 65%, 0.5), hsla(${Math.random() * 60 + 280}, 90%, 75%, 0.3))`,
              boxShadow: `0 0 15px hsla(${Math.random() * 60 + 240}, 90%, 70%, 0.4)`,
              transform: `rotate(${Math.random() * 180}deg)`,
            }}
          />
        ))}
      </div>
      
      {/* Content container */}
      <div className="container mx-auto px-4 z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 
            className="font-orbitron text-5xl md:text-7xl font-bold mb-4 tracking-tight"
            data-aos="fade-down"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary inline-block pb-2">
              Protein Synthesis
            </span>
          </h1>
          
          <h2 
            className="text-xl md:text-2xl text-white/90 font-light"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            An immersive journey into the molecular machinery of life
          </h2>
          
          <div 
            className="mt-8 bg-card/30 backdrop-blur-md border border-primary/10 rounded-xl p-6 shadow-lg max-w-2xl mx-auto"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <p className="text-lg text-white/80 leading-relaxed">
              Ever wondered how your cells transform genetic code into the proteins that power your body? 
              Join us on a fascinating adventure inside your cells where DNA becomes life! 
              With stunning visualizations and interactive models, you'll discover how the 
              molecular machinery reads DNA and assembles proteins—the building blocks of all living things.
            </p>
          </div>
          
          <div 
            className="mt-12 flex justify-center"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <GooeyButton 
              onClick={onStartLearning} 
              className="py-5 px-10 text-lg font-poppins"
            >
              Start Learning
            </GooeyButton>
          </div>
          
          <div 
            className="mt-16"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2.5,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-secondary">
                  <path 
                    d="M12 4V20M12 20L18 14M12 20L6 14" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="glow-effect"
                  />
                </svg>
                <div className="absolute inset-0 bg-secondary/20 blur-md rounded-full -z-10"></div>
              </motion.div>
              <span className="mt-2 text-secondary text-sm font-medium uppercase tracking-widest">Begin Journey</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingPage;
