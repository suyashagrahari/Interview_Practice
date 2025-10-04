"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AiImage from "../../../public/images/ai_image.jpeg";
import CandidateImage from "../../../public/images/HumanImage.webp";
import {
  ArrowLeft,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Play,
  Pause,
  Square,
  Eye,
  Send,
  Bot,
  User,
  Timer,
  Zap,
  Star,
  MessageCircle,
  Sun,
  Moon,
  Palette,
  X,
  RotateCcw,
} from "lucide-react";
import InterviewGuidelinesModal from "@/components/interview/interview-guidelines-modal";
import StreamingText from "@/components/ui/streaming-text";
import { useImprovedSpeechRecognition } from "@/hooks/useImprovedSpeechRecognition";
import { useProctoring } from "@/hooks/useProctoring";
import { useComputerVision } from "@/hooks/useComputerVision";
import { isAuthenticated, getAuthTokens } from "@/lib/cookies";
import { toast } from "@/utils/toast";
import {
  interviewRealtimeApi,
  InterviewQuestion,
  AnswerAnalysis,
  ProctoringData,
  WarningData,
  WarningStatus,
} from "@/lib/api/interview-realtime";
import WarningModal from "@/components/interview/warning-modal";
import InitialWarningModal from "@/components/interview/initial-warning-modal";
import { useTheme } from "@/contexts/theme-context";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import {
  saveInterviewState,
  restoreInterviewState,
  clearInterviewState,
  hasActiveSession,
  updateInterviewState,
  updateProctoringViolations,
  calculateTimeRemaining,
} from "@/lib/interview-persistence";
import { useInterviewWebSocket } from "@/hooks/useInterviewWebSocket";

const InterviewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Video play queue to prevent concurrent play requests
  const playQueueRef = useRef<boolean>(false);
  const currentPlayPromiseRef = useRef<Promise<void> | null>(null);

  // Safe video play function that handles AbortError and prevents concurrent calls
  const safeVideoPlay = useCallback(
    async (videoElement: HTMLVideoElement): Promise<void> => {
      // If there's already a play request in progress, wait for it to complete
      if (currentPlayPromiseRef.current) {
        try {
          await currentPlayPromiseRef.current;
        } catch (error) {
          // Ignore errors from previous play attempts
          console.log(
            "Previous play request completed with error (this is normal)"
          );
        }
      }

      // If video is already playing, don't try to play again
      if (!videoElement.paused) {
        return;
      }

      try {
        playQueueRef.current = true;
        const playPromise = videoElement.play();
        currentPlayPromiseRef.current = playPromise;

        await playPromise;
        console.log("🎥 Video playing successfully");
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.log(
              "🎥 Video play request was aborted (this is normal when switching streams)"
            );
          } else if (error.name === "NotAllowedError") {
            console.log(
              "🎥 Video play was blocked by browser policy (user interaction required)"
            );
          } else {
            console.error("🎥 Video play failed:", error);
          }
        } else {
          console.error("🎥 Video play failed with unknown error:", error);
        }
      } finally {
        playQueueRef.current = false;
        currentPlayPromiseRef.current = null;
      }
    },
    []
  );
  const [isClient, setIsClient] = useState(false);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(true);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechDisabled, setSpeechDisabled] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraPermission, setCameraPermission] = useState<
    "pending" | "granted" | "denied"
  >("pending");
  const [cameraTested, setCameraTested] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Speech-to-text functionality
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [speechText, setSpeechText] = useState("");
  const [speechRecognitionError, setSpeechRecognitionError] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionsGrantedInGuidelines, setPermissionsGrantedInGuidelines] =
    useState(false);
  // Use the new webkit speech recognition hook
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
    language: "en-US",
    continuous: true,
    interimResults: true,
    timeout: 600000, // 10 minutes timeout for long speech sessions
    retryAttempts: 2, // 2 retry attempts
    retryDelay: 2000, // 2 second delay between retries
  });

  const [networkStatus, setNetworkStatus] = useState<string>("checking");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes in seconds
  const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(
    null
  );
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [interviewType, setInterviewType] = useState("");
  const [liveTranscription, setLiveTranscription] = useState("");
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeButtonRef = useRef<HTMLButtonElement>(null);

  // Use theme context with proper fallback
  const themeContext = useTheme();
  const { theme, setTheme, toggleTheme, isDarkMode, mounted } = themeContext;

  // Debug theme state
  useEffect(() => {
    console.log("🎨 Interview Page Theme State:", {
      theme,
      isDarkMode,
      mounted,
      localStorageTheme:
        typeof window !== "undefined" ? localStorage.getItem("theme") : "N/A",
    });
  }, [theme, isDarkMode, mounted]);

  const [currentQuestionData, setCurrentQuestionData] = useState({
    question: "Can you explain the concept of closures in JavaScript?",
    answer:
      "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. Closures are created every time a function is created, at function creation time. They allow for data privacy and the creation of function factories.",
  });

  // Real-time interview state
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] =
    useState<InterviewQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [answerAnalysis, setAnswerAnalysis] = useState<AnswerAnalysis | null>(
    null
  );
  const [userAnswer, setUserAnswer] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentSessionTranscript, setCurrentSessionTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const subtitleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const isLoadingFromBackendRef = useRef<boolean>(false);

  // Warning System State
  const [warningData, setWarningData] = useState<WarningData>({
    issued: false,
  });
  // Initialize warning status from localStorage if available
  const getInitialWarningStatus = (): WarningStatus => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("interview-warning-status");
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.error("Failed to load warning status:", error);
      }
    }
    return {
      warningCount: 0,
      isTerminated: false,
      canContinue: true,
      lastWarningAt: null,
    };
  };

  // Initialize tab switch count from localStorage if available
  const getInitialTabSwitchCount = (): number => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("interview-tab-switch-count");
        if (stored) {
          return parseInt(stored, 10);
        }
      } catch (error) {
        console.error("Failed to load tab switch count:", error);
      }
    }
    return 0;
  };

  const [warningStatus, setWarningStatus] = useState<WarningStatus>(
    getInitialWarningStatus
  );
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingNextQuestion, setPendingNextQuestion] =
    useState<InterviewQuestion | null>(null);
  const [showInitialWarningModal, setShowInitialWarningModal] = useState(false);
  const [showTabSwitchModal, setShowTabSwitchModal] = useState(false);
  const [warningShownForCurrentCount, setWarningShownForCurrentCount] =
    useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(
    getInitialTabSwitchCount
  );

  // Proctoring
  const {
    proctoringData,
    startProctoring,
    stopProctoring,
    resetProctoring,
    setProctoringData,
    isProctoring,
  } = useProctoring();

  // Computer Vision Detection
  const {
    stats: cvStats,
    isModelLoaded: isCVModelLoaded,
    isVideoReady: isCVVideoReady,
    isLoading: isCVLoading,
    initializeComputerVision,
    cleanup: cleanupComputerVision,
  } = useComputerVision();

  // Track if computer vision has been initialized to prevent multiple calls
  const cvInitializedRef = useRef<boolean>(false);

  // Store computer vision violations in state (not localStorage)
  const [cvViolations, setCvViolations] = useState({
    multiplePersonIncidents: 0,
    phoneDetections: 0,
    totalViolations: 0,
    violations: [] as Array<{
      type: string;
      timestamp: Date;
      count: number;
    }>,
  });

  // Persistent cheating detection status for this interview
  const [persistentCheatingDetected, setPersistentCheatingDetected] =
    useState(false);

  // Check for existing cheating detection status when interview loads
  useEffect(() => {
    if (interviewId) {
      const savedCheatingStatus = localStorage.getItem(
        `cheating-detected-${interviewId}`
      );
      if (savedCheatingStatus === "true") {
        setPersistentCheatingDetected(true);
        console.log(
          `[PROCTORING] Cheating detection status restored for interview ${interviewId}`
        );
      }
    }
  }, [interviewId]);

  // Store all CV detection points for console display
  const [cvDetectionPoints, setCvDetectionPoints] = useState<
    Array<{
      timestamp: Date;
      peopleCount: number;
      phoneCount: number;
      violation: boolean;
      violationType?: string;
    }>
  >([]);

  // Update computer vision violations in state when detected (simplified to prevent loops)
  useEffect(() => {
    // Only update if there are actual violations and they're new
    if (
      cvStats.multiplePersonIncidents > 0 &&
      cvStats.multiplePersonIncidents !== cvViolations.multiplePersonIncidents
    ) {
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

    if (
      cvStats.phoneDetections > 0 &&
      cvStats.phoneDetections !== cvViolations.phoneDetections
    ) {
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

  // Store all CV detection points continuously
  useEffect(() => {
    if (isInterviewStarted && isCVModelLoaded) {
      const hasViolation =
        cvStats.currentPeople > 1 || cvStats.currentPhones > 0;
      let violationType = "";

      if (cvStats.currentPeople > 1 && cvStats.currentPhones > 0) {
        violationType = "MULTIPLE_PEOPLE_AND_DEVICES";
      } else if (cvStats.currentPeople > 1) {
        violationType = "MULTIPLE_PEOPLE";
      } else if (cvStats.currentPhones > 0) {
        violationType = "MOBILE_DEVICE";
      }

      const detectionPoint = {
        timestamp: new Date(),
        peopleCount: cvStats.currentPeople,
        phoneCount: cvStats.currentPhones,
        violation: hasViolation,
        violationType: hasViolation ? violationType : undefined,
      };

      setCvDetectionPoints((prev) => {
        // Keep only last 100 detection points to prevent memory issues
        const newPoints = [...prev, detectionPoint];
        return newPoints.slice(-100);
      });
    }
  }, [
    cvStats.currentPeople,
    cvStats.currentPhones,
    isInterviewStarted,
    isCVModelLoaded,
  ]);

  // Update persistent cheating status when cheating is detected
  useEffect(() => {
    if (isInterviewStarted && interviewId) {
      const currentCheatingDetected =
        cvStats.currentPeople > 1 || cvStats.currentPhones > 0;

      if (currentCheatingDetected && !persistentCheatingDetected) {
        setPersistentCheatingDetected(true);
        localStorage.setItem(`cheating-detected-${interviewId}`, "true");
        console.log(
          `[PROCTORING] Cheating detected and saved for interview ${interviewId}`
        );
      }
    }
  }, [
    cvStats.currentPeople,
    cvStats.currentPhones,
    isInterviewStarted,
    interviewId,
    persistentCheatingDetected,
  ]);

  // Ref for question section scrolling
  const questionSectionRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      type: "ai" | "user";
      message: string;
      timestamp: string;
      questionId?: string;
      answer?: string;
      analysis?: AnswerAnalysis;
    }>
  >([]);

  // Debug logging for WebSocket initialization values
  useEffect(() => {
    console.log("🔍 WebSocket hook values:", {
      interviewId,
      userId: user?.id,
      userObject: user,
    });
  }, [interviewId, user]);

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
    onQuestionReceived: async (question, questionNumber) => {
      console.log("📥 Question received via WebSocket:", question);
      setCurrentQuestion(question);
      setQuestionNumber(questionNumber);
      setUserAnswer("");
      setAnswerAnalysis(null);

      // Clear speech recognition
      setCurrentSessionTranscript("");
      setSpeechText("");
      setInterimTranscript("");
      setFinalTranscript("");
      resetSpeechTranscript();

      // Stream question to chat
      await streamQuestionToBoth(question.question, question.questionId);

      // Start proctoring (don't reset - we need to preserve backend data)
      if (!isProctoring) {
        startProctoring();
      }

      saveCurrentState();
    },
    onAnswerSubmitted: (data) => {
      console.log("✅ Answer submitted via WebSocket:", data);

      // Answer already added to chat in handleSubmitAnswer
      // No need to add it again here

      // Handle warnings
      if (data.warningIssued) {
        const newWarningStatus = {
          warningCount: data.warningCount,
          isTerminated: data.interviewTerminated,
          canContinue: data.canContinue,
          lastWarningAt: data.lastWarningAt,
        };

        setWarningStatus(newWarningStatus);

        // Immediately save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "interview-warning-status",
            JSON.stringify(newWarningStatus)
          );
          localStorage.setItem(
            "interview-warning-count",
            data.warningCount.toString()
          );
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
      saveCurrentState();
    },
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
    onProctoringDataReceived: (data) => {
      console.log("📊 Received proctoring data from backend:", data);

      // Set flag to prevent sync to backend while loading FROM backend
      isLoadingFromBackendRef.current = true;

      // Update warning count from backend
      if (data.warningCount !== undefined) {
        setWarningStatus((prev) => ({
          ...prev,
          warningCount: data.warningCount,
        }));
        // Immediately save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "interview-warning-count",
            data.warningCount.toString()
          );
        }
      }

      // Update proctoring data (tab switches, copy/paste) from backend
      if (data.proctoringData) {
        setProctoringData({
          tabSwitches: data.proctoringData.tabSwitches || 0,
          copyPasteCount: data.proctoringData.copyPasteCount || 0,
        });
        setTabSwitchCount(data.proctoringData.tabSwitches || 0);

        // Immediately save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "interview-tab-switch-count",
            (data.proctoringData.tabSwitches || 0).toString()
          );
        }

        console.log("✅ Proctoring data updated from backend:", {
          tabSwitches: data.proctoringData.tabSwitches,
          copyPasteCount: data.proctoringData.copyPasteCount,
        });
      }

      // Reset flag after a short delay to allow state updates to settle
      setTimeout(() => {
        isLoadingFromBackendRef.current = false;
      }, 100);
    },
  });

  // Sync WebSocket generating state with component state
  useEffect(() => {
    setIsGeneratingQuestion(isGeneratingQuestionWS);
  }, [isGeneratingQuestionWS]);

  // Sync WebSocket analyzing state with component state
  useEffect(() => {
    setIsAnalyzing(isAnalyzingWS);
  }, [isAnalyzingWS]);

  // Fetch proctoring data from backend when WebSocket connects (even before interview starts)
  useEffect(() => {
    if (isSocketConnected && interviewId) {
      console.log("📊 Fetching proctoring data from backend on connection...");
      getProctoringDataWS();
    }
  }, [isSocketConnected, interviewId, getProctoringDataWS]);

  // Sync proctoring data to backend whenever tab switches or copy/paste changes
  useEffect(() => {
    // Don't sync if we're currently loading data FROM backend
    if (isLoadingFromBackendRef.current) {
      console.log("⏸️ Skipping sync - loading from backend");
      return;
    }

    if (
      isSocketConnected &&
      interviewId &&
      isInterviewStarted &&
      proctoringData
    ) {
      const debounceTimeout = setTimeout(() => {
        console.log("🔄 Syncing proctoring data to backend...", {
          tabSwitches: proctoringData.tabSwitches,
          copyPasteCount: proctoringData.copyPasteCount,
        });
        updateProctoringDataWS({
          tabSwitches: proctoringData.tabSwitches,
          copyPasteCount: proctoringData.copyPasteCount,
        });
      }, 1000); // Debounce to avoid too many updates

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

  // Get interview type from URL params and check for termination
  useEffect(() => {
    setIsClient(true);
    const type = searchParams.get("type") || "resume";
    setInterviewType(type);

    // Set interviewId from URL params immediately (needed for WebSocket initialization)
    const interviewIdParam = searchParams.get("interviewId");
    if (interviewIdParam) {
      console.log("🔍 Setting interviewId from URL params:", interviewIdParam);
      setInterviewId(interviewIdParam);
    }

    // Check if interview was previously terminated
    const isTerminated = localStorage.getItem("interview-terminated");
    if (isTerminated === "true") {
      // Redirect to dashboard with termination message
      router.push("/dashboard?interviewTerminated=true");
      return;
    }

    // Try to restore previous interview state if page was refreshed
    const restoredState = restoreInterviewState();
    if (restoredState && hasActiveSession()) {
      console.log("🔄 Restoring interview state after page refresh");

      // Check if interview has expired (45 minutes)
      const timeRemaining = restoredState.timeRemaining || 0;
      if (timeRemaining <= 0) {
        console.log("⏰ Interview session expired, clearing state");
        clearInterviewState();
        toast.error(
          "Interview session has expired. Please start a new interview."
        );
        return;
      }

      // Restore all state values
      if (restoredState.interviewId) setInterviewId(restoredState.interviewId);
      if (restoredState.interviewType)
        setInterviewType(restoredState.interviewType);
      if (restoredState.isInterviewStarted) {
        setIsInterviewStarted(restoredState.isInterviewStarted);
        setIsGuidelinesModalOpen(false); // Skip guidelines if resuming
      }
      if (restoredState.interviewStartTime)
        setInterviewStartTime(restoredState.interviewStartTime);
      if (restoredState.timeRemaining !== undefined)
        setTimeRemaining(restoredState.timeRemaining);
      if (restoredState.currentQuestion)
        setCurrentQuestion(restoredState.currentQuestion);
      if (restoredState.questionNumber)
        setQuestionNumber(restoredState.questionNumber);
      if (restoredState.chatMessages)
        setChatMessages(restoredState.chatMessages);
      if (restoredState.userAnswer) setUserAnswer(restoredState.userAnswer);
      if (restoredState.warningCount !== undefined) {
        setWarningStatus((prev) => ({
          ...prev,
          warningCount: restoredState.warningCount || 0,
        }));
        // Immediately save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "interview-warning-count",
            (restoredState.warningCount || 0).toString()
          );
        }
      }
      if (restoredState.warningStatus) {
        setWarningStatus(restoredState.warningStatus);
        // Immediately save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "interview-warning-status",
            JSON.stringify(restoredState.warningStatus)
          );
        }
      }

      // NOTE: tabSwitchCount and proctoring data are now loaded from backend via WebSocket
      // Don't restore from localStorage as it may be stale

      // Restore camera if it was on
      requestCameraPermission();

      console.log("✅ Interview state restored successfully", {
        questionNumber: restoredState.questionNumber,
        timeRemaining: restoredState.timeRemaining,
        hasCurrentQuestion: !!restoredState.currentQuestion,
        chatMessagesCount: restoredState.chatMessages?.length || 0,
        userAnswerLength: restoredState.userAnswer?.length || 0,
      });
      toast.success(
        `Interview resumed from question ${
          restoredState.questionNumber
        }. Time remaining: ${Math.floor(
          (restoredState.timeRemaining || 0) / 60
        )} minutes`
      );
    } else {
      // Check if there's any incomplete interview data that might need cleanup
      const incompleteData = localStorage.getItem("current-interview-id");
      if (incompleteData) {
        console.log("🧹 Cleaning up incomplete interview data");
        clearInterviewState();
      }
    }
  }, [searchParams, router]);

  // Timer countdown with automatic interview ending
  useEffect(() => {
    if (isInterviewStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev <= 1 ? 0 : prev - 1;

          if (newTime === 0) {
            // Time's up! End interview automatically
            console.log("⏰ Time's up! Automatically ending interview...");
            toast.info("Time's up! Interview ending automatically...");
            handleAutoEndInterview();
          }

          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isInterviewStarted, timeRemaining, interviewStartTime]);

  // Manual save function - only call when needed
  const saveCurrentState = useCallback(() => {
    if (isInterviewStarted && interviewId) {
      saveInterviewState({
        interviewId,
        interviewType,
        isInterviewStarted,
        interviewStartTime: interviewStartTime || new Date(),
        timeElapsed: interviewStartTime
          ? Math.floor(
              (new Date().getTime() - interviewStartTime.getTime()) / 1000
            )
          : 0,
        timeRemaining,
        currentQuestion,
        questionNumber,
        chatMessages,
        userAnswer,
        warningCount: warningStatus.warningCount,
        warningStatus,
        tabSwitchCount,
        proctoringViolations: {
          tabSwitches: proctoringData.tabSwitches || 0,
          copyPasteCount: proctoringData.copyPasteCount || 0,
          faceDetectionIssues:
            cvViolations.multiplePersonIncidents + cvViolations.phoneDetections,
        },
      });

      // Also save proctoring violations separately for the useProctoring hook
      updateProctoringViolations({
        tabSwitches: proctoringData.tabSwitches || 0,
        copyPasteCount: proctoringData.copyPasteCount || 0,
        faceDetectionIssues:
          cvViolations.multiplePersonIncidents + cvViolations.phoneDetections,
      });
    }
  }, [
    isInterviewStarted,
    interviewId,
    interviewType,
    interviewStartTime,
    timeRemaining,
    currentQuestion,
    questionNumber,
    chatMessages,
    userAnswer,
    warningStatus,
    tabSwitchCount,
    proctoringData,
    cvViolations,
  ]);

  // Debounced auto-save function
  const debouncedSaveRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveState = useCallback(() => {
    if (debouncedSaveRef.current) {
      clearTimeout(debouncedSaveRef.current);
    }
    debouncedSaveRef.current = setTimeout(() => {
      saveCurrentState();
    }, 1000); // Save after 1 second of inactivity
  }, [saveCurrentState]);

  // Auto-save when critical state changes
  useEffect(() => {
    if (isInterviewStarted && interviewId) {
      autoSaveState();
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

  // CRITICAL FIX: Immediately save warning status changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && isInterviewStarted && interviewId) {
      try {
        localStorage.setItem(
          "interview-warning-status",
          JSON.stringify(warningStatus)
        );
        localStorage.setItem(
          "interview-warning-count",
          warningStatus.warningCount.toString()
        );
        console.log(
          "💾 Warning status immediately saved to localStorage:",
          warningStatus
        );
      } catch (error) {
        console.error(
          "❌ Failed to save warning status to localStorage:",
          error
        );
      }
    }
  }, [warningStatus, isInterviewStarted, interviewId]);

  // CRITICAL FIX: Immediately save tab switch count changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && isInterviewStarted && interviewId) {
      try {
        localStorage.setItem(
          "interview-tab-switch-count",
          tabSwitchCount.toString()
        );
        console.log(
          "💾 Tab switch count immediately saved to localStorage:",
          tabSwitchCount
        );
      } catch (error) {
        console.error(
          "❌ Failed to save tab switch count to localStorage:",
          error
        );
      }
    }
  }, [tabSwitchCount, isInterviewStarted, interviewId]);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (chatMessagesRef.current && chatMessages.length > 0) {
      // Smooth scroll to bottom when new message is added
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages]);

  // Save state on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isInterviewStarted && interviewId) {
        // Save state immediately before page unload
        saveCurrentState();

        // Optional: Show confirmation dialog
        const message =
          "Your interview progress will be saved. Are you sure you want to leave?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "hidden" &&
        isInterviewStarted &&
        interviewId
      ) {
        // Save state when tab becomes hidden
        saveCurrentState();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Clear debounced save on cleanup
      if (debouncedSaveRef.current) {
        clearTimeout(debouncedSaveRef.current);
      }
    };
  }, [saveCurrentState, isInterviewStarted, interviewId]);

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showThemeMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest("[data-theme-menu]")) {
          setShowThemeMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showThemeMenu]);

  // Cleanup camera stream and computer vision on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      cleanupComputerVision();
      cvInitializedRef.current = false; // Reset initialization flag
    };
  }, [cameraStream, cleanupComputerVision]);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      // Speech recognition cleanup is now handled by the SpeechRecognizer component
      console.log("🎤 Speech recognition cleanup handled by component");
    };
  }, [isListening]);

  // Cleanup subtitle timer on unmount
  useEffect(() => {
    return () => {
      if (subtitleTimerRef && subtitleTimerRef.current) {
        clearTimeout(subtitleTimerRef.current);
      }
    };
  }, []);

  // Check network status
  useEffect(() => {
    const checkNetworkStatus = () => {
      // Use navigator.onLine as primary check
      if (navigator.onLine) {
        setNetworkStatus("online");
        console.log("🌐 Network status: Online (navigator.onLine)");
      } else {
        setNetworkStatus("offline");
        console.log("🌐 Network status: Offline (navigator.onLine)");
      }
    };

    // Initial check
    checkNetworkStatus();

    // Listen for online/offline events
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

    // Also do a periodic fetch test as backup
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
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Camera is now handled directly in startInterviewProcess for instant startup

  // Ensure video element gets the stream when both are available
  useEffect(() => {
    if (cameraStream && videoRef.current) {
      console.log("🎥 Setting video stream to element");
      videoRef.current.srcObject = cameraStream;

      // Use safe video play function
      if (videoRef.current) {
        safeVideoPlay(videoRef.current);
      }

      // Initialize computer vision when video is ready (only once)
      if (videoRef.current && isCVModelLoaded && !cvInitializedRef.current) {
        console.log("🔍 Initializing computer vision detection");
        initializeComputerVision(videoRef.current);
        cvInitializedRef.current = true;
      }

      // Ensure video is on when we have a stream
      if (!isVideoOn) {
        console.log("🎥 Auto-enabling video since we have camera stream");
        setIsVideoOn(true);
      }
    }
  }, [
    cameraStream,
    isVideoOn,
    safeVideoPlay,
    isCVModelLoaded,
    initializeComputerVision,
  ]);

  // Additional effect to ensure video is displayed when interview starts
  useEffect(() => {
    if (isInterviewStarted && cameraStream && videoRef.current) {
      console.log(
        "🎥 Interview started with camera stream - ensuring video display"
      );
      videoRef.current.srcObject = cameraStream;
      setIsVideoOn(true);
      safeVideoPlay(videoRef.current);

      // Initialize computer vision if not already done
      if (isCVModelLoaded && !cvInitializedRef.current) {
        console.log("🔍 Initializing computer vision for interview");
        initializeComputerVision(videoRef.current);
        cvInitializedRef.current = true;
      }
    }
  }, [
    isInterviewStarted,
    cameraStream,
    safeVideoPlay,
    isCVModelLoaded,
    initializeComputerVision,
  ]);

  // Handle speech recognition updates
  useEffect(() => {
    if (speechTranscript && !speechDisabled) {
      setFinalTranscript(speechTranscript);
      // Update the session transcript and user answer (text input area)
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

  // Auto-end interview function (called when time expires or 18 questions reached)
  const handleAutoEndInterview = async () => {
    console.log(
      "⏰ Auto-ending interview (time expired or 18 questions reached)"
    );

    if (interviewId) {
      try {
        await interviewRealtimeApi.endInterview(interviewId);

        // Clear all interview-related localStorage data
        clearInterviewLocalStorage();

        // Stop proctoring
        stopProctoring();

        // Show success message
        toast.success("Interview completed successfully!");

        // Redirect to dashboard with completion status
        router.push("/dashboard?interviewCompleted=true");
      } catch (error) {
        console.error("Error auto-ending interview:", error);

        // Clear localStorage even if API call fails
        clearInterviewLocalStorage();

        // Stop proctoring
        stopProctoring();

        // Still redirect even if there's an error
        router.push("/dashboard?interviewCompleted=true");
      }
    } else {
      // Clear localStorage even if no interview ID
      clearInterviewLocalStorage();

      // Stop proctoring
      stopProctoring();

      // Redirect to dashboard even if no interview ID
      router.push("/dashboard?interviewCompleted=true");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getCurrentTimestamp = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const addMessageToChat = (
    type: "ai" | "user",
    message: string,
    questionId?: string,
    answer?: string,
    analysis?: AnswerAnalysis
  ) => {
    const newMessage = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: getCurrentTimestamp(),
      questionId,
      answer,
      analysis,
    };
    setChatMessages((prev) => [...prev, newMessage]);

    // Scroll to bottom of chat
    setTimeout(() => {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop =
          chatMessagesRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleChatMessageClick = (message: any) => {
    if (message.type === "ai" && message.questionId) {
      // Show question in left panel
      setCurrentQuestion({
        questionId: message.questionId,
        question: message.message,
        category: "Interview Question",
        difficulty: "medium",
        expectedAnswer: "User should provide a relevant answer",
      });

      // Clear all speech recognition data when clicking on a question
      setCurrentSessionTranscript("");
      setSpeechText("");
      setInterimTranscript("");
      setFinalTranscript("");
      resetSpeechTranscript();
    } else if (message.type === "user" && message.answer) {
      // Show user's answer in left panel
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

  const handleGuidelinesComplete = async () => {
    setIsGuidelinesModalOpen(false);

    // Check if this is the first time starting an interview
    const hasSeenWarning = localStorage.getItem("interview-warning-seen");
    if (!hasSeenWarning) {
      setShowInitialWarningModal(true);
    } else {
      await startInterviewProcess();
    }
  };

  const startInterviewProcess = async () => {
    setIsInterviewStarted(true);

    // Start the 45-minute timer
    setInterviewStartTime(new Date());
    setTimeRemaining(45 * 60); // Reset to 45 minutes

    // Start camera immediately if permissions were already granted
    if (permissionsGrantedInGuidelines) {
      console.log(
        "🎥 Starting camera immediately (permissions already granted)"
      );
      setCameraPermission("granted"); // Skip pending state
      await requestCameraPermission();
    }

    // Start the real interview process
    await startRealInterview();

    // Save state when interview starts
    setTimeout(() => {
      saveCurrentState();
    }, 1000); // Small delay to ensure all state is set
  };

  const handleInitialWarningComplete = async () => {
    setShowInitialWarningModal(false);
    localStorage.setItem("interview-warning-seen", "true");
    await startInterviewProcess();
  };

  const startRealInterview = async () => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        console.error("User not authenticated. Redirecting to login...");
        router.push("/");
        return;
      }

      // Camera is already started in startInterviewProcess if permissions were granted
      console.log("🎥 Interview real process started");

      // Get interview ID from URL params or create a new interview
      const interviewIdParam = searchParams.get("interviewId");

      if (interviewIdParam) {
        setInterviewId(interviewIdParam);
        // Generate first question
        await generateFirstQuestion(interviewIdParam);
      } else {
        // Create new interview first (this would need to be implemented)
        console.log("Creating new interview...");
        // For now, we'll need to handle this case properly
        console.error("No interview ID provided. Cannot start interview.");
        setError(
          "No interview ID provided. Please start the interview from the dashboard."
        );
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
      console.log(
        "🎯 Generating first question via WebSocket for interview:",
        interviewId
      );

      // Wait for WebSocket connection to be established
      let attempts = 0;
      const maxAttempts = 10; // Wait up to 5 seconds (10 * 500ms)

      while (!isSocketConnected && attempts < maxAttempts) {
        console.warn(
          `⚠️ WebSocket not connected, waiting... (attempt ${
            attempts + 1
          }/${maxAttempts})`
        );
        if (attempts === 0) {
          toast.info("Connecting to server...");
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
        attempts++;
      }

      if (!isSocketConnected) {
        throw new Error(
          "Failed to connect to server. Please check your connection."
        );
      }

      console.log("✅ WebSocket connected, requesting first question...");
      // Call WebSocket method to generate first question
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

  const streamQuestion = async (questionText: string) => {
    setIsStreaming(true);
    setStreamingText("");

    // Simulate streaming by adding characters one by one
    for (let i = 0; i <= questionText.length; i++) {
      setStreamingText(questionText.slice(0, i));
      await new Promise((resolve) => setTimeout(resolve, 30)); // 30ms delay between characters
    }

    setIsStreaming(false);

    // Auto-enable Start Answering when question streaming ends
    console.log(
      "🎤 Question streaming completed, ready for user to start answering"
    );
  };

  const streamQuestionToBoth = async (
    questionText: string,
    questionId: string
  ) => {
    setIsStreaming(true);
    setStreamingText("");

    // Create a temporary message for streaming in chat
    const tempMessageId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempMessageId,
      type: "ai" as const,
      message: "",
      timestamp: getCurrentTimestamp(),
      questionId,
    };

    // Add temporary message to chat
    setChatMessages((prev) => [...prev, tempMessage]);

    // Simulate streaming by adding characters one by one
    for (let i = 0; i <= questionText.length; i++) {
      const currentText = questionText.slice(0, i);
      setStreamingText(currentText);

      // Update the temporary message in chat
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessageId ? { ...msg, message: currentText } : msg
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 30)); // 30ms delay between characters
    }

    setIsStreaming(false);
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !interviewId || !userAnswer.trim()) return;

    try {
      console.log("📤 Submitting answer via WebSocket...");
      setIsSubmittingAnswer(true);
      setIsAnalyzing(true);
      stopProctoring();

      // Stop speech recognition when submitting answer
      if (isRecording) {
        console.log("🎤 Stopping speech recognition on answer submission");
        handleStopRecording();
      }

      // Add user answer to chat BEFORE submitting (to avoid state issues)
      const answerText = userAnswer; // Capture current answer
      addMessageToChat(
        "user",
        answerText,
        currentQuestion.questionId,
        answerText
      );

      // Clear the answer input immediately
      setUserAnswer("");

      // Submit via WebSocket
      submitAnswerWS(
        currentQuestion.questionId,
        answerText, // Use captured answer
        {
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
        }
      );

      console.log("✅ Answer submission request sent via WebSocket");
    } catch (error) {
      console.error("Error submitting answer:", error);
      setIsSubmittingAnswer(false);
      setIsAnalyzing(false);
    }
  };

  const handleToggleVideo = () => {
    if (isVideoOn) {
      // Turn off video
      if (cameraStream) {
        const videoTrack = cameraStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = false;
        }
      }
      setIsVideoOn(false);
    } else {
      // Turn on video
      if (cameraStream) {
        const videoTrack = cameraStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = true;
        }
        setIsVideoOn(true);
      } else {
        // Request camera permission if no stream
        requestCameraPermission();
      }
    }
  };

  const handleToggleMic = () => {
    if (cameraStream) {
      const audioTrack = cameraStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
      }
    }
    setIsMicOn(!isMicOn);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleStartRecording = async () => {
    setIsRecording(true);
    setSpeechDisabled(false); // Enable speech processing
    setIsAISpeaking(false); // AI stops speaking when user starts

    // Request microphone permission first
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

    // Clear previous transcripts for new session
    setInterimTranscript("");
    setFinalTranscript("");
    setSpeechText("");
    setCurrentSessionTranscript("");
    setSpeechRecognitionError(null);

    // Start interview session with auto-restart and heartbeat
    if (isSpeechSupported && startSpeechInterviewSession) {
      console.log("🎤 Starting interview session with auto-restart");
      await startSpeechInterviewSession();
    } else {
      console.log(
        "🎤 Speech recognition not supported, recording without transcription"
      );
    }
  };

  const handleStopRecording = () => {
    console.log("🎤 Stopping interview session and speech recognition");
    setIsRecording(false);
    setSpeechDisabled(true); // Disable speech processing
    setIsAISpeaking(true); // AI starts speaking when user stops

    // Stop interview session - this disables auto-restart and heartbeat
    if (isSpeechSupported && stopSpeechInterviewSession) {
      console.log("🎤 Stopping interview session - disabling auto-restart");
      stopSpeechInterviewSession();
    }

    // Force reset listening state immediately
    setIsListening(false);

    // Clear all speech recognition data and UI immediately
    setSpeechText("");
    setInterimTranscript("");
    setFinalTranscript("");
    setShowSubtitles(false);

    // Clear subtitle timer
    if (subtitleTimerRef.current) {
      clearTimeout(subtitleTimerRef.current);
      subtitleTimerRef.current = null;
    }

    // Keep the accumulated transcript in text area (already set via useEffect)
    console.log(
      "🎤 Interview session stopped, transcript preserved in text area:",
      currentSessionTranscript
    );
  };

  // Handle listening state changes
  const handleListeningChange = (listening: boolean) => {
    console.log("🎤 Listening state changed:", listening);
  };

  // Show subtitles when interim transcript changes (for subtitle display)
  useEffect(() => {
    if (webkitInterimTranscript && !speechDisabled) {
      setShowSubtitles(true);
      console.log("🎤 Interim transcript updated:", webkitInterimTranscript);
    }
  }, [webkitInterimTranscript, speechDisabled]);

  // Handle subtitle timer separately to avoid infinite loops
  useEffect(() => {
    if (webkitInterimTranscript && !speechDisabled) {
      // Clear existing timer
      if (subtitleTimerRef.current) {
        clearTimeout(subtitleTimerRef.current);
      }

      // Set new timer to hide subtitles after 2 seconds of silence
      subtitleTimerRef.current = setTimeout(() => {
        setShowSubtitles(false);
        console.log("🎤 Subtitles hidden after 2 seconds of silence");
      }, 2000);
    }
  }, [webkitInterimTranscript, speechDisabled]);

  // Camera functions
  const requestCameraPermission = async () => {
    try {
      // Skip pending state if permissions were already granted for faster startup
      if (!permissionsGrantedInGuidelines) {
        setCameraPermission("pending");
      }
      console.log("🎥 Requesting camera permission...");

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }

      // Reduced timeout for faster startup (5 seconds instead of 10)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Camera request timeout")), 5000);
      });

      const streamPromise = navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: true,
      });

      const stream = (await Promise.race([
        streamPromise,
        timeoutPromise,
      ])) as MediaStream;
      console.log("🎥 Camera permission granted, stream received:", stream);

      setCameraStream(stream);
      setCameraPermission("granted");
      setIsVideoOn(true);

      // Immediately set up the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        safeVideoPlay(videoRef.current);
      }

      // Set the video stream to the video element with multiple retry attempts
      const setupVideo = (retryCount = 0) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("🎥 Video element updated with stream");

          // Use safe video play function
          safeVideoPlay(videoRef.current);

          // Add event listeners for debugging
          videoRef.current.onloadedmetadata = () => {
            console.log("🎥 Video metadata loaded");
          };
          videoRef.current.oncanplay = () => {
            console.log("🎥 Video can play");
          };
          videoRef.current.onerror = (e) => {
            console.error("🎥 Video error:", e);
          };
        } else if (retryCount < 2) {
          console.log(`🎥 Video ref is null! Retrying ${retryCount + 1}/2...`);
          setTimeout(() => {
            setupVideo(retryCount + 1);
          }, 100); // Faster retry for instant startup
        } else {
          console.error("🎥 Video element not available after 2 retries");
        }
      };

      setupVideo();
    } catch (error) {
      console.error("🎥 Camera permission error:", error);
      setCameraPermission("denied");
      // Keep the modal open to allow retry
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setIsVideoOn(false);
    }
  };

  const handleStartInterview = () => {
    setIsInterviewStarted(true);
  };

  const handleTestCamera = async () => {
    try {
      console.log("🎥 Testing camera from guidelines modal...");
      setCameraPermission("pending");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: true,
      });

      console.log("🎥 Camera test successful, stream received:", stream);
      setCameraStream(stream);
      setCameraPermission("granted");
      setCameraTested(true);
      setIsVideoOn(true);

      // Set the video stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        safeVideoPlay(videoRef.current);
      }

      // Stop the stream after a short test
      setTimeout(() => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        setCameraStream(null);
        setIsVideoOn(false);
        console.log("🎥 Camera test completed, stream stopped");
      }, 3000); // Test for 3 seconds
    } catch (error) {
      console.error("🎥 Camera test failed:", error);
      setCameraPermission("denied");
      setCameraTested(false);
    }
  };

  // Function to display all CV detection points in console
  const displayCVDetectionPoints = () => {
    console.log("🔍 === COMPUTER VISION DETECTION POINTS ===");
    console.log(`📊 Total Detection Points: ${cvDetectionPoints.length}`);

    if (cvDetectionPoints.length === 0) {
      console.log("No detection points recorded yet.");
      return;
    }

    // Group by violation type
    const violations = cvDetectionPoints.filter((point) => point.violation);
    const normal = cvDetectionPoints.filter((point) => !point.violation);

    console.log(`✅ Normal Detections: ${normal.length}`);
    console.log(`⚠️ Violation Detections: ${violations.length}`);

    if (violations.length > 0) {
      console.log("\n🚨 VIOLATION DETECTIONS:");
      violations.forEach((point, index) => {
        console.log(
          `${index + 1}. [${point.timestamp.toLocaleTimeString()}] ${
            point.violationType
          }`
        );
        console.log(
          `   - People: ${point.peopleCount}, Devices: ${point.phoneCount}`
        );
      });
    }

    // Show recent detections (last 10)
    console.log("\n📈 RECENT DETECTIONS (Last 10):");
    const recentPoints = cvDetectionPoints.slice(-10);
    recentPoints.forEach((point, index) => {
      const status = point.violation ? "🚨 VIOLATION" : "✅ NORMAL";
      console.log(
        `${index + 1}. [${point.timestamp.toLocaleTimeString()}] ${status}`
      );
      console.log(
        `   - People: ${point.peopleCount}, Devices: ${point.phoneCount}`
      );
      if (point.violationType) {
        console.log(`   - Type: ${point.violationType}`);
      }
    });

    console.log("🔍 === END DETECTION POINTS ===");
  };

  // Helper function to clear all interview-related localStorage data
  const clearInterviewLocalStorage = () => {
    clearInterviewState(); // Use the utility function from interview-persistence
    cvInitializedRef.current = false; // Reset computer vision initialization flag

    // Clear persistent cheating status for this interview
    if (interviewId) {
      localStorage.removeItem(`cheating-detected-${interviewId}`);
    }

    // Reset computer vision violations
    setCvViolations({
      multiplePersonIncidents: 0,
      phoneDetections: 0,
      totalViolations: 0,
      violations: [],
    });

    // Reset detection points
    setCvDetectionPoints([]);

    // Reset persistent cheating status
    setPersistentCheatingDetected(false);
  };

  const handleEndInterview = async () => {
    try {
      // Check if interview was terminated
      if (warningStatus.isTerminated) {
        console.log("🚫 Interview was terminated, ending via API...");

        // Still call API to properly end the terminated interview
        if (interviewId) {
          try {
            await interviewRealtimeApi.endInterview(interviewId);
            console.log("✅ Terminated interview ended successfully via API");
          } catch (error) {
            console.error("❌ Error ending terminated interview:", error);
          }
        }

        // Clear all interview-related localStorage data
        clearInterviewLocalStorage();

        // Stop proctoring
        stopProctoring();

        router.push("/dashboard?interviewTerminated=true");
        return;
      }

      // Normal interview ending
      if (interviewId) {
        console.log("🛑 Ending interview via API...", interviewId);

        // Show loading state
        setIsGeneratingQuestion(true);

        try {
          const response = await interviewRealtimeApi.endInterview(interviewId);
          console.log("✅ Interview ended successfully via API:", response);

          // Clear all interview-related localStorage data
          clearInterviewLocalStorage();

          // Stop proctoring
          stopProctoring();

          // Show success message
          toast.success("Interview ended successfully!");

          // Redirect to dashboard with completion status
          router.push("/dashboard?interviewCompleted=true");
        } catch (error) {
          console.error("❌ Error ending interview:", error);

          // Show error message to user
          const errorMessage =
            "Failed to end interview properly, but you can still exit.";
          setError(errorMessage);
          toast.error(errorMessage);

          // Clear localStorage even if API call fails
          clearInterviewLocalStorage();

          // Stop proctoring
          stopProctoring();

          // Still redirect even if there's an error, but with error status
          setTimeout(() => {
            router.push("/dashboard?interviewCompleted=true&error=endFailed");
          }, 2000);
        } finally {
          setIsGeneratingQuestion(false);
        }
      } else {
        console.log(
          "⚠️ No interview ID found, clearing localStorage and redirecting..."
        );

        // Clear localStorage even if no interview ID
        clearInterviewLocalStorage();

        // Stop proctoring
        stopProctoring();

        router.push("/dashboard?interviewCompleted=true");
      }
    } catch (error) {
      console.error("❌ Unexpected error in handleEndInterview:", error);
      setError("An unexpected error occurred while ending the interview.");

      // Clear localStorage and redirect as fallback
      clearInterviewLocalStorage();
      stopProctoring();

      setTimeout(() => {
        router.push("/dashboard?interviewCompleted=true&error=unexpected");
      }, 2000);
    }
  };

  // Tab switch detection
  useEffect(() => {
    if (!isInterviewStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs or minimized window - increment count
        setTabSwitchCount((prevCount) => {
          const newCount = prevCount + 1;
          // Reset warning shown flag for new count
          setWarningShownForCurrentCount(false);

          // Immediately save to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "interview-tab-switch-count",
              newCount.toString()
            );
          }

          return newCount;
        });
      }
      // When user returns to tab, the separate useEffect will handle modal display
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to leave? Your interview will be cancelled.";
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
    if (
      tabSwitchCount === 1 &&
      isInterviewStarted &&
      !warningShownForCurrentCount
    ) {
      setShowTabSwitchModal(true);
      setWarningShownForCurrentCount(true);
    } else if (tabSwitchCount >= 2 && isInterviewStarted) {
      // Tab switch ending is disabled for now - will be enabled later with specific count threshold
      // handleEndInterview(); // DISABLED FOR NOW
    }
  }, [tabSwitchCount, isInterviewStarted, warningShownForCurrentCount]);

  const confirmExitInterview = async () => {
    setShowExitConfirm(false);

    // Call the proper end interview function that makes the API call
    await handleEndInterview();
  };

  const cancelExitInterview = () => {
    setShowExitConfirm(false);
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    setShowThemeMenu(false);
  };

  // Handle hint toggle with smooth scrolling
  const handleHintToggle = async () => {
    // Only fetch hint when showing it (not when hiding)
    if (!showHint) {
      // Validate that we have a current question
      if (!currentQuestion || !interviewId) {
        toast.error("No active question available");
        return;
      }

      // SECURITY: Capture the current question ID at the moment of click
      // This prevents any manipulation during the async operation
      const currentQuestionId = currentQuestion.questionId;
      const currentInterviewId = interviewId;

      // Fetch expected answer from backend when showing hint
      try {
        // Get token from cookies
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth_token="))
          ?.split("=")[1];

        if (!token) {
          toast.error("Authentication required");
          return;
        }

        // IMPORTANT: Use the captured questionId - no user input, no manipulation possible
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
            // Double verification: returned question must match the captured questionId
            if (data.data.questionId === currentQuestionId) {
              setCurrentQuestionData({
                question: data.data.question,
                answer: data.data.expectedAnswer,
              });
              console.log(
                "✅ AI Copilot hint loaded for question:",
                currentQuestionId
              );
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

    // Scroll to question section when hint is shown
    if (!showHint && questionSectionRef.current) {
      setTimeout(() => {
        questionSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  const handleWarningModalClose = async () => {
    setShowWarningModal(false);

    // If interview was terminated, redirect to dashboard
    if (warningStatus.isTerminated) {
      router.push("/dashboard?interviewTerminated=true");
      return;
    }

    // If there's a pending next question, show it now
    if (pendingNextQuestion) {
      setCurrentQuestion(pendingNextQuestion);
      setQuestionNumber(questionNumber + 1);
      setUserAnswer("");
      setAnswerAnalysis(null);
      setPendingNextQuestion(null);

      // Clear all speech recognition data for new question
      setCurrentSessionTranscript("");
      setSpeechText("");
      setInterimTranscript("");
      setFinalTranscript("");
      resetSpeechTranscript();

      // Stream the next question to both chat and left panel
      await streamQuestionToBoth(
        pendingNextQuestion.question,
        pendingNextQuestion.questionId
      );

      // Continue proctoring for next question (don't reset - preserve violations)
      if (!isProctoring) {
        startProctoring();
      }
    }
  };

  if (!isClient || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Interview
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we prepare your interview...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen w-screen overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"
      }`}>
      {/* Guidelines Modal */}
      <InterviewGuidelinesModal
        isOpen={isGuidelinesModalOpen}
        onStartInterview={handleGuidelinesComplete}
        onTestCamera={handleTestCamera}
        cameraTested={cameraTested}
        onPermissionsGranted={handlePermissionsGranted}
      />

      {/* Initial Warning Modal */}
      <InitialWarningModal
        isOpen={showInitialWarningModal}
        onClose={handleInitialWarningComplete}
      />

      {/* Warning Modal */}
      <WarningModal
        isOpen={showWarningModal}
        onClose={handleWarningModalClose}
        warningData={warningData}
        warningStatus={warningStatus}
      />

      {/* Tab Switch Warning Modal */}
      <AnimatePresence>
        {showTabSwitchModal && tabSwitchCount === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => {
              setShowTabSwitchModal(false);
            }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 relative ${
                isDarkMode
                  ? "bg-slate-800/95 backdrop-blur-sm border-yellow-500"
                  : "bg-white/95 backdrop-blur-sm border-yellow-500"
              }`}>
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowTabSwitchModal(false);
                }}
                className={`absolute top-4 right-4 p-2 rounded-full hover:bg-opacity-20 transition-colors ${
                  isDarkMode ? "hover:bg-white" : "hover:bg-gray-200"
                }`}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
              <div className="text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isDarkMode ? "bg-yellow-500/20" : "bg-yellow-100"
                  }`}>
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}>
                  Warning!
                </h3>
                <p
                  className={`mb-6 ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}>
                  You are not allowed to switch tabs during the interview.
                  Please stay focused on the interview tab to ensure a smooth
                  experience.
                </p>
                <div
                  className={`p-4 rounded-lg mb-6 ${
                    isDarkMode
                      ? "bg-yellow-500/10 border border-yellow-500/30"
                      : "bg-yellow-50 border border-yellow-200"
                  }`}>
                  <p
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-yellow-400" : "text-yellow-600"
                    }`}>
                    ⚠️ Tab switches detected: {tabSwitchCount}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowTabSwitchModal(false);
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg">
                    I Understand - Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <div
        className={`h-16 px-6 flex items-center justify-between border-b ${
          isDarkMode
            ? "bg-slate-800/90 backdrop-blur-sm border-slate-700"
            : "bg-white/90 backdrop-blur-sm border-slate-200"
        }`}>
        {/* Left Side - Alert & Warning Status Indicators */}
        <div className="flex items-center space-x-3 flex-1">
          {/* Proctoring Status */}

          {/* Tab Switch Monitor */}
          {isInterviewStarted && (
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                tabSwitchCount > 0
                  ? isDarkMode
                    ? "bg-yellow-900/30 border border-yellow-700"
                    : "bg-yellow-50 border border-yellow-200"
                  : isDarkMode
                  ? "bg-green-900/30 border border-green-700"
                  : "bg-green-50 border border-green-200"
              }`}>
              <AlertTriangle
                className={`w-4 h-4 animate-pulse ${
                  tabSwitchCount > 0 ? "text-yellow-500" : "text-green-500"
                }`}
              />
              <div className="flex items-center space-x-1">
                <span
                  className={`text-xs ${
                    tabSwitchCount > 0 ? "text-yellow-400" : "text-green-400"
                  }`}>
                  Tabs Switches :
                </span>
                <span
                  className={`text-sm font-bold ${
                    tabSwitchCount > 0 ? "text-yellow-500" : "text-green-500"
                  }`}>
                  {tabSwitchCount}
                </span>
              </div>
            </div>
          )}

          {/* Computer Vision Loading Indicator */}
          {isInterviewStarted && isCVLoading && (
            <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="flex flex-col">
                <span className="text-xs text-blue-400 font-light tracking-tight">
                  Proctoring
                </span>
                <span className="text-xs font-light text-blue-500">
                  Initializing...
                </span>
              </div>
            </div>
          )}

          {/* Professional Cheating Detection Monitor */}
          {isInterviewStarted && isCVModelLoaded && !isCVLoading && (
            <div
              onClick={displayCVDetectionPoints}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer hover:scale-105 ${
                persistentCheatingDetected
                  ? isDarkMode
                    ? "bg-red-900/30 border border-red-700"
                    : "bg-red-50 border border-red-200"
                  : isDarkMode
                  ? "bg-green-900/30 border border-green-700"
                  : "bg-green-50 border border-green-200"
              }`}
              title="Click to view all CV detection points in console">
              {persistentCheatingDetected ? (
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-red-400">Cheating :</span>
                    <span className="text-sm font-bold text-red-500">
                      Detected
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-green-400">Proctoring :</span>
                    <span className="text-sm font-bold text-green-500">
                      Normal
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Middle Section - User Details */}
        <div className="flex-1 flex justify-center">
          <div
            className={`flex items-center space-x-6 px-4 py-2 rounded-lg ${
              isDarkMode
                ? "bg-slate-700/50 border border-slate-600"
                : "bg-slate-100/50 border border-slate-200"
            }`}>
            {/* Experience Level */}
            <div className="text-center">
              <div
                className={`text-xs font-medium ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}>
                Experience
              </div>
              <div
                className={`text-sm font-semibold ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}>
                Senior
              </div>
            </div>

            {/* Divider */}
            <div
              className={`w-px h-8 ${
                isDarkMode ? "bg-slate-600" : "bg-slate-300"
              }`}></div>

            {/* Job Level */}
            <div className="text-center">
              <div
                className={`text-xs font-medium ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}>
                Level
              </div>
              <div
                className={`text-sm font-semibold ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}>
                L5
              </div>
            </div>

            {/* Divider */}
            <div
              className={`w-px h-8 ${
                isDarkMode ? "bg-slate-600" : "bg-slate-300"
              }`}></div>

            {/* Job Title */}
            <div className="text-center">
              <div
                className={`text-xs font-medium ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}>
                Position
              </div>
              <div
                className={`text-sm font-semibold ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}>
                Full Stack Developer
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Timer, Warning, End Interview, and Profile Icon */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          {/* Timer */}
          <div
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              timeRemaining < 300
                ? isDarkMode
                  ? "bg-red-900/30 border border-red-700"
                  : "bg-red-50 border border-red-200"
                : isDarkMode
                ? "bg-slate-700/50 border border-slate-600"
                : "bg-slate-100/50 border border-slate-200"
            }`}>
            <Timer
              className={`w-4 h-4 ${
                timeRemaining < 300
                  ? "text-red-500"
                  : isDarkMode
                  ? "text-slate-300"
                  : "text-slate-600"
              }`}
            />
            <div className="text-center">
              <div
                className={`text-sm font-bold ${
                  timeRemaining < 300
                    ? "text-red-500"
                    : isDarkMode
                    ? "text-slate-200"
                    : "text-slate-800"
                }`}>
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>

          {/* Warning Indicator */}
          {warningStatus.warningCount > 0 && !warningStatus.isTerminated && (
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                warningStatus.warningCount === 1
                  ? isDarkMode
                    ? "bg-yellow-900/30 border border-yellow-700"
                    : "bg-yellow-50 border border-yellow-200"
                  : isDarkMode
                  ? "bg-red-900/30 border border-red-700"
                  : "bg-red-50 border border-red-200"
              }`}>
              <AlertTriangle
                className={`w-4 h-4 animate-pulse ${
                  warningStatus.warningCount === 1
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              />
              <div className="flex items-center space-x-1">
                <span
                  className={`text-xs ${
                    warningStatus.warningCount === 1
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}>
                  Warning :
                </span>
                <span
                  className={`text-sm font-bold ${
                    warningStatus.warningCount === 1
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}>
                  {warningStatus.warningCount}
                </span>
              </div>
            </div>
          )}

          {/* End Interview Button */}
          <div className="relative">
            <button
              onClick={() => setShowExitConfirm(true)}
              disabled={isGeneratingQuestion}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 group ${
                isGeneratingQuestion ? "opacity-50 cursor-not-allowed" : ""
              } ${
                isDarkMode
                  ? "bg-red-700/50 hover:bg-red-600/50 text-red-300 border border-red-600"
                  : "bg-red-100/50 hover:bg-red-200/50 text-red-600 border border-red-200"
              }`}
              title="Exit Interview">
              <PhoneOff className="w-4 h-4" />
              <span className="text-sm font-medium">End</span>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Exit Interview
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interview Interface */}
      <div className="h-[calc(100vh-4rem)] w-full flex bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Left Panel - Main Interview Area */}
        <div className="w-[70%] flex flex-col">
          {/* Video Area */}
          <div className="flex-1 px-4 pt-4 min-h-0">
            <div className="h-full flex flex-col min-h-0">
              {/* Main Video Area */}
              <div className="flex-1 mb-6 min-h-0">
                <div
                  className={`h-full relative rounded-2xl overflow-hidden shadow-2xl ${
                    isDarkMode
                      ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
                      : "bg-gradient-to-br from-slate-50 via-white to-slate-50"
                  } ${
                    warningStatus.warningCount > 0 &&
                    !warningStatus.isTerminated
                      ? warningStatus.warningCount === 1
                        ? "warning-border-yellow"
                        : "warning-border-red"
                      : ""
                  }`}>
                  {cameraStream ? (
                    <div className="w-full h-full relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        style={{ transform: "scaleX(-1)" }}
                        onLoadedMetadata={() => {
                          console.log("🎥 Video metadata loaded in element");
                          if (videoRef.current) {
                            safeVideoPlay(videoRef.current);
                          }
                        }}
                        onCanPlay={() => {
                          console.log("🎥 Video can play in element");
                          if (videoRef.current) {
                            safeVideoPlay(videoRef.current);
                          }
                        }}
                        onLoadedData={() => {
                          console.log("🎥 Video data loaded");
                          if (videoRef.current) {
                            safeVideoPlay(videoRef.current);
                          }
                        }}
                        onError={(e) =>
                          console.error("🎥 Video error in element:", e)
                        }
                      />

                      {/* Subtitle Overlay - Shows at bottom center of video */}
                      {showSubtitles &&
                        webkitInterimTranscript &&
                        !speechDisabled && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                            <p className="text-white text-lg font-medium text-center leading-relaxed">
                              {webkitInterimTranscript}
                            </p>
                          </motion.div>
                        )}

                      {/* Hint Overlay */}
                      <AnimatePresence>
                        {showHint && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute inset-6 flex items-center justify-center pointer-events-auto">
                            <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1, duration: 0.2 }}
                              className={`max-w-3xl mx-4 p-6 rounded-2xl shadow-2xl ${
                                isDarkMode
                                  ? "bg-black/30 text-white backdrop-blur-sm border border-white/20"
                                  : "bg-white/30 text-slate-900 backdrop-blur-sm border border-black/20"
                              }`}>
                              <div className="flex items-center justify-between mb-3">
                                <h3
                                  className={`text-lg font-semibold flex items-center space-x-2 ${
                                    isDarkMode
                                      ? "text-yellow-300"
                                      : "text-yellow-600"
                                  }`}>
                                  <Eye className="w-5 h-5 animate-pulse" />
                                  <span>AI Copilot Assistant</span>
                                </h3>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setShowHint(false)}
                                  className={`p-1 rounded-full transition-colors ${
                                    isDarkMode
                                      ? "hover:bg-white/20 text-white/80 hover:text-white"
                                      : "hover:bg-black/20 text-slate-600 hover:text-slate-900"
                                  }`}>
                                  <X className="w-4 h-4" />
                                </motion.button>
                              </div>
                              <div
                                className={`text-sm leading-relaxed mb-3 ${
                                  isDarkMode
                                    ? "text-white/90"
                                    : "text-slate-800"
                                }`}>
                                {currentQuestionData.answer}
                              </div>
                              <div className="flex items-center justify-between">
                                <div
                                  className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${
                                    isDarkMode
                                      ? "bg-yellow-500/30 text-yellow-200"
                                      : "bg-yellow-200/50 text-yellow-800"
                                  }`}>
                                  <span>🤖</span>
                                  <span>AI Assistant</span>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setShowHint(false)}
                                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                    isDarkMode
                                      ? "bg-white/20 hover:bg-white/30 text-white"
                                      : "bg-black/20 hover:bg-black/30 text-slate-800"
                                  }`}>
                                  Got it
                                </motion.button>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div
                      className={`w-full h-full flex flex-col items-center justify-center ${
                        isDarkMode ? "bg-slate-800" : "bg-slate-100"
                      }`}>
                      {cameraPermission === "denied" ? (
                        <>
                          <VideoOff
                            className={`w-16 h-16 mb-4 ${
                              isDarkMode ? "text-red-400" : "text-red-500"
                            }`}
                          />
                          <h3
                            className={`text-lg font-semibold mb-2 ${
                              isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Camera Access Denied
                          </h3>
                          <p
                            className={`text-sm text-center mb-4 ${
                              isDarkMode ? "text-slate-300" : "text-slate-600"
                            }`}>
                            Please enable camera access to continue with the
                            interview.
                          </p>
                          <button
                            onClick={() => requestCameraPermission()}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                              isDarkMode
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}>
                            Enable Camera
                          </button>
                        </>
                      ) : !isVideoOn ? (
                        <>
                          <VideoOff
                            className={`w-16 h-16 mb-4 ${
                              isDarkMode ? "text-slate-400" : "text-slate-500"
                            }`}
                          />
                          <h3
                            className={`text-lg font-semibold mb-2 ${
                              isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Camera is Off
                          </h3>
                          <p
                            className={`text-sm text-center mb-4 ${
                              isDarkMode ? "text-slate-300" : "text-slate-600"
                            }`}>
                            Click the video button to turn on your camera.
                          </p>
                          <button
                            onClick={handleToggleVideo}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                              isDarkMode
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}>
                            Turn On Camera
                          </button>
                        </>
                      ) : null}
                    </div>
                  )}

                  {/* Recording Indicator */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-white text-xs bg-red-500 px-2 py-1 rounded">
                        REC
                      </span>
                    </div>
                  )}

                  {/* Transparent Interviewer Info Overlay */}
                  {isInterviewStarted && (
                    <div className="absolute top-4 left-4 flex items-center space-x-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/10">
                      {/* AI Profile Image */}
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                        <Image
                          src={AiImage}
                          alt="AI Interviewer"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Interviewer Info */}
                      <div className="text-white">
                        <div className="text-sm font-medium">Samantha Lee</div>
                        <div className="text-xs opacity-80">
                          Total Interviews: 12
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Start Answering Button - Bottom Left */}
                  <div className="absolute bottom-4 left-4">
                    {!isRecording ? (
                      <motion.button
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStartRecording}
                        disabled={isSpeechInitializing}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 font-bold text-xs shadow-lg ${
                          isSpeechInitializing
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white hover:shadow-blue-500/25"
                        }`}>
                        <Play className="w-4 h-4" />
                        <span>
                          {isSpeechInitializing
                            ? "Initializing..."
                            : "Start Answering (10 min)"}
                        </span>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStopRecording}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl transition-all duration-300 font-bold text-xs shadow-lg hover:shadow-red-500/25">
                        <Square className="w-4 h-4" />
                        <span>
                          {isListening ? "Stop Listening" : "Stop Answering"}
                        </span>
                      </motion.button>
                    )}
                  </div>

                  {/* Speech Recognition Error Display - Completely hidden during interview mode */}
                  {false && speechRecognitionError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-20 left-4 right-4 bg-red-500/90 backdrop-blur-sm rounded-lg p-3 border border-red-400/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-white" />
                          <p className="text-white text-sm font-medium">
                            {speechRecognitionError}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={retrySpeechRecognition}
                          className="flex items-center space-x-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md transition-all duration-200 text-xs font-medium">
                          <RotateCcw className="w-3 h-3" />
                          <span>Retry</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* View Hint Button - Top Right */}
                  <div className="absolute top-4 right-4 z-10">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleHintToggle}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 shadow-lg backdrop-blur-md ${
                        showHint
                          ? isDarkMode
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-yellow-900 shadow-yellow-500/25 hover:shadow-yellow-500/40"
                            : "bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900 shadow-yellow-400/25 hover:shadow-yellow-400/40"
                          : isDarkMode
                          ? "bg-slate-800/80 text-white border border-slate-600/50 hover:bg-slate-700/80 hover:border-slate-500/50"
                          : "bg-white/80 text-slate-800 border border-slate-200/50 hover:bg-slate-50/80 hover:border-slate-300/50"
                      }`}>
                      <Eye
                        className={`w-4 h-4 ${showHint ? "animate-pulse" : ""}`}
                      />
                      <span className="font-bold">
                        {showHint ? "Hide Copilot" : "AI Copilot"}
                      </span>
                    </motion.button>
                  </div>

                  {/* AI Speaking Indicator - Bottom Right */}
                  <div className="absolute bottom-4 right-4 flex flex-col items-center">
                    {/* AI Profile Picture */}
                    <button
                      onClick={() => setShowAIModal(!showAIModal)}
                      className="w-20 h-20 rounded-full border-2 border-white hover:scale-105 transition-all duration-200 overflow-hidden mb-2 shadow-lg">
                      <Image
                        src={AiImage}
                        alt="AI Interviewer"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    {/* Speaking/Listening Button */}
                    <div
                      className={`text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1 shadow-lg transition-all duration-300 ${
                        isAnalyzing
                          ? "bg-blue-600 animate-pulse"
                          : isRecording
                          ? "bg-slate-700"
                          : "bg-slate-600"
                      }`}>
                      <Mic
                        className={`w-3 h-3 ${
                          isListening ? "animate-pulse" : ""
                        }`}
                      />
                      <span>
                        {isAnalyzing
                          ? "Analyzing..."
                          : isRecording
                          ? isListening
                            ? "Listening..."
                            : "Preparing..."
                          : "Speaking..."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input Area */}
          <div className="px-4 pb-4">
            <div
              className={`relative rounded-2xl shadow-lg transition-all duration-300 ${
                isDarkMode
                  ? "bg-slate-800/90 border border-slate-600/30 focus-within:border-blue-500/50"
                  : "bg-white/90 border border-slate-300/30 focus-within:border-blue-500/50"
              } ${
                userAnswer.trim()
                  ? isDarkMode
                    ? "ring-2 ring-green-500/30 border-green-500/50 bg-slate-800/95"
                    : "ring-2 ring-green-500/30 border-green-500/50 bg-white/95"
                  : ""
              } ${
                isRecording && isListening
                  ? "ring-2 ring-blue-500/30 border-blue-500/50"
                  : ""
              }`}>
              <div className="px-2">
                {/* Content Indicator */}
                {userAnswer.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center justify-between px-2 py-1 mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        ✨ Answer ready to send
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {userAnswer.length} characters
                    </div>
                  </motion.div>
                )}

                {/* Input Field */}
                <div className="pr-20">
                  <textarea
                    placeholder={
                      isGeneratingQuestion
                        ? "Generating question..."
                        : isRecording
                        ? "Your speech will appear here... Click 'Send & Stop' to submit and stop recording..."
                        : "Type your answer here or click 'Start Answering' to speak..."
                    }
                    rows={4}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={
                      isGeneratingQuestion ||
                      isSubmittingAnswer ||
                      !currentQuestion
                    }
                    className={`w-full text-sm resize-none focus:outline-none transition-all duration-300 py-3 px-2 leading-relaxed ${
                      isDarkMode
                        ? "bg-transparent text-white placeholder-slate-400"
                        : "bg-transparent text-slate-900 placeholder-slate-500"
                    } ${
                      isGeneratingQuestion ||
                      isSubmittingAnswer ||
                      !currentQuestion
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    } ${
                      isRecording && isListening
                        ? "border-l-4 border-blue-500 pl-2"
                        : ""
                    }`}
                  />
                </div>

                {/* Send Button - Bottom Right */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitAnswer}
                  disabled={
                    isGeneratingQuestion ||
                    isSubmittingAnswer ||
                    !currentQuestion ||
                    !userAnswer.trim()
                  }
                  className={`absolute bottom-3 right-3 px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center space-x-1 font-bold ${
                    isGeneratingQuestion ||
                    isSubmittingAnswer ||
                    !currentQuestion ||
                    !userAnswer.trim()
                      ? "opacity-50 cursor-not-allowed bg-slate-500"
                      : userAnswer.trim()
                      ? isDarkMode
                        ? "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 shadow-lg hover:shadow-green-500/25"
                        : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 shadow-lg hover:shadow-green-500/25"
                      : isDarkMode
                      ? "bg-blue-500/10 border border-blue-400 text-blue-400 hover:bg-blue-500/20 hover:border-blue-300 hover:text-blue-300"
                      : "bg-blue-500/10 border border-blue-500 text-blue-500 hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-400"
                  }`}>
                  {isSubmittingAnswer ? (
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-xs font-bold">
                        {isRecording ? "Send & Stop" : "Send"}
                      </span>
                      <Send className="w-3 h-3" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Transcript */}
        <div
          className={`w-[30%] flex flex-col ${
            isDarkMode
              ? "bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-md border-l border-slate-700/50"
              : "bg-gradient-to-b from-white/95 to-slate-50/95 backdrop-blur-md border-l border-slate-200/50"
          }`}>
          {/* Panel Header */}

          {/* Chat Messages */}
          <div
            ref={chatMessagesRef}
            className={`flex-1 p-6 space-y-4 overflow-y-auto min-h-0 ${
              isDarkMode ? "bg-slate-900/20" : "bg-slate-50/20"
            }`}>
            {chatMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}>
                <div
                  className={`flex items-start space-x-3 max-w-[100%] ${
                    message.type === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                  onClick={() => handleChatMessageClick(message)}>
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                      message.type === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                        : isDarkMode
                        ? "bg-gradient-to-br from-slate-700 to-slate-800"
                        : "bg-gradient-to-br from-slate-100 to-slate-200"
                    }`}>
                    {message.type === "ai" ? (
                      <Bot
                        className={`w-5 h-5 ${
                          isDarkMode ? "text-slate-300" : "text-slate-600"
                        }`}
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`flex-1 min-w-0 ${
                      message.type === "user" ? "text-right" : "text-left"
                    }`}>
                    {/* Header with name and timestamp */}
                    <div
                      className={`flex items-center space-x-2 mb-2 ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}>
                      <span
                        className={`text-xs font-semibold ${
                          message.type === "user"
                            ? "text-blue-500"
                            : isDarkMode
                            ? "text-slate-300"
                            : "text-slate-600"
                        }`}>
                        {message.type === "ai" ? "AI Interviewer" : "You"}
                      </span>
                      <span
                        className={`text-xs ${
                          isDarkMode ? "text-slate-500" : "text-slate-500"
                        }`}>
                        {message.timestamp}
                      </span>
                      {/* Message type badges */}
                      <div
                        className={`flex space-x-1 ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}>
                        {message.questionId && (
                          <span
                            className={`text-xs px-2 py-1 rounded-lg font-medium ${
                              isDarkMode
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-blue-100 text-blue-700"
                            }`}>
                            Q
                          </span>
                        )}
                        {message.answer && (
                          <span
                            className={`text-xs px-2 py-1 rounded-lg font-medium ${
                              isDarkMode
                                ? "bg-green-500/20 text-green-400"
                                : "bg-green-100 text-green-700"
                            }`}>
                            A
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Message text */}
                    <div
                      className={`text-sm leading-relaxed break-words ${
                        message.type === "user"
                          ? isDarkMode
                            ? "text-blue-200"
                            : "text-blue-800"
                          : isDarkMode
                          ? "text-slate-200"
                          : "text-slate-700"
                      } ${
                        message.type === "user" ? "text-left" : "text-left"
                      }`}>
                      {message.message}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Modal */}
      <AnimatePresence>
        {showAIModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border-2 ${
                isDarkMode
                  ? "bg-slate-800/90 backdrop-blur-sm border-slate-600"
                  : "bg-white/90 backdrop-blur-sm border-slate-200"
              }`}>
              <div className="text-center">
                <div
                  className={`w-24 h-24 rounded-full border-4 shadow-2xl mx-auto mb-4 overflow-hidden ${
                    isDarkMode ? "border-slate-600" : "border-slate-300"
                  }`}>
                  <Image
                    src={AiImage}
                    alt="AI Interviewer"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}>
                  AI Interviewer
                </h3>
                <p
                  className={`mb-6 ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}>
                  Hello! I'm your AI interviewer. I'll guide you through this
                  interview process, ask questions, and provide feedback on your
                  answers. I'm here to make this experience as helpful and
                  realistic as possible.
                </p>
                <div className="space-y-3">
                  <div
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      isDarkMode
                        ? "bg-slate-700/90 backdrop-blur-sm"
                        : "bg-slate-100/90 backdrop-blur-sm"
                    }`}>
                    <span
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      }`}>
                      Status:
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        isRecording
                          ? "text-green-500"
                          : isDarkMode
                          ? "text-slate-300"
                          : "text-slate-700"
                      }`}>
                      {isRecording
                        ? "Listening to your answer..."
                        : "Ready to speak..."}
                    </span>
                  </div>
                  <div
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      isDarkMode
                        ? "bg-slate-700/90 backdrop-blur-sm"
                        : "bg-slate-100/90 backdrop-blur-sm"
                    }`}>
                    <span
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      }`}>
                      Current Question:
                    </span>
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                      }`}>
                      Question {questionNumber}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIModal(false)}
                  className={`mt-6 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isDarkMode
                      ? "bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-600 hover:to-slate-700"
                      : "bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-600 hover:to-slate-700"
                  }`}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 ${
                isDarkMode
                  ? "bg-slate-800/90 backdrop-blur-sm border-slate-600"
                  : "bg-white/90 backdrop-blur-sm border-slate-200"
              }`}>
              <div className="text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isDarkMode ? "bg-red-500/20" : "bg-red-100"
                  }`}>
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}>
                  Are you sure to end the interview?
                </h3>
                <p
                  className={`mb-6 ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}>
                  If you end the interview now, you won't be able to continue
                  this interview again.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={cancelExitInterview}
                    className={`flex-1 px-4 py-3 border-2 rounded-xl transition-all duration-200 font-medium ${
                      isDarkMode
                        ? "border-slate-600 text-slate-300 hover:bg-slate-700/90 backdrop-blur-sm"
                        : "border-slate-300 text-slate-700 hover:bg-slate-100/90 backdrop-blur-sm"
                    }`}>
                    No
                  </button>
                  <button
                    onClick={confirmExitInterview}
                    disabled={isGeneratingQuestion}
                    className={`flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg ${
                      isGeneratingQuestion
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}>
                    {isGeneratingQuestion ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Ending...</span>
                      </div>
                    ) : (
                      "Yes, Sure"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewPage;
