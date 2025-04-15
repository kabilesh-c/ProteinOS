
import { useState, useEffect, useRef } from 'react';
import { chatbotResponse } from '@/lib/chatbot-data';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export const useChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Speech recognition setup
  // Create recognition instance only on client side
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
          toast({
            title: "Voice Recognition Error",
            description: `Error: ${event.error}. Please try again.`,
          });
        };
      }
    }
    
    return () => {
      // Cleanup recognition on unmount
      if (recognitionRef.current) {
        stopListening();
      }
    };
  }, []);

  // Stop any playing audio
  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  // Text to speech function using ElevenLabs
  const speakMessage = async (text: string) => {
    if (!apiKey) return;
    
    // Stop any previous audio that might be playing
    stopSpeaking();
    
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/stream', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const blob = await response.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audioRef.current = audio;
      
      audio.onended = () => {
        audioRef.current = null;
      };
      
      await audio.play();
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast({
        title: "Voice Playback Error",
        description: "Could not play the voice response. Please check your API key.",
      });
    }
  };

  // Send initial greeting when the chat is first opened and API key is available
  useEffect(() => {
    const hasInitialGreeting = messages.length > 0;
    const canSpeak = apiKey && !hasInitialGreeting;
    
    if (!hasInitialGreeting) {
      const greeting = "Hello, I am BioBuddy, and I'm here to assist you. Feel free to ask me anything related to protein synthesis!";
      setMessages([
        {
          content: greeting,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
      
      if (canSpeak) {
        speakMessage(greeting);
      }
    } else if (apiKey && messages.length === 1 && !audioRef.current) {
      // If API key was added after initial greeting was displayed
      speakMessage(messages[0].content);
    }
  }, [messages.length, apiKey]);

  // Speech recognition handlers
  const startListening = () => {
    if (recognitionRef.current) {
      stopSpeaking(); // Stop speaking when starting to listen
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      toast({
        title: "Voice Input Not Available",
        description: "Speech recognition is not supported in your browser.",
      });
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

      // Speak the bot's reply if API key is available
      if (apiKey) {
        speakMessage(botReply);
      }
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
      
      if (apiKey) {
        speakMessage(errorMessage);
      }
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
    setApiKey,
    apiKey,
  };
};
