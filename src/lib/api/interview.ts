import axios, { AxiosResponse } from 'axios';
import { getAuthTokens } from '@/lib/cookies';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance for interview API
const interviewApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
interviewApiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const { accessToken } = getAuthTokens();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Types
export interface Interview {
  id: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'paused';
  interviewType: 'technical' | 'behavioral';
  level: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'expert';
  jobRole: string;
  interviewerId: string;
  interviewer: {
    name: string;
    numberOfInterviewers: number;
    experience: string;
    bio: string;
  };
  companyName: string;
  experienceLevel: string;
  skills: string[];
  additionalNotes: string;
  scheduled: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
  startedAt?: string;
  completedAt?: string;
  totalDuration: number;
  resume: {
    id: string;
    name: string;
    originalFileName: string;
    text: string;
  };
  questions: Question[];
  overallAnalysis: OverallAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  questionId: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswer: string;
  answer: string;
  answerAnalysis: AnswerAnalysis;
  timeSpent: number;
  answeredAt?: string;
  isAnswered: boolean;
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

export interface OverallAnalysis {
  totalQuestions: number;
  answeredQuestions: number;
  averageRating: number;
  strengths: string[];
  areasForImprovement: string[];
  overallFeedback: string;
  recommendation: 'strong_hire' | 'hire' | 'no_hire' | 'strong_no_hire';
  confidenceScore: number;
}

export interface StartInterviewRequest {
  resumeId: string;
  interviewType: 'technical' | 'behavioral';
  level: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'expert';
  jobRole: string;
  interviewerId: string;
  interviewer: {
    name: string;
    numberOfInterviewers: number;
    experience: string;
    bio: string;
  };
  companyName?: string;
  experienceLevel?: string;
  skills?: string[];
  additionalNotes?: string;
  scheduled?: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
}

export interface StartInterviewResponse {
  success: boolean;
  message: string;
  data: {
    interviewId: string;
    status: string;
    startedAt?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    resumeName: string;
    jobRole: string;
    interviewType: string;
    level: string;
    difficultyLevel: string;
  };
}

export interface InterviewListResponse {
  success: boolean;
  message: string;
  data: {
    interviews: Omit<Interview, 'questions' | 'resume'>[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalInterviews: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface InterviewResponse {
  success: boolean;
  message: string;
  data: Interview;
}

export interface UpdateStatusRequest {
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'paused';
}

export interface AddQuestionRequest {
  questionId: string;
  question: string;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  expectedAnswer?: string;
}

export interface UpdateAnswerRequest {
  answer: string;
  timeSpent?: number;
}

export interface UpdateAnswerAnalysisRequest {
  relevance?: number;
  completeness?: number;
  technicalAccuracy?: number;
  communication?: number;
  overallRating?: number;
  feedback?: string;
  strengths?: string[];
  areasForImprovement?: string[];
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

// Interview API Service
export class InterviewApiService {
  // Start a new interview
  static async startInterview(data: StartInterviewRequest): Promise<StartInterviewResponse> {
    try {
      const response: AxiosResponse<StartInterviewResponse> = await interviewApiClient.post('/interview/start', data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get all interviews for authenticated user
  static async getUserInterviews(params?: {
    status?: string;
    limit?: number;
    page?: number;
  }): Promise<InterviewListResponse> {
    try {
      const response: AxiosResponse<InterviewListResponse> = await interviewApiClient.get('/interview', {
        params
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get specific interview by ID
  static async getInterviewById(id: string): Promise<InterviewResponse> {
    try {
      const response: AxiosResponse<InterviewResponse> = await interviewApiClient.get(`/interview/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Update interview status
  static async updateInterviewStatus(id: string, data: UpdateStatusRequest): Promise<{ success: boolean; message: string; data: any }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string; data: any }> = await interviewApiClient.put(`/interview/${id}/status`, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Add question to interview
  static async addQuestion(id: string, data: AddQuestionRequest): Promise<{ success: boolean; message: string; data: any }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string; data: any }> = await interviewApiClient.post(`/interview/${id}/questions`, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Update answer for a question
  static async updateAnswer(id: string, questionId: string, data: UpdateAnswerRequest): Promise<{ success: boolean; message: string; data: any }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string; data: any }> = await interviewApiClient.put(`/interview/${id}/questions/${questionId}/answer`, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Update answer analysis
  static async updateAnswerAnalysis(id: string, questionId: string, data: UpdateAnswerAnalysisRequest): Promise<{ success: boolean; message: string; data: any }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string; data: any }> = await interviewApiClient.put(`/interview/${id}/questions/${questionId}/analysis`, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Delete interview
  static async deleteInterview(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> = await interviewApiClient.delete(`/interview/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Error handling helper
  private static handleError(error: any): Error {
    if (error.response?.data) {
      const errorMessage = error.response.data.message || 'An error occurred';
      const apiError = new Error(errorMessage);
      (apiError as any).response = error.response;
      (apiError as any).errors = error.response.data.errors;
      return apiError;
    }
    
    if (error.request) {
      return new Error('Network error. Please check your connection.');
    }
    
    return new Error(error.message || 'An unexpected error occurred');
  }
}

// Export the API client for direct use if needed
export { interviewApiClient };
