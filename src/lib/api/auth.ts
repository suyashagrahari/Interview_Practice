import axios, { AxiosResponse } from 'axios';
import { getAuthTokens, clearAuthCookies, setAuthTokens } from '@/lib/cookies';

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

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Only handle 401 errors for authenticated requests (not signin/signup)
    const isAuthEndpoint = originalRequest.url?.includes('/auth/signin') || 
                          originalRequest.url?.includes('/auth/signup') || 
                          originalRequest.url?.includes('/auth/google');
    
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      
      if (typeof window !== 'undefined') {
        const { refreshToken } = getAuthTokens();
        
        if (refreshToken) {
          try {
            // Try to refresh the token
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken
            });
            
            if (response.data.success) {
              const { token, refreshToken: newRefreshToken } = response.data.data;
              setAuthTokens(token, newRefreshToken);
              
              // Retry the original request with new token
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear auth data and redirect
            clearAuthCookies();
            window.location.href = '/';
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token, clear auth data and redirect
          clearAuthCookies();
          window.location.href = '/';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  provider: 'email' | 'google';
  profile?: {
    jobTitle: string;
    phone: string;
    website: string;
    linkedin: string;
    country: string;
    state: string;
    city: string;
    showStateOnResume: boolean;
    showCountryOnResume: boolean;
    showCityOnResume: boolean;
    summary: string;
    experiences: Array<{
      id: string;
      role: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      description: string;
      isCurrent: boolean;
    }>;
    projects: Array<{
      id: string;
      title: string;
      organization: string;
      startDate: string;
      endDate: string;
      url: string;
      description: string;
    }>;
    educations: Array<{
      id: string;
      degree: string;
      institution: string;
      location: string;
      graduationDate: string;
      minor?: string;
      gpa?: string;
      additionalInfo?: string;
    }>;
    skills: Array<{
      id: string;
      name: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface GoogleAuthRequest {
  credential: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Auth API Service
export class AuthApiService {
  // Sign up with email and password
  static async signUp(data: SignUpRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.post('/auth/signup', data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Sign in with email and password
  static async signIn(data: SignInRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.post('/auth/signin', data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Sign in with Google
  static async signInWithGoogle(data: GoogleAuthRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.post('/auth/google', data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Refresh token
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const { refreshToken } = getAuthTokens();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response: AxiosResponse<AuthResponse> = await apiClient.post('/auth/refresh', {
        refreshToken
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get current user profile
  static async getProfile(): Promise<{ success: boolean; data: User }> {
    try {
      const response: AxiosResponse<{ success: boolean; data: User }> = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Update user profile
  static async updateProfile(data: any): Promise<{ success: boolean; data: User; message: string }> {
    try {
      const response: AxiosResponse<{ success: boolean; data: User; message: string }> = await apiClient.put('/auth/profile', data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Change password
  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> = await apiClient.put('/auth/change-password', data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Forgot password
  static async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Reset password
  static async resetPassword(data: {
    token: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> = await apiClient.post('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Logout
  static async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const { refreshToken } = getAuthTokens();
      const response: AxiosResponse<{ success: boolean; message: string }> = await apiClient.post('/auth/logout', {
        refreshToken
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Verify email
  static async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> = await apiClient.post('/auth/verify-email', { token });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Resend verification email
  static async resendVerificationEmail(): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> = await apiClient.post('/auth/resend-verification');
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
export { apiClient };
