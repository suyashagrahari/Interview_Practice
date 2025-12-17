/**
 * Experience level options
 */
export type ExperienceLevel = "0-2" | "3-4" | "5-6" | "7-8" | "9-10";

/**
 * Difficulty level options
 */
export type DifficultyLevel = "beginner" | "intermediate" | "expert";

/**
 * Question type options
 */
export type QuestionType = "technical" | "behavioral" | "coding" | "systemDesign" | "normal";

/**
 * Question data structure
 */
export interface QuestionData {
  id: string;
  topicName: string;
  experienceLevel: ExperienceLevel;
  difficultyLevel: DifficultyLevel;
  questionType?: QuestionType;
  questionText: string;
  expectedAnswer: string;
  keywords: string[];
  createdAt: Date;
}

/**
 * Form data for creating/editing questions
 */
export interface QuestionFormData {
  topicName: string;
  experienceLevel: ExperienceLevel;
  difficultyLevel: DifficultyLevel;
  questionType?: QuestionType;
  questionText: string;
  expectedAnswer: string;
  keywords: string[];
}

/**
 * Company Question data structure
 */
export interface CompanyQuestionData {
  id: string;
  companyName: string;
  jobRole: string;
  experienceLevel: ExperienceLevel;
  difficultyLevel: DifficultyLevel;
  questionType: QuestionType;
  questionText: string;
  expectedAnswer: string;
  keywords: string[];
  createdAt: Date;
}

/**
 * Form data for creating/editing company questions
 */
export interface CompanyQuestionFormData {
  companyName: string;
  jobRole: string;
  experienceLevel: ExperienceLevel;
  difficultyLevel: DifficultyLevel;
  questionType: QuestionType;
  questionText: string;
  expectedAnswer: string;
  keywords: string[];
}

/**
 * Publish payload structure
 */
export interface PublishPayload {
  questions: QuestionData[];
  totalQuestions: number;
  publishedAt: Date;
}

/**
 * Company Publish payload structure
 */
export interface CompanyPublishPayload {
  questions: CompanyQuestionData[];
  totalQuestions: number;
  publishedAt: Date;
}
