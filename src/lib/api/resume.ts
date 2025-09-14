import axios, { AxiosResponse } from 'axios';
import { getAuthTokens } from '@/lib/cookies';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance for file uploads
const resumeApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for file uploads
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor to add auth token
resumeApiClient.interceptors.request.use(
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
export interface Resume {
  id: string;
  resumeName: string;
  resumeText: string;
  originalFileName: string;
  fileSize: number;
  fileType: 'pdf' | 'doc' | 'docx';
  uploadDate: string;
  parsedSuccessfully: boolean;
  parsingErrors: string[];
  textLength: number;
}

export interface ResumeListResponse {
  success: boolean;
  message: string;
  data: Omit<Resume, 'resumeText'>[];
}

export interface ResumeResponse {
  success: boolean;
  message: string;
  data: Resume;
}

export interface ResumeUploadResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    resumeName: string;
    originalFileName: string;
    fileSize: number;
    fileType: 'pdf' | 'doc' | 'docx';
    uploadDate: string;
    textLength: number;
  };
}

export interface ResumeUploadRequest {
  resume: File;
  resumeName: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

// Resume API Service
export class ResumeApiService {
  // Upload resume file
  static async uploadResume(data: ResumeUploadRequest): Promise<ResumeUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('resume', data.resume);
      formData.append('resumeName', data.resumeName);

      const response: AxiosResponse<ResumeUploadResponse> = await resumeApiClient.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          // Progress can be handled by the calling component
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload Progress: ${percentCompleted}%`);
          }
        },
      });
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get all resumes for authenticated user
  static async getUserResumes(): Promise<ResumeListResponse> {
    try {
      const response: AxiosResponse<ResumeListResponse> = await resumeApiClient.get('/resume');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get specific resume by ID
  static async getResumeById(id: string): Promise<ResumeResponse> {
    try {
      const response: AxiosResponse<ResumeResponse> = await resumeApiClient.get(`/resume/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Delete resume by ID
  static async deleteResume(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> = await resumeApiClient.delete(`/resume/${id}`);
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
export { resumeApiClient };
