"use client";

import React, { useState } from "react";
import WebkitSpeechRecognizer from "./WebkitSpeechRecognizer";

const SpeechTestComponent: React.FC = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleTranscript = (newTranscript: string) => {
    setTranscript((prev) => prev + " " + newTranscript);
    console.log("🎤 New transcript:", newTranscript);
  };

  const handleListeningChange = (listening: boolean) => {
    setIsListening(listening);
    console.log("🎤 Listening state:", listening);
  };

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  const clearTranscript = () => {
    setTranscript("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Speech Recognition Test
      </h2>

      {/* Speech Recognizer */}
      <div className="mb-6">
        <WebkitSpeechRecognizer
          onTranscript={handleTranscript}
          onListeningChange={handleListeningChange}
          language="en-US"
          continuous={true}
          isRecording={isRecording}
        />
      </div>

      {/* Controls */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={toggleRecording}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isRecording
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>

        <button
          onClick={clearTranscript}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors">
          Clear Transcript
        </button>
      </div>

      {/* Status */}
      <div className="mb-4 p-3 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Status:</strong>{" "}
          {isListening ? "Listening..." : "Not listening"}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Recording:</strong> {isRecording ? "Yes" : "No"}
        </p>
      </div>

      {/* Transcript Display */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          Transcript:
        </h3>
        <div className="min-h-[200px] p-4 bg-gray-50 border rounded-lg">
          {transcript ? (
            <p className="text-gray-800 whitespace-pre-wrap">{transcript}</p>
          ) : (
            <p className="text-gray-500 italic">
              Start recording to see your speech converted to text...
            </p>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Instructions:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Click "Start Recording" to begin speech recognition</li>
          <li>Speak clearly into your microphone</li>
          <li>Your speech will be converted to text in real-time</li>
          <li>Click "Stop Recording" to end the session</li>
          <li>Use "Clear Transcript" to reset the text</li>
        </ul>
      </div>
    </div>
  );
};

export default SpeechTestComponent;
