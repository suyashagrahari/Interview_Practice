import { useCallback, useRef, useEffect } from "react";
import {
  saveInterviewState,
  updateProctoringViolations,
  clearInterviewState,
} from "@/lib/interview-persistence";
import type { ChatMessage, CVViolations } from "../../types/interview-page/interview.types";
import type { InterviewQuestion, WarningStatus } from "@/lib/api/interview-realtime";
import { INTERVIEW_CONSTANTS } from "../../constants/interview-page/interview.constants";

interface PersistenceData {
  interviewId: string | null;
  interviewType: string;
  isInterviewStarted: boolean;
  interviewStartTime: Date | null;
  timeRemaining: number;
  currentQuestion: InterviewQuestion | null;
  questionNumber: number;
  chatMessages: ChatMessage[];
  userAnswer: string;
  warningStatus: WarningStatus;
  tabSwitchCount: number;
  proctoringData: any;
  cvViolations: CVViolations;
}

export const useInterviewPersistence = () => {
  const debouncedSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Manual save function - only call when needed
  const saveCurrentState = useCallback((data: PersistenceData) => {
    if (data.isInterviewStarted && data.interviewId) {
      saveInterviewState({
        interviewId: data.interviewId,
        interviewType: data.interviewType,
        isInterviewStarted: data.isInterviewStarted,
        interviewStartTime: data.interviewStartTime || new Date(),
        timeElapsed: data.interviewStartTime
          ? Math.floor(
              (new Date().getTime() - data.interviewStartTime.getTime()) / 1000
            )
          : 0,
        timeRemaining: data.timeRemaining,
        currentQuestion: data.currentQuestion,
        questionNumber: data.questionNumber,
        chatMessages: data.chatMessages,
        userAnswer: data.userAnswer,
        warningCount: data.warningStatus.warningCount,
        warningStatus: data.warningStatus,
        tabSwitchCount: data.tabSwitchCount,
        proctoringViolations: {
          tabSwitches: data.proctoringData.tabSwitches || 0,
          copyPasteCount: data.proctoringData.copyPasteCount || 0,
          faceDetectionIssues:
            data.cvViolations.multiplePersonIncidents +
            data.cvViolations.phoneDetections,
        },
      });

      // Also save proctoring violations separately for the useProctoring hook
      updateProctoringViolations({
        tabSwitches: data.proctoringData.tabSwitches || 0,
        copyPasteCount: data.proctoringData.copyPasteCount || 0,
        faceDetectionIssues:
          data.cvViolations.multiplePersonIncidents +
          data.cvViolations.phoneDetections,
      });
    }
  }, []);

  // Debounced auto-save function
  const autoSaveState = useCallback(
    (data: PersistenceData) => {
      if (debouncedSaveRef.current) {
        clearTimeout(debouncedSaveRef.current);
      }
      debouncedSaveRef.current = setTimeout(() => {
        saveCurrentState(data);
      }, INTERVIEW_CONSTANTS.SAVE.DEBOUNCE_DELAY);
    },
    [saveCurrentState]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debouncedSaveRef.current) {
        clearTimeout(debouncedSaveRef.current);
      }
    };
  }, []);

  // Helper function to clear all interview-related localStorage data
  const clearInterviewLocalStorage = useCallback((interviewId: string | null) => {
    clearInterviewState();

    // Clear persistent cheating status for this interview
    if (interviewId) {
      localStorage.removeItem(`cheating-detected-${interviewId}`);
    }
  }, []);

  return {
    saveCurrentState,
    autoSaveState,
    clearInterviewLocalStorage,
  };
};
