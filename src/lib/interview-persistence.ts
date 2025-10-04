/**
 * Interview Session Persistence Utility
 * Handles saving and restoring interview state across page refreshes
 */

import { InterviewQuestion, AnswerAnalysis, WarningData, WarningStatus } from "@/lib/api/interview-realtime";

const STORAGE_KEYS = {
  INTERVIEW_ID: 'current-interview-id',
  INTERVIEW_STATE: 'current-interview-state',
  INTERVIEW_START_TIME: 'interview-start-time',
  TIME_ELAPSED: 'interview-time-elapsed',
  CURRENT_QUESTION: 'interview-current-question',
  QUESTION_NUMBER: 'interview-question-number',
  CHAT_MESSAGES: 'interview-chat-messages',
  USER_ANSWER: 'interview-user-answer',
  WARNING_COUNT: 'interview-warning-count',
  WARNING_STATUS: 'interview-warning-status',
  TAB_SWITCH_COUNT: 'interview-tab-switch-count',
  PROCTORING_VIOLATIONS: 'interview-proctoring-violations',
  SESSION_ACTIVE: 'interview-session-active',
  LAST_UPDATE: 'interview-last-update',
} as const;

export interface InterviewSessionState {
  interviewId: string;
  interviewType: string;
  isInterviewStarted: boolean;
  interviewStartTime: Date;
  timeElapsed: number;
  timeRemaining: number;
  currentQuestion: InterviewQuestion | null;
  questionNumber: number;
  chatMessages: Array<{
    id: string;
    type: "ai" | "user";
    message: string;
    timestamp: string;
    questionId?: string;
    answer?: string;
    analysis?: AnswerAnalysis;
  }>;
  userAnswer: string;
  warningCount: number;
  warningStatus: WarningStatus;
  tabSwitchCount: number;
  proctoringViolations: {
    tabSwitches: number;
    copyPasteCount: number;
    faceDetectionIssues: number;
  };
}

export interface ProctoringViolations {
  tabSwitches: number;
  copyPasteCount: number;
  faceDetectionIssues: number;
}

/**
 * Save the current interview session state to localStorage
 */
export const saveInterviewState = (state: Partial<InterviewSessionState>): void => {
  try {
    // Only save if we have essential data
    if (!state.interviewId) {
      console.warn('⚠️ Cannot save interview state: missing interviewId');
      return;
    }

    // Save all state properties
    localStorage.setItem(STORAGE_KEYS.INTERVIEW_ID, state.interviewId);

    if (state.interviewType) {
      localStorage.setItem('interview-type', state.interviewType);
    }

    if (state.isInterviewStarted !== undefined) {
      localStorage.setItem(STORAGE_KEYS.SESSION_ACTIVE, state.isInterviewStarted.toString());
    }

    if (state.interviewStartTime) {
      localStorage.setItem(STORAGE_KEYS.INTERVIEW_START_TIME, state.interviewStartTime.toISOString());
    }

    if (state.timeElapsed !== undefined) {
      localStorage.setItem(STORAGE_KEYS.TIME_ELAPSED, state.timeElapsed.toString());
    }

    if (state.currentQuestion) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_QUESTION, JSON.stringify(state.currentQuestion));
    }

    if (state.questionNumber !== undefined) {
      localStorage.setItem(STORAGE_KEYS.QUESTION_NUMBER, state.questionNumber.toString());
    }

    if (state.chatMessages) {
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(state.chatMessages));
    }

    if (state.userAnswer !== undefined) {
      localStorage.setItem(STORAGE_KEYS.USER_ANSWER, state.userAnswer);
    }

    if (state.warningCount !== undefined) {
      localStorage.setItem(STORAGE_KEYS.WARNING_COUNT, state.warningCount.toString());
    }

    if (state.warningStatus) {
      localStorage.setItem(STORAGE_KEYS.WARNING_STATUS, JSON.stringify(state.warningStatus));
    }

    if (state.tabSwitchCount !== undefined) {
      localStorage.setItem(STORAGE_KEYS.TAB_SWITCH_COUNT, state.tabSwitchCount.toString());
    }

    if (state.proctoringViolations) {
      localStorage.setItem(STORAGE_KEYS.PROCTORING_VIOLATIONS, JSON.stringify(state.proctoringViolations));
    }

    // Update last modification timestamp
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, new Date().toISOString());

    // Only log every 10th save to reduce console spam
    const saveCount = parseInt(localStorage.getItem('save-count') || '0', 10) + 1;
    localStorage.setItem('save-count', saveCount.toString());
    
    if (saveCount % 10 === 0 || saveCount <= 5) {
      console.log(`💾 Interview state saved`, {
        saveCount,
        interviewId: state.interviewId,
        questionNumber: state.questionNumber,
        timeRemaining: state.timeRemaining,
        userAnswerLength: state.userAnswer?.length || 0,
        chatMessagesCount: state.chatMessages?.length || 0,
      });
    }
  } catch (error) {
    console.error('❌ Failed to save interview state:', error);
    
    // If localStorage is full, try to clear some old data
    if (error instanceof DOMException && error.code === 22) {
      console.log('🧹 localStorage is full, attempting cleanup...');
      try {
        // Clear old save count data
        localStorage.removeItem('save-count');
        // Try saving again with minimal data
        localStorage.setItem(STORAGE_KEYS.INTERVIEW_ID, state.interviewId || '');
        localStorage.setItem(STORAGE_KEYS.SESSION_ACTIVE, 'true');
        localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, new Date().toISOString());
        console.log('✅ Emergency save completed');
      } catch (cleanupError) {
        console.error('❌ Emergency save failed:', cleanupError);
      }
    }
  }
};

/**
 * Restore interview session state from localStorage
 */
export const restoreInterviewState = (): Partial<InterviewSessionState> | null => {
  try {
    const sessionActive = localStorage.getItem(STORAGE_KEYS.SESSION_ACTIVE);

    if (sessionActive !== 'true') {
      console.log('ℹ️ No active interview session found');
      return null;
    }

    const interviewId = localStorage.getItem(STORAGE_KEYS.INTERVIEW_ID);
    const interviewType = localStorage.getItem('interview-type');
    const startTimeStr = localStorage.getItem(STORAGE_KEYS.INTERVIEW_START_TIME);
    const timeElapsed = localStorage.getItem(STORAGE_KEYS.TIME_ELAPSED);
    const currentQuestionStr = localStorage.getItem(STORAGE_KEYS.CURRENT_QUESTION);
    const questionNumber = localStorage.getItem(STORAGE_KEYS.QUESTION_NUMBER);
    const chatMessagesStr = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    const userAnswer = localStorage.getItem(STORAGE_KEYS.USER_ANSWER);
    const warningCount = localStorage.getItem(STORAGE_KEYS.WARNING_COUNT);
    const warningStatusStr = localStorage.getItem(STORAGE_KEYS.WARNING_STATUS);
    const tabSwitchCount = localStorage.getItem(STORAGE_KEYS.TAB_SWITCH_COUNT);
    const proctoringViolationsStr = localStorage.getItem(STORAGE_KEYS.PROCTORING_VIOLATIONS);
    const lastUpdate = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);

    if (!interviewId || !startTimeStr) {
      console.log('ℹ️ Incomplete interview session data');
      return null;
    }

    // Calculate actual time elapsed based on start time
    const startTime = new Date(startTimeStr);
    const now = new Date();
    const actualTimeElapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000); // in seconds
    const totalDuration = 45 * 60; // 45 minutes in seconds
    const calculatedTimeRemaining = Math.max(0, totalDuration - actualTimeElapsed);

    const state: Partial<InterviewSessionState> = {
      interviewId,
      interviewType: interviewType || 'resume',
      isInterviewStarted: true,
      interviewStartTime: startTime,
      timeElapsed: actualTimeElapsed,
      timeRemaining: calculatedTimeRemaining,
      currentQuestion: currentQuestionStr ? JSON.parse(currentQuestionStr) : null,
      questionNumber: questionNumber ? parseInt(questionNumber, 10) : 1,
      chatMessages: chatMessagesStr ? JSON.parse(chatMessagesStr) : [],
      userAnswer: userAnswer || '',
      warningCount: warningCount ? parseInt(warningCount, 10) : 0,
      warningStatus: warningStatusStr ? JSON.parse(warningStatusStr) : {
        warningCount: 0,
        isTerminated: false,
        canContinue: true,
        lastWarningAt: null,
      },
      tabSwitchCount: tabSwitchCount ? parseInt(tabSwitchCount, 10) : 0,
      proctoringViolations: proctoringViolationsStr ? JSON.parse(proctoringViolationsStr) : {
        tabSwitches: 0,
        copyPasteCount: 0,
        faceDetectionIssues: 0,
      },
    };

    console.log('✅ Interview state restored from localStorage:', {
      interviewId: state.interviewId,
      questionNumber: state.questionNumber,
      timeRemaining: state.timeRemaining,
      warningCount: state.warningCount,
      chatMessagesCount: state.chatMessages?.length,
      lastUpdate,
    });

    return state;
  } catch (error) {
    console.error('❌ Failed to restore interview state:', error);
    return null;
  }
};

/**
 * Clear all interview session data from localStorage
 */
export const clearInterviewState = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    localStorage.removeItem('interview-type');
    localStorage.removeItem('interview-terminated');
    localStorage.removeItem('interview-termination-reason');
    localStorage.removeItem('interview-termination-time');
    localStorage.removeItem('interview-last-warning');
    localStorage.removeItem('interview-warning-seen');
    localStorage.removeItem('save-count');

    console.log('🗑️ Interview state cleared from localStorage');
  } catch (error) {
    console.error('❌ Failed to clear interview state:', error);
  }
};

/**
 * Check if there's an active interview session
 */
export const hasActiveSession = (): boolean => {
  try {
    const sessionActive = localStorage.getItem(STORAGE_KEYS.SESSION_ACTIVE);
    const interviewId = localStorage.getItem(STORAGE_KEYS.INTERVIEW_ID);
    return sessionActive === 'true' && !!interviewId;
  } catch (error) {
    console.error('❌ Failed to check active session:', error);
    return false;
  }
};

/**
 * Update specific fields in the interview state
 */
export const updateInterviewState = (updates: Partial<InterviewSessionState>): void => {
  saveInterviewState(updates);
};

/**
 * Save proctoring violations incrementally
 */
export const updateProctoringViolations = (violations: Partial<ProctoringViolations>): void => {
  try {
    const currentViolationsStr = localStorage.getItem(STORAGE_KEYS.PROCTORING_VIOLATIONS);
    const currentViolations: ProctoringViolations = currentViolationsStr
      ? JSON.parse(currentViolationsStr)
      : { tabSwitches: 0, copyPasteCount: 0, faceDetectionIssues: 0 };

    const updatedViolations = {
      ...currentViolations,
      ...violations,
    };

    localStorage.setItem(STORAGE_KEYS.PROCTORING_VIOLATIONS, JSON.stringify(updatedViolations));
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, new Date().toISOString());

    console.log('🚨 Proctoring violations updated:', updatedViolations);
  } catch (error) {
    console.error('❌ Failed to update proctoring violations:', error);
  }
};

/**
 * Get the time remaining based on start time
 */
export const calculateTimeRemaining = (): number => {
  try {
    const startTimeStr = localStorage.getItem(STORAGE_KEYS.INTERVIEW_START_TIME);
    if (!startTimeStr) return 45 * 60; // Default 45 minutes

    const startTime = new Date(startTimeStr);
    const now = new Date();
    const timeElapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const totalDuration = 45 * 60; // 45 minutes in seconds

    return Math.max(0, totalDuration - timeElapsed);
  } catch (error) {
    console.error('❌ Failed to calculate time remaining:', error);
    return 45 * 60;
  }
};

/**
 * Check if there's an incomplete interview and get its details
 */
export const getIncompleteInterview = (): {
  hasIncomplete: boolean;
  isExpired: boolean;
  data: Partial<InterviewSessionState> | null;
} => {
  try {
    if (!hasActiveSession()) {
      return { hasIncomplete: false, isExpired: false, data: null };
    }

    const restoredState = restoreInterviewState();
    if (!restoredState || !restoredState.interviewId) {
      return { hasIncomplete: false, isExpired: false, data: null };
    }

    // Calculate if the interview has expired (45 minutes passed)
    const timeRemaining = calculateTimeRemaining();
    const isExpired = timeRemaining <= 0;

    return {
      hasIncomplete: true,
      isExpired,
      data: restoredState,
    };
  } catch (error) {
    console.error('❌ Failed to check incomplete interview:', error);
    return { hasIncomplete: false, isExpired: false, data: null };
  }
};

/**
 * Get interview data for recovery modal
 */
export const getIncompleteInterviewData = (): {
  interviewId: string;
  interviewType: string;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  startTime: Date;
} | null => {
  try {
    const incomplete = getIncompleteInterview();
    if (!incomplete.hasIncomplete || !incomplete.data) {
      return null;
    }

    const data = incomplete.data;
    return {
      interviewId: data.interviewId || '',
      interviewType: data.interviewType || 'resume',
      questionNumber: data.questionNumber || 1,
      totalQuestions: 10, // Default, can be dynamic later
      timeRemaining: data.timeRemaining || 0,
      startTime: data.interviewStartTime || new Date(),
    };
  } catch (error) {
    console.error('❌ Failed to get incomplete interview data:', error);
    return null;
  }
};
