import { LucideIcon } from "lucide-react";

/**
 * User display information
 */
export interface UserDisplay {
  firstName?: string;
  email?: string;
}

/**
 * Interview type configuration
 */
export interface InterviewType {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

/**
 * Navigation item configuration
 */
export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isCollapsible?: boolean;
  children?: NavigationItem[];
}

/**
 * Incomplete interview data structure
 */
export interface IncompleteInterviewData {
  interviewId: string;
  interviewType: string;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  startTime: Date;
}

/**
 * Interview state data
 */
export interface InterviewState {
  interviewId: string;
  interviewType: string;
  isInterviewStarted: boolean;
  interviewStartTime: Date;
  timeElapsed: number;
  timeRemaining: number;
  currentQuestion: Record<string, unknown> | null;
  questionNumber: number;
  chatMessages: ChatMessage[];
  userAnswer: string;
  warningCount: number;
  warningStatus: WarningStatus;
  tabSwitchCount: number;
  proctoringViolations: ProctoringViolations;
}

/**
 * Chat message structure
 */
export interface ChatMessage {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

/**
 * Warning status structure
 */
export interface WarningStatus {
  warningCount: number;
  isTerminated: boolean;
  canContinue: boolean;
  lastWarningAt: Date | null;
}

/**
 * Proctoring violations structure
 */
export interface ProctoringViolations {
  tabSwitches: number;
  copyPasteCount: number;
  faceDetectionIssues: number;
}

/**
 * Interview form data
 */
export interface InterviewFormData {
  resumeId?: string;
  interviewType: string;
  level?: string;
  difficultyLevel?: string;
  jobRole?: string;
  interviewerId?: string;
  interviewer?: {
    name: string;
    experience: string;
    bio: string;
  };
}

/**
 * Sidebar state
 */
export interface SidebarState {
  isCollapsed: boolean;
  isMockInterviewOpen: boolean;
  isProfileOpen: boolean;
}

/**
 * Content view type
 */
export type ContentView = "interview" | "profile" | "settings" | "analytics" | "upload-questions" | "upload-company-questions" | "upload-title" | "cover-letter";

/**
 * Tab type for interview selection
 */
export type InterviewTab = "resume" | "job-description" | "topic" | "company";
