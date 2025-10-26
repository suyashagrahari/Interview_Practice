import axios, { AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased for bulk uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const { getAuthTokens } = require('@/lib/cookies');
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
export interface CompanyQuestion {
  _id?: string;
  companyName: string;
  jobRole: string;
  experienceLevel: '0-2' | '3-4' | '5-6' | '7-8' | '9-10';
  difficultyLevel: 'beginner' | 'intermediate' | 'expert';
  questionType: 'Code' | 'SystemDesign' | 'Normal';
  questionText: string;
  expectedAnswer: string;
  keywords: string[];
  createdAt?: string | Date;
}

export interface UploadCompanyQuestionsPayload {
  questions: Array<{
    companyName: string;
    jobRole: string;
    experienceLevel: string;
    difficultyLevel: string;
    questionType: string;
    questionText: string;
    expectedAnswer: string;
    keywords: string[];
    createdAt?: Date;
  }>;
}

export interface UploadCompanyQuestionsResponse {
  success: boolean;
  message: string;
  data: {
    totalQuestions: number;
    companies: Array<{
      companyName: string;
      collectionName: string;
      count: number;
    }>;
  };
}

export interface GetCompanyQuestionsResponse {
  success: boolean;
  data: {
    questions: CompanyQuestion[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Company Question API Service
export class CompanyQuestionApiService {
  // Upload company questions (bulk)
  static async uploadQuestions(
    payload: UploadCompanyQuestionsPayload
  ): Promise<UploadCompanyQuestionsResponse> {
    try {
      const response: AxiosResponse<UploadCompanyQuestionsResponse> = await apiClient.post(
        '/company-questions/upload',
        payload
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get questions for a specific company
  static async getQuestions(
    companyName: string,
    params?: {
      page?: number;
      limit?: number;
      difficultyLevel?: string;
      experienceLevel?: string;
      questionType?: string;
      jobRole?: string;
    }
  ): Promise<GetCompanyQuestionsResponse> {
    try {
      const response: AxiosResponse<GetCompanyQuestionsResponse> = await apiClient.get(
        `/company-questions/${encodeURIComponent(companyName)}`,
        { params }
      );
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
      return apiError;
    }
    
    if (error.request) {
      return new Error('Network error. Please check your connection.');
    }
    
    return new Error(error.message || 'An unexpected error occurred');
  }
}
