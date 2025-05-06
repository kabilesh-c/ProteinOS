import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import LandingPage from '@/components/LandingPage';
import GooeyButton from '@/components/GooeyButton';
import DNAModel from '@/components/DNAModel';
import VideoCard from '@/components/VideoCard';
import SectionDivider from '@/components/SectionDivider';
import GooeyBlob from '@/components/GooeyBlob';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const sections = {
    hero: useRef<HTMLDivElement>(null),
    introduction: useRef<HTMLDivElement>(null),
    transcription: useRef<HTMLDivElement>(null),
    translation: useRef<HTMLDivElement>(null),
    folding: useRef<HTMLDivElement>(null),
    videos: useRef<HTMLDivElement>(null),
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '-50px 0px -50px 0px'
      }
    );
    
    Object.values(sections).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    
    return () => {
      Object.values(sections).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);
  
  const handleStartLearning = () => {
    sections.introduction.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleTakeQuiz = () => {
    navigate('/quiz');
  };
  
  const renderHeroSection = () => (
    <section 
      id="hero" 
      ref={sections.hero} 
      className="min-h-screen relative"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-pattern"></div>
        <DNAModel className="opacity-60" />
      </div>
      
      <LandingPage onStartLearning={handleStartLearning} />
    </section>
  );
  
  const renderIntroductionSection = () => (
    <section 
      id="introduction" 
      ref={sections.introduction}
      className="min-h-screen py-16 md:py-24 relative"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">
            What is Protein Synthesis?
          </h2>
          <p className="section-subtitle">
            The process where cells build proteins — the workhorses of life
          </p>
          
          <div className="relative glass-card">
            <GooeyBlob 
              color="bg-primary/10" 
              size={200} 
              top="-20%" 
              right="-10%" 
            />
            
            <div className="relative z-10 space-y-6">
              <p className="text-white/90 leading-relaxed">
                Protein synthesis is the complex process where cells create proteins based on instructions 
                encoded in DNA. These proteins perform nearly every function in your body, from building 
                muscles to fighting infections.
              </p>
              
              <div className="h-80 sm:h-96 md:h-[28rem] w-full relative rounded-lg overflow-hidden border border-primary/10">
                <CustomVideoPlayer 
                  videoUrl="https://streamable.com/18fo4y" 
                  className="absolute inset-0"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="bg-muted/30 rounded-lg p-5 backdrop-blur-sm border border-primary/10">
                  <h3 className="text-lg font-bold text-white mb-3">DNA: The Blueprint</h3>
                  <p className="text-white/80">
                    Every cell contains DNA in its nucleus. This DNA holds the genetic instructions 
                    for making proteins — like a recipe book for the cell.
                  </p>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-5 backdrop-blur-sm border border-primary/10">
                  <h3 className="text-lg font-bold text-white mb-3">Proteins: Life's Workers</h3>
                  <p className="text-white/80">
                    Proteins are complex molecules made of amino acids. They do most of the work in cells 
                    and are required for the structure, function, and regulation of the body's tissues and organs.
                  </p>
                </div>
              </div>
              
              <p className="text-white/90 leading-relaxed pt-2">
                The journey from DNA to protein happens in two major steps: transcription and translation. 
                Let's explore each step in detail...
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <GooeyButton
              onClick={() => {
                sections.transcription.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Next: Transcription
            </GooeyButton>
          </div>
        </div>
      </div>
    </section>
  );
  
  const renderTranscriptionSection = () => (
    <section 
      id="transcription" 
      ref={sections.transcription}
      className="min-h-screen py-16 md:py-24 relative"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">
            Step 1: Transcription
          </h2>
          <p className="section-subtitle">
            Converting DNA information into messenger RNA
          </p>
          
          <div className="relative glass-card">
            <GooeyBlob 
              color="bg-secondary/10" 
              size={200} 
              bottom="-20%" 
              left="-10%" 
            />
            
            <div className="relative z-10 space-y-6">
              <p className="text-white/90 leading-relaxed">
                Transcription is the first step of protein synthesis. It occurs in the cell's nucleus, 
                where the DNA containing the gene for a specific protein is located.
              </p>
              
              <div className="h-80 sm:h-96 md:h-[28rem] w-full relative rounded-lg overflow-hidden border border-primary/10">
                <CustomVideoPlayer 
                  videoUrl="https://streamable.com/rn1a3j" 
                  className="absolute inset-0"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="bg-muted/30 rounded-lg p-5 backdrop-blur-sm border border-primary/10">
                  <h3 className="text-lg font-bold text-white mb-3">How It Works</h3>
                  <ul className="text-white/80 space-y-2 list-disc pl-5">
                    <li>DNA double helix unwinds at the gene location</li>
                    <li>RNA polymerase enzyme attaches to the DNA</li>
                    <li>RNA polymerase reads the DNA template strand</li>
                    <li>Complementary RNA nucleotides are added one by one</li>
                    <li>A messenger RNA (mRNA) strand is created</li>
                  </ul>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-5 backdrop-blur-sm border border-primary/10">
                  <h3 className="text-lg font-bold text-white mb-3">Key Players</h3>
                  <ul className="text-white/80 space-y-2">
                    <li><span className="font-medium text-primary">DNA:</span> Contains the genetic instructions</li>
                    <li><span className="font-medium text-primary">RNA Polymerase:</span> The enzyme that builds mRNA</li>
                    <li><span className="font-medium text-primary">Nucleotides:</span> A, U, G, C (RNA uses U instead of T)</li>
                    <li><span className="font-medium text-primary">mRNA:</span> The message that carries the protein code</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-white/90 leading-relaxed pt-2">
                Once transcription is complete, the mRNA molecule is processed (in eukaryotes) and 
                leaves the nucleus through nuclear pores, heading to the cytoplasm where translation occurs.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <GooeyButton
              onClick={() => {
                sections.translation.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Next: Translation
            </GooeyButton>
          </div>
        </div>
      </div>
    </section>
  );
  
  const renderTranslationSection = () => (
    <section 
      id="translation" 
      ref={sections.translation}
      className="min-h-screen py-16 md:py-24 relative"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">
            Step 2: Translation
          </h2>
          <p className="section-subtitle">
            Decoding mRNA into a protein sequence
          </p>
          
          <div className="relative glass-card">
            <GooeyBlob 
              color="bg-primary/10" 
              size={180} 
              top="-10%" 
              right="-5%" 
            />
            <GooeyBlob 
              color="bg-secondary/10" 
              size={150} 
              bottom="-10%" 
              left="-5%" 
              delay={1}
            />
            
            <div className="relative z-10 space-y-6">
              <p className="text-white/90 leading-relaxed">
                Translation is the second major step in protein synthesis. It takes place in the 
                cytoplasm of the cell, specifically at ribosomes, which serve as protein factories.
              </p>
              
              <div className="h-80 sm:h-96 md:h-[28rem] w-full relative rounded-lg overflow-hidden border border-primary/10">
                <CustomVideoPlayer 
                  videoUrl="https://streamable.com/21kuy8" 
                  className="absolute inset-0"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="bg-muted/30 rounded-lg p-5 backdrop-blur-sm border border-primary/10">
                  <h3 className="text-lg font-bold text-white mb-3">The Translation Process</h3>
                  <ol className="text-white/80 space-y-2 list-decimal pl-5">
                    <li>mRNA binds to a ribosome</li>
                    <li>tRNA molecules bring amino acids to the ribosome</li>
                    <li>Each tRNA matches its anticodon to an mRNA codon</li>
                    <li>Amino acids link together via peptide bonds</li>
                    <li>This continues until a stop codon is reached</li>
                    <li>The completed protein chain is released</li>
                  </ol>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-5 backdrop-blur-sm border border-primary/10">
                  <h3 className="text-lg font-bold text-white mb-3">Translation Components</h3>
                  <ul className="text-white/80 space-y-2">
                    <li><span className="font-medium text-secondary">mRNA:</span> Contains the code from DNA</li>
                    <li><span className="font-medium text-secondary">Ribosomes:</span> Cellular machinery where proteins are made</li>
                    <li><span className="font-medium text-secondary">tRNA:</span> Transfer RNA that carries amino acids</li>
                    <li><span className="font-medium text-secondary">Amino Acids:</span> The building blocks of proteins</li>
                    <li><span className="font-medium text-secondary">Codons:</span> Three-nucleotide sequences that code for amino acids</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-white/90 leading-relaxed pt-2">
                As translation proceeds, the growing protein chain begins to fold into its three-dimensional 
                structure, a process that continues after the protein is fully synthesized.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <GooeyButton
              onClick={() => {
                sections.folding.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Next: Protein Folding
            </GooeyButton>
          </div>
        </div>
      </div>
    </section>
  );
  
  const renderFoldingSection = () => (
    <section 
      id="folding" 
      ref={sections.folding}
      className="min-h-screen py-16 md:py-24 relative"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">
            Step 3: Protein Folding & Function
          </h2>
          <p className="section-subtitle">
            From amino acid chain to functional 3D structure
          </p>
          
          <div className="relative glass-card">
            <GooeyBlob 
              color="bg-accent/20" 
              size={200} 
              top="-10%" 
              left="10%" 
            />
            
            <div className="relative z-10 space-y-6">
              <p className="text-white/90 leading-relaxed">
                After translation, the linear chain of amino acids must fold into a specific three-dimensional 
                shape to become a functional protein. This folding process is critical — incorrectly folded 
                proteins can lead to diseases.
              </p>
              
              <div className="h-80 sm:h-96 md:h-[28rem] w-full relative rounded-lg overflow-hidden border border-primary/10">
                <CustomVideoPlayer 
                  videoUrl="https://streamable.com/7k4j2k" 
                  className="absolute inset-0"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="bg-muted/30 rounded-lg p-5 backdrop-blur-sm border border-primary/10">
                  <h3 className="text-lg font-bold text-white mb-3">Levels of Protein Structure</h3>
                  <ul className="text-white/80 space-y-2">
                    <li><span className="font-medium text-accent">Primary:</span> Linear sequence of amino acids</li>
                    <li><span className="font-medium text-accent">Secondary:</span> Local folded structures (alpha helices, beta sheets)</li>
                    <li><span className="font-medium text-accent">Tertiary:</span> Overall 3D shape of a single protein</li>
                    <li><span className="font-medium text-accent">Quaternary:</span> Multiple protein subunits working together</li>
                  </ul>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-5 backdrop-blur-sm border border-primary/10">
                  <h3 className="text-lg font-bold text-white mb-3">Folding Factors</h3>
                  <ul className="text-white/80 space-y-2 list-disc pl-5">
                    <li>Hydrogen bonds between amino acids</li>
                    <li>Hydrophobic interactions (water-avoiding parts)</li>
                    <li>Ionic bonds between charged amino acids</li>
                    <li>Disulfide bridges connecting parts of the chain</li>
                    <li>Chaperone proteins that assist with folding</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-5 backdrop-blur-sm border border-primary/10 mt-6">
                <h3 className="text-lg font-bold text-white mb-3">Protein Functions in the Body</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="font-medium text-white">Enzymes</p>
                    <p className="text-white/70 text-sm">Catalyze biochemical reactions</p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <p className="font-medium text-white">Hormones</p>
                    <p className="text-white/70 text-sm">Signal messages between cells</p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <p className="font-medium text-white">Antibodies</p>
                    <p className="text-white/70 text-sm">Defend against infections</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="font-medium text-white">Structural</p>
                    <p className="text-white/70 text-sm">Provide cellular support</p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <p className="font-medium text-white">Transport</p>
                    <p className="text-white/70 text-sm">Move molecules in the body</p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <p className="font-medium text-white">Receptors</p>
                    <p className="text-white/70 text-sm">Receive signals from environment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <GooeyButton
              onClick={() => {
                sections.videos.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Next: Watch More
            </GooeyButton>
          </div>
        </div>
      </div>
    </section>
  );
  
  const renderVideosSection = () => (
    <section 
      id="videos" 
      ref={sections.videos}
      className="min-h-screen py-16 md:py-24 relative"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center">
            Watch More on Protein Synthesis
          </h2>
          <p className="section-subtitle text-center">
            Expand your knowledge with these helpful videos
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            <VideoCard 
              title="Protein Synthesis (Updated)"
              channelName="Amoeba Sisters"
              thumbnailUrl="https://i3.ytimg.com/vi/oefAI2x2CQM/maxresdefault.jpg"
              videoUrl="https://www.youtube.com/watch?v=oefAI2x2CQM"
            />
            
            <VideoCard 
              title="Protein Synthesis: Transcription | MIT Biology"
              channelName="MIT OpenCourseWare"
              thumbnailUrl="https://i3.ytimg.com/vi/9kOGOY7vthk/maxresdefault.jpg"
              videoUrl="https://www.youtube.com/watch?v=9kOGOY7vthk"
            />
            
            <VideoCard 
              title="Translation (mRNA to protein) | Biomolecules"
              channelName="Khan Academy MCAT"
              thumbnailUrl="https://i3.ytimg.com/vi/ocAAkB32Hqs/maxresdefault.jpg"
              videoUrl="https://www.youtube.com/watch?v=ocAAkB32Hqs"
            />
            
            <VideoCard 
              title="From DNA to protein - 3D"
              channelName="yourgenome"
              thumbnailUrl="https://i3.ytimg.com/vi/gG7uCskUOrA/maxresdefault.jpg"
              videoUrl="https://www.youtube.com/watch?v=gG7uCskUOrA"
            />
            
            <VideoCard 
              title="What is Protein Folding and Misfolding?"
              channelName="iBiology"
              thumbnailUrl="https://i3.ytimg.com/vi/cDR1iKM78oY/maxresdefault.jpg"
              videoUrl="https://www.youtube.com/watch?v=cDR1iKM78oY"
            />
            
            <VideoCard 
              title="DNA, Hot Pockets, & The Longest Word Ever"
              channelName="Crash Course"
              thumbnailUrl="https://i3.ytimg.com/vi/itsb2SqR-R0/maxresdefault.jpg"
              videoUrl="https://www.youtube.com/watch?v=itsb2SqR-R0"
            />
          </div>
          
          <SectionDivider className="mt-16" />
          
          <div className="max-w-3xl mx-auto text-center mt-16">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Fun Facts About Protein Synthesis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card animate-float">
                <p className="text-lg text-white">A single cell can make thousands of different proteins.</p>
              </div>
              
              <div className="glass-card animate-float" style={{ animationDelay: "0.5s" }}>
                <p className="text-lg text-white">Your body can make about 2 million proteins every second.</p>
              </div>
              
              <div className="glass-card animate-float" style={{ animationDelay: "1s" }}>
                <p className="text-lg text-white">If stretched out, the DNA in one cell would be about 6 feet long.</p>
              </div>
              
              <div className="glass-card animate-float" style={{ animationDelay: "1.5s" }}>
                <p className="text-lg text-white">Ribosomes can add 15 amino acids to a protein every second.</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-24">
            <GooeyButton onClick={handleTakeQuiz}>
              Take Quiz
            </GooeyButton>
          </div>
        </div>
      </div>
    </section>
  );
  
  return (
    <div className="relative bg-background min-h-screen flex flex-col">
      <NavBar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="flex-grow">
        {renderHeroSection()}
        {renderIntroductionSection()}
        {renderTranscriptionSection()}
        {renderTranslationSection()}
        {renderFoldingSection()}
        {renderVideosSection()}
      </main>

      <footer className="mt-auto py-4 border-t border-muted/30">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center">
          <p className="text-primary text-center text-sm">
            Assembled codon by codon by Kabilesh C 🔧🧬
          </p>
          <p className="text-primary text-xs mt-1 text-center">
            © 2025 ProteinOS All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
