// TypeScript type definitions for Web Speech API

// Declare global interfaces and types
declare global {
  // Speech Recognition interfaces
  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }

  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    length: number;
    isFinal: boolean;
  }

  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
    start(): void;
    stop(): void;
    abort(): void;
  }

  interface SpeechRecognitionConstructor {
    new (): SpeechRecognition;
    prototype: SpeechRecognition;
  }

  // Extend Window interface
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }

  // Global variables
  var SpeechRecognition: SpeechRecognitionConstructor;
  var webkitSpeechRecognition: SpeechRecognitionConstructor;

  // Permission name types
  type PermissionName =
    | "geolocation"
    | "notifications"
    | "push"
    | "midi"
    | "camera"
    | "microphone"
    | "speaker"
    | "device-info"
    | "background-fetch"
    | "background-sync"
    | "bluetooth"
    | "persistent-storage"
    | "ambient-light-sensor"
    | "accelerometer"
    | "gyroscope"
    | "magnetometer"
    | "clipboard-read"
    | "clipboard-write"
    | "payment-handler";
}

export {};
