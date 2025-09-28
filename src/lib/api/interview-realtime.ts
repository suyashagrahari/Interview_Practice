import { apiClient } from './auth';

export interface InterviewQuestion {
  questionId: string;
  question: string;
  category: string;
  difficulty: string;
  expectedAnswer: string;
}

export interface AnswerAnalysis {
  relevance: number;
  completeness: number;
  technicalAccuracy: number;
  communication: number;
  overallRating: number;
  feedback: string;
  strengths: string[];
  areasForImprovement: string[];
}

export interface ProctoringData {
  tabSwitches: number;
  copyPasteCount: number;
  faceDetection: boolean;
  mobileDetection: boolean;
  laptopDetection: boolean;
  zoomIn: boolean;
  zoomOut: boolean;
  startTime: Date | null;
  endTime: Date | null;
  timeSpent: number;
}

export interface SubmitAnswerRequest {
  answer: string;
  timeSpent: number;
  startTime: Date;
  endTime: Date;
  tabSwitches: number;
  copyPasteCount: number;
  faceDetection: boolean;
  mobileDetection: boolean;
  laptopDetection: boolean;
  zoomIn: boolean;
  zoomOut: boolean;
  questionNumber: number;
}

export interface WarningStatus {
  warningCount: number;
  isTerminated: boolean;
  canContinue: boolean;
  lastWarningAt: string | null;
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  abusiveLanguage: boolean;
  inappropriateContent: boolean;
  professionalAppropriate: boolean;
  analysisDetails: string;
  detectedIssues: string[];
  severityScore: number;
  timestamp: string;
}

export interface WarningData {
  issued: boolean;
  isTerminated?: boolean;
  warningCount?: number;
  reason?: string;
  isProfessional?: boolean;
  containsInappropriateContent?: boolean;
  sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface SubmitAnswerResponse {
  success: boolean;
  message: string;
  data: {
    questionId: string;
    answer: string;
    analysis: AnswerAnalysis | null;
    nextQuestion: InterviewQuestion | null;
    questionNumber: number;
    warningStatus: WarningStatus;
    warning: WarningData;
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    hasWarning: boolean;
    // New fields from the updated response structure
    warningCount: number;
    warningIssued: boolean;
    interviewTerminated: boolean;
    canContinue: boolean;
    lastWarningAt: string | null;
    questionSentiment: string;
    debug: {
      analysisSuccess: boolean;
      sentimentSuccess: boolean;
      sentimentValue: string;
      questionUpdated: boolean;
    };
  };
}

export interface GenerateFirstQuestionRequest {
  interviewerBio: string;
}

export interface GenerateFirstQuestionResponse {
  success: boolean;
  message: string;
  data: {
    question: InterviewQuestion;
    interviewId: string;
    questionNumber: number;
  };
}

export const interviewRealtimeApi = {
  /**
   * Generate the first question (introduction) for an interview
   */
  generateFirstQuestion: async (
    interviewId: string,
    data: GenerateFirstQuestionRequest
  ): Promise<GenerateFirstQuestionResponse> => {
    const response = await apiClient.post(`/interview/${interviewId}/generate-first-question`, data);
    return response.data;
  },

  /**
   * Submit an answer and get analysis + next question
   */
  submitAnswer: async (
    interviewId: string,
    questionId: string,
    data: SubmitAnswerRequest
  ): Promise<SubmitAnswerResponse> => {
    const response = await apiClient.post(`/interview/${interviewId}/questions/${questionId}/submit-answer`, data);
    return response.data;
  },

  /**
   * Start an interview session
   */
  startInterview: async (interviewData: any) => {
    const response = await apiClient.post('/interview/start', interviewData);
    return response.data;
  },

  /**
   * Get interview by ID
   */
  getInterview: async (interviewId: string) => {
    const response = await apiClient.get(`/interview/${interviewId}`);
    return response.data;
  },

  /**
   * Update interview status
   */
  updateInterviewStatus: async (interviewId: string, status: string) => {
    const response = await apiClient.put(`/interview/${interviewId}/status`, { status });
    return response.data;
  },

  /**
   * End interview
   */
  endInterview: async (interviewId: string) => {
    const response = await apiClient.post(`/interview/${interviewId}/end`);
    return response.data;
  },
};
