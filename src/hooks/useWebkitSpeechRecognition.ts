"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

interface UseSpeechRecognitionReturn {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  setLanguage: (language: string) => void;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export const useWebkitSpeechRecognition = (
  options: SpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn => {
  const {
    language = "en-US",
    continuous = true,
    interimResults = true,
    maxAlternatives = 1,
  } = options;

  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isInitializedRef = useRef(false);
  const continuousModeRef = useRef(continuous);

  // Check for speech recognition support and initialize
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      initializeRecognition(SpeechRecognition);
    } else {
      setIsSupported(false);
      setError("Speech recognition is not supported in this browser");
    }
  }, []);

  // Initialize speech recognition
  const initializeRecognition = useCallback((SpeechRecognition: typeof window.SpeechRecognition) => {
    if (isInitializedRef.current) return;

    try {
      const recognition = new SpeechRecognition();
      
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;
      recognition.maxAlternatives = maxAlternatives;

      recognition.onstart = () => {
        console.log("🎤 Speech recognition started");
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;

          if (result.isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript + " ");
        }
        
        if (interimTranscript) {
          setInterimTranscript(interimTranscript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("🎤 Speech recognition error:", event.error);
        
        let errorMessage = "Speech recognition error";
        
        switch (event.error) {
          case "no-speech":
            errorMessage = "No speech detected";
            break;
          case "audio-capture":
            errorMessage = "Microphone not accessible";
            break;
          case "not-allowed":
            errorMessage = "Microphone access denied";
            break;
          case "network":
            errorMessage = "Network error";
            break;
          case "service-not-allowed":
            errorMessage = "Speech recognition service not allowed";
            break;
          case "bad-grammar":
            errorMessage = "Speech recognition grammar error";
            break;
        }
        
        setError(errorMessage);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log("🎤 Speech recognition ended");
        setIsListening(false);
        setInterimTranscript("");
        
        // Auto-restart in continuous mode
        if (continuousModeRef.current && isListening) {
          setTimeout(() => {
            if (recognitionRef.current && !isListening) {
              try {
                recognition.start();
              } catch (err) {
                console.error("🎤 Failed to restart recognition:", err);
              }
            }
          }, 100);
        }
      };

      recognitionRef.current = recognition;
      isInitializedRef.current = true;
      
    } catch (err) {
      console.error("🎤 Failed to initialize speech recognition:", err);
      setError("Failed to initialize speech recognition");
      setIsSupported(false);
    }
  }, [continuous, interimResults, language, maxAlternatives, isListening]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) {
      return;
    }

    try {
      setError(null);
      setTranscript("");
      setInterimTranscript("");
      recognitionRef.current.start();
    } catch (err) {
      console.error("🎤 Failed to start speech recognition:", err);
      setError("Failed to start speech recognition");
    }
  }, [isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) {
      return;
    }

    try {
      continuousModeRef.current = false;
      recognitionRef.current.stop();
    } catch (err) {
      console.error("🎤 Failed to stop speech recognition:", err);
    }
  }, [isListening]);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setError(null);
  }, []);

  // Set language
  const setLanguage = useCallback((newLanguage: string) => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLanguage;
    }
  }, []);

  // Update continuous mode
  useEffect(() => {
    continuousModeRef.current = continuous;
    if (recognitionRef.current) {
      recognitionRef.current.continuous = continuous;
    }
  }, [continuous]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error("🎤 Error stopping recognition on cleanup:", err);
        }
      }
    };
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
    setLanguage,
  };
};

export default useWebkitSpeechRecognition;
