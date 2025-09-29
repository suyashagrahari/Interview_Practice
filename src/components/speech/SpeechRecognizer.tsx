"use client";

import React, { useState, useEffect, useCallback } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface SpeechRecognizerProps {
  onTranscript: (transcript: string) => void;
  onListeningChange: (isListening: boolean) => void;
  language?: string;
  continuous?: boolean;
  isRecording?: boolean;
}

const SpeechRecognizer: React.FC<SpeechRecognizerProps> = ({
  onTranscript,
  onListeningChange,
  language = "en-US",
  continuous = true,
  isRecording = false,
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  useEffect(() => {
    setIsSupported(browserSupportsSpeechRecognition && isMicrophoneAvailable);
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  useEffect(() => {
    onListeningChange(listening);
  }, [listening, onListeningChange]);

  const startListening = useCallback(() => {
    try {
      SpeechRecognition.startListening({
        continuous,
        language,
        interimResults: true,
      });
      setError(null);
    } catch (err) {
      setError("Failed to start speech recognition");
      console.error("Speech recognition error:", err);
    }
  }, [continuous, language]);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
  }, []);

  // Auto-start/stop based on isRecording prop
  useEffect(() => {
    if (isRecording && isSupported) {
      startListening();
    } else if (!isRecording && listening) {
      stopListening();
    }
  }, [isRecording, isSupported, startListening, stopListening, listening]);

  if (!isSupported) {
    return (
      <div className="speech-not-supported">
        <p>Speech recognition is not supported in this browser.</p>
        <p>Please use Chrome, Edge, or Safari for the best experience.</p>
      </div>
    );
  }

  return (
    <div className="speech-recognizer">
      {error && <div className="error-message">{error}</div>}

      <div className="status-indicator">
        <span className={`status ${listening ? "recording" : "idle"}`}>
          {listening ? "🔴 Recording" : "⚫ Stopped"}
        </span>
      </div>
    </div>
  );
};

export default SpeechRecognizer;
