// Interview Page Types
export interface InterviewPageProps {
  // Add any props if needed
}

export interface ChatMessage {
  id: string;
  type: "ai" | "user";
  message: string;
  timestamp: string;
  questionId?: string;
  answer?: string;
  analysis?: any; // Use proper AnswerAnalysis type from API
  isTranscribing?: boolean; // True when transcription is in progress
  isTranscribed?: boolean; // True when transcription completed successfully
  transcriptionFailed?: boolean; // True when transcription failed
}

export interface AvatarData {
  id: string;
  name: string;
  role: string;
  experience: string;
  rating: number;
  skills: readonly string[];
  imageSrc: string;
  videoSrc: string;
}

export interface AudioData {
  audioBase64: string;
  url: string;
  fileName: string;
  mimeType: string;
}

export interface CVViolations {
  multiplePersonIncidents: number;
  phoneDetections: number;
  totalViolations: number;
  violations: Array<{
    type: string;
    timestamp: Date;
    count: number;
  }>;
}

export interface CVDetectionPoint {
  timestamp: Date;
  peopleCount: number;
  phoneCount: number;
  violation: boolean;
  violationType?: string;
}

export interface CameraPermission {
  status: "pending" | "granted" | "denied";
  tested: boolean;
}

export interface QuestionData {
  question: string;
  answer: string;
}
