// Centralized API exports
export * from './auth';
export * from './strapi';

// Re-export commonly used types
export type { User, AuthResponse, SignUpRequest, SignInRequest } from './auth';
export type { Category, Question, Technology, Author } from './strapi';
