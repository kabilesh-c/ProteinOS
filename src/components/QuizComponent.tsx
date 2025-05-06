import { useState, useEffect } from 'react';
import { proteinSynthesisQuestions } from '@/lib/quiz-data';
import { CheckCircle, XCircle, Home, RotateCcw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const QuizComponent = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [animateQuestion, setAnimateQuestion] = useState(false);

  const currentQuestion = proteinSynthesisQuestions[currentQuestionIndex];
  const totalQuestions = proteinSynthesisQuestions.length;

  useEffect(() => {
    // Reset animation when question changes
    setAnimateQuestion(true);
    const timeout = setTimeout(() => setAnimateQuestion(false), 500);
    return () => clearTimeout(timeout);
  }, [currentQuestionIndex]);

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOptionIndex(optionIndex);
    setIsAnswered(true);

    if (optionIndex === currentQuestion.correctOptionIndex) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setCorrectAnswers(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    return (
      <div className="glass-card flex flex-col items-center justify-center text-center py-16 px-6 mt-8 glow-effect">
        <div className="mb-8">
          <CheckCircle className="w-20 h-20 text-accent mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Great job!</h2>
          <p className="text-xl mb-6">You scored {correctAnswers} out of {totalQuestions}!</p>
          
          <div className="text-muted-foreground mb-8">
            {correctAnswers === totalQuestions ? (
              <p>Perfect score! You're a protein synthesis expert!</p>
            ) : correctAnswers >= totalQuestions * 0.7 ? (
              <p>Excellent work! You have a good understanding of protein synthesis.</p>
            ) : correctAnswers >= totalQuestions * 0.5 ? (
              <p>Good effort! Review the topics you missed and try again.</p>
            ) : (
              <p>Keep studying protein synthesis concepts and try again soon!</p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={resetQuiz}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/80"
          >
            <RotateCcw size={18} />
            Try Again
          </Button>
          
          <Link to="/">
            <Button className="flex items-center gap-2">
              <Home size={18} />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "transition-opacity duration-500 ease-in-out",
      animateQuestion ? "opacity-0" : "opacity-100"
    )}>
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <span className="text-sm font-medium">
          Score: {correctAnswers}/{currentQuestionIndex + (isAnswered ? 1 : 0)}
        </span>
      </div>

      <Card className="glass-card mb-8 relative overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={isAnswered}
                className={cn(
                  "w-full text-left p-4 rounded-lg transition-all border text-lg",
                  isAnswered && index === currentQuestion.correctOptionIndex
                    ? "bg-green-500/20 border-green-500 text-white"
                    : isAnswered && index === selectedOptionIndex
                    ? "bg-red-500/20 border-red-500 text-white"
                    : "bg-card/50 border-border hover:border-primary hover:bg-card/80",
                  "relative overflow-hidden"
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center bg-muted text-sm font-medium mt-0.5">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>
                
                {isAnswered && index === currentQuestion.correctOptionIndex && (
                  <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
                {isAnswered && index === selectedOptionIndex && index !== currentQuestion.correctOptionIndex && (
                  <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                )}
              </button>
            ))}
          </div>

          {isAnswered && (
            <div className="mt-8 p-4 bg-muted/30 border border-border rounded-lg">
              <div className="font-medium mb-1">
                {selectedOptionIndex === currentQuestion.correctOptionIndex ? (
                  <span className="text-green-500 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> That's correct! Well done!
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> Oh no! That's not the right answer.
                  </span>
                )}
              </div>
              <div className="text-muted-foreground">
                <span className="font-medium">Explanation:</span> {currentQuestion.explanation}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isAnswered && (
        <div className="flex justify-center">
          <Button 
            onClick={handleNextQuestion}
            className="px-6 py-5 text-lg flex items-center gap-2"
          >
            {currentQuestionIndex < totalQuestions - 1 ? "Next Question" : "See Results"}
            <ChevronRight size={18} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
