import axios, { AxiosResponse } from 'axios';
import { getAuthTokens } from '@/lib/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/cover-letter`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const { accessToken } = getAuthTokens();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export interface CoverLetterPayload {
  resumeText?: string;
  jobDescription?: string;
  targetJobTitle?: string;
  companyName?: string;
}

export interface CoverLetterResponse {
  success: boolean;
  mode: 'resume' | 'jd' | 'both';
  html: string;
}

export const coverLetterApi = {
  fromResume: async (payload: CoverLetterPayload): Promise<CoverLetterResponse> => {
    const res: AxiosResponse<CoverLetterResponse> = await apiClient.post('/from-resume', payload);
    return res.data;
  },
  fromJd: async (payload: CoverLetterPayload): Promise<CoverLetterResponse> => {
    const res: AxiosResponse<CoverLetterResponse> = await apiClient.post('/from-jd', payload);
    return res.data;
  },
  fromBoth: async (payload: CoverLetterPayload): Promise<CoverLetterResponse> => {
    const res: AxiosResponse<CoverLetterResponse> = await apiClient.post('/from-both', payload);
    return res.data;
  },
  extractText: async (file: File): Promise<{ success: boolean; text: string; length: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/extract-text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};


