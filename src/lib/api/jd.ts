import axios, { AxiosResponse } from 'axios';
import { getAuthTokens } from '@/lib/cookies';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance for file uploads
const jdApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for file uploads
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor to add auth token
jdApiClient.interceptors.request.use(
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
export interface JobDescription {
  id: string;
  jdName: string;
  jdText: string;
  originalFileName: string | null;
  fileSize: number;
  fileType: 'pdf' | 'doc' | 'docx' | 'txt' | 'text' | 'pasted';
  uploadDate: string;
  parsedSuccessfully: boolean;
  parsingErrors: string[];
  textLength: number;
}

export interface JdListResponse {
  success: boolean;
  message: string;
  data: Omit<JobDescription, 'jdText'>[];
}

export interface JdResponse {
  success: boolean;
  message: string;
  data: JobDescription;
}

export interface JdUploadResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    jdName: string;
    originalFileName: string | null;
    fileSize: number;
    fileType: 'pdf' | 'doc' | 'docx' | 'txt' | 'text' | 'pasted';
    uploadDate: string;
    textLength: number;
  };
}

export interface JdUploadFileRequest {
  jd: File;
  jdName: string;
}

export interface JdUploadTextRequest {
  jdName: string;
  jdText: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

// Job Description API Service
export class JdApiService {
  // Upload JD file
  static async uploadJdFile(data: JdUploadFileRequest, onProgress?: (progress: number) => void): Promise<JdUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('jd', data.jd);
      formData.append('jdName', data.jdName);

      const response: AxiosResponse<JdUploadResponse> = await jdApiClient.post('/jd/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload Progress: ${percentCompleted}%`);
            if (onProgress) {
              onProgress(percentCompleted);
            }
          }
        },
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Upload JD text (pasted)
  static async uploadJdText(data: JdUploadTextRequest): Promise<JdUploadResponse> {
    try {
      const response: AxiosResponse<JdUploadResponse> = await jdApiClient.post('/jd/upload', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get all JDs for authenticated user
  static async getUserJds(): Promise<JdListResponse> {
    try {
      const response: AxiosResponse<JdListResponse> = await jdApiClient.get('/jd');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get specific JD by ID
  static async getJdById(id: string): Promise<JdResponse> {
    try {
      const response: AxiosResponse<JdResponse> = await jdApiClient.get(`/jd/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Delete JD by ID
  static async deleteJd(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> = await jdApiClient.delete(`/jd/${id}`);
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
export { jdApiClient };
