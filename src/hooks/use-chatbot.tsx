import { useState, useEffect, useRef } from 'react';
import { chatbotResponse } from '@/lib/chatbot-data';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

// Use a different voice ID and model to avoid the unusual activity error
const ELEVEN_LABS_API_KEY = 'c8ee91a41691a0dc6ae1c9de0b12bf3c'; // Updated API key
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Changed to Adam voice
const MODEL_ID = 'eleven_monolingual_v1';

function useChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    // Check localStorage for saved mute preference
    if (typeof window !== 'undefined') {
      const savedMuted = localStorage.getItem('chatbot_muted');
      return savedMuted === 'true';
    }
    return false;
  });
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const isSpeakingRef = useRef<boolean>(false); // Track speaking state with a ref for better control
  const voicesLoadedRef = useRef<boolean>(false);
  const availableVoicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const initialGreetingPlayedRef = useRef<boolean>(false);

  // Save mute state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatbot_muted', isMuted.toString());
    }
  }, [isMuted]);

  // Preload speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Load voices immediately if they're already available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        availableVoicesRef.current = voices;
        voicesLoadedRef.current = true;
      }

      // Set up event listener for when voices are loaded
      const handleVoicesChanged = () => {
        const voices = window.speechSynthesis.getVoices();
        availableVoicesRef.current = voices;
        voicesLoadedRef.current = true;
      };

      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const userMessage = event.results[0][0].transcript;
          sendMessage(userMessage);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        stopListening();
      }
    };
  }, []);

  // Effect to handle mute state changes
  useEffect(() => {
    if (isMuted) {
      // Stop any ongoing speech when muted
      stopSpeaking();
    }
  }, [isMuted]);

  // Stop any playing audio
  const stopSpeaking = () => {
    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Stop browser speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    isSpeakingRef.current = false;
  };

  // Improve browser speech synthesis fallback
  const speakWithBrowserSynthesis = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure the utterance for a deeper male voice
        utterance.rate = 0.9; // Slightly slower
        utterance.pitch = 0.8; // Lower pitch for deeper voice
        utterance.volume = 1.0;
        
        // Use preloaded voices if available
        if (voicesLoadedRef.current && availableVoicesRef.current.length > 0) {
          // Try to find a male voice
          const preferredVoice = availableVoicesRef.current.find(voice => 
            (voice.name.includes('Male') || 
             voice.name.includes('David') || 
             voice.name.includes('Mark') || 
             voice.name.includes('James')) &&
            voice.lang.includes('en')
          );
          
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }
        
        utterance.onend = () => {
          isSpeakingRef.current = false;
        };
        
        utterance.onerror = () => {
          console.error('Browser speech synthesis error');
          isSpeakingRef.current = false;
        };
        
        window.speechSynthesis.speak(utterance);
        return true;
      } catch (fallbackError) {
        console.error('Fallback speech synthesis error:', fallbackError);
        isSpeakingRef.current = false;
        return false;
      }
    }
    isSpeakingRef.current = false;
    return false;
  };

  // Text to speech function using ElevenLabs - using a more reliable approach
  const speakMessage = async (text: string) => {
    // Don't speak if muted
    if (isMuted) return;
    
    // Stop any previous audio that might be playing
    stopSpeaking();
    isSpeakingRef.current = true;
    
    try {
      // Try ElevenLabs API first
      try {
        // Using a more basic text-to-speech endpoint
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': ELEVEN_LABS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            model_id: MODEL_ID,
            voice_settings: {
              stability: 0.7,
              similarity_boost: 0.65,
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('TTS error response:', errorText);
          throw new Error(`TTS request failed with status: ${response.status}`);
        }

        const blob = await response.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        audioRef.current = audio;
        
        audio.onended = () => {
          audioRef.current = null;
          isSpeakingRef.current = false;
        };
        
        // Add error handling for audio playback
        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          audioRef.current = null;
          isSpeakingRef.current = false;
          throw new Error('Audio playback error');
        };
        
        await audio.play();
      } catch (apiError) {
        console.error('ElevenLabs API error:', apiError);
        throw new Error('ElevenLabs API error');
      }
    } catch (error) {
      console.error('Text-to-speech error, falling back to browser synthesis:', error);
      
      // Fallback to browser's built-in speech synthesis
      if (!speakWithBrowserSynthesis(text)) {
        isSpeakingRef.current = false;
      }
    }
  };

  // Function to check if the bot is currently speaking
  const isSpeaking = () => isSpeakingRef.current;

  // Send initial greeting when the component is mounted
  useEffect(() => {
    // Only play the greeting if not already played in this session and not muted
    if (!initialGreetingPlayedRef.current && !isMuted) {
      // Play the initial greeting without adding it to the messages
      const greeting = "Welcome to Protein OS. I'm your AI assistant. Click the chat button if you need help.";
      
      // Small delay to ensure the component is fully mounted
      setTimeout(() => {
        initialGreetingPlayedRef.current = true;
        
        // Only speak if still not muted (user might have clicked mute immediately)
        if (!isMuted) {
          speakMessage(greeting);
        }
      }, 1000);
    }
  }, [isMuted]);

  // Send greeting when chat is first opened
  useEffect(() => {
    const hasInitialGreeting = messages.length > 0;
    
    if (!hasInitialGreeting) {
      const greeting = "Hello, I am BioBuddy, and I'm here to assist you. Feel free to ask me anything related to protein synthesis!";
      setMessages([
        {
          content: greeting,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
      
      // Don't speak this greeting since we already did the welcome message
    }
  }, [messages.length]);

  // Speech recognition handlers
  const startListening = () => {
    if (recognitionRef.current) {
      stopSpeaking(); // Stop speaking when starting to listen
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      // Removed the toast notification for unsupported speech recognition
      console.error('Speech recognition is not supported in this browser');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const sendMessage = async (userMessage: string) => {
    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      {
        content: userMessage,
        sender: 'user',
        timestamp: new Date(),
      },
    ]);

    setIsLoading(true);

    try {
      // Stop any ongoing speech when user sends a message
      stopSpeaking();
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const botReply = await chatbotResponse(userMessage);
      
      setMessages((prev) => [
        ...prev,
        {
          content: botReply,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);

      // Speak the bot's response
      speakMessage(botReply);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      const errorMessage = "I'm sorry, I couldn't process your request at the moment. Please try again later.";
      
      setMessages((prev) => [
        ...prev,
        {
          content: errorMessage,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
      
      speakMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    isListening,
    startListening,
    stopListening,
    stopSpeaking,
    isSpeaking: isSpeaking(),
    isMuted,
    setIsMuted
  };
}

export default useChatBot;
