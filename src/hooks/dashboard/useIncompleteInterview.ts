import { useState, useEffect } from "react";
import {
  getIncompleteInterview,
  getIncompleteInterviewData,
  clearInterviewState,
  saveInterviewState,
} from "@/lib/interview-persistence";
import { interviewRealtimeApi } from "@/lib/api/interview-realtime";
import { IncompleteInterviewData } from "@/types/dashboard";

/**
 * Custom hook for managing incomplete interview logic
 * Checks both server and localStorage for active interviews
 */
export const useIncompleteInterview = (
  isClient: boolean,
  isAuthenticated: boolean
) => {
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [incompleteInterviewData, setIncompleteInterviewData] =
    useState<IncompleteInterviewData | null>(null);
  const [pendingInterviewAction, setPendingInterviewAction] = useState<
    (() => void) | null
  >(null);

  // Check for incomplete interview on mount (both local and server)
  useEffect(() => {
    if (isClient && isAuthenticated) {
      const checkIncompleteInterview = async () => {
        try {
          // First check server for active interview (works across devices)
          const serverCheck = await interviewRealtimeApi.checkActiveInterview();

          if (
            serverCheck.success &&
            serverCheck.hasActiveInterview &&
            serverCheck.data
          ) {
            // Found active interview on server
            const serverData = serverCheck.data;

            // Convert server data to modal format
            const interviewData: IncompleteInterviewData = {
              interviewId: serverData.interviewId,
              interviewType: serverData.interviewType,
              questionNumber: serverData.currentQuestionNumber,
              totalQuestions: serverData.totalQuestions,
              timeRemaining: serverData.timeRemaining,
              startTime: new Date(serverData.startTime),
            };

            setIncompleteInterviewData(interviewData);
            console.log(
              "⚠️ Active interview found on server (cross-device):",
              interviewData
            );

            // Also sync this data to localStorage for offline access
            if (serverData.currentQuestion) {
              saveInterviewState({
                interviewId: serverData.interviewId,
                interviewType: serverData.interviewType,
                isInterviewStarted: true,
                interviewStartTime: new Date(serverData.startTime),
                timeElapsed: serverData.timeElapsed,
                timeRemaining: serverData.timeRemaining,
                currentQuestion: serverData.currentQuestion,
                questionNumber: serverData.currentQuestionNumber,
                chatMessages: (serverData.chatHistory || []).map(
                  (msg: Record<string, unknown>, index: number) => ({
                    id: `msg-${index}`,
                    type: msg.type as string,
                    message: msg.message as string,
                    timestamp: msg.timestamp as string,
                  })
                ),
                userAnswer: "",
                warningCount: serverData.warningCount || 0,
                warningStatus: {
                  warningCount: serverData.warningCount || 0,
                  isTerminated: false,
                  canContinue: true,
                  lastWarningAt: null,
                },
                tabSwitchCount: serverData.tabSwitchCount || 0,
                proctoringViolations: {
                  tabSwitches: serverData.violations?.tabSwitches || 0,
                  copyPasteCount: serverData.violations?.copyPasteCount || 0,
                  faceDetectionIssues: 0,
                },
              });
            }

            return; // Exit early, we found server data
          }

          // No server data, check localStorage (fallback for offline scenarios)
          const incomplete = getIncompleteInterview();
          if (incomplete.hasIncomplete && incomplete.data) {
            const interviewData = getIncompleteInterviewData();
            if (interviewData) {
              setIncompleteInterviewData(interviewData);
              console.log(
                "⚠️ Incomplete interview detected in localStorage:",
                interviewData
              );
            }
          }
        } catch (error) {
          console.error("❌ Failed to check for active interview:", error);

          // Fallback to localStorage check if server fails
          const incomplete = getIncompleteInterview();
          if (incomplete.hasIncomplete && incomplete.data) {
            const interviewData = getIncompleteInterviewData();
            if (interviewData) {
              setIncompleteInterviewData(interviewData);
              console.log(
                "⚠️ Incomplete interview detected (fallback to localStorage):",
                interviewData
              );
            }
          }
        }
      };

      // Check after a short delay to ensure everything is loaded
      setTimeout(checkIncompleteInterview, 500);
    }
  }, [isClient, isAuthenticated]);

  /**
   * Check for incomplete interview before starting a new one
   */
  const checkBeforeStarting = async (
    onProceed: () => void
  ): Promise<boolean> => {
    try {
      // First check server for active interview
      const serverCheck = await interviewRealtimeApi.checkActiveInterview();

      if (
        serverCheck.success &&
        serverCheck.hasActiveInterview &&
        serverCheck.data
      ) {
        const serverData = serverCheck.data;
        const interviewData: IncompleteInterviewData = {
          interviewId: serverData.interviewId,
          interviewType: serverData.interviewType,
          questionNumber: serverData.currentQuestionNumber,
          totalQuestions: serverData.totalQuestions,
          timeRemaining: serverData.timeRemaining,
          startTime: new Date(serverData.startTime),
        };

        setIncompleteInterviewData(interviewData);
        setShowIncompleteModal(true);
        setPendingInterviewAction(() => onProceed);
        return false;
      }

      // Fallback: Check localStorage
      const incomplete = getIncompleteInterview();
      if (incomplete.hasIncomplete && incomplete.data) {
        const interviewData = getIncompleteInterviewData();
        if (interviewData) {
          setIncompleteInterviewData(interviewData);
          setShowIncompleteModal(true);
          setPendingInterviewAction(() => onProceed);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("❌ Error checking for active interview:", error);

      // Fallback to localStorage check
      const incomplete = getIncompleteInterview();
      if (incomplete.hasIncomplete && incomplete.data) {
        const interviewData = getIncompleteInterviewData();
        if (interviewData) {
          setIncompleteInterviewData(interviewData);
          setShowIncompleteModal(true);
          setPendingInterviewAction(() => onProceed);
          return false;
        }
      }

      return true;
    }
  };

  /**
   * Resume incomplete interview
   */
  const handleResumeInterview = async (onNavigate: (url: string) => void) => {
    if (!incompleteInterviewData) return;

    try {
      // Fetch latest interview state from server
      const resumeData = await interviewRealtimeApi.resumeInterview(
        incompleteInterviewData.interviewId
      );

      if (resumeData.success && resumeData.data) {
        // Sync server data to localStorage before navigating
        saveInterviewState({
          interviewId: resumeData.data.interviewId,
          interviewType: resumeData.data.interviewType,
          isInterviewStarted: true,
          interviewStartTime: new Date(resumeData.data.startTime),
          timeElapsed: 0, // Will be calculated on interview page
          timeRemaining: resumeData.data.timeRemaining,
          currentQuestion: resumeData.data.currentQuestion,
          questionNumber: resumeData.data.currentQuestionNumber,
          chatMessages: resumeData.data.chatHistory || [],
          userAnswer: "",
          warningCount: resumeData.data.warningCount || 0,
          warningStatus: {
            warningCount: resumeData.data.warningCount || 0,
            isTerminated: false,
            canContinue: true,
            lastWarningAt: null,
          },
          tabSwitchCount: 0,
          proctoringViolations: resumeData.data.violations || {
            tabSwitches: 0,
            copyPasteCount: 0,
            faceDetectionIssues: 0,
          },
        });

        console.log("✅ Interview state synced from server to localStorage");
      }
    } catch (error) {
      console.error("❌ Failed to fetch latest interview state:", error);
    }

    setShowIncompleteModal(false);
    onNavigate(
      `/interview?interviewId=${incompleteInterviewData.interviewId}&type=${incompleteInterviewData.interviewType}`
    );
  };

  /**
   * End incomplete interview
   */
  const handleEndInterview = async () => {
    if (!incompleteInterviewData) return;

    try {
      if (incompleteInterviewData.interviewId) {
        await interviewRealtimeApi.endInterview(
          incompleteInterviewData.interviewId
        );
        console.log("✅ Incomplete interview ended successfully");
      }
    } catch (error) {
      console.error("❌ Failed to end incomplete interview:", error);
    } finally {
      clearInterviewState();
      setShowIncompleteModal(false);
      setIncompleteInterviewData(null);
      setPendingInterviewAction(null);
      console.log("🗑️ Incomplete interview ended, staying on dashboard");
    }
  };

  /**
   * End incomplete interview and start new one
   */
  const handleEndAndStartNew = async () => {
    if (!incompleteInterviewData) return;

    try {
      if (incompleteInterviewData.interviewId) {
        await interviewRealtimeApi.endInterview(
          incompleteInterviewData.interviewId
        );
        console.log("✅ Incomplete interview ended successfully");
      }
    } catch (error) {
      console.error("❌ Failed to end incomplete interview:", error);
    } finally {
      clearInterviewState();
      setShowIncompleteModal(false);
      setIncompleteInterviewData(null);

      if (pendingInterviewAction) {
        console.log("🚀 Starting new interview after ending incomplete one");
        pendingInterviewAction();
        setPendingInterviewAction(null);
      } else {
        console.log("🗑️ Incomplete interview cleared, no pending action");
      }
    }
  };

  /**
   * Cancel incomplete interview modal
   */
  const handleCancelModal = () => {
    console.log("❌ Cancelled incomplete interview modal");
    setShowIncompleteModal(false);
    setIncompleteInterviewData(null);
    setPendingInterviewAction(null);
  };

  return {
    showIncompleteModal,
    incompleteInterviewData,
    checkBeforeStarting,
    handleResumeInterview,
    handleEndInterview,
    handleEndAndStartNew,
    handleCancelModal,
  };
};
