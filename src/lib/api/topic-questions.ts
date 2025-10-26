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
export interface TopicQuestion {
  _id?: string;
  topicName: string;
  experienceLevel: '0-2' | '3-4' | '5-6' | '7-8' | '9-10';
  difficultyLevel: 'beginner' | 'intermediate' | 'expert';
  questionText: string;
  expectedAnswer: string;
  keywords: string[];
  createdAt?: string | Date;
}

export interface UploadTopicQuestionsPayload {
  questions: Array<{
    topicName: string;
    experienceLevel: string;
    difficultyLevel: string;
    questionText: string;
    expectedAnswer: string;
    keywords: string[];
    createdAt?: Date;
  }>;
}

export interface UploadTopicQuestionsResponse {
  success: boolean;
  message: string;
  data: {
    totalQuestions: number;
    topics: Array<{
      topicName: string;
      collectionName: string;
      count: number;
    }>;
  };
}

export interface GetTopicQuestionsResponse {
  success: boolean;
  data: {
    questions: TopicQuestion[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Topic Question API Service
export class TopicQuestionApiService {
  // Upload topic questions (bulk)
  static async uploadQuestions(
    payload: UploadTopicQuestionsPayload
  ): Promise<UploadTopicQuestionsResponse> {
    try {
      const response: AxiosResponse<UploadTopicQuestionsResponse> = await apiClient.post(
        '/topic-questions/upload',
        payload
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get questions for a specific topic
  static async getQuestions(
    topicName: string,
    params?: {
      page?: number;
      limit?: number;
      difficultyLevel?: string;
      experienceLevel?: string;
    }
  ): Promise<GetTopicQuestionsResponse> {
    try {
      const response: AxiosResponse<GetTopicQuestionsResponse> = await apiClient.get(
        `/topic-questions/${encodeURIComponent(topicName)}`,
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
