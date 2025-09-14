// Centralized API exports
export * from './auth';
export * from './strapi';
export * from './resume';
export * from './interview';

// Re-export commonly used types
export type { User, AuthResponse, SignUpRequest, SignInRequest } from './auth';
export type { Category, Question, Technology, Author } from './strapi';
export type { Resume, ResumeUploadResponse, ResumeListResponse, ResumeResponse } from './resume';
export type { Interview, StartInterviewRequest, StartInterviewResponse, InterviewListResponse, InterviewResponse } from './interview';
