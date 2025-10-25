import axios, { AxiosResponse } from 'axios';
import { getAuthTokens } from '@/lib/cookies';
import {
  InterviewType,
  InterviewApiEndpoint,
  GetInterviewRequest,
  GetInterviewResponse,
  ResumeInterviewRequest,
  JobDescriptionBasedInterviewRequest,
  CompanyBasedInterviewRequest,
  TopicBasedInterviewRequest,
  ResumeInterviewResponse,
  JobDescriptionBasedInterviewResponse,
  CompanyBasedInterviewResponse,
  TopicBasedInterviewResponse,
} from '@/types/interview-types';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance for interview types API
const interviewTypesApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
interviewTypesApiClient.interceptors.request.use(
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

// Helper function to get API endpoint based on interview type
const getApiEndpoint = (interviewType: InterviewType): InterviewApiEndpoint => {
  switch (interviewType) {
    case 'resume':
      return 'resume-interview';
    case 'job-description':
      return 'job-discription-interview';
    case 'company':
      return 'company-based-interview';
    case 'topic':
      return 'topic-based-interview';
    default:
      throw new Error(`Unsupported interview type: ${interviewType}`);
  }
};

// Generic interview API service
export class InterviewTypeApiService {
  // Start a new interview based on type
  static async startInterview<T extends InterviewType>(
    interviewType: T,
    data: GetInterviewRequest<T>
  ): Promise<GetInterviewResponse<T>> {
    try {
      const endpoint = getApiEndpoint(interviewType);
      const response: AxiosResponse<GetInterviewResponse<T>> = await interviewTypesApiClient.post(
        `/${endpoint}/start`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get all interviews for authenticated user based on type
  static async getUserInterviews<T extends InterviewType>(
    interviewType: T,
    params?: {
      status?: string;
      limit?: number;
      page?: number;
    }
  ) {
    try {
      const endpoint = getApiEndpoint(interviewType);
      const response = await interviewTypesApiClient.get(`/${endpoint}`, { params });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get specific interview by ID based on type
  static async getInterviewById<T extends InterviewType>(
    interviewType: T,
    id: string
  ) {
    try {
      const endpoint = getApiEndpoint(interviewType);
      const response = await interviewTypesApiClient.get(`/${endpoint}/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Update interview status based on type
  static async updateInterviewStatus<T extends InterviewType>(
    interviewType: T,
    id: string,
    data: { status: string }
  ) {
    try {
      const endpoint = getApiEndpoint(interviewType);
      const response = await interviewTypesApiClient.put(`/${endpoint}/${id}/status`, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Check for active interview based on type
  static async checkActiveInterview<T extends InterviewType>(interviewType: T) {
    try {
      const endpoint = getApiEndpoint(interviewType);
      const response = await interviewTypesApiClient.get(`/${endpoint}/check-active`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Resume interview based on type
  static async resumeInterview<T extends InterviewType>(
    interviewType: T,
    id: string
  ) {
    try {
      const endpoint = getApiEndpoint(interviewType);
      const response = await interviewTypesApiClient.post(`/${endpoint}/${id}/resume`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Generate first question based on type
  static async generateFirstQuestion<T extends InterviewType>(
    interviewType: T,
    id: string,
    data: any
  ) {
    try {
      const endpoint = getApiEndpoint(interviewType);
      const response = await interviewTypesApiClient.post(`/${endpoint}/${id}/generate-first-question`, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Submit answer based on type
  static async submitAnswer<T extends InterviewType>(
    interviewType: T,
    id: string,
    questionId: string,
    data: any
  ) {
    try {
      const endpoint = getApiEndpoint(interviewType);
      const response = await interviewTypesApiClient.post(
        `/${endpoint}/${id}/questions/${questionId}/submit-answer`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // End interview based on type
  static async endInterview<T extends InterviewType>(
    interviewType: T,
    id: string
  ) {
    try {
      const endpoint = getApiEndpoint(interviewType);
      const response = await interviewTypesApiClient.post(`/${endpoint}/${id}/end`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Delete interview based on type
  static async deleteInterview<T extends InterviewType>(
    interviewType: T,
    id: string
  ) {
    try {
      const endpoint = getApiEndpoint(interviewType);
      const response = await interviewTypesApiClient.delete(`/${endpoint}/${id}`);
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

// Specific interview type services for easier usage
export class ResumeInterviewApiService {
  static async startInterview(data: ResumeInterviewRequest): Promise<ResumeInterviewResponse> {
    return InterviewTypeApiService.startInterview('resume', data);
  }

  static async getUserInterviews(params?: { status?: string; limit?: number; page?: number }) {
    return InterviewTypeApiService.getUserInterviews('resume', params);
  }

  static async getInterviewById(id: string) {
    return InterviewTypeApiService.getInterviewById('resume', id);
  }

  static async checkActiveInterview() {
    return InterviewTypeApiService.checkActiveInterview('resume');
  }

  static async resumeInterview(id: string) {
    return InterviewTypeApiService.resumeInterview('resume', id);
  }

  static async generateFirstQuestion(id: string, data: any) {
    return InterviewTypeApiService.generateFirstQuestion('resume', id, data);
  }

  static async submitAnswer(id: string, questionId: string, data: any) {
    return InterviewTypeApiService.submitAnswer('resume', id, questionId, data);
  }

  static async endInterview(id: string) {
    return InterviewTypeApiService.endInterview('resume', id);
  }

  static async deleteInterview(id: string) {
    return InterviewTypeApiService.deleteInterview('resume', id);
  }
}

export class JobDescriptionBasedInterviewApiService {
  static async startInterview(data: JobDescriptionBasedInterviewRequest): Promise<JobDescriptionBasedInterviewResponse> {
    return InterviewTypeApiService.startInterview('job-description', data);
  }

  static async getUserInterviews(params?: { status?: string; limit?: number; page?: number }) {
    return InterviewTypeApiService.getUserInterviews('job-description', params);
  }

  static async getInterviewById(id: string) {
    return InterviewTypeApiService.getInterviewById('job-description', id);
  }

  static async checkActiveInterview() {
    return InterviewTypeApiService.checkActiveInterview('job-description');
  }

  static async resumeInterview(id: string) {
    return InterviewTypeApiService.resumeInterview('job-description', id);
  }

  static async generateFirstQuestion(id: string, data: any) {
    return InterviewTypeApiService.generateFirstQuestion('job-description', id, data);
  }

  static async submitAnswer(id: string, questionId: string, data: any) {
    return InterviewTypeApiService.submitAnswer('job-description', id, questionId, data);
  }

  static async endInterview(id: string) {
    return InterviewTypeApiService.endInterview('job-description', id);
  }

  static async deleteInterview(id: string) {
    return InterviewTypeApiService.deleteInterview('job-description', id);
  }
}

export class CompanyBasedInterviewApiService {
  static async startInterview(data: CompanyBasedInterviewRequest): Promise<CompanyBasedInterviewResponse> {
    return InterviewTypeApiService.startInterview('company', data);
  }

  static async getUserInterviews(params?: { status?: string; limit?: number; page?: number }) {
    return InterviewTypeApiService.getUserInterviews('company', params);
  }

  static async getInterviewById(id: string) {
    return InterviewTypeApiService.getInterviewById('company', id);
  }

  static async checkActiveInterview() {
    return InterviewTypeApiService.checkActiveInterview('company');
  }

  static async resumeInterview(id: string) {
    return InterviewTypeApiService.resumeInterview('company', id);
  }

  static async generateFirstQuestion(id: string, data: any) {
    return InterviewTypeApiService.generateFirstQuestion('company', id, data);
  }

  static async submitAnswer(id: string, questionId: string, data: any) {
    return InterviewTypeApiService.submitAnswer('company', id, questionId, data);
  }

  static async endInterview(id: string) {
    return InterviewTypeApiService.endInterview('company', id);
  }

  static async deleteInterview(id: string) {
    return InterviewTypeApiService.deleteInterview('company', id);
  }
}

export class TopicBasedInterviewApiService {
  static async startInterview(data: TopicBasedInterviewRequest): Promise<TopicBasedInterviewResponse> {
    return InterviewTypeApiService.startInterview('topic', data);
  }

  static async getUserInterviews(params?: { status?: string; limit?: number; page?: number }) {
    return InterviewTypeApiService.getUserInterviews('topic', params);
  }

  static async getInterviewById(id: string) {
    return InterviewTypeApiService.getInterviewById('topic', id);
  }

  static async checkActiveInterview() {
    return InterviewTypeApiService.checkActiveInterview('topic');
  }

  static async resumeInterview(id: string) {
    return InterviewTypeApiService.resumeInterview('topic', id);
  }

  static async generateFirstQuestion(id: string, data: any) {
    return InterviewTypeApiService.generateFirstQuestion('topic', id, data);
  }

  static async submitAnswer(id: string, questionId: string, data: any) {
    return InterviewTypeApiService.submitAnswer('topic', id, questionId, data);
  }

  static async endInterview(id: string) {
    return InterviewTypeApiService.endInterview('topic', id);
  }

  static async deleteInterview(id: string) {
    return InterviewTypeApiService.deleteInterview('topic', id);
  }
}

// Export the API client for direct use if needed
export { interviewTypesApiClient };
