// Base interview types
export type InterviewType = 'resume' | 'job-description' | 'company' | 'topic';

export type ExperienceLevel = 'entry' | 'intermediate' | 'senior' | 'lead';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'expert';

export type InterviewStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'paused';

// Base interview request interface
export interface BaseInterviewRequest {
  interviewType: 'technical' | 'behavioral';
  level: string;
  difficultyLevel: DifficultyLevel;
  jobRole: string;
  interviewerId: string;
  interviewer: {
    name: string;
    numberOfInterviewers: number;
    experience: string;
    bio: string;
    introduction?: string;
  };
  companyName?: string;
  experienceLevel?: string;
  skills?: string[];
  additionalNotes?: string;
  scheduled?: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
}

// Resume-based interview request
export interface ResumeBasedInterviewRequest extends BaseInterviewRequest {
  resumeId: string;
}

// Job description-based interview request
export interface JobDescriptionBasedInterviewRequest extends BaseInterviewRequest {
  jobDescriptionId?: string;
  jobDescriptionText?: string;
  jobTitle: string;
  companyName: string; // Required for JD-based interviews
  experienceLevel: string; // Required for JD-based interviews
}

// Company-based interview request
export interface CompanyBasedInterviewRequest extends BaseInterviewRequest {
  companyName: string; // Required for company-based interviews
  companyDescription?: string;
  companySize?: string;
  industry?: string;
  jobTitle?: string;
  experienceLevel?: string;
}

// Topic-based interview request
export interface TopicBasedInterviewRequest extends BaseInterviewRequest {
  topic: string; // Required for topic-based interviews
  topicDescription?: string;
  subtopics?: string[];
  difficultyLevel: DifficultyLevel; // Required for topic-based interviews
}

// Union type for all interview requests
export type InterviewRequest = 
  | ResumeBasedInterviewRequest 
  | JobDescriptionBasedInterviewRequest 
  | CompanyBasedInterviewRequest 
  | TopicBasedInterviewRequest;

// Interview response interfaces
export interface BaseInterviewResponse {
  success: boolean;
  message: string;
  data: {
    interviewId: string;
    status: InterviewStatus;
    startedAt?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    jobRole: string;
    interviewType: string;
    level: string;
    difficultyLevel: string;
  };
}

export interface ResumeBasedInterviewResponse extends BaseInterviewResponse {
  data: BaseInterviewResponse['data'] & {
    resumeName: string;
  };
}

export interface JobDescriptionBasedInterviewResponse extends BaseInterviewResponse {
  data: BaseInterviewResponse['data'] & {
    jobTitle: string;
    companyName: string;
    experienceLevel: string;
  };
}

export interface CompanyBasedInterviewResponse extends BaseInterviewResponse {
  data: BaseInterviewResponse['data'] & {
    companyName: string;
    industry?: string;
    companySize?: string;
  };
}

export interface TopicBasedInterviewResponse extends BaseInterviewResponse {
  data: BaseInterviewResponse['data'] & {
    topic: string;
    topicDescription?: string;
  };
}

// Union type for all interview responses
export type InterviewResponse = 
  | ResumeBasedInterviewResponse 
  | JobDescriptionBasedInterviewResponse 
  | CompanyBasedInterviewResponse 
  | TopicBasedInterviewResponse;

// API endpoint types
export type InterviewApiEndpoint = 
  | 'resume-based-interview'
  | 'jd-based-interview'
  | 'company-based-interview'
  | 'topic-based-interview';

// Helper type to get the correct request type based on interview type
export type GetInterviewRequest<T extends InterviewType> = 
  T extends 'resume' ? ResumeBasedInterviewRequest :
  T extends 'job-description' ? JobDescriptionBasedInterviewRequest :
  T extends 'company' ? CompanyBasedInterviewRequest :
  T extends 'topic' ? TopicBasedInterviewRequest :
  never;

// Helper type to get the correct response type based on interview type
export type GetInterviewResponse<T extends InterviewType> = 
  T extends 'resume' ? ResumeBasedInterviewResponse :
  T extends 'job-description' ? JobDescriptionBasedInterviewResponse :
  T extends 'company' ? CompanyBasedInterviewResponse :
  T extends 'topic' ? TopicBasedInterviewResponse :
  never;
