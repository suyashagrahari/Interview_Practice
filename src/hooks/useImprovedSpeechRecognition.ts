"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  timeout?: number; // Timeout in milliseconds
  retryAttempts?: number; // Number of retry attempts
  retryDelay?: number; // Delay between retries in milliseconds
}

interface UseImprovedSpeechRecognitionReturn {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  isInitializing: boolean;
  isInInterviewMode: boolean; // New state
  startInterviewSession: () => Promise<void>; // New method
  stopInterviewSession: () => void; // New method
  resetTranscript: () => void;
  setLanguage: (language: string) => void;
  retry: () => Promise<void>;
}

export const useImprovedSpeechRecognition = (
  options: SpeechRecognitionOptions = {}
): UseImprovedSpeechRecognitionReturn => {
  const {
    language = "en-US",
    continuous = true,
    interimResults = true,
    maxAlternatives = 1,
    timeout = 600000, // 10 minutes timeout for long speech sessions
    retryAttempts = 2,
    retryDelay = 2000, // 2 second delay between retries
  } = options;

  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInInterviewMode, setIsInInterviewMode] = useState(false); // New state

  const recognitionRef = useRef<any>(null);
  const backupRecognitionRef = useRef<any>(null); // Backup recognition for seamless switching
  const isInitializedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const lastActivityRef = useRef<number>(Date.now());
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRestartingRef = useRef(false);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  
  // New refs for interview mode control
  const interviewModeRef = useRef(false); // Controls auto-restart behavior
  const sessionActiveRef = useRef(false); // Tracks if interview session is active

  // Check for speech recognition support and initialize
  useEffect(() => {
    const initializeSpeech = () => {
      setIsInitializing(true);
      setError(null);

      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          setIsSupported(false);
          setError("Speech recognition is not supported in this browser");
          setIsInitializing(false);
          return;
        }

        setIsSupported(true);
        // Initialize synchronously for faster startup
        initializeRecognition(SpeechRecognition);
        setIsInitializing(false);
      } catch (err) {
        console.error("🎤 Speech recognition initialization error:", err);
        setError("Failed to initialize speech recognition");
        setIsSupported(false);
        setIsInitializing(false);
      }
    };

    initializeSpeech();
  }, []);

  // Initialize speech recognition with improved error handling
  const initializeRecognition = useCallback((SpeechRecognition: any) => {
    if (isInitializedRef.current) return;

    try {
      const recognition = new SpeechRecognition();
      
      // Optimized recognition settings for better performance
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;
      recognition.maxAlternatives = maxAlternatives;
      
      // Add serviceURI for better performance (if available)
      if ('serviceURI' in recognition) {
        (recognition as any).serviceURI = 'wss://www.google.com/speech-api/full-duplex/v1';
      }

        recognition.onstart = () => {
          console.log("🎤 Speech recognition started - interview mode:", interviewModeRef.current);
          setIsListening(true);
          setError(null);
          lastActivityRef.current = Date.now();
          
          // Clear any existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          
          // Only start heartbeat and timeout if in interview mode
          if (interviewModeRef.current) {
            startHeartbeat();
            
            // Set extended timeout for interview sessions
            timeoutRef.current = setTimeout(() => {
              console.log("🎤 Interview session timeout - checking for activity");
              const timeSinceActivity = Date.now() - lastActivityRef.current;
              if (timeSinceActivity > 60000) { // 1 minute of complete silence
                handleTimeout();
              } else {
                // Reset timeout for another period
                timeoutRef.current = setTimeout(() => {
                  handleTimeout();
                }, timeout);
              }
            }, timeout);
          }
        };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        lastActivityRef.current = Date.now();
        
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
          console.log("🎤 Final transcript:", finalTranscript);
        }
        
        if (interimTranscript) {
          setInterimTranscript(interimTranscript);
          console.log("🎤 Interim transcript:", interimTranscript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // During interview mode, handle ALL errors silently to avoid interruptions
        if (interviewModeRef.current) {
          console.log("🎤 Interview mode: Handling error silently -", event.error);
          
          // Don't set any errors during interview mode - continue silently
          // Only log for debugging purposes
          console.log("🎤 Interview mode: Continuing silently after error -", event.error);
          return; // Don't set error or stop listening - continue silently
        } else {
          // Outside interview mode, handle errors normally
          console.error("🎤 Speech recognition error:", event.error);
          setError("Speech recognition error");
        }
        
        setIsListening(false);
        
        // Clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };

        recognition.onend = () => {
          console.log("🎤 Speech recognition ended - interview mode:", interviewModeRef.current, "session active:", sessionActiveRef.current);
          setIsListening(false);
          setInterimTranscript("");
          
          // Clear timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          
          // CRITICAL: Only auto-restart if in interview mode AND session is active
          if (interviewModeRef.current && sessionActiveRef.current && !isRestartingRef.current) {
            console.log("🎤 Auto-restarting - Interview mode active");
            restartRecognition();
          } else {
            console.log("🎤 Not restarting - Interview mode inactive or session ended");
            // Clear heartbeat when not in interview mode
            if (heartbeatRef.current) {
              clearInterval(heartbeatRef.current);
              heartbeatRef.current = null;
            }
          }
        };

      recognitionRef.current = recognition;
      isInitializedRef.current = true;
      
    } catch (err) {
      console.error("🎤 Failed to initialize speech recognition:", err);
      setError("Failed to initialize speech recognition");
      setIsSupported(false);
    }
  }, [continuous, interimResults, language, maxAlternatives, timeout, retryAttempts, retryDelay, isListening]);

  // Heartbeat - only runs during interview mode
  const startHeartbeat = useCallback(() => {
    // Clear existing heartbeat
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
    }
    
    // Only run heartbeat during interview mode
    heartbeatRef.current = setInterval(() => {
      if (interviewModeRef.current && sessionActiveRef.current && !isListening && !isRestartingRef.current) {
        console.log("🎤 Heartbeat: Restarting in interview mode");
        restartRecognition();
      } else if (!interviewModeRef.current) {
        // Clear heartbeat if not in interview mode
        if (heartbeatRef.current) {
          clearInterval(heartbeatRef.current);
          heartbeatRef.current = null;
        }
      }
    }, 10000); // Check every 10 seconds for even faster recovery
  }, [isListening]);

  // Restart function - only works in interview mode
  const restartRecognition = useCallback(() => {
    // Only restart if in interview mode and session is active
    if (!interviewModeRef.current || !sessionActiveRef.current || isRestartingRef.current) {
      console.log("🎤 Restart prevented - not in interview mode or session ended");
      return;
    }
    
    isRestartingRef.current = true;
    console.log("🎤 Restarting speech recognition for seamless interview");
    
    // Clear any existing restart timeout
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    // Try to start new recognition immediately, then stop old one
    try {
      if (recognitionRef.current && interviewModeRef.current && sessionActiveRef.current) {
        // Start new recognition first to minimize gap
        recognitionRef.current.start();
        console.log("🎤 Speech recognition restarted seamlessly");
        isRestartingRef.current = false;
        return;
      }
    } catch (err) {
      console.log("🎤 Immediate restart failed, trying stop-then-start approach");
    }
    
    // Fallback: stop then start
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (err) {
      console.error("🎤 Error stopping recognition before restart:", err);
    }
    
    // Restart with almost zero delay for continuous detection
    restartTimeoutRef.current = setTimeout(() => {
      try {
        if (recognitionRef.current && interviewModeRef.current && sessionActiveRef.current) {
          recognitionRef.current.start();
          console.log("🎤 Speech recognition restarted after stop");
        }
      } catch (err) {
        console.error("🎤 Error restarting recognition:", err);
        // If restart fails, try to recreate the recognition object
        setTimeout(() => {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (SpeechRecognition && interviewModeRef.current && sessionActiveRef.current) {
            initializeRecognition(SpeechRecognition);
            if (recognitionRef.current) {
              recognitionRef.current.start();
            }
          }
        }, 10); // Reduced from 50ms to 10ms
      }
      isRestartingRef.current = false;
    }, 1); // Almost zero delay (1ms) for continuous detection
  }, [continuous]);

  const handleTimeout = useCallback(() => {
    console.log("🎤 Interview session timed out");
    if (interviewModeRef.current) {
      restartRecognition();
    }
  }, [restartRecognition]);

  // NEW: Start Interview Session (replaces startListening)
  const startInterviewSession = useCallback(async () => {
    if (!recognitionRef.current || isListening) {
      return;
    }

    console.log("🎤 Starting Interview Session");
    
    try {
      setError(null);
      retryCountRef.current = 0;
      
      // Enable interview mode and activate session
      interviewModeRef.current = true;
      sessionActiveRef.current = true;
      setIsInInterviewMode(true);
      
      // Reset transcripts for new session
      setTranscript("");
      setInterimTranscript("");
      
      // Start recognition
      recognitionRef.current.start();
      console.log("🎤 Interview mode activated - auto-restart enabled");
      
    } catch (err) {
      console.error("🎤 Failed to start interview session:", err);
      setError("Failed to start interview session. Please try again.");
      
      // Retry logic for interview session
      if (retryCountRef.current < retryAttempts) {
        retryCountRef.current++;
        setTimeout(() => {
          if (recognitionRef.current && sessionActiveRef.current) {
            try {
              recognitionRef.current.start();
            } catch (retryErr) {
              console.error("🎤 Retry failed:", retryErr);
            }
          }
        }, 10); // Reduced from retryDelay to 10ms for faster retry
      }
    }
  }, [isListening, retryAttempts, retryDelay]);

  // NEW: Stop Interview Session (replaces stopListening)
  const stopInterviewSession = useCallback(() => {
    console.log("🎤 Stopping Interview Session");
    
    // Disable interview mode and deactivate session FIRST
    interviewModeRef.current = false;
    sessionActiveRef.current = false;
    setIsInInterviewMode(false);
    
    // Clear all timers and intervals
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Prevent any restart attempts
    isRestartingRef.current = false;
    
    // Stop recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort(); // Use abort for immediate stop
        console.log("🎤 Interview session ended - auto-restart disabled");
      } catch (err) {
        console.error("🎤 Failed to stop recognition:", err);
        try {
          recognitionRef.current.stop();
        } catch (stopErr) {
          console.error("🎤 Failed to stop recognition with stop():", stopErr);
        }
      }
    }
    
    setIsListening(false);
    setInterimTranscript("");
    retryCountRef.current = 0;
    
    console.log("🎤 Interview mode deactivated - no auto-restart");
  }, []);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setError(null);
    retryCountRef.current = 0;
  }, []);

  // Set language
  const setLanguage = useCallback((newLanguage: string) => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLanguage;
    }
  }, []);

  // Manual retry - only works during interview mode
  const retry = useCallback(async () => {
    if (!interviewModeRef.current) {
      console.log("🎤 Retry not available - not in interview mode");
      return;
    }
    
    console.log("🎤 Manual retry during interview");
    setError(null);
    retryCountRef.current = 0;
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("🎤 Error stopping before retry:", err);
      }
    }
    
    setTimeout(() => {
      if (sessionActiveRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error("🎤 Retry start failed:", err);
        }
      }
    }, 10); // Reduced from 500ms to 10ms for faster retry
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      // Disable interview mode
      interviewModeRef.current = false;
      sessionActiveRef.current = false;
      
      // Clear all timers
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      
      // Stop recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (err) {
          console.error("🎤 Error stopping recognition on cleanup:", err);
        }
      }
      
      // Stop backup recognition
      if (backupRecognitionRef.current) {
        try {
          backupRecognitionRef.current.abort();
        } catch (err) {
          console.error("🎤 Error stopping backup recognition on cleanup:", err);
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
    isInitializing,
    isInInterviewMode, // New state
    startInterviewSession, // Replaces startListening
    stopInterviewSession, // Replaces stopListening
    resetTranscript,
    setLanguage,
    retry,
  };
};

export default useImprovedSpeechRecognition;
