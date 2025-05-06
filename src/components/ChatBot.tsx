import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Mic, MicOff, Minimize2, Maximize2, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import useChatBot from '@/hooks/use-chatbot';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    isListening, 
    startListening, 
    stopListening, 
    stopSpeaking,
    isSpeaking,
    isMuted,
    setIsMuted
  } = useChatBot();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Auto-open the chatbot on page load after a short delay
  useEffect(() => {
    // Removing the auto-open functionality
    // The chatbot will now remain closed until user clicks the button
    return () => {};
  }, []);

  // Effect to handle muted state
  useEffect(() => {
    if (isMuted) {
      stopSpeaking();
      // Also cancel any browser speech synthesis if running
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isMuted, stopSpeaking]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleVoiceControl = () => {
    if (!isMuted) {
      stopSpeaking();
      // Also cancel any browser speech synthesis if running
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsMuted(true);
    } else {
      setIsMuted(false);
      // Play a brief confirmation sound to indicate voice is enabled
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("Voice enabled");
        utterance.volume = 0.8;
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping-slow"></div>
          <Button
            onClick={toggleChat}
            className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-slow relative"
            aria-label="Open chat with BioBuddy"
          >
            <Bot className="h-8 w-8 text-white" />
            <span className="sr-only">Chat with BioBuddy</span>
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 rounded-2xl bg-background shadow-2xl border border-primary/20 overflow-hidden flex flex-col"
            style={{ height: isMinimized ? 'auto' : '500px' }}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-between">
              {isMinimized ? (
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <h3 className="font-orbitron tracking-wide text-sm">BioBuddy</h3>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <div>
                    <h3 className="font-orbitron tracking-wide">BioBuddy Assistant</h3>
                    <div className="flex items-center text-xs opacity-80 mt-0.5">
                      <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${isMuted ? 'bg-orange-300' : 'bg-green-300'}`}></span>
                      <span>{isMuted ? 'Voice disabled' : 'Voice enabled'}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-6 w-6 text-white hover:bg-white/20 rounded-full ${isMuted ? 'bg-white/10' : ''}`}
                        onClick={handleVoiceControl}
                        aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
                        aria-pressed={!isMuted}
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4 opacity-70" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">{isMuted ? 'Unmute voice' : 'Mute voice'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-white hover:bg-white/20 rounded-full"
                        onClick={toggleMinimize}
                      >
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isMinimized ? 'Maximize' : 'Minimize'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-white hover:bg-white/20 rounded-full"
                        onClick={() => setIsOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Close</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {!isMinimized && (
              <>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.sender === 'user' 
                              ? 'bg-primary text-primary-foreground rounded-tr-none' 
                              : 'bg-muted text-foreground rounded-tl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-lg bg-muted text-foreground rounded-tl-none flex items-center space-x-2">
                          <span className="typing-dot"></span>
                          <span className="typing-dot animation-delay-200"></span>
                          <span className="typing-dot animation-delay-400"></span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-border flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about protein synthesis..."
                    className="flex-1"
                    disabled={isLoading || isListening}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={isListening ? stopListening : startListening}
                          disabled={isLoading}
                          className={`${isListening ? 'bg-muted border-primary/50' : ''}`}
                        >
                          {isListening ? (
                            <MicOff className="h-4 w-4 text-primary" />
                          ) : (
                            <Mic className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="text-xs">{isListening ? 'Stop Voice Input' : 'Start Voice Input'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button
                    onClick={handleSend}
                    size="icon" 
                    disabled={!message.trim() || isLoading}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
