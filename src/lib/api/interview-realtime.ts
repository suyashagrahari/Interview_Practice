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
    const response = await apiClient.post(`/resume-interview/${interviewId}/generate-first-question`, data);
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
    const response = await apiClient.post(`/resume-interview/${interviewId}/questions/${questionId}/submit-answer`, data);
    return response.data;
  },

  /**
   * Start an interview session (Resume-based)
   */
  startInterview: async (interviewData: any) => {
    const response = await apiClient.post('/resume-interview/start', interviewData);
    return response.data;
  },

  /**
   * Get interview by ID (Resume-based)
   */
  getInterview: async (interviewId: string) => {
    const response = await apiClient.get(`/resume-interview/${interviewId}`);
    return response.data;
  },

  /**
   * Update interview status (Resume-based)
   */
  updateInterviewStatus: async (interviewId: string, status: string) => {
    const response = await apiClient.put(`/resume-interview/${interviewId}/status`, { status });
    return response.data;
  },

  /**
   * End interview (Resume-based)
   */
  endInterview: async (interviewId: string) => {
    const response = await apiClient.post(`/resume-interview/${interviewId}/end`);
    return response.data;
  },

  /**
   * Check for active/incomplete resume-based interview for current user
   * This works across devices - if user has an active interview on any device, it will be returned
   * Enhanced with user-level tracking
   */
  checkActiveInterview: async (): Promise<{
    success: boolean;
    hasActiveInterview: boolean;
    data: {
      interviewId: string;
      interviewType: string;
      interviewSourceType?: string;
      startTime: string;
      expectedEndTime?: string;
      currentQuestionNumber: number;
      totalQuestions: number;
      answeredQuestions?: number;
      timeElapsed: number; // in seconds
      timeRemaining: number; // in seconds
      isExpired: boolean;
      status?: string;
      currentQuestion: InterviewQuestion | null;
      chatHistory: Array<{
        type: 'ai' | 'user';
        message: string;
        timestamp: string;
      }>;
      warningCount: number;
      isTerminated?: boolean;
      tabSwitchCount: number;
      violations: {
        tabSwitches: number;
        copyPasteCount: number;
        faceDetectionIssues?: number;
        multiplePersonDetections?: number;
        phoneDetections?: number;
      };
      lastActivityAt?: string;
      isActive?: boolean;
      isCompleted?: boolean;
      jobRole?: string;
      level?: string;
      difficultyLevel?: string;
      interviewerName?: string;
    } | null;
  }> => {
    const response = await apiClient.get('/resume-interview/check-active');
    return response.data;
  },

  /**
   * Resume an active resume-based interview from any device
   * Returns complete interview state to restore on client
   */
  resumeInterview: async (interviewId: string): Promise<{
    success: boolean;
    data: {
      interviewId: string;
      interviewType: string;
      startTime: string;
      currentQuestionNumber: number;
      currentQuestion: InterviewQuestion;
      chatHistory: Array<any>;
      timeRemaining: number;
      warningCount: number;
      violations: any;
    };
  }> => {
    const response = await apiClient.get(`/resume-interview/resume/${interviewId}`);
    return response.data;
  },

  /**
   * Get expected answer (hint) for a question in resume-based interview
   */
  getExpectedAnswer: async (interviewId: string, questionId: string) => {
    const response = await apiClient.get(`/resume-interview/${interviewId}/questions/${questionId}/hint`);
    return response.data;
  },
};
