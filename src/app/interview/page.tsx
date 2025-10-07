"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAuthenticated } from "@/lib/cookies";
import { toast } from "@/utils/toast";
import { useImprovedSpeechRecognition } from "@/hooks/useImprovedSpeechRecognition";
import { useProctoring } from "@/hooks/useProctoring";
import { useComputerVision } from "@/hooks/useComputerVision";
import { useTheme } from "@/contexts/theme-context";
import { useAuth } from "@/contexts/auth-context";
import { useInterviewWebSocket } from "@/hooks/useInterviewWebSocket";
import {
  interviewRealtimeApi,
  InterviewQuestion,
  AnswerAnalysis,
  WarningData,
  WarningStatus,
} from "@/lib/api/interview-realtime";
import { InterviewApiService, Interview } from "@/lib/api/interview";
import { InterviewerApiService, Interviewer } from "@/lib/api/interviewer";
import {
  restoreInterviewState,
  hasActiveSession,
} from "@/lib/interview-persistence";

// Import modular components
import { InterviewHeader } from "@/components/interview-page/InterviewHeader";
import { VideoSection } from "@/components/interview-page/VideoSection";
import { ChatSection } from "@/components/interview-page/ChatSection";
import { AnswerInput } from "@/components/interview-page/AnswerInput";
import { TabSwitchModal } from "@/components/interview-page/Modals/TabSwitchModal";
import { ExitConfirmModal } from "@/components/interview-page/Modals/ExitConfirmModal";

// Import existing modals (not refactored)
import InterviewGuidelinesModal from "@/components/interview/interview-guidelines-modal";
import WarningModal from "@/components/interview/warning-modal";
import InitialWarningModal from "@/components/interview/initial-warning-modal";
import InterviewDetailsModal from "@/components/interview/interview-details-modal";
import InterviewerDetailsModal from "@/components/interview/interviewer-details-modal";
import AvatarSelector from "@/components/interview/avatar-selector";

// Import custom hooks
import {
  useInterviewTimer,
  useCameraManagement,
  useInterviewChat,
  useInterviewPersistence,
  useWarningSystem,
} from "@/hooks/interview-page";

// Import constants and types
import { INTERVIEW_CONSTANTS, DEFAULT_AVATAR, WARNING_THRESHOLDS } from "@/constants/interview-page/interview.constants";
import type { CVViolations, CVDetectionPoint, QuestionData, AvatarData, AudioData } from "@/types/interview-page/interview.types";
import { streamText, streamQuestionToChat } from "@/utils/interview-page/streaming";
import { customScrollbarStyles } from "@/styles/interview-practice";

const InterviewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const themeContext = useTheme();
  const { theme, isDarkMode, mounted } = themeContext;

  // Client-side rendering check
  const [isClient, setIsClient] = useState(false);

  // Interview state
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(true);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [permissionsGrantedInGuidelines, setPermissionsGrantedInGuidelines] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interviewType, setInterviewType] = useState("");
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [interviewData, setInterviewData] = useState<Interview | null>(null);
  const [isLoadingInterviewData, setIsLoadingInterviewData] = useState(false);
  const [isInterviewDetailsModalOpen, setIsInterviewDetailsModalOpen] = useState(false);
  const [interviewerData, setInterviewerData] = useState<Interviewer | null>(null);
  const [isLoadingInterviewerData, setIsLoadingInterviewerData] = useState(false);
  const [isInterviewerDetailsModalOpen, setIsInterviewerDetailsModalOpen] = useState(false);

  // Question state
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [answerAnalysis, setAnswerAnalysis] = useState<AnswerAnalysis | null>(null);
  const [pendingNextQuestion, setPendingNextQuestion] = useState<InterviewQuestion | null>(null);
  const [currentQuestionData, setCurrentQuestionData] = useState<QuestionData>({
    question: "Can you explain the concept of closures in JavaScript?",
    answer: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. Closures are created every time a function is created, at function creation time. They allow for data privacy and the creation of function factories.",
  });

  // Answer state
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speechDisabled, setSpeechDisabled] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);

  // Audio state
  const [currentAudio, setCurrentAudio] = useState<AudioData | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // UI state
  const [showHint, setShowHint] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarData>(DEFAULT_AVATAR);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<string>("checking");

  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentSessionTranscript, setCurrentSessionTranscript] = useState("");

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const questionSectionRef = useRef<HTMLDivElement>(null);
  const subtitleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingFromBackendRef = useRef<boolean>(false);
  const cvInitializedRef = useRef<boolean>(false);

  // Custom hooks
  const {
    timeRemaining,
    setTimeRemaining,
    interviewStartTime,
    setInterviewStartTime,
    formatTime,
    resetTimer,
    isLowTime,
  } = useInterviewTimer({
    isInterviewStarted,
    onTimeExpired: handleAutoEndInterview,
  });

  const {
    cameraStream,
    setCameraStream,
    cameraPermission,
    setCameraPermission,
    cameraTested,
    setCameraTested,
    isVideoOn,
    setIsVideoOn,
    safeVideoPlay,
    requestCameraPermission,
    stopCamera,
    handleToggleVideo,
  } = useCameraManagement();

  const { chatMessages, setChatMessages, chatMessagesRef, addMessageToChat, getCurrentTimestamp } =
    useInterviewChat();

  const { saveCurrentState, autoSaveState, clearInterviewLocalStorage } = useInterviewPersistence();

  const {
    warningStatus,
    setWarningStatus,
    warningData,
    setWarningData,
    showWarningModal,
    setShowWarningModal,
    showInitialWarningModal,
    setShowInitialWarningModal,
    showTabSwitchModal,
    setShowTabSwitchModal,
    warningShownForCurrentCount,
    setWarningShownForCurrentCount,
    tabSwitchCount,
    setTabSwitchCount,
    updateWarningStatusFromBackend,
  } = useWarningSystem();

  // Speech recognition
  const {
    transcript: speechTranscript,
    interimTranscript: webkitInterimTranscript,
    isListening: isSpeechListening,
    isSupported: isSpeechSupported,
    error: speechError,
    isInitializing: isSpeechInitializing,
    isInInterviewMode: isSpeechInInterviewMode,
    startInterviewSession: startSpeechInterviewSession,
    stopInterviewSession: stopSpeechInterviewSession,
    resetTranscript: resetSpeechTranscript,
    retry: retrySpeechRecognition,
  } = useImprovedSpeechRecognition({
    language: INTERVIEW_CONSTANTS.SPEECH.LANGUAGE,
    continuous: INTERVIEW_CONSTANTS.SPEECH.CONTINUOUS,
    interimResults: INTERVIEW_CONSTANTS.SPEECH.INTERIM_RESULTS,
    timeout: INTERVIEW_CONSTANTS.SPEECH.TIMEOUT,
    retryAttempts: INTERVIEW_CONSTANTS.SPEECH.RETRY_ATTEMPTS,
    retryDelay: INTERVIEW_CONSTANTS.SPEECH.RETRY_DELAY,
  });

  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [speechText, setSpeechText] = useState("");
  const [speechRecognitionError, setSpeechRecognitionError] = useState<string | null>(null);

  // Proctoring
  const {
    proctoringData,
    startProctoring,
    stopProctoring,
    resetProctoring,
    setProctoringData,
    isProctoring,
  } = useProctoring();

  // Computer Vision
  const {
    stats: cvStats,
    isModelLoaded: isCVModelLoaded,
    isVideoReady: isCVVideoReady,
    isLoading: isCVLoading,
    initializeComputerVision,
    cleanup: cleanupComputerVision,
  } = useComputerVision();

  // CV violations state
  const [cvViolations, setCvViolations] = useState<CVViolations>({
    multiplePersonIncidents: 0,
    phoneDetections: 0,
    totalViolations: 0,
    violations: [],
  });
  const [persistentCheatingDetected, setPersistentCheatingDetected] = useState(false);
  const [cvDetectionPoints, setCvDetectionPoints] = useState<CVDetectionPoint[]>([]);

  // WebSocket Interview Handler
  const {
    socket,
    isConnected: isSocketConnected,
    isGenerating: isGeneratingQuestionWS,
    isAnalyzing: isAnalyzingWS,
    generateFirstQuestion: generateFirstQuestionWS,
    submitAnswer: submitAnswerWS,
    reconnectInterview,
    updateProctoringData: updateProctoringDataWS,
    getProctoringData: getProctoringDataWS,
  } = useInterviewWebSocket({
    interviewId,
    userId: user?.id || null,
    onQuestionReceived: handleQuestionReceived,
    onAnswerSubmitted: handleAnswerSubmitted,
    onWarning: (data) => {
      console.log("⚠️ Warning received via WebSocket:", data);
      setShowWarningModal(true);
    },
    onInterviewComplete: (data) => {
      console.log("🎉 Interview complete via WebSocket:", data);
      if (data.terminated) {
        router.push("/dashboard?interviewTerminated=true");
      } else {
        handleAutoEndInterview();
      }
    },
    onError: (error) => {
      console.error("❌ WebSocket error:", error);
      setError(error.message);
      setIsGeneratingQuestion(false);
      setIsSubmittingAnswer(false);
      setIsAnalyzing(false);
    },
    onProctoringDataReceived: handleProctoringDataReceived,
  });

  // ============== HANDLER FUNCTIONS ==============

  async function handleQuestionReceived(question: InterviewQuestion, questionNumber: number, audio: any) {
    console.log("📥 Question received via WebSocket:", question, "Audio:", audio);
    setCurrentQuestion(question);
    setQuestionNumber(questionNumber);
    setUserAnswer("");
    setAnswerAnalysis(null);

    if (audio) {
      console.log("🎵 Audio received, setting for playback");
      setCurrentAudio(audio);
    } else {
      setCurrentAudio(null);
    }

    // Clear speech recognition
    setCurrentSessionTranscript("");
    setSpeechText("");
    setInterimTranscript("");
    setFinalTranscript("");
    resetSpeechTranscript();

    // Stream question to chat
    await streamQuestionToBoth(question.question, question.questionId);

    // Start proctoring
    if (!isProctoring) {
      startProctoring();
    }

    saveCurrentStateData();
  }

  function handleAnswerSubmitted(data: any) {
    console.log("✅ Answer submitted via WebSocket:", data);

    // Handle warnings
    if (data.warningIssued) {
      const newWarningStatus = {
        warningCount: data.warningCount,
        isTerminated: data.interviewTerminated,
        canContinue: data.canContinue,
        lastWarningAt: data.lastWarningAt,
      };

      setWarningStatus(newWarningStatus);

      if (typeof window !== "undefined") {
        localStorage.setItem("interview-warning-status", JSON.stringify(newWarningStatus));
        localStorage.setItem("interview-warning-count", data.warningCount.toString());
      }

      setWarningData({
        issued: true,
        isTerminated: data.interviewTerminated,
        warningCount: data.warningCount,
        sentiment: data.questionSentiment,
      });

      setShowWarningModal(true);
    }

    setIsSubmittingAnswer(false);
    setIsAnalyzing(false);
    saveCurrentStateData();
  }

  function handleProctoringDataReceived(data: any) {
    console.log("📊 Received proctoring data from backend:", data);

    isLoadingFromBackendRef.current = true;

    if (data.warningCount !== undefined) {
      setWarningStatus((prev) => ({ ...prev, warningCount: data.warningCount }));
      if (typeof window !== "undefined") {
        localStorage.setItem("interview-warning-count", data.warningCount.toString());
      }
    }

    if (data.proctoringData) {
      setProctoringData({
        tabSwitches: data.proctoringData.tabSwitches || 0,
        copyPasteCount: data.proctoringData.copyPasteCount || 0,
      });
      setTabSwitchCount(data.proctoringData.tabSwitches || 0);

      if (typeof window !== "undefined") {
        localStorage.setItem("interview-tab-switch-count", (data.proctoringData.tabSwitches || 0).toString());
      }

      console.log("✅ Proctoring data updated from backend:", {
        tabSwitches: data.proctoringData.tabSwitches,
        copyPasteCount: data.proctoringData.copyPasteCount,
      });
    }

    setTimeout(() => {
      isLoadingFromBackendRef.current = false;
    }, 100);
  }

  async function handleAutoEndInterview() {
    console.log("⏰ Auto-ending interview (time expired or 18 questions reached)");

    if (interviewId) {
      try {
        await interviewRealtimeApi.endInterview(interviewId);
        clearInterviewLocalStorage(interviewId);
        stopProctoring();
        toast.success("Interview completed successfully!");
        router.push("/dashboard?interviewCompleted=true");
      } catch (error) {
        console.error("Error auto-ending interview:", error);
        clearInterviewLocalStorage(interviewId);
        stopProctoring();
        router.push("/dashboard?interviewCompleted=true");
      }
    } else {
      clearInterviewLocalStorage(interviewId);
      stopProctoring();
      router.push("/dashboard?interviewCompleted=true");
    }
  }

  const handleEndInterview = async () => {
    try {
      if (warningStatus.isTerminated) {
        console.log("🚫 Interview was terminated, ending via API...");

        if (interviewId) {
          try {
            await interviewRealtimeApi.endInterview(interviewId);
            console.log("✅ Terminated interview ended successfully via API");
          } catch (error) {
            console.error("❌ Error ending terminated interview:", error);
          }
        }

        clearInterviewLocalStorage(interviewId);
        stopProctoring();
        router.push("/dashboard?interviewTerminated=true");
        return;
      }

      if (interviewId) {
        console.log("🛑 Ending interview via API...", interviewId);
        setIsGeneratingQuestion(true);

        try {
          const response = await interviewRealtimeApi.endInterview(interviewId);
          console.log("✅ Interview ended successfully via API:", response);

          clearInterviewLocalStorage(interviewId);
          stopProctoring();
          toast.success("Interview ended successfully!");
          router.push("/dashboard?interviewCompleted=true");
        } catch (error) {
          console.error("❌ Error ending interview:", error);
          const errorMessage = "Failed to end interview properly, but you can still exit.";
          setError(errorMessage);
          toast.error(errorMessage);

          clearInterviewLocalStorage(interviewId);
          stopProctoring();

          setTimeout(() => {
            router.push("/dashboard?interviewCompleted=true&error=endFailed");
          }, 2000);
        } finally {
          setIsGeneratingQuestion(false);
        }
      } else {
        console.log("⚠️ No interview ID found, clearing localStorage and redirecting...");
        clearInterviewLocalStorage(interviewId);
        stopProctoring();
        router.push("/dashboard?interviewCompleted=true");
      }
    } catch (error) {
      console.error("❌ Unexpected error in handleEndInterview:", error);
      setError("An unexpected error occurred while ending the interview.");

      clearInterviewLocalStorage(interviewId);
      stopProctoring();

      setTimeout(() => {
        router.push("/dashboard?interviewCompleted=true&error=unexpected");
      }, 2000);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !interviewId || !userAnswer.trim()) return;

    try {
      console.log("📤 Submitting answer via WebSocket...");
      setIsSubmittingAnswer(true);
      setIsAnalyzing(true);
      stopProctoring();

      if (isRecording) {
        console.log("🎤 Stopping speech recognition on answer submission");
        handleStopRecording();
      }

      const answerText = userAnswer;
      addMessageToChat("user", answerText, currentQuestion.questionId, answerText);
      setUserAnswer("");

      submitAnswerWS(currentQuestion.questionId, answerText, {
        timeSpent: proctoringData.timeSpent,
        startTime: proctoringData.startTime || new Date(),
        endTime: new Date(),
        tabSwitches: proctoringData.tabSwitches,
        copyPasteCount: proctoringData.copyPasteCount,
        faceDetection: proctoringData.faceDetection,
        mobileDetection: proctoringData.mobileDetection,
        laptopDetection: proctoringData.laptopDetection,
        zoomIn: proctoringData.zoomIn,
        zoomOut: proctoringData.zoomOut,
        questionNumber,
      });

      console.log("✅ Answer submission request sent via WebSocket");
    } catch (error) {
      console.error("Error submitting answer:", error);
      setIsSubmittingAnswer(false);
      setIsAnalyzing(false);
    }
  };

  const handleStartRecording = async () => {
    setIsRecording(true);
    setSpeechDisabled(false);
    setIsAISpeaking(false);
    setIsAudioPlaying(false);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("🎤 Microphone permission granted");
    } catch (error) {
      console.error("🎤 Microphone permission denied:", error);
      alert(
        "Microphone access is required for speech recognition. Please allow microphone access and try again. You can still type your answer manually."
      );
      setIsRecording(false);
      return;
    }

    setInterimTranscript("");
    setFinalTranscript("");
    setSpeechText("");
    setCurrentSessionTranscript("");
    setSpeechRecognitionError(null);

    if (isSpeechSupported && startSpeechInterviewSession) {
      console.log("🎤 Starting interview session with auto-restart");
      await startSpeechInterviewSession();
    } else {
      console.log("🎤 Speech recognition not supported, recording without transcription");
    }
  };

  const handleStopRecording = () => {
    console.log("🎤 Stopping interview session and speech recognition");
    setIsRecording(false);
    setSpeechDisabled(true);
    setIsAISpeaking(true);

    if (isSpeechSupported && stopSpeechInterviewSession) {
      console.log("🎤 Stopping interview session - disabling auto-restart");
      stopSpeechInterviewSession();
    }

    setIsListening(false);
    setSpeechText("");
    setInterimTranscript("");
    setFinalTranscript("");
    setShowSubtitles(false);

    if (subtitleTimerRef.current) {
      clearTimeout(subtitleTimerRef.current);
      subtitleTimerRef.current = null;
    }

    console.log("🎤 Interview session stopped, transcript preserved in text area:", currentSessionTranscript);
  };

  const streamQuestionToBoth = async (questionText: string, questionId: string) => {
    setIsStreaming(true);
    setStreamingText("");

    await streamQuestionToChat(questionText, questionId, chatMessages, setChatMessages, getCurrentTimestamp);

    setIsStreaming(false);
  };

  const handleHintToggle = async () => {
    if (!showHint) {
      if (!currentQuestion || !interviewId) {
        toast.error("No active question available");
        return;
      }

      const currentQuestionId = currentQuestion.questionId;
      const currentInterviewId = interviewId;

      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth_token="))
          ?.split("=")[1];

        if (!token) {
          toast.error("Authentication required");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/interview/${currentInterviewId}/questions/${currentQuestionId}/hint`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            if (data.data.questionId === currentQuestionId) {
              setCurrentQuestionData({
                question: data.data.question,
                answer: data.data.expectedAnswer,
              });
              console.log("✅ AI Copilot hint loaded for question:", currentQuestionId);
            } else {
              console.error("⚠️ Question mismatch:", {
                requested: currentQuestionId,
                received: data.data.questionId,
              });
              toast.error("Question mismatch - please refresh");
              return;
            }
          }
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to load hint");
          return;
        }
      } catch (error) {
        console.error("Error fetching hint:", error);
        toast.error("Failed to load hint");
        return;
      }
    }

    setShowHint(!showHint);

    if (!showHint && questionSectionRef.current) {
      setTimeout(() => {
        questionSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  const displayCVDetectionPoints = () => {
    console.log("🔍 === COMPUTER VISION DETECTION POINTS ===");
    console.log(`📊 Total Detection Points: ${cvDetectionPoints.length}`);

    if (cvDetectionPoints.length === 0) {
      console.log("No detection points recorded yet.");
      return;
    }

    const violations = cvDetectionPoints.filter((point) => point.violation);
    const normal = cvDetectionPoints.filter((point) => !point.violation);

    console.log(`✅ Normal Detections: ${normal.length}`);
    console.log(`⚠️ Violation Detections: ${violations.length}`);

    if (violations.length > 0) {
      console.log("\n🚨 VIOLATION DETECTIONS:");
      violations.forEach((point, index) => {
        console.log(`${index + 1}. [${point.timestamp.toLocaleTimeString()}] ${point.violationType}`);
        console.log(`   - People: ${point.peopleCount}, Devices: ${point.phoneCount}`);
      });
    }

    console.log("\n📈 RECENT DETECTIONS (Last 10):");
    const recentPoints = cvDetectionPoints.slice(-10);
    recentPoints.forEach((point, index) => {
      const status = point.violation ? "🚨 VIOLATION" : "✅ NORMAL";
      console.log(`${index + 1}. [${point.timestamp.toLocaleTimeString()}] ${status}`);
      console.log(`   - People: ${point.peopleCount}, Devices: ${point.phoneCount}`);
      if (point.violationType) {
        console.log(`   - Type: ${point.violationType}`);
      }
    });

    console.log("🔍 === END DETECTION POINTS ===");
  };

  const saveCurrentStateData = () => {
    if (isInterviewStarted && interviewId) {
      saveCurrentState({
        interviewId,
        interviewType,
        isInterviewStarted,
        interviewStartTime: interviewStartTime || new Date(),
        timeRemaining,
        currentQuestion,
        questionNumber,
        chatMessages,
        userAnswer,
        warningStatus,
        tabSwitchCount,
        proctoringData,
        cvViolations,
      });
    }
  };

  const handleChatMessageClick = (message: any) => {
    if (message.type === "ai" && message.questionId) {
      setCurrentQuestion({
        questionId: message.questionId,
        question: message.message,
        category: "Interview Question",
        difficulty: "medium",
        expectedAnswer: "User should provide a relevant answer",
      });

      setCurrentSessionTranscript("");
      setSpeechText("");
      setInterimTranscript("");
      setFinalTranscript("");
      resetSpeechTranscript();
    } else if (message.type === "user" && message.answer) {
      setCurrentQuestionData({
        question: "Your Answer",
        answer: message.answer,
      });
    }
  };

  const handlePermissionsGranted = () => {
    console.log("✅ Permissions granted in guidelines step 4");
    setPermissionsGrantedInGuidelines(true);
  };

  const handleAvatarSelect = (avatar: AvatarData) => {
    setSelectedAvatar(avatar);
  };

  const handleGuidelinesComplete = async () => {
    setIsGuidelinesModalOpen(false);

    const hasSeenWarning = localStorage.getItem("interview-warning-seen");
    if (!hasSeenWarning) {
      setShowInitialWarningModal(true);
    } else {
      await startInterviewProcess();
    }
  };

  const handleInitialWarningComplete = async () => {
    setShowInitialWarningModal(false);
    localStorage.setItem("interview-warning-seen", "true");
    await startInterviewProcess();
  };

  const startInterviewProcess = async () => {
    setIsInterviewStarted(true);
    setInterviewStartTime(new Date());
    setTimeRemaining(INTERVIEW_CONSTANTS.TIMER.INITIAL_TIME);

    if (permissionsGrantedInGuidelines) {
      console.log("🎥 Starting camera immediately (permissions already granted)");
      setCameraPermission("granted");
      await requestCameraPermission(true);
    }

    await startRealInterview();

    setTimeout(() => {
      saveCurrentStateData();
    }, 1000);
  };

  const startRealInterview = async () => {
    try {
      if (!isAuthenticated()) {
        console.error("User not authenticated. Redirecting to login...");
        router.push("/");
        return;
      }

      console.log("🎥 Interview real process started");

      const interviewIdParam = searchParams.get("interviewId");

      if (interviewIdParam) {
        setInterviewId(interviewIdParam);
        await generateFirstQuestion(interviewIdParam);
      } else {
        console.error("No interview ID provided. Cannot start interview.");
        setError("No interview ID provided. Please start the interview from the dashboard.");
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      if (error instanceof Error) {
        setError(`Failed to start interview: ${error.message}`);
      } else {
        setError("Failed to start interview. Please try again.");
      }
    }
  };

  const generateFirstQuestion = async (interviewId: string) => {
    try {
      console.log("🎯 Generating first question via WebSocket for interview:", interviewId);

      let attempts = 0;
      const maxAttempts = 10;

      while (!isSocketConnected && attempts < maxAttempts) {
        console.warn(`⚠️ WebSocket not connected, waiting... (attempt ${attempts + 1}/${maxAttempts})`);
        if (attempts === 0) {
          toast.info("Connecting to server...");
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
        attempts++;
      }

      if (!isSocketConnected) {
        throw new Error("Failed to connect to server. Please check your connection.");
      }

      console.log("✅ WebSocket connected, requesting first question...");
      generateFirstQuestionWS();

      console.log("✅ First question request sent via WebSocket");
    } catch (error) {
      console.error("❌ Error generating first question:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to generate first question. Please try again.");
      }
    }
  };

  const fetchInterviewData = useCallback(async (id: string) => {
    if (!id) return;

    setIsLoadingInterviewData(true);
    try {
      console.log("📊 Fetching interview data for ID:", id);
      const response = await InterviewApiService.getInterviewById(id);
      if (response.success && response.data) {
        setInterviewData(response.data);
        console.log("✅ Interview data loaded");
      } else {
        console.warn("⚠️ No interview data found for ID:", id);
        setInterviewData(null);
      }
    } catch (error) {
      console.error("❌ Failed to fetch interview data:", error);
      toast.error("Failed to load interview details");
      setInterviewData(null);
    } finally {
      setIsLoadingInterviewData(false);
    }
  }, []);

  const fetchInterviewerData = useCallback(async (id: string) => {
    if (!id) return;

    setIsLoadingInterviewerData(true);
    try {
      console.log("👤 Fetching interviewer data for ID:", id);
      const response = await InterviewerApiService.getInterviewerById(id);
      if (response.success && response.data) {
        const cleanedData: Interviewer = {
          ...response.data,
          avatar:
            response.data.avatar &&
            typeof response.data.avatar === "string" &&
            response.data.avatar.length > 0 &&
            !response.data.avatar.includes("ED")
              ? response.data.avatar
              : "",
        };

        setInterviewerData(cleanedData);
        console.log("✅ Interviewer data loaded");
      } else {
        console.warn("⚠️ No interviewer data found for ID:", id);
        setInterviewerData(null);
      }
    } catch (error) {
      console.error("❌ Failed to fetch interviewer data:", error);
      toast.error("Failed to load interviewer details");
      setInterviewerData(null);
    } finally {
      setIsLoadingInterviewerData(false);
    }
  }, []);

  const handleTestCamera = async () => {
    try {
      console.log("🎥 Testing camera from guidelines modal...");
      setCameraPermission("pending");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: INTERVIEW_CONSTANTS.CAMERA.VIDEO_WIDTH },
          height: { ideal: INTERVIEW_CONSTANTS.CAMERA.VIDEO_HEIGHT },
          facingMode: INTERVIEW_CONSTANTS.CAMERA.FACING_MODE,
        },
        audio: true,
      });

      console.log("🎥 Camera test successful, stream received:", stream);
      setCameraStream(stream);
      setCameraPermission("granted");
      setCameraTested(true);
      setIsVideoOn(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        safeVideoPlay(videoRef.current);
      }

      setTimeout(() => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        setCameraStream(null);
        setIsVideoOn(false);
        console.log("🎥 Camera test completed, stream stopped");
      }, 3000);
    } catch (error) {
      console.error("🎥 Camera test failed:", error);
      setCameraPermission("denied");
      setCameraTested(false);
    }
  };

  const handleWarningModalClose = async () => {
    setShowWarningModal(false);

    if (warningStatus.isTerminated) {
      router.push("/dashboard?interviewTerminated=true");
      return;
    }

    if (pendingNextQuestion) {
      setCurrentQuestion(pendingNextQuestion);
      setQuestionNumber(questionNumber + 1);
      setUserAnswer("");
      setAnswerAnalysis(null);
      setPendingNextQuestion(null);

      setCurrentSessionTranscript("");
      setSpeechText("");
      setInterimTranscript("");
      setFinalTranscript("");
      resetSpeechTranscript();

      await streamQuestionToBoth(pendingNextQuestion.question, pendingNextQuestion.questionId);

      if (!isProctoring) {
        startProctoring();
      }
    }
  };

  // ============== EFFECTS ==============

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
    const type = searchParams.get("type") || "resume";
    setInterviewType(type);

    const interviewIdParam = searchParams.get("interviewId");
    if (interviewIdParam) {
      console.log("🔍 Setting interviewId from URL params:", interviewIdParam);
      setInterviewId(interviewIdParam);
    }

    const isTerminated = localStorage.getItem("interview-terminated");
    if (isTerminated === "true") {
      router.push("/dashboard?interviewTerminated=true");
      return;
    }

    const restoredState = restoreInterviewState();
    if (restoredState && hasActiveSession()) {
      console.log("🔄 Restoring interview state after page refresh");

      const timeRemaining = restoredState.timeRemaining || 0;
      if (timeRemaining <= 0) {
        console.log("⏰ Interview session expired, clearing state");
        clearInterviewLocalStorage(interviewIdParam);
        toast.error("Interview session has expired. Please start a new interview.");
        return;
      }

      if (restoredState.interviewId) setInterviewId(restoredState.interviewId);
      if (restoredState.interviewType) setInterviewType(restoredState.interviewType);
      if (restoredState.isInterviewStarted) {
        setIsInterviewStarted(restoredState.isInterviewStarted);
        setIsGuidelinesModalOpen(false);
      }
      if (restoredState.interviewStartTime) setInterviewStartTime(restoredState.interviewStartTime);
      if (restoredState.timeRemaining !== undefined) setTimeRemaining(restoredState.timeRemaining);
      if (restoredState.currentQuestion) setCurrentQuestion(restoredState.currentQuestion);
      if (restoredState.questionNumber) setQuestionNumber(restoredState.questionNumber);
      if (restoredState.chatMessages) setChatMessages(restoredState.chatMessages);
      if (restoredState.userAnswer) setUserAnswer(restoredState.userAnswer);
      if (restoredState.warningCount !== undefined) {
        setWarningStatus((prev) => ({ ...prev, warningCount: restoredState.warningCount || 0 }));
        if (typeof window !== "undefined") {
          localStorage.setItem("interview-warning-count", (restoredState.warningCount || 0).toString());
        }
      }
      if (restoredState.warningStatus) {
        setWarningStatus(restoredState.warningStatus);
        if (typeof window !== "undefined") {
          localStorage.setItem("interview-warning-status", JSON.stringify(restoredState.warningStatus));
        }
      }

      requestCameraPermission();

      console.log("✅ Interview state restored successfully");
      toast.success(
        `Interview resumed from question ${restoredState.questionNumber}. Time remaining: ${Math.floor(
          (restoredState.timeRemaining || 0) / 60
        )} minutes`
      );
    } else {
      const incompleteData = localStorage.getItem("current-interview-id");
      if (incompleteData) {
        console.log("🧹 Cleaning up incomplete interview data");
        clearInterviewLocalStorage(interviewIdParam);
      }
    }
  }, [searchParams, router]);

  // Fetch interview data when ID changes
  useEffect(() => {
    if (interviewId) {
      fetchInterviewData(interviewId);
    }
  }, [interviewId, fetchInterviewData]);

  // Fetch interviewer data when interview data loads
  useEffect(() => {
    if (interviewData?.interviewerId) {
      fetchInterviewerData(interviewData.interviewerId);
    }
  }, [interviewData?.interviewerId, fetchInterviewerData]);

  // Check for existing cheating detection status
  useEffect(() => {
    if (interviewId) {
      const savedCheatingStatus = localStorage.getItem(`cheating-detected-${interviewId}`);
      if (savedCheatingStatus === "true") {
        setPersistentCheatingDetected(true);
        console.log(`[PROCTORING] Cheating detection status restored for interview ${interviewId}`);
      }
    }
  }, [interviewId]);

  // Update computer vision violations
  useEffect(() => {
    if (cvStats.multiplePersonIncidents > 0 && cvStats.multiplePersonIncidents !== cvViolations.multiplePersonIncidents) {
      setCvViolations((prev) => ({
        ...prev,
        multiplePersonIncidents: cvStats.multiplePersonIncidents,
        totalViolations: prev.totalViolations + 1,
        violations: [
          ...prev.violations,
          {
            type: "MULTIPLE_PEOPLE",
            timestamp: new Date(),
            count: cvStats.currentPeople,
          },
        ],
      }));
    }

    if (cvStats.phoneDetections > 0 && cvStats.phoneDetections !== cvViolations.phoneDetections) {
      setCvViolations((prev) => ({
        ...prev,
        phoneDetections: cvStats.phoneDetections,
        totalViolations: prev.totalViolations + 1,
        violations: [
          ...prev.violations,
          {
            type: "PHONE_DETECTED",
            timestamp: new Date(),
            count: cvStats.currentPhones,
          },
        ],
      }));
    }
  }, [cvStats.multiplePersonIncidents, cvStats.phoneDetections]);

  // Store CV detection points
  useEffect(() => {
    if (isInterviewStarted && isCVModelLoaded) {
      const hasViolation = cvStats.currentPeople > 1 || cvStats.currentPhones > 0;
      let violationType = "";

      if (cvStats.currentPeople > 1 && cvStats.currentPhones > 0) {
        violationType = "MULTIPLE_PEOPLE_AND_DEVICES";
      } else if (cvStats.currentPeople > 1) {
        violationType = "MULTIPLE_PEOPLE";
      } else if (cvStats.currentPhones > 0) {
        violationType = "MOBILE_DEVICE";
      }

      const detectionPoint: CVDetectionPoint = {
        timestamp: new Date(),
        peopleCount: cvStats.currentPeople,
        phoneCount: cvStats.currentPhones,
        violation: hasViolation,
        violationType: hasViolation ? violationType : undefined,
      };

      setCvDetectionPoints((prev) => {
        const newPoints = [...prev, detectionPoint];
        return newPoints.slice(-100);
      });
    }
  }, [cvStats.currentPeople, cvStats.currentPhones, isInterviewStarted, isCVModelLoaded]);

  // Update persistent cheating status
  useEffect(() => {
    if (isInterviewStarted && interviewId) {
      const currentCheatingDetected = cvStats.currentPeople > 1 || cvStats.currentPhones > 0;

      if (currentCheatingDetected && !persistentCheatingDetected) {
        setPersistentCheatingDetected(true);
        localStorage.setItem(`cheating-detected-${interviewId}`, "true");
        console.log(`[PROCTORING] Cheating detected and saved for interview ${interviewId}`);
      }
    }
  }, [cvStats.currentPeople, cvStats.currentPhones, isInterviewStarted, interviewId, persistentCheatingDetected]);

  // Ensure video element gets the stream
  useEffect(() => {
    if (cameraStream && videoRef.current) {
      console.log("🎥 Setting video stream to element");
      videoRef.current.srcObject = cameraStream;

      if (videoRef.current) {
        safeVideoPlay(videoRef.current);
      }

      if (videoRef.current && isCVModelLoaded && !cvInitializedRef.current) {
        console.log("🔍 Initializing computer vision detection");
        initializeComputerVision(videoRef.current);
        cvInitializedRef.current = true;
      }

      if (!isVideoOn) {
        console.log("🎥 Auto-enabling video since we have camera stream");
        setIsVideoOn(true);
      }
    }
  }, [cameraStream, isVideoOn, safeVideoPlay, isCVModelLoaded, initializeComputerVision]);

  // Ensure video is displayed when interview starts
  useEffect(() => {
    if (isInterviewStarted && cameraStream && videoRef.current) {
      console.log("🎥 Interview started with camera stream - ensuring video display");
      videoRef.current.srcObject = cameraStream;
      setIsVideoOn(true);
      safeVideoPlay(videoRef.current);

      if (isCVModelLoaded && !cvInitializedRef.current) {
        console.log("🔍 Initializing computer vision for interview");
        initializeComputerVision(videoRef.current);
        cvInitializedRef.current = true;
      }
    }
  }, [isInterviewStarted, cameraStream, safeVideoPlay, isCVModelLoaded, initializeComputerVision]);

  // Handle speech recognition updates
  useEffect(() => {
    if (speechTranscript && !speechDisabled) {
      setFinalTranscript(speechTranscript);
      setCurrentSessionTranscript(speechTranscript);
      setUserAnswer(speechTranscript);
      console.log("🎤 Session transcript updated:", speechTranscript);
    }
  }, [speechTranscript, speechDisabled]);

  useEffect(() => {
    if (webkitInterimTranscript && !speechDisabled) {
      setInterimTranscript(webkitInterimTranscript);
    }
  }, [webkitInterimTranscript, speechDisabled]);

  useEffect(() => {
    setIsListening(isSpeechListening);
  }, [isSpeechListening]);

  useEffect(() => {
    if (speechError) {
      setSpeechRecognitionError(speechError);
    }
  }, [speechError]);

  // Sync WebSocket generating state
  useEffect(() => {
    setIsGeneratingQuestion(isGeneratingQuestionWS);
  }, [isGeneratingQuestionWS]);

  // Sync WebSocket analyzing state
  useEffect(() => {
    setIsAnalyzing(isAnalyzingWS);
  }, [isAnalyzingWS]);

  // Clear analyzing state when audio starts playing
  useEffect(() => {
    if (isAudioPlaying && isAnalyzing) {
      console.log("🎵 Audio started playing, clearing analyzing state");
      setIsAnalyzing(false);
    }
  }, [isAudioPlaying, isAnalyzing]);

  // Fetch proctoring data from backend when WebSocket connects
  useEffect(() => {
    if (isSocketConnected && interviewId) {
      console.log("📊 Fetching proctoring data from backend on connection...");
      getProctoringDataWS();
    }
  }, [isSocketConnected, interviewId, getProctoringDataWS]);

  // Sync proctoring data to backend
  useEffect(() => {
    if (isLoadingFromBackendRef.current) {
      console.log("⏸️ Skipping sync - loading from backend");
      return;
    }

    if (isSocketConnected && interviewId && isInterviewStarted && proctoringData) {
      const debounceTimeout = setTimeout(() => {
        console.log("🔄 Syncing proctoring data to backend...", {
          tabSwitches: proctoringData.tabSwitches,
          copyPasteCount: proctoringData.copyPasteCount,
        });
        updateProctoringDataWS({
          tabSwitches: proctoringData.tabSwitches,
          copyPasteCount: proctoringData.copyPasteCount,
        });
      }, 1000);

      return () => clearTimeout(debounceTimeout);
    }
  }, [
    isSocketConnected,
    interviewId,
    isInterviewStarted,
    proctoringData.tabSwitches,
    proctoringData.copyPasteCount,
    updateProctoringDataWS,
  ]);

  // Network status check
  useEffect(() => {
    const checkNetworkStatus = () => {
      if (navigator.onLine) {
        setNetworkStatus("online");
        console.log("🌐 Network status: Online (navigator.onLine)");
      } else {
        setNetworkStatus("offline");
        console.log("🌐 Network status: Offline (navigator.onLine)");
      }
    };

    checkNetworkStatus();

    const handleOnline = () => {
      setNetworkStatus("online");
      console.log("🌐 Network came back online");
    };

    const handleOffline = () => {
      setNetworkStatus("offline");
      console.log("🌐 Network went offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const interval = setInterval(async () => {
      try {
        await fetch("https://www.google.com", {
          method: "HEAD",
          mode: "no-cors",
        });
        setNetworkStatus("online");
      } catch (error) {
        setNetworkStatus("offline");
      }
    }, 60000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Show subtitles when interim transcript changes
  useEffect(() => {
    if (webkitInterimTranscript && !speechDisabled) {
      setShowSubtitles(true);
      console.log("🎤 Interim transcript updated:", webkitInterimTranscript);
    }
  }, [webkitInterimTranscript, speechDisabled]);

  // Handle subtitle timer
  useEffect(() => {
    if (webkitInterimTranscript && !speechDisabled) {
      if (subtitleTimerRef.current) {
        clearTimeout(subtitleTimerRef.current);
      }

      subtitleTimerRef.current = setTimeout(() => {
        setShowSubtitles(false);
        console.log("🎤 Subtitles hidden after 2 seconds of silence");
      }, INTERVIEW_CONSTANTS.SUBTITLE.HIDE_DELAY);
    }
  }, [webkitInterimTranscript, speechDisabled]);

  // Auto-save when critical state changes
  useEffect(() => {
    if (isInterviewStarted && interviewId) {
      autoSaveState({
        interviewId,
        interviewType,
        isInterviewStarted,
        interviewStartTime: interviewStartTime || new Date(),
        timeRemaining,
        currentQuestion,
        questionNumber,
        chatMessages,
        userAnswer,
        warningStatus,
        tabSwitchCount,
        proctoringData,
        cvViolations,
      });
    }
  }, [
    userAnswer,
    currentQuestion,
    questionNumber,
    chatMessages,
    timeRemaining,
    warningStatus.warningCount,
    tabSwitchCount,
    autoSaveState,
    isInterviewStarted,
    interviewId,
  ]);

  // Tab switch detection
  useEffect(() => {
    if (!isInterviewStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prevCount) => {
          const newCount = prevCount + 1;
          setWarningShownForCurrentCount(false);

          if (typeof window !== "undefined") {
            localStorage.setItem("interview-tab-switch-count", newCount.toString());
          }

          return newCount;
        });
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave? Your interview will be cancelled.";
      return "Are you sure you want to leave? Your interview will be cancelled.";
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isInterviewStarted]);

  // Handle modal display when user returns to tab
  useEffect(() => {
    if (tabSwitchCount === WARNING_THRESHOLDS.TAB_SWITCH_WARNING && isInterviewStarted && !warningShownForCurrentCount) {
      setShowTabSwitchModal(true);
      setWarningShownForCurrentCount(true);
    } else if (tabSwitchCount >= WARNING_THRESHOLDS.TAB_SWITCH_TERMINATE && isInterviewStarted) {
      // Tab switch ending is disabled for now
      // handleEndInterview(); // DISABLED FOR NOW
    }
  }, [tabSwitchCount, isInterviewStarted, warningShownForCurrentCount]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      cleanupComputerVision();
      cvInitializedRef.current = false;

      if (subtitleTimerRef && subtitleTimerRef.current) {
        clearTimeout(subtitleTimerRef.current);
      }
    };
  }, [cameraStream, cleanupComputerVision]);

  // Save state on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isInterviewStarted && interviewId) {
        saveCurrentStateData();

        const message = "Your interview progress will be saved. Are you sure you want to leave?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && isInterviewStarted && interviewId) {
        saveCurrentStateData();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isInterviewStarted, interviewId, saveCurrentStateData]);

  // ============== RENDER ==============

  if (!isClient || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Interview</h2>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we prepare your interview...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customScrollbarStyles }} />
      <div
        className={`h-screen w-screen overflow-hidden ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"
            : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"
        }`}>
        {/* Modals */}
        <InterviewGuidelinesModal
          isOpen={isGuidelinesModalOpen}
          onStartInterview={handleGuidelinesComplete}
          onTestCamera={handleTestCamera}
          cameraTested={cameraTested}
          onPermissionsGranted={handlePermissionsGranted}
        />

        <InitialWarningModal isOpen={showInitialWarningModal} onClose={handleInitialWarningComplete} />

        <WarningModal isOpen={showWarningModal} onClose={handleWarningModalClose} warningData={warningData} warningStatus={warningStatus} />

        <TabSwitchModal
          isOpen={showTabSwitchModal}
          isDarkMode={isDarkMode}
          tabSwitchCount={tabSwitchCount}
          onClose={() => setShowTabSwitchModal(false)}
        />

        <ExitConfirmModal
          isOpen={showExitConfirm}
          isDarkMode={isDarkMode}
          isGeneratingQuestion={isGeneratingQuestion}
          onConfirm={handleEndInterview}
          onCancel={() => setShowExitConfirm(false)}
        />

        <InterviewDetailsModal
          isOpen={isInterviewDetailsModalOpen}
          onClose={() => setIsInterviewDetailsModalOpen(false)}
          interviewData={interviewData}
          isLoading={isLoadingInterviewData}
          isDarkMode={isDarkMode}
          onInterviewerClick={() => setIsInterviewerDetailsModalOpen(true)}
        />

        <InterviewerDetailsModal
          isOpen={isInterviewerDetailsModalOpen}
          onClose={() => {
            console.log("🔍 Closing interviewer modal...");
            setIsInterviewerDetailsModalOpen(false);
          }}
          interviewerData={interviewerData}
          isLoading={isLoadingInterviewerData}
          isDarkMode={isDarkMode}
        />

        <AvatarSelector
          selectedAvatar={selectedAvatar}
          onAvatarSelect={handleAvatarSelect}
          isVisible={showAvatarSelector}
          onClose={() => setShowAvatarSelector(false)}
        />

        {/* Top Header Bar */}
        <InterviewHeader
          isDarkMode={isDarkMode}
          isInterviewStarted={isInterviewStarted}
          tabSwitchCount={tabSwitchCount}
          isCVLoading={isCVLoading}
          isCVModelLoaded={isCVModelLoaded}
          persistentCheatingDetected={persistentCheatingDetected}
          warningStatus={warningStatus}
          onCVDetectionClick={displayCVDetectionPoints}
          isLoadingInterviewData={isLoadingInterviewData}
          interviewData={interviewData}
          interviewId={interviewId}
          onInterviewDetailsClick={() => setIsInterviewDetailsModalOpen(true)}
          timeRemaining={timeRemaining}
          isLowTime={isLowTime}
          formatTime={formatTime}
          onEndInterview={() => setShowExitConfirm(true)}
          isGeneratingQuestion={isGeneratingQuestion}
        />

        {/* Main Interview Interface */}
        <div className="h-[calc(100vh-4rem)] w-full flex bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          {/* Left Panel - Main Interview Area */}
          <div className="w-[70%] flex flex-col">
            {/* Video Area */}
            <div className="flex-1 px-4 pt-4 min-h-0">
              <div className="h-full flex flex-col min-h-0">
                <VideoSection
                  isDarkMode={isDarkMode}
                  cameraStream={cameraStream}
                  cameraPermission={cameraPermission}
                  isVideoOn={isVideoOn}
                  videoRef={videoRef}
                  safeVideoPlay={safeVideoPlay}
                  requestCameraPermission={requestCameraPermission}
                  handleToggleVideo={handleToggleVideo}
                  warningStatus={warningStatus}
                  isRecording={isRecording}
                  isInterviewStarted={isInterviewStarted}
                  interviewerData={interviewerData}
                  isLoadingInterviewerData={isLoadingInterviewerData}
                  onInterviewerClick={() => setIsInterviewerDetailsModalOpen(true)}
                  isSpeechInitializing={isSpeechInitializing}
                  onStartRecording={handleStartRecording}
                  onStopRecording={handleStopRecording}
                  isListening={isListening}
                  speechRecognitionError={speechRecognitionError}
                  retrySpeechRecognition={retrySpeechRecognition}
                  showHint={showHint}
                  onHintToggle={handleHintToggle}
                  currentQuestionData={currentQuestionData}
                  isAudioPlaying={isAudioPlaying}
                  currentAudio={currentAudio}
                  selectedAvatarVideoSrc={selectedAvatar?.videoSrc}
                  onAvatarClick={() => setShowAvatarSelector(true)}
                  isAnalyzing={isAnalyzing}
                  showSubtitles={showSubtitles}
                  webkitInterimTranscript={webkitInterimTranscript}
                  speechDisabled={speechDisabled}
                />
              </div>
            </div>

            {/* Chat Input Area */}
            <div className="px-4 pb-4">
              <AnswerInput
                isDarkMode={isDarkMode}
                userAnswer={userAnswer}
                setUserAnswer={setUserAnswer}
                isGeneratingQuestion={isGeneratingQuestion}
                isSubmittingAnswer={isSubmittingAnswer}
                currentQuestion={currentQuestion}
                isRecording={isRecording}
                isListening={isListening}
                onSubmit={handleSubmitAnswer}
              />
            </div>
          </div>

          {/* Right Panel - Transcript */}
          <ChatSection
            isDarkMode={isDarkMode}
            chatMessages={chatMessages}
            chatMessagesRef={chatMessagesRef}
            onMessageClick={handleChatMessageClick}
          />
        </div>
      </div>
    </>
  );
};

export default InterviewPage;
