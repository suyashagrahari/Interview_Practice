import axios, { AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
export interface Title {
  _id?: string;
  id?: string;
  text: string;
  createdAt: string | Date;
}

export interface CreateTitlesResponse {
  success: boolean;
  message: string;
  data: {
    created: number;
    skipped: number;
    titles: Title[];
  };
}

export interface GetTitlesResponse {
  success: boolean;
  data: {
    titles: Title[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface DeleteTitleResponse {
  success: boolean;
  message: string;
  data: Title;
}

// Company Title API Service
export class CompanyTitleApiService {
  // Create company titles (bulk)
  static async createTitles(titles: Title[]): Promise<CreateTitlesResponse> {
    try {
      const titleTexts = titles.map(t => typeof t === 'string' ? t : t.text);
      const response: AxiosResponse<CreateTitlesResponse> = await apiClient.post(
        '/company-titles',
        { titles: titleTexts }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get all company titles
  static async getTitles(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<GetTitlesResponse> {
    try {
      const response: AxiosResponse<GetTitlesResponse> = await apiClient.get(
        '/company-titles',
        { params }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Delete company title
  static async deleteTitle(id: string): Promise<DeleteTitleResponse> {
    try {
      const response: AxiosResponse<DeleteTitleResponse> = await apiClient.delete(
        `/company-titles/${id}`
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

// Topic Title API Service
export class TopicTitleApiService {
  // Create topic titles (bulk)
  static async createTitles(titles: Title[]): Promise<CreateTitlesResponse> {
    try {
      const titleTexts = titles.map(t => typeof t === 'string' ? t : t.text);
      const response: AxiosResponse<CreateTitlesResponse> = await apiClient.post(
        '/topic-titles',
        { titles: titleTexts }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get all topic titles
  static async getTitles(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<GetTitlesResponse> {
    try {
      const response: AxiosResponse<GetTitlesResponse> = await apiClient.get(
        '/topic-titles',
        { params }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Delete topic title
  static async deleteTitle(id: string): Promise<DeleteTitleResponse> {
    try {
      const response: AxiosResponse<DeleteTitleResponse> = await apiClient.delete(
        `/topic-titles/${id}`
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

// Job Title API Service
export class JobTitleApiService {
  // Create job titles (bulk)
  static async createTitles(titles: Title[]): Promise<CreateTitlesResponse> {
    try {
      const titleTexts = titles.map(t => typeof t === 'string' ? t : t.text);
      const response: AxiosResponse<CreateTitlesResponse> = await apiClient.post(
        '/job-titles',
        { titles: titleTexts }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get all job titles
  static async getTitles(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<GetTitlesResponse> {
    try {
      const response: AxiosResponse<GetTitlesResponse> = await apiClient.get(
        '/job-titles',
        { params }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Delete job title
  static async deleteTitle(id: string): Promise<DeleteTitleResponse> {
    try {
      const response: AxiosResponse<DeleteTitleResponse> = await apiClient.delete(
        `/job-titles/${id}`
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

