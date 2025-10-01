"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  initializeSpeechRecognition,
  getBrowserCompatibilityMessage,
  checkMicrophonePermission,
} from "@/utils/microphonePermissions";

interface SpeechRecognizerProps {
  onTranscript: (transcript: string) => void;
  onListeningChange: (isListening: boolean) => void;
  language?: string;
  continuous?: boolean;
  isRecording?: boolean;
  permissionsAlreadyGranted?: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const WebkitSpeechRecognizer: React.FC<SpeechRecognizerProps> = ({
  onTranscript,
  onListeningChange,
  language = "en-US",
  continuous = true,
  isRecording = false,
  permissionsAlreadyGranted = false,
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isInitializedRef = useRef(false);

  // Check for speech recognition support and initialize
  useEffect(() => {
    const initializeSpeech = async () => {
      try {
        console.log("🎤 Initializing speech recognition...");

        // If permissions were already granted in guidelines, skip permission request
        let result;
        if (permissionsAlreadyGranted) {
          console.log(
            "🎤 Permissions already granted, skipping permission request"
          );
          // Check if we can get SpeechRecognition constructor
          const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
          if (SpeechRecognition) {
            result = {
              success: true,
              SpeechRecognition,
            };
          } else {
            result = {
              success: false,
              error: "Speech recognition not supported in this browser",
            };
          }
        } else {
          result = await initializeSpeechRecognition();
        }

        if (result.success && result.SpeechRecognition) {
          setIsSupported(true);
          console.log("🎤 Native speech recognition supported");

          // Initialize recognition instance
          if (!isInitializedRef.current) {
            initializeRecognition(result.SpeechRecognition);
          }
        } else {
          setIsSupported(false);
          setError(result.error || "Speech recognition initialization failed");
          console.warn("🎤 Speech recognition not supported:", result.error);
        }
      } catch (error) {
        setIsSupported(false);
        setError("Failed to initialize speech recognition");
        console.error("🎤 Speech recognition initialization error:", error);
      }
    };

    initializeSpeech();
  }, [permissionsAlreadyGranted]);

  // Initialize speech recognition
  const initializeRecognition = useCallback(
    (SpeechRecognition: typeof window.SpeechRecognition) => {
      try {
        const recognition = new SpeechRecognition();

        // Configure recognition settings
        recognition.continuous = continuous;
        recognition.interimResults = true;
        recognition.lang = language;
        recognition.maxAlternatives = 1;

        // Event handlers
        recognition.onstart = () => {
          console.log("🎤 Speech recognition started");
          setIsListening(true);
          setError(null);
          onListeningChange(true);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = "";
          let interimTranscript = "";

          // Process all results
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;

            if (result.isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          // Update states
          if (finalTranscript) {
            setTranscript((prev) => prev + finalTranscript + " ");
            onTranscript(finalTranscript);
            console.log("🎤 Final transcript:", finalTranscript);
          }

          if (interimTranscript) {
            setInterimTranscript(interimTranscript);
            console.log("🎤 Interim transcript:", interimTranscript);
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error(
            "🎤 Speech recognition error:",
            event.error,
            event.message
          );

          switch (event.error) {
            case "no-speech":
              setError("No speech detected. Please try again.");
              break;
            case "audio-capture":
              setError(
                "Microphone not accessible. Please check your microphone permissions."
              );
              break;
            case "not-allowed":
              setError(
                "Microphone access denied. Please allow microphone access and refresh the page."
              );
              break;
            case "network":
              setError("Network error. Please check your internet connection.");
              break;
            case "service-not-allowed":
              setError("Speech recognition service not allowed.");
              break;
            case "bad-grammar":
              setError("Speech recognition grammar error.");
              break;
            default:
              setError(`Speech recognition error: ${event.error}`);
          }

          setIsListening(false);
          onListeningChange(false);
        };

        recognition.onend = () => {
          console.log("🎤 Speech recognition ended");
          setIsListening(false);
          setInterimTranscript("");
          onListeningChange(false);

          // Restart if continuous mode and still recording
          if (continuous && isRecording) {
            setTimeout(() => {
              if (isRecording && recognition) {
                try {
                  recognition.start();
                } catch (err) {
                  console.error("🎤 Failed to restart recognition:", err);
                }
              }
            }, 100);
          }
        };

        recognition.onnomatch = () => {
          console.log("🎤 No speech was recognized");
          setError(
            "No speech was recognized. Please try speaking more clearly."
          );
        };

        recognitionRef.current = recognition;
        isInitializedRef.current = true;

        console.log("🎤 Speech recognition initialized successfully");
      } catch (err) {
        console.error("🎤 Failed to initialize speech recognition:", err);
        setError("Failed to initialize speech recognition");
        setIsSupported(false);
      }
    },
    [continuous, language, isRecording, onListeningChange, onTranscript]
  );

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) {
      return;
    }

    try {
      console.log("🎤 Starting speech recognition...");
      setError(null);
      setTranscript("");
      setInterimTranscript("");
      recognitionRef.current.start();
    } catch (err) {
      console.error("🎤 Failed to start speech recognition:", err);
      setError("Failed to start speech recognition. Please try again.");
    }
  }, [isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) {
      return;
    }

    try {
      console.log("🎤 Stopping speech recognition...");
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

  // Auto-start/stop based on isRecording prop
  useEffect(() => {
    if (isSupported && recognitionRef.current) {
      if (isRecording && !isListening) {
        startListening();
      } else if (!isRecording && isListening) {
        stopListening();
      }
    }
  }, [isRecording, isSupported, isListening, startListening, stopListening]);

  // Cleanup on unmount
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

  // Update language when prop changes
  useEffect(() => {
    if (recognitionRef.current && isSupported) {
      recognitionRef.current.lang = language;
      console.log("🎤 Language updated to:", language);
    }
  }, [language, isSupported]);

  const retryInitialization = async () => {
    setError(null);
    try {
      const result = await initializeSpeechRecognition();
      if (result.success && result.SpeechRecognition) {
        setIsSupported(true);
        initializeRecognition(result.SpeechRecognition);
      } else {
        setError(result.error || "Retry failed");
      }
    } catch (err) {
      setError("Retry failed");
    }
  };

  if (!isSupported) {
    return (
      <div className="speech-not-supported bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-500 mr-2">⚠️</div>
          <div className="flex-1">
            <p className="text-red-800 font-medium">
              Speech recognition not supported
            </p>
            <p className="text-red-600 text-sm mt-1">
              {error ||
                "Please use Chrome, Edge, or Safari for the best experience."}
            </p>
            <p className="text-gray-600 text-xs mt-2">
              {getBrowserCompatibilityMessage()}
            </p>
          </div>
          <button
            onClick={retryInitialization}
            className="ml-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="speech-recognizer">
      {error && (
        <div className="error-message bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
          <div className="flex items-center">
            <div className="text-yellow-500 mr-2">⚠️</div>
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="status-indicator flex items-center justify-center p-3">
        <div
          className={`status-indicator flex items-center space-x-2 px-4 py-2 rounded-full ${
            isListening
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-gray-100 text-gray-600 border border-gray-200"
          }`}>
          <div
            className={`w-3 h-3 rounded-full ${
              isListening ? "bg-red-500 animate-pulse" : "bg-gray-400"
            }`}></div>
          <span className="text-sm font-medium">
            {isListening ? "Recording" : "Ready to Record"}
          </span>
        </div>
      </div>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
          <div>
            <strong>Transcript:</strong> {transcript}
          </div>
          {interimTranscript && (
            <div>
              <strong>Interim:</strong> <em>{interimTranscript}</em>
            </div>
          )}
          <div>
            <strong>Language:</strong> {language}
          </div>
          <div>
            <strong>Continuous:</strong> {continuous ? "Yes" : "No"}
          </div>
          <div>
            <strong>Recording:</strong> {isRecording ? "Yes" : "No"}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebkitSpeechRecognizer;
