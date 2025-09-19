"use client";

import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import InterviewGuidelinesModal from "@/components/interview/interview-guidelines-modal";
import StreamingText from "@/components/ui/streaming-text";
import { useProctoring } from "@/hooks/useProctoring";
import {
  interviewRealtimeApi,
  InterviewQuestion,
  AnswerAnalysis,
  ProctoringData,
} from "@/lib/api/interview-realtime";
import Image from "next/image";

const InterviewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(true);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
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

  // Proctoring
  const {
    proctoringData,
    startProctoring,
    stopProctoring,
    resetProctoring,
    isProctoring,
  } = useProctoring();
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

  // Get interview type from URL params
  useEffect(() => {
    setIsClient(true);
    const type = searchParams.get("type") || "resume";
    setInterviewType(type);
  }, [searchParams]);

  // Timer countdown with automatic interview ending
  useEffect(() => {
    if (isInterviewStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up! End interview automatically
            handleAutoEndInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isInterviewStarted, timeRemaining]);

  // Auto-end interview function
  const handleAutoEndInterview = async () => {
    if (interviewId) {
      try {
        await interviewRealtimeApi.endInterview(interviewId);
        // Redirect to dashboard with completion status
        router.push("/dashboard?interviewCompleted=true");
      } catch (error) {
        console.error("Error auto-ending interview:", error);
        // Still redirect even if there's an error
        router.push("/dashboard?interviewCompleted=true");
      }
    } else {
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
    } else if (message.type === "user" && message.answer) {
      // Show user's answer in left panel
      setCurrentQuestionData({
        question: "Your Answer",
        answer: message.answer,
      });
    }
  };

  const handleGuidelinesComplete = async () => {
    setIsGuidelinesModalOpen(false);
    setIsInterviewStarted(true);

    // Start the 45-minute timer
    setInterviewStartTime(new Date());
    setTimeRemaining(45 * 60); // Reset to 45 minutes

    // Start the real interview process
    await startRealInterview();
  };

  const startRealInterview = async () => {
    try {
      // Get interview ID from URL params or create a new interview
      const interviewIdParam = searchParams.get("interviewId");

      if (interviewIdParam) {
        setInterviewId(interviewIdParam);
        // Generate first question
        await generateFirstQuestion(interviewIdParam);
      } else {
        // Create new interview first (this would need to be implemented)
        console.log("Creating new interview...");
      }
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  };

  const generateFirstQuestion = async (interviewId: string) => {
    try {
      setIsGeneratingQuestion(true);

      const response = await interviewRealtimeApi.generateFirstQuestion(
        interviewId,
        {
          interviewerBio: "AI Interviewer", // This will be overridden by backend with actual interviewer data
        }
      );

      if (response.success) {
        setCurrentQuestion(response.data.question);
        setQuestionNumber(response.data.questionNumber);

        // Start streaming the question to both chat and left panel
        await streamQuestionToBoth(
          response.data.question.question,
          response.data.question.questionId
        );

        // Start proctoring
        startProctoring();
      }
    } catch (error) {
      console.error("Error generating first question:", error);
    } finally {
      setIsGeneratingQuestion(false);
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
      setIsSubmittingAnswer(true);
      stopProctoring();

      const response = await interviewRealtimeApi.submitAnswer(
        interviewId,
        currentQuestion.questionId,
        {
          answer: userAnswer,
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

      if (response.success) {
        // Add user answer to chat
        addMessageToChat(
          "user",
          userAnswer,
          currentQuestion.questionId,
          userAnswer
        );

        // Store analysis but don't show in chat
        if (response.data.analysis) {
          setAnswerAnalysis(response.data.analysis);
        }

        // Move to next question if available
        if (response.data.nextQuestion) {
          setCurrentQuestion(response.data.nextQuestion);
          setQuestionNumber(response.data.questionNumber);
          setUserAnswer("");
          setAnswerAnalysis(null);

          // Stream the next question to both chat and left panel
          await streamQuestionToBoth(
            response.data.nextQuestion.question,
            response.data.nextQuestion.questionId
          );

          // Reset proctoring for next question
          resetProctoring();
          startProctoring();
        } else {
          // Interview completed
          setIsInterviewStarted(false);
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleToggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsAISpeaking(false); // AI stops speaking when user starts
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsAISpeaking(true); // AI starts speaking when user stops
  };

  const handleEndInterview = async () => {
    if (interviewId) {
      try {
        await interviewRealtimeApi.endInterview(interviewId);
        // Redirect to dashboard with completion status
        router.push("/dashboard?interviewCompleted=true");
      } catch (error) {
        console.error("Error ending interview:", error);
        // Still redirect even if there's an error
        router.push("/dashboard?interviewCompleted=true");
      }
    } else {
      // Redirect to dashboard even if no interview ID
      router.push("/dashboard?interviewCompleted=true");
    }
  };

  const confirmExitInterview = () => {
    setIsInterviewStarted(false);
    setShowExitConfirm(false);
    router.push("/dashboard");
  };

  const cancelExitInterview = () => {
    setShowExitConfirm(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setShowThemeMenu(false);
  };

  const handleThemeChange = (theme: "light" | "dark") => {
    setIsDarkMode(theme === "dark");
    setShowThemeMenu(false);
  };

  // Handle hint toggle with smooth scrolling
  const handleHintToggle = () => {
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

  if (!isClient) {
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
        isDarkMode ? "bg-slate-900" : "bg-slate-50"
      }`}>
      {/* Guidelines Modal */}
      <InterviewGuidelinesModal
        isOpen={isGuidelinesModalOpen}
        onStartInterview={handleGuidelinesComplete}
      />

      {/* Main Interview Interface */}
      <div className="h-full w-full flex">
        {/* Left Panel - Main Interview Area */}
        <div
          className={`w-[70%] flex flex-col ${
            isDarkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          } border-r`}>
          {/* Interview Header */}
          <div
            className={`border-b px-6 py-4 flex-shrink-0 ${
              isDarkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-slate-200"
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}>
                  Samantha Lee
                </h2>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}>
                  Total Interviews Taken: 12
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold flex items-center space-x-2 ${
                      isDarkMode ? "text-slate-200" : "text-slate-800"
                    }`}>
                    <Timer className="w-6 h-6" />
                    <span>{formatTime(timeRemaining)}</span>
                  </div>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-slate-500" : "text-slate-500"
                    }`}>
                    Time remaining
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Area */}
          <div className="flex-1 p-6 min-h-0">
            <div className="h-full flex flex-col min-h-0">
              {/* Main Video Area - Single Large Video */}
              <div className="flex-1 mb-6 min-h-0">
                <div
                  className={`xl:h-[55vh] relative rounded-lg overflow-hidden border ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600"
                      : "bg-slate-100 border-slate-300"
                  }`}>
                  {isVideoOn ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={CandidateImage}
                        alt="Candidate"
                        fill
                        className="object-cover"
                      />

                      {/* Live Transcription Overlay */}
                      {liveTranscription && (
                        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-4">
                          <p className="text-white text-sm leading-relaxed">
                            {liveTranscription}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        isDarkMode ? "bg-slate-700" : "bg-slate-100"
                      }`}>
                      <VideoOff
                        className={`w-16 h-16 ${
                          isDarkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      />
                    </div>
                  )}

                  {/* Recording Indicator */}
                  {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-white text-xs bg-red-500 px-2 py-1 rounded">
                        REC
                      </span>
                    </div>
                  )}

                  {/* Start Answering Button - Bottom Left */}
                  <div className="absolute bottom-4 left-4 text-sm">
                    {!isRecording ? (
                      <button
                        onClick={handleStartRecording}
                        className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-all duration-200 font-medium text-sm">
                        <Play className="w-4 h-4" />
                        <span>Start Answering</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleStopRecording}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium text-sm">
                        <Square className="w-4 h-4" />
                        <span>Stop Answering</span>
                      </button>
                    )}
                  </div>
                  {/* AI Speaking Indicator - Bottom Right */}
                  <div className="absolute bottom-0 right-4 flex flex-col items-center">
                    {/* AI Profile Picture - Clickable Modal Trigger */}
                    <button
                      onClick={() => setShowAIModal(!showAIModal)}
                      className="w-20 h-20 rounded-full border-2 border-white hover:scale-105 transition-all duration-200 overflow-hidden mb-2">
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
                      className={`text-white px-3 py-1.5 rounded text-xs font-medium flex items-center space-x-1 ${
                        isRecording ? "bg-slate-700" : "bg-slate-600"
                      }`}>
                      <Mic className="w-3 h-3" />
                      <span>
                        {isRecording ? "Listening..." : "Speaking..."}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  ref={questionSectionRef}
                  className={`rounded-lg p-6 border my-4 flex-shrink-0 ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-slate-200"
                  }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`text-lg font-semibold ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}>
                      Question {questionNumber}
                    </h3>
                    <div
                      className={`flex items-center space-x-2 text-sm ${
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                      }`}>
                      <Clock className="w-4 h-4" />
                      <span>2 min</span>
                    </div>
                  </div>
                  <div
                    className={`text-base leading-relaxed mb-4 ${
                      isDarkMode ? "text-slate-200" : "text-slate-700"
                    }`}>
                    {isStreaming ? (
                      <StreamingText
                        text={streamingText}
                        speed={30}
                        className="min-h-[2rem]"
                      />
                    ) : currentQuestion ? (
                      currentQuestion.question
                    ) : (
                      currentQuestionData.question
                    )}
                  </div>

                  {/* Show current answer if available */}
                  {currentQuestionData.answer && (
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <h4
                        className={`text-sm font-medium mb-2 ${
                          isDarkMode ? "text-slate-300" : "text-slate-600"
                        }`}>
                        Your Answer:
                      </h4>
                      <div
                        className={`text-sm ${
                          isDarkMode ? "text-slate-200" : "text-slate-700"
                        }`}>
                        {currentQuestionData.answer}
                      </div>
                    </div>
                  )}

                  {/* Hint Section */}
                  {showHint && (
                    <div
                      className={`border rounded-lg p-4 mb-4 ${
                        isDarkMode
                          ? "bg-slate-700 border-slate-600"
                          : "bg-slate-50 border-slate-300"
                      }`}>
                      <h4
                        className={`text-sm font-semibold mb-2 ${
                          isDarkMode ? "text-slate-300" : "text-slate-700"
                        }`}>
                        Answer:
                      </h4>
                      <p
                        className={`text-sm leading-relaxed ${
                          isDarkMode ? "text-slate-300" : "text-slate-600"
                        }`}>
                        {currentQuestionData.answer}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleHintToggle}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isDarkMode
                          ? "bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600"
                          : "bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200"
                      }`}>
                      <Eye className="w-4 h-4" />
                      <span>{showHint ? "Hide hint" : "View hint"}</span>
                    </button>
                    <div
                      className={`flex items-center space-x-2 ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}>
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Rate difficulty</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Question */}

              {/* Action Buttons */}
              <div
                className={`flex items-center justify-between flex-shrink-0 p-4 rounded-lg border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-slate-50 border-slate-200"
                }`}>
                {/* Interview Tags - Left Side */}
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1.5 rounded text-sm font-medium ${
                      isDarkMode
                        ? "bg-slate-700 text-slate-300 border border-slate-600"
                        : "bg-slate-200 text-slate-700 border border-slate-300"
                    }`}>
                    Entry Level
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded text-sm font-medium ${
                      isDarkMode
                        ? "bg-slate-700 text-slate-300 border border-slate-600"
                        : "bg-slate-200 text-slate-700 border border-slate-300"
                    }`}>
                    Frontend
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded text-sm font-medium ${
                      isDarkMode
                        ? "bg-slate-700 text-slate-300 border border-slate-600"
                        : "bg-slate-200 text-slate-700 border border-slate-300"
                    }`}>
                    Easy
                  </span>
                </div>

                {/* End Interview Button - Right Side */}
                <button
                  onClick={handleEndInterview}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 ${
                    isDarkMode
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                  }`}>
                  End Interview
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Transcript */}
        <div
          className={`w-[30%] flex flex-col border-l ${
            isDarkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          }`}>
          {/* Transcript Header */}
          <div
            className={`px-6 py-4 border-b flex-shrink-0 flex items-center justify-between ${
              isDarkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-slate-200"
            }`}>
            {/* Left Side - Text */}
            <div>
              <h3
                className={`text-lg font-semibold mb-1 ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}>
                Interview Transcript
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}>
                Real-time conversation log
              </p>
            </div>

            {/* Right Side - Theme Toggle Button */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className={`p-2 rounded-lg transition-all duration-200 border ${
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 hover:bg-slate-600"
                    : "bg-slate-100 border-slate-300 hover:bg-slate-200"
                }`}>
                <Palette
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                />
              </button>

              {/* Theme Menu */}
              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className={`absolute right-0 top-12 rounded-lg shadow-xl border py-2 z-50 min-w-[120px] ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-slate-200"
                    }`}>
                    <button
                      onClick={() => handleThemeChange("light")}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 transition-colors ${
                        !isDarkMode
                          ? "bg-slate-100 text-slate-700"
                          : "text-slate-300 hover:bg-slate-700"
                      }`}>
                      <Sun className="w-4 h-4" />
                      <span>Light</span>
                    </button>
                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 transition-colors ${
                        isDarkMode
                          ? "bg-slate-100 text-slate-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}>
                      <Moon className="w-4 h-4" />
                      <span>Dark</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatMessagesRef}
            className={`flex-1 p-6 space-y-4 overflow-y-auto min-h-0 ${
              isDarkMode ? "bg-slate-800" : "bg-slate-50"
            }`}>
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}>
                <div
                  className={`max-w-[85%] rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                    message.type === "user"
                      ? isDarkMode
                        ? "bg-blue-600 text-white border border-blue-500 hover:bg-blue-500 shadow-lg"
                        : "bg-blue-600 text-white border border-blue-500 hover:bg-blue-500 shadow-lg"
                      : isDarkMode
                      ? "bg-slate-700 text-slate-200 border border-slate-600 hover:bg-slate-600"
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm"
                  }`}
                  onClick={() => handleChatMessageClick(message)}>
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === "user"
                          ? "bg-blue-500"
                          : isDarkMode
                          ? "bg-slate-600"
                          : "bg-slate-200"
                      }`}>
                      {message.type === "ai" ? (
                        <Bot
                          className={`w-4 h-4 ${
                            isDarkMode ? "text-slate-300" : "text-slate-600"
                          }`}
                        />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`text-sm font-medium ${
                            message.type === "user"
                              ? "text-white"
                              : isDarkMode
                              ? "text-slate-300"
                              : "text-slate-600"
                          }`}>
                          {message.type === "ai" ? "AI Interviewer" : "You"}
                        </span>
                        <span
                          className={`text-xs ${
                            message.type === "user"
                              ? "text-blue-100"
                              : isDarkMode
                              ? "text-slate-500"
                              : "text-slate-500"
                          }`}>
                          {message.timestamp}
                        </span>
                        {message.questionId && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              message.type === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-blue-100 text-blue-800"
                            }`}>
                            Question
                          </span>
                        )}
                        {message.answer && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              message.type === "user"
                                ? "bg-green-500 text-white"
                                : "bg-green-100 text-green-800"
                            }`}>
                            Answer
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-sm leading-relaxed ${
                          message.type === "user"
                            ? "text-white"
                            : isDarkMode
                            ? "text-slate-200"
                            : "text-slate-700"
                        }`}>
                        {message.message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div
            className={`p-6 border-t flex-shrink-0 ${
              isDarkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-slate-200"
            }`}>
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  placeholder={
                    isGeneratingQuestion
                      ? "Generating question..."
                      : "Type your answer here..."
                  }
                  rows={3}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={
                    isGeneratingQuestion ||
                    isSubmittingAnswer ||
                    !currentQuestion
                  }
                  className={`w-full px-4 py-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                  } ${
                    isGeneratingQuestion ||
                    isSubmittingAnswer ||
                    !currentQuestion
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                />
              </div>
              <button
                onClick={handleSubmitAnswer}
                disabled={
                  isGeneratingQuestion ||
                  isSubmittingAnswer ||
                  !currentQuestion ||
                  !userAnswer.trim()
                }
                className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-medium ${
                  isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                } ${
                  isGeneratingQuestion ||
                  isSubmittingAnswer ||
                  !currentQuestion ||
                  !userAnswer.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : "shadow-lg hover:shadow-xl"
                }`}>
                {isSubmittingAnswer ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span className="text-sm">Send</span>
                  </>
                )}
              </button>
            </div>

            {/* Proctoring Status */}
            {isProctoring && (
              <div className="mt-3 flex items-center space-x-4 text-xs text-slate-500">
                <span>
                  Time: {Math.floor(proctoringData.timeSpent / 60)}:
                  {(proctoringData.timeSpent % 60).toString().padStart(2, "0")}
                </span>
                {proctoringData.tabSwitches > 0 && (
                  <span className="text-red-500">
                    Tab Switches: {proctoringData.tabSwitches}
                  </span>
                )}
                {proctoringData.copyPasteCount > 0 && (
                  <span className="text-red-500">
                    Copy/Paste: {proctoringData.copyPasteCount}
                  </span>
                )}
              </div>
            )}
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
              className={`rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl ${
                isDarkMode ? "bg-slate-800" : "bg-white"
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
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isDarkMode ? "bg-slate-700" : "bg-slate-100"
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
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isDarkMode ? "bg-slate-700" : "bg-slate-100"
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
                  className={`mt-6 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                    isDarkMode
                      ? "bg-slate-700 text-white hover:bg-slate-600"
                      : "bg-slate-700 text-white hover:bg-slate-800"
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
              className={`rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl ${
                isDarkMode ? "bg-slate-800" : "bg-white"
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
                  Exit Interview?
                </h3>
                <p
                  className={`mb-6 ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}>
                  Are you sure you want to exit? If you exit now, you won't be
                  able to continue this interview again.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={cancelExitInterview}
                    className={`flex-1 px-4 py-3 border rounded-lg transition-all duration-200 font-medium ${
                      isDarkMode
                        ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                        : "border-slate-300 text-slate-700 hover:bg-slate-100"
                    }`}>
                    Cancel
                  </button>
                  <button
                    onClick={confirmExitInterview}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium">
                    Exit Interview
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
