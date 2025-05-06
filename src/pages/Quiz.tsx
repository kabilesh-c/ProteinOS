
import { useState } from 'react';
import QuizComponent from '@/components/QuizComponent';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Quiz = () => {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
        
        {!isStarted ? (
          <div className="glass-card flex flex-col items-center justify-center text-center py-16 px-6 glow-effect">
            <div className="absolute -z-10 top-1/4 right-1/4 goo-blob w-64 h-64 bg-secondary/30"></div>
            <div className="absolute -z-10 bottom-1/4 left-1/4 goo-blob w-72 h-72 bg-primary/30 animation-delay-200"></div>
            
            <h1 className="section-title mb-4">Welcome to the Protein Synthesis Quiz!</h1>
            <p className="section-subtitle text-xl mb-10">
              Ready to test how much you've learned about how proteins are made inside cells?
            </p>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Click the button below to begin and challenge your understanding of transcription, 
              translation, and everything in between!
            </p>

            <button 
              onClick={() => setIsStarted(true)}
              className="bg-gradient-to-r from-secondary to-primary text-white font-bold py-3 px-8 rounded-full 
                       shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 
                       focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 
                       animate-pulse-glow font-poppins"
            >
              Let's Start the Quiz
            </button>
          </div>
        ) : (
          <QuizComponent />
        )}
      </div>
    </div>
  );
};

export default Quiz;
